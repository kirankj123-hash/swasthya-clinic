import React from 'react';
import Link from 'next/link';
import { AlertTriangle, ArrowRight, ShieldAlert, Monitor, NotebookPen, Search, MapPin, Sparkles, CheckCircle } from 'lucide-react';
import { getActiveNotices, getAllRequests } from '@/app/actions';
import { getTodayRule, WEEK_ORDER, SCHEDULE } from '@/lib/scheduleConfig';
import TrackWidget from './TrackWidget';

export default async function Home() {
  const notices = await getActiveNotices();
  const rule = getTodayRule();

  // Compute rough availability from persisted requests.
  const requests = await getAllRequests();
  const thuApproved = requests.filter(r => r.category === 'open_house' && r.status === 'approved').length;
  const thuFull = thuApproved >= SCHEDULE['Thursday'].capacity;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

      {/* Hero & Intro */}
      <section className="resp-hero" style={{ 
        backgroundColor: '#162b61', 
        color: 'white', 
        padding: '2.5rem 2rem', 
        borderRadius: 'var(--radius-xl)', 
        boxShadow: 'var(--shadow-lg)', 
        backgroundImage: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)' 
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ fontSize: 'clamp(1.75rem, 5vw, 2.5rem)', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
            BDA CPIMS
          </div>
          <div style={{ fontSize: '1rem', opacity: 0.9, maxWidth: '500px', lineHeight: 1.6 }}>
            A digital platform for citizen requests, hearing appointments, and transparent administrative tracking for the Bangalore Development Authority Commissioner’s office.
          </div>
          
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', backgroundColor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', padding: '0.6rem 1.25rem', borderRadius: '30px', alignSelf: 'flex-start', fontSize: '0.9rem', fontWeight: 600, border: '1px solid rgba(255,255,255,0.2)' }}>
            <Sparkles size={18} color="#fcd34d" /> Voice & Language Assistance Powered by Sarvam AI
          </div>
        </div>

        {/* How it Works steps */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#93c5fd', marginBottom: '0.25rem' }}>
            How it Works
          </div>
          {[
            'Check today’s public access rule and availability',
            'Submit a request by text or voice-assisted input',
            'Track office review, communication, and next steps'
          ].map((text, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', fontSize: '0.95rem', fontWeight: 500 }}>
              <CheckCircle size={18} color="#60a5fa" />
              <span>{text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Notice Banners */}
      {notices.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {notices.map(n => (
            <div key={n.id} style={{
              backgroundColor: n.type === 'warning' ? '#fffbeb' : n.type === 'info' ? '#eff6ff' : '#fef2f2',
              border: `1px solid ${n.type === 'warning' ? '#fcd34d' : n.type === 'info' ? '#bfdbfe' : '#fecaca'}`,
              color: n.type === 'warning' ? '#b45309' : n.type === 'info' ? '#1d4ed8' : '#b91c1c',
              padding: '0.875rem 1rem',
              borderRadius: 'var(--radius-md)',
              display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 500, fontSize: '0.9rem'
            }}>
              <AlertTriangle size={18} />
              <span>{n.text}</span>
            </div>
          ))}
        </div>
      )}

      {/* Today's Office Mode — primary block */}
      <section className="resp-grid-2">

        {/* Today Card */}
        <div style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)', padding: '1.75rem', boxShadow: 'var(--shadow-md)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '1.25rem' }}>
            <MapPin size={13} /> Official Office Status
          </div>

          <div style={{ backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: '1rem', marginBottom: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>Today:</span>
              <span style={{ color: 'var(--color-text)', fontSize: '0.85rem', fontWeight: 600 }}>{rule.dayName}, {rule.dateStr.split(',')[0]}</span>
            </div>
            
            <div style={{ height: '1px', backgroundColor: 'var(--color-border)' }}></div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>Public Access:</span>
              <span style={{ color: rule.color, backgroundColor: rule.bg, padding: '0.2rem 0.6rem', borderRadius: '4px', border: `1px solid ${rule.borderColor}`, fontSize: '0.8rem', fontWeight: 700 }}>
                {rule.mode === 'closed' ? 'Closed' : rule.label}
              </span>
            </div>

            {rule.mode === 'closed' && rule.nextPublicDay && (
              <>
                <div style={{ height: '1px', backgroundColor: 'var(--color-border)' }}></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>Next open day:</span>
                  <span style={{ color: 'var(--color-text)', fontSize: '0.85rem', fontWeight: 500 }}>{rule.nextPublicDay} ({SCHEDULE[rule.nextPublicDay].shortLabel})</span>
                </div>
              </>
            )}
          </div>

          {rule.hours !== '—' && (
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: rule.color, marginBottom: '0.75rem' }}>
              Office Hours: {rule.hours}
            </div>
          )}

          <ul style={{ paddingLeft: '1.25rem', fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {rule.citizenRules.map((r, i) => <li key={i}>{r}</li>)}
          </ul>

          {/* Full capacity warning (Open House) */}
          {rule.mode === 'open_house' && thuFull && (
            <div style={{ padding: '0.75rem', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: 'var(--radius-md)', fontSize: '0.8125rem', color: '#b91c1c', marginBottom: '1rem', fontWeight: 500 }}>
              ⚠ Notice: Thursday Open House slots for this week are fully booked.
            </div>
          )}

          <Link href={rule.actionLink} style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%',
            backgroundColor: 'var(--color-primary)', color: 'white',
            padding: '0.875rem 1.25rem', borderRadius: 'var(--radius-md)',
            fontWeight: 600, fontSize: '0.9rem', transition: 'opacity 0.2s'
          }}>
            {rule.actionText} <ArrowRight size={16} />
          </Link>
        </div>

        {/* Right column: intent routing + track widget */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

          {/* Intent routing */}
          <div style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)', padding: '1.75rem', boxShadow: 'var(--shadow-md)' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-text-muted)', marginBottom: '1.25rem' }}>
              What would you like to do?
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { href: '/citizen/request?type=grievance', icon: <ShieldAlert size={18} color="#1d4ed8" />, bg: '#eff6ff', title: 'Report a Grievance', sub: 'Submit a formal administrative complaint' },
                { href: '/citizen/request?type=open_house', icon: <Monitor size={18} color="#253b89" />, bg: '#edf2ff', title: 'Request Thursday Open House', sub: 'Seek a direct Commissioner appointment' },
                { href: '/citizen/request?type=project_review', icon: <NotebookPen size={18} color="#b45309" />, bg: '#fffbeb', title: 'Project Review Meeting', sub: 'Schedule a Wednesday project review' },
                { href: '/citizen/track', icon: <Search size={18} color="#3558c6" />, bg: '#f4f7ff', title: 'Track Existing Request', sub: 'Check status using your Reference ID' },
              ].map(item => (
                <Link key={item.href} href={item.href} style={{
                  display: 'flex', alignItems: 'center', gap: '0.875rem',
                  padding: '0.875rem 1rem', border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)', transition: 'border-color 0.15s, background 0.15s'
                }}>
                  <div style={{ padding: '0.5rem', backgroundColor: item.bg, borderRadius: 'var(--radius-sm)', flexShrink: 0 }}>
                    {item.icon}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{item.title}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{item.sub}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Track Widget */}
          <TrackWidget />
        </div>
      </section>

      {/* Weekly Schedule Board */}
      <section style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)', padding: '1.75rem', boxShadow: 'var(--shadow-md)' }}>
        <div style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-text-muted)', marginBottom: '1.25rem' }}>
          Weekly Public Access Schedule — Bangalore Development Authority
        </div>
        <div className="resp-schedule">
          {WEEK_ORDER.filter(d => d !== 'Sunday').map(dayName => {
            const s = SCHEDULE[dayName];
            const isToday = dayName === rule.dayName;
            return (
              <div key={dayName} style={{
                padding: '1rem',
                backgroundColor: isToday ? s.bg : 'var(--color-bg)',
                borderRadius: 'var(--radius-lg)',
                border: isToday ? `2px solid ${s.borderColor}` : '1px solid var(--color-border)',
                position: 'relative'
              }}>
                {isToday && (
                  <div style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', backgroundColor: s.color, color: 'white', fontSize: '0.6rem', fontWeight: 700, padding: '0.1rem 0.4rem', borderRadius: '10px' }}>
                    TODAY
                  </div>
                )}
                <div style={{ fontWeight: 700, fontSize: '0.8rem', marginBottom: '0.25rem' }}>{dayName}</div>
                <div style={{ fontSize: '0.8rem', color: s.color, fontWeight: 600, marginBottom: '0.35rem' }}>{s.shortLabel}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginBottom: '0.4rem' }}>{s.hours}</div>
                {s.mode !== 'closed' && (
                  <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>
                    Capacity: {s.capacity} {s.mode === 'open_house' ? 'slots' : 'visitors'}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
