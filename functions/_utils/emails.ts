// Booking emails in the AI Espresso visual system (see AI_ESPRESSO_VISUAL_STYLE.md):
// warm light field, flat paper modules, lime ONLY as small marks (rules/dots),
// black underlined links (no buttons/chips/dark cards), pill masthead with avatar,
// centered signature footer. All imagery is hosted under /images/email/ so Gmail
// renders it (data-URIs are stripped there); dynamic text is HTML-escaped.

export interface BookingEmailData {
  /** Absolute site origin, e.g. https://wojciech.io — used to build asset + link URLs. */
  base: string;
  name: string;
  guestEmail?: string;
  company?: string;
  meetingName: string;
  minutes: number;
  /** Preformatted, locale-safe display strings built by the caller (Intl). */
  dateLine: string; // "Monday, 7 July 2026"
  timeLine: string; // "09:00 – 09:45"
  tzLine: string; // "CEST · Europe/Warsaw"
  note?: string;
  manageUrl: string;
  /** Google Meet join link, present once the calendar is connected. */
  meetUrl?: string;
  gcalUrl: string;
  outlookUrl: string;
  /** Masthead date, e.g. "4 July 2026". */
  sendDate: string;
}

const C = {
  bg: '#f4f3ef', paperA: '#fffefb', paperB: '#ffffff', limePaper: '#f8f8ea',
  ink: '#080808', body: '#343430', mut: '#64645e', mut2: '#74746e', faint: '#8a8a83',
  border: '#dcdbd3', line: '#ebeae4', avb: '#e3e2dc', lime: '#eaff00',
};
const F = "-apple-system,BlinkMacSystemFont,'SF Pro Text','Inter','Segoe UI',Roboto,Helvetica,Arial,sans-serif";
const FD = "-apple-system,BlinkMacSystemFont,'SF Pro Display','SF Pro Text','Inter','Segoe UI',Roboto,Helvetica,Arial,sans-serif";

/** HTML-escape untrusted text before it enters the email markup. */
export function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

const rule = `<span style="display:inline-block;width:28px;height:3px;background:${C.lime};border-radius:9px;vertical-align:middle;margin-right:10px;"></span>`;
const dot = `<span style="display:inline-block;width:7px;height:7px;background:${C.lime};border-radius:7px;vertical-align:middle;margin:0 9px 2px 0;"></span>`;
const label = (t: string) =>
  `<p style="margin:0 0 13px;font-size:10px;letter-spacing:.11em;text-transform:uppercase;font-weight:600;color:${C.ink};line-height:1.2;">${rule}${t}</p>`;
const link = (h: string, t: string) =>
  `<a href="${h}" style="color:${C.ink};text-decoration:underline;font-weight:600;">${t}</a>`;
const GAP = `<tr><td style="height:12px;line-height:12px;font-size:1px;">&nbsp;</td></tr>`;

type IconKey = 'cal' | 'clock' | 'globe';
const iconFile: Record<IconKey, string> = { cal: 'ic-calendar.png', clock: 'ic-clock.png', globe: 'ic-globe.png' };

function detailRow(base: string, icon: IconKey, main: string, sub: string | undefined, last = false): string {
  const b = last ? '' : `border-bottom:1px solid ${C.line};`;
  return `<tr>
    <td width="30" valign="top" style="padding:12px 0;${b}"><img src="${base}/images/email/${iconFile[icon]}" width="19" height="19" alt="" style="display:block;"></td>
    <td valign="top" style="padding:12px 0 12px 4px;${b}">
      <div style="font-size:15px;line-height:1.4;font-weight:600;color:${C.ink};">${main}</div>
      ${sub ? `<div style="font-size:13px;line-height:1.5;color:${C.mut};margin-top:2px;">${sub}</div>` : ''}
    </td></tr>`;
}

function socCell(href: string, file: string, name: string): string {
  return `<td align="center" valign="top" style="padding:0 14px;"><a href="${href}" style="display:block;text-decoration:none;text-align:center;">
    <img src="${file}" width="22" height="22" alt="" style="display:block;width:22px;height:22px;margin:0 auto 6px;opacity:.86;">
    <span style="display:block;color:#565650;font-size:10px;line-height:1.2;font-weight:500;">${name}</span></a></td>`;
}

interface ShellParts {
  base: string; preheader: string; sendDate: string; deck: string;
  tag: string; title: string; lead: string; rows: string; tray: string; footClose: string;
}

