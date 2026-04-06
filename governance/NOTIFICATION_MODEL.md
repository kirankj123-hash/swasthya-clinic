# Notification Model
## Communication Workflow Contract for CPIMS

This document governs modeled communication behavior in CPIMS.

In early phases, communication is treated as **workflow truth**, not guaranteed real gateway delivery.

---

## 1. Purpose

The communication model exists to:
- make citizen updates visible and structured
- help staff manage communication intent
- support dashboard communication KPIs
- prepare for future email/SMS/WhatsApp integration

---

## 2. Supported Channels

- `email`
- `SMS`
- `WhatsApp`
- `portal only`

---

## 3. Communication States

- `queued`
- `prepared`
- `sent`
- `failed`
- `skipped`

---

## 4. Communication Event Rules

A communication event should record:
- request ID
- channel
- state
- timestamp
- trigger source
- optional staff note
- optional citizen-visible message summary

---

## 5. Communication Lifecycle Meaning

## queued
A communication has been created and is awaiting dispatch or simulation.

## prepared
A message has been composed or structured and is ready to be sent or modeled as sendable.

## sent
A modeled or real send event has been recorded.

## failed
A modeled or real send event did not succeed.

## skipped
A communication was intentionally not sent.

---

## 6. Core Rules

- notification intent must be explicitly created
- channel must be selected
- communication history must be traceable
- citizen tracker may show public-safe communication history
- staff must see communication audit details
- no `sent` state without event evidence
- modeled communication must not be misrepresented as real delivery unless actually integrated

---

## 7. Citizen-Facing Communication Visibility

Citizens may see:
- that a communication was sent or prepared where appropriate
- high-level message summary if approved
- time of communication
- public-safe channel reference

Citizens must not see:
- internal staff communication notes
- failed internal draft attempts that are not meaningful for public visibility
- raw system event logs

---

## 8. Staff-Facing Communication Visibility

Staff may see:
- channel
- state
- event time
- message intent
- operational note
- communication audit trail

---

## 9. Dashboard Metrics Supported

This model supports:
- communications queued
- communications sent
- communications failed
- communications skipped
- channel distribution
- communication activity trends in later phases

See `METRIC_DEFINITIONS.md` for metric formulas.

---

## 10. Phase Policy

### Early phases
- model communication workflow
- show history and status
- support dispatch intent
- keep behavior truth-grounded

### Later phases
- optional live gateway integration
- delivery callback handling
- real send confirmation
- retry models if approved
