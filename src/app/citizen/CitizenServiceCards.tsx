'use client';

import Link from 'next/link';

const services = [
  {
    href: '/citizen/request?type=grievance',
    emoji: '📋',
    title: 'Submit a Grievance',
    description: 'File a formal administrative complaint requiring official review.',
    color: '#ef4444',
    bg: '#fef2f2',
    border: '#fecaca',
  },
  {
    href: '/citizen/request?type=open_house',
    emoji: '🏛️',
    title: 'Open House Appointment',
    description: 'Request an in-person audience with the Commissioner on Thursdays.',
    color: '#253b89',
    bg: '#edf2ff',
    border: '#ced8f6',
  },
  {
    href: '/citizen/request?type=project_review',
    emoji: '📊',
    title: 'Project Review Meeting',
    description: 'Schedule a review for ongoing government projects or initiatives.',
    color: '#3558c6',
    bg: '#f4f7ff',
    border: '#d9e0f2',
  },
  {
    href: '/citizen/request?type=general',
    emoji: '✉️',
    title: 'General Request',
    description: "Submit any other public service request to the Commissioner's office.",
    color: '#059669',
    bg: '#f0fdf4',
    border: '#bbf7d0',
  },
  {
    href: '/citizen/walk-in',
    emoji: '🚶',
    title: 'Register Walk-In',
    description: 'Register your visit on the day to receive a queue token.',
    color: '#d97706',
    bg: '#fffbeb',
    border: '#fde68a',
  },
  {
    href: '/citizen/track',
    emoji: '🔍',
    title: 'Track Your Request',
    description: 'Check the current status of a previously submitted request.',
    color: '#3558c6',
    bg: '#f4f7ff',
    border: '#d9e0f2',
  },
];

export default function CitizenServiceCards() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(256px, 1fr))', gap: '1.25rem' }}>
      {services.map((s) => (
        <Link
          key={s.href}
          href={s.href}
          style={{
            display: 'block',
            padding: '1.5rem',
            backgroundColor: s.bg,
            border: `1px solid ${s.border}`,
            borderRadius: 'var(--radius-lg)',
            textDecoration: 'none',
            transition: 'box-shadow 0.2s, transform 0.15s',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 16px rgba(0,0,0,0.10)';
            (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.boxShadow = 'none';
            (e.currentTarget as HTMLElement).style.transform = 'none';
          }}
        >
          <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{s.emoji}</div>
          <h2 style={{ fontSize: '1rem', fontWeight: 600, color: s.color, marginBottom: '0.4rem' }}>
            {s.title}
          </h2>
          <p style={{ fontSize: '0.875rem', color: '#374151', margin: 0, lineHeight: 1.5 }}>
            {s.description}
          </p>
        </Link>
      ))}
    </div>
  );
}
