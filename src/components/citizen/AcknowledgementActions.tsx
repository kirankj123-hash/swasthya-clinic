'use client';

import React, { useState } from 'react';
import { Copy, Printer, Share2 } from 'lucide-react';

export function AcknowledgementActions({
  requestId,
  applicantName,
  purpose,
}: {
  requestId: string;
  applicantName: string;
  purpose: string;
}) {
  const [copied, setCopied] = useState(false);

  const trackingUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/citizen/track?id=${encodeURIComponent(requestId)}`
    : '';

  const slipText = `BDA CPIMS Acknowledgement\nReference: ${requestId}\nApplicant: ${applicantName}\nPurpose: ${purpose}\nTrack: ${trackingUrl}`;

  async function handleCopy() {
    if (!trackingUrl) {
      return;
    }
    await navigator.clipboard.writeText(slipText);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  async function handleShare() {
    if (!trackingUrl) {
      return;
    }

    if (navigator.share) {
      await navigator.share({
        title: `BDA CPIMS ${requestId}`,
        text: `Track your BDA CPIMS request ${requestId}`,
        url: trackingUrl,
      });
      return;
    }

    await handleCopy();
  }

  return (
    <div className="print-hidden" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '1rem' }}>
      <button
        type="button"
        onClick={() => window.print()}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.45rem',
          backgroundColor: 'var(--color-primary)',
          color: 'white',
          border: 'none',
          padding: '0.75rem 1rem',
          borderRadius: 'var(--radius-md)',
          fontWeight: 700,
        }}
      >
        <Printer size={16} />
        Print Slip
      </button>
      <button
        type="button"
        onClick={handleShare}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.45rem',
          backgroundColor: 'white',
          color: 'var(--color-primary)',
          border: '1px solid var(--color-primary-outline)',
          padding: '0.75rem 1rem',
          borderRadius: 'var(--radius-md)',
          fontWeight: 700,
        }}
      >
        <Share2 size={16} />
        Share Tracking Link
      </button>
      <button
        type="button"
        onClick={handleCopy}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.45rem',
          backgroundColor: 'white',
          color: copied ? 'var(--color-success)' : 'var(--color-text)',
          border: '1px solid var(--color-border)',
          padding: '0.75rem 1rem',
          borderRadius: 'var(--radius-md)',
          fontWeight: 700,
        }}
      >
        <Copy size={16} />
        {copied ? 'Copied' : 'Copy Reference'}
      </button>
    </div>
  );
}
