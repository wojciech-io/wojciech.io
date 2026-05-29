---
name: optimize-page
description: Generuje ulepszoną wersję strony landing page na podstawie audytu. Użyj gdy użytkownik pyta "zastosuj poprawki", "popraw stronę", "wygeneruj improved version", "napraw błędy z audytu" lub po zakończeniu audit-page. Wymaga ścieżki do pliku HTML (i opcjonalnie AUDIT.md).
---

# Optymalizacja strony landing page

Na podstawie audytu (AUDIT.md) lub bezpośredniej analizy pliku HTML zastosuj poprawki i zapisz ulepszoną wersję.

## Kolejność działań

1. Przeczytaj `AUDIT.md` jeśli istnieje; jeśli nie — najpierw wywołaj skill `audit-page`.
2. Przeczytaj cały plik HTML źródłowy (Read z offset/limit jeśli duży).
3. Skopiuj plik do `improved/index.html` (skopiuj też folder `assets/` jeśli istnieje).
4. Zastosuj poprawki według priorytetów z `references/optimization-patterns.md`.
5. Zweryfikuj zmiany: otwórz improved/index.html w przeglądarce jeśli możliwe.

## Priorytety

Zawsze stosuj **wszystkie poprawki wysokiego priorytetu** przed przejściem do średnich. Poprawki niskiego priorytetu tylko jeśli użytkownik tego chce.

### Wysoki (przed publikacją)
- Błędny kolor hover na głównym CTA button
- Mobile menu bez aria-expanded, bez zamknięcia przez Escape
- `alert()` w submit handlerze formularza
- `@latest` w CDN bez pinned version
- Brak `preload` dla hero image (LCP)
- Nadmiar em-dashów (>15 w dokumencie)
- Niespójne nazwy własne (firma, marka)
- Błędne nazwy klas CSS
- Brak kluczowych informacji (godziny pracy lekarza/gabinetu)

### Średni (po publikacji)
- Border-radius kart: min 12px
- IntersectionObserver scroll reveal dla sekcji
- Counter-up animacja dla liczb statystycznych
- Smooth FAQ animation
- Scrollspy aktywny stan w nawigacji
- Brakujące FAQ w JSON-LD FAQPage
- `<meta name="theme-color">`
- Gallery lightbox zamiast surowego target="_blank"

### Niski (opcjonalnie)
- WebP `<picture>` dla obrazów
- Skip link
- Ulepszone focus-visible styles
- Sitemap.xml i robots.txt

## Zasady edycji

- Nie zmieniaj treści merytorycznej (dane lekarza, adresy, ceny) — zmieniaj tylko formę
- Przy redukcji em-dashów: zamień przecinkiem lub przebuduj zdanie, zachowaj max ~10-12 znaczących
- Przy spójności form zwrotu: stosuj Ty/Twój przez całą stronę (wyjątek: rodzice jako para = Wy)
- Przy menu mobilnym: zastąp drawer-em z backdrop, aria-modal, close-on-escape i outside-click
- Przy success state formularza: ukryj formularz, pokaż elegancki div z podziękowaniem
- Przy scroll reveal: klasa `.is-reveal` (opacity:0, translateY 20px) → `.is-visible` (opacity:1, translateY 0)
- Przy counterach: animuj tylko liczby w `.trust-num` (IntersectionObserver + requestAnimationFrame)

## Po zakończeniu

Poinformuj użytkownika:
- Które z poprawek wysokiego priorytetu zostały zastosowane
- Które wymagają ręcznej interwencji (np. podpięcie Formspree, dostarczenie prawdziwego URL)
- Które poprawki średniego priorytetu zostały dodane
- Lokalizacja pliku wynikowego
