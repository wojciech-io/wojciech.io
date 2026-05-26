// Canonical XML 1.0 entity escape (5 predefined entities: & < > " ').
// Used on internal MDX content validated by src/content.config.ts. Output
// context is XML element/attribute text, not HTML.
export const escapeXml = (value: string) =>
  // nosemgrep: javascript.audit.detect-replaceall-sanitization.detect-replaceall-sanitization
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
