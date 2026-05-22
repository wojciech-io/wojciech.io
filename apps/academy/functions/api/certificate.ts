import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { currentSession } from '../_utils/session';
import { clientIp, rateLimit } from '../_utils/ratelimit';

interface Env {
  DB?: D1Database;
  AUTH_SECRET?: string;
  RATE_LIMIT?: KVNamespace;
}

const PROGRAM = 'ai-growth-os';
const PROGRAM_TITLE = 'AI Growth OS';
const PROGRAM_EPISODE_COUNT = 36;

// Issues (or re-serves) the program-completion certificate as a PDF. Gated on
// the member having completed every episode in the progress table.
export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const rl = await rateLimit(env.RATE_LIMIT, `academy-cert:${clientIp(request)}`, 20, 600);
  if (!rl.ok) return rl.response!;

  if (!env.DB || !env.AUTH_SECRET) return json({ ok: false, error: 'not-configured' }, 500);

  const session = await currentSession(request, env.AUTH_SECRET);
  if (!session) return json({ ok: false, error: 'unauthorized' }, 401);

  const done = await env.DB.prepare(
    'SELECT COUNT(*) AS done FROM progress WHERE customer_id = ? AND completed_at IS NOT NULL'
  ).bind(session.sub).first<{ done: number }>();

  const completedCount = done?.done ?? 0;
  const ready = completedCount >= PROGRAM_EPISODE_COUNT;

  // ?check=1 → JSON status only, so the dashboard can render readiness without
  // triggering a PDF download.
  if (new URL(request.url).searchParams.get('check') === '1') {
    return json({ ok: true, ready, completed_count: completedCount, required: PROGRAM_EPISODE_COUNT });
  }

  if (!ready) {
    return json({
      ok: false,
      error: 'incomplete',
      completed_count: completedCount,
      required: PROGRAM_EPISODE_COUNT,
    }, 403);
  }

  const customer = await env.DB.prepare(
    'SELECT name FROM customers WHERE id = ?'
  ).bind(session.sub).first<{ name: string | null }>();
  const recipientName = (customer?.name || session.email).trim();

  // Idempotent issue: keep one certificate (and its verification code) per
  // (customer, program). Re-downloads reuse the same code and issue date.
  const existing = await env.DB.prepare(
    'SELECT verification_code, issued_at FROM certificates WHERE customer_id = ? AND program = ?'
  ).bind(session.sub, PROGRAM).first<{ verification_code: string; issued_at: string }>();

  let verificationCode = existing?.verification_code;
  let issuedAt = existing?.issued_at;
  if (!verificationCode) {
    verificationCode = makeVerificationCode();
    issuedAt = new Date().toISOString();
    await env.DB.prepare(
      `INSERT INTO certificates (id, customer_id, program, recipient_name, verification_code, issued_at)
       VALUES (?, ?, ?, ?, ?, ?)
       ON CONFLICT(customer_id, program) DO NOTHING`
    ).bind(`cert_${crypto.randomUUID()}`, session.sub, PROGRAM, recipientName, verificationCode, issuedAt).run();

    // Re-read in case a concurrent request won the insert.
    const settled = await env.DB.prepare(
      'SELECT verification_code, issued_at FROM certificates WHERE customer_id = ? AND program = ?'
    ).bind(session.sub, PROGRAM).first<{ verification_code: string; issued_at: string }>();
    verificationCode = settled?.verification_code || verificationCode;
    issuedAt = settled?.issued_at || issuedAt;
  }

  const pdf = await renderCertificate(recipientName, verificationCode!, issuedAt!);

  return new Response(pdf, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="ai-growth-os-certificate-${verificationCode}.pdf"`,
      'Cache-Control': 'no-store',
    },
  });
};

async function renderCertificate(name: string, code: string, issuedAtIso: string): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const page = doc.addPage([842, 595]); // A4 landscape, points
  const { width, height } = page.getSize();

  const ink = rgb(0.04, 0.04, 0.05);
  const muted = rgb(0.45, 0.45, 0.5);
  const accent = rgb(1, 0.478, 0.11); // --orange #ff7a1c

  const serif = await doc.embedFont(StandardFonts.TimesRoman);
  const serifBold = await doc.embedFont(StandardFonts.TimesRomanBold);
  const sans = await doc.embedFont(StandardFonts.Helvetica);

  const center = (text: string, font: typeof serif, size: number, y: number, color = ink) => {
    const safe = winAnsiSafe(text);
    const w = font.widthOfTextAtSize(safe, size);
    page.drawText(safe, { x: (width - w) / 2, y, size, font, color });
  };

  // Frame.
  page.drawRectangle({ x: 28, y: 28, width: width - 56, height: height - 56, borderColor: ink, borderWidth: 1.5 });
  page.drawRectangle({ x: 22, y: 22, width: width - 44, height: height - 44, borderColor: accent, borderWidth: 0.75 });

  center('AI GROWTH OS', serifBold, 16, height - 96, accent);
  center('CERTYFIKAT UKOŃCZENIA', sans, 11, height - 120, muted);

  center('Zaświadcza się, że', serif, 14, height - 200, muted);
  center(name, serifBold, 34, height - 250, ink);

  center(`ukończył(a) program ${PROGRAM_TITLE} — operacyjną akademię AI dla zespołów B2B SaaS,`, serif, 13, height - 300, ink);
  center(`zaliczając wszystkie ${PROGRAM_EPISODE_COUNT} odcinków i ćwiczenia wdrożeniowe.`, serif, 13, height - 320, ink);

  const issued = new Date(issuedAtIso);
  const dateStr = issued.toLocaleDateString('pl-PL', { day: 'numeric', month: 'long', year: 'numeric' });
  center(`Data wydania: ${dateStr}`, sans, 11, 140, muted);

  // Signature line.
  page.drawLine({ start: { x: width / 2 - 110, y: 112 }, end: { x: width / 2 + 110, y: 112 }, thickness: 0.75, color: ink });
  center('Wojciech Łuszczyński · wojciech.io', sans, 10, 96, muted);

  center(`Kod weryfikacyjny: ${code}`, sans, 9, 56, muted);

  return doc.save();
}

// pdf-lib's StandardFonts only encode WinAnsi (CP1252), which lacks the Polish
// glyphs ł ą ę ś ż ź ć ń. Until a Unicode TTF is bundled and embedded via
// @pdf-lib/fontkit, fold those to their closest ASCII so names never crash the
// renderer. NOTE: this transliterates diacritics — bundle a font to render them.
const PL_FOLD: Record<string, string> = {
  ą: 'a', ć: 'c', ę: 'e', ł: 'l', ń: 'n', ś: 's', ź: 'z', ż: 'z',
  Ą: 'A', Ć: 'C', Ę: 'E', Ł: 'L', Ń: 'N', Ś: 'S', Ź: 'Z', Ż: 'Z',
};

function winAnsiSafe(text: string): string {
  return text.replace(/[ąćęłńśźżĄĆĘŁŃŚŹŻ]/g, (c) => PL_FOLD[c] ?? c);
}

function makeVerificationCode(): string {
  const bytes = new Uint8Array(6);
  crypto.getRandomValues(bytes);
  const hex = [...bytes].map((b) => b.toString(16).padStart(2, '0')).join('').toUpperCase();
  return `AGOS-${hex.slice(0, 4)}-${hex.slice(4, 8)}-${hex.slice(8, 12)}`;
}

function json(obj: unknown, status = 200): Response {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}
