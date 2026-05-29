---
name: visual-harmony
description: Audyt spójności wizualnej strony — typografia, spacing, shadows, border-radius, ikony, animacje. Użyj gdy użytkownik pyta "czy strona wygląda spójnie", "visual design", "typografia", "spacing", "czy to dobrze wygląda graficznie", "design consistency" lub "czy elementy do siebie pasują".
---

# Visual Harmony — spójność graficzna

Spójność wizualna to nie "ładność" — to brak dysonansu. Użytkownik nie zauważy spójnego designu, ale natychmiast poczuje, gdy coś "nie gra".

## Krok 1: Wyodrębnij system designu ze strony

Przeczytaj CSS i wypisz:

### Skala border-radius
Wszystkie wartości `border-radius` użyte na stronie — czy tworzą system (np. 4/8/12/999px) czy są losowe?

### Skala typografii
Wszystkie `font-size` użyte w CSS. Sprawdź czy tworzą harmoniczną skalę (np. `clamp` + proporcje 1.25× lub 1.333×).

### Skala spacing
Typowe wartości `padding`, `margin`, `gap`. Czy są wielokrotnościami jednej jednostki (np. 4px → 8 → 12 → 16 → 24 → 32 → 48 → 64 → 80 → 100)?

### Skala shadows
Wszystkie `box-shadow`. Czy są spójne (rosnąca głębokość) czy losowe offsety i opacities?

### Rodziny fontów
Które fonty są display (nagłówki) a które body? Czy są max 2 rodziny?

## Krok 2: Audyt spójności

### 2.1 Border-radius consistency

**Problemy do wykrycia:**
- Karty mają różne border-radius (np. `feature-card: 12px`, `review-card: 4px`)
- Przyciski mają `999px` (pill), ale inputy mają `0` (pełny prostokąt) — silny kontrast bez uzasadnienia
- Mapa/iframe ma inny border-radius niż karty

**Zasada:** mały border-radius (4-8px) = poważny/corporate; duży (12-20px) = przyjazny/nowoczesny; pill (999px) = tylko dla buttonów. Wybierz jeden styl i trzymaj się go.

### 2.2 Typography hierarchy

Sprawdź czy hierarchia `h1 > h2 > h3 > body > small` jest wizualnie czytelna:
- Czy `h1` jest wyraźnie większy od `h2`? (min 20% różnicy)
- Czy `h3` różni się od body text? (weight lub size)
- Czy małe teksty (`0.78rem`) są czytelne przy obecnym kolorze?
- Czy font display (Fraunces, Playfair) jest używany tylko dla nagłówków, nie dla body?
- Czy `font-weight` zmienia się sensownie (nie ma 5 różnych wag)?

### 2.3 Spacing rhythm

"Breathing room" — czy sekcje nie są za gęste lub za rzadkie?
- Czy `section { padding: 100px 0 }` jest spójne przez całą stronę?
- Czy odstępy wewnątrz kart (padding) są spójne między typami kart?
- Czy gap między ikonami, tytułem i tekstem jest spójny w kartach?
- Czy nagłówki sekcji mają wystarczający `margin-bottom` przed siatką kart?

### 2.4 Icon style consistency

Jeśli ikony pochodzą z biblioteki (Lucide, Heroicons itp.):
- Czy wszystkie ikony są z tej samej biblioteki? (mix Lucide + Font Awesome = brak spójności)
- Czy rozmiary ikon są z ograniczonego zestawu (16/18/22/24/26px) czy losowe?
- Czy ikony dekoracyjne (SVG inline, emoji) mają inny styl niż ikony UI (Lucide)?

### 2.5 Motion & animation consistency

- Czy wszystkie `transition` używają tego samego easingu (np. `ease`, `cubic-bezier(...)`)? Mix `ease` i `linear` bez powodu = dysonans.
- Czy czas trwania jest ze skali (np. .25s / .35s / .5s / .6s)? Losowe wartości (`.37s`, `.42s`) to zapach kopiowania z tutoriali.
- Czy animacje wejścia (fadeUp) są spójne (ten sam `duration` i `easing` wszędzie)?
- Czy hover transform (`translateY(-4px)`) jest konsekwentny na kartach tego samego typu?

### 2.6 Color usage consistency

(Uproszczone — pełen audyt koloru robi `/color-review`)
- Czy `--accent` i `--warm` są używane wymiennie czy każdy ma swoją rolę?
- Czy dekoracje mają przypisane kolory (konfetti zawsze `--accent + --warm + --primary`) czy losowe?
- Czy `.eyebrow` (mały uppercase label) ma zawsze ten sam kolor i styl?

## Krok 3: Ocena kompozycji sekcji

Przejdź przez sekcje strony:

| Sekcja | Kompozycja | Problem |
|---|---|---|
| Hero | 2-kolumnowa (tekst + portret) | Czy proporcje (1.1fr / 0.9fr) wyglądają naturalnie? |
| For-whom | 3 karty | Czy karty mają równą wysokość lub naturalny stagger? |
| About | Portret + tekst | Czy portret nie jest za duży/za mały vs tekst? |
| Services | 3+3+1 grid | Czy ostatnia karta (7. element) jest wycentrowana? |
| Gallery | Grid 2+2 | Czy proporcje zdjęć grają z gridowymi slotami? |

## Krok 4: Raport

```markdown
## Visual Harmony Audit

### System designu
| Element | Wartości użyte | Ocena |
|---|---|---|
| Border-radius | 4px, 8px, 12px, 999px | ✅ Spójna skala |
| Spacing | 8/12/16/20/24/28/32/40/48/64/80/100px | ✅ Rytm 4px |
| Font sizes | 0.78/0.82/0.88/0.92/0.95/1.02/1.05/1.08/1.1/1.15/1.2/1.25/1.35/1.4/1.6/1.8/3/4.2rem | ⚠️ Za dużo stopni |
| Shadows | 3 różne zestawy | ✅ Rośnie z elevacją |
| Transition easing | ease, .25s–.6s | ✅ Spójne |

### Problemy spójności
1. [konkretny problem z fragmentem kodu]

### Ocena ogólna
Spójność wizualna: ✅ Wysoka / ⚠️ Średnia / ❌ Niska
[2-3 zdania]
```

## Wskazówki dla branży

**Strona medyczna/lekarza prywatnego:**
- Editorial style (magazine-like) = duże nagłówki, asymetria, editorial typography → OK gdy konsekwentny
- Mieszanie "premium editorial" z "corporate tiles" = dysonans
- Konfetti i słoneczko przy pediatrze = uzasadnione branżowo, NIE błąd designu
- Zbyt dużo dekoracji na stronie medycznej obniża zaufanie — max 2-3 elementy dekoracyjne

**Ogólna zasada:**
Strona ma "grać" gdy: paleta ≤4 kolory, fonty ≤2 rodziny, border-radius z jednego systemu, animacje o tym samym charakterze. Każde odstępstwo wymaga uzasadnienia.
