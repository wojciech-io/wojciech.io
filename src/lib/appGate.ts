// Which sign-in page the password gate of app.wojciech.io shows, and which
// paths it lets through before the password check. Used by
// functions/_middleware.ts; kept apart from it so a unit test can reach it
// without the Workers runtime (the same split as securityHeaders.ts).

/** The generic sign-in page, shown on every path of the gated host. */
export const GENERIC_LOGIN_PAGE = '/login.html';

/** The sign-in screen of the Woody Content Studio, shown on /woody and below it. */
export const WOODY_LOGIN_PAGE = '/woody-login.html';

/**
 * The files the Woody sign-in screen loads. A visitor without the cookie has to
 * be able to fetch them, otherwise the middleware answers the request for a
 * font or a picture with the sign-in page itself, with a 401.
 *
 * Exact paths, not a prefix, on purpose. This project has no 404.html, so
 * Pages answers a path that matches no file with the home page and a 200. A
 * prefix such as /woody-gate/ would therefore hand the private home page to
 * anyone who asks for /woody-gate/anything. Every path here is a real file
 * (src/__tests__/app-gate.test.ts checks that, and that the page asks for
 * nothing that is not listed).
 */
export const WOODY_GATE_FILES: ReadonlySet<string> = new Set([
  '/woody-gate/scene.webp',
  '/woody-gate/forester.webp',
  '/woody-gate/pine.webp',
  '/woody-gate/favicon.svg',
  '/woody-gate/fonts/fraunces-latin-opsz-normal.woff2',
  '/woody-gate/fonts/Geist-Regular.woff2',
  '/woody-gate/fonts/Geist-SemiBold.woff2',
  '/woody-gate/fonts/OFL-Fraunces.txt',
  '/woody-gate/fonts/OFL.txt',
]);

/** `/woody` and `/woody/...` get the Woody screen; `/woodyfoo` and `/woody-login.html` do not. */
export function loginPageFor(pathname: string): string {
  return pathname === '/woody' || pathname.startsWith('/woody/') ? WOODY_LOGIN_PAGE : GENERIC_LOGIN_PAGE;
}

/** A static file of the Woody sign-in screen: public, served without the cookie. */
export function isGateAsset(pathname: string): boolean {
  return WOODY_GATE_FILES.has(pathname);
}
