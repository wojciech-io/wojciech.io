import { readFileSync } from 'node:fs';
import { globSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * Guard against the mobile-headline glue bug.
 *
 * Several headlines split two sentences with `<br class="hidden md:block" />`.
 * That break only renders at md and up. On mobile it is display:none, and
 * compressHTML strips the source newline between the two parts, so they render
 * with no space between them: "systems.Then", "shipped,and", "turn.Right".
 *
 * The fix is a space that survives on mobile: either a `<span class="md:hidden">
 * </span>` right before the break, or a literal space right after it. This test
 * fails if any responsive break lacks both, so the bug cannot creep back in.
 *
 * History: hero (#489), then work / ai-systems / 404 / ar-work / ar-ai-systems.
 */

const BREAK = /<br\s+class="[^"]*hidden[^"]*:block[^"]*"\s*\/?>/g;
const MOBILE_SPACE_BEFORE = /<span class="md:hidden">\s<\/span>\s*$/;

describe('responsive <br> headlines keep a space on mobile', () => {
  const files = globSync('src/**/*.astro', { cwd: process.cwd() }).map((f) =>
    join(process.cwd(), f),
  );

  it('finds .astro files to scan', () => {
    expect(files.length).toBeGreaterThan(0);
  });

  for (const file of files) {
    const src = readFileSync(file, 'utf8');
    if (!BREAK.test(src)) continue;
    BREAK.lastIndex = 0;

    let match: RegExpExecArray | null;
    while ((match = BREAK.exec(src)) !== null) {
      const before = src.slice(0, match.index);
      const after = src.slice(match.index + match[0].length);
      const rel = file.slice(process.cwd().length + 1);

      // A space survives compressHTML only when it is adjacent to text, not
      // between two tags. `<br /> GTM` keeps its space (text-leading); the
      // newline in `</span><br />\n<span>` is stripped. So "space after" only
      // counts when it is a literal space immediately followed by a text char,
      // never a newline or a space before another tag.
      const hasSpaceBefore = MOBILE_SPACE_BEFORE.test(before);
      const hasSpaceAfter = /^ [^<\s]/.test(after);

      it(`${rel}: break near "${before.slice(-24).replace(/\s+/g, ' ').trim()}" keeps a mobile space`, () => {
        expect(hasSpaceBefore || hasSpaceAfter).toBe(true);
      });
    }
  }
});
