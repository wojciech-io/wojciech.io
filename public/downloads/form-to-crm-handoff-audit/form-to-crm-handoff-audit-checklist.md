# Form-to-CRM handoff audit

A 15-point checklist for one form at a time. It tells you whether a website enquiry reaches a sales record with the right source, the right owner and a clock running. Pair it with the test-submission sheet (`test-submission-sheet.csv`).

**How to use it.** Pick one form. Walk the 15 points in order. Mark each Pass, Fail or Not applicable, and write down what you saw, not what you believe the setup does. Then run a test submission and fill one row of the sheet. Repeat for the next form.

**Stop rule.** A Fail on point 7, 8, 12 or 15 means leads can be lost or sit unowned. Fix those before anything else.

---

## 1. Fields

**1. Every form field maps to exactly one CRM field.**
Pass if you have a written table with form field, CRM object, CRM field and type. Fail looks like a field that "goes somewhere" and nobody can name where.

**2. Required means required on both sides.**
Pass if a field marked required in the form can never arrive empty in the CRM, or arrives with a visible default such as "not provided". Fail looks like a blank value that sales reads as "not asked".

**3. Free text lands where a person reads it.**
Pass if the message, the "other" option and any long answer are stored in a field that is visible on the record and not cut off. Fail looks like the request living only in a notification email.

## 2. Source and UTM

**4. First-touch UTM values are written to the record.**
Pass if source, medium, campaign, content and term are captured when the visitor first arrives and stored on the lead, and a later visit does not overwrite them. Fail looks like every lead showing "direct" or the source of the last click before the form.

**5. The record names the form and the page.**
Pass if the form identifier and the page URL are stored with the lead. Fail looks like three forms producing leads you cannot tell apart.

**6. Consent is stored as a value and a timestamp.**
Pass if the consent answer and the time it was given is on the record. Fail looks like a checkbox that exists in the form and nowhere else.

## 3. Owner

**7. One written routing rule decides the owner.**
Pass if you can state the rule in one sentence per form (by region, segment, product or round robin) and the CRM follows it. Fail looks like owners assigned by whoever sees the lead first.

**8. A fallback owner catches the no-match case.**
Pass if a submission that matches no rule goes to one person or a queue someone watches daily. Fail looks like an unassigned view nobody opens.

**9. The owner is told where they work.**
Pass if the notification arrives in the tool the owner has open (CRM task, chat channel, mobile push), with the record link. Fail looks like an email to a shared inbox.

## 4. SLA

**10. Each form has a response target, and the record carries the clock.**
Pass if the target is written down per form and the CRM stores "submitted at" and "first response at". Fail looks like a promise on the website with no field that measures it.

**11. A missed target alerts a manager or a backup owner.**
Pass if a lead past its target triggers an alert to a manager or a backup owner. Fail looks like a report someone is supposed to check on Mondays.

## 5. Record

**12. A repeat submission links to the existing person or company.**
Pass if the same email submitting twice updates or links to one contact, and the second request shows up as new activity. Fail looks like two contacts, or a second request that silently overwrote the first.

**13. The record is enough to act, and the confirmation tells the truth.**
Pass if the owner can see who asked, what they asked and from which page, and sees what happens next, without opening another tool, and the confirmation message the submitter receives matches what the routing will really do. Fail looks like "we will reply within a day" on a form that routes to a queue with no target.

**14. The measurement event fires once per submission.**
Pass if one submission produces one conversion event, with the form identifier attached. Fail looks like zero events (ad blocker, broken trigger) or two events (page reload on the thank-you page).

## 6. Test

**15. A test submission is run after every change, and the result is recorded.**
Pass if any change to the form, the CRM mapping or the routing rule is followed by a test submission, logged in the sheet, and every form is retested on a fixed schedule. Fail looks like finding the break when a prospect mentions it.

---

## Score it

| Result | Reading |
|---|---|
| All 15 Pass | The handoff is traceable. Keep the retest schedule. |
| Fails only on 1 to 6, 9, 10, 11, 13, 14 | Leads arrive and get owned, but you lose context or cannot measure. Fix in order of the sheet. |
| A Fail on 7, 8, 12 or 15 | Leads can go missing or be duplicated. Stop other work on this form. |

Keep these three scenarios in your test set. They probe the edges where a handoff is most likely to fail.

1. **Clean submission** with UTM parameters in the URL.
2. **No UTM, repeat visitor**, same email as an existing contact.
3. **No routing match**, such as a region or segment your rules do not cover.

## The test-submission sheet

`test-submission-sheet.csv` has one row per test. Columns:

| Column | What you record |
|---|---|
| `test_id` | A running ID |
| `date`, `tester` | When, and who ran it |
| `form_name`, `page_url` | Which form, on which page |
| `scenario` | Clean, no-UTM repeat, no routing match, long free text, after hours |
| `submitted_email`, `utm_*` | The test address and the UTM values you put in the URL |
| `expected_owner`, `actual_owner` | From the routing rule, and from the CRM |
| `crm_record_ref` | Link or ID of the record the submission created or updated |
| `utm_in_crm`, `consent_in_crm` | Yes or no, after reading the record |
| `minutes_to_record`, `minutes_to_owner_notice` | Measured with a clock, not estimated |
| `confirmation_matches_routing` | Yes or no |
| `event_fired_count` | Read from your tag debugger or event log |
| `duplicate_created` | Yes or no |
| `result` | Pass, Fail |
| `fix_owner`, `notes` | Who fixes it, and what you saw |

The example rows use a fictional form and example.test addresses. Delete them before you start.

Use test addresses you control, and clean up test records afterward so they do not enter reports.

---

Want this run on your own stack? Book a call at wojciech.io/contact.
