/**
 * BDA CPIMS — Frozen Schedule Truth
 * All day-mode logic across citizen, staff, and commissioner views
 * must derive from this single source. Do not duplicate inline.
 */

export type DayMode =
  | 'walk_in'
  | 'project_review'
  | 'open_house'
  | 'closed';

export type AvailabilityState = 'available' | 'limited' | 'full' | 'closed';

export interface DayRule {
  mode: DayMode;
  label: string;
  shortLabel: string;
  hours: string;             // e.g. "10:00 AM – 1:00 PM"
  capacity: number;          // max interactions per session
  color: string;
  bg: string;
  borderColor: string;
  citizenTitle: string;
  citizenSubtitle: string;
  citizenRules: string[];
  actionLink: string;
  actionText: string;
}

export const SCHEDULE: Record<string, DayRule> = {
  Monday: {
    mode: 'walk_in',
    label: 'Walk-in Day',
    shortLabel: 'Walk-in',
    hours: '10:00 AM – 1:00 PM',
    capacity: 30,
    color: '#15803d',
    bg: '#f0fdf4',
    borderColor: '#86efac',
    citizenTitle: 'Walk-in Day',
    citizenSubtitle: 'Office open for direct public visitors. No appointment needed.',
    citizenRules: [
      'Direct walk-in is permitted. No appointment needed.',
      'Pre-registration gives you a faster queue token.',
      'Arrive by 12:30 PM — late arrivals may not be seen.',
    ],
    actionLink: '/citizen/walk-in',
    actionText: 'Pre-register (Optional)',
  },
  Tuesday: {
    mode: 'walk_in',
    label: 'Walk-in Day',
    shortLabel: 'Walk-in',
    hours: '10:00 AM – 1:00 PM',
    capacity: 30,
    color: '#15803d',
    bg: '#f0fdf4',
    borderColor: '#86efac',
    citizenTitle: 'Walk-in Day',
    citizenSubtitle: 'Office open for direct public visitors. No appointment needed.',
    citizenRules: [
      'Direct walk-in is permitted. No appointment needed.',
      'Pre-registration gives you a faster queue token.',
      'Arrive by 12:30 PM — late arrivals may not be seen.',
    ],
    actionLink: '/citizen/walk-in',
    actionText: 'Pre-register (Optional)',
  },
  Wednesday: {
    mode: 'project_review',
    label: 'Project Review Day',
    shortLabel: 'Project Review',
    hours: '11:00 AM – 4:00 PM',
    capacity: 12,
    color: '#b45309',
    bg: '#fffbeb',
    borderColor: '#fbbf24',
    citizenTitle: 'Project Review Day',
    citizenSubtitle: 'Reserved for scheduled project and zonal reviews.',
    citizenRules: [
      'Submission of a review request is mandatory to participate.',
      'Walk-ins for general grievances are not seen today.',
      'Bring all project file references.',
    ],
    actionLink: '/citizen/request?type=project_review',
    actionText: 'Submit Project Review Request',
  },
  Thursday: {
    mode: 'open_house',
    label: 'Open House Day',
    shortLabel: 'Open House',
    hours: '3:00 PM – 5:00 PM',
    capacity: 8,
    color: '#1d4ed8',
    bg: '#eff6ff',
    borderColor: '#93c5fd',
    citizenTitle: 'Open House Day',
    citizenSubtitle: 'Commissioner hears public cases by prior appointment only.',
    citizenRules: [
      'Strictly by prior appointment. No walk-ins accepted.',
      'Submit a request in advance to receive a slot.',
      'Bring valid ID proof and all relevant documents.',
    ],
    actionLink: '/citizen/request?type=open_house',
    actionText: 'Request an Open House Appointment',
  },
  Friday: {
    mode: 'walk_in',
    label: 'Walk-in Day',
    shortLabel: 'Walk-in',
    hours: '10:00 AM – 1:00 PM',
    capacity: 30,
    color: '#15803d',
    bg: '#f0fdf4',
    borderColor: '#86efac',
    citizenTitle: 'Walk-in Day',
    citizenSubtitle: 'Office open for direct public visitors. No appointment needed.',
    citizenRules: [
      'Direct walk-in is permitted. No appointment needed.',
      'Pre-registration gives you a faster queue token.',
      'Arrive by 12:30 PM — late arrivals may not be seen.',
    ],
    actionLink: '/citizen/walk-in',
    actionText: 'Pre-register (Optional)',
  },
  Saturday: {
    mode: 'closed',
    label: 'Closed',
    shortLabel: 'Closed',
    hours: '—',
    capacity: 0,
    color: '#475569',
    bg: '#f1f5f9',
    borderColor: '#cbd5e1',
    citizenTitle: 'Closed to Public',
    citizenSubtitle: 'Internal work, field inspections, or administrative activity.',
    citizenRules: [
      'No public access available today.',
      'You may still submit a request online for a future date.',
    ],
    actionLink: '/citizen/request',
    actionText: 'Submit a Future Request',
  },
  Sunday: {
    mode: 'closed',
    label: 'Closed',
    shortLabel: 'Closed',
    hours: '—',
    capacity: 0,
    color: '#475569',
    bg: '#f1f5f9',
    borderColor: '#cbd5e1',
    citizenTitle: 'Closed to Public',
    citizenSubtitle: 'Office is closed on Sundays.',
    citizenRules: [
      'No public access available today.',
      'You may still submit a request online for a future date.',
    ],
    actionLink: '/citizen/request',
    actionText: 'Submit a Future Request',
  },
};

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function getTodayRule(): DayRule & { dayName: string; dateStr: string; nextPublicDay: string } {
  const now = new Date();
  const dayName = DAY_NAMES[now.getDay()];
  const rule = SCHEDULE[dayName];
  const dateStr = now.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  // Find next public interaction day
  let nextPublicDay = '';
  for (let i = 1; i <= 7; i++) {
    const nextDay = DAY_NAMES[(now.getDay() + i) % 7];
    if (SCHEDULE[nextDay].mode !== 'closed') {
      nextPublicDay = nextDay;
      break;
    }
  }

  return { ...rule, dayName, dateStr, nextPublicDay };
}

/** Returns the rule for a specific day name */
export function getRuleForDay(dayName: string): DayRule {
  return SCHEDULE[dayName] ?? SCHEDULE['Sunday'];
}

/** Week grid in display order Mon–Sun */
export const WEEK_ORDER = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
