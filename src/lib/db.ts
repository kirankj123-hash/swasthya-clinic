import { createClient, SupabaseClient } from '@supabase/supabase-js';

declare global {
  var __SWASTHYA_CLIENT: SupabaseClient | undefined;
}

export function getDb(): SupabaseClient {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL is not configured.');
  }
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!key) throw new Error('Supabase key is not configured.');

  if (!globalThis.__SWASTHYA_CLIENT) {
    globalThis.__SWASTHYA_CLIENT = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      key,
      { auth: { persistSession: false } }
    );
  }
  return globalThis.__SWASTHYA_CLIENT;
}

/** Scoped query helper — all clinic queries go through this */
export function clinicQuery(clinicId: string) {
  const db = getDb();
  return {
    appointments: () =>
      db.from('appointments').select('*').eq('clinic_id', clinicId),
    patients: () =>
      db.from('patients').select('*').eq('clinic_id', clinicId),
    doctors: () =>
      db.from('doctors').select('*').eq('clinic_id', clinicId),
    auditLog: () =>
      db.from('audit_log').select('*').eq('clinic_id', clinicId),
  };
}

export async function getClinicBySlug(slug: string) {
  const { data } = await getDb()
    .from('clinics')
    .select('*')
    .eq('slug', slug)
    .single();
  return data;
}

export async function getClinicByDomain(domain: string) {
  const { data } = await getDb()
    .from('clinics')
    .select('*')
    .eq('custom_domain', domain)
    .single();
  return data;
}

export async function auditLog(
  clinicId: string,
  actor: string,
  action: string,
  targetId?: string,
  meta?: Record<string, unknown>
) {
  await getDb().from('audit_log').insert({
    clinic_id: clinicId,
    actor,
    action,
    target_id: targetId ?? null,
    meta: meta ?? null,
  });
}
