import React from 'react';

export function RouteLoadingState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div style={{ minHeight: '50vh', display: 'grid', placeItems: 'center' }}>
      <div style={{
        width: 'min(32rem, 100%)',
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-xl)',
        padding: '2rem',
        boxShadow: 'var(--shadow-md)',
      }}>
        <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--color-primary)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
          Loading
        </div>
        <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{title}</h1>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>{description}</p>
        <div className="cpims-skeleton-block" style={{ height: '1rem', width: '72%', marginBottom: '0.75rem' }} />
        <div className="cpims-skeleton-block" style={{ height: '1rem', width: '100%', marginBottom: '0.75rem' }} />
        <div className="cpims-skeleton-block" style={{ height: '1rem', width: '88%', marginBottom: '1.5rem' }} />
        <div className="cpims-skeleton-grid">
          <div className="cpims-skeleton-panel" />
          <div className="cpims-skeleton-panel" />
          <div className="cpims-skeleton-panel" />
        </div>
      </div>
    </div>
  );
}
