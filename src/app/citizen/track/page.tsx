import React from 'react';
import { getRequest } from '@/app/actions';
import { CheckCircle, Clock, XCircle, Search, CalendarDays, MessageSquare, History } from 'lucide-react';
import { format } from 'date-fns';
import { AcknowledgementActions } from '@/components/citizen/AcknowledgementActions';

function getStatusDetails(status: string) {
  const map: Record<string, { text: string; color: string; bg: string; Icon: any }> = {
    submitted:    { text: 'Submitted & In Queue', color: '#64748b', bg: '#f1f5f9', Icon: Clock },
    under_review: { text: 'Under Staff Review', color: '#b45309', bg: '#fffbeb', Icon: Search },
    approved:     { text: 'Approved', color: '#15803d', bg: '#f0fdf4', Icon: CheckCircle },
    rescheduled:  { text: 'Rescheduled', color: '#1d4ed8', bg: '#eff6ff', Icon: Clock },
    rejected:     { text: 'Rejected', color: '#b91c1c', bg: '#fef2f2', Icon: XCircle },
    attended:     { text: 'Attended', color: '#15803d', bg: '#f0fdf4', Icon: CheckCircle },
    closed:       { text: 'Closed', color: '#475569', bg: '#f1f5f9', Icon: CheckCircle },
  };
  return map[status] || { text: status.replace('_', ' ').toUpperCase(), color: '#000', bg: '#fff', Icon: Clock };
}

function getNextStepCopy(status: string) {
  if (status === 'submitted') return 'Your file is in the fresh-intake queue. Staff will review and assign the next action.';
  if (status === 'under_review') return 'Your file is currently being reviewed by staff. Keep this reference ID ready for follow-up.';
  if (status === 'approved') return 'Your hearing slot is confirmed. Carry this acknowledgement and any required documents.';
  if (status === 'rescheduled') return 'A revised slot has been assigned. Please review the reschedule notice and updated hearing window.';
  if (status === 'rejected') return 'This file has been reviewed and closed for hearing. Read the administrative note for the next office path.';
  if (status === 'attended') return 'Your interaction has been recorded as attended. Final closure or follow-up note may still be added.';
  if (status === 'closed') return 'The file has been formally closed. Keep this acknowledgement for your records.';
  return 'Track this reference ID for all future updates.';
}

