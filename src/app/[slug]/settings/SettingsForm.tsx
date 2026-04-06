'use client';

import { useState } from 'react';
import { updateDoctorSettings } from '@/app/actions';
import type { Doctor, WorkingHours } from '@/lib/types';

type Day = keyof WorkingHours;
const DAYS: { id: Day; label: string }[] = [
  { id: 'mon', label: 'Mon' },
  { id: 'tue', label: 'Tue' },
  { id: 'wed', label: 'Wed' },
  { id: 'thu', label: 'Thu' },
  { id: 'fri', label: 'Fri' },
  { id: 'sat', label: 'Sat' },
  { id: 'sun', label: 'Sun' },
];

export default function SettingsForm({ doctor }: { doctor: Doctor | null }) {
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [workingHours, setWorkingHours] = useState<WorkingHours>(
    doctor?.working_hours || {
      mon: { open: '09:00', close: '17:00' },
      tue: { open: '09:00', close: '17:00' },
      wed: { open: '09:00', close: '17:00' },
      thu: { open: '09:00', close: '17:00' },
      fri: { open: '09:00', close: '17:00' },
      sat: { open: '09:00', close: '13:00' },
    }
  );

  const handleDayToggle = (day: Day) => {
    setWorkingHours(prev => {
      const next = { ...prev };
      if (next[day]) {
        delete next[day];
      } else {
        next[day] = { open: '09:00', close: '17:00' };
      }
      return next;
    });
  };

  const handleTimeChange = (day: Day, field: 'open' | 'close', value: string) => {
    setWorkingHours(prev => ({
      ...prev,
      [day]: { ...prev[day], [field]: value }
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    formData.append('working_hours', JSON.stringify(workingHours));

    try {
      await updateDoctorSettings(formData);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setLoading(false);
    }
  };

  const sectionStyle = {
    background: 'white',
    padding: '2rem',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--color-border)',
    marginBottom: '2rem',
    boxShadow: 'var(--shadow-sm)'
  };

  const headingStyle = {
    fontSize: '1.25rem',
    fontWeight: '700',
    marginBottom: '1.5rem',
    color: 'var(--color-text)',
    borderBottom: '1px solid var(--color-bg)',
    paddingBottom: '0.75rem'
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Section 1: Doctor Profile */}
      <div style={sectionStyle}>
        <h2 style={headingStyle}>Section 1 — Doctor Profile</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label htmlFor="name">Doctor Name</label>
            <input type="text" id="name" name="name" defaultValue={doctor?.name} required />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label htmlFor="speciality">Speciality</label>
              <select id="speciality" name="speciality" defaultValue={doctor?.speciality} required>
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
              <label htmlFor="phone">Phone</label>
              <input type="tel" id="phone" name="phone" defaultValue={doctor?.phone} required pattern="[0-9]{10}" />
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Working Hours */}
      <div style={sectionStyle}>
        <h2 style={headingStyle}>Section 2 — Working Hours</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {DAYS.map(({ id, label }) => (
            <div key={id} style={{ 
              display: 'grid', 
              gridTemplateColumns: '100px 1fr 1fr', 
              alignItems: 'center', 
              gap: '1rem',
              padding: '0.5rem 0',
              borderBottom: id === 'sun' ? 'none' : '1px solid var(--color-bg)'
            }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0, cursor: 'pointer', textTransform: 'none' }}>
                <input 
                  type="checkbox" 
                  checked={!!workingHours[id]} 
                  onChange={() => handleDayToggle(id)}
                  style={{ width: 'auto' }}
                />
                {label}
              </label>
              
              <div style={{ opacity: workingHours[id] ? 1 : 0.4 }}>
                <input 
                  type="time" 
                  value={workingHours[id]?.open || '09:00'} 
                  disabled={!workingHours[id]}
                  onChange={(e) => handleTimeChange(id, 'open', e.target.value)}
                />
              </div>
              
              <div style={{ opacity: workingHours[id] ? 1 : 0.4 }}>
                <input 
                  type="time" 
                  value={workingHours[id]?.close || '17:00'} 
                  disabled={!workingHours[id]}
                  onChange={(e) => handleTimeChange(id, 'close', e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 3: Appointment Settings */}
      <div style={sectionStyle}>
        <h2 style={headingStyle}>Section 3 — Appointment Settings</h2>
        <div>
          <label style={{ marginBottom: '1rem' }}>Slot Duration (minutes)</label>
          <div style={{ display: 'flex', gap: '2rem' }}>
            {[10, 15, 20, 30].map((mins) => (
              <label key={mins} style={{ 
                display: 'flex', alignItems: 'center', gap: '0.5rem', 
                cursor: 'pointer', textTransform: 'none', fontWeight: '500' 
              }}>
                <input 
                  type="radio" 
                  name="slot_duration_mins" 
                  value={mins} 
                  defaultChecked={doctor?.slot_duration_mins === mins} 
                  style={{ width: 'auto' }}
                />
                {mins} mins
              </label>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginTop: '1rem' }}>
        <button 
          type="submit" 
          disabled={loading}
          style={{
            padding: '0.875rem 2.5rem', background: 'var(--color-primary)',
            color: 'white', border: 'none', borderRadius: 'var(--radius-md)', fontWeight: '700',
            fontSize: '1rem', cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'background 0.2s'
          }}
        >
          {loading ? 'Saving...' : 'Save Settings'}
        </button>
        {saved && (
          <span style={{ color: 'var(--color-accent)', fontWeight: '700', fontSize: '1.1rem' }}>
            ✓ Saved
          </span>
        )}
      </div>
    </form>
  );
}
