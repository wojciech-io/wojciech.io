# Checklista audytu strony landing page

## 1. TREŚĆ I TEKSTY

- [ ] Em-dashe: policz ile jest `—`/`&mdash;`. Dopuszczalne max ~10-12. Każde nadmiarowe zaznacz.
- [ ] Powtórzenia: szukaj identycznych fraz w różnych sekcjach (szczególnie h2 vs opis usługi)
- [ ] Spójność form zwrotu: Ty/Twój vs Wy/Wasz vs Państwo — jedno przez całą stronę
- [ ] CTA na końcu kart: czy karty mają call-to-action, czy "wiszą"?
- [ ] Niespójność nazw własnych (firmowych, marek, produktów): wypisz wszystkie warianty
- [ ] Cytaty typograficzne: czy `::before`/`::after` w CSS używają polskich `„..."` zamiast `"`?
- [ ] Błędne nazwy klas (`portrait-svg` na elemencie `<img>`)
- [ ] Niejasne teksty kroków (np. "Przyjdź lub otwórz drzwi" bez kontekstu)
- [ ] Brakujące kluczowe informacje (godziny pracy, czy przyjmuje nowych pacjentów, czas oczekiwania)

## 2. WIZUALIA & DESIGN

- [ ] Hover kolory — czy pasują do palety? Sprawdź `:hover` na każdym `.btn-*`
- [ ] Border-radius: czy karty używają ≥12px? (4px wygląda przestarzale w 2025+)
- [ ] Galeria: liczba slotów w CSS vs liczba zdjęć w HTML — czy grid ma puste miejsca?
- [ ] Portrait caption: czy `bottom: negative` nie ucieka poza ramkę na mobile?
- [ ] Drop cap (`::first-letter`): czy `line-height` i `float` działają z polskim alfabetem?
- [ ] Brakujące elementy: godziny pracy, sticky CTA bar, wyróżnienie głównego CTA
- [ ] Review cards: czy najkrótsza opinia nie psuje grid alignment?

## 3. MIKRO-ANIMACJE

- [ ] IntersectionObserver scroll reveal: czy sekcje wchodzą przy scrollu?
- [ ] Animowane liczniki: czy liczby (80, 16 lat, itp.) animują się przy wejściu w viewport?
- [ ] FAQ: czy `<details>` ma smooth animation (CSS @starting-style lub JS)?
- [ ] Scrollspy: czy aktywna sekcja jest podkreślona w nawigacji?
- [ ] Hover overlays na galerii: czy zdjęcia mają overlay z opisem/ikoną lupy?
- [ ] Animacja słoneczka/elementów dekoracyjnych: czy nie jest zbyt wolna (>8s)?

## 4. NAWIGACJA

- [ ] Mobile menu: czy hamburger ma `aria-expanded`?
- [ ] Mobile menu: czy zamknięcie działa przez Escape i kliknięcie poza menu?
- [ ] Mobile menu: czy jest przycisk X / close?
- [ ] Mobile menu: czy menu otwiera się z animacją (drawer, nie inline-flex bez animacji)?
- [ ] Skip link: czy jest `<a href="#main-content" class="skip-link">Przejdź do treści</a>`?
- [ ] Scrollspy: czy aktywny link w nav jest wizualnie wyróżniony podczas scrollu?

## 5. WYDAJNOŚĆ

- [ ] LCP preload: czy hero image ma `<link rel="preload" as="image" fetchpriority="high">`?
- [ ] CDN SRI: czy zewnętrzne skrypty mają `integrity` hash?
- [ ] CDN versioning: czy linki CDN używają pinned version, nie `@latest`?
- [ ] WebP/AVIF: czy obrazy są serwowane w nowoczesnych formatach (`<picture>`)?
- [ ] Font display: czy Google Fonts ma `&display=swap` (domyślnie tak)?
- [ ] Unused CSS: czy są duże bloki CSS na elementy nieistniejące w HTML?

## 6. SEO

- [ ] JSON-LD Schema.org: czy wszystkie `@type` są poprawne (Physician, MedicalBusiness, FAQPage)?
- [ ] FAQPage JSON-LD: czy wszystkie pytania z HTML są też w JSON-LD?
- [ ] Canonical URL: czy nie jest placeholder-em?
- [ ] OG URL: czy nie jest placeholder-em?
- [ ] `<meta name="theme-color">`: czy jest?
- [ ] Alt teksty: czy wszystkie `<img>` mają opisowy `alt`?
- [ ] Robots meta: index/follow na stronie produkcyjnej?
- [ ] Sitemap: czy jest sitemap.xml (dla deploymentu na custom domenie)?

## 7. DOSTĘPNOŚĆ (a11y)

- [ ] Hamburger: `aria-expanded="false/true"`
- [ ] Gwiazdki: `aria-label="5 gwiazdek"` na elemencie `★★★★★`
- [ ] Gallery links: `aria-label` z informacją "(otwiera w nowej karcie)" dla `target="_blank"`
- [ ] Skip link: obecny i działa?
- [ ] Focus visible: czy `:focus-visible` ma wyraźny styl (nie tylko browser default)?
- [ ] Form checkbox: czy ma `id` i `<label for="...">`?
- [ ] Kontrast: czy `--ink-soft` na tle `--cream` spełnia WCAG AA (≥4.5:1 dla small text)?
- [ ] `<main>` element: czy treść jest owinięta w `<main id="main-content">`?

## 8. TECHNOLOGIA

- [ ] Stack: single-file HTML vs framework (Astro, Next.js) — czy stack pasuje do skali?
- [ ] JS: czy jest zbędna zależność CDN, którą można zastąpić natywnym CSS?
- [ ] Form: czy `action="#"` lub `action=""` — trzeba podpiąć pod Formspree/Web3Forms
- [ ] `alert()`: czy nie ma niegrzecznych `alert()` w submit handlerze?
- [ ] Template readiness: czy stronę można łatwo skopiować jako template dla innego lekarza?
