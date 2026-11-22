#!/usr/bin/env python3
"""Generates public/revolution/system.html from the files on disk.
Run from the repo root: python3 public/revolution/assets/system/build-system.py
Image lists and sizes come from the folders, so the library never lists a file that does not exist."""
import html, json, os, subprocess, sys

ROOT = os.path.join('public', 'revolution')
A = os.path.join(ROOT, 'assets')
E = html.escape


def ls(d, exts):
    p = os.path.join(A, d)
    return sorted(f for f in os.listdir(p) if f.lower().endswith(exts))


def sizes(paths):
    js = "const s=require('sharp');(async()=>{const o={};for(const p of process.argv.slice(1)){try{const m=await s(p).metadata();o[p]=[m.width,m.height]}catch(e){}}console.log(JSON.stringify(o))})()"
    return json.loads(subprocess.check_output(['node', '-e', js] + paths))


def copy_demo(code, demo, cap=''):
    return (f'<div class="sy-demo">{demo}<button class="sy-copy" type="button">Copy</button>'
            f'<template>{code}</template></div><p class="sy-cap">{E(cap)}</p>')


ICONS = {
    'globe': '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.6 2.6 3.8 5.6 3.8 9s-1.2 6.4-3.8 9c-2.6-2.6-3.8-5.6-3.8-9S9.4 5.6 12 3z"/>',
    'sun': '<circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6 7 7M17 17l1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4"/>',
    'moon': '<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/>',
    'menu': '<path d="M4 8h16M4 16h16"/>',
    'check': '<path d="M5 12.5l4.2 4.2L19 7"/>',
    'arrow': '<path d="M5 12h14M13 6l6 6-6 6"/>',
    'close': '<path d="M6 6l12 12M18 6 6 18"/>',
    'search': '<circle cx="11" cy="11" r="6"/><path d="M20 20l-4.2-4.2"/>',
    'plus': '<path d="M12 5v14M5 12h14"/>',
    'filter': '<path d="M4 6h16M7 12h10M10 18h4"/>',
    'copy': '<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V6a2 2 0 0 1 2-2h9"/>',
}


def svg(name, px):
    return f'<svg viewBox="0 0 24 24" width="{px}" height="{px}" aria-hidden="true">{ICONS[name]}</svg>'


