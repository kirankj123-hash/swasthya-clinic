# Shared Truth Registry
## Commissioner Public Interaction Management System

**Owner:** Lane A — Product Contract Guardian

This document is the fixed product-truth registry for CPIMS. Every execution phase must reference and respect this contract.

No feature lane may violate it.

---

## 1. Schedule Truth (Day-Wise Access Policy)

### Monday / Tuesday / Friday
Walk-in public interaction is allowed during designated hours.

Rules:
- digital pre-registration may be offered
- approval is not required
- these are not appointment-mandatory days

### Wednesday
Reserved for project review participation.

Rules:
- controlled submission is required
- not treated as a general public walk-in day
- must remain purpose-specific

### Thursday
Reserved for appointment-based open house / zonal interaction.

Rules:
- prior submission is required
- staff-assigned slot is required
- citizen tracking must reflect appointment outcome

### Saturday
Reserved for inspections or non-public functions.

Rules:
- general public access is not available
- public-facing surfaces must not misrepresent Saturday as walk-in or appointment day

### Core Policy Principle
The system must preserve existing public access practices rather than over-digitize them.

Therefore:
- walk-in days must remain easy
- appointment days must remain controlled
- special review days must remain purpose-specific

---

## 2. Lifecycle Truth

### Canonical States
- `submitted`
- `under_review`
- `approved`
- `rescheduled`
- `rejected`
- `attended`
- `closed`

### Valid Transitions
- `submitted` → `under_review`
- `under_review` → `approved | rescheduled | rejected`
- `approved` → `attended | closed`
- `rescheduled` → `approved | rejected`
- `attended` → `closed`

No additional lifecycle states may be introduced without explicit truth approval.

---

## 3. Supporting Fields Truth

The request workflow supports the following structured fields:

- `rejectionReason`
- `rescheduleReason`
- `publicOfficeNote`
- `internalStaffNote`

### Rules
- `rejectionReason` may be citizen-visible where appropriate
- `rescheduleReason` may be citizen-visible where appropriate
- `publicOfficeNote` may be shown to citizens
- `internalStaffNote` must remain staff-only

---

## 4. Public/Internal Information Boundary

### Citizen-visible
Citizens may see:
- request ID
- current public-safe status
- assigned slot details where applicable
- public office note
- public-safe audit history
- communication history appropriate for citizen view

### Staff-only
Staff-only information includes:
- internalStaffNote
- staff rationale not intended for citizens
- internal workflow handling notes
- AI-assist surfaces that are not approved for citizen display

### Rule
Citizen tracking must show only public-safe information.

---

## 5. Metric Truth

All dashboard metrics must be strictly derived from:
- stored fields
- seeded historical truth
- modeled event truth

### Hard rules
- no fake analytics
- no disconnected dashboard counts
- all metrics must be explainable from record truth

### Examples
- **Pending Review** → all requests where status = `under_review`
- **Approved Today** → all requests with approval event timestamp on current date
- **Walk-ins Expected** → all walk-in preregistrations for the active day, if modeled
- **Zone Trend** → derived from zone-tagged records
- **Aging** → derived from timestamps and lifecycle history
- **Recurring Issues** → derived from category/subcategory/tag clustering
- **Duplicate Detection** → derived from defined matching logic or modeled AI hints

See `METRIC_DEFINITIONS.md` for exact formulas.

---

## 6. Notification Truth

**Focus:** communication workflow modeling, not gateway deployment unless explicitly approved.

### Supported Channels
- `email`
- `SMS`
- `WhatsApp`
- `portal only`

### Communication States
- `queued`
- `prepared`
- `sent`
- `failed`
- `skipped`

### Rules
- notification intent must be explicitly generated
- notification channel must be selected
- citizen-visible communication history must be shown when appropriate
- staff-visible communication audit must be logged
- no `sent` state may appear without modeled event evidence

---

## 7. AI Labeling Truth

### Governing Rule
AI outputs are **advisory** unless explicitly approved otherwise.

### AI File Summary
- **Input:** uploaded citizen application
- **Output:** short summary, extracted references
- **Nature:** advisory
- **Visible to:** staff only
- **Override:** staff may ignore and write manual note

### Suggested Priority
- **Input:** summary + metadata + keywords
- **Output:** `low | medium | high | urgent`
- **Nature:** advisory
- **Visible to:** staff and dashboard aggregates
- **Override:** staff may override with reason

### Voice Intake Ready
- **Input:** citizen spoken submission
- **Output:** transcript + translated structured draft
- **Nature:** assistive
- **Visible to:** citizen and staff
- **Override:** citizen edits before submit

### General AI Rule
AI may assist with:
- accessibility
- summarization
- classification
- prioritization
- communication drafting

AI may not replace:
- administrative judgment
- final classification
- final scheduling decision
- final citizen-facing decision status

---

## 8. Truth Change Policy

Any issue that changes:
- schedule truth
- lifecycle truth
- information boundary truth
- metric meaning
- notification meaning
- AI advisory boundary

must be handled first through Lane A and approved before build lanes proceed.
