import { describe, it, expect } from 'vitest';
import { OG_IMAGE_WIDTH, OG_IMAGE_HEIGHT } from '../lib/ogImage';

describe('ogImage constants', () => {
  it('OG_IMAGE_WIDTH is standard 1200px', () => {
    expect(OG_IMAGE_WIDTH).toBe(1200);
  });

  it('OG_IMAGE_HEIGHT is standard 630px', () => {
    expect(OG_IMAGE_HEIGHT).toBe(630);
  });

  it('aspect ratio is 1200/630 ≈ 1.905 (close to Facebook/Twitter spec)', () => {
    const ratio = OG_IMAGE_WIDTH / OG_IMAGE_HEIGHT;
    expect(ratio).toBeCloseTo(1.905, 2);
  });
});