# ---------- page templates (10 types) ----------
TEMPLATES = [
    dict(id='home', name='Home', file='index.html', css='g22.css + inline page CSS', js='c3-hero.js, g22.js, motion.js',
         anatomy=['Hero: what to fix first, ask, screens, agent and me as signature', 'Logo strip (companies)', 'Three lenses (GTM, Marketing, Growth)',
                  'Real screens of applications', 'Selected work', 'Testimonials', 'Insights band', 'One ask and footer'],
         comp='Hero scene, lens switcher, screens rail, quote cards, footer card',
         phone='Hero keeps one screen at a time; lens switcher becomes a stacked list; sections use the 12/14/18/28/56 phone scale.'),
    dict(id='lens', name='Lens (GTM, Marketing, Growth)', file='gtm.html', css='g22.css + lens/gtm.css, hero.css, plates.css', js='lens-fx.js, motion.js',
         anatomy=['Lens hero with plate', 'Problem statement', 'What I build (pipeline axis)', 'Screens switcher (3 screens)', 'Proof: numbers and quotes', 'Ask and footer'],
         comp='Plate, pipeline axis, three-screen switcher, quote, CTA block',
         phone='Plate above text, switcher becomes swipeable rail, axis runs vertically.'),
    dict(id='about', name='About', file='about.html', css='g22.css + about/about.css', js='g22.js, motion.js',
         anatomy=['Opening statement', 'Career timeline (career/*)', 'How I work', 'Testimonials', 'Ask and footer'],
         comp='Timeline row, portrait card, quote card, CTA block',
         phone='Timeline is one column; portraits crop to the face focus point.'),
    dict(id='work', name='Work (index)', file='work.html', css='g22.css + inline page CSS', js='g22.js, motion.js',
         anatomy=['Heading and filter chips', 'Case cards with cover', 'Screens galleries per product (rail)', 'Ask and footer'],
         comp='Chip filter, case card, screens rail, CTA block',
         phone='Cards stack; rails swipe with scroll-snap; caption text stays at 12 px or more.'),
    dict(id='case', name='Case', file='work/content-studio.html', css='g22.css + v4/v4.css, ui4.css', js='v4.js, ui4.js, motion4.js',
         anatomy=['Statement (d1 heading)', 'Problem', 'Solution in whole interfaces', 'Steps (doc list)', 'Result', 'Next case and ask'],
         comp='d1/h2/st headings, doc list, whole-screen figure, btn, footer',
         phone='A full screen is swapped for its portrait (data-uim), never zoomed and cut.'),
    dict(id='insights', name='Insights (index)', file='insights.html', css='g22.css + mono.css + inline page CSS', js='g22.js',
         anatomy=['Heading and search', 'Category tabs and cover filter', 'Note list with covers', 'Newsletter block', 'Footer'],
         comp='Search, tabs, filter sheet, note card, newsletter form',
         phone='Filter opens as a bottom sheet; one note per row.'),
    dict(id='article', name='Article', file='article.html', css='g22.css + mono.css', js='g22.js',
         anatomy=['Title (one typeface)', 'Cover', 'Table of contents (left rule)', 'Body with figures', 'Related notes', 'Newsletter and footer'],
         comp='TOC, figure, callout, note card, newsletter form',
         phone='TOC collapses above the body; body measure about 17 px.'),
    dict(id='app', name='App', file='apps/adsai.html', css='g22.css + v4/v4.css, ui4.css', js='v4.js, ui4.js, ui4x.js, demos.js',
         anatomy=['Statement', 'Whole interface (hero screen)', 'What it solves', 'Screens in sequence (data-uim portraits on phone)', 'Booking CTA and footer'],
         comp='Whole-screen figure, step list, demo, btn, footer',
         phone='Portrait screens replace desktop screens; one primary action.'),
    dict(id='newsletter', name='Newsletter', file='newsletter.html', css='g22.css + mono.css + inline page CSS', js='g22.js',
         anatomy=['Promise in one line', 'Form (email, one button)', 'Latest notes', 'Footer'],
         comp='Form field, button, note card',
         phone='Field and button stack; field text 16 px so the page does not zoom.'),
    dict(id='legal', name='Legal and 404', file='privacy.html', css='g22.css + inline page CSS', js='g22.js',
         anatomy=['Heading', 'Plain text in one column', 'Link back', 'Footer (404 adds a hero and links to the main pages)'],
         comp='Prose column, link, footer',
         phone='One column, 17 px text, no decoration.'),
]

TABS = [('tokens', 'Tokens'), ('typography', 'Typography'), ('icons', 'Icons'), ('components', 'Components'), ('screens', 'Screens'),
        ('covers', 'Covers and photos'), ('motion', 'Motion'), ('modes', 'Modes'), ('templates', 'Page templates')]


def tokens():
    return f'''<h2>Tokens</h2>
<p class="sy-note">Read live from the stylesheets this preview ships (g22.css, v4.css, motion.css), so this tab cannot drift from the code: <b id="tok-count">…</b> custom properties found. Dark or default is the :root value, Light is the html[data-mode="light"] override. Rule: one accent, olive <code>#4D5C00</code> on light, lime <code>#D2FF00</code> on dark.</p>
<h3>Rules that do not change</h3>
<div class="sy-grid">
<div class="sy-card"><h3 class="sy-ch">Scale (phone)</h3><p>12 / 14 / 18 / 28 / 56 px, plus 120 px for display on desktop.</p></div>
<div class="sy-card"><h3 class="sy-ch">Radius</h3><p>8 px for controls, 12 px for cards and screens.</p></div>
<div class="sy-card"><h3 class="sy-ch">Line</h3><p>1 px outlines and dividers, 1.5 stroke on icons.</p></div>
<div class="sy-card"><h3 class="sy-ch">Tap target</h3><p>44 px for every control on a phone. Text never below 12 px.</p></div>
<div class="sy-card"><h3 class="sy-ch">Spacing</h3><p>Page margin 17 px on v4 pages; one section step <code>--sp</code> (11vw) above and below every section.</p></div>
</div>
<div id="tok-out" aria-live="polite"></div>'''


