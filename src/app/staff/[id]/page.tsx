import React from 'react';
import { getRequest, updateRequestStatus, sendCommunication } from '@/app/actions';
import Link from 'next/link';
import { ArrowLeft, Clock, Send, MessageSquare, FileText, CheckCircle, AlertCircle, History } from 'lucide-react';
import { format } from 'date-fns';
import { GrievanceUrgency } from '@/lib/types';

function FieldRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', gap: '1rem', paddingBottom: '0.875rem', borderBottom: '1px solid var(--color-border)', alignItems: 'flex-start' }}>
      <span style={{ minWidth: '160px', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', paddingTop: '0.1rem' }}>{label}</span>
      <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{value}</span>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, {color: string; bg: string}> = {
    submitted:    { color: '#475569', bg: '#f1f5f9' },
    under_review: { color: '#b45309', bg: '#fffbeb' },
    approved:     { color: '#15803d', bg: '#f0fdf4' },
    rescheduled:  { color: '#1d4ed8', bg: '#eff6ff' },
    rejected:     { color: '#b91c1c', bg: '#fef2f2' },
    attended:     { color: '#15803d', bg: '#f0fdf4' },
    closed:       { color: '#64748b', bg: '#f1f5f9' },
  };
  const c = map[status] ?? map.submitted;
  return (
    <span style={{ display: 'inline-block', backgroundColor: c.bg, color: c.color, padding: '0.3rem 0.75rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
      {status.replace('_', ' ')}
    </span>
  );
}

function UrgencyBadge({ urgency }: { urgency: GrievanceUrgency }) {
  const map: Record<GrievanceUrgency, { color: string; bg: string }> = {
    low: { color: '#475569', bg: '#f1f5f9' },
    medium: { color: '#b45309', bg: '#fffbeb' },
    high: { color: '#b91c1c', bg: '#fef2f2' },
    critical: { color: '#ffffff', bg: '#991b1b' },
  };
  const c = map[urgency];
  return (
    <span style={{ display: 'inline-block', backgroundColor: c.bg, color: c.color, padding: '0.3rem 0.75rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
      {urgency}
    </span>
  );
}

function SectionCard({ title, icon, children, accent }: { title: string; icon: React.ReactNode; children: React.ReactNode; accent?: string }) {
  return (
    <div style={{ backgroundColor: 'var(--color-surface)', border: `1px solid ${accent ?? 'var(--color-border)'}`, borderRadius: 'var(--radius-xl)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', padding: '1rem 1.5rem', borderBottom: `1px solid ${accent ?? 'var(--color-border)'}`, backgroundColor: accent ? '#fafbff' : '#f8fafc' }}>
        {icon}
        <h2 style={{ fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-text-muted)', margin: 0 }}>{title}</h2>
      </div>
      <div style={{ padding: '1.5rem' }}>
        {children}
      </div>
    </div>
  );
}

export default async function StaffDetailView({ params }: { params: Promise<{ id: string }> }) {
  const p = await params;
  const req = await getRequest(p.id);

  if (!req) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
        Request not found. <Link href="/staff" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>Back to Queue</Link>
      </div>
    );
  }

  const isTerminal = ['closed', 'attended'].includes(req.status);
  const canAssignSlot = ['submitted', 'under_review', 'rescheduled', 'approved'].includes(req.status);
  const hasNoComm = req.communications.length === 0 && req.status !== 'submitted';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '860px' }}>

      {/* Back + header */}
      <div>
        <Link href="/staff" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', color: 'var(--color-text-muted)', fontSize: '0.85rem', fontWeight: 500 }}>
          <ArrowLeft size={15} /> Back to Staff Operations
        </Link>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>Decision Packet — {req.id}</h1>
            <div style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
              Submitted {format(new Date(req.createdAt), 'EEE, MMM d yyyy, h:mm a')} · Last updated {format(new Date(req.updatedAt), 'MMM d, h:mm a')}
            </div>
          </div>
          <StatusBadge status={req.status} />
        </div>
      </div>

      {/* Warn if action taken but no comms dispatched */}
      {hasNoComm && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.875rem 1.25rem', backgroundColor: '#fffbeb', border: '1px solid #fbbf24', borderRadius: 'var(--radius-lg)', fontSize: '0.875rem', color: '#b45309', fontWeight: 500 }}>
          <AlertCircle size={17} />
          Status has been updated but no citizen communication has been dispatched. Use Block 3 below to notify the applicant.
        </div>
      )}

      {/* ─── Block 1: Request Summary ─────────────────── */}
      <SectionCard title="1 · Request Summary" icon={<FileText size={16} color="var(--color-primary)" />}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
          <FieldRow label="Applicant" value={`${req.applicantName} · ${req.mobile}`} />
          <FieldRow label="Category" value={req.category.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())} />
          <FieldRow label="Preferred Day" value={req.preferredDay} />
          <FieldRow label="Interaction Mode" value={req.mode === 'in-person' ? 'In-Person Visit' : 'Online / Remote'} />
          <FieldRow label="Purpose" value={req.purpose} />
          {req.aiTriage && (
            <div style={{ backgroundColor: '#f8fafc', border: '1px solid var(--color-primary-outline)', borderRadius: 'var(--radius-lg)', padding: '1rem 1.1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  AI Grievance Triage
                </div>
                <UrgencyBadge urgency={req.aiTriage.urgency} />
              </div>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-text)' }}>
                {req.aiTriage.staffSummary}
              </div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                {req.aiTriage.rationale}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                Confidence: <strong>{req.aiTriage.confidence}</strong> · Model: {req.aiTriage.modelUsed}
              </div>
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Citizen Submission Summary</span>
            <div style={{ backgroundColor: '#f8fafc', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '1rem', fontSize: '0.875rem', lineHeight: 1.6 }}>
              {req.summary}
            </div>
          </div>

          {req.assignedDate && (
            <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #86efac', borderRadius: 'var(--radius-md)', padding: '0.75rem 1rem', fontSize: '0.875rem' }}>
              <span style={{ fontWeight: 600, color: '#15803d' }}>Assigned Slot: </span>
              <span>{req.assignedDate} · {req.assignedTimeStr ?? 'Time TBD'}</span>
            </div>
          )}

          {req.rejectionReason && (
            <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: 'var(--radius-md)', padding: '0.75rem 1rem', fontSize: '0.875rem' }}>
              <span style={{ fontWeight: 600, color: '#b91c1c' }}>Rejection Reason: </span>
              <span>{req.rejectionReason}</span>
            </div>
          )}
          {req.rescheduleReason && (
            <div style={{ backgroundColor: '#eff6ff', border: '1px solid #93c5fd', borderRadius: 'var(--radius-md)', padding: '0.75rem 1rem', fontSize: '0.875rem' }}>
              <span style={{ fontWeight: 600, color: '#1d4ed8' }}>Reschedule Reason: </span>
              <span>{req.rescheduleReason}</span>
            </div>
          )}
        </div>
      </SectionCard>

      {/* ─── Block 2: Decision ────────────────────────── */}
      {!isTerminal && (
        <SectionCard title="2 · Decision" icon={<CheckCircle size={16} color="#15803d" />} accent="#d1fae5">
          <form action={async (formData) => {
            'use server';
            const actionType = formData.get('actionType') as string;
            const extra: Record<string, string | undefined> = {};
            extra.internalStaffNote = formData.get('internalStaffNote') as string || undefined;
            extra.publicOfficeNote = formData.get('publicOfficeNote') as string || undefined;

            let newStatus = req.status;
            let auditText = 'Staff Note Added';

            if (actionType === 'mark_review') {
              newStatus = 'under_review';
              auditText = 'Moved to Under Review';
            } else if (actionType === 'approve') {
              newStatus = 'approved';
              auditText = 'Request Approved';
              extra.assignedDate = formData.get('assignedDate') as string || undefined;
              extra.assignedTimeStr = formData.get('assignedTimeStr') as string || undefined;
              if (extra.assignedDate) auditText += ' and Slot Assigned';
            } else if (actionType === 'reschedule') {
              newStatus = 'rescheduled';
              auditText = 'Meeting Rescheduled';
              extra.rescheduleReason = formData.get('reasonText') as string || undefined;
              extra.assignedDate = formData.get('assignedDate') as string || undefined;
              extra.assignedTimeStr = formData.get('assignedTimeStr') as string || undefined;
            } else if (actionType === 'reject') {
              newStatus = 'rejected';
              auditText = 'Request Rejected';
              extra.rejectionReason = formData.get('reasonText') as string || undefined;
            } else if (actionType === 'attend') {
              newStatus = 'attended';
              auditText = 'Visitor Attended';
            } else if (actionType === 'close') {
              newStatus = 'closed';
              auditText = 'Case Closed';
            }

            await updateRequestStatus(req.id, newStatus, auditText, extra.internalStaffNote, extra);
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

              {/* State Transition */}
              <div>
                <label>State Transition</label>
                <select name="actionType" required>
                  <option value="">— Select Action —</option>
                  {req.status === 'submitted' && <option value="mark_review">Move to Under Review</option>}
                  {['submitted', 'under_review', 'rescheduled'].includes(req.status) && <option value="approve">Approve — Assign Slot</option>}
                  {['under_review', 'approved'].includes(req.status) && <option value="reschedule">Reschedule</option>}
                  {['submitted', 'under_review', 'rescheduled'].includes(req.status) && <option value="reject">Reject Request</option>}
                  {['approved', 'rescheduled'].includes(req.status) && <option value="attend">Mark as Attended</option>}
                  {['attended', 'approved', 'rejected'].includes(req.status) && <option value="close">Close File</option>}
                </select>
              </div>

              {/* Slot Assignment — shown only for relevant states */}
              {canAssignSlot && (
                <div className="resp-staff-review" style={{ backgroundColor: '#f8fafc', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '1.25rem', gap: '1rem' }}>
                  <div style={{ gridColumn: '1 / -1', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>
                    Slot Assignment (Required for Approve / Reschedule)
                  </div>
                  <div>
                    <label>Assigned Date</label>
                    <input type="date" name="assignedDate" defaultValue={req.assignedDate} />
                  </div>
                  <div>
                    <label>Time Window</label>
                    <input type="text" name="assignedTimeStr" placeholder="e.g. 10:30 AM - 11:00 AM" defaultValue={req.assignedTimeStr} />
                  </div>
                </div>
              )}

              {/* Reason — for reject/reschedule */}
              <div>
                <label>Rejection / Reschedule Reason <span style={{ fontWeight: 400, fontSize: '0.75rem', textTransform: 'none', letterSpacing: 0 }}>(publicly visible to citizen)</span></label>
                <input type="text" name="reasonText" placeholder="Required for reject/reschedule actions" />
              </div>

              {/* Public Office Note */}
              <div>
                <label>Public Office Note <span style={{ fontWeight: 400, fontSize: '0.75rem', textTransform: 'none', letterSpacing: 0 }}>(shown on citizen tracking page)</span></label>
                <input type="text" name="publicOfficeNote" placeholder="e.g. Bring original documents and file copies" defaultValue={req.publicOfficeNote} />
              </div>

              {/* Internal note */}
              <div>
                <label>Internal Staff Note <span style={{ fontWeight: 400, fontSize: '0.75rem', textTransform: 'none', letterSpacing: 0 }}>(audit trail only, not citizen-visible)</span></label>
                <input type="text" name="internalStaffNote" placeholder="e.g. Zonal officer briefed on this file" />
              </div>

              <button type="submit" style={{ backgroundColor: 'var(--color-primary)', color: 'white', border: 'none', padding: '0.875rem', borderRadius: 'var(--radius-md)', fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                <CheckCircle size={16} /> Confirm Decision
              </button>
            </div>
          </form>
        </SectionCard>
      )}

      {/* ─── Block 3: Citizen Communication ─────────── */}
      <SectionCard title="3 · Citizen Communication" icon={<MessageSquare size={16} color="#1d4ed8" />} accent="#dbeafe">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          {/* Dispatch form */}
          <form action={async (formData) => {
            'use server';
            const channel = formData.get('channel') as string;
            const summary = formData.get('summary') as string;
            if (channel && summary) {
              await sendCommunication(req.id, channel as any, 'sent', summary);
            }
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="resp-staff-review" style={{ gap: '1rem' }}>
                <div>
                  <label>Channel</label>
                  <select name="channel" required>
                    <option value="SMS">SMS</option>
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="email">Email</option>
                    <option value="portal only">Portal Only</option>
                  </select>
                </div>
                <div>
                  <label>Message Summary</label>
                  <input type="text" name="summary" required placeholder="e.g. Your appointment is confirmed for Thursday 10:30 AM" />
                </div>
              </div>
              <button type="submit" style={{ backgroundColor: '#1d4ed8', color: 'white', border: 'none', padding: '0.75rem 1.25rem', borderRadius: 'var(--radius-md)', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                <Send size={15} /> Dispatch Message
              </button>
            </div>
          </form>

          {/* Communication history */}
          {req.communications.length > 0 ? (
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-text-muted)', marginBottom: '0.75rem' }}>Dispatch History</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {req.communications.map(c => (
                  <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', backgroundColor: c.state === 'failed' ? '#fef2f2' : '#f0fdf4', border: `1px solid ${c.state === 'failed' ? '#fecaca' : '#86efac'}`, borderRadius: 'var(--radius-md)', fontSize: '0.8125rem' }}>
                    <span style={{ fontWeight: 500 }}>{c.summary}</span>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexShrink: 0 }}>
                      <span style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>{c.channel}</span>
                      <span style={{ fontWeight: 700, color: c.state === 'failed' ? '#b91c1c' : '#15803d', fontSize: '0.7rem', textTransform: 'uppercase' }}>{c.state}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>No communications dispatched yet.</div>
          )}
        </div>
      </SectionCard>

      {/* ─── Block 4: Internal Audit Timeline ────────── */}
      <SectionCard title="4 · Audit Timeline" icon={<History size={16} color="var(--color-text-muted)" />}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          {[...req.auditTimeline].reverse().map((event, i, arr) => (
            <div key={event.id} style={{ display: 'flex', gap: '1rem', paddingBottom: i < arr.length - 1 ? '1.25rem' : '0', paddingTop: i > 0 ? '1.25rem' : '0', borderTop: i > 0 ? '1px solid var(--color-border)' : 'none' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: event.actor === 'staff' ? 'var(--color-primary)' : event.actor === 'system' ? '#64748b' : '#15803d', marginTop: '4px' }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{event.action}</div>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginTop: '0.2rem' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Clock size={11} /> {format(new Date(event.timestamp), 'MMM d yyyy, h:mm a')}
                  </span>
                  <span style={{ fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', color: event.actor === 'staff' ? 'var(--color-primary)' : '#64748b' }}>{event.actor}</span>
                </div>
                {event.details && (
                  <div style={{ marginTop: '0.4rem', fontSize: '0.8125rem', color: 'var(--color-text-muted)', backgroundColor: '#f8fafc', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)' }}>
                    {event.details}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

    </div>
  );
}
