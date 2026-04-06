import { getDoctorForClinic } from '@/app/actions';
import SettingsForm from './SettingsForm';
import Link from 'next/link';

export default async function SettingsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const doctor = await getDoctorForClinic();

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '700', color: 'var(--color-text)' }}>Clinic Settings</h1>
          <p style={{ color: 'var(--color-text-muted)' }}>Manage your profile, working hours and appointment slots.</p>
        </div>
        <Link href={`/${slug}/admin`} style={{ color: 'var(--color-primary)', fontWeight: '600', fontSize: '0.875rem' }}>
          ← Back to Dashboard
        </Link>
      </header>

      <SettingsForm doctor={doctor} />
    </div>
  );
}
