import { VoiceStructuredDraft } from './types';
import { requestSarvamToolObject } from './sarvamChatAdapter';

const VALID_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function normalizeNullableText(value: unknown): string | null {
  if (typeof value !== 'string') {
    return null;
  }

  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

export async function extractStructuredVoiceDraft(
  transcript: string,
  category: string
): Promise<{ structuredData: VoiceStructuredDraft; modelUsed: string }> {
  let structuredData: VoiceStructuredDraft = {
    applicantName: null,
    mobile: null,
    preferredDay: null,
    mode: null,
    purpose: null,
    summary: transcript,
    missingFields: [],
  };

  if (!process.env.SARVAM_API_KEY || transcript.trim().length === 0) {
    structuredData.missingFields = ['Applicant Name', 'Mobile Number', 'Purpose / Title', 'Preferred Day', 'Interaction Mode'];
    return { structuredData, modelUsed: 'mock-fallback' };
  }

  let modelUsed = 'sarvam-fallback';

  try {
    const { parsed, modelUsed: sarvamModel } = await requestSarvamToolObject<{
      applicantName?: string | null;
      mobile?: string | null;
      purpose?: string | null;
      preferredDay?: string | null;
      mode?: string | null;
      summary?: string;
    }>({
      systemPrompt: `You extract structured fields from Bangalore Development Authority citizen voice transcripts.
Use the provided function tool to return the extracted fields.

Rules:
- Never guess missing details.
- Use null when a field is missing, ambiguous, or not clearly stated.
- applicantName must be the speaker's full name or null.
- mobile must be only the phone number or null.
- purpose must be a short 5-8 word title or null.
- preferredDay must be one of: Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, or null.
- mode must be one of: "in-person", "online", or null.
- summary must be a clean official-language summary of the request.
Only call the function. Do not answer in plain text.`,
      userPrompt: `Category: ${category}
Transcript: """${transcript}"""`,
      toolName: 'extract_citizen_voice_request',
      toolDescription: 'Extracts structured request details from a citizen voice transcript.',
      parameters: {
        type: 'object',
        properties: {
          applicantName: { type: 'string', nullable: true },
          mobile: { type: 'string', nullable: true },
          purpose: { type: 'string', nullable: true },
          preferredDay: { type: 'string', nullable: true },
          mode: { type: 'string', nullable: true },
          summary: { type: 'string' },
        },
        required: ['summary'],
      },
      maxTokens: 700,
    });

    modelUsed = sarvamModel;
    const rawMode = normalizeNullableText(parsed.mode);

    structuredData = {
      ...structuredData,
      applicantName: normalizeNullableText(parsed.applicantName),
      mobile: normalizeNullableText(parsed.mobile),
      purpose: normalizeNullableText(parsed.purpose),
      preferredDay: normalizeNullableText(parsed.preferredDay),
      mode: rawMode as VoiceStructuredDraft['mode'],
      summary: normalizeNullableText(parsed.summary) ?? transcript,
    };

    if (structuredData.mode !== 'in-person' && structuredData.mode !== 'online') {
      const normalizedMode = rawMode?.toLowerCase() ?? null;
      if (normalizedMode?.includes('in-person') || normalizedMode?.includes('in person') || normalizedMode?.includes('in_person')) {
        structuredData.mode = 'in-person';
      } else if (normalizedMode?.includes('online') || normalizedMode?.includes('virtual') || normalizedMode?.includes('remote')) {
        structuredData.mode = 'online';
      } else {
        structuredData.mode = null;
      }
    }

    if (structuredData.mobile) {
      structuredData.mobile = structuredData.mobile.replace(/[^\d+]/g, '');
    }

    if (structuredData.preferredDay && !VALID_DAYS.includes(structuredData.preferredDay)) {
      structuredData.preferredDay = null;
    }

    const missing: string[] = [];
    if (!structuredData.applicantName) missing.push('Applicant Name');
    if (!structuredData.mobile) missing.push('Mobile Number');
    if (!structuredData.purpose) missing.push('Purpose / Title');
    if (!structuredData.preferredDay) missing.push('Preferred Day');
    if (!structuredData.mode) missing.push('Interaction Mode');
    structuredData.missingFields = missing;
  } catch (error: any) {
    console.error('Sarvam extraction error, falling back to raw transcript:', error?.message);
    structuredData.missingFields = ['Applicant Name', 'Mobile Number', 'Purpose / Title', 'Preferred Day', 'Interaction Mode'];
    modelUsed = 'mock-error-fallback';
  }

  return { structuredData, modelUsed };
}
