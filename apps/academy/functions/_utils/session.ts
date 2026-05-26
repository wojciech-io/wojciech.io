import { verifySession, type SessionPayload } from './crypto';

export const COOKIE_NAME = 'academy_auth';

export function readCookie(request: Request, name: string): string | null {
  const cookie = request.headers.get('Cookie') || '';
  for (const part of cookie.split(';')) {
    const trimmed = part.trim();
    const eq = trimmed.indexOf('=');
    if (eq >= 0 && trimmed.slice(0, eq) === name) {
      return decodeURIComponent(trimmed.slice(eq + 1));
    }
  }
  return null;
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
