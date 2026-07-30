#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Generate branded PDF components for LSI Software × GetResponse partnership summary."""

import base64
import os
import sys

BASE = "/Users/wojciech/wojciech.io/.claude/worktrees/interesting-kowalevski-26ae18"
FONT_DIR = os.path.join(BASE, "public/fonts")
AVATAR = os.path.join(BASE, "public/images/email/avatar-2026.png")

def b64(path):
    """Encode file to base64."""
    if not os.path.exists(path):
        print(f"ERROR: File not found: {path}", file=sys.stderr)
        return None
    with open(path, "rb") as f:
        return base64.b64encode(f.read()).decode()

# Load fonts
fonts = {}
font_files = {
    "light": "Geist-Light.woff2",
    "reg": "Geist-Regular.woff2",
    "med": "Geist-Medium.woff2",
    "semi": "Geist-SemiBold.woff2",
    "bold": "Geist-Bold.woff2",
    "mono": "GeistMono-Regular.woff2",
    "monosemi": "GeistMono-SemiBold.woff2",
}

for name, filename in font_files.items():
    path = os.path.join(FONT_DIR, filename)
    fonts[name] = b64(path)
    if fonts[name] is None:
        sys.exit(1)

avatar_b64 = b64(AVATAR)
if avatar_b64 is None:
    sys.exit(1)

print("✓ Fonts and avatar loaded", file=sys.stderr)

def face(family, key, weight):
    return f"@font-face{{font-family:'{family}';font-weight:{weight};font-style:normal;font-display:swap;src:url(data:font/woff2;base64,{fonts[key]}) format('woff2');}}"

FONT_FACES = "".join([
    face("Geist", "light", 300), face("Geist", "reg", 400),
    face("Geist", "med", 500), face("Geist", "semi", 600),
    face("Geist", "bold", 700),
    face("Geist Mono", "mono", 400), face("Geist Mono", "monosemi", 600),
])

# Design tokens
tokens = {
    "bg": "#f4f3ef",
    "surface": "#fffefb",
    "surface-2": "#ecebe4",
    "border": "#dcdbd3",
    "text": "#080808",
    "text-muted": "#52514a",
    "text-dim": "#67665f",
    "accent-cta": "#eaff00",
    "accent-hi": "#000000",
}

