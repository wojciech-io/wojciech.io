---
name: llm-copy
description: Audyt i optymalizacja treści pod AI/LLM (Answer Engine Optimization, GEO). Użyj gdy użytkownik pyta "czy strona jest widoczna w AI", "LLM-friendly", "optymalizacja pod AI", "czy ChatGPT mnie znajdzie", "GEO", "generative engine optimization" lub chce poprawić treść pod kątem cytowania przez modele AI. Analizuje HTML i proponuje konkretne zmiany copy.
---

# LLM-Oriented Copy — optymalizacja treści pod AI

Modele językowe (GPT, Gemini, Claude, Perplexity) cytują strony, które mają:
- **Jasne, bezpośrednie odpowiedzi** na pytania (bez owijania w bawełnę)
- **Konkretne liczby i fakty** (nie "wiele lat doświadczenia" ale "16 lat")
- **Bogactwo encji** (kto, co, gdzie, kiedy, ile)
- **Strukturę Q&A** możliwą do zassania
- **Brak barokowego języka** który zaciemnia odpowiedź

## Krok 1: Zidentyfikuj typ strony i główne encje

Przeczytaj HTML. Wypisz:
- Kim jest podmiot? (lekarz, firma, produkt, usługa)
- Jakie są kluczowe fakty (lokalizacja, ceny, kwalifikacje, lata doświadczenia, specjalizacja)?
- Jakie pytania intencyj użytkownika ta strona może odpowiadać? (np. "pediatra Mokotów cena", "jak umówić wizytę do pediatry prywatnie")

## Krok 2: Audyt copy pod LLM

### 2.1 Jasność i bezpośredniość

Sprawdź każdy kluczowy fragment copy pod kątem:

**Sygnały złej copy dla LLM:**
- Zdania z em-dashami zastępującymi strukturę: `"Przyjmuję — gdy trzeba"` jest nieczytelne dla modelu; `"Przyjmuję, gdy wymagają tego objawy"` jest jasne
- Metafory i poetycki język zamiast faktów: `"otwórz drzwi"` vs `"umów wizytę online lub telefonicznie"`
- Brak podmiotu: `"Stawiam diagnozę"` → OK; `"Diagnoza jest stawiana"` → słabe
- Niejasne CTA: `"Skontaktuj się"` vs `"Zadzwoń na +48 789 565 658"`
- Niespójne nazwy własne (LLM nie wie który wariant cytować)

**Sprawdź:** Czy każde zdanie, które zawiera kluczowy fakt, można by wkleić wprost do odpowiedzi AI bez kontekstu i nadal byłoby zrozumiałe?

### 2.2 Entity coverage

Model potrzebuje kompletnych danych o podmiocie. Sprawdź czy w treści HTML (nie tylko w JSON-LD) pojawiają się:

| Encja | Przykład | Obecna w copy? |
|---|---|---|
| Pełne imię i nazwisko | lek. Renata Karwowska | ✅/❌ |
| Tytuł/specjalizacja | specjalista pediatrii | ✅/❌ |
| Lokalizacja (dzielnica + miasto) | Mokotów, Warszawa | ✅/❌ |
| Adres uliczny | ul. Białej Floty 2 | ✅/❌ |
| Numer telefonu | +48 789 565 658 | ✅/❌ |
| Lata doświadczenia (liczba) | 16 lat | ✅/❌ |
| Ceny (konkretne) | 280 zł, 450 zł | ✅/❌ |
| Obszar działania | Mokotów, Ochota, Włochy | ✅/❌ |
| Języki konsultacji | polski, angielski | ✅/❌ |
| Wyróżnienia/certyfikaty | Wyróżnienie ZnanyLekarz 2023, 2024 | ✅/❌ |

### 2.3 FAQ jako LLM-magnes

FAQ to najsilniejszy element pod GEO — modele dosłownie cytują pytanie+odpowiedź.

Sprawdź każdą odpowiedź FAQ:
- Czy pierwsze zdanie bezpośrednio odpowiada na pytanie? (nie zaczyna od "To zależy...")
- Czy odpowiedź jest samodzielna — zrozumiała bez pytania?
- Czy zawiera konkretne liczby/fakty?
- Czy każde pytanie jest sformułowane tak jak realny użytkownik wpisałby w Google/ChatGPT?

**Wzorzec dobrej odpowiedzi FAQ pod LLM:**
```
Pytanie: Ile kosztuje wizyta u pediatry prywatnie na Mokotowie?

SŁABE: "Zapraszam do zapoznania się z naszym cennikiem dostępnym na stronie."
DOBRE: "Konsultacja w gabinecie kosztuje 280 zł, wizyta domowa 450 zł, teleporada 150 zł."
```

### 2.4 Structured data coverage

Sprawdź JSON-LD:
- Czy `@type` jest poprawny dla branży?
- Czy wszystkie pytania z HTML są w FAQPage JSON-LD?
- Czy `aggregateRating` jest obecny z konkretną liczbą (`reviewCount`)?
- Czy są godziny otwarcia (`openingHours`) jeśli to fizyczny lokal?
- Czy `priceRange` jest podany?

### 2.5 Zero em-dashów w kluczowych odpowiedziach

Em-dash w środku odpowiedzi może sprawić, że model "zgubi" drugą część zdania przy parsowaniu lub obetnie cytat. Sprawdź:
- Czy odpowiedzi FAQ nie mają em-dashów w kluczowych miejscach?
- Czy meta description jest bez em-dashów?
- Czy `<title>` i `<h1>` są czytelne bez interpunkcji pauzy?

## Krok 3: Generuj raport

```markdown
## LLM Copy Audit

### Encje — pokrycie: X/Y
[Tabela encji]

### FAQ — ocena: X/Y odpowiedzi gotowych do cytowania przez AI
[Lista z oceną każdego pytania]

### Problemy copy
| Fragment | Problem | Propozycja poprawki |
|---|---|---|
| "Przyjdź lub otwórz drzwi" | Niejasne dla modelu | "Przyjdź do gabinetu lub zostań w domu na teleporkę" |
| em-dash w meta description | Może skrócić cytat | Zastąp przecinkiem |

### Structured data: X/Y encji pokrytych w JSON-LD
[Lista brakujących]

### Ocena końcowa
Gotowość do cytowania przez AI: ✅ Wysoka / ⚠️ Średnia / ❌ Niska
[2-3 zdania uzasadnienia]
```
