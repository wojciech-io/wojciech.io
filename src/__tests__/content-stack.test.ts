import { describe, it, expect } from 'vitest';
import { STACK } from '../data/stack';

describe('STACK data', () => {
  it('has at least one category', () => {
    expect(STACK.length).toBeGreaterThan(0);
  });

  it.each(STACK)('$name: has non-empty enables text', ({ enables }) => {
    expect(typeof enables).toBe('string');
    expect(enables.length).toBeGreaterThan(20);
  });

  it.each(STACK)('$name: has at least one item', ({ items }) => {
    expect(Array.isArray(items)).toBe(true);
    expect(items.length).toBeGreaterThan(0);
  });

  it.each(STACK)('$name: each item has a non-empty name', ({ items }) => {
    for (const item of items) {
      expect(typeof item.name).toBe('string');
      expect(item.name.length, `item name empty in category`).toBeGreaterThan(0);
    }
  });

  it.each(STACK)('$name: each item has icon or letterMark', ({ items }) => {
    for (const item of items) {
      const hasIdentity = item.icon !== undefined || item.letterMark !== undefined;
      expect(hasIdentity, `${item.name}: needs icon or letterMark`).toBe(true);
    }
  });

  it.each(STACK)('$name: iconColor is 6-char hex if provided', ({ items }) => {
    for (const item of items) {
      if (item.iconColor !== undefined) {
        expect(item.iconColor, `${item.name}: iconColor should be 6-char hex without #`).toMatch(/^[0-9a-fA-F]{6}$/);
      }
    }
  });
});
