import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const headersContent = readFileSync(resolve('./public/_headers'), 'utf8');

describe('public/_headers', () => {
  it('opts out of FLoC / Topics API via Permissions-Policy', () => {
    const ppLine = headersContent
      .split('\n')
      .find((l) => l.trim().startsWith('Permissions-Policy:'));
    expect(ppLine, 'Permissions-Policy header missing').toBeTruthy();
    expect(ppLine).toContain('interest-cohort=()');
    expect(ppLine).toContain('browsing-topics=()');
  });

  it('disallows camera, microphone, geolocation in Permissions-Policy', () => {
    const ppLine = headersContent
      .split('\n')
      .find((l) => l.trim().startsWith('Permissions-Policy:'))!;
    expect(ppLine).toContain('camera=()');
    expect(ppLine).toContain('microphone=()');
    expect(ppLine).toContain('geolocation=()');
  });

  it('sets Cache-Control for /pagefind/* (search index must revalidate, not be immutable)', () => {
    expect(headersContent).toContain('/pagefind/*');
    const pagefindSection = headersContent.split('/pagefind/*')[1]?.split(/\n\n/)[0] ?? '';
    expect(pagefindSection, 'pagefind Cache-Control missing').toContain('Cache-Control:');
    expect(pagefindSection, 'pagefind must not be immutable').not.toContain('immutable');
    expect(pagefindSection, 'pagefind must revalidate').toMatch(/max-age=0|s-maxage/);
  });

  it('sets HSTS with includeSubDomains and preload', () => {
    expect(headersContent).toContain('Strict-Transport-Security:');
    const hstsLine = headersContent
      .split('\n')
      .find((l) => l.trim().startsWith('Strict-Transport-Security:'))!;
    expect(hstsLine).toContain('includeSubDomains');
    expect(hstsLine).toContain('preload');
    expect(hstsLine).toMatch(/max-age=\d{7,}/);
  });

  it('immutable cache policy only applies to /_astro/*, /og/*, and /fonts/*', () => {
    const lines = headersContent.split('\n');
    let currentPath = '';
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      if (!trimmed.startsWith(' ') && !trimmed.startsWith('\t')) {
        currentPath = trimmed;
      } else if (trimmed.includes('immutable')) {
        expect(
          currentPath,
          `immutable used under unexpected path: ${currentPath}`,
        ).toMatch(/\/_astro\/\*|\/og\/\*|\/fonts\/\*/);
      }
    }
  });
});
