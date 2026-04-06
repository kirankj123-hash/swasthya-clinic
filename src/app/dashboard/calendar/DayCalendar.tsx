'use client';

import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Clock, Users, CheckCircle, AlertCircle, UserX } from 'lucide-react';
import { SCHEDULE, getTodayRule } from '@/lib/scheduleConfig';
import { CitizenRequest } from '@/lib/types';
import Link from 'next/link';

interface DayCalendarProps {
  requests: CitizenRequest[];
  initialDate?: string; // YYYY-MM-DD
}

function toLocalDateStr(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function addDays(date: Date, n: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

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
    <span style={{ display: 'inline-block', backgroundColor: c.bg, color: c.color, padding: '0.2rem 0.55rem', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
      {status.replace('_', ' ')}
    </span>
  );
}

export default function DayCalendar({ requests, initialDate }: DayCalendarProps) {
  const today = useMemo(() => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; }, []);
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    if (initialDate) {
      const [y, m, dd] = initialDate.split('-').map(Number);
      const d = new Date(y, m - 1, dd);
      d.setHours(0, 0, 0, 0);
      return d;
    }
    return today;
  });

  const dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][selectedDate.getDay()];
  const rule = SCHEDULE[dayName];
  const isToday = selectedDate.getTime() === today.getTime();
  const dateLabel = selectedDate.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const dateStr = toLocalDateStr(selectedDate);

  // All requests assigned to this specific date
  const dayRequests = useMemo(() =>
    requests.filter(r =>
      r.assignedDate === dateStr && ['approved', 'rescheduled'].includes(r.status)
    ).sort((a, b) => (a.assignedTimeStr || '').localeCompare(b.assignedTimeStr || '')),
    [requests, dateStr]
  );

  // Pending that prefer this day (regardless of assignedDate)
  const pendingForDay = useMemo(() =>
    requests.filter(r => r.preferredDay === dayName && r.status === 'submitted'),
    [requests, dayName]
  );

  const attendedCount = dayRequests.filter(r => r.status === 'attended').length;
  const approvedCount = dayRequests.filter(r => r.status === 'approved').length;
  const rescheduledCount = dayRequests.filter(r => r.status === 'rescheduled').length;

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.125rem', fontWeight: 700 }}>
            {isToday && (
              <span style={{ backgroundColor: 'var(--color-primary)', color: 'white', fontSize: '0.6rem', fontWeight: 800, padding: '0.15rem 0.5rem', borderRadius: '10px', letterSpacing: '0.05em' }}>TODAY</span>
            )}
            {dateLabel}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
            <Clock size={13} /> {rule.hours !== '—' ? rule.hours : 'No public hours'}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={() => setSelectedDate(d => addDays(d, -1))} style={{ padding: '0.375rem 0.6rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', background: 'var(--color-surface)', cursor: 'pointer' }}>
            <ChevronLeft size={16} />
          </button>
          <button onClick={() => setSelectedDate(today)} style={{ fontSize: '0.8rem', padding: '0.375rem 0.75rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', background: isToday ? 'var(--color-primary-soft)' : 'var(--color-surface)', fontWeight: 500, color: isToday ? 'var(--color-primary)' : 'inherit', cursor: 'pointer' }}>
            Today
          </button>
          <button onClick={() => setSelectedDate(d => addDays(d, 1))} style={{ padding: '0.375rem 0.6rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', background: 'var(--color-surface)', cursor: 'pointer' }}>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Office Mode Banner */}
      <div style={{ backgroundColor: rule.bg, border: `1.5px solid ${rule.borderColor}`, borderRadius: 'var(--radius-lg)', padding: '1rem 1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <div style={{ fontWeight: 700, color: rule.color, fontSize: '1rem' }}>{rule.label}</div>
          <div style={{ fontSize: '0.8rem', color: rule.color, opacity: 0.8, marginTop: '0.2rem' }}>{rule.shortLabel}</div>
        </div>
        {rule.mode !== 'closed' && (
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.75rem', color: rule.color, fontWeight: 600 }}>Capacity</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: rule.color, lineHeight: 1 }}>{dayRequests.length}<span style={{ fontSize: '0.9rem', fontWeight: 500 }}>/{rule.capacity}</span></div>
          </div>
        )}
      </div>

      {/* Status Tally Strip */}
      {rule.mode !== 'closed' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
          {[
            { icon: <CheckCircle size={14} />, label: 'Attended', count: attendedCount, color: '#15803d', bg: '#f0fdf4', border: '#86efac' },
            { icon: <Users size={14} />, label: 'Confirmed', count: approvedCount, color: '#1d4ed8', bg: '#eff6ff', border: '#93c5fd' },
            { icon: <AlertCircle size={14} />, label: 'Rescheduled', count: rescheduledCount, color: '#b45309', bg: '#fffbeb', border: '#fcd34d' },
            { icon: <UserX size={14} />, label: 'Pending (Day Pref)', count: pendingForDay.length, color: '#64748b', bg: '#f1f5f9', border: '#cbd5e1' },
          ].map(({ icon, label, count, color, bg, border }) => (
            <div key={label} style={{ backgroundColor: bg, border: `1px solid ${border}`, borderRadius: 'var(--radius-md)', padding: '0.75rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color, fontSize: '0.75rem', fontWeight: 600 }}>
                {icon} {label}
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color, lineHeight: 1 }}>{count}</div>
            </div>
          ))}
        </div>
      )}

      {/* Appointments Timeline */}
      <div>
        <div style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-text-muted)', marginBottom: '0.75rem' }}>
          Appointment Log
        </div>

        {dayRequests.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--color-text-muted)', fontSize: '0.875rem', backgroundColor: 'var(--color-bg)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
            {rule.mode === 'closed' ? 'Office is closed on this day.' : 'No approved appointments assigned to this date yet.'}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
            {dayRequests.map((r, i) => (
              <Link key={r.id} href={`/staff/${r.id}`} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ width: '2rem', height: '2rem', borderRadius: '50%', backgroundColor: 'var(--color-primary-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontWeight: 700, fontSize: '0.8rem', color: 'var(--color-primary)' }}>
                  {i + 1}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--color-primary)' }}>{r.applicantName}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.1rem' }}>
                    {r.id} · {r.category.replace(/_/g, ' ')} · {r.assignedTimeStr || 'Time TBD'}
                  </div>
                </div>
                <StatusBadge status={r.status} />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
