import { verifySession } from './_utils/crypto';

interface Env {
  AUTH_SECRET?: string;
}

const COOKIE_NAME = 'academy_auth';

function cookieValue(request: Request, name: string): string | null {
  const cookie = request.headers.get('Cookie') || '';
  const match = cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export const onRequest: PagesFunction<Env> = async ({ request, env, next }) => {
  const url = new URL(request.url);

  if (!url.pathname.startsWith('/app')) return next();
  if (url.pathname.startsWith('/app/public')) return next();

  const token = cookieValue(request, COOKIE_NAME);
  if (token && env.AUTH_SECRET) {
    const session = await verifySession(token, env.AUTH_SECRET);
    if (session) return next();
  }

  const nextPath = encodeURIComponent(url.pathname + url.search);
  return Response.redirect(`${url.origin}/login?next=${nextPath}`, 302);
};