export default async function RequestTrackingPage({ searchParams }: { searchParams: Promise<{ id?: string, success?: string }> }) {
  const params = await searchParams;
  const requestId = params.id;
  const isSuccess = !!params.success;

  if (!requestId) {
    return (
      <div className="max-w-xl mx-auto py-12">
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <History size={48} color="var(--color-primary)" style={{ margin: '0 auto 1rem' }} />
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--color-primary)', letterSpacing: '-0.5px' }}>Track Your Request</h1>
          <p style={{ color: 'var(--color-text-muted)' }}>Enter your unique Reference ID to view real-time progress.</p>
        </div>
        
        <div style={{ backgroundColor: 'white', padding: '2.5rem', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--color-border)' }}>
          <form style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }} action="/citizen/track">
            <div>
              <label htmlFor="id" style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.02em' }}>Reference Number</label>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <input 
                  type="text" 
                  name="id" 
                  id="id"
                  placeholder="e.g., REQ-1001" 
                  required 
                  style={{ flex: 1, padding: '1rem', borderRadius: 'var(--radius-md)', border: '2px solid var(--color-border)', outline: 'none', fontSize: '1.1rem', fontWeight: 600, fontFamily: 'monospace' }} 
                />
                <button type="submit" style={{ backgroundColor: 'var(--color-primary)', color: 'white', border: 'none', padding: '0 2rem', borderRadius: 'var(--radius-md)', fontWeight: 800, cursor: 'pointer', fontSize: '1rem' }}>SEARCH</button>
              </div>
            </div>
          </form>
          <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#F8FAFC', borderRadius: 'var(--radius-lg)', fontSize: '0.8rem', color: 'var(--color-text-muted)', textAlign: 'center', border: '1px dashed var(--color-border)' }}>
            Check your SMS or Portal for the tracking ID provided at the time of submission.
          </div>
        </div>
      </div>
    );
  }

  const req = await getRequest(requestId);

  if (!req) {
    return (
      <div className="max-w-xl mx-auto py-12">
        <div style={{ padding: '3rem 2rem', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: 'var(--radius-xl)', textAlign: 'center', boxShadow: 'var(--shadow-lg)' }}>
          <XCircle size={48} color="#b91c1c" style={{ margin: '0 auto 1rem' }} />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#b91c1c', marginBottom: '0.5rem' }}>No Record Found</h2>
          <p style={{ color: '#991b1b', marginBottom: '2rem', fontSize: '1.1rem' }}>We couldn't find a request with the ID: <strong style={{ fontFamily: 'monospace' }}>{requestId}</strong></p>
          <a href="/citizen/track" style={{ display: 'inline-block', backgroundColor: '#b91c1c', color: 'white', padding: '0.75rem 1.75rem', borderRadius: 'var(--radius-md)', fontWeight: 700, textDecoration: 'none', letterSpacing: '0.02em' }}>TRY ANOTHER ID</a>
        </div>
      </div>
    );
  }

  const s = getStatusDetails(req.status);
  const StatusIcon = s.Icon;
  const visibleComms = (req.communications || []).filter(c => c.state === 'sent');
  const nextStepCopy = getNextStepCopy(req.status);

  return (
    <div className="max-w-6xl mx-auto pb-12">
      {isSuccess && (
        <div id="acknowledgement-slip" style={{ marginBottom: '2.5rem', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #bbf7d0', display: 'flex', alignItems: 'center', gap: '1rem', fontWeight: 600, color: '#166534' }}>
            <div style={{ backgroundColor: '#15803d', color: 'white', borderRadius: '50%', padding: '4px' }}>
              <CheckCircle size={20} />
            </div>
            <div>
              <div style={{ fontSize: '1.1rem' }}>{params.success === 'walkin' ? 'Walk-in preregistration recorded' : 'Request submitted successfully'}</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 400, opacity: 0.9 }}>{nextStepCopy}</div>
            </div>
          </div>
          <div style={{ padding: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', color: '#166534', marginBottom: '0.4rem', letterSpacing: '0.06em' }}>Reference ID</div>
              <div style={{ fontSize: '1.35rem', fontWeight: 900, fontFamily: 'monospace', color: 'var(--color-primary)' }}>{req.id}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', color: '#166534', marginBottom: '0.4rem', letterSpacing: '0.06em' }}>Applicant</div>
              <div style={{ fontWeight: 700 }}>{req.applicantName}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', color: '#166534', marginBottom: '0.4rem', letterSpacing: '0.06em' }}>Filed</div>
              <div style={{ fontWeight: 700 }}>{format(new Date(req.createdAt), 'dd MMM yyyy, h:mm a')}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', color: '#166534', marginBottom: '0.4rem', letterSpacing: '0.06em' }}>Current State</div>
              <div style={{ fontWeight: 700 }}>{s.text}</div>
            </div>
          </div>
          <div style={{ padding: '0 1.5rem 1.5rem 1.5rem' }}>
            <div style={{ padding: '1rem', backgroundColor: 'white', borderRadius: 'var(--radius-lg)', border: '1px dashed #86efac' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', color: '#166534', marginBottom: '0.4rem', letterSpacing: '0.06em' }}>Official Acknowledgement</div>
              <div style={{ fontWeight: 700, color: 'var(--color-text)', marginBottom: '0.25rem' }}>{req.purpose}</div>
              <div style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>{req.summary}</div>
            </div>
            <AcknowledgementActions requestId={req.id} applicantName={req.applicantName} purpose={req.purpose} />
            <div className="print-only" style={{ marginTop: '1rem', fontSize: '0.8rem', color: '#475569' }}>
              Track future updates using <strong>{req.id}</strong> at <strong>cpims.vercel.app/citizen/track</strong>
            </div>
          </div>
        </div>
      )}

      {/* Institutional Header */}
      <div style={{ 
        backgroundColor: 'var(--color-primary)', color: 'white', 
        padding: '3rem', borderRadius: '24px 24px 0 0', 
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
        boxShadow: 'var(--shadow-lg)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: 0.8, fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>
            <History size={16} color="var(--color-accent)" /> Official Application Status
          </div>
          <h1 style={{ fontSize: '3.5rem', fontWeight: 900, margin: 0, fontFamily: 'monospace', lineHeight: 1 }}>{req.id}</h1>
          <div style={{ color: 'var(--color-accent)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem', fontSize: '1rem' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--color-accent)', boxShadow: '0 0 10px var(--color-accent)' }} /> 
             AUTHENTICATED BDA CPIMS SERVICE
          </div>
        </div>
        
          <div style={{ 
          backgroundColor: 'white', color: 'var(--color-primary)', padding: '1.25rem 2rem', 
          borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-md)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem',
          borderBottom: '4px solid var(--color-primary)'
        }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>CURRENT STATE</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', fontWeight: 900, fontSize: '1.25rem' }}>
            <StatusIcon size={22} /> {s.text}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.8fr) minmax(0, 1.2fr)', gap: '2.5rem', marginTop: '2.5rem' }}>
        
        {/* Main Details Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          
          <div style={{ backgroundColor: 'white', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
            <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid var(--color-border)', backgroundColor: '#F8FAFC', fontWeight: 800, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '1.1rem', color: 'var(--color-primary)' }}>Submission Metadata</span>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-muted)', backgroundColor: '#F1F5F9', padding: '0.25rem 0.75rem', borderRadius: '99px' }}>
                Filed on {format(new Date(req.createdAt), 'MMMM d, yyyy')}
              </span>
            </div>
            <div style={{ padding: '2rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Applicant</div>
                  <div style={{ fontWeight: 700, fontSize: '1.25rem' }}>{req.applicantName}</div>
                  <div style={{ color: 'var(--color-primary)', fontWeight: 600, fontSize: '0.9rem', marginTop: '0.2rem' }}>+91 {req.mobile}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Service Parameters</div>
                  <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{req.category.replace('_', ' ').toUpperCase()}</div>
                  <div style={{ display: 'inline-block', color: 'var(--color-primary)', backgroundColor: '#EFF6FF', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 800, marginTop: '0.4rem', border: '1px solid #DBEAFE' }}>
                     {req.mode.toUpperCase()} MODE
                  </div>
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>Full Submission Summary</div>
                  <div style={{ padding: '1.5rem', backgroundColor: '#F8FAFC', borderRadius: 'var(--radius-xl)', fontSize: '1rem', lineHeight: 1.7, border: '1px solid var(--color-border)', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)' }}>
                    <div style={{ fontWeight: 800, marginBottom: '0.75rem', color: 'var(--color-primary)', fontSize: '1.1rem' }}>“{req.purpose}”</div>
                    <div style={{ color: '#475569' }}>{req.summary}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Official Response & Logistics - THE GOLD BLOCK */}
          {(req.assignedDate || req.rejectionReason || req.rescheduleReason || req.publicOfficeNote) && (
            <div style={{ backgroundColor: 'white', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-primary-outline)', boxShadow: '0 10px 30px -10px rgba(37, 59, 137, 0.16)', overflow: 'hidden' }}>
              <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid var(--color-primary-outline)', backgroundColor: 'var(--color-accent-soft)', color: 'var(--color-primary)', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.1rem' }}>
                <CalendarDays size={22} color="var(--color-accent)" /> 
                Official Response & Operational Data
              </div>
              <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                
                {req.assignedDate && (
                  <div style={{ backgroundColor: 'var(--color-primary)', color: 'white', padding: '2rem', borderRadius: 'var(--radius-xl)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: 'var(--shadow-md)' }}>
                    <div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-accent)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.6rem', letterSpacing: '0.1em' }}>ASSIGNED HEARING WINDOW</div>
                      <div style={{ fontWeight: 900, fontSize: '1.75rem' }}>{format(new Date(req.assignedDate), 'EEEE, MMMM d, yyyy')}</div>
                      <div style={{ color: 'rgba(255,255,255,0.8)', fontWeight: 600, fontSize: '1.1rem', marginTop: '0.25rem' }}>{req.assignedTimeStr}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ backgroundColor: 'var(--color-accent-soft)', color: 'var(--color-primary)', border: '1px solid var(--color-primary-outline)', padding: '0.6rem 1.25rem', borderRadius: 'var(--radius-md)', fontWeight: 900, fontSize: '0.85rem', boxShadow: '0 4px 10px rgba(0,0,0,0.14)' }}>SECURED</div>
                    </div>
                  </div>
                )}

                {req.rejectionReason && (
                   <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA', padding: '1.5rem', borderRadius: 'var(--radius-xl)' }}>
                     <div style={{ fontSize: '0.8rem', color: '#991B1B', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>Administrative Basis for Rejection</div>
                     <div style={{ color: '#B91C1C', fontWeight: 600, fontSize: '1.05rem', lineHeight: 1.5 }}>{req.rejectionReason}</div>
                   </div>
                )}

                {req.rescheduleReason && (
                   <div style={{ backgroundColor: '#FFFBEB', border: '1px solid #FEF3C7', padding: '1.5rem', borderRadius: 'var(--radius-xl)' }}>
                     <div style={{ fontSize: '0.8rem', color: '#92400E', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>Reschedule Notice</div>
                     <div style={{ color: '#B45309', fontWeight: 600, fontSize: '1.05rem', lineHeight: 1.5 }}>{req.rescheduleReason}</div>
                   </div>
                )}

                {req.publicOfficeNote && (
                   <div style={{ backgroundColor: '#F8FAFC', padding: '1.5rem', borderRadius: 'var(--radius-xl)', border: '1px dashed var(--color-border)' }}>
                     <div style={{ fontSize: '0.8rem', color: 'var(--color-primary)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.75rem', letterSpacing: '0.05em' }}>Official Executive Note</div>
                     <div style={{ color: '#334155', fontSize: '1rem', lineHeight: 1.7, fontWeight: 500 }}>
                       “{req.publicOfficeNote}”
                     </div>
                   </div>
                )}

              </div>
            </div>
          )}

          {/* Citizen Comms History */}
          {visibleComms.length > 0 ? (
            <div style={{ backgroundColor: 'white', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ padding: '1.25rem 2rem', borderBottom: '1px solid var(--color-border)', backgroundColor: '#F8FAFC', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.1rem' }}>
                <MessageSquare size={20} color="var(--color-primary)" /> 
                Communication Record
              </div>
              <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {visibleComms.map((comm, idx) => (
                  <div key={comm.id} style={{ 
                    display: 'flex', flexDirection: 'column', gap: '0.6rem', padding: '1.25rem', 
                    backgroundColor: '#F1F5F9', borderRadius: 'var(--radius-xl)',
                    borderLeft: `5px solid ${idx === 0 ? 'var(--color-primary)' : '#94A3B8'}`,
                    boxShadow: 'var(--shadow-sm)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 900, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.05em', backgroundColor: 'white', padding: '0.2rem 0.6rem', borderRadius: '4px' }}>
                        {comm.channel === 'portal only' ? 'PORTAL NOTIFICATION' : comm.channel}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                        {format(new Date(comm.timestamp), 'MMM d, h:mm a')}
                      </span>
                    </div>
                    <div style={{ fontSize: '1rem', fontWeight: 600, color: '#1E293B' }}>{comm.summary}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ backgroundColor: 'white', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)', padding: '1.5rem' }}>
              <div style={{ fontWeight: 800, color: 'var(--color-primary)', marginBottom: '0.5rem' }}>Communication Record</div>
              <div style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                No formal citizen communication has been dispatched yet. Continue tracking this reference ID for the first official update.
              </div>
            </div>
          )}

        </div>

        {/* Audit Milestones Column - THE COMMAND TRACKER */}
        <div style={{ backgroundColor: 'white', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)', padding: '2rem', boxShadow: 'var(--shadow-lg)', alignSelf: 'start', position: 'sticky', top: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2.5rem' }}>
            <History size={22} color="var(--color-primary)" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 900, margin: 0, color: 'var(--color-primary)' }}>Application Milestones</h2>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', position: 'relative' }}>
            {/* Timeline vertical line */}
            <div style={{ position: 'absolute', left: '19px', top: '15px', bottom: '15px', width: '3px', backgroundColor: '#E2E8F0' }} />

            {req.auditTimeline.map((audit, i) => {
              const isLatest = i === req.auditTimeline.length - 1;
              return (
                <div key={audit.id} style={{ display: 'flex', gap: '1.5rem', position: 'relative', zIndex: 1, marginBottom: '2rem' }}>
                  <div style={{ 
                    width: '40px', height: '40px', borderRadius: '50%', 
                    backgroundColor: 'white', border: `4px solid ${isLatest ? 'var(--color-primary)' : '#CBD5E1'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: isLatest ? '0 0 15px rgba(29, 58, 107, 0.2)' : 'none',
                    flexShrink: 0 
                  }}>
                    {isLatest ? <CheckCircle size={18} color="var(--color-primary)" /> : <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#CBD5E1' }} />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 800, fontSize: '1rem', color: isLatest ? 'var(--color-text)' : 'var(--color-text-muted)', marginBottom: '0.2rem' }}>{audit.action}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.6rem', fontWeight: 600 }}>
                      {format(new Date(audit.timestamp), 'MMM d, yyyy • h:mm a')}
                    </div>
                    {audit.details && (
                      <div style={{ fontSize: '0.85rem', backgroundColor: '#F8FAFC', padding: '0.875rem', borderRadius: 'var(--radius-lg)', border: '1px solid #E2E8F0', color: '#475569', fontStyle: 'italic', lineHeight: 1.5 }}>
                        {audit.details}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          
          <div style={{ marginTop: '2rem', padding: '1.25rem', backgroundColor: '#F8FAFC', borderRadius: 'var(--radius-xl)', fontSize: '0.8rem', color: 'var(--color-text-muted)', textAlign: 'center', border: '1px solid var(--color-border)', lineHeight: 1.5 }}>
            <div style={{ fontWeight: 800, color: 'var(--color-primary)', marginBottom: '0.25rem' }}>TRANSPARENCY NOTICE</div>
            BDA CPIMS provides real-time audit trails. All actions are logged by the Secretariat Office and mirrored here instantly.
          </div>
        </div>
      </div>
    </div>
  );
}
