# AI Surface Contract
## CPIMS Advisory AI Design Rules

This document governs all AI-assisted surfaces in CPIMS.

AI in CPIMS is an **augmentation layer**, not an authority layer.

---

## 1. Governing Rule

All AI outputs are **advisory** unless explicitly approved otherwise.

AI may assist with:
- accessibility
- voice capture
- summarization
- classification
- prioritization
- routing hints
- communication drafting

AI may not replace:
- staff decision-making
- final classification
- final scheduling
- final public status changes

---

## 2. AI Surface Design Requirements

Every AI surface must define:

1. input source  
2. output format  
3. visibility  
4. advisory vs authoritative nature  
5. override behavior  
6. confidence/provenance handling if applicable  

No AI surface may be added without completing this contract.

---

## 3. Approved AI Surface Types

## AI File Summary
**Purpose**  
Reduce staff reading burden for uploaded citizen applications.

**Input**
- uploaded application
- extracted text
- supporting metadata

**Output**
- short summary
- extracted references
- probable issue cues

**Nature**
- advisory

**Visible to**
- staff only

**Override**
- staff may ignore and write manual note

**UI rule**
Must be visibly labeled as:
- AI Summary
- Advisory
- Not final office decision

---

## Suggested Priority
**Purpose**  
Help staff identify urgency more quickly.

**Input**
- issue summary
- metadata
- keywords
- extracted document hints

**Output**
- `low`
- `medium`
- `high`
- `urgent`

**Nature**
- advisory

**Visible to**
- staff
- dashboard aggregates where approved

**Override**
- staff may override with reason

**UI rule**
Final visible operational priority must reflect staff truth, not AI suggestion alone.

---

## Suggested Routing
**Purpose**  
Suggest likely routing or handling path.

**Input**
- request category
- issue summary
- references
- locality or zone hints

**Output**
- suggested category
- suggested handling path
- suggested meeting type or queue

**Nature**
- advisory

**Visible to**
- staff only

**Override**
- staff may accept, change, or ignore

---

## Voice Intake Ready
**Purpose**  
Support future voice-based intake for multilingual citizen service.

**Input**
- spoken citizen input

**Output**
- transcript
- translated structured draft
- editable request form draft

**Nature**
- assistive

**Visible to**
- citizen
- staff where relevant

**Override**
- citizen edits before submission
- staff may review transcript-linked content later

---

## Communication Draft Assist
**Purpose**  
Speed up citizen communication drafting.

**Input**
- status
- office note
- assigned slot
- citizen language preference if available

**Output**
- suggested communication text
- channel-ready message draft

**Nature**
- advisory

**Visible to**
- staff only unless approved for direct preview

**Override**
- staff edits before send/model-send

---

## 4. Confidence and Provenance

Where confidence is shown:
- it must be presented as a hint
- not as proof of correctness
- not as a final office conclusion

Where provenance is available:
- show source type such as uploaded application, extracted text, or voice transcript
- do not imply legal or administrative verification

---

## 5. Visual Labeling Rules

Every AI surface must visually indicate:
- this is AI-assisted
- this is advisory
- staff remains the final authority

Avoid:
- overconfident language
- final-sounding labels
- implying automated office decisioning

Preferred phrases:
- Suggested Priority
- AI Summary
- Draft Assistance
- AI-Assisted Routing
- Voice Intake Ready

Avoid phrases like:
- Final Priority
- Verified by AI
- Auto-approved
- AI Decision

---

## 6. Governance Rule for New AI Surfaces

Any new AI surface requires:
- truth registry check
- visibility rule definition
- override rule definition
- artifact validation
- UI wording review