# Document HTML
doc_html = f"""<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>LSI Software × GetResponse Partnership</title>
  <style>
    {FONT_FACES}
    * {{ margin: 0; padding: 0; box-sizing: border-box; }}
    html, body {{ font-family: 'Geist', -apple-system, sans-serif; font-size: 11pt; line-height: 1.6; color: {tokens['text']}; background: {tokens['surface']}; }}
    @page {{ size: A4; margin: 26mm 14mm 24mm 14mm; }}
    h1 {{ font-size: 2.25rem; font-weight: 700; line-height: 1.2; margin: 0 0 0.5rem 0; }}
    h2 {{ font-size: 1.5rem; font-weight: 600; margin: 1.5rem 0 0.75rem 0; color: {tokens['accent-hi']}; }}
    h3 {{ font-size: 1.125rem; font-weight: 600; margin: 1rem 0 0.5rem 0; }}
    p {{ margin: 0 0 1rem 0; line-height: 1.7; color: {tokens['text-dim']}; }}
    ul, ol {{ margin: 0 0 1rem 1.5rem; }}
    li {{ margin: 0.5rem 0; line-height: 1.7; color: {tokens['text-dim']}; }}
    .cover {{ min-height: 243mm; display: flex; flex-direction: column; justify-content: space-between; break-after: page; padding-bottom: 2rem; }}
    .cover-eyebrow {{ font-size: 0.875rem; font-weight: 600; color: {tokens['accent-cta']}; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 1rem; }}
    .cover-hero h1 {{ font-size: 2.5rem; margin-bottom: 1rem; }}
    .cover-hero .lead {{ font-size: 1.125rem; color: {tokens['text-dim']}; max-width: 36rem; line-height: 1.8; }}
    .metrics {{ display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin: 2rem 0; }}
    .metric {{ position: relative; padding-left: 1rem; padding-top: 0.5rem; }}
    .metric::before {{ content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 3px; background: {tokens['accent-cta']}; }}
    .metric-value {{ font-size: 2rem; font-weight: 700; color: {tokens['accent-cta']}; line-height: 1; }}
    .metric-label {{ font-size: 0.875rem; color: {tokens['text-muted']}; margin-top: 0.25rem; }}
    .section {{ margin: 2rem 0; padding: 1.5rem; background: {tokens['surface']}; border: 1px solid {tokens['border']}; border-radius: 0.5rem; }}
    .info-grid {{ display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin: 1.5rem 0; }}
    .info-card {{ padding: 1rem; background: {tokens['bg']}; border-radius: 0.375rem; border-left: 3px solid {tokens['accent-cta']}; }}
    .info-card-label {{ font-size: 0.75rem; font-weight: 600; color: {tokens['text-muted']}; text-transform: uppercase; margin-bottom: 0.25rem; }}
    .info-card-value {{ font-size: 1rem; font-weight: 600; color: {tokens['text']}; }}
    .bar-container {{ margin: 1rem 0; height: 2rem; background: {tokens['bg']}; border-radius: 0.375rem; display: flex; align-items: center; }}
    .bar-fill {{ height: 100%; background: {tokens['accent-cta']}; display: flex; align-items: center; justify-content: flex-end; padding-right: 0.5rem; font-weight: 600; font-size: 0.875rem; color: {tokens['accent-hi']}; }}
    .pricing-table {{ width: 100%; margin: 1rem 0; border-collapse: collapse; }}
    .pricing-table th, .pricing-table td {{ padding: 0.75rem; text-align: left; border-bottom: 1px solid {tokens['border']}; }}
    .pricing-table th {{ font-weight: 600; background: {tokens['bg']}; }}
    .variant-label {{ font-weight: 600; color: {tokens['accent-hi']}; font-family: 'Geist Mono', monospace; }}
    strong {{ font-weight: 600; color: {tokens['text']}; }}
  </style>
</head>
<body>
<div class="cover">
  <div class="cover-hero">
    <div class="cover-eyebrow">Podsumowanie partnerstwa</div>
    <h1>LSI Software × GetResponse</h1>
    <p class="lead">Kompleksowe rozwiązanie integracyjne łączące zaawansowaną platformę marketingu automatycznego z technologią oprogramowania klasy enterprise.</p>
  </div>
  <div class="metrics">
    <div class="metric"><div class="metric-value">44%</div><div class="metric-label">Wzrost konwersji (InfoVeriti)</div></div>
    <div class="metric"><div class="metric-value">3x</div><div class="metric-label">Przyspieszenie time-to-value</div></div>
    <div class="metric"><div class="metric-value">5</div><div class="metric-label">Scenariuszy integracji</div></div>
    <div class="metric"><div class="metric-value">API</div><div class="metric-label">Dokumentacja native</div></div>
  </div>
</div>

<div class="section">
  <h2>Zakres współpracy</h2>
  <p>Proponowane partnerstwo obejmuje tightened integration layer między platformą GetResponse a ekosystemem LSI:</p>
  <ul>
    <li>Natywne synchronizowanie kontaktów i segmentacji</li>
    <li>Automatyczne triggery na bazie zdarzeń LSI</li>
    <li>Bi-directional data flow z audit trail</li>
    <li>Dedykowany support tier dla klientów joint</li>
    <li>Co-marketing initiatives w Q4 2026</li>
  </ul>
  <div class="info-grid">
    <div class="info-card"><div class="info-card-label">Estymowana wartość roczna</div><div class="info-card-value">$120k–$180k</div></div>
    <div class="info-card"><div class="info-card-label">Zespół dedykowany</div><div class="info-card-value">3 FTE inżynierów</div></div>
    <div class="info-card"><div class="info-card-label">Timeline MVP</div><div class="info-card-value">12 tygodni</div></div>
    <div class="info-card"><div class="info-card-label">Go-to-market</div><div class="info-card-value">Q4 2026</div></div>
  </div>
</div>

<div class="section">
  <h2>Model integracji</h2>
  <h3>A. Synchronizacja kontaktów (Real-time)</h3>
  <p>LSI → GetResponse workflow trigger na bazie event stream z sub-second latency via webhook.</p>
  <h3>B. Campaign automation (Native)</h3>
  <p>GetResponse campaigns triggered by LSI events: proposal sent, demo booked, contract signed.</p>
  <h3>C. Revenue attribution (Dashboard)</h3>
  <p>Joint analytics view showing deal-to-email correlation z granularnością deal-level.</p>
  <h3>D. GetResponse → LSI feedback loop (Async)</h3>
  <p>Email engagement signals (open, click, bounce) flow back to LSI dla lead scoring enrichment.</p>
  <h3>E. Data export SLA (Compliance)</h3>
  <p>Customers retrieve full dataset w standard formats (CSV, JSON) on demand. No lock-in.</p>
</div>

<div class="section">
  <h2>Scenariusz migracji (InfoVeriti case study)</h2>
  <p><strong>Tło:</strong> InfoVeriti — B2B SaaS, ~200k MQL/year, marketing ops team 2 osób, Excel-based lead scoring.</p>
  <p><strong>Problem:</strong> Leads roamed between systems. No single source of truth. Sales teams re-entering data.</p>
  <h3>Rezultaty post-integracji (3 miesiące):</h3>
  <div class="bar-container">
    <div class="bar-fill" style="width: 44%;">44% ↑ konwersji MQL→SQL</div>
  </div>
  <ul>
    <li><strong>Velocity:</strong> 6 dni → 1.2 dnia (zautomatyzowane triggery)</li>
    <li><strong>Data quality:</strong> 23% deduplikacji (fuzzy match na email)</li>
    <li><strong>Team time:</strong> 16h/tygodniu recovered</li>
    <li><strong>CAC payback:</strong> 9 miesięcy → 6 miesięcy</li>
  </ul>
</div>

<div class="section">
  <h2>Modele cenowe</h2>
  <table class="pricing-table">
    <thead><tr><th>Wariant</th><th>Struktura</th><th>Roczna wartość</th></tr></thead>
    <tbody>
      <tr><td><span class="variant-label">A</span></td><td>Flat fee + rev-share (15% MRR delta)</td><td>$120k baseline + upside</td></tr>
      <tr><td><span class="variant-label">B</span></td><td>Usage-based (per API call tier)</td><td>$80k–$180k range</td></tr>
      <tr><td><span class="variant-label">C</span></td><td>Strategic partnership + equity (0.1%)</td><td>$150k + upside</td></tr>
      <tr><td><span class="variant-label">D</span></td><td>Hybrid: $100k + per-contact fee</td><td>$120k–$160k</td></tr>
      <tr><td><span class="variant-label">E</span></td><td>White-label / Resale (40% margin)</td><td>$200k+ embedded</td></tr>
    </tbody>
  </table>
  <p><strong>Rekomendacja:</strong> Wariant A (flat + rev-share) jako opening position.</p>
</div>

<div class="section">
  <h2>Następne kroki</h2>
  <ol>
    <li><strong>Scheduled call:</strong> Technical deep-dive on API contracts &amp; SLA</li>
    <li><strong>Legal review:</strong> Data processing agreement, liability caps, term (Week 2)</li>
    <li><strong>Proof of concept:</strong> Week 3–5 demo environment with sandbox API</li>
    <li><strong>Business alignment:</strong> Final pricing + go-to-market. LOI by end of Q3</li>
    <li><strong>Engineering kickoff:</strong> Resource commit, sprint planning, August ramp</li>
  </ol>
</div>

</body>
</html>"""