def typography():
    rows = [('12', 'Caption, eyebrow, label (uppercase, .12em)', 12, 600), ('14', 'Secondary text, table cells', 14, 400), ('18', 'Lead paragraph', 18, 400),
            ('28', 'Section heading on phone', 28, 700), ('56', 'Display on phone', 56, 800), ('120', 'Display on desktop (clamped)', 120, 800)]
    r = ''.join(f'<div><b>{n} px</b><p style="font:{w} {min(s,72)}px/1.05 var(--sy-sans);{"font-stretch:75%;text-transform:uppercase;letter-spacing:-.02em;" if s>=56 else ""}">{E(t)}</p></div>' for n, t, s, w in rows)
    return f'''<h2>Typography</h2>
<p class="sy-note">Two families of headings exist today. Both use Mona Sans; Playfair Display is only an accent.</p>
<h3>Scale</h3><div class="sy-type">{r}</div>
<h3>Where each family is used</h3>
<div class="sy-grid sy-grid--s">
<div class="sy-card"><h3 class="sy-ch">A: old pages (13 pages)</h3><p>Home, GTM, Marketing, Growth, About, Work, Insights, article, newsletter, legal, 404. Display is Mona Sans 800, condensed to 75% width, uppercase, line height .92, with the page heading scale 44 / 38 / 26 px on phone.</p><p style="font:800 40px/.92 var(--sy-sans);font-stretch:75%;text-transform:uppercase;letter-spacing:-.02em;color:var(--sy-hi)">Revenue systems</p></div>
<div class="sy-card"><h3 class="sy-ch">B: v4 pages (19 pages)</h3><p>Apps, Insights notes and Work cases. Mona Sans 700, uppercase, letter spacing -.038em, normal width. Playfair appears only as the second line of a display heading, the last phrase of a statement and the first line of a big number.</p><p style="font:700 40px/.86 var(--sy-sans);text-transform:uppercase;letter-spacing:-.038em;color:var(--sy-hi)">Built and run <span style="font-family:var(--sy-serif);font-weight:500;text-transform:none;letter-spacing:0">in the open</span></p></div>
<div class="sy-card"><h3 class="sy-ch">Body and code</h3><p>Body is Mona Sans 400 at 16 to 17 px. Monospace only inside code and token names.</p></div>
</div>'''


def icons():
    cells = ''.join(f'<div><div class="sz">{svg(n,16)}{svg(n,20)}</div><em>{n}</em></div>' for n in ICONS)
    tools = ls('tools', ('.webp',))
    ico = sorted(f for f in os.listdir(os.path.join(A, 'logos', 'ico')))
    logos = [f for f in ls('logos', ('.svg', '.png', '.webp'))]
    lg = ''.join(f'<div><div class="sy-logo"><img src="assets/logos/{f}" alt="" loading="lazy"></div><em>{f}</em></div>' for f in logos)
    ic = ''.join(f'<div><div class="sy-logo"><img src="assets/logos/ico/{f}" alt="" loading="lazy"></div><em>{f}</em></div>' for f in ico)
    fav = ''.join(f'<div><div class="sy-logo"><img src="assets/icons/{f}" alt="" width="32" height="32"></div><em>{f}</em></div>' for f in ('favicon.svg', 'favicon-32.png', 'apple-touch-icon.png'))
    return f'''<h2>Icons</h2>
<p class="sy-note">Line icons only: 16 and 20 px, stroke 1.5, round caps and joins, <code>currentColor</code>. The header controls use 18 px (<code>--g-ico</code>). Sizes are drawn side by side below.</p>
<h3>Interface set ({len(ICONS)})</h3><div class="sy-ic">{cells}</div>
<h3>Brand marks, <code>assets/icons</code></h3><div class="sy-ic">{fav}</div>
<h3>Tool marks, <code>assets/logos/ico</code> ({len(ico)})</h3><div class="sy-ic">{ic}</div>
<h3>Company logos, <code>assets/logos</code> ({len(logos)})</h3><div class="sy-ic">{lg}</div>
<h3>Tool screens, <code>assets/tools</code> ({len(tools)})</h3>
<div class="sy-grid sy-grid--s">{''.join(f'<figure class="sy-shot"><img src="assets/tools/{f}" alt="" loading="lazy"><figcaption>{f}</figcaption></figure>' for f in tools)}</div>'''


