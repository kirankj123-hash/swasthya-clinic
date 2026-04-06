import { AIConfidence, GrievanceUrgency } from './types';
import { requestSarvamToolObject } from './sarvamChatAdapter';

type GrievanceTriageAssessment = {
  urgency: GrievanceUrgency;
  staffSummary: string;
  rationale: string;
  confidence: AIConfidence;
  modelUsed: string;
  generatedAt: string;
};

const URGENCY_ORDER: GrievanceUrgency[] = ['low', 'medium', 'high', 'critical'];
const CONFIDENCE_ORDER: AIConfidence[] = ['low', 'medium', 'high'];

function normalizeUrgency(value: string | null | undefined): GrievanceUrgency {
  if (value && URGENCY_ORDER.includes(value as GrievanceUrgency)) {
    return value as GrievanceUrgency;
  }
  return 'medium';
}

function normalizeConfidence(value: string | null | undefined): AIConfidence {
  if (value && CONFIDENCE_ORDER.includes(value as AIConfidence)) {
    return value as AIConfidence;
  }
  return 'medium';
}

function heuristicUrgency(text: string): Pick<GrievanceTriageAssessment, 'urgency' | 'staffSummary' | 'rationale' | 'confidence' | 'modelUsed'> {
  const normalized = text.toLowerCase();

  const criticalTerms = ['fire', 'collapse', 'electrocution', 'sewage overflow', 'unsafe building', 'injury', 'accident', 'life threat'];
  const highTerms = ['no water', 'water supply', 'drainage', 'flooding', 'pothole', 'road damage', 'streetlight', 'garbage', 'encroachment', 'blocked road'];
  const lowTerms = ['status update', 'follow up', 'certificate', 'document', 'approval copy', 'information'];

  let urgency: GrievanceUrgency = 'medium';
  if (criticalTerms.some(term => normalized.includes(term))) urgency = 'critical';
  else if (highTerms.some(term => normalized.includes(term))) urgency = 'high';
  else if (lowTerms.some(term => normalized.includes(term))) urgency = 'low';

  return {
    urgency,
    staffSummary: text.slice(0, 180) || 'Citizen grievance submitted for staff review.',
    rationale: `Heuristic triage assigned ${urgency} urgency based on issue keywords in the grievance text.`,
    confidence: urgency === 'medium' ? 'low' : 'medium',
    modelUsed: 'heuristic-fallback',
  };
}

export async function assessGrievanceTriage(
  purpose: string,
  summary: string
): Promise<GrievanceTriageAssessment> {
  const combinedText = [purpose, summary].filter(Boolean).join('. ').trim();
  const generatedAt = new Date().toISOString();

  if (!combinedText) {
    return {
      urgency: 'medium',
      staffSummary: 'Citizen grievance submitted without enough detail for triage.',
      rationale: 'Defaulted to medium urgency because the submission lacked actionable detail.',
      confidence: 'low',
      modelUsed: 'empty-fallback',
      generatedAt,
    };
  }

  if (!process.env.SARVAM_API_KEY) {
    return { ...heuristicUrgency(combinedText), generatedAt };
  }

  try {
    const { parsed, modelUsed } = await requestSarvamToolObject<{
      urgency?: string | null;
      staffSummary?: string | null;
      rationale?: string | null;
      confidence?: string | null;
    }>({
      systemPrompt: `You are a public grievance triage assistant for the Bangalore Development Authority.
Use the provided function tool to return the triage decision.

Urgency definitions:
- critical: immediate threat to life, public safety, dangerous infrastructure failure, or urgent crisis.
- high: serious civic-service disruption or hazard affecting residents and needing fast staff attention.
- medium: important grievance requiring review, but not an immediate safety or service emergency.
- low: administrative or follow-up matter with limited immediate harm.

Rules:
- Read the grievance carefully and classify urgency for staff review.
- Do not invent facts beyond the grievance text.
- Prefer higher urgency when the grievance describes a plausible public-safety risk.
- staffSummary must be 1-2 concise staff-facing sentences.
- rationale must briefly explain why the urgency was assigned.
- confidence must be one of: low, medium, high.
Only call the function. Do not answer in plain text.`,
      userPrompt: `Purpose: "${purpose}"
Summary: "${summary}"`,
      toolName: 'triage_grievance',
      toolDescription: 'Assigns grievance urgency and a concise staff-facing explanation for review.',
      parameters: {
        type: 'object',
        properties: {
          urgency: { type: 'string', enum: URGENCY_ORDER },
          staffSummary: { type: 'string' },
          rationale: { type: 'string' },
          confidence: { type: 'string', enum: CONFIDENCE_ORDER },
        },
        required: ['urgency', 'staffSummary', 'rationale', 'confidence'],
      },
      maxTokens: 700,
    });

    return {
      urgency: normalizeUrgency(parsed.urgency),
      staffSummary: typeof parsed.staffSummary === 'string' && parsed.staffSummary.trim()
        ? parsed.staffSummary.trim()
        : combinedText.slice(0, 180),
      rationale: typeof parsed.rationale === 'string' && parsed.rationale.trim()
        ? parsed.rationale.trim()
        : 'AI triage assigned urgency based on the grievance description.',
      confidence: normalizeConfidence(parsed.confidence),
      modelUsed,
      generatedAt,
    };
  } catch (error: any) {
    console.error('Sarvam grievance triage error:', error?.message);
    return { ...heuristicUrgency(combinedText), generatedAt };
  }
}
