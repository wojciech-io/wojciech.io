import { verifySession, type SessionPayload } from './crypto';

export const COOKIE_NAME = 'academy_auth';

export function readCookie(request: Request, name: string): string | null {
  const cookie = request.headers.get('Cookie') || '';
  const match = cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`));
  return match ? decodeURIComponent(match[1]) : null;
}

// Returns the verified session for the academy_auth cookie, or null.
export async function currentSession(
  request: Request,
  authSecret: string | undefined,
): Promise<SessionPayload | null> {
  if (!authSecret) return null;
  const token = readCookie(request, COOKIE_NAME);
  if (!token) return null;
  return verifySession(token, authSecret);
}
