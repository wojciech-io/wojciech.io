---
name: audit-page
description: Audyt strony landing page. Użyj gdy użytkownik poda ścieżkę do pliku HTML i poprosi o audyt, ocenę strony, "co poprawić", "sprawdź stronę" lub "analyze landing page". Generuje plik AUDIT.md przy pliku źródłowym.
---

# Audyt strony landing page

Przeczytaj plik HTML podany przez użytkownika, a następnie wygeneruj szczegółowy plik `AUDIT.md` w tym samym katalogu.

## Jak przeprowadzić audyt

1. Przeczytaj pełny plik HTML (użyj Read z limit/offset jeśli >25 000 tokenów).
2. Przeanalizuj stronę według checklisty z `references/audit-checklist.md`.
3. Wygeneruj raport AUDIT.md w tym samym katalogu co analizowany plik.

## Format AUDIT.md

```markdown
# Audit: [tytuł strony] (`[ścieżka]`)

> Data analizy: [data] · Audytor: Claude

---

## TL;DR

| Obszar | Ocena | Priorytet naprawy |
|---|---|---|
| Architektura & kod | ✅/⚠️/❌ | —/Niski/Średni/Wysoki |
...

---

## 1. TREŚĆ I TEKSTY
[szczegóły]

## 2. WIZUALIA & DESIGN
[szczegóły]

## 3. MIKRO-ANIMACJE
[szczegóły]

## 4. NAWIGACJA
[szczegóły]

## 5. WYDAJNOŚĆ
[szczegóły]

## 6. SEO
[szczegóły]

## 7. DOSTĘPNOŚĆ (a11y)
[szczegóły]

## 8. TECHNOLOGIA
[szczegóły]

## 9. PRIORYTETY — LISTA ZADAŃ

### 🔴 Wysoki priorytet (przed publikacją)
1. ...

### 🟡 Średni priorytet (po publikacji)
...

### 🟢 Niski priorytet (opcjonalnie)
...

## 10. CO DODAĆ, CZEGO NIE DODAWAĆ
...
```

## Zasady oceny

- Każdy obszar oceniaj: ✅ Dobra / ⚠️ Wymaga pracy / ❌ Krytyczny problem
- Priorytety: **Wysoki** = blokuje publikację, **Średni** = istotny UX/SEO, **Niski** = nice-to-have
- Podawaj konkretne fragmenty kodu z propozycją zmiany (tabela: obecny tekst → proponowana zamiana)
- Liczby: em-dashe policz ile ich jest, oceń każdy pojedynczo
- Dostępność: sprawdź aria-*, focus styles, skip link, kontrast
- SEO: sprawdź JSON-LD, title, meta description, canonical, OG, Schema.org
- Wydajność: LCP resource (czy jest preload?), font-display, brak SRI na CDN
- Wzmiankuj na końcu: `Ulepszona wersja: improved/index.html. Plugin do użytku wielokrotnego: plugin/`
