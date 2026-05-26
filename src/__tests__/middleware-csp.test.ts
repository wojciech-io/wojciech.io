import { describe, expect, it } from 'vitest';
import { PUBLIC_SECURITY_HEADERS } from '../../functions/_middleware';

describe('public middleware CSP', () => {
  const csp = PUBLIC_SECURITY_HEADERS['content-security-policy'];

  it('allows the Cal.com inline scheduler on the contact page', () => {
    expect(csp).toContain('https://app.cal.com');
    expect(csp).toContain('https://cal.com');
    expect(csp).toMatch(/script-src[^;]*https:\/\/app\.cal\.com/);
    expect(csp).toMatch(/frame-src[^;]*https:\/\/cal\.com[^;]*https:\/\/app\.cal\.com/);
  });

  it('allows external media used by public pages', () => {
    expect(csp).toMatch(/img-src[^;]*https:\/\/i\.ytimg\.com/);
  });
});