function shell(p: ShellParts): string {
  const av = `${p.base}/images/email/avatar-2026.png`;
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light only"></head>
<body style="margin:0;background:${C.bg};color:${C.ink};font-family:${F};line-height:1.58;">
<div style="display:none;max-height:0;overflow:hidden;">${p.preheader}</div>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:${C.bg};"><tr><td align="center" style="padding:32px 16px 26px;">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;">

  <tr><td style="padding:0 0 16px;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:${C.paperA};border:1px solid ${C.border};border-radius:999px;">
      <tr>
        <td style="padding:9px 18px;font-size:15px;font-weight:600;color:${C.ink};white-space:nowrap;">wojciech<span style="color:#a8a89f;">.io</span></td>
        <td align="right" style="padding:0 9px 0 0;white-space:nowrap;">
          <span style="display:inline-block;vertical-align:middle;margin-right:11px;color:${C.mut2};font-size:12px;font-weight:500;">${p.sendDate}</span>
          <img src="${av}" width="34" height="34" alt="Wojciech Łuszczyński" style="display:inline-block;vertical-align:middle;width:34px;height:34px;border-radius:17px;border:1px solid ${C.avb};">
        </td>
      </tr>
    </table>
    <p style="margin:13px auto 0;max-width:520px;color:${C.mut};font-size:14px;line-height:1.55;text-align:center;">${p.deck}</p>
  </td></tr>

  <tr><td style="background:${C.paperA};border-radius:10px;padding:30px 34px 31px;">
    ${label(p.tag)}
    <h1 style="margin:0 0 13px;font-family:${FD};font-size:31px;line-height:1.13;font-weight:600;letter-spacing:0;color:${C.ink};">${p.title}</h1>
    <p style="margin:0;max-width:520px;font-size:15px;line-height:1.65;color:${C.body};">${p.lead}</p>
  </td></tr>
  ${GAP}

  <tr><td style="background:${C.paperB};border-radius:10px;padding:26px 34px 24px;">
    ${label('Your booking')}
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">${p.rows}</table>
  </td></tr>
  ${GAP}

  <tr><td style="background:${C.limePaper};border-radius:10px;padding:26px 34px 27px;">${p.tray}</td></tr>
  ${GAP}

  <tr><td align="center" style="padding:26px 24px 6px;text-align:center;">
    <img src="${av}" width="44" height="44" alt="Wojciech Łuszczyński" style="display:block;width:44px;height:44px;border-radius:22px;border:1px solid #dddcd4;margin:0 auto 10px;">
    <p style="margin:0 0 4px;font-size:13px;font-weight:600;color:${C.ink};">Wojciech Łuszczyński</p>
    <p style="margin:0 0 8px;font-size:12px;line-height:1.45;color:#5f5f58;">GTM architect and AI-native builder</p>
    <p style="margin:0 auto 16px;max-width:480px;font-size:12px;line-height:1.54;color:${C.mut};">Growth, AI, and GTM systems for SaaS and revenue-focused teams.</p>
    <table role="presentation" align="center" cellspacing="0" cellpadding="0" style="margin:0 auto 10px;"><tr>
      ${socCell('https://www.linkedin.com/in/wojciech-luszczynski/', `${p.base}/images/email/brand-linkedin.png`, 'LinkedIn')}
      ${socCell('https://substack.com/@wojciechluszczynski', `${p.base}/images/email/brand-substack.png`, 'Substack')}
      ${socCell('https://github.com/wojciechluszczynski', `${p.base}/images/email/brand-github.png`, 'GitHub')}
      ${socCell(`${p.base}/meet/`, `${p.base}/images/email/brand-cal.png`, 'Book a call')}
    </tr></table>
    <p style="margin:2px 0 0;font-size:11px;line-height:1.45;color:${C.faint};">${p.footClose}</p>
  </td></tr>

</table></td></tr></table>
</body></html>`;
}

function bookingRows(d: BookingEmailData): string {
  const meetSub = d.meetUrl
    ? `${link(d.meetUrl, 'Join Google Meet')} <span style="color:${C.faint};">— link is in your invite too</span>`
    : 'The join link is in your calendar invite';
  return (
    detailRow(d.base, 'cal', esc(d.dateLine), esc(d.timeLine) + ' · ' + esc(d.tzLine)) +
    detailRow(d.base, 'clock', esc(d.meetingName), `${d.minutes} minutes with Wojciech Łuszczyński`) +
    detailRow(d.base, 'globe', 'Online · Google Meet', meetSub, true)
  );
}

export function confirmationEmail(d: BookingEmailData): { subject: string; html: string } {
  const tray =
    label('Add to your calendar') +
    `<table role="presentation" width="100%" cellspacing="0" cellpadding="0">
      <tr><td style="padding:6px 0;font-size:14.5px;color:${C.body};">${dot}${link(d.gcalUrl, 'Google Calendar')}</td></tr>
      <tr><td style="padding:6px 0;font-size:14.5px;color:${C.body};">${dot}${link(d.outlookUrl, 'Outlook')}</td></tr>
      <tr><td style="padding:6px 0;font-size:14.5px;color:${C.body};">${dot}<span style="color:${C.ink};font-weight:600;">Apple Calendar</span> <span style="color:${C.mut};">— the .ics invite is attached</span></td></tr>
    </table>
    <p style="margin:16px 0 0;font-size:13.5px;line-height:1.6;color:${C.mut};">${dot}${link(d.manageUrl, 'Reschedule or cancel')} &nbsp;·&nbsp; or just reply to this email.</p>`;
  const noteBlock = d.note
    ? `<p style="margin:16px 0 0;font-size:13.5px;line-height:1.6;color:${C.mut};"><span style="color:${C.faint};">Your note — </span>${esc(d.note)}</p>`
    : '';
  const html = shell({
    base: d.base,
    preheader: `You're booked — ${esc(d.meetingName)}, ${esc(d.dateLine)}. Invite attached.`,
    sendDate: d.sendDate,
    deck: 'Your call with Wojciech is confirmed. Details below.',
    tag: 'Booking confirmed',
    title: "You're booked.",
    lead: `${esc(d.name)}, your call is set. The calendar invite is attached — it shows in your own timezone. No pitch deck needed; come with the actual problem and we go from there.`,
    rows: bookingRows(d) + (noteBlock ? `<tr><td colspan="2">${noteBlock}</td></tr>` : ''),
    tray,
    footClose: 'You received this because you booked a call at wojciech.io.',
  });
  return { subject: `Confirmed: ${d.meetingName} · ${d.dateLine}`, html };
}

