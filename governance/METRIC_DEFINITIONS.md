# CPIMS Metric Definitions
## Dashboard and Operational Metric Dictionary

This document defines the official meaning of metrics used in CPIMS.

No metric may appear in the product unless it is defined here or explicitly approved by Lane A.

---

## 1. Metric Principles

All metrics must be:
- derived from record truth
- explainable in plain language
- consistent across views
- non-fabricated
- verifiable by Lane E

---

## 2. Core Operational Metrics

## Pending Review
**Definition**  
Count of requests where current status = `under_review`.

**Source**
- request status field

**Appears in**
- executive dashboard
- staff summary views

---

## Approved Today
**Definition**  
Count of requests with an approval event timestamp on the current day.

**Source**
- audit event history or modeled status-change event

**Appears in**
- executive dashboard

---

## Rejected Today
**Definition**  
Count of requests with a rejection event timestamp on the current day.

**Source**
- audit event history or modeled status-change event

**Appears in**
- executive dashboard

---

## Today’s Appointments
**Definition**  
Count of requests with an assigned slot scheduled for the current day.

**Source**
- assigned slot date

**Appears in**
- executive dashboard
- staff day view

---

## Walk-ins Expected
**Definition**  
Count of optional walk-in preregistration records for the current day, if such preregistration is modeled.

**Source**
- walk-in preregistration records

**Appears in**
- executive dashboard
- staff summary

**Note**
Must not imply that all walk-ins are preregistered.

---

## Status Distribution
**Definition**  
Counts of requests grouped by current lifecycle status.

**Source**
- request status field

**Appears in**
- executive dashboard
- administrative intelligence views

---

## Top Categories
**Definition**  
Most frequent request categories within the selected filter window.

**Source**
- request category field

**Appears in**
- executive dashboard
- intelligence views

---

## 3. Communication Metrics

## Communication Queued
**Definition**  
Count of communication records with state = `queued`.

## Communication Sent
**Definition**  
Count of communication records with state = `sent`.

## Communication Failed
**Definition**  
Count of communication records with state = `failed`.

## Communication Skipped
**Definition**  
Count of communication records with state = `skipped`.

**Source**
- communication event records

**Appears in**
- communication workflow dashboard
- staff operational summary

**Rule**
A communication cannot be counted as `sent` without modeled event evidence.

---

## 4. AI Assistance Metrics

## AI-Assisted Cases
**Definition**  
Count of requests containing an AI assistance payload, such as summary, suggested priority, or suggested routing.

**Source**
- AI payload presence on record

**Appears in**
- executive dashboard
- AI usage summary

---

## AI Priority Overrides
**Definition**  
Count of cases where staff changed the AI-suggested priority to a different final priority.

**Source**
- AI suggestion field + final staff-selected priority field + audit record

**Appears in**
- AI dashboard summary
- intelligence views

---

## AI Summary Usage
**Definition**  
Count of cases where an AI summary is available and surfaced to staff.

**Source**
- AI summary payload field

---

## 5. Administrative Intelligence Metrics

## Aging Cases
**Definition**  
Requests grouped by age since submission or since last meaningful lifecycle update.

**Source**
- request timestamps
- audit event timestamps

**Appears in**
- administrative intelligence dashboard

**Formula example**
Age in days = current date - submission date  
or  
Age in days since update = current date - last lifecycle change date

---

## Zone Trend
**Definition**  
Request volume grouped by zone over a defined time window.

**Source**
- zone-tagged records

**Appears in**
- administrative intelligence dashboard

---

## Recurring Issues
**Definition**  
Clusters of repeated issues identified by category/subcategory/tag combination.

**Source**
- category
- subcategory
- normalized issue tags

**Appears in**
- administrative intelligence dashboard

---

## Duplicate Detection Hints
**Definition**  
Cases flagged as potentially duplicate based on matching logic or modeled AI hints.

**Source**
- duplicate matching fields or AI hint field

**Appears in**
- staff operational view
- intelligence view

**Rule**
This is a hint, not a final truth classification.

---

## 6. Metric Governance Rules

A new metric requires:
- definition in this document
- source records identified
- affected surfaces identified
- verification method identified

No new dashboard card may be added without metric definition approval.
