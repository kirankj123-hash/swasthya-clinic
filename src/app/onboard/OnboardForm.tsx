'use client';

import { useState, useEffect, useRef } from 'react';
import { createClinic, checkSlugAvailable } from '@/app/actions';
import type { OnboardingInput } from '@/lib/types';
import Link from 'next/link';

export default function OnboardForm() {
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [loading, setLoading] = useState(false);
  const [slug, setSlug] = useState('');
  const [isSlugAvailable, setIsSlugAvailable] = useState<boolean | null>(null);
  const [checkingSlug, setCheckingSlug] = useState(false);
  const [slugError, setSlugError] = useState<string | null>(null);
  const [result, setResult] = useState<{ clinicId: string; slug: string } | null>(null);
  
  const slugRegex = /^[a-z0-9-]{3,30}$/;

  useEffect(() => {
    if (!slug) {
      setIsSlugAvailable(null);
      setSlugError(null);
      return;
    }

    if (!slugRegex.test(slug)) {
      setSlugError('Lowercase letters, numbers, and hyphens only (3-30 chars)');
      setIsSlugAvailable(null);
      return;
    }

    setSlugError(null);
    setCheckingSlug(true);

    const timer = setTimeout(async () => {
      try {
        const available = await checkSlugAvailable(slug);
        setIsSlugAvailable(available);
      } catch (e) {
        console.error('Slug check failed', e);
      } finally {
        setCheckingSlug(false);
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [slug]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSlugAvailable !== true || slugError) return;

    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const data: OnboardingInput = {
      clinicName: formData.get('clinicName') as string,
      doctorName: formData.get('doctorName') as string,
      speciality: formData.get('speciality') as string,
      phone: formData.get('phone') as string,
      slug: slug,
    };

    try {
      const res = await createClinic(data);
      setResult(res);
      setStep('success');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'success' && result) {
    return (
      <div style={{ padding: '2.5rem', textAlign: 'center' }}>
        <div style={{ 
          fontSize: '3rem', marginBottom: '1rem'
        }}>🎉</div>
        <h2 style={{ color: 'var(--color-text)', marginBottom: '0.5rem', fontSize: '1.5rem', fontWeight: '700' }}>Clinic registered!</h2>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
          Your clinic URL: <br />
          <strong style={{ color: 'var(--color-primary)', fontSize: '1.1rem' }}>{result.slug}.swasthya.app</strong>
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <Link 
            href={`/${result.slug}/admin`}
            style={{
              padding: '0.875rem', background: 'var(--color-primary)',
              color: 'white', border: 'none', borderRadius: 'var(--radius-md)', fontWeight: '600',
              textDecoration: 'none', display: 'block'
            }}
          >
            Go to Dashboard →
          </Link>
          <Link 
            href={`/${result.slug}/intake`}
            style={{
              padding: '0.875rem', background: 'white',
              color: 'var(--color-primary)', border: '1px solid var(--color-primary)', 
              borderRadius: 'var(--radius-md)', fontWeight: '600',
              textDecoration: 'none', display: 'block'
            }}
          >
            Go to Intake →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div>
        <label htmlFor="clinicName">Clinic Name</label>
        <input type="text" id="clinicName" name="clinicName" required placeholder="e.g. City Wellness Clinic" />
      </div>

      <div>
        <label htmlFor="doctorName">Doctor Name</label>
        <input type="text" id="doctorName" name="doctorName" required placeholder="Dr. Sharma" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <label htmlFor="speciality">Speciality</label>
          <select id="speciality" name="speciality" required>
            <option value="General">General</option>
            <option value="Pediatrics">Pediatrics</option>
            <option value="Gynecology">Gynecology</option>
            <option value="Orthopedics">Orthopedics</option>
            <option value="Dermatology">Dermatology</option>
            <option value="ENT">ENT</option>
            <option value="Ophthalmology">Ophthalmology</option>
            <option value="Dentistry">Dentistry</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div>
          <label htmlFor="phone">Phone Number</label>
          <input type="tel" id="phone" name="phone" required placeholder="10-digit mobile" pattern="[0-9]{10}" />
        </div>
      </div>

      <div>
        <label htmlFor="slug">Subdomain Slug</label>
        <div style={{ position: 'relative' }}>
          <input 
            type="text" 
            id="slug" 
            name="slug" 
            required 
            value={slug}
            onChange={(e) => setSlug(e.target.value.toLowerCase().trim())}
            placeholder="clinic-name"
            style={{ 
              paddingRight: '2.5rem',
              borderColor: slugError ? 'var(--color-error)' : undefined
            }}
          />
          <div style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)' }}>
            {checkingSlug && <div className="animate-spin" style={{ width: '16px', height: '16px', border: '2px solid var(--color-primary-soft)', borderTopColor: 'var(--color-primary)', borderRadius: '50%' }} />}
            {!checkingSlug && isSlugAvailable === true && !slugError && <span style={{ color: 'var(--color-accent)', fontWeight: 'bold' }}>✓ Available</span>}
            {!checkingSlug && isSlugAvailable === false && !slugError && <span style={{ color: 'var(--color-error)', fontWeight: 'bold' }}>✗ Taken</span>}
          </div>
        </div>
        {slugError && <div style={{ fontSize: '0.75rem', color: 'var(--color-error)', marginTop: '0.4rem' }}>{slugError}</div>}
        <div style={{ fontSize: '0.75rem', marginTop: '0.4rem', color: 'var(--color-text-muted)' }}>
          Your clinic will be at: <span style={{ color: 'var(--color-primary)', fontWeight: '600' }}>{slug || '[slug]'}.swasthya.app</span>
        </div>
      </div>

      <button 
        type="submit" 
        disabled={loading || isSlugAvailable !== true || !!slugError}
        style={{
          marginTop: '0.5rem', padding: '0.875rem', background: (loading || isSlugAvailable !== true || !!slugError) ? '#94a3b8' : 'var(--color-primary)',
          color: 'white', border: 'none', borderRadius: 'var(--radius-md)', fontWeight: '700', fontSize: '1rem',
          cursor: (loading || isSlugAvailable !== true || !!slugError) ? 'not-allowed' : 'pointer',
          transition: 'background 0.2s'
        }}
      >
        {loading ? 'Registering...' : 'Register Your Clinic'}
      </button>
    </form>
  );
}
