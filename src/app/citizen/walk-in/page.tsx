import React from 'react';
import { preregisterWalkin } from '@/app/actions';
import { Info } from 'lucide-react';

export default function WalkInPage() {
  return (
    <div className="max-w-3xl">
      <h1 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Walk-in preregistration</h1>
      
      <div style={{ 
        backgroundColor: '#f0fdf4', border: '1px solid #15803d', color: '#15803d',
        padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '2rem',
        display: 'flex', gap: '0.75rem', alignItems: 'flex-start'
      }}>
        <Info size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
        <div>
          <strong style={{ display: 'block', marginBottom: '0.25rem' }}>Walk-in is allowed. No approval required.</strong>
          <span style={{ fontSize: '0.875rem' }}>
            You may visit the office directly on Monday, Tuesday, or Friday between 10:00 AM and 1:00 PM. 
            Preregistration below is entirely optional but helps us assist you faster upon arrival.
          </span>
        </div>
      </div>

      <form action={preregisterWalkin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', backgroundColor: 'var(--color-surface)', padding: '2rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div>
            <label>Applicant Name</label>
            <input type="text" name="applicantName" required style={{ width: '100%' }} />
          </div>
          <div>
            <label>Mobile Number</label>
            <input type="tel" name="mobile" required style={{ width: '100%' }} />
          </div>
        </div>
        
        <div>
          <label>Expected Visit Day</label>
          <select name="preferredDay" required style={{ width: '100%' }}>
            <option value="Monday">Monday</option>
            <option value="Tuesday">Tuesday</option>
            <option value="Friday">Friday</option>
          </select>
        </div>

        <div>
           <label>Brief Reason (Optional)</label>
           <textarea name="summary" rows={3} style={{ width: '100%' }} placeholder="E.g., Pension document submission"></textarea>
        </div>

        <button type="submit" style={{ 
          backgroundColor: 'var(--color-primary)', color: 'white', 
          border: 'none', padding: '0.75rem', borderRadius: 'var(--radius-md)', 
          fontWeight: 600, fontSize: '1rem', marginTop: '1rem' 
        }}>
          Generate Fast-Track Token
        </button>
      </form>
    </div>
  );
}
