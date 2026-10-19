/* Sizing hints for big-number widgets. The stylesheet scales the number to its cell from the
 * character count, so short figures stay large and "85 + 15" never wraps. Anything longer than a
 * short figure (a phrase like "15 of 15 caught") is allowed to wrap and is set smaller. */

const LONG_FROM = 10;

export function figLen(value: string): number {
  return Math.max(3, String(value).trim().length);
}

export function isLong(value: string): boolean {
  return String(value).trim().length >= LONG_FROM;
}
