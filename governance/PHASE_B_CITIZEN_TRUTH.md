# Phase B: Citizen Golden Path Truth
## Commissioner Public Interaction Management System

**Owner:** Lane A — Product Contract Guardian

This document defines the strict truth for the Phase B Citizen Path delivery. No citizen-facing surface may deviate from these rules.

---

## 1. Today’s Rule Wording

Citizens landing on the homepage must immediately understand the current operational context based on the current day.

### Mon, Tue, Fri: Walk-in Day
- **Title:** Walk-in Day
- **Subtitle:** Open for direct public visitors.
- **Rule Constraints:** Direct walk-in is allowed. No prior appointment is required. Optional pre-registration available.
- **Call to Action:** "Preregister (Optional)" leading to `/citizen/walk-in`.

### Wednesday: Project Review Day
- **Title:** Project Review Day
- **Subtitle:** Reserved for scheduled project and zonal reviews.
- **Rule Constraints:** Detail submissions required. Walk-ins not seen for general grievances.
- **Call to Action:** "Submit Review Request" leading to `/citizen/request?type=project_review`.

### Thursday: Open House Day
- **Title:** Open House Day
- **Subtitle:** Commissioner hears public cases by assignment only.
- **Rule Constraints:** Strictly by prior appointment. Walk-ins not permitted.
- **Call to Action:** "Request Open House Appointment" leading to `/citizen/request?type=open_house`.

### Saturday/Sunday: Closed to Public
- **Title:** Closed to Public
- **Subtitle:** Internal work, field inspections, or holiday.
- **Rule Constraints:** No public access available today. Future requests can be submitted online.
- **Call to Action:** "Submit a Request" leading to `/citizen/request`.

---

## 2. Public-Safe Status Definitions

The tracker MUST map system statuses exactly as follows for citizen visibility:

- `submitted` -> "Submitted & In Queue" (Clock icon, neutral gray)
- `under_review` -> "Under Staff Review" (Search icon, amber)
- `approved` -> "Approved" (Check icon, green)
- `rescheduled` -> "Rescheduled" (Clock icon, blue)
- `rejected` -> "Rejected" (X icon, red)
- `attended` -> "Attended" (Check icon, green)
- `closed` -> "Closed" (Check icon, gray)

---

## 3. Tracker Visibility Bounds

The Tracking Page (`/citizen/track`) MUST NOT expose internal operational context.
- **Hidden Fields**: `internalStaffNote`, underlying AI tags, audit actions performed implicitly (staff viewing the record).
- **Visible Fields**: `applicantName`, `category`, `mode`, `purpose`, `summary`, `publicOfficeNote`, `assignedDate`/`assignedTimeStr` (if present), `rejectionReason`, `rescheduleReason`.
- **Communications**: Only communications where `state === 'sent'` are shown.
- **Audit Logging**: Only public-safe, explicit lifecycle transitions (Submitted, Status changed) should appear.

---

## 4. Acknowledgement Path

When a citizen submits a request or walk-in preregistration:
1. They must be redirected to `/citizen/track?id=<REQ-ID>&success=xyz`.
2. A clear, explicit success banner must acknowledge the submission and display the tracking ID prominently.

---

## 5. Walk-in Clarification

The Walk-in Pre-registration (`/citizen/walk-in`) MUST explicitly state:
> "Walk-in is allowed. No approval required."
It must not imply that the citizen will be rejected if they do not fill out the form. It must clearly present itself as an optional "Fast-Track Token".
