import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  GENERIC_LOGIN_PAGE,
  WOODY_GATE_FILES,
  WOODY_LOGIN_PAGE,
  isGateAsset,
  loginPageFor,
} from '../lib/appGate';

const appPublic = join(process.cwd(), 'apps/app/public');
const woodyPage = readFileSync(join(appPublic, 'woody-login.html'), 'utf8');
const middleware = readFileSync(join(process.cwd(), 'functions/_middleware.ts'), 'utf8');

describe('app gate: which sign-in page a path gets', () => {
  it.each(['/woody', '/woody/', '/woody/anything', '/woody/a/b'])('%s gets the Woody screen', (path) => {
    expect(loginPageFor(path)).toBe(WOODY_LOGIN_PAGE);
  });

  it.each(['/', '/stack', '/login.html', '/woodyfoo', '/woody-login.html', '/Woody/', '/apps/woody'])(
    '%s keeps the generic page',
    (path) => {
      expect(loginPageFor(path)).toBe(GENERIC_LOGIN_PAGE);
    },
  );

  it('the middleware uses both helpers, so the tests here describe the live gate', () => {
    expect(middleware).toContain("from '../src/lib/appGate'");
    expect(middleware).toContain('loginPageFor(url.pathname)');
    expect(middleware).toContain('isGateAsset(url.pathname)');
  });
});

describe('app gate: the public files of the Woody screen', () => {
  it('lets the listed files through, and nothing next to them', () => {
    expect(isGateAsset('/woody-gate/scene.webp')).toBe(true);
    expect(isGateAsset('/woody-gate/fonts/Geist-Regular.woff2')).toBe(true);
    // not a prefix: this project has no 404.html, so Pages answers an unknown
    // path with the private home page and a 200
    expect(isGateAsset('/woody-gate/')).toBe(false);
    expect(isGateAsset('/woody-gate/anything.png')).toBe(false);
    expect(isGateAsset('/woody-gate/../index.html')).toBe(false);
    expect(isGateAsset('/woody-login.html')).toBe(false);
    expect(isGateAsset('/woody/')).toBe(false);
    expect(isGateAsset('/fonts/Geist-Regular.woff2')).toBe(false);
  });

  it.each([...WOODY_GATE_FILES])('%s is a real file', (path) => {
    expect(existsSync(join(appPublic, path)), `${path} is missing from apps/app/public`).toBe(true);
  });
});

describe('the Woody sign-in screen', () => {
  // The page is served with a 401 and its own CSP (default-src 'self'), and a
  // visitor has no cookie yet. So every file it asks for has to be one the
  // middleware lets through: on the list above, or on its exact-match list.
  // Collected from attributes, css url(...), and the pine, which the script
  // sets as a string.
  const urls = [...woodyPage.matchAll(/(?:src|href)="(\/[^"]*)"|url\((\/[^)]*)\)|'(\/woody-gate\/[^']*)'/g)].map(
    (m) => m[1] ?? m[2] ?? m[3],
  );

  it('asks for the picture, the face, the pine and the fonts', () => {
    expect(urls).toEqual(
      expect.arrayContaining([
        '/woody-gate/scene.webp',
        '/woody-gate/forester.webp',
        '/woody-gate/pine.webp',
        '/woody-gate/fonts/fraunces-latin-opsz-normal.woff2',
        '/woody-gate/fonts/Geist-Regular.woff2',
        '/woody-gate/fonts/Geist-SemiBold.woff2',
      ]),
    );
  });

  it.each([...new Set(urls)])('%s is reachable without the cookie', (url) => {
    const listed = isGateAsset(url);
    // outside the list the middleware only lets exact paths through
    const allowedByMiddleware = middleware.includes(`'${url}'`);
    expect(listed || allowedByMiddleware, `${url} would be answered with the sign-in page`).toBe(true);
    expect(existsSync(join(appPublic, url)), `${url} is missing from apps/app/public`).toBe(true);
  });

  it('loads nothing from another origin (the 401 CSP is default-src self)', () => {
    expect(woodyPage).not.toMatch(/(?:src|href)="https?:\/\//);
    expect(woodyPage).not.toMatch(/url\(\s*['"]?https?:\/\//);
  });

  it('keeps the form wiring of the generic page: ids, endpoint, error role', () => {
    for (const id of ['loginForm', 'pw', 'submitBtn', 'err']) {
      expect(woodyPage).toContain(`id="${id}"`);
    }
    expect(woodyPage).toContain("fetch('/api/auth'");
    expect(woodyPage).toContain('role="alert"');
    expect(woodyPage).toContain('autocomplete="current-password"');
    // the three languages of the generic page
    for (const l of ['pl', 'en', 'it']) expect(woodyPage).toContain(`data-lang="${l}"`);
  });

  it('respects reduced motion', () => {
    expect(woodyPage).toContain('@media (prefers-reduced-motion: reduce)');
    expect(woodyPage).toContain("matchMedia('(prefers-reduced-motion: reduce)')");
  });

  it('has no dashes or en dashes anywhere (copy rule of docs/10-tone-of-voice.md)', () => {
    expect(woodyPage).not.toMatch(/[–—]/);
  });

  it('is not indexable', () => {
    expect(woodyPage).toContain('name="robots" content="noindex,nofollow"');
  });
});