def components():
    c = []
    c.append(('Buttons', copy_demo('<a class="btn" href="#">Book a call</a>\n<a class="btn btn--o" href="#">See the work</a>',
              '<div class="sy-row"><a class="sy-btn" href="#components">Book a call</a><a class="sy-btn sy-btn--o" href="#components">See the work</a><button class="sy-btn" disabled>Disabled</button></div>',
              '44 px tall, radius 8, 13 px uppercase label. Primary uses the accent, secondary a 1.5 px line.')))
    c.append(('Chips', copy_demo('<button class="chip" aria-pressed="false">GTM</button>',
              '<div class="sy-row"><button class="sy-chip" data-tg aria-pressed="true">GTM</button><button class="sy-chip" data-tg aria-pressed="false">Marketing</button><button class="sy-chip" data-tg aria-pressed="false">Growth</button></div>',
              'Toggle with aria-pressed. 44 px hit area on touch screens.')))
    c.append(('Links', copy_demo('<a class="lnk" href="#">Read the note</a>',
              f'<a class="sy-lnk" href="#components">Read the note {svg("arrow",16)}</a>', 'Bold text, accent underline, optional 16 px arrow.')))
    c.append(('Form', copy_demo('<label for="e">Email</label>\n<input id="e" type="email">\n<button class="btn">Subscribe</button>',
              '<div class="sy-row" style="align-items:flex-end"><div style="flex:1;min-width:200px"><label class="sy-lb" for="sy-e">Email</label><input class="sy-in" id="sy-e" type="email" autocomplete="off" placeholder="you@company.com"></div><button class="sy-btn" type="button">Subscribe</button></div>',
              'Field text is 16 px so phones do not zoom. Label always visible.')))
    c.append(('Card and pill', copy_demo('<article class="card"><span class="pill">Note</span><h3 class="sy-ch">Title</h3><p>One line.</p></article>',
              '<div class="sy-card" style="max-width:320px"><span class="sy-pill">Note</span><h3 class="sy-ch" style="margin-top:10px">Find ecommerce friction</h3><p>One line of context, never two.</p></div>',
              'Radius 12, 1 px line, no shadow, no glow.')))
    c.append(('Table', copy_demo('<table>…</table>',
              '<div class="sy-scroll"><table class="sy-tbl"><thead><tr><th>Metric</th><th>Before</th><th>After</th></tr></thead><tbody><tr><td>Example row</td><td>0</td><td>0</td></tr></tbody></table></div>',
              'Sample row only. Real numbers come from published case studies.')))
    c.append(('Menu', copy_demo('<nav class="menu">…</nav>',
              '<ul class="sy-menu"><li><a href="#components" aria-current="page"><b>Home</b><span>01</span></a></li><li><a href="#components"><b>Work</b><span>02</span></a></li><li><a href="#components"><b>GTM</b><span>03</span></a></li></ul>',
              'Full menu lists 7 pages; screens beside it stand still (no drift).')))
    c.append(('CTA block', copy_demo('<section class="cta">…</section>',
              '<div class="sy-cta"><b>One ask</b><a class="sy-btn" href="#components">Book a call</a></div>', 'One ask per page ending.')))
    c.append(('Footer card', copy_demo('<footer class="ft">…</footer>',
              '<div class="sy-ft"><span>Wojciech Luszczynski</span><a href="#components">Privacy</a></div>', 'Dark card today in both modes; the modes document may change this.')))
    out = ''.join(f'<h3>{n}</h3>{h}' for n, h in c)
    return f'''<h2>Components</h2>
<p class="sy-note">Reference implementations of the preview patterns, namespaced <code>sy-</code> so they do not collide with page CSS. “Copy” gives the class names the pages use.</p>{out}'''


