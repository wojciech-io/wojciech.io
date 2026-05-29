---
name: color-review
description: Audyt kolorystyczny strony landing page. Użyj gdy użytkownik pyta "sprawdź kolory", "czy kolory pasują do branży", "kontrast", "WCAG", "paleta kolorów", "czy strona jest czytelna" lub gdy audit-page sygnalizuje problemy z kolorami. Analizuje kontrast, spójność palety i dopasowanie do branży.
---

# Audyt kolorystyczny strony landing page

## Krok 1: Wyodrębnij paletę

Przeczytaj plik HTML i wypisz wszystkie zmienne CSS z kolorami (`:root { --primary: ...; }`), a także kolory użyte inline lub w klasach. Zidentyfikuj:

- **Kolor tła głównego** (body background)
- **Kolor tekstu głównego** (body color)
- **Kolor tekstu pomocniczego** (muted/soft)
- **Primary** (nagłówki, linki, CTA)
- **Accent** (CTA buttons, highlights)
- **Kolory hover** na każdym `.btn-*` i linkach

## Krok 2: Sprawdź kontrast WCAG

Dla każdej pary tekst/tło oblicz współczynnik kontrastu (**CR**) wg WCAG 2.1:

```
CR = (L1 + 0.05) / (L2 + 0.05)    gdzie L1 > L2 (relative luminance)
```

Względna luminancja dla kanału RGB:
```
sRGB → liniowy: v <= 0.04045 ? v/12.92 : ((v+0.055)/1.055)^2.4
L = 0.2126*R + 0.7152*G + 0.0722*B
```

**Progi WCAG 2.1:**

| Poziom | Mały tekst (<18pt / <14pt bold) | Duży tekst (≥18pt / ≥14pt bold) | UI (ikony, border) |
|---|---|---|---|
| AA | 4.5:1 | 3:1 | 3:1 |
| AAA | 7:1 | 4.5:1 | — |

**Kluczowe pary do sprawdzenia:**
1. Tekst główny (`--ink`) na tle głównym (`--cream` / `--paper`)
2. Tekst pomocniczy (`--ink-soft`) na tle głównym
3. Tekst CTA (kolor tekstu) na tle przycisku (`--primary`, `--accent`)
4. Tekst CTA w stanie hover
5. Tekst na ciemnym tle (footer, dark sections)
6. Elementy dekoracyjne / ikony vs tło

Wynik podaj w tabeli:

| Para | Tekst | Tło | CR | WCAG AA | WCAG AAA |
|---|---|---|---|---|---|
| Tekst główny | `#1A2733` | `#F5EFE6` | 12.4:1 | ✅ | ✅ |
| Tekst soft | `#5C6975` | `#F5EFE6` | 4.7:1 | ✅ | ❌ |
| ... | ... | ... | ... | ... | ... |

## Krok 3: Sprawdź spójność palety

- Czy kolory hover pasują do bazowego koloru (ciemniejszy odcień, nie inny kolor)?
- Czy te same kolory nie mają wielu zmiennych o różnych nazwach (np. `--gold` i `--accent` z tym samym hex)?
- Czy secondary/accent nie wchodzą w kolizję (za mały kontrast między sobą)?
- Czy dekoracyjne elementy (ikony, borders) nie giną w tle?

## Krok 4: Oceń dopasowanie do branży

Na podstawie treści HTML określ branżę i oceń paletę:

**Jak wykryć branżę:**
- Słowa kluczowe w `<title>`, `<h1>`, `<meta name="description">`, Schema.org `@type`
- Np. "Physician", "MedicalBusiness" → medyczna; "Restaurant" → gastronomia; "Hotel" → hospitality

**Profile branżowe:**

| Branża | Oczekiwane skojarzenia | Kolory pasujące | Kolory odradzane |
|---|---|---|---|
| **Medyczna (lekarz/klinika)** | Zaufanie, spokój, czystość, profesjonalizm | Odcienie niebieskiego, bieli, zieleni mięty; ciepłe kremy jeśli prywatna praktyka | Jaskrawa czerwień, neon, czerń jako dominant |
| **Pediatryczna** | Ciepło, przyjaźń, radość, bezpieczeństwo | Ciepłe niebieskie, żółte/musztardowe akcenty, morelowe; pastele | Zimne szarości, corporate granat |
| **Prawnicza** | Autorytet, zaufanie, powaga | Granaty, czernie, złoto, białe tło | Jaskrawe kolory, pastele |
| **Restauracja** | Apetyt, ciepło, atmosfera | Czerwień, pomarańcze, brązy, zieleń (organika) | Niebieskie (tłumi apetyt) |
| **Hotel / hospitality** | Luksus, spokój, gościnność | Złoto, kremowe, głęboka zieleń, burgund | Krzykliwe neonowe |
| **Tech / SaaS** | Innowacja, efektywność | Niebieskie, fioletowe, zielone akcenty | Ciemny brąz, przełamane odcienie |
| **Fitness / sport** | Energia, motywacja | Pomarańcz, czerwień, czerń, żółty | Pastelowe, zbyt spokojne |
| **Edukacja dzieci** | Zabawa, ciekawość, bezpieczeństwo | Tęczowe akcenty, żółty, niebieski, zielony | Ciemne, industrialne |

**Oceń:**
- Czy dominujący kolor strony pasuje do branżowego profilu?
- Czy accent color wzmacnia skojarzenia, czy im przeczy?
- Czy strona odróżnia się od konkurencji (nie jest identyczna jak wszystkie strony w tej branży)?

## Krok 5: Wygeneruj raport

Zakończ konkretnym podsumowaniem w formie:

```markdown
## Ocena kolorystyczna

### Paleta
[Tabela zmiennych CSS z hex i nazwą semantyczną]

### Kontrast WCAG
[Tabela par tekst/tło z wynikami CR]

### Problemy
- [lista konkretnych problemów z propozycją hexa]

### Dopasowanie do branży
Branża: [wykryta]
Ocena: ✅ Bardzo dobra / ⚠️ Wymaga korekty / ❌ Niezgodna
[komentarz]

### Propozycje poprawek
| Element | Obecny kolor | Proponowany kolor | Powód |
|---|---|---|---|
| .btn-accent:hover | #b15634 | #c9a030 | Inny odcień niż paleta |
```

## Uwagi

- Nie zmieniaj pliku HTML bez wyraźnej prośby — ten skill tylko audytuje
- Jeśli użytkownik poprosi o zastosowanie poprawek, użyj skill `optimize-page`
- Podawaj konkretne hexy propozycji, nie "ciemniejszy odcień" — oblicz lub zaproponuj z palety
- Przy medycznej stronie pediatrycznej: paleta ciepłych pasteli (musztarda + niebieski + krem) jest uzasadniona branżowo — nie "poprawiaj" jeśli jest spójna i czytelna
