import React from 'react';
import { getAllRequests } from '@/app/actions';
import Link from 'next/link';
import { format } from 'date-fns';
import { Filter, RotateCcw } from 'lucide-react';
import { CitizenRequest, GrievanceUrgency, RequestCategory, RequestStatus } from '@/lib/types';

function StatusBadge({ status }: { status: string }) {
  let colors = { color: '#64748b', bg: '#f1f5f9' };
  if (status === 'under_review') colors = { color: '#b45309', bg: '#fffbeb' };
  if (status === 'approved' || status === 'attended') colors = { color: '#15803d', bg: '#f0fdf4' };
  if (status === 'rescheduled') colors = { color: '#1d4ed8', bg: '#eff6ff' };
  if (status === 'rejected') colors = { color: '#b91c1c', bg: '#fef2f2' };

  return (
    <span style={{
      display: 'inline-block', backgroundColor: colors.bg, color: colors.color,
      padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase',
    }}>
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
    <span style={{
      display: 'inline-block',
      backgroundColor: c.bg,
      color: c.color,
      padding: '0.25rem 0.55rem',
      borderRadius: '999px',
      fontSize: '0.72rem',
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: '0.04em',
    }}>
      {urgency}
    </span>
  );
}

function urgencyRank(request: CitizenRequest) {
  const map: Record<GrievanceUrgency, number> = {
    critical: 4,
    high: 3,
    medium: 2,
    low: 1,
  };
  return request.aiTriage ? map[request.aiTriage.urgency] : 0;
}

const STATUS_OPTIONS: Array<{ value: RequestStatus | 'all'; label: string }> = [
  { value: 'all', label: 'All statuses' },
  { value: 'submitted', label: 'Submitted' },
  { value: 'under_review', label: 'Under review' },
  { value: 'approved', label: 'Approved' },
  { value: 'rescheduled', label: 'Rescheduled' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'attended', label: 'Attended' },
  { value: 'closed', label: 'Closed' },
];

const CATEGORY_OPTIONS: Array<{ value: RequestCategory | 'all'; label: string }> = [
  { value: 'all', label: 'All categories' },
  { value: 'grievance', label: 'Grievances' },
  { value: 'project_review', label: 'Project reviews' },
  { value: 'open_house', label: 'Open house' },
  { value: 'general_inquiry', label: 'General / walk-in' },
];

const URGENCY_OPTIONS: Array<{ value: GrievanceUrgency | 'all' | 'none'; label: string }> = [
  { value: 'all', label: 'All urgencies' },
  { value: 'critical', label: 'Critical' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
  { value: 'none', label: 'No AI triage' },
];

export default async function StaffQueuePage({
  searchParams,
}: {
  searchParams?: Promise<{
    status?: string | string[];
    category?: string | string[];
    urgency?: string | string[];
  }>;
}) {
  const params = (await searchParams) ?? {};
  const statusFilter = Array.isArray(params.status) ? params.status.at(-1) ?? 'all' : params.status ?? 'all';
  const categoryFilter = Array.isArray(params.category) ? params.category.at(-1) ?? 'all' : params.category ?? 'all';
  const urgencyFilter = Array.isArray(params.urgency) ? params.urgency.at(-1) ?? 'all' : params.urgency ?? 'all';

  const requests = (await getAllRequests()).sort((a, b) => {
    const openA = ['submitted', 'under_review'].includes(a.status) ? 1 : 0;
    const openB = ['submitted', 'under_review'].includes(b.status) ? 1 : 0;
    if (openA !== openB) return openB - openA;

    const urgencyDelta = urgencyRank(b) - urgencyRank(a);
    if (urgencyDelta !== 0) return urgencyDelta;

    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const filteredRequests = requests.filter(request => {
    if (statusFilter !== 'all' && request.status !== statusFilter) return false;
    if (categoryFilter !== 'all' && request.category !== categoryFilter) return false;
    if (urgencyFilter === 'none') return !request.aiTriage;
    if (urgencyFilter !== 'all' && request.aiTriage?.urgency !== urgencyFilter) return false;
    return true;
  });

  const openCount = filteredRequests.filter(request => ['submitted', 'under_review'].includes(request.status)).length;
  const priorityCount = filteredRequests.filter(request => request.aiTriage && ['critical', 'high'].includes(request.aiTriage.urgency)).length;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', gap: '1rem', flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', margin: 0 }}>Staff Triage Queue</h1>
          <p style={{ marginTop: '0.35rem', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
            {filteredRequests.length} file{filteredRequests.length === 1 ? '' : 's'} visible · {openCount} open · {priorityCount} priority
          </p>
        </div>
      </div>

      <div style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: '1rem', marginBottom: '1rem' }}>
        <form action="/staff" method="get" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.875rem', alignItems: 'end' }}>
          <div>
            <label htmlFor="status">Status</label>
            <select id="status" name="status" defaultValue={statusFilter}>
              {STATUS_OPTIONS.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="category">Category</label>
            <select id="category" name="category" defaultValue={categoryFilter}>
              {CATEGORY_OPTIONS.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="urgency">Urgency</label>
            <select id="urgency" name="urgency" defaultValue={urgencyFilter}>
              {URGENCY_OPTIONS.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', gap: '0.625rem', alignItems: 'center' }}>
            <button type="submit" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', border: 'none', backgroundColor: 'var(--color-primary)', color: 'white', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', fontWeight: 700 }}>
              <Filter size={16} /> Apply Filters
            </button>
            <Link href="/staff" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.45rem', border: '1px solid var(--color-border)', backgroundColor: 'white', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', fontWeight: 700 }}>
              <RotateCcw size={15} /> Reset
            </Link>
          </div>
        </form>
      </div>

      <div style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
          <thead style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid var(--color-border)' }}>
            <tr>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>ID</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>Date & Time</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>Applicant</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>Category / Day</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>AI Triage</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>Status</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600, color: 'var(--color-text-muted)', textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.map(request => (
              <tr key={request.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                <td style={{ padding: '1rem', fontFamily: 'monospace', fontWeight: 500 }}>{request.id}</td>
                <td style={{ padding: '1rem', color: 'var(--color-text-muted)' }}>{format(new Date(request.createdAt), 'MMM d, h:mm a')}</td>
                <td style={{ padding: '1rem', fontWeight: 500 }}>{request.applicantName}</td>
                <td style={{ padding: '1rem' }}>
                  <div style={{ fontWeight: 500 }}>{request.category.replace('_', ' ').toUpperCase()}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Pref: {request.preferredDay}</div>
                </td>
                <td style={{ padding: '1rem', minWidth: '220px' }}>
                  {request.aiTriage ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                      <UrgencyBadge urgency={request.aiTriage.urgency} />
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', lineHeight: 1.4 }}>
                        {request.aiTriage.staffSummary}
                      </div>
                    </div>
                  ) : (
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>No AI triage</span>
                  )}
                </td>
                <td style={{ padding: '1rem' }}>
                  <StatusBadge status={request.status} />
                </td>
                <td style={{ padding: '1rem', textAlign: 'right' }}>
                  <Link href={`/staff/${request.id}`} style={{ color: 'var(--color-primary)', fontWeight: 700 }}>
                    Review
                  </Link>
                </td>
              </tr>
            ))}
            {filteredRequests.length === 0 && (
              <tr>
                <td colSpan={7} style={{ padding: '2rem' }}>
                  <div style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>
                    <div style={{ fontWeight: 700, color: 'var(--color-text)', marginBottom: '0.35rem' }}>No files match the current filters.</div>
                    <div style={{ fontSize: '0.85rem' }}>Reset the queue filters to restore the full operational view.</div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
