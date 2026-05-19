# Handoff — wojciech.io + app.wojciech.io

**Data:** 2026-05-19, koniec sesji Claude. Następna sesja: Codex.
**Cel handoffu:** Codex może wejść w pracę bez konfliktów. Wszystko tu opisane jest LIVE na produkcji (zweryfikowane curl-em).

---

## TL;DR — co się zmieniło w tej sesji

1. **i18n A–E3** zmergowane do `main` wojciech.io (PL/IT na 8 stronach). LIVE.
2. **`app.wojciech.io` auth** zmigrowane na server-side gate (Pages Functions + plain `APP_PASSWORD` + signed cookie). LIVE.
3. **Worktree cleanup** — 4 worktrees + 4 stale branche skasowane. Zostają tylko `main` + `claude/busy-jackson-811b2a`.
4. **MDX rich components** — Stat, StatRow, DoDont, TLDR + 6 site UI drop-inów (Badge, Button, CTABand, FAQ, SectionHeader, ProofCard). LIVE.
5. **Dark-olive accent retirement** — wszystkie `#596400`/`#3d4400`/`#7a9900`/`#2a2e00`/`#6b7400` → `#171717` w light mode. Lime CTA `#ebff00` zostaje. LIVE.
6. **Callout redesign** — Variant B: icon badge card, lime kółko dla tip, amber dla warning. LIVE.
7. **Diagram primitives** — `<Diagram>`, `<Box>`, `<Arrow>`, `<Stack>`. Composable, dark-mode-aware, mobile responsive. LIVE.

---

## Repos i zasady deploy

| Repo | Ścieżka | Branch produkcji | Zasada |
|---|---|---|---|
| `wojciech.io` | `/Users/wojciech/wojciech.io/` | `main` → CF Pages | **Push do main swobodnie** |
| `wojciech-app` | `/Users/wojciech/wojciech-app/` | `main` → CF Pages | **Branch/preview only, prod deploy tylko z greenlight** |

Memory ref: `~/.claude/projects/-Users-wojciech-wojciech-io/memory/feedback_deploy_authorization.md`

## Stan `wojciech.io`

**Branch produkcji:** `main` @ `4c61520`
**Active branches:** `main`, `claude/busy-jackson-811b2a` (= `main`)
**Worktrees:**
- `/Users/wojciech/wojciech.io/` (main checkout — UWAGA: lokalnie pozostał za remote, zrób `git pull` przy pierwszym wejściu)
- `/Users/wojciech/wojciech.io/.claude/worktrees/busy-jackson-811b2a/` (active session worktree)

### Główne commity tej sesji (8 sztuk)

```
4c61520  feat(insights): diagram primitives — Diagram, Box, Arrow, Stack
3698125  feat(insights): redesign Callout — icon badge card (variant B)
710a20f  style: retire dark-olive accent — neutral near-black in light mode
a1c4c57  feat(insights): rich MDX components — Stat/StatRow, DoDont, TLDR + site UI drop-ins
02382fe  fix(dev): hardcode preview port to 4399
415c416  feat(i18n): translate ai-systems page to PL/IT (slice E3)
dcdcf35  feat(i18n): dedup apps page, fix PL/IT diacritic defects (slice E2)
50ca93b  feat(i18n): translate subscribe page to PL/IT with B+A voice (slice E1)
```

### Architektura — co Codex MUSI wiedzieć przed edycją

**Każda strona = jedno źródło treści + dwa thin wrappery.**

```
src/components/pages/{Page}Content.astro     ← TREŚĆ (jedno źródło)
src/pages/{page}.astro                       ← wrapper EN canonical
src/pages/[lang]/{page}.astro                ← wrapper PL/IT przez getStaticPaths
```

Strony objęte tym wzorcem: about, contact, now, work, subscribe, apps, ai-systems, cv, resources. Homepage używa innego mechanizmu (`src/i18n/translations.ts` + `[lang]/index.astro`).

**Konsekwencja: nie edytuj treści w dwóch miejscach.** Jeśli zmieniasz copy na `/about/`, otwórz `src/components/pages/AboutContent.astro`, NIE root `/about.astro` ani `/[lang]/about.astro`.

**Tłumaczenia w komponentach:** atrybuty `data-en`, `data-pl`, `data-it` na elementach + JS toggle w `Layout.astro`. ProofCard, CTABand, SectionHeader mają opcjonalne propsy `headingPl`/`headingIt` etc.

### MDX rich components (w `src/components/insights/`)

Wpięte do `mdxComponents` w `src/pages/insights/[slug].astro` — usable w każdym `.mdx`:

