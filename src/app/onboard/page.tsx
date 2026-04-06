import OnboardForm from './OnboardForm';

export default function OnboardPage() {
  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ 
        width: '100%', 
        maxWidth: '480px', 
        background: 'white', 
        borderRadius: 'var(--radius-lg)', 
        overflow: 'hidden',
        boxShadow: 'var(--shadow-lg)',
        border: '1px solid var(--color-border)'
      }}>
        <div style={{ 
          background: 'var(--color-primary)', 
          padding: '1.5rem 2rem', 
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <div style={{ 
            width: '44px', height: '44px', background: 'rgba(255,255,255,0.2)', 
            borderRadius: '10px', display: 'grid', placeItems: 'center' 
          }}>
            <svg width="24" height="24" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13 12c0-1.1.9-2 2-2h2c1.1 0 2 .9 2 2v6c0 3.3-2.7 6-6 6v2c0 2.2 1.8 4 4 4s4-1.8 4-4v-1.1c1.7-.4 3-2 3-3.9V14" 
                    stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="27" cy="13" r="2" stroke="white" strokeWidth="2.5"/>
            </svg>
          </div>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: '700', margin: 0 }}>Register Clinic</h1>
            <p style={{ fontSize: '0.8125rem', opacity: 0.9, margin: 0 }}>Launch your voice-first clinic in minutes</p>
          </div>
        </div>
        
        <OnboardForm />
      </div>
    </div>
  );
}
