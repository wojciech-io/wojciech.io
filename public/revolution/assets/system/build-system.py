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
         anatomy=['Hero', 'logos', 'lenses', 'screens', 'work', 'quotes', 'insights', 'ask'],
         comp='Scene, lens switch, screens rail, quotes',
         phone='One screen at a time; stacked lenses'),
    dict(id='lens', name='Lens (GTM, Marketing, Growth)', file='gtm.html', css='g22.css + lens/gtm.css, hero.css, plates.css', js='lens-fx.js, motion.js',
         anatomy=['Hero plate', 'problem', 'pipeline', '3 screens', 'proof', 'ask'],
         comp='Plate, axis, switcher, quote',
         phone='Rail swipes; axis vertical'),
    dict(id='about', name='About', file='about.html', css='g22.css + about/about.css', js='g22.js, motion.js',
         anatomy=['Statement', 'timeline', 'how I work', 'quotes', 'ask'],
         comp='Timeline row, portrait, quote',
         phone='One column'),
    dict(id='work', name='Work (index)', file='work.html', css='g22.css + inline page CSS', js='g22.js, motion.js',
         anatomy=['Heading + chips', 'case cards', 'screens rails', 'ask'],
         comp='Chips, case card, rail',
         phone='Cards stack; rails snap'),
    dict(id='case', name='Case', file='work/content-studio.html', css='g22.css + v4/v4.css, ui4.css', js='v4.js, ui4.js, motion4.js',
         anatomy=['Statement', 'problem', 'solution', 'steps', 'result', 'next'],
         comp='d1/h2/st, doc list, whole screen',
         phone='Portrait screens'),
    dict(id='insights', name='Insights (index)', file='insights.html', css='g22.css + mono.css + inline page CSS', js='g22.js',
         anatomy=['Search', 'tabs', 'notes list', 'newsletter'],
         comp='Search, tabs, filter sheet, note card',
         phone='Filter as bottom sheet'),
    dict(id='article', name='Article', file='article.html', css='g22.css + mono.css', js='g22.js',
         anatomy=['Title', 'cover', 'TOC', 'body', 'related', 'newsletter'],
         comp='TOC, figure, callout',
         phone='TOC above body'),
    dict(id='app', name='App', file='apps/adsai.html', css='g22.css + v4/v4.css, ui4.css', js='v4.js, ui4.js, ui4x.js, demos.js',
         anatomy=['Statement', 'whole screen', 'what it solves', 'screens', 'book'],
         comp='Whole screen, steps, btn',
         phone='Portrait screens'),
    dict(id='newsletter', name='Newsletter', file='newsletter.html', css='g22.css + mono.css + inline page CSS', js='g22.js',
         anatomy=['Promise', 'form', 'latest notes'],
         comp='Field, button, note card',
         phone='Stacked, 16 px field'),
    dict(id='legal', name='Legal and 404', file='privacy.html', css='g22.css + inline page CSS', js='g22.js',
         anatomy=['Heading', 'text', 'back link'],
         comp='Prose, link',
         phone='One column'),
]

TABS = [('tokens', 'Tokens'), ('typography', 'Typography'), ('icons', 'Icons'), ('components', 'Components'), ('screens', 'Screens'),
        ('covers', 'Covers and photos'), ('motion', 'Motion'), ('modes', 'Modes'), ('templates', 'Page templates')]


def tokens():
    return f'''<h2>Tokens</h2>
<p class="sy-note">Read live from the CSS: <b id="tok-count">…</b> custom properties.</p>
<div class="sy-scroll"><table class="sy-tbl"><tbody>
<tr><th scope="row">Accent</th><td>light <code>#4D5C00</code> · dark <code>#D2FF00</code></td></tr>
<tr><th scope="row">Type, phone</th><td>12 · 14 · 18 · 28 · 56 px (120 on desktop)</td></tr>
<tr><th scope="row">Radius</th><td>8 controls · 12 cards</td></tr>
<tr><th scope="row">Line</th><td>1 px · icon stroke 1.5</td></tr>
<tr><th scope="row">Tap target</th><td>44 px · text min 12 px</td></tr>
<tr><th scope="row">Section step</th><td><code>--sp</code> 11vw · margin 17 px</td></tr>
</tbody></table></div>
<div id="tok-out" aria-live="polite"></div>'''


