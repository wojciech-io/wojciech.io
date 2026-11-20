# Review gate for AI that writes to your CRM

One page of rules, a write-proposal schema and an evaluator prompt. Use them when an AI step prepares a CRM update and a person has to approve it.

## The idea in three lines

The model proposes. A person approves a specific version. A separate service writes. The model never holds CRM write credentials.

## Ten rules

1. **Start with one reversible job.** Pick a point where someone already checks the work, such as an inbound enquiry that needs a qualification summary and a reply. Do not start with a bulk update.
2. **One write boundary.** Exactly one function writes to the CRM. It accepts an approved proposal and nothing else. No other code path, prompt or tool can write.
3. **A proposal is data.** The AI returns a structured proposal in the schema in this kit. A reviewer reads the original text, the extracted fields and the action side by side.
4. **Every value needs evidence.** Every populated field carries a verbatim excerpt from the source. If you cannot point to one, the field stays empty.
5. **Observed and inferred stay apart.** "We are comparing vendors" supports a buying-stage note. It says nothing about budget. A conclusion the model drew is labelled `inferred`. A statement the buyer made is `observed`.
6. **Name who said it.** Each excerpt records the speaker: buyer, seller or system. A seller's impression is not a buyer statement. A commitment the seller made is not a buyer need.
7. **List what is missing.** Each gap comes with the question that would fill it. An empty field with a question is better than a plausible guess.
8. **Approval binds to a revision and an action.** The reviewer approves revision N going to one destination. Any edit creates revision N+1 that needs a new approval. The write service refuses a mismatch.
9. **Make the write safe to repeat.** Check permissions at the moment of writing, not when the proposal was created. Use an idempotency key so a repeated request cannot create a second record.
10. **Log the approval and the result.** Who approved which revision, when, and what the CRM returned. You need this the first time someone asks why a field says what it says.

## What the write boundary checks

The write service runs these before it touches the CRM. Each one is code, not a prompt.

| Check | Rejects when |
|---|---|
| Schema | The proposal does not validate against `write-proposal.schema.json` |
| Evidence | An excerpt does not appear verbatim in the source it points to |
| Allow-list | A field is not on the destination object's allowed list |
| Approval | `approval` is empty, or `approved_revision` differs from `revision` |
| Permission | The approving person cannot write to that object in the CRM |
| Idempotency | The key was already used |

## Evaluate in layers

| Layer | What it tests | Tool |
|---|---|---|
| Routing, missing fields, permissions | Rules you can state exactly | Scripted tests with a stand-in model that returns fixed answers |
| Grounded extraction | Does each value follow from its excerpt | The evaluator prompt in this kit, plus the verbatim-excerpt check in code |
| Ambiguous input | Vague, contradictory or hostile source text | Separate model checks on a small set of hard cases, recorded each time you change the prompt |
| Usefulness in practice | Does the reviewer save time | A reviewed pilot. A local test cannot answer this. |

## Pilot measures

Track these for the pilot itself. Do not quote any as a result until a reviewed pilot has produced it.

- Draft acceptance: how often the reviewer approves without changes.
- Edits per accepted draft.
- Unsupported field claims found in review.
- Time to the first useful response.

## Kit contents

| File | Use |
|---|---|
| `write-proposal.schema.json` | JSON Schema (draft 2020-12) for the proposal. It encodes rules 4 to 8 so a bad proposal fails validation before anyone reads it. |
| `example-proposal.json` | A valid proposal on a fictional enquiry, with two gaps. |
| `evaluator-prompt.md` | The second-model prompt that grades a proposal against its source. It treats the source as data and reports any instruction hidden in it. |

## The proposal in short

```
proposal_id, revision
source          type + stable reference to the original text
destination     system, object, operation (create or update), record id
fields[]        field, value, status (observed | inferred | missing),
                evidence[] (source ref, speaker, verbatim excerpt)
gaps[]          field + the question to ask
proposed_action one-sentence summary + idempotency key
approval        approved_by, approved_at, approved_revision (filled by a person)
```

Schema rules that matter: a `missing` field must have a null value and no evidence. An `observed` or `inferred` field must have a value and at least one excerpt. An `observed` excerpt must come from the buyer or the system, never the seller.

## Where this came from

A prototype that takes an inbound enquiry and logs the facts it can support. It then places a draft in a review queue. It was built as a take-home exercise, with scripted scenario tests using a model stand-in and a separately recorded live-model check. A related pilot that turns approved meeting input into a qualification draft is on hold pending a data-handling decision. The rules above are the design both share.

---

Want this gate designed for your own CRM and agent? Book a call at wojciech.io/contact.