export function reminderEmail(d: BookingEmailData, lead: 'tomorrow' | 'soon'): { subject: string; html: string } {
  const when = lead === 'tomorrow' ? 'is tomorrow' : 'is coming up soon';
  const tray =
    label('Join & manage') +
    `<table role="presentation" width="100%" cellspacing="0" cellpadding="0">
      <tr><td style="padding:6px 0;font-size:14.5px;color:${C.body};">${dot}<span style="color:${C.ink};font-weight:600;">Join the call</span> <span style="color:${C.mut};">— link is in your calendar invite</span></td></tr>
      <tr><td style="padding:6px 0;font-size:14.5px;color:${C.body};">${dot}${link(d.manageUrl, 'Reschedule or cancel')}</td></tr>
    </table>`;
  const html = shell({
    base: d.base,
    preheader: `Reminder: your call with Wojciech ${when}.`,
    sendDate: d.sendDate,
    deck: 'A quick reminder about your upcoming call.',
    tag: 'Reminder',
    title: `Your call ${when}.`,
    lead: `${esc(d.name)}, your ${d.minutes}-minute ${esc(d.meetingName)} call with Wojciech is coming up. Bring the real problem — if something came up, you can reschedule below.`,
    rows: bookingRows(d),
    tray,
    footClose: 'You received this because you booked a call at wojciech.io.',
  });
  return { subject: `Reminder: ${d.meetingName} · ${d.dateLine}`, html };
}

export function hostEmail(d: BookingEmailData): { subject: string; html: string } {
  const rows =
    detailRow(d.base, 'cal', `${esc(d.dateLine)} · ${esc(d.timeLine)}`, `${esc(d.meetingName)} · ${d.minutes} minutes`) +
    detailRow(d.base, 'clock', esc(d.name), d.company ? esc(d.company) : 'No company given') +
    detailRow(d.base, 'globe', d.guestEmail ? esc(d.guestEmail) : '—',
      d.note ? 'Note — ' + esc(d.note) : 'No note given', true);
  const tray =
    label('Respond') +
    `<p style="margin:0;font-size:14.5px;line-height:1.6;color:${C.body};">${dot}${link(d.guestEmail ? `mailto:${d.guestEmail}` : '#', 'Reply to guest')} &nbsp;·&nbsp; ${link(d.manageUrl, 'View booking')}</p>`;
  const html = shell({
    base: d.base,
    preheader: `New booking: ${esc(d.meetingName)} · ${esc(d.dateLine)} · ${esc(d.name)}.`,
    sendDate: d.sendDate,
    deck: 'A new call was just booked.',
    tag: 'New booking',
    title: `${esc(d.name)} booked a call.`,
    lead: 'Added to your calendar. The guest details are below.',
    rows,
    tray,
    footClose: 'Internal notification · wojciech.io/meet',
  });
  return { subject: `New booking: ${d.meetingName} · ${d.dateLine} · ${d.name}`, html };
}
