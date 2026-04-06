import type { Metadata } from 'next';
import CitizenServiceCards from './CitizenServiceCards';

export const metadata: Metadata = {
  title: 'Citizen Portal | Office of the Commissioner',
  description: 'Submit requests, track status, and register walk-ins through the Commissioner Citizen Portal.',
};

export default function CitizenPortalPage() {
  return (
    <div style={{ maxWidth: '860px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '0.5rem' }}>
          Citizen Portal
        </h1>
        <p style={{ color: '#64748b', fontSize: '1.05rem' }}>
          Welcome. Select a service below to interact with the Commissioner&apos;s Office.
          Voice intake is available in Kannada via Sarvam AI.
        </p>
      </div>

      {/* Service Cards — client component for hover interactivity */}
      <CitizenServiceCards />

      {/* Info Banner */}
      <div style={{
        marginTop: '2.5rem',
        padding: '1rem 1.5rem',
        backgroundColor: 'var(--color-primary-soft)',
        border: '1px solid var(--color-primary-outline)',
        borderRadius: 'var(--radius-md)',
        fontSize: '0.875rem',
        color: 'var(--color-primary-hover)',
        display: 'flex',
        gap: '0.75rem',
        alignItems: 'flex-start',
      }}>
        <span style={{ fontSize: '1.25rem' }}>ℹ️</span>
        <div>
          <strong>Voice Intake Available:</strong> All request forms support Kannada voice input via Sarvam AI.
          Speak naturally — the system will transcribe and pre-fill the form for your review.
          AI-generated drafts are advisory only; you must verify before submitting.
        </div>
      </div>
    </div>
  );
}
