import { describe, it, expect } from 'vitest';
import { escapeXml } from '../utils/xml';

describe('escapeXml', () => {
  it('escapes the 5 predefined XML entities', () => {
    expect(escapeXml('&')).toBe('&amp;');
    expect(escapeXml('<')).toBe('&lt;');
    expect(escapeXml('>')).toBe('&gt;');
    expect(escapeXml('"')).toBe('&quot;');
    expect(escapeXml("'")).toBe('&apos;');
  });

  it('escapes multiple occurrences in a single string', () => {
    expect(escapeXml('a & b < c > d')).toBe('a &amp; b &lt; c &gt; d');
  });

  it('leaves plain text unchanged', () => {
    const plain = 'Hello, world! No special chars here.';
    expect(escapeXml(plain)).toBe(plain);
  });

  it('handles empty string', () => {
    expect(escapeXml('')).toBe('');
  });

  it('escapes a realistic article title with an ampersand', () => {
    const title = 'GTM & AI Systems: What Actually Works';
    expect(escapeXml(title)).toBe('GTM &amp; AI Systems: What Actually Works');
  });
});
