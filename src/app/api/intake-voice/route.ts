import { NextRequest, NextResponse } from 'next/server';
import { processPatientVoiceInput } from '@/lib/patientExtractionAdapter';

export async function POST(request: NextRequest) {
  try {
    const fd = await request.formData();
    const draft = await processPatientVoiceInput(fd);
    return NextResponse.json(draft);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Voice processing failed';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
