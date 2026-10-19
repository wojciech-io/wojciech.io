/* Sizing hints for big-number widgets. Figures come in two sizes, both on the site's heading scale,
 * so the page keeps a small set of type styles: short figures (five characters or fewer) are set
 * large, everything else is set at the smaller size. A phrase like "15 of 15 caught" may wrap. */

const LONG_FROM = 10;
const LARGE_UP_TO = 5;

export function figLen(value: string): number {
  return Math.max(3, String(value).trim().length);
}

export function isLong(value: string): boolean {
  return String(value).trim().length >= LONG_FROM;
}

/** True when a figure of this length can be set at the large size. */
export function isLarge(len: number): boolean {
  return len <= LARGE_UP_TO;
}