def screens(sz):
    files = [f for f in ls('real', ('.webp',)) if f.startswith('ui-') and not f.endswith('-m.webp')]
    figs = []
    for f in files:
        w, h = sz.get(os.path.join(A, 'real', f), (1280, 840))
        figs.append(f'<figure class="sy-shot"><img src="assets/real/{f}" alt="" width="{w}" height="{h}" loading="lazy" decoding="async"><figcaption>{f}</figcaption></figure>')
    mob = [f for f in ls('real', ('-m.webp',)) if f.startswith('ui-')]
    return f'''<h2>Screens</h2>
<p class="sy-note">{len(files)} application screens in light windows, <code>assets/real/ui-*.webp</code>. Rule: an interface is always shown whole, with all four corners; on phones a portrait variant ({len(mob)} files ending <code>-m</code>) replaces the full screen. Data is anonymised example data.</p>
<div class="sy-grid sy-grid--s">{''.join(figs)}</div>'''


def covers(sz):
    items = [('real/loft-og.webp', 'Open Graph, 1200 × 630'), ('lens/gtm-team.webp', 'Lens hero, 16:9'), ('co/plate-gtm.webp', 'Lens plate, 4:3'),
             ('menu/lens-gtm.webp', 'Menu scene, 7:5'), ('career/wt-coach.webp', 'Career portrait, 6:7'), ('real/ph-cafe.webp', 'Photo, square'),
             ('real/ui-studio.webp', 'Whole screen, 32:21')]
    figs = ''.join(f'<figure class="sy-shot"><img src="assets/{p}" alt="" loading="lazy"><figcaption>{p} · {c}</figcaption></figure>' for p, c in items)
    return f'''<h2>Covers and photos</h2>
<p class="sy-note">Rules for frames and backgrounds. These come from the decisions already taken for the preview, not from new taste.</p>
<div class="sy-grid">
<div class="sy-card"><h3 class="sy-ch">Cover kinds</h3><p>A note cover is a mark of the model, a screen of an application, or a photo of the role. Never text inside the image.</p></div>
<div class="sy-card"><h3 class="sy-ch">Screens are whole</h3><p>Never cropped by a section or a screen edge. On phones the <code>-m</code> portrait replaces the desktop screen.</p></div>
<div class="sy-card"><h3 class="sy-ch">Photos</h3><p>Only approved photos of Wojciech and the people on the testimonials. No generated photos of him; the cyborg appears only as the agent (Home, About).</p></div>
<div class="sy-card"><h3 class="sy-ch">Background</h3><p>Flat v4 covers have no generated hero photo and no contour lines (mono.css). Frames use radius 12 and a 1 px line.</p></div>
<div class="sy-card"><h3 class="sy-ch">Ratios in use</h3><p>16:9 lens, 4:3 plate, 7:5 menu, 32:21 screen, 1200 × 630 Open Graph, square 120 px avatar.</p></div>
</div>
<h3>Samples</h3><div class="sy-grid sy-grid--s">{figs}</div>'''


