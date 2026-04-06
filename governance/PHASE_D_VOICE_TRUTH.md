# Phase D: Voice Intake Truth Contracts
## Commissioner Public Interaction Management System

**Owner:** Lane A — Product Contract Guardian

This document bounds the scope, behavior, and fallback policies for the Voice-Assisted Citizen Request feature.

---

## 1. Assistive-Only Boundary (Task 1.1)
The Voice Intake capability is strictly **advisory and draft-only**. 
- **No Auto-Submission:** The system MUST NOT submit a `CitizenRequest` directly from an audio recording or generated transcript without explicit citizen confirmation.
- **Review Requirement:** Every generated output from voice input MUST open an editable draft UI. The citizen MUST have the capability to alter the text, change the category, or fix names before submission.
- **Advisory Labelling:** The UI processing the transcript MUST label the output using words like "Voice-assisted draft", "Draft transcript", or "Please verify". It must never use words like "Finalized", "Verified", or "Submitted."

## 2. Voice Schema Isolation Contract (Task 1.2)
The voice processing layer generates a `VoiceDraft` object. It does not generate a `CitizenRequest` directly. 

**VoiceDraft Properties (Minimum):**
- `transcript` (string)
- `structuredData` (Partial<CitizenRequest>)
- `isFallback` (boolean)
- `status` ('processing' | 'ready' | 'failed')

This ensures the core `CitizenRequest` flow remains completely untainted and structurally decoupled from the AI/Voice feature. 

## 3. Mock & Fallback Policy (Task 3.1)
If the live AI service is unavailable (credit exhausted, rate limit hit, network error, malformed audio):
- **Never Dead-End:** The citizen must gracefully transition to the manual submission form, or view a mocked generic draft.
- **Wording:** The application must present a calm, specific error message: "We could not process your voice input right now. You may switch to manual entry."
- **Mock Mode Default:** For developer environments and demonstration purposes, a simple mocked `VoiceAdapter` pipeline must fulfill the request immediately upon "Speak" execution with 0 live API calls.
