'use client';

import React from 'react';
import Link from 'next/link';
import { AlertTriangle, RotateCcw } from 'lucide-react';

export function RouteErrorState({
  title,
  description,
  reset,
  backHref = '/',
}: {
  title: string;
  description: string;
  reset: () => void;
  backHref?: string;
}) {
  return (
    <div style={{ minHeight: '50vh', display: 'grid', placeItems: 'center' }}>
      <div style={{
        width: 'min(34rem, 100%)',
        backgroundColor: '#fff7ed',
        border: '1px solid #fed7aa',
        borderRadius: 'var(--radius-xl)',
        padding: '2rem',
        boxShadow: 'var(--shadow-md)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#b45309', marginBottom: '1rem' }}>
          <AlertTriangle size={22} />
          <span style={{ fontSize: '0.8rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Something went wrong</span>
        </div>
        <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#7c2d12' }}>{title}</h1>
        <p style={{ color: '#9a3412', lineHeight: 1.6, marginBottom: '1.5rem' }}>{description}</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          <button
            onClick={reset}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: '#7c2d12',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              fontWeight: 700,
            }}
          >
            <RotateCcw size={16} />
            Try again
          </button>
          <Link
            href={backHref}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid #fdba74',
              color: '#9a3412',
              fontWeight: 700,
              backgroundColor: 'white',
            }}
          >
            Return
          </Link>
        </div>
      </div>
    </div>
  );
}
