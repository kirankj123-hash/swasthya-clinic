import { SarvamAIClient } from 'sarvamai';

const PRIMARY_CHAT_MODEL = 'sarvam-30b';

function extractJsonObjectCandidate(rawText: string): string | null {
  const trimmed = rawText.trim();
  const withoutCodeFence = trimmed
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();

  if (!withoutCodeFence.includes('{')) {
    return null;
  }

  let depth = 0;
  let startIndex = -1;
  let inString = false;
  let isEscaped = false;

  for (let index = 0; index < withoutCodeFence.length; index += 1) {
    const char = withoutCodeFence[index];

    if (isEscaped) {
      isEscaped = false;
      continue;
    }

    if (char === '\\' && inString) {
      isEscaped = true;
      continue;
    }

    if (char === '"') {
      inString = !inString;
      continue;
    }

    if (inString) {
      continue;
    }

    if (char === '{') {
      if (depth === 0) {
        startIndex = index;
      }
      depth += 1;
    } else if (char === '}') {
      depth -= 1;
      if (depth === 0 && startIndex >= 0) {
        return withoutCodeFence.slice(startIndex, index + 1);
      }
    }
  }

  return null;
}

function parseJsonObject<T>(rawText: string): T | null {
  const directCandidate = rawText.trim();
  if (directCandidate) {
    try {
      return JSON.parse(directCandidate) as T;
    } catch {}
  }

  const extractedCandidate = extractJsonObjectCandidate(rawText);
  if (!extractedCandidate) {
    return null;
  }

  try {
    return JSON.parse(extractedCandidate) as T;
  } catch {
    return null;
  }
}

export async function requestSarvamToolObject<T>({
  systemPrompt,
  userPrompt,
  toolName,
  toolDescription,
  parameters,
  maxTokens = 700,
}: {
  systemPrompt: string;
  userPrompt: string;
  toolName: string;
  toolDescription: string;
  parameters: Record<string, unknown>;
  maxTokens?: number;
}): Promise<{ parsed: T; modelUsed: string; rawText: string }> {
  const apiKey = process.env.SARVAM_API_KEY;
  if (!apiKey) {
    throw new Error('SARVAM_API_KEY is not configured.');
  }

  const client = new SarvamAIClient({ apiSubscriptionKey: apiKey });
  const response = await client.chat.completions({
    model: PRIMARY_CHAT_MODEL,
    temperature: 0,
    max_tokens: maxTokens,
    tool_choice: 'required',
    tools: [
      {
        type: 'function',
        function: {
          name: toolName,
          description: toolDescription,
          parameters,
        },
      },
    ],
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
  });

  const toolArguments = response.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments ?? '';
  const rawText = toolArguments || response.choices?.[0]?.message?.content?.trim() || '';
  const parsed = parseJsonObject<T>(rawText);

  if (!parsed) {
    throw new Error('Sarvam returned non-JSON tool arguments.');
  }

  return {
    parsed,
    modelUsed: response.model || PRIMARY_CHAT_MODEL,
    rawText,
  };
}
