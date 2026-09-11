import { describe, it, expect } from 'vitest';
import { extractJsxAttrs, JSX_TRANSLATABLE_ARRAYS } from '../../scripts/i18n/translate-mdx-pl.mjs';

/**
 * The translator replaces every translatable string in a JSX block with a
 * `__SLOT_N__` placeholder, sends the collected strings to DeepL, and puts the
 * results back. Anything it fails to collect ships in English.
 *
 * The keyed pass only ever matched `attr="value"` and `key: "value"`, so a
 * bare string array had no key in front of each item and was invisible to it.
 * Three Polish articles went out with English `DoDont` bullets, an English
 * `Callout` body and three English `Steps` blocks because of it, all of them
 * rendered text a reader sees.
 */

interface Extraction {
  sanitized: string;
  slots: string[];
}

const extract = extractJsxAttrs as (block: string) => Extraction;

describe('translator JSX extraction', () => {
  it('collects bare strings from a do/dont array', () => {
    const { slots, sanitized } = extract(
      `<DoDont do={['Ship the one thing', 'Treat adjacent requests as a different product']} dont={['Add one more feature']} />`
    );
    expect(slots).toEqual([
      'Ship the one thing',
      'Treat adjacent requests as a different product',
      'Add one more feature',
    ]);
    expect(sanitized).not.toMatch(/Ship the one thing/);
  });

  it('collects bare strings from an items array alongside a keyed attribute', () => {
    const { slots } = extract(
      `<KeyTakeaway title="Post-launch dashboard" items={["Organic sessions", "Assisted conversions"]} />`
    );
    expect(slots).toEqual(['Post-launch dashboard', 'Organic sessions', 'Assisted conversions']);
  });

  it('still collects keyed strings inside an array of objects', () => {
    const { slots } = extract(
      `<Steps items={[{ title: 'Drop a link', body: 'Single URL or CSV.' }]} />`
    );
    expect(slots).toEqual(['Drop a link', 'Single URL or CSV.']);
  });

  it('collects tab labels', () => {
    const { slots } = extract(`<Tabs labels={['What AI changed', 'What it did not change']} />`);
    expect(slots).toEqual(['What AI changed', 'What it did not change']);
  });

  it('leaves non-translatable attributes alone', () => {
    const block = `<Callout type="warning" icon="alert" href="/insights/foo" />`;
    const { slots, sanitized } = extract(block);
    expect(slots).toEqual([]);
    expect(sanitized).toBe(block);
  });

  it('does not double-collect a string the keyed pass already took', () => {
    const { slots } = extract(`<Steps items={[{ title: 'Only once' }]} />`);
    expect(slots).toEqual(['Only once']);
  });

  it('walks nested brackets to the right closing bracket', () => {
    const { slots } = extract(
      `<Grid items={[{ title: 'Outer', tags: ['a nested item here'] }]} /> <Callout title="After the grid" />`
    );
    expect(slots).toContain('Outer');
    expect(slots).toContain('After the grid');
  });

  // DataTable rows are keyed by whatever the columns declare, so the keys are
  // arbitrary and neither pass could see the cells.
  it('collects DataTable row cells despite their arbitrary keys', () => {
    const { slots } = extract(
      `<DataTable columns={[{ key: "test", label: "Test" }]} rows={[{ test: "Frequency", question: "How often does this happen?" }]} />`
    );
    expect(slots).toEqual(['Test', 'Frequency', 'How often does this happen?']);
  });

  it('leaves numbers, identifiers and URLs in row cells alone', () => {
    const { slots } = extract(
      `<DataTable columns={[{ key: "cost", label: "Cost" }]} rows={[{ cost: "1.25", model: "gpt-5.6", notes: "Cheapest for batch work" }]} />`
    );
    expect(slots).toEqual(['Cost', 'Cheapest for batch work']);
  });

  it('covers the array-valued props the components actually take', () => {
    for (const prop of ['do', 'dont', 'items', 'labels', 'rows', 'tabs', 'slides']) {
      expect(JSX_TRANSLATABLE_ARRAYS.has(prop)).toBe(true);
    }
  });
});
