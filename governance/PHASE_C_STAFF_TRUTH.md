# Phase C: Staff & Dashboard Truth
## Commissioner Public Interaction Management System

**Owner:** Lane A — Product Contract Guardian

This document defines the strict truth for Phase C (Staff Triage and Dashboard validation). Any UI or data aggregation behavior must match these rules natively.

---

## 1. Status Transition Rules
Staff may only legally move requests through the following valid transition graph:
- `submitted` -> `under_review`
- `submitted` | `under_review` -> `approved` (MUST assign a slot)
- `submitted` | `under_review` -> `rejected` (MUST require reasoning)
- `approved` -> `rescheduled` (MUST define new slot and reason)
- `approved` | `rescheduled` -> `attended` (Done upon visitor arrival)
- `attended` | `rejected` -> `closed` (Archive)

No transition skipping or backwards regressions (e.g. `approved` -> `under_review`) are valid.

## 2. Information Asymmetry (Notes & Data)
- **Public Note / Reason Text**: Any text entered herein becomes VISIBLE to the citizen on the tracker. It must be professional and formal.
- **Internal Staff Note**: Exclusively visible inside the staff context and DB audits. NO CITIZEN can ever read this. It is used for inter-departmental chatter.
- **Communications Array**: Once a message state is pushed to `sent`, it is instantly public. `failed` states should alert staff but hidden from Citizens.

## 3. Executive Dashboard Definitions
To ensure executive trust, dashboard metrics MUST strictly equal queries against the active pool:
- **New & Pending**: Count of requests EXACTLY matching status === `submitted`.
- **Under Review**: Count of requests EXACTLY matching status === `under_review`.
- **Approved Slots**: Count of requests EXACTLY matching status `approved` OR `rescheduled` (future expected load).
- **Walk-in Preregs/Load Types**: Sum over the exact categorization array matching `category`.

There will be no 'fuzzy' logic in metrics. Any calculation deviation from exact matching is considered a bug.
