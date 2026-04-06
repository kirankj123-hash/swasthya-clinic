# Antigravity Solo-Developer Playbook
## Commissioner Public Interaction Management System

**1. Operating Model: 4 Agents Maximum**
- **Truth Agent (Lane A):** Owns truth registry, phase gates, metrics, and acceptance criteria.
- **Citizen Flow Agent (Lane B):** Owns homepage, today’s rule, schedule, request flow, tracker, and walk-in path.
- **Ops + Dashboard Agent (Lane C/D):** Owns staff triage, slot assignment, notes, dashboard, and KPIs.
- **Verification Agent (Lane E):** Owns browser walkthroughs, screenshots, mismatch reports, and demo proof.

**2. Human Role:**
Truth approver, priority setter, merge owner, risk reviewer, final demo narrator.

**3. Session Rhythm (4-Day Loop):**
- **Monday (Truth Lock):** Truth Agent + Human break down issues, acceptance criteria, restrictions. No feature code. 
- **Tuesday (Parallel Build 1):** Citizen Flow Agent & Ops Agent build slices. Eventual screenshots.
- **Wednesday (Parallel Build 2):** Same build agents execute. Human checks drift, clears blockers.
- **Thursday (Verification):** Verification Agent walks the browser, generates proof, mismatch reports. 
- **Friday (Merge/Polish):** Human merges, closes issues, updates demo script, sets up next week's queue.

**4. Daily Session Structure:**
- **Session A (Kickoff, 15-25m):** Restate goals, acceptance criteria, boundaries, constraints.
- **Session B (Execution, 60-90m):** Build autonomously up to ambiguity. 
- **Session C (Close, 15-20m):** Summarize changes, capture screenshots, log risks, suggest follow-ups.

**5. Quota-Saving / Antigravity Rules:**
1. Never run all 4 agents at once unless in release verification.
2. Keep only 2 build agents active at a time.
3. Verification agent is event-driven, not always-on.
4. Truth agent is short-burst only (no long-running execution). 
5. Kill idle agents immediately. 
6. Avoid shared-file fights between agents (strict file separation). 

**6. Target Phase Playbooks:**
- **Phase 2 (Comms):** Model workflow logically. Do not integrate real gateways yet. 
- **Phase 3 (AI):** Truth sets rules; Ops handles summaries; Citizen handles voice-intake UI. Verification checks "assistive" feel.
- **Phase 4 (Admin Intel):** Truth locks metrics; Ops builds charts; Verification matches datastore.

**7. Stop Conditions:**
An agent must stop and escalate if:
- Business truth is unclear or needs modifying.
- It needs to touch another lane’s owned files.
- Browser/runtime verification fails twice.
- State model or metric definitions contradict operations.

**8. Issue Requirements:**
Every piece of execution **must** have an explicit issue detailing: Lane owner, truth impact, acceptance criteria, artifact requirement, and verification path.

**9. Core Context Files:**
Every agent session must load the following context:
- `governance/GOVERNANCE.md`
- `governance/TRUTH_REGISTRY.md`
- `governance/EXECUTION_ROADMAP.md`
- `governance/METRIC_DEFINITIONS.md`
- `governance/PHASE_GATES.md`
- `governance/AUTONOMY_POLICY.md`
- `governance/AGENT_PLAYBOOK.md` (This file)

**The Golden Rule:**
**One truth owner. Two builders. One verifier. Human approves.**
