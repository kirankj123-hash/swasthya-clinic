'use client';

import React from 'react';
import { useFormStatus } from 'react-dom';
import { RotateCcw } from 'lucide-react';

export function DemoResetButton() {
  const { pending } = useFormStatus();

  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    if (!window.confirm('Reset the demo data back to the seeded BDA walkthrough state?')) {
      event.preventDefault();
    }
  }

  return (
    <button
      type="submit"
      onClick={handleClick}
      disabled={pending}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        backgroundColor: 'white',
        color: 'var(--color-primary)',
        padding: '0.625rem 1.125rem',
        borderRadius: 'var(--radius-md)',
        fontWeight: 700,
        fontSize: '0.875rem',
        border: '1px solid var(--color-primary-outline)',
        opacity: pending ? 0.7 : 1,
      }}
    >
      <RotateCcw size={16} />
      {pending ? 'Restoring Demo Data...' : 'Restore Demo Data'}
    </button>
  );
}
