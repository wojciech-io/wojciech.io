/** Editorial heading helper.
 *
 * The homepage uses an accent-colored terminal mark at the end of headings
 * (the yellow "." motif). Splitting must be locale-aware: a Japanese heading
 * ends with "。" and a question with "?" / "？" — we color whatever terminal
 * mark is already there instead of forcing a Latin period (which looked wrong
 * after CJK text). If a heading has no terminal punctuation, we append ".".
 *
 * Returns the lead text and the mark to render in the accent color.
 */
export function accentHeading(text: string): { lead: string; mark: string } {
  const m = text.match(/^([\s\S]*?)([.!?。！？؟]?)\s*$/);
  if (!m) return { lead: text, mark: '.' };
  return { lead: m[1], mark: m[2] || '.' };
}
