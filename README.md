# CPIMS
## Commissioner Public Interaction Management System

CPIMS is a citizen-centric digital service platform for Commissioner office public interaction management.

It is designed as a **public interaction operating system prototype**, not a generic appointment app.

The platform brings together:
- public access governance
- citizen request intake
- walk-in preservation
- appointment discipline
- staff triage and scheduling
- transparent citizen tracking
- executive visibility
- AI-ready capability surfaces

---

## Purpose

CPIMS exists to improve:

### For Citizens
- clarity on when and how to approach the office
- fewer unnecessary visits
- transparent tracking and updates
- better trust in office responsiveness

### For Staff
- structured intake and triage
- controlled workflow states
- easier communication handling
- reduced ambiguity in routing and scheduling

### For Leadership
- real-time visibility into public interaction load
- issue distribution awareness
- measurable service operations
- future readiness for AI-assisted public service workflows

---

## Core Principles

- citizen first
- preserve walk-in access where applicable
- administrative discipline
- truth-governed workflow
- no fake metrics
- AI as advisory assistance, not authority
- demo-first, verification-driven execution

---

## Operating Model

This repository is governed through a **truth → build → verify** execution model.

Every new capability must pass through:

1. truth definition  
2. controlled lane execution  
3. browser/runtime verification  

See:
- `governance/GOVERNANCE.md`
- `governance/TRUTH_REGISTRY.md`
- `governance/EXECUTION_ROADMAP.md`
- `governance/PHASE_GATES.md`
- `governance/AUTONOMY_POLICY.md`

---

## Repository Structure

```text
.github/
  ISSUE_TEMPLATE/
  pull_request_template.md

docs/
  demo/
  models/
  seeded_data.md

governance/
  GOVERNANCE.md
  TRUTH_REGISTRY.md
  EXECUTION_ROADMAP.md
  METRIC_DEFINITIONS.md
  PHASE_GATES.md
  AUTONOMY_POLICY.md
  AI_SURFACE_CONTRACT.md
  NOTIFICATION_MODEL.md
  DEFINITION_OF_DONE.md
  ARTIFACT_REVIEW_CHECKLIST.md

src/
  app/
  components/
  lib/

artifacts/
```

⸻

Core User Journeys

Citizen Journey

A citizen visits the platform, understands today’s public access mode, follows the correct path, submits a request if required, and tracks office action transparently.

Staff Journey

A staff member reviews incoming requests, updates lifecycle states, assigns slots where applicable, and records office notes while preserving public/internal boundaries.

Leadership Journey

The Commissioner or senior office staff views current load, issue distribution, and operational status through a dashboard grounded in record truth.

⸻

Current Product Direction

Phase 1
	•	public access rules
	•	homepage and schedule
	•	guided citizen intake
	•	request acknowledgement and tracking
	•	staff review and status updates
	•	executive dashboard
	•	seeded demo scenarios

Future Phases
	•	communication workflow modeling
	•	AI assistance surfaces
	•	administrative intelligence
	•	multilingual and voice-ready citizen service support

⸻

Development Expectations

This repo is designed for Antigravity multi-agent execution.

Agents must:
	•	stay within lane boundaries
	•	respect truth registry constraints
	•	produce artifacts
	•	avoid inventing business logic
	•	escalate ambiguity instead of guessing

⸻

Local Development

Add your actual project-specific commands here. Example:

npm install
npm run dev

Open local development server:

http://localhost:3000


⸻

Verification Expectations

No work is complete without:
	•	visual proof
	•	browser walkthrough validation
	•	alignment with truth registry
	•	artifact generation

See:
	•	docs/demo/DEMO_NARRATIVE.md
	•	governance/ARTIFACT_REVIEW_CHECKLIST.md
	•	governance/DEFINITION_OF_DONE.md

⸻

Product Framing

Official label:
Commissioner Public Interaction Management System (CPIMS)

Presentation label:
BDA PRISM — Public Request, Interaction and Smart Management
