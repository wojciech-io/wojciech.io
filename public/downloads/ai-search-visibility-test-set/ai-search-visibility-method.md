# AI search visibility test set

A sheet of 30 repeatable questions, a counting method for citations and visits, and a monthly log. The test asks whether a buyer can find a supported answer on your site for a task they need to complete.

Files in this kit:

| File | Use |
|---|---|
| `test-set-30-questions.csv` | 30 question templates in six clusters, with fictional filled examples |
| `monthly-run-log-template.csv` | One row per run, raw observations |
| `monthly-summary-template.csv` | One row per engine per month, counts and the next change |

## 1. Build your 30 questions

Six clusters, five questions each. Each cluster is a different buyer intent, so a gain in one cannot hide a loss in another.

| Cluster | Buyer is asking | Page that should answer |
|---|---|---|
| Problem | "Why is this happening to us?" | Problem article or case |
| Category | "What is this, and what does good look like?" | Definition and checklist pages |
| How-to | "How do I do this task?" | How-to and reference pages |
| Evaluation | "What should I look for, and when do I need help?" | Buyer guide, scope page |
| Comparison | "This or that?" | Comparison and decision pages |
| Brand | "Who are you, and do you fit?" | About, service, integrations pages |

Fill the `{placeholders}` with your own terms. Write the question the way a buyer would type it, not the way your marketing page would phrase it. In `correct_answer_points`, write two or three facts a correct answer must contain, taken from your own page. Without these you cannot grade accuracy later. Assign an owner to each question: the person who fixes the page when the answer is wrong.

Freeze the set. Change a question only by adding a new ID, so month-to-month comparison stays valid.

## 2. Define a run, before you start

A run is a single question asked of one engine on one date in a fresh session.

- Use a fresh session with no memory or custom instructions where the engine allows it. Record whether web search was on.
- Record the engine name and mode in `engine_mode_and_settings`. A different mode is a different engine for counting.
- Run each question the same number of times in every engine. Three is a workable minimum, because answers vary between runs. With 30 questions and three runs, you get 90 runs per engine per month.
- Save the full raw answer and its cited links. Everything below is counted from the saved text, not from memory.

## 3. What counts

Decide these definitions once and write them in your log. Do not change them mid-series.

| Term | Counts when |
|---|---|
| **Mention** | The answer names your brand, product or domain in its text |
| **Usable link** | The answer links to a page on your domain that loads and is the page the answer is about |
| **Correct citation** | A usable link, and the claim the answer attributes to it is on that page |
| **Correct answer** | The answer contains the `correct_answer_points` for that question and states nothing your page contradicts |

A mention without a link is a mention. A link whose claim is not on the page counts as a usable link only. Log it and fix the page or its structure.

## 4. Count

For each engine and month, from the run log:

- Mention rate = runs with a mention ÷ runs.
- Own-domain citation rate = runs citing your domain ÷ runs.
- Correct-citation rate = runs with a correct citation ÷ runs.
- Correct-answer rate = runs with a correct answer ÷ runs.

Report the four as counts as well as rates (such as "12 of 90"), so a reader can see how small the base is. Do not combine engines into one number. Do not compare a month with a different question set or a different run count.

## 5. Visits

Citations are what an engine says. Visits are what your analytics can see. Keep them in separate columns and read them side by side.

1. In your analytics, list sessions whose referrer is one of the engines you tested. Check your own referrer report for the exact hostnames.
2. Take landing pages from those sessions. Match them to the pages your citations point to.
3. For those sessions, record the next step you already measure, such as a form submission or a booking.
4. Put the three numbers in `monthly-summary-template.csv`: `ai_referral_sessions`, `top_landing_page`, `next_step_events_from_ai_sessions`.

Treat the visit count as a minimum. An answer can satisfy a reader without a click, and a click can arrive without a referrer. A page that is cited often and visited rarely is a different problem from a page that is visited and never cited.

## 6. Turn the count into one change

Each month, pick the change the evidence supports. Do not make five.

| You see | Check first |
|---|---|
| Brand never mentioned for a Category question | Is there a page whose opening sentence defines the term? |
| Own domain cited, but the answer is wrong | The page is unclear or the key fact is buried. Move the fact up and state it plainly. |
| Right page, no citation | Can the public page and its canonical URL be fetched without a login or script? Is the structured data accurate for the visible content? |
| Competitor named, you absent, on a Comparison question | You may have no comparison page. |
| Cited and visited, but no next step | The page answers and does not lead anywhere. That is a page problem. |

Write the change in `change_shipped_since_last_month`. Run the same 30 questions next month and compare like with like.

## 7. The monthly log

1. Run the 30 questions in each engine, three runs each. Save raw answers.
2. Fill one row per run in `monthly-run-log-template.csv`.
3. Fill one row per engine in `monthly-summary-template.csv`.
4. Read the five checks in section 6 against the month's gaps.
5. Choose one change. Record it and publish it.
6. Next month, repeat. Do not add questions until the set has run for a few months.

The example rows use fictional engines, a fictional company and invented counts. They show the layout and nothing about how any real engine behaves. Delete them before you start.

---

Want this set built and run on your own pages? Book a call at wojciech.io/contact.
