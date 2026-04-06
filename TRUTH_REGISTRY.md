# Shared Truth Registry
*Owned by Lane 1 (Product Contract Guardian)*

This document is the fixed product-truth registry for the Commissioner Public Interaction Management System (CPIMS). Every execution phase must reference and respect this contract. No feature lane may violate it.

## 1. Schedule Truth (Day-Wise Access Policy)
* **Monday / Tuesday / Friday**: Walk-in public interaction is allowed during designated hours. Digital pre-registration may be offered, but approval is not required.
* **Wednesday**: Reserved for project review participation. Controlled submission is required.
* **Thursday**: Reserved for appointment-based open house / zonal interaction. Prior submission and staff-assigned slot are required.
* **Saturday**: Reserved for inspections or non-public functions. General public access is not available.

---

## 2. Lifecycle Truth
**Canonical states:** `submitted`, `under_review`, `approved`, `rescheduled`, `rejected`, `attended`, `closed`

**Valid transitions:**
* submitted → under_review
* under_review → approved | rescheduled | rejected
* approved → attended | closed
* rescheduled → approved | rejected
* attended → closed

---

## 3. Public/Internal Information Boundary
* `internalStaffNote` must never be shown to citizens.
* `publicOfficeNote` may be shown to citizens.
* Citizen tracking must show only public-safe information.

---

## 4. Metric Truth (Dashboard)
All dashboard metrics must be strictly derived from stored fields, seeded historical truth, or modeled event truth. No fake analytics.
* **Zone Trend**: Derived from zone-tagged records.
* **Aging**: Derived from timestamps + state history.
* **Recurring Issues**: Derived from category/subcategory/tag clustering.
* **Duplicate Detection**: Derived from defined matching logic or modeled AI hints.

---

## 5. Notification Truth (Communication State Model)
*Focus: Communication workflow modeling, not actual gateway deployment.*

**Communication States:** `queued`, `prepared`, `sent`, `failed`, `skipped`
**Supported Channels:** `email`, `SMS`, `WhatsApp`, `portal only`

**Rules:**
* Notification intent must be explicitly generated.
* Notification channel must be selected.
* Citizen-visible communication history must be shown.
* Staff-visible communication audit must be logged.

---

## 6. AI Labeling Truth (AI Surface Contract)
*Rule: AI outputs are advisory unless explicitly marked otherwise.*

**AI File Summary**
* **Input**: uploaded citizen application
* **Output**: short summary, extracted references
* **Nature**: advisory
* **Visible to**: staff only
* **Override**: staff may ignore and write manual note

**Suggested Priority**
* **Input**: summary + metadata + keywords
* **Output**: low / medium / high / urgent
* **Nature**: advisory
* **Visible to**: staff and dashboard aggregates
* **Override**: staff may override with reason

**Voice Intake Ready**
* **Input**: citizen spoken submission
* **Output**: transcript + translated structured draft
* **Nature**: assistive
* **Visible to**: citizen and staff
* **Override**: citizen edits before submit
