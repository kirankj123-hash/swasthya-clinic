import Link from 'next/link';

export default function HomePage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '2rem', textAlign: 'center' }}>
      <div>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#0c4a6e', marginBottom: '0.75rem' }}>
          ಸ್ವಾಸ್ಥ್ಯ ಕ್ಲಿನಿಕ್ — Swasthya Clinic
        </h1>
        <p style={{ color: '#0369a1', fontSize: '1.1rem', maxWidth: '480px', lineHeight: 1.6 }}>
          Voice-first appointment management for Indian clinics.
          Kannada · Hindi · English.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link href="/onboard" style={{
          padding: '0.875rem 2rem',
          background: '#0891b2',
          color: 'white',
          borderRadius: '8px',
          fontWeight: 700,
          fontSize: '1rem',
          textDecoration: 'none',
        }}>
          Register Your Clinic
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', maxWidth: '640px', width: '100%', marginTop: '1rem' }}>
        {[
          { icon: '🎙️', title: 'Voice Intake', desc: 'Receptionist speaks — AI fills the form in Kannada/Hindi/English' },
          { icon: '📋', title: 'Live Queue', desc: 'Doctor sees real-time patient queue on any device' },
          { icon: '🏥', title: 'Multi-Clinic', desc: 'Each clinic gets their own subdomain and isolated data' },
        ].map(({ icon, title, desc }) => (
          <div key={title} style={{ padding: '1.25rem', background: 'white', border: '1px solid #e0f2fe', borderRadius: '8px', textAlign: 'left' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{icon}</div>
            <div style={{ fontWeight: 600, color: '#0c4a6e', marginBottom: '0.25rem' }}>{title}</div>
            <div style={{ fontSize: '0.825rem', color: '#0369a1', lineHeight: 1.5 }}>{desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
