import React from 'react';
import { Info } from 'lucide-react';
import RequestClientForm from './RequestClientForm';

export default async function RequestSubmissionPage({ searchParams }: { searchParams: Promise<{ type?: string }> }) {
  const params = await searchParams;
  const initialType = params.type || 'grievance';
  
  let headerText = 'Submit a Request';
  let infoText = '';
  
  if (initialType === 'open_house') {
    headerText = 'Request Thursday Open House Appointment';
    infoText = 'Open House slots are strictly assigned. You will be notified of your exact time window if approved.';
  } else if (initialType === 'project_review') {
    headerText = 'Submit for Wednesday Project Review';
    infoText = 'Must include relevant file or locality references in the summary. Walk-ins are not permitted for project reviews without submission.';
  } else {
    infoText = 'Use this form for formal administrative complaints requiring official review.';
  }

  return (
    <div className="max-w-3xl">
      <h1 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>{headerText}</h1>
      
      <div style={{ 
        backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', color: '#1d4ed8',
        padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '2rem',
        display: 'flex', gap: '0.75rem', alignItems: 'flex-start'
      }}>
        <Info size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
        <div style={{ fontSize: '0.875rem' }}>{infoText}</div>
      </div>

      <RequestClientForm initialType={initialType} />
    </div>
  );
}
