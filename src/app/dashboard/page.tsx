import React from 'react';
import { getAllRequests, getStaleRequests, resetDemoDataAction } from '@/app/actions';
import Link from 'next/link';
import { Users, FileText, CheckCircle, Search, CalendarDays, AlertTriangle, ArrowRight, Clock, ShieldAlert, Siren } from 'lucide-react';
import { format } from 'date-fns';
import { getTodayRule, SCHEDULE } from '@/lib/scheduleConfig';
import { DemoResetButton } from '@/components/dashboard/DemoResetButton';

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { color: string; bg: string }> = {
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
    <span style={{ display: 'inline-block', backgroundColor: c.bg, color: c.color, padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase' }}>
      {status.replace('_', ' ')}
    </span>
  );
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams?: Promise<{ demo?: string }>;
}) {
  const params = (await searchParams) ?? {};
  const requests = await getAllRequests();
  const staleRequests = await getStaleRequests(48); // 48h threshold
  const rule = getTodayRule();

  // Compute metrics
  const pendingTriage = requests.filter(r => r.status === 'submitted').length;
  const underReview   = requests.filter(r => r.status === 'under_review').length;
  const totalApproved = requests.filter(r => ['approved', 'rescheduled'].includes(r.status)).length;
  const walkinPreregs = requests.filter(r => r.category === 'general_inquiry').length;
  const openHouseReqs = requests.filter(r => r.category === 'open_house').length;
  const projectReviews = requests.filter(r => r.category === 'project_review').length;
  const grievances    = requests.filter(r => r.category === 'grievance').length;
  const resolvedCases = requests.filter(r => ['attended', 'closed'].includes(r.status)).length;
  const highPriorityOpen = requests.filter(r => r.aiTriage && ['high', 'critical'].includes(r.aiTriage.urgency) && ['submitted', 'under_review'].includes(r.status)).length;
  const serviceBacklog = requests.filter(r => ['submitted', 'under_review', 'approved', 'rescheduled'].includes(r.status)).length;
  const resolutionRate = requests.length > 0 ? Math.round((resolvedCases / requests.length) * 100) : 0;

  // Today's appointment count
  const dayNames = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const todayName = dayNames[new Date().getDay()];
  const todayApproved = requests.filter(r => ['approved','rescheduled'].includes(r.status) && r.preferredDay === todayName).length;

  // Open house capacity warning (for this week's Thursday)
  const thuApproved = requests.filter(r => r.category === 'open_house' && r.status === 'approved').length;
  const thuCapacity = SCHEDULE['Thursday'].capacity;
  const thuFull = thuApproved >= thuCapacity;

  // Dispatch health
  let commsTotal = 0, commsSent = 0, commsFailed = 0;
  requests.forEach(r => {
    (r.communications || []).forEach(c => {
      commsTotal++;
      if (c.state === 'sent')   commsSent++;
      if (c.state === 'failed') commsFailed++;
    });
  });

  // Recently Actioned (Sorted by updatedAt DESC)
  const recentlyActioned = [...requests]
    .filter(r => r.status !== 'submitted')
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 6);

  const priorityQueue = [...requests]
    .filter(r => r.aiTriage && ['critical', 'high'].includes(r.aiTriage.urgency) && ['submitted', 'under_review'].includes(r.status))
    .sort((a, b) => {
      const urgencyDelta = urgencyScore(b.aiTriage?.urgency) - urgencyScore(a.aiTriage?.urgency);
      if (urgencyDelta !== 0) return urgencyDelta;
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    })
    .slice(0, 5);

  const showDemoReset =
    process.env.NODE_ENV !== 'production' ||
    process.env.CPIMS_ENABLE_DEMO_RESET === 'true' ||
    params.demo === '1';

  // Needs attention
  const needsAttention = [
    staleRequests.length > 0  && { key: 'stale',   msg: `${staleRequests.length} file${staleRequests.length > 1 ? 's' : ''} stalled (>48h without action)`, color: '#b91c1c', icon: <ShieldAlert size={14} />, link: '/staff' },
    pendingTriage > 0         && { key: 'pending',  msg: `${pendingTriage} request${pendingTriage > 1 ? 's' : ''} pending initial triage`, color: '#b91c1c', icon: <FileText size={14} />, link: '/staff' },
    thuFull                   && { key: 'thu-full', msg: `Thursday Open House Capacity Exhausted (${thuApproved}/${thuCapacity})`, color: '#b45309', icon: <Users size={14} />, link: '/dashboard/calendar' },
    commsFailed > 0           && { key: 'comms',   msg: `${commsFailed} communication dispatch failure${commsFailed > 1 ? 's' : ''} detected`, color: '#b91c1c', icon: <ShieldAlert size={14} />, link: '/staff' },
  ].filter(Boolean) as { key: string; msg: string; color: string; icon: any; link: string }[];

  return (
    <div>
      {/* Page header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.75rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, margin: 0 }}>Commissioner View</h1>
          <p style={{ color: 'var(--color-text-muted)', marginTop: '0.25rem', fontSize: '0.9rem' }}>Operational command overview — Bangalore Development Authority</p>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-end', gap: '0.75rem' }}>
          {showDemoReset && (
            <form action={resetDemoDataAction}>
              <DemoResetButton />
            </form>
          )}
          <Link href="/dashboard/calendar" style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            backgroundColor: 'var(--color-primary)', color: 'white',
            padding: '0.625rem 1.125rem', borderRadius: 'var(--radius-md)',
            fontWeight: 600, fontSize: '0.875rem'
          }}>
            <CalendarDays size={16} /> Calendar View
          </Link>
        </div>
      </div>

      {/* TODAY COMMAND STRIP */}
      <div style={{ backgroundColor: 'var(--color-primary)', borderRadius: 'var(--radius-xl)', padding: '1.5rem', marginBottom: '2rem', color: 'white', boxShadow: 'var(--shadow-lg)' }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', opacity: 0.75, textTransform: 'uppercase', marginBottom: '1rem' }}>
          Today's Office Command
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
          {/* Date + mode */}
          <div style={{ backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 'var(--radius-lg)', padding: '1rem' }}>
            <div style={{ fontSize: '0.75rem', opacity: 0.75, marginBottom: '0.25rem' }}>Date</div>
            <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{todayName}</div>
            <div style={{ fontSize: '0.8rem', opacity: 0.85 }}>{new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
          </div>

          <div style={{ backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 'var(--radius-lg)', padding: '1rem' }}>
            <div style={{ fontSize: '0.75rem', opacity: 0.75, marginBottom: '0.25rem' }}>Office Mode</div>
            <div style={{ fontWeight: 700, fontSize: '1rem' }}>{rule.label}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', opacity: 0.85, marginTop: '0.15rem' }}>
              <Clock size={11} /> {rule.hours}
            </div>
          </div>

          <div style={{ backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 'var(--radius-lg)', padding: '1rem' }}>
            <div style={{ fontSize: '0.75rem', opacity: 0.75, marginBottom: '0.25rem' }}>Today&apos;s Appointments</div>
            <div style={{ fontWeight: 800, fontSize: '2rem', lineHeight: 1 }}>{todayApproved}</div>
            <div style={{ fontSize: '0.75rem', opacity: 0.85 }}>Approved slots for {todayName}</div>
          </div>

          <div style={{ backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 'var(--radius-lg)', padding: '1rem' }}>
            <div style={{ fontSize: '0.75rem', opacity: 0.75, marginBottom: '0.25rem' }}>Pending Action</div>
            <div style={{ fontWeight: 800, fontSize: '2rem', lineHeight: 1 }}>{pendingTriage + underReview}</div>
            <div style={{ fontSize: '0.75rem', opacity: 0.85 }}>{pendingTriage} new · {underReview} in review</div>
          </div>

          {thuFull && (
            <div style={{ backgroundColor: 'rgba(252,165,165,0.25)', border: '1px solid rgba(252,165,165,0.5)', borderRadius: 'var(--radius-lg)', padding: '1rem' }}>
              <div style={{ fontSize: '0.75rem', opacity: 0.85, marginBottom: '0.25rem' }}>⚠ Capacity Warning</div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Thursday Full</div>
              <div style={{ fontSize: '0.75rem', opacity: 0.85 }}>{thuApproved}/{thuCapacity} Open House slots used</div>
            </div>
          )}
        </div>
      </div>

      {/* Needs Attention Panel */}
      {needsAttention.length > 0 && (
        <div style={{ backgroundColor: '#fff8f0', border: '1px solid #fed7aa', borderRadius: 'var(--radius-lg)', padding: '1.25rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: '#b45309', marginBottom: '0.875rem' }}>
            <AlertTriangle size={17} /> Needs Attention
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
            {needsAttention.map(item => (
              <Link key={item.key} href={item.link} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', backgroundColor: 'white', border: '1px solid #fed7aa', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', color: item.color, fontWeight: 500 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {item.icon} {item.msg}
                </span>
                <ArrowRight size={14} />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
          {[
            { label: 'New & Pending', value: pendingTriage, sub: 'Requires initial staff review', color: '#b91c1c', icon: <FileText size={18} /> },
            { label: 'Under Review', value: underReview, sub: 'Awaiting staff decision', color: '#b45309', icon: <Search size={18} /> },
            { label: 'Priority Cases', value: highPriorityOpen, sub: 'High / critical grievances open', color: '#991b1b', icon: <Siren size={18} /> },
            { label: 'Approved Slots', value: totalApproved, sub: 'Ready for hearing / meeting', color: '#15803d', icon: <CheckCircle size={18} /> },
            { label: 'Resolution Rate', value: `${resolutionRate}%`, sub: `${resolvedCases} resolved / closed`, color: '#1d4ed8', icon: <Users size={18} /> },
          ].map(({ label, value, sub, color, icon }) => (
            <div key={label} style={{ backgroundColor: 'var(--color-surface)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color, marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.85rem' }}>
              {icon} {label}
            </div>
            <div style={{ fontSize: '2.25rem', fontWeight: 800, lineHeight: 1 }}>{value}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.4rem' }}>{sub}</div>
          </div>
        ))}
      </div>

      {/* Lower panels */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 2fr', gap: '1.5rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Load by Category */}
          <div style={{ backgroundColor: 'var(--color-surface)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem' }}>Load by Category</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              {[
                { label: 'Grievances', value: grievances, color: '#b91c1c' },
                { label: 'Project Reviews (Wed)', value: projectReviews, color: '#b45309' },
                { label: 'Open House (Thu)', value: openHouseReqs, color: '#1d4ed8' },
                { label: 'General / Walk-ins', value: walkinPreregs, color: '#15803d' },
              ].map(({ label, value, color }) => {
                const total = grievances + projectReviews + openHouseReqs + walkinPreregs || 1;
                const pct = Math.round((value / total) * 100);
                return (
                  <div key={label}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 500, marginBottom: '0.3rem' }}>
                      <span>{label}</span>
                      <span style={{ color, fontWeight: 700 }}>{value}</span>
                    </div>
                    <div style={{ height: '5px', background: '#e9ecef', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${pct}%`, height: '100%', backgroundColor: color, borderRadius: '4px' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Dispatch Health */}
          <div style={{ backgroundColor: 'var(--color-surface)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem' }}>Dispatch Health</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', fontSize: '0.875rem' }}>
              {[
                { label: 'Total Dispatched', value: commsTotal, color: 'var(--color-primary)' },
                { label: 'Delivered', value: commsSent, color: '#15803d' },
                { label: 'Failed', value: commsFailed, color: '#b91c1c' },
              ].map(({ label, value, color }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.75rem', borderBottom: '1px solid var(--color-border)' }}>
                  <span style={{ fontWeight: 500 }}>{label}</span>
                  <span style={{ fontWeight: 700, color }}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ backgroundColor: 'var(--color-surface)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem' }}>Operational Pulse</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
              <div style={{ padding: '1rem', borderRadius: 'var(--radius-md)', backgroundColor: '#f8fafc', border: '1px solid var(--color-border)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>Active Files</div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>{serviceBacklog}</div>
              </div>
              <div style={{ padding: '1rem', borderRadius: 'var(--radius-md)', backgroundColor: '#f8fafc', border: '1px solid var(--color-border)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>Walk-in Demand</div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>{walkinPreregs}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Recently Actioned - Sorted & Enhanced */}
        <div style={{ backgroundColor: 'var(--color-surface)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>Recent Activity Log</h2>
            <Link href="/staff" style={{ fontSize: '0.8rem', color: 'var(--color-primary)', fontWeight: 600 }}>Command Board →</Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {recentlyActioned.map(r => (
              <Link href={`/staff/${r.id}`} key={r.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-primary)' }}>{r.id} — {r.applicantName}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.25rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <span style={{ color: 'var(--color-text)', fontWeight: 600 }}>{r.category.replace('_', ' ').toUpperCase()}</span>
                    <span>•</span>
                    <span>{format(new Date(r.updatedAt), 'MMM d, h:mm a')}</span>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <StatusBadge status={r.status} />
                </div>
              </Link>
            ))}
            {recentlyActioned.length === 0 && (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                No recent activity recorded.
              </div>
            )}
          </div>

          <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--color-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0 }}>Priority Queue Snapshot</h3>
              <Link href="/staff?urgency=critical" style={{ fontSize: '0.8rem', color: 'var(--color-primary)', fontWeight: 700 }}>Open triage →</Link>
            </div>
            {priorityQueue.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {priorityQueue.map(request => (
                  <Link
                    key={request.id}
                    href={`/staff/${request.id}`}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      gap: '1rem',
                      padding: '1rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--color-border)',
                      backgroundColor: '#fffdfb',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, color: 'var(--color-text)' }}>{request.id} · {request.applicantName}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.25rem', lineHeight: 1.5 }}>
                        {request.aiTriage?.staffSummary}
                      </div>
                    </div>
                    <div style={{ fontSize: '0.78rem', fontWeight: 800, color: request.aiTriage?.urgency === 'critical' ? '#991b1b' : '#b45309', textTransform: 'uppercase' }}>
                      {request.aiTriage?.urgency}
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div style={{ padding: '1rem', borderRadius: 'var(--radius-md)', backgroundColor: '#f8fafc', border: '1px dashed var(--color-border)', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                No high-priority grievances are waiting at the moment.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function urgencyScore(urgency?: string) {
  if (urgency === 'critical') return 4;
  if (urgency === 'high') return 3;
  if (urgency === 'medium') return 2;
  if (urgency === 'low') return 1;
  return 0;
}
