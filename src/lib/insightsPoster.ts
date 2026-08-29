// Shared "poster wall" theme for the /insights index (EN + PL + AR).
// One system, four confident deep-colour treatments keyed by article category.
// Glow is rendered as a radial-gradient at the call site (CSS blur fails to
// rasterise in headless Chromium, so we never rely on it).

export type PosterTheme = { grad: string; accent: string; glyph: string };

export const posterTheme: Record<string, PosterTheme> = {
  'AI Systems':         { grad: 'linear-gradient(150deg,#3d4d0d 0%,#1c1608 60%,#100c06 100%)', accent: '#ebff00', glyph: '◇' },
  'AI Marketing':       { grad: 'linear-gradient(150deg,#123f5c 0%,#0d1f2e 58%,#08111a 100%)', accent: '#4fc3f7', glyph: '◎' },
  'GTM Architecture':   { grad: 'linear-gradient(150deg,#523009 0%,#22150a 58%,#120c06 100%)', accent: '#f6ad4e', glyph: '⊹' },
  'Operator Playbooks': { grad: 'linear-gradient(150deg,#0a423b 0%,#0d221c 58%,#0a130e 100%)', accent: '#37d9a4', glyph: '⌘' },
  'Products':           { grad: 'linear-gradient(150deg,#301c5e 0%,#1a1030 58%,#110b1c 100%)', accent: '#b498f7', glyph: '▤' },
  default:              { grad: 'linear-gradient(150deg,#2a2a12 0%,#161206 60%,#100c06 100%)', accent: '#ebff00', glyph: '◈' },
};

export const getPoster = (cat?: string): PosterTheme => posterTheme[cat ?? ''] ?? posterTheme.default;
