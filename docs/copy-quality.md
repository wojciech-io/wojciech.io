# Copy quality — how the two checks work and where their numbers came from

Two scripts measure article copy. They answer different questions and neither
blocks a merge.

| Script | Question | Scope |
|---|---|---|
| `scripts/anti-slop.sh` | Does this use generated-sounding *words*? | English only |
| `scripts/slop-structure.mjs` | Does this have a generated-sounding *shape*? | Every locale |

Run both locally before opening a content PR:

```bash
scripts/anti-slop.sh --diff main HEAD
node scripts/slop-structure.mjs --diff main HEAD
```

## Why the second script exists

Vale's `ai-tells` rules match English vocabulary. `anti-slop.sh` scopes itself
to `src/content/insights/*.mdx` for that reason, which means a translation has
never been measured by anything.

That was a reasonable trade at 29 English articles and one Polish mirror. It
stops being reasonable as the corpus tilts toward translations: the quality
gate ends up covering a shrinking minority of what actually ships, and the
languages with the least oversight are the ones getting the newest content.

Structure survives translation in a way vocabulary does not. A generated
paragraph has the same shape in Polish, German and Spanish as in English:
sentences of near-identical length, three-item lists as the default rhythm,
"not X but Y" as the default contrast, a short line dropped on its own for
effect, and a closing sentence that restates the opening one. Measuring those
needs arithmetic and a handful of function words, not a dictionary.

## What is measured

Every metric below is either language-independent or needs only a conjunction
list and a pronoun list, both of which are in the script.

**Sentence rhythm (`cv`)** — standard deviation of sentence length over its
mean. Human prose varies; generated prose regresses toward a uniform ~15
words. This is the single strongest signal and it needs no language data at
all. Only scored on files with 20 or more sentences, because a 200-word note
has no meaningful variance either way.

**Register (`person per 1k`)** — first- and second-person markers per thousand
words. `docs/10-tone-of-voice.md` requires first or second person and rules out
"one should" and "companies often", so an impersonal article is off-spec by the
spec's own terms rather than by taste.

**Circular paragraphs** — paragraphs whose closing sentence reuses 60% or more
of the content words already used earlier in the same paragraph. The tone spec
asks the last sentence to carry the so-what and explicitly not to be "a summary
of what you just said".

**Vague headings** — headings that point at themselves: "Why this matters",
"Jak to wygląda w praktyce". The spec allows a heading to be a statement *or a
question*, and a question heading is also how answer engines find a section, so
the check matches a literal list of self-referential shapes rather than
flagging every "What ..." heading. "What got cut" and "Co bym zrobił inaczej"
are concrete and must pass.

**Tricolons** — "fast, cheap and effective". Each of the three items is capped
at three words, which is what separates a rhetorical tricolon from an ordinary
sentence containing two commas.

**Antithesis** — "not X but Y" and its equivalents in each language.

**Mic drops** — a one-sentence paragraph of eight words or fewer landing
straight after a paragraph of three or more sentences.

**Em dashes** — a hard ban in the tone spec, so this one is not a matter of
degree.

## Two implementation notes worth keeping

**JavaScript `\b` is ASCII-only.** It is defined against `[A-Za-z0-9_]`, so in
`wartości` it finds a word boundary between `ś` and `ci` and matches the Polish
pronoun `ci`. The first version of this script reported eleven first-person
pronouns in a Polish text containing none. Every pattern now uses explicit
`(?<![\p{L}\p{N}])` lookarounds instead. Anything added later must do the same.

**Polish and Spanish are pro-drop.** `Zbudowałem CRM` is first person with no
pronoun in it. Counting pronouns alone scored every Polish article near zero
and every English one high, which is a grammar difference reported as a voice
problem. The script also matches first- and second-person verb endings, and
even then Polish lands around half the English rate, so register is compared
against the file's **own locale median** and only where that locale has eight
or more articles. A locale with two files gets its number printed and no
verdict.

## Where the thresholds came from

Percentiles over all 63 articles in the collection as of 2026-09-10, checked
against a control: two deliberately generated articles, one English and one
Polish, written to hit every tell in the list.

| Metric | Corpus p05 | Corpus p50 | Corpus p95 | Control | Line |
|---|---:|---:|---:|---:|---:|
| `cv` | 0.48 | 0.57 | 0.68 | 0.39–0.40 | review < 0.51, investigate < 0.47 |
| circular paragraphs | 0 | 0 | 1 | 1–2 | > 1 |
| tricolons /1k | 0.0 | 6.1 | 14.6 | 6.5–8.9 | > 14.6 |
| "not X but Y" /1k | 0.0 | 0.0 | 1.2 | 2.2–3.0 | > 2.0 |
| mic drops | 0 | 1 | 5 | 1 | > 5 |
| vague headings | 0 | 0 | 0 | 3–4 | > 0 |
| register | per locale | — | — | 0.0–2.2 /1k | < 30% of locale median |

The lines sit near the 5th or 95th percentile so that a normal article passes
and only the tail gets read. A check that flagged a third of the corpus would
be ignored inside a week.

The control scored 3 to 4 flags per file, including every planted tell. The
best-performing article in the collection (`gpt-6-astra-vs-claude.mdx`) passes
`--strict` clean. Four vague headings exist in the real corpus and all four are
true positives.

## Re-deriving the thresholds

Do this when the corpus has roughly doubled, or when a new locale passes eight
articles:

```bash
node scripts/slop-structure.mjs --json > /tmp/corpus.json
node -e "
const r = require('/tmp/corpus.json');
const pct = (a, p) => [...a].sort((x, y) => x - y)[Math.floor((a.length - 1) * p)];
for (const k of ['cv', 'personPer1k', 'circularParagraphs', 'tricolonsPer1k', 'antithesesPer1k', 'micDrops']) {
  const v = r.map((x) => x[k]);
  console.log(k.padEnd(20), [0.05, 0.5, 0.95].map((p) => pct(v, p).toFixed(2)).join('  '));
}"
```

Then re-run the control pair before changing any number. A threshold that no
longer separates the control from the corpus is measuring nothing, and moving
it to fit the corpus alone is how a check quietly becomes decoration.

## Two precision fixes, and what they cost to find

Both came from reading the hits one by one rather than trusting the count, and
both went in opposite directions.

**The heading list was too narrow.** It knew `what this means` and `how this
works in practice` but not `what this looks like in practice`, which is the
same heading doing the same job. Two articles carried it in English and were
never flagged, while their Polish mirrors were. Widened.

**The Polish antithesis rule was too loose.** Polish writes the construction as
"nie X, tylko Y" and the pattern had the comma optional, so it also matched
"nie tylko X", which means "not only X" and is a different construction
entirely. It reported "nie przenosi tylko" ("does not only transfer") as a
rhetorical tic three times across two articles. Requiring the comma dropped
exactly those three hits and nothing else, checked by diffing the two patterns
over the Polish corpus before the change went in.

The rule that falls out of both: **a count nobody has read is not evidence.**
Before moving a threshold or widening a pattern, print the actual matches and
look at them. Every real defect this file describes was found that way, and so
were both bugs in the detector itself.

## What a flag is and is not

A flag is a request to read the file, not a defect. A tricolon can be a literal
quotation of somebody else's three-item list. A one-line paragraph can be
exactly the right call. The signal is several flags landing on the same file.

The em dash is the one exception: the tone spec bans it outright, so a hit
there is always a fix.
