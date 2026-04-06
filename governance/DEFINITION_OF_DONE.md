# Definition of Done
## CPIMS Delivery Completion Rules

This document defines what it means for work to be considered done in CPIMS.

No issue, feature, or phase is complete unless it satisfies these rules.

---

## 1. General Definition of Done

A task is done only when:

- business truth has been respected
- the implementation matches issue scope
- required artifacts are produced
- browser/runtime verification has been completed where applicable
- public/internal visibility boundaries are preserved
- no fake metric or fake state has been introduced
- unresolved risks are documented

---

## 2. Definition of Done for Features

A feature is done only when:

- acceptance criteria are met
- it does not violate `TRUTH_REGISTRY.md`
- screenshots are captured
- affected flows are validated
- relevant docs are updated if needed
- truth changes are approved first if required
- known limitations are recorded

---

## 3. Definition of Done for Governance Changes

A governance or truth change is done only when:

- impacted truth is clearly updated
- affected lanes are identified
- schema/store implications are documented
- downstream work is ticketed
- approval is recorded
- contradictions are resolved

---

## 4. Definition of Done for Verification

A verification task is done only when:

- golden path has been executed
- screenshots are captured
- mismatch report is produced
- truth consistency is checked
- dashboard and flow numbers align with record truth
- recommendation is given: pass / blocked / needs fixes

---

## 5. Definition of Done for Dashboard Metrics

A metric-related task is done only when:

- metric is defined in `METRIC_DEFINITIONS.md`
- source records are identified
- value is traceable from data
- dashboard display uses record truth
- no fabricated counts exist
- verification confirms fidelity

---

## 6. Definition of Done for AI Surfaces

An AI-related task is done only when:

- AI surface exists in `AI_SURFACE_CONTRACT.md`
- advisory nature is clearly visible
- override behavior is clear
- final staff authority is preserved
- no AI output is misrepresented as verified truth
- browser verification confirms user comprehension

---

## 7. Definition of Done for Communication Workflow

A communication task is done only when:

- event/state model is respected
- citizen-visible communication history is correct
- staff communication audit is correct
- dashboard counts derive from event truth
- no fake `sent` event appears without evidence
- verification proves flow coherence

---

## 8. Final Rule

“Works on my screen” is not done.

“Matches truth, survives verification, and produces proof” is done.