def typography():
    rows = [('12', 'Caption', 12, 600), ('14', 'Secondary', 14, 400), ('18', 'Lead', 18, 400),
            ('28', 'Heading', 28, 700), ('56', 'Display', 56, 800), ('120', 'Display, desktop', 120, 800)]
    r = ''.join(f'<div><b>{n} px</b><p style="font:{w} {min(s,72)}px/1.05 var(--sy-sans);{"font-stretch:75%;text-transform:uppercase;letter-spacing:-.02em;" if s>=56 else ""}">{E(t)}</p></div>' for n, t, s, w in rows)
    return f'''<h2>Typography</h2>
<div class="sy-type">{r}</div>
<h3>Headings</h3>
<div class="sy-grid sy-grid--s">
<div class="sy-card"><h3 class="sy-ch">A · 13 old pages</h3><code>Mona Sans 800 · 75% · uppercase</code><p style="margin-top:12px;font:800 40px/.92 var(--sy-sans);font-stretch:75%;text-transform:uppercase;letter-spacing:-.02em;color:var(--sy-hi)">Revenue systems</p></div>
<div class="sy-card"><h3 class="sy-ch">B · 19 v4 pages</h3><code>Mona Sans 700 · uppercase · -.038em</code><p style="margin-top:12px;font:700 40px/.86 var(--sy-sans);text-transform:uppercase;letter-spacing:-.038em;color:var(--sy-hi)">Built and run <span style="font-family:var(--sy-serif);font-weight:500;text-transform:none;letter-spacing:0">in the open</span></p></div>
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
<p class="sy-note">16 and 20 px · stroke 1.5 · <code>currentColor</code></p>
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
              '44 px · radius 8')))
    c.append(('Chips', copy_demo('<button class="chip" aria-pressed="false">GTM</button>',
              '<div class="sy-row"><button class="sy-chip" data-tg aria-pressed="true">GTM</button><button class="sy-chip" data-tg aria-pressed="false">Marketing</button><button class="sy-chip" data-tg aria-pressed="false">Growth</button></div>',
              'aria-pressed')))
    c.append(('Links', copy_demo('<a class="lnk" href="#">Read the note</a>',
              f'<a class="sy-lnk" href="#components">Read the note {svg("arrow",16)}</a>', '')))
    c.append(('Form', copy_demo('<label for="e">Email</label>\n<input id="e" type="email">\n<button class="btn">Subscribe</button>',
              '<div class="sy-row" style="align-items:flex-end"><div style="flex:1;min-width:200px"><label class="sy-lb" for="sy-e">Email</label><input class="sy-in" id="sy-e" type="email" autocomplete="off" placeholder="you@company.com"></div><button class="sy-btn" type="button">Subscribe</button></div>',
              'Field text 16 px')))
    c.append(('Card and pill', copy_demo('<article class="card"><span class="pill">Note</span><h3 class="sy-ch">Title</h3><p>One line.</p></article>',
              '<div class="sy-card" style="max-width:320px"><span class="sy-pill">Note</span><h3 class="sy-ch" style="margin-top:10px">Find ecommerce friction</h3><p>One line of context, never two.</p></div>',
              'Radius 12 · 1 px line')))
    c.append(('Table', copy_demo('<table>…</table>',
              '<div class="sy-scroll"><table class="sy-tbl"><thead><tr><th>Metric</th><th>Before</th><th>After</th></tr></thead><tbody><tr><td>Example row</td><td>0</td><td>0</td></tr></tbody></table></div>',
              '')))
    c.append(('Menu', copy_demo('<nav class="menu">…</nav>',
              '<ul class="sy-menu"><li><a href="#components" aria-current="page"><b>Home</b><span>01</span></a></li><li><a href="#components"><b>Work</b><span>02</span></a></li><li><a href="#components"><b>GTM</b><span>03</span></a></li></ul>',
              '')))
    c.append(('CTA block', copy_demo('<section class="cta">…</section>',
              '<div class="sy-cta"><b>One ask</b><a class="sy-btn" href="#components">Book a call</a></div>', '')))
    c.append(('Footer card', copy_demo('<footer class="ft">…</footer>',
              '<div class="sy-ft"><span>Wojciech Luszczynski</span><a href="#components">Privacy</a></div>', '')))
    out = ''.join(f'<h3>{n}</h3>{h}' for n, h in c)
    return f'''<h2>Components</h2>
{out}'''


def screens(sz):
    files = [f for f in ls('real', ('.webp',)) if f.startswith('ui-') and not f.endswith('-m.webp')]
    figs = []
    for f in files:
        w, h = sz.get(os.path.join(A, 'real', f), (1280, 840))
        figs.append(f'<figure class="sy-shot"><img src="assets/real/{f}" alt="" width="{w}" height="{h}" loading="lazy" decoding="async"><figcaption>{f}</figcaption></figure>')
    mob = [f for f in ls('real', ('-m.webp',)) if f.startswith('ui-')]
    return f'''<h2>Screens</h2>
<p class="sy-note">{len(files)} screens · {len(mob)} phone portraits (<code>-m</code>)</p>
<div class="sy-grid sy-grid--s">{''.join(figs)}</div>'''


def covers(sz):
    items = [('real/loft-og.webp', '1200 × 630'), ('lens/gtm-team.webp', '16:9'), ('co/plate-gtm.webp', '4:3'),
             ('menu/lens-gtm.webp', '7:5'), ('career/wt-coach.webp', '6:7'), ('real/ph-cafe.webp', '1:1'),
             ('real/ui-studio.webp', '32:21')]
    figs = ''.join(f'<figure class="sy-shot"><img src="assets/{p}" alt="" loading="lazy"><figcaption>{p} · {c}</figcaption></figure>' for p, c in items)
    return f'''<h2>Covers and photos</h2>