def motion():
    cells = ''.join(f'''<div class="sy-card" data-dur="{d}" data-ease="{e}"><h3 class="sy-ch">{n} · {d} ms</h3><p class="sy-cap" style="margin:0 0 8px"><code>{e}</code></p><div class="trk"><div class="box"></div></div><p style="margin-top:8px"><button class="sy-btn sy-btn--o" type="button">Play</button></p></div>'''
                    for n, d, e in [('Quick', 200, 'cubic-bezier(.2,.7,.1,1)'), ('Section reveal', 800, 'cubic-bezier(.2,.7,.1,1)'), ('Bars draw', 1100, 'cubic-bezier(.2,.7,.1,1)'), ('Linear (reference)', 800, 'linear')])
    return f'''<h2>Motion</h2>
<p class="sy-note">One easing, one distance, one duration (motion.css): <code>--m-ease: cubic-bezier(.2,.7,.1,1)</code>, <code>--m-dist: 22px</code>, <code>--m-dur: .8s</code>, <code>--m-step: .08s</code>. Everything moves with transform, translate, scale or opacity, so nothing reflows. With <code>prefers-reduced-motion</code> or without JS the page is fully visible and the demos jump to the end state.</p>
<div class="sy-mo">{cells}</div>
<h3>Hooks</h3>
<div class="sy-grid"><div class="sy-card"><h3 class="sy-ch">data-m="rise"</h3><p>Section rises 22 px and fades in.</p></div><div class="sy-card"><h3 class="sy-ch">data-m="stagger"</h3><p>Children rise one after another, 80 ms apart (max 8 steps).</p></div>
<div class="sy-card"><h3 class="sy-ch">data-m="bar" / "barv"</h3><p>Bars draw once from the left or from the bottom.</p></div><div class="sy-card"><h3 class="sy-ch">data-m="count"</h3><p>Numbers count up once.</p></div></div>'''


def modes():
    def sample(cls, label):
        return f'''<div class="{cls}"><h3 class="sy-ch">{label}</h3>
<div class="sy-row"><a class="sy-btn" href="#modes">Primary</a><a class="sy-btn sy-btn--o" href="#modes">Secondary</a><span class="sy-pill">Pill</span></div>
<div class="sy-card" style="margin-top:14px"><h3 class="sy-ch">Card</h3><p>Body text on the surface. <a class="sy-lnk" href="#modes">Link</a></p></div>
<div class="sy-cta" style="margin-top:14px"><b>One ask</b><a class="sy-btn" href="#modes">Book</a></div></div>'''
    return f'''<h2>Modes</h2>
<p class="sy-note">The same components, dark and light, side by side regardless of the page mode. Dark: olive ink, paper text, lime accent. Light: cream, olive text, olive accent <code>#4D5C00</code>. The footer card stays dark in both modes today; another thread owns the decision on what should follow the mode.</p>
<div class="sy-mm">{sample("d","Dark")}{sample("l","Light")}</div>'''


def templates():
    out = []
    for t in TEMPLATES:
        ol = ''.join(f'<li>{E(a)}</li>' for a in t['anatomy'])
        out.append(f'''<article class="sy-card"><div><h3>{E(t["name"])}</h3>
<ol>{ol}</ol>
<dl><dt>Model file</dt><dd><code>public/revolution/{t["file"]}</code></dd><dt>CSS</dt><dd>{E(t["css"])}</dd><dt>JS</dt><dd>{E(t["js"])}</dd><dt>Components</dt><dd>{E(t["comp"])}</dd><dt>On phone</dt><dd>{E(t["phone"])}</dd></dl>
<p style="margin-top:12px"><a class="sy-lnk" href="{t["file"]}">Open the live page {svg("arrow",16)}</a></p></div>
<div class="sy-th"><figure class="m"><img src="assets/system/thumbs/{t["id"]}-390.webp" alt="{E(t["name"])}, 390 px wide" width="96" height="208" loading="lazy"><figcaption class="sy-cap">390</figcaption></figure>
<figure class="d"><img src="assets/system/thumbs/{t["id"]}-1440.webp" alt="{E(t["name"])}, 1440 px wide" width="360" height="225" loading="lazy"><figcaption class="sy-cap">1440</figcaption></figure></div></article>''')
    return f'''<h2>Page templates</h2>
<p class="sy-note">Ten page types. Each card lists the order of sections, the model file to copy from, the components used and what happens on a phone. Thumbnails are first-screen captures at 390 and 1440 px (<code>assets/system/build-thumbs.mjs</code>).</p>
<div class="sy-tp">{''.join(out)}</div>'''