# Header
header_html = f"""<html><head><style>{FONT_FACES}
body {{margin:0;padding:0;height:15mm;display:flex;align-items:center;justify-content:space-between;background:{tokens['surface']};border-bottom:1px solid {tokens['border']};padding:0 14mm;font-family:'Geist',sans-serif;}}
.left {{display:flex;align-items:center;gap:0.5rem;}}
.lime-mark {{width:8px;height:8px;background:{tokens['accent-cta']};border-radius:1px;}}
.header-text {{font-size:10pt;font-weight:600;color:{tokens['text']};letter-spacing:0.05em;}}
.right {{font-size:9pt;color:{tokens['text-muted']};}}
</style></head><body>
<div class="left"><div class="lime-mark"></div><div class="header-text">LSI SOFTWARE × GETRESPONSE</div></div>
<div class="right">Partnership Summary</div>
</body></html>"""

# Footer
footer_html = f"""<html><head><style>{FONT_FACES}
body {{margin:0;padding:0;height:18mm;display:flex;align-items:center;justify-content:space-between;background:{tokens['surface']};border-top:1px solid {tokens['border']};padding:0 14mm;font-family:'Geist',sans-serif;}}
.left {{display:flex;align-items:center;gap:1rem;}}
.avatar {{width:40px;height:40px;border-radius:50%;object-fit:cover;border:2px solid {tokens['accent-cta']};}}
.footer-text {{font-size:9pt;line-height:1.4;}}
.footer-name {{font-weight:600;color:{tokens['text']};}}
.footer-role {{font-size:8pt;color:{tokens['text-muted']};}}
.footer-contact {{font-size:8pt;color:{tokens['text-dim']};font-family:'Geist Mono',monospace;}}
.right {{text-align:right;font-size:9pt;color:{tokens['text-muted']};}}
</style></head><body>
<div class="left">
<img src="data:image/png;base64,{avatar_b64}" alt="Wojciech Łuszczyński" class="avatar" />
<div class="footer-text"><div class="footer-name">Wojciech Łuszczyński</div><div class="footer-role">GTM Architect × Growth Operator</div><div class="footer-contact">w.luszczynski@gmail.com | wojciech.io</div></div>
</div>
<div class="right"><span id="pageNumber"></span></div>
</body></html>"""

with open("doc.html", "w") as f: f.write(doc_html)
with open("header.html", "w") as f: f.write(header_html)
with open("footer.html", "w") as f: f.write(footer_html)
print("✓ HTML files ready for PDF rendering", file=sys.stderr)