<div class="sy-scroll"><table class="sy-tbl"><tbody>
<tr><th scope="row">Cover kinds</th><td>model mark · app screen · role photo</td></tr>
<tr><th scope="row">Text in image</th><td>never</td></tr>
<tr><th scope="row">Screens</th><td>whole · <code>-m</code> portrait on phone</td></tr>
<tr><th scope="row">Photos</th><td>approved only · cyborg = agent only</td></tr>
<tr><th scope="row">Frame</th><td>radius 12 · 1 px line</td></tr>
</tbody></table></div>
<div class="sy-grid sy-grid--s" style="margin-top:24px">{figs}</div>'''


def motion():
    cells = ''.join(f'''<div class="sy-card" data-dur="{d}" data-ease="{e}"><h3 class="sy-ch">{n} · {d} ms</h3><div class="trk"><div class="box"></div></div><p style="margin-top:8px"><button class="sy-btn sy-btn--o" type="button">Play</button></p></div>'''
                    for n, d, e in [('Quick', 200, 'cubic-bezier(.2,.7,.1,1)'), ('Reveal', 800, 'cubic-bezier(.2,.7,.1,1)'), ('Bars', 1100, 'cubic-bezier(.2,.7,.1,1)'), ('Linear', 800, 'linear')])
    return f'''<h2>Motion</h2>
<div class="sy-scroll"><table class="sy-tbl"><tbody>
<tr><th scope="row">Easing</th><td><code>--m-ease: cubic-bezier(.2,.7,.1,1)</code></td></tr>
<tr><th scope="row">Distance · duration · step</th><td><code>22px · .8s · .08s</code></td></tr>
<tr><th scope="row">Hooks</th><td><code>data-m</code> rise · stagger · bar · barv · count</td></tr>
<tr><th scope="row">Reduced motion</th><td>end state</td></tr>
</tbody></table></div>
<div class="sy-mo" style="margin-top:24px">{cells}</div>'''


def modes():
    def sample(cls, label):
        return f'''<div class="{cls}"><h3 class="sy-ch">{label}</h3>
<div class="sy-row"><a class="sy-btn" href="#modes">Primary</a><a class="sy-btn sy-btn--o" href="#modes">Secondary</a><span class="sy-pill">Pill</span></div>
<div class="sy-card" style="margin-top:14px"><h3 class="sy-ch">Card</h3><p>Body text on the surface. <a class="sy-lnk" href="#modes">Link</a></p></div>
<div class="sy-cta" style="margin-top:14px"><b>One ask</b><a class="sy-btn" href="#modes">Book</a></div></div>'''
    return f'''<h2>Modes</h2>
<div class="sy-mm">{sample("d","Dark")}{sample("l","Light")}</div>'''


def templates():
    out = []
    for t in TEMPLATES:
        ol = ''.join(f'<li>{E(a)}</li>' for a in t['anatomy'])
        out.append(f'''<article class="sy-card"><div><h3>{E(t["name"])}</h3>
<ol class="sy-ol">{ol}</ol>
<dl><dt>File</dt><dd><code>{t["file"]}</code></dd><dt>CSS</dt><dd>{E(t["css"])}</dd><dt>Parts</dt><dd>{E(t["comp"])}</dd><dt>Phone</dt><dd>{E(t["phone"])}</dd></dl>
<p style="margin-top:12px"><a class="sy-lnk" href="{t["file"]}">Open the live page {svg("arrow",16)}</a></p></div>
<div class="sy-th"><figure class="m"><img src="assets/system/thumbs/{t["id"]}-390.webp" alt="{E(t["name"])}, 390 px wide" width="96" height="208" loading="lazy"><figcaption class="sy-cap">390</figcaption></figure>
<figure class="d"><img src="assets/system/thumbs/{t["id"]}-1440.webp" alt="{E(t["name"])}, 1440 px wide" width="360" height="225" loading="lazy"><figcaption class="sy-cap">1440</figcaption></figure></div></article>''')
    return f'''<h2>Page templates</h2>
<p class="sy-note">10 types · first screen at 390 and 1440 px</p>
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
</div>
<div class="sy-tabs"><div role="tablist" aria-label="Library sections">{tabs}</div></div>
<div class="sy-body">{pan}</div>
</main>
<footer class="sy-ftr"><code>docs/revolution-design-system.md</code></footer>
<script src="assets/system/system.js"></script>
</body>
</html>
'''
    open(os.path.join(ROOT, 'system.html'), 'w').write(doc)
    print('system.html', len(doc))


if __name__ == '__main__':
    main()