**Insights-specific:**
- `<Callout type="note|tip|warning" title="...">` — icon-badge card (Variant B)
- `<Compare>`, `<Flow>`, `<Screenshot>`, `<VideoEmbed>` (istniały wcześniej)
- `<Stat value="47%" label="..." sub="..." />` + `<StatRow cols={2|3|4}>` — proof-led numbers
- `<DoDont do={[...]} dont={[...]} />` — Sadowski-style dwukolumnowe
- `<TLDR items={[...]}>` — także auto-renderowane z frontmatter `tldr: []`

**Diagram primitives** (`src/components/insights/diagrams/`):
- `<Diagram caption="..." direction="row|column">` — wrapper card
- `<Box label="..." sub="..." variant="default|accent|muted|outline" />` — node
- `<Arrow label="..." dashed direction="right|left|both|down" />` — connector
- `<Stack direction="row|column" gap="sm|md|lg">` — grouping (dla fan-out)

**Drop-iny z `src/components/ui/`** (też w MDX):
- `<Badge variant="default|accent|muted">`, `<Button>`, `<CTABand>`, `<FAQ items={[...]}>`, `<SectionHeader>`, `<ProofCard>`

### Living reference

`src/content/insights/component-showcase.mdx` z `draft: true` — zawiera użycie KAŻDEGO rich-komponentu. Flip `draft: false` w dev → odwiedź `/insights/component-showcase/` żeby zobaczyć żywą galerię. Najlepsze miejsce na copy-paste patternów przy pisaniu nowego artykułu.

### Design tokens

`src/styles/tokens.css` — CSS custom properties. Krytyczna zmiana w tej sesji:

```css
/* Light mode: */
--color-accent:      #171717;   /* near-black (było #596400 dark olive) */
--color-accent-cta:  #ebff00;   /* LIME — brand, dla CTA buttons. NIE RUSZAĆ. */
--color-accent-hi:   #000000;   /* hover */
--color-accent-lo:   #f3ff59;   /* pale yellow bg tint (NIE jest greenish) */

/* Dark mode: */
--color-accent:      #ebff00;   /* lime safe na ciemnym tle */
--color-accent-lo:   #2a2a2a;   /* było #6b7400 olive */
```

**ZASADA:** żadnych dark-olive / khaki / greenish hex'ów. Lime `#ebff00` zostaje jako brand CTA. Jeśli piszesz nowy komponent który chce "accent text" w light mode — używaj `var(--color-accent)` (= #171717) i polegaj na typography/weight dla wyrazistości, nie na kolorze.

### Content collections

`src/content.config.ts`:
- `insights` — `*.mdx` w `src/content/insights/`. Schema: title, description, publishedAt, tags, tldr[], featured, draft, ogImage, coverType, category. Filter `!draft` w `[slug].astro` getStaticPaths i `insights/index.astro`.
- `work` — `*.json` w `src/content/work/`.

**Decyzja:** insights = EN-only. Nie tłumaczone. Nie zmieniaj bez konsultacji.

### Tone of voice

`docs/10-tone-of-voice.md` — B+A blend (Sadowski base + Flanagan edge). Wszystkie copy follow ten spec.
Memory ref: `~/.claude/projects/.../feedback_tone_of_voice.md`

---

## Stan `wojciech-app` (app.wojciech.io)

**Branch produkcji:** `main` @ `82877b8` — LIVE z server-side gate.

### Architektura auth

```
functions/
  _middleware.ts        ← gate przed origin: 401 + login.html jeśli brak cookie
  _utils/crypto.ts      ← HMAC sign/verify + base64url
  api/auth.ts           ← POST: validate password, set cookie. DELETE: logout.
public/
  login.html            ← Wojtkowy design 1:1 z poprzedniego gate'u, avatar inline data-URI
index.astro             ← bez inline #gate (server-side gate zastąpił JS gate)
```

### Env vars w CF Dashboard (Workers & Pages → wojciech-app → Settings → Variables)

| Variable | Type | Value | Środowiska |
|---|---|---|---|
| `APP_PASSWORD` | Secret | Wojtkowe hasło (plain text) | Production + Preview |
| `COOKIE_SECRET` | Secret | losowy base64url | Production + Preview |

Stary `PASSWORD_HASHES` — nieużywany, ignorowany przez kod. Może być, ale można skasować.

### Jak dodać kolejną osobę

B1 to **współdzielone hasło**. Nie ma per-person. Żeby dodać per-osoba: rozszerzyć `auth.ts` do listy haseł (np. CSV w env). Nie zrobione — do zrobienia gdy potrzeba.

### Sesja cookie

30 dni domyślnie. Reset wszystkich sesji = zmiana `COOKIE_SECRET` w CF (wymaga retry deployment żeby zbindowała).

---

## Worktree + branche — stan końcowy

