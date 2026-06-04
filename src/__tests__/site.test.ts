import { describe, it, expect } from 'vitest';
import { SITE } from '../data/site';

describe('SITE constants', () => {
  it('has valid production URL', () => {
    expect(SITE.url).toBe('https://wojciech.io');
  });

  it('has contact email', () => {
    expect(SITE.email).toMatch(/^[^@]+@[^@]+\.[^@]+$/);
  });

  it('social handles are non-empty strings', () => {
    expect(SITE.linkedinHandle.length).toBeGreaterThan(0);
    expect(SITE.twitterHandle.length).toBeGreaterThan(0);
    expect(SITE.githubHandle.length).toBeGreaterThan(0);
  });

  it('ogImage path starts with slash', () => {
    expect(SITE.ogImage).toMatch(/^\//);
  });
});
