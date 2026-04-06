'use client';

import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, CalendarDays, AlertTriangle } from 'lucide-react';
import { SCHEDULE } from '@/lib/scheduleConfig';
import { CitizenRequest } from '@/lib/types';
import Link from 'next/link';

interface MonthCalendarProps {
  requests: CitizenRequest[];
}

function getMonthStart(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addMonths(date: Date, num: number) {
  return new Date(date.getFullYear(), date.getMonth() + num, 1);
}

function generateCalendarGrid(startOfMonth: Date) {
  const days = [];
  const d = new Date(startOfMonth);
  const firstDay = d.getDay(); // 0 = Sunday
  d.setDate(d.getDate() - firstDay);
  for (let i = 0; i < 42; i++) {
    days.push(new Date(d));
    d.setDate(d.getDate() + 1);
  }
  return days;
}

function toLocalDateStr(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${dd}`;
}

export default function MonthCalendar({ requests }: MonthCalendarProps) {
  const [offset, setOffset] = useState(0);
  const today = useMemo(() => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; }, []);

  const currentMonthStart = useMemo(() => addMonths(getMonthStart(today), offset), [today, offset]);
  const monthName = currentMonthStart.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
  const grid = useMemo(() => generateCalendarGrid(currentMonthStart), [currentMonthStart]);

  // Build per-date-string maps from assigned dates
  const { counts, failures } = useMemo(() => {
    const counts: Record<string, number> = {};
    const failures: Record<string, boolean> = {};
    requests.forEach(r => {
      if (r.assignedDate && ['approved', 'rescheduled'].includes(r.status)) {
        counts[r.assignedDate] = (counts[r.assignedDate] || 0) + 1;
      }
      if (r.communications?.some(c => c.state === 'failed') && r.assignedDate) {
        failures[r.assignedDate] = true;
      }
    });
    return { counts, failures };
  }, [requests]);

  function getBg(count: number, capacity: number, mode: string) {
    if (mode === 'closed') return '#f1f5f9';
    if (!capacity) return '#ffffff';
    const pct = count / capacity;
    if (pct >= 1) return '#fef2f2';
    if (pct >= 0.7) return '#fffbeb';
    if (count > 0) return '#f0fdf4';
    return '#ffffff';
  }

  function getBorder(count: number, capacity: number, mode: string) {
    if (mode === 'closed') return '#e2e8f0';
    if (!capacity) return 'var(--color-border)';
    const pct = count / capacity;
    if (pct >= 1) return '#fecaca';
    if (pct >= 0.7) return '#fde68a';
    if (count > 0) return '#bbf7d0';
    return 'var(--color-border)';
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <CalendarDays size={20} color="var(--color-primary)" />
          <h2 style={{ fontSize: '1.125rem', fontWeight: 700, margin: 0 }}>Month View</h2>
          <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>{monthName}</span>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <button onClick={() => setOffset(0)} style={{ fontSize: '0.8rem', padding: '0.375rem 0.75rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', background: offset === 0 ? 'var(--color-primary-soft)' : 'var(--color-surface)', fontWeight: 500, color: offset === 0 ? 'var(--color-primary)' : 'inherit', cursor: 'pointer' }}>
            This Month
          </button>
          <button onClick={() => setOffset(o => o - 1)} style={{ padding: '0.375rem 0.6rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', background: 'var(--color-surface)', cursor: 'pointer' }}>
            <ChevronLeft size={16} />
          </button>
          <button onClick={() => setOffset(o => o + 1)} style={{ padding: '0.375rem 0.6rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', background: 'var(--color-surface)', cursor: 'pointer' }}>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Day headers */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.3rem', marginBottom: '0.3rem' }}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
          <div key={d} style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', textAlign: 'center', paddingBottom: '0.35rem', letterSpacing: '0.04em' }}>
            {d}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.3rem' }}>
        {grid.map((date, i) => {
          const inMonth = date.getMonth() === currentMonthStart.getMonth();
          const dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][date.getDay()];
          const rule = SCHEDULE[dayName];
          const dateStr = toLocalDateStr(date);
          const booked = counts[dateStr] || 0;
          const hasFail = failures[dateStr] || false;
          const isToday = date.getTime() === today.getTime();

          const cellStyle: React.CSSProperties = {
            minHeight: '60px',
            backgroundColor: inMonth ? getBg(booked, rule.capacity, rule.mode) : '#f8fafc',
            border: isToday ? '2px solid var(--color-primary)' : `1px solid ${inMonth ? getBorder(booked, rule.capacity, rule.mode) : '#e2e8f0'}`,
            borderRadius: 'var(--radius-md)',
            padding: '0.45rem 0.5rem',
            display: 'flex',
            flexDirection: 'column',
            opacity: inMonth ? 1 : 0.35,
            position: 'relative',
            boxShadow: isToday ? '0 0 0 3px rgba(37,59,137,0.10)' : 'none',
            transition: 'border-color 0.15s',
          };

          const inner = (
            <div style={cellStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: isToday ? 800 : 600, color: isToday ? 'var(--color-primary)' : 'var(--color-text)', lineHeight: 1 }}>
                  {date.getDate()}
                </span>
                {hasFail && inMonth && <AlertTriangle size={11} color="#b91c1c" />}
              </div>
              {inMonth && (
                <div style={{ marginTop: 'auto' }}>
                  {rule.mode === 'closed' ? (
                    <div style={{ fontSize: '0.6rem', color: '#94a3b8', fontWeight: 600 }}>Closed</div>
                  ) : booked > 0 ? (
                    <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--color-text-muted)' }}>{booked}/{rule.capacity}</div>
                  ) : (
                    <div style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#cbd5e1' }} />
                  )}
                </div>
              )}
            </div>
          );

          return inMonth ? (
            <Link key={i} href={`/dashboard/calendar?view=day&date=${dateStr}`} style={{ textDecoration: 'none', display: 'block' }}>
              {inner}
            </Link>
          ) : (
            <div key={i}>{inner}</div>
          );
        })}
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: '1rem', marginTop: '1.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Heatmap:</span>
        {[
          { color: '#f0fdf4', border: '#bbf7d0', label: 'Active bookings' },
          { color: '#fffbeb', border: '#fde68a', label: '≥70% capacity' },
          { color: '#fef2f2', border: '#fecaca', label: 'Full' },
          { color: '#f1f5f9', border: '#e2e8f0', label: 'Closed' },
        ].map(({ color, border, label }) => (
          <span key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
            <span style={{ width: '11px', height: '11px', backgroundColor: color, border: `1px solid ${border}`, borderRadius: '3px', display: 'inline-block', flexShrink: 0 }} />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