```
worktrees:
  /Users/wojciech/wojciech.io                                        main @ a1c4c57 (BEHIND — pull)
  /Users/wojciech/wojciech.io/.claude/worktrees/busy-jackson-811b2a  claude/busy-jackson-811b2a @ 4c61520

branches local: main, claude/busy-jackson-811b2a
branches remote: main
```

**Codex pierwsze ruchy:**
```bash
cd /Users/wojciech/wojciech.io
git fetch && git pull --ff-only         # main z a1c4c57 → 4c61520
```

Jeśli busy-jackson worktree już nie jest potrzebny — można skasować:
```bash
git worktree remove /Users/wojciech/wojciech.io/.claude/worktrees/busy-jackson-811b2a
git branch -d claude/busy-jackson-811b2a
```

---

## Co OTWARTE — od czego Codex może zacząć

### 1. Backup / odporność CF (decyzja → implementacja)

**Status:** tylko rozmowa, zero kodu. Plan: **Krok 1 + 3**:
- **Krok 1** — Better Uptime ping co 1 min na wojciech.io, app.wojciech.io. Alert Slack/email/SMS. Free tier.
- **Krok 3** — statyczna jednostronicowa wizytówka offline na nie-CF infra (Netlify lub GitHub Pages). URL trzymany w bio LinkedIn jako fallback.

**Decyzja czeka.** Krok 4 (auto-failover DNS) odrzucony jako nadinżynieria.

### 2. (Opcjonalne) About hero polish

Hero `about` jest faktualny:
> "Wojciech Łuszczyński — I build AI-native revenue systems for B2B SaaS and technology companies."

Wariant B+A (propozycja, niewdrożona):
> "Wojciech Łuszczyński — I build the revenue system, then stay until it runs. Operator for B2B SaaS and technology companies."

Tradeoff: powtarza homepage hero. Mój osąd był: zostawić faktualnie. Decyzja Wojtka otwarta.

### 3. (Opcjonalne) IT native review

Tłumaczenia IT na apps + ai-systems były pisane przeze mnie, nie native speakera. Pliki:
- `src/components/pages/AppsContent.astro`
- `src/components/pages/AiSystemsContent.astro`

### 4. (Opcjonalne) Dodatkowe MDX komponenty z drugiego rzutu

Rozważone, nie zbudowane:
- `<Steps>` — numerowany proces z opisem
- `<PullQuote>` — wyróżniony cytat duża typografia
- `<TechStack>` — lista narzędzi z badge'ami
- `<TOC>` — auto-table-of-contents z H2/H3, sticky sidebar

### 5. (Opcjonalne) Artykuł o transferze strony

Wojtek zasugerował napisanie artykułu o przepisaniu strony. Honest angle do podkreślenia:

**System tłumaczeń** — nie "super zaawansowane", ale **pragmatyczne**:
- Astro `[lang]/` routing + `getStaticPaths`
- `translations.ts` (typed dict) tylko dla homepage
- `data-en/pl/it` attributes + JS toggle dla reszty
- Mixed pattern = inkrementalny debt, ale ~200 stringów × 3 języki nie potrzebuje i18next
- Co działa, gdzie się złamie, kiedy biblioteki mają sens

To jest Sadowski-style build vs buy decyzja — dokładnie ten format który audiencja chce czytać.

---

## Memory (`~/.claude/projects/-Users-wojciech-wojciech-io/memory/`)

Pliki memory aktywne:
- `feedback_deploy_authorization.md` — wojciech.io free push, app.wojciech.io tylko branch
- `feedback_tone_of_voice.md` — copy follows docs/10-tone-of-voice.md

Jeśli Codex nie czyta memory plików Claude'a — wszystko ważne i tak jest w tym handoffie.

---

## Verification — to wszystko zostało zweryfikowane przed handoffem

```
GET https://wojciech.io/                                              → 200
GET https://wojciech.io/insights/cloudflare-migration-zero-trust-free-tier/
    HTML zawiera: callout__icon, callout__label, class="callout"     ← new Callout B
    HTML NIE zawiera: #596400, #3d4400, #7a9900                       ← olive gone
GET https://wojciech.io/mockups/callout-variants/                     → 404 (mockup nie shipnęło, dobrze)
GET https://wojciech.io/insights/component-showcase/                  → 404 (draft, dobrze)
GitHub origin/main = 4c61520                                          ← latest commit
```

---

## Pierwszy ruch dla Codex

1. `cd /Users/wojciech/wojciech.io && git fetch && git pull --ff-only`
2. Przeczytaj ten plik (HANDOFF.md) w całości
3. Sprawdź [src/content/insights/component-showcase.mdx](src/content/insights/component-showcase.mdx) (draft) — to żywa galeria wszystkich MDX komponentów
4. Spytaj Wojtka co dalej — sugestie w sekcji "Co OTWARTE" wyżej