def main():
    ui = [os.path.join(A, 'real', f) for f in ls('real', ('.webp',)) if f.startswith('ui-') and not f.endswith('-m.webp')]
    sz = sizes(ui)
    panels = dict(tokens=tokens(), typography=typography(), icons=icons(), components=components(), screens=screens(sz), covers=covers(sz),
                  motion=motion(), modes=modes(), templates=templates())
    tabs = ''.join(f'<button role="tab" id="t-{i}" data-t="{i}" aria-controls="p-{i}" aria-selected="{"true" if k==0 else "false"}" tabindex="{0 if k==0 else -1}">{n}</button>' for k, (i, n) in enumerate(TABS))
    pan = ''.join(f'<section class="sy-p" role="tabpanel" id="p-{i}" aria-labelledby="t-{i}"{"" if k==0 else " hidden"} tabindex="0">{panels[i]}</section>' for k, (i, n) in enumerate(TABS))
    doc = f'''<!doctype html>
<html lang="en" dir="ltr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Design system library · Wojciech Luszczynski</title>
<meta name="description" content="Library of the /revolution preview design system: tokens, type, icons, components, screens, covers, motion, modes and page templates.">
<meta name="theme-color" content="#282C20">
<link rel="icon" href="assets/icons/favicon.svg" type="image/svg+xml">
<link rel="icon" href="assets/icons/favicon-32.png" sizes="32x32" type="image/png">
<link rel="apple-touch-icon" href="assets/icons/apple-touch-icon.png">
<link rel="manifest" href="assets/icons/site.webmanifest">
<script>(function(){{var d=document.documentElement,m=null;try{{m=localStorage.getItem("wl-mode")}}catch(e){{}}if(m!=="light"&&m!=="dark")m=matchMedia("(prefers-color-scheme: light)").matches?"light":"dark";d.dataset.mode=m;d.style.colorScheme=m}})()</script>
<link rel="stylesheet" href="assets/g22/g22.css" data-g22>
<link rel="stylesheet" href="assets/motion/motion.css">
<link rel="stylesheet" href="assets/system/system.css">
</head>
<body>
<a class="sy-skip" href="#main">Skip to content</a>
<header class="sy-nav"><a class="sy-brand" href="index.html">Wojciech <span>Luszczynski</span></a>
<nav aria-label="Main"><a href="work.html">Work</a><a href="gtm.html">GTM</a><a href="insights.html">Insights</a><a href="about.html">About</a></nav>
<button class="sy-mode" type="button" aria-pressed="false" aria-label="Switch mode"><svg class="moon" viewBox="0 0 24 24" aria-hidden="true">{ICONS["moon"]}</svg><svg class="sun" viewBox="0 0 24 24" aria-hidden="true">{ICONS["sun"]}</svg></button></header>
<main id="main">
<div class="sy-hd"><p class="sy-k">Preview · design system</p><h1 class="sy-h1">Library</h1>
<p class="sy-lead">Everything the preview is made of, in one place: tokens read live from the CSS, type, icons, components, screens, covers, motion, both modes and the ten page templates.</p></div>
<div class="sy-tabs"><div role="tablist" aria-label="Library sections">{tabs}</div></div>
<div class="sy-body">{pan}</div>
</main>
<footer class="sy-ftr">Preview only, not indexed. Source of truth for tokens is the CSS; this page reads it. Notes: <code>docs/revolution-design-system.md</code>.</footer>
<script src="assets/system/system.js"></script>
</body>
</html>
'''
    open(os.path.join(ROOT, 'system.html'), 'w').write(doc)
    print('system.html', len(doc))


if __name__ == '__main__':
    main()
