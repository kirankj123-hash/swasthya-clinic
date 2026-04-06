'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, CalendarDays, Users, Clock } from 'lucide-react';
import { SCHEDULE, WEEK_ORDER, DayRule } from '@/lib/scheduleConfig';

interface SlotData {
  dayName: string;
  date: Date;
  rule: DayRule;
  booked: number;
  capacity: number;
}

interface WeekCalendarProps {
  bookedByDay: Record<string, number>; // dayName → booked count
}

function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay(); // 0=Sun
  const diff = day === 0 ? -6 : 1 - day; // Monday start
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function getAvailability(booked: number, capacity: number, mode: string): { label: string; cls: string } {
  if (mode === 'closed') return { label: 'Closed', cls: 'avail-closed' };
  if (booked >= capacity) return { label: 'Full', cls: 'avail-full' };
  if (booked >= capacity * 0.7) return { label: 'Limited', cls: 'avail-limited' };
  return { label: 'Available', cls: 'avail-available' };
}

export default function WeekCalendar({ bookedByDay }: WeekCalendarProps) {
  const [weekOffset, setWeekOffset] = useState(0);
  const today = useMemo(() => { const d = new Date(); d.setHours(0,0,0,0); return d; }, []);

  const currentWeekStart = useMemo(() => addDays(getWeekStart(today), weekOffset * 7), [today, weekOffset]);

  const week: SlotData[] = useMemo(() =>
    WEEK_ORDER.map((dayName, idx) => {
      const date = addDays(currentWeekStart, idx);
      const rule = SCHEDULE[dayName];
      const booked = bookedByDay[dayName] ?? 0;
      return { dayName, date, rule, booked, capacity: rule.capacity };
    }), [currentWeekStart, bookedByDay]);

  const weekLabel = (() => {
    const start = week[0].date;
    const end = week[6].date;
    const opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' };
    return `${start.toLocaleDateString('en-IN', opts)} – ${end.toLocaleDateString('en-IN', { ...opts, year: 'numeric' })}`;
  })();

  return (
    <div>
      {/* Week nav */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <CalendarDays size={20} color="var(--color-primary)" />
          <h2 style={{ fontSize: '1.125rem', fontWeight: 700 }}>Week View</h2>
          <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>{weekLabel}</span>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <button
            onClick={() => setWeekOffset(0)}
            style={{ fontSize: '0.8rem', padding: '0.375rem 0.75rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', background: 'var(--color-surface)', fontWeight: 500 }}
          >
            This Week
          </button>
          <button onClick={() => setWeekOffset(w => w - 1)} style={{ padding: '0.375rem 0.6rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', background: 'var(--color-surface)' }}>
            <ChevronLeft size={16} />
          </button>
          <button onClick={() => setWeekOffset(w => w + 1)} style={{ padding: '0.375rem 0.6rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', background: 'var(--color-surface)' }}>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.75rem' }}>
        {week.map(({ dayName, date, rule, booked, capacity }) => {
          const isToday = date.getTime() === today.getTime();
          const avail = getAvailability(booked, capacity, rule.mode);
          const pct = rule.mode !== 'closed' && capacity > 0 ? Math.min(100, Math.round((booked / capacity) * 100)) : 0;
          const barColor = avail.cls === 'avail-available' ? '#15803d' : avail.cls === 'avail-limited' ? '#b45309' : avail.cls === 'avail-full' ? '#b91c1c' : '#cbd5e1';

          return (
            <div
              key={dayName}
              style={{
                borderRadius: 'var(--radius-lg)',
                border: isToday ? `2px solid var(--color-primary)` : '1px solid var(--color-border)',
                backgroundColor: isToday ? '#f0f4ff' : 'var(--color-surface)',
                padding: '1rem 0.875rem',
                position: 'relative',
                boxShadow: isToday ? '0 0 0 3px rgba(26,58,107,0.10)' : 'var(--shadow-sm)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
              }}
            >
              {/* Today badge */}
              {isToday && (
                <div style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', background: 'var(--color-primary)', color: 'white', fontSize: '0.6rem', fontWeight: 800, padding: '0.15rem 0.45rem', borderRadius: '10px', letterSpacing: '0.05em' }}>
                  TODAY
                </div>
              )}

              {/* Day name + date */}
              <div>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: isToday ? 'var(--color-primary)' : 'var(--color-text-muted)' }}>
                  {dayName.slice(0, 3)}
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: isToday ? 'var(--color-primary)' : 'var(--color-text)', lineHeight: 1.2 }}>
                  {date.getDate()}
                </div>
              </div>

              {/* Block type */}
              <div style={{ padding: '0.35rem 0.5rem', backgroundColor: rule.bg, borderRadius: 'var(--radius-sm)', border: `1px solid ${rule.borderColor}` }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: rule.color }}>{rule.shortLabel}</div>
                {rule.hours !== '—' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.65rem', color: rule.color, opacity: 0.8, marginTop: '0.15rem' }}>
                    <Clock size={10} /> {rule.hours}
                  </div>
                )}
              </div>

              {/* Capacity / Booking */}
              {rule.mode !== 'closed' && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>
                      <Users size={10} /> {booked}/{capacity}
                    </div>
                    <span style={{ fontSize: '0.65rem', fontWeight: 700, padding: '0.1rem 0.35rem', borderRadius: '10px' }} className={avail.cls}>
                      {avail.label}
                    </span>
                  </div>
                  {/* Occupancy bar */}
                  <div style={{ height: '4px', backgroundColor: '#e9ecef', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', backgroundColor: barColor, borderRadius: '4px', transition: 'width 0.3s' }} />
                  </div>
                </div>
              )}

              {rule.mode === 'closed' && (
                <span style={{ fontSize: '0.7rem', fontWeight: 600, padding: '0.2rem 0.5rem', borderRadius: '10px' }} className="avail-closed">
                  Closed
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: '1.25rem', marginTop: '1.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Legend:</span>
        {[
          { cls: 'avail-available', label: 'Available' },
          { cls: 'avail-limited', label: 'Limited (≥70%)' },
          { cls: 'avail-full', label: 'Full' },
          { cls: 'avail-closed', label: 'Closed' },
        ].map(({ cls, label }) => (
          <span key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem' }}>
            <span className={cls} style={{ padding: '0.1rem 0.5rem', borderRadius: '10px', fontWeight: 600, fontSize: '0.7rem' }}>{label}</span>
          </span>
        ))}
        <Link href="/dashboard" style={{ marginLeft: 'auto', fontSize: '0.8rem', color: 'var(--color-primary)', fontWeight: 600 }}>
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
