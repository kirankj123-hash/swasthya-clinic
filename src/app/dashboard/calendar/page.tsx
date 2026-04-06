import { getAllRequests } from '@/app/actions';
import WeekCalendar from './WeekCalendar';
import MonthCalendar from './MonthCalendar';
import DayCalendar from './DayCalendar';
import type { Metadata } from 'next';
import Link from 'next/link';
import { CalendarDays, ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Commissioner Calendar | BDA CPIMS',
  description: 'Week, day, and month view of Commissioner office schedule, appointments, and capacity.',
};

type View = 'week' | 'month' | 'day';

export default async function CalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string; date?: string }>;
}) {
  const sp = await searchParams;
  const view: View = (sp.view as View) || 'week';
  const dateParam = sp.date;

  const requests = await getAllRequests();

  // Build booked-count per preferred day (for WeekCalendar)
  const bookedByDay: Record<string, number> = {};
  requests
    .filter(r => ['approved', 'rescheduled'].includes(r.status))
    .forEach(r => {
      bookedByDay[r.preferredDay] = (bookedByDay[r.preferredDay] ?? 0) + 1;
    });

  // Today metrics for command strip
  const now = new Date();
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const todayName = dayNames[now.getDay()];
  const todayBooked = bookedByDay[todayName] ?? 0;
  const pendingCount = requests.filter(r => r.status === 'submitted').length;
  const underReview = requests.filter(r => r.status === 'under_review').length;
  const totalOpen = pendingCount + underReview;

  const tabs: { key: View; label: string }[] = [
    { key: 'day', label: 'Day View' },
    { key: 'week', label: 'Week View' },
    { key: 'month', label: 'Month View' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <Link href="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 500, marginBottom: '0.5rem' }}>
            <ArrowLeft size={13} /> Commissioner View
          </Link>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', fontSize: '1.75rem', fontWeight: 700, margin: 0 }}>
            <CalendarDays size={24} color="var(--color-primary)" />
            Commissioner Calendar
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Office schedule, appointment load, and capacity — Bangalore Development Authority
          </p>
        </div>

        {/* View Toggle Tabs */}
        <div style={{ display: 'flex', backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: '0.25rem', gap: '0.25rem', alignSelf: 'flex-end' }}>
          {tabs.map(({ key, label }) => (
            <Link
              key={key}
              href={`/dashboard/calendar?view=${key}`}
              style={{
                padding: '0.5rem 1.1rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.85rem',
                fontWeight: 600,
                backgroundColor: view === key ? 'var(--color-primary)' : 'transparent',
                color: view === key ? 'white' : 'var(--color-text-muted)',
                transition: 'background 0.15s, color 0.15s',
              }}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>

      {/* Command Strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
        {[
          { label: 'Today', value: todayName, sub: now.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }), color: 'var(--color-primary)' },
          { label: "Today's Appointments", value: todayBooked, sub: 'Approved / Assigned', color: '#15803d' },
          { label: 'Pending Review', value: totalOpen, sub: `${pendingCount} new · ${underReview} in review`, color: '#b45309' },
          { label: 'Total Active', value: requests.filter(r => !['closed', 'rejected'].includes(r.status)).length, sub: 'Across all categories', color: '#1d4ed8' },
        ].map(({ label, value, sub, color }) => (
          <div key={label} style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: '1.25rem', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.4rem' }}>{label}</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 700, color, lineHeight: 1 }}>{value}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.4rem' }}>{sub}</div>
          </div>
        ))}
      </div>

      {/* Calendar Panel */}
      <div style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)', padding: '1.75rem', boxShadow: 'var(--shadow-md)' }}>
        {view === 'week' && <WeekCalendar bookedByDay={bookedByDay} />}
        {view === 'month' && <MonthCalendar requests={requests} />}
        {view === 'day' && <DayCalendar requests={requests} initialDate={dateParam} />}
      </div>

    </div>
  );
}
