import { verifySession } from './_utils/crypto';

interface Env {
  AUTH_SECRET?: string;
}

const COOKIE_NAME = 'academy_auth';

// Literal regex on a hard-coded cookie name. If COOKIE_NAME changes, update
// the literal below too.
const COOKIE_RX = /(?:^|;\s*)academy_auth=([^;]+)/;

function cookieValue(request: Request): string | null {
  const cookie = request.headers.get('Cookie') || '';
  const match = cookie.match(COOKIE_RX);
  return match ? decodeURIComponent(match[1]) : null;
}

export const onRequest: PagesFunction<Env> = async ({ request, env, next }) => {
  const url = new URL(request.url);

  if (!url.pathname.startsWith('/app')) return next();
  if (url.pathname.startsWith('/app/public')) return next();

  const token = cookieValue(request);
  if (token && env.AUTH_SECRET) {
    const session = await verifySession(token, env.AUTH_SECRET);
    if (session) return next();
  }

  const nextPath = encodeURIComponent(url.pathname + url.search);
  return Response.redirect(`${url.origin}/login?next=${nextPath}`, 302);
};
