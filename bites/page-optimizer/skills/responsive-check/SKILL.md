---
name: responsive-check
description: Sprawdza gotowość strony na urządzenia mobilne i tablet. Użyj gdy użytkownik pyta "czy strona jest responsywna", "mobile-friendly", "jak wygląda na telefonie", "breakpoints", "touch targets" lub gdy audit-page sygnalizuje problemy z mobile. Nie edytuje pliku — tylko raportuje.
---

# Responsive readiness — checklista mobilna

Przeczytaj plik HTML i sprawdź każdy z poniższych punktów. Wynik podaj jako tabelę z oceną ✅ / ⚠️ / ❌ i konkretnym fragmentem kodu.

## 1. Viewport i meta

- [ ] `<meta name="viewport" content="width=device-width, initial-scale=1.0">` — obecny?
- [ ] Brak `user-scalable=no` lub `maximum-scale=1` (blokują powiększanie — dostępność)
- [ ] `<meta name="theme-color">` — obecny?

## 2. Breakpoints

Wypisz wszystkie `@media` queries ze strony i oceń:
- Czy pokrywają co najmniej: ≤640px (mobile), ≤1024px (tablet)?
- Czy nie ma "dziur" (np. brakuje 768px między 640 a 1024)?
- Czy grid/flex collapsuje do jednej kolumny na mobile?
- Czy `grid-template-columns: repeat(3, 1fr)` ma odpowiednik `1fr` lub `repeat(2, 1fr)` poniżej 640px?

## 3. Touch targets

Elementy klikalnymonaszym na mobile muszą mieć **min 44×44px** (Apple HIG / WCAG 2.5.5):
- [ ] Przyciski `.btn` — sprawdź `padding` i oblicz przybliżoną wysokość
- [ ] Linki nawigacyjne — czy `padding` daje ≥44px wysokości?
- [ ] Hamburger button — czy ma `width: 44px; height: 44px` lub więcej?
- [ ] FAQ `<summary>` — czy `padding: 22px 28px` daje ≥44px?
- [ ] Linki w stopce — czy gap między nimi ≥8px?

## 4. Typografia na mobile

- [ ] `font-size` body ≥16px (zapobiega auto-zoom w iOS Safari)
- [ ] Nagłówki: czy używają `clamp()` lub `vw` jednostek zamiast stałych px?
- [ ] `line-height` ≥1.4 dla tekstów długich (czytanie na małym ekranie)
- [ ] Czy `max-width` na `.container` ≤ szerokości viewport z odpowiednim paddingiem?

## 5. Obrazy

- [ ] Czy wszystkie `<img>` mają `max-width: 100%`?
- [ ] Czy hero image nie jest zbyt duży dla mobile (aspect-ratio, `object-fit`)?
- [ ] Czy `loading="lazy"` jest na wszystkich poza LCP image?
- [ ] Czy `width` i `height` atrybuty są podane (zapobiega CLS)?

## 6. Poziomy scroll

- [ ] `overflow-x: hidden` na `body`? (Dobry sygnał, ale sprawdź czy nie ukrywa prawdziwego problemu)
- [ ] Czy żaden element nie ma `width` większego niż viewport (np. `min-width: 1200px` bez media query)?
- [ ] Czy grid/flex nie wychodzi poza kontener?

## 7. Mobile sticky bar

- [ ] Czy jest dedykowany `.mobile-bar` (sticky CTA) dla mobile?
- [ ] Czy `display: none` na desktop i `display: flex` poniżej breakpointu?
- [ ] Czy body ma `padding-bottom` odpowiadający wysokości baru?

## 8. Nawigacja mobilna

- [ ] Czy `.nav-menu` jest ukryta poniżej breakpointu (`display: none`)?
- [ ] Czy hamburger jest widoczny tylko na mobile?
- [ ] Czy drawer/menu mobilne działa bez JS (graceful degradation)?

## 9. Formularze

- [ ] Czy `<input type="tel">` i `<input type="email">` mają odpowiedni `type` (otwiera właściwą klawiaturę)?
- [ ] Czy `form-row` (2 kolumny) collapsuje do 1 kolumny poniżej 640px?
- [ ] Czy textarea ma sensowną `min-height` na mobile?

## 10. Wydajność mobilna

- [ ] Czy animacje CSS są wyłączone przy `prefers-reduced-motion`?
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
}
```
- [ ] Czy tła z `backdrop-filter: blur()` mają fallback? (kosztowne na słabym sprzęcie)

## Format raportu

```markdown
## Responsive Readiness

| Obszar | Ocena | Uwagi |
|---|---|---|
| Viewport meta | ✅ | Prawidłowy |
| Breakpoints | ⚠️ | Brakuje 768px dla tabletów |
| Touch targets | ❌ | Linki nav: ~28px wysokości — za małe |
| Typografia | ✅ | clamp() użyte prawidłowo |
| Obrazy | ✅ | max-width: 100%, lazy loading |
...

### Problemy do naprawy
1. [konkretny problem + fragment kodu + propozycja fix]
```

Jeśli użytkownik chce zastosować fixes, przekaż je do skill `optimize-page`.
