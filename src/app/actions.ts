'use server';

import { api } from '@/lib/store';
import { CitizenRequest, CommunicationChannel, CommunicationState } from '@/lib/types';
import { assessGrievanceTriage } from '@/lib/grievanceTriageAdapter';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function submitRequest(formData: FormData) {
  const category = formData.get('category') as CitizenRequest['category'];
  const purpose = formData.get('purpose') as string;
  const summary = formData.get('summary') as string;
  const aiTriage = category === 'grievance'
    ? await assessGrievanceTriage(purpose, summary)
    : undefined;

  const req = await api.addRequest({
    applicantName: formData.get('applicantName') as string,
    mobile: formData.get('mobile') as string,
    category,
    purpose,
    summary,
    preferredDay: formData.get('preferredDay') as any,
    mode: formData.get('mode') as any,
    status: 'submitted',
    aiTriage,
  });
  
  revalidatePath('/');
  revalidatePath('/dashboard');
  revalidatePath('/staff');
  redirect(`/citizen/track?id=${req.id}&success=1`);
}

export async function preregisterWalkin(formData: FormData) {
  const req = await api.addRequest({
    applicantName: formData.get('applicantName') as string,
    mobile: formData.get('mobile') as string,
    category: 'general_inquiry',
    purpose: 'Walk-in Preregistration',
    summary: formData.get('summary') as string || 'Walk-in',
    preferredDay: formData.get('preferredDay') as any,
    mode: 'in-person',
    status: 'submitted'
  });
  
  revalidatePath('/');
  revalidatePath('/dashboard');
  revalidatePath('/staff');
  redirect(`/citizen/track?id=${req.id}&success=walkin`);
}

export async function getRequest(id: string) {
  return await api.getRequestById(id);
}

export async function getAllRequests() {
  return await api.getRequests();
}

export async function getActiveNotices() {
  return await api.getNotices();
}

export async function updateRequestStatus(
  id: string, 
  status: any, 
  auditAction: string, 
  details?: string,
  extraUpdates?: Partial<CitizenRequest>
) {
  await api.updateRequest(id, { status, ...extraUpdates }, auditAction, 'staff', details);
  revalidatePath('/');
  revalidatePath('/dashboard');
  revalidatePath('/staff');
  revalidatePath(`/citizen/track`);
}

export async function sendCommunication(
  id: string, 
  channel: CommunicationChannel, 
  state: CommunicationState, 
  summary: string
) {
  await api.addCommunication(id, channel, state, summary, 'staff');
  revalidatePath('/');
  revalidatePath('/dashboard');
  revalidatePath('/staff');
  revalidatePath(`/citizen/track`);
}
export async function getStaleRequests(hours?: number) {
  return await api.getStaleRequests(hours);
}

export async function resetDemoDataAction() {
  await api.resetDemoData();
  revalidatePath('/');
  revalidatePath('/dashboard');
  revalidatePath('/staff');
  revalidatePath('/citizen/track');
}
