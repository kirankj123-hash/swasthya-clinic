'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Search } from 'lucide-react';

export default function TrackWidget() {
  const [id, setId] = useState('');
  const router = useRouter();

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = id.trim().toUpperCase();
    if (trimmed) router.push(`/citizen/track?id=${encodeURIComponent(trimmed)}`);
  };

  return (
    <div style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)', padding: '1.25rem 1.75rem', boxShadow: 'var(--shadow-sm)' }}>
      <div style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-text-muted)', marginBottom: '0.875rem' }}>
        Quick Status Check
      </div>
      <form onSubmit={handleTrack} style={{ display: 'flex', gap: '0.625rem' }}>
        <input
          type="text"
          placeholder="Enter REQ-XXXX Reference ID"
          value={id}
          onChange={e => setId(e.target.value)}
          style={{ flex: 1, fontSize: '0.875rem' }}
        />
        <button type="submit" style={{
          display: 'flex', alignItems: 'center', gap: '0.4rem',
          backgroundColor: 'var(--color-primary)', color: 'white',
          border: 'none', padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)',
          fontWeight: 600, fontSize: '0.875rem', whiteSpace: 'nowrap', flexShrink: 0
        }}>
          <Search size={14} /> Track
        </button>
      </form>
    </div>
  );
}
