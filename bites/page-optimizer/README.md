# Page Optimizer Plugin

Plugin dla Claude Code do audytowania i optymalizowania stron landing page (single-file HTML).

---

## Instalacja

### Krok 1 — pobierz plik

Pobierz `page-optimizer.zip` z [wojciech.io/bites](https://wojciech.io/bites/) i rozpakuj. Dostaniesz folder `page-optimizer/`.

### Krok 2 — uruchom instalator

**Windows (PowerShell):**
```powershell
powershell -ExecutionPolicy Bypass -File install.ps1
```

**macOS / Linux:**
```bash
bash install.sh
```

Skrypt skopiuje plugin do `~/.claude/plugins/page-optimizer/`.

### Krok 3 — zrestartuj Claude Code

Po restarcie skille pojawią się automatycznie.

### Instalacja ręczna (alternatywa)

Skopiuj cały folder `page-optimizer/` do:

| System | Ścieżka |
|---|---|
| Windows | `%USERPROFILE%\.claude\plugins\page-optimizer\` |
| macOS / Linux | `~/.claude/plugins/page-optimizer/` |

---

## Skille

### `/audit-page`
Kompleksowy audyt pliku HTML. Generuje plik `AUDIT.md` przy analizowanym pliku.

**Obszary:** treść i copy, em-dashe, wizualia, micro-animacje, nawigacja mobilna, wydajność, SEO, dostępność (a11y), technologia.

**Użycie:**
> *"Zrób audyt tej strony: karwowska/index.html"*
> *"Sprawdź co jest nie tak z tą stroną landing page"*

---

### `/optimize-page`
Tworzy `improved/index.html` z zastosowanymi poprawkami.

**Co naprawia automatycznie:**
- Błędny kolor hover na CTA button
- Menu mobilne bez aria-expanded i bez zamknięcia na Escape
- `alert()` w formularzu → elegancki success state
- `@latest` w CDN → pinned version
- Brak `preload` dla hero image (LCP)
- Nadmiar em-dashów
- Border-radius kart 4px → 12px
- IntersectionObserver scroll reveal
- Counter animacje dla liczb statystycznych
- Scrollspy w nawigacji
- Gallery lightbox zamiast surowego `target="_blank"`
- Brakujące pytania w JSON-LD FAQPage
- Skip link

**Użycie:**
> *"Zastosuj poprawki z audytu"*
> *"Wygeneruj poprawioną wersję tej strony"*

---

### `/color-review`
Audyt kolorystyczny.

**Co sprawdza:**
- Kontrast WCAG AA/AAA dla każdej pary tekst/tło
- Czy kolory hover są spójne z paletą
- Czy paleta pasuje do branży (medyczna, prawnicza, gastronomia, tech…)
- Duplikaty zmiennych CSS z tym samym hexem

**Użycie:**
> *"Sprawdź czy kolory pasują do branży"*
> *"Czy ta strona spełnia WCAG?"*

---

### `/responsive-check`
Audyt mobile readiness.

**Co sprawdza:**
- Touch targets ≥ 44×44px
- Breakpoints bez dziur
- Font-size ≥ 16px (zapobiega auto-zoom iOS)
- `prefers-reduced-motion`
- Obrazy, poziomy scroll, sticky mobile bar

**Użycie:**
> *"Czy strona jest responsywna?"*
> *"Sprawdź jak wygląda na telefonie"*

---

### `/llm-copy`
Optymalizacja treści pod AI (Answer Engine Optimization / GEO).

**Co sprawdza:**
- Czy FAQ odpowiada wprost na pytanie (LLM cytuje bezpośrednie odpowiedzi)
- Pokrycie encji: imię, adres, telefon, ceny, obszar działania
- Em-dashe w kluczowych odpowiedziach (mogą ucinać cytaty)
- Structured data (JSON-LD) vs treść widoczna w HTML
- Jasność copy — czy zdanie z faktem jest zrozumiałe bez kontekstu strony

**Użycie:**
> *"Czy ChatGPT znajdzie moją stronę?"*
> *"Zoptymalizuj copy pod AI"*

---

### `/visual-harmony`
Audyt spójności graficznej.

**Co sprawdza:**
- Skala border-radius — czy jest systemowa?
- Rytm spacingu (wielokrotności 4px/8px)
- Hierarchia typograficzna (h1→h2→h3→body)
- Styl ikon — czy wszystkie z tej samej biblioteki?
- Easing animacji — czy spójny przez całą stronę?
- Kompozycja sekcji i proporcje layoutu

**Użycie:**
> *"Czy design jest spójny?"*
> *"Sprawdź czy strona dobrze wygląda graficznie"*

---

## Rekomendowany workflow

```
1. /audit-page         → ogólny raport, lista zadań
2. /color-review       → kontrast i dopasowanie do branży
3. /responsive-check   → mobile
4. /llm-copy           → widoczność w AI
5. /visual-harmony     → spójność graficzna
6. /optimize-page      → zastosuj wszystkie fixes → improved/index.html
```

Skille 1–5 są **tylko do odczytu** (raportują, nie edytują).
Skill 6 tworzy nowy plik — oryginał pozostaje niezmieniony.

---

## Wymagania

- Claude Code (desktop lub CLI)
- Node.js nie jest wymagany — plugin działa w sesji Claude

---

## Licencja

MIT — możesz modyfikować i dystrybuować swobodnie.
