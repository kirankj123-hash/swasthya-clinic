import { addDays, format } from 'date-fns';
import { CitizenRequest, NoticeBanner } from './types';

type DemoState = {
  requests: CitizenRequest[];
  notices: NoticeBanner[];
};

function isoFromNow(offsetMs: number) {
  return new Date(Date.now() - offsetMs).toISOString();
}

function getUpcomingWeekday(targetDay: number) {
  const now = new Date();
  const candidate = new Date(now);
  const distance = (targetDay - now.getDay() + 7) % 7;
  candidate.setDate(now.getDate() + distance);
  return candidate;
}

function toDayString(date: Date) {
  return format(date, 'EEEE') as CitizenRequest['preferredDay'];
}

function toDateString(date: Date) {
  return format(date, 'yyyy-MM-dd');
}

export function createDemoState(): DemoState {
  const nextProjectReview = getUpcomingWeekday(3);
  const nextOpenHouse = getUpcomingWeekday(4);
  const nextMonday = getUpcomingWeekday(1);
  const nextTuesday = getUpcomingWeekday(2);

  const requests: CitizenRequest[] = [
    {
      id: 'REQ-1001',
      applicantName: 'Ramesh Kumar',
      mobile: '9876543210',
      category: 'grievance',
      purpose: 'Water supply issue in Layout 4',
      summary: 'Facing irregular water supply for the past two weeks.',
      preferredDay: 'Monday',
      mode: 'in-person',
      status: 'submitted',
      aiTriage: {
        urgency: 'high',
        staffSummary: 'Resident reports a multi-week water supply disruption in Layout 4 and is seeking intervention.',
        rationale: 'Essential service disruption affecting residents for an extended period warrants fast staff review.',
        confidence: 'high',
        modelUsed: 'seed',
        generatedAt: isoFromNow(2 * 60 * 60 * 1000),
      },
      createdAt: isoFromNow(2 * 60 * 60 * 1000),
      updatedAt: isoFromNow(2 * 60 * 60 * 1000),
      auditTimeline: [
        { id: 'a1', timestamp: isoFromNow(2 * 60 * 60 * 1000), action: 'Request Submitted', actor: 'citizen' },
      ],
      communications: [],
    },
    {
      id: 'REQ-1002',
      applicantName: 'Priya Sharma',
      mobile: '9876543211',
      category: 'project_review',
      purpose: 'Building Plan Approval Delay',
      summary: 'File #BP-443 pending at zonal level. Need executive review.',
      preferredDay: toDayString(nextProjectReview),
      mode: 'in-person',
      status: 'under_review',
      createdAt: isoFromNow(24 * 60 * 60 * 1000),
      updatedAt: isoFromNow(11 * 60 * 60 * 1000),
      auditTimeline: [
        { id: 'b1', timestamp: isoFromNow(24 * 60 * 60 * 1000), action: 'Request Submitted', actor: 'citizen' },
        { id: 'b2', timestamp: isoFromNow(11 * 60 * 60 * 1000), action: 'Moved to Under Review', actor: 'staff' },
      ],
      communications: [],
    },
    {
      id: 'REQ-1003',
      applicantName: 'Syed Ahmed',
      mobile: '9876543212',
      category: 'open_house',
      purpose: 'NGO Zonal Presentation',
      summary: 'Presenting civil society findings on waste management.',
      preferredDay: toDayString(nextOpenHouse),
      mode: 'in-person',
      status: 'approved',
      assignedDate: toDateString(nextOpenHouse),
      assignedTimeStr: '10:30 AM - 11:00 AM',
      publicOfficeNote: 'Please bring ID proof and presentation files on pen drive.',
      createdAt: isoFromNow(2 * 24 * 60 * 60 * 1000),
      updatedAt: isoFromNow(24 * 60 * 60 * 1000),
      auditTimeline: [
        { id: 'c1', timestamp: isoFromNow(2 * 24 * 60 * 60 * 1000), action: 'Request Submitted', actor: 'citizen' },
        { id: 'c2', timestamp: isoFromNow(24 * 60 * 60 * 1000), action: 'Request Approved and Slot Assigned', actor: 'staff' },
      ],
      communications: [
        {
          id: 'com-seed-1',
          timestamp: isoFromNow(24 * 60 * 60 * 1000),
          channel: 'SMS',
          state: 'sent',
          summary: 'Approval and slot assignment notification sent',
        },
      ],
    },
    {
      id: 'REQ-1004',
      applicantName: 'Anita Desai',
      mobile: '9876543213',
      category: 'open_house',
      purpose: 'Property Dispute Discussion',
      summary: 'Seeking direction on an encroached plot dispute.',
      preferredDay: toDayString(nextOpenHouse),
      mode: 'online',
      status: 'rescheduled',
      rescheduleReason: 'Commissioner unavailable during the original slot window.',
      assignedDate: toDateString(addDays(nextOpenHouse, 7)),
      assignedTimeStr: '11:30 AM - 12:00 PM',
      createdAt: isoFromNow(3 * 24 * 60 * 60 * 1000),
      updatedAt: isoFromNow(18 * 60 * 60 * 1000),
      auditTimeline: [
        { id: 'd1', timestamp: isoFromNow(3 * 24 * 60 * 60 * 1000), action: 'Request Submitted', actor: 'citizen' },
        { id: 'd2', timestamp: isoFromNow(2 * 24 * 60 * 60 * 1000), action: 'Request Approved', actor: 'staff' },
        { id: 'd3', timestamp: isoFromNow(18 * 60 * 60 * 1000), action: 'Meeting Rescheduled', actor: 'staff', details: 'Commissioner unavailable during the original slot window.' },
      ],
      communications: [
        {
          id: 'com-seed-2',
          timestamp: isoFromNow(18 * 60 * 60 * 1000),
          channel: 'WhatsApp',
          state: 'sent',
          summary: 'Reschedule advisory shared with the citizen',
        },
      ],
    },
    {
      id: 'REQ-1005',
      applicantName: 'Vikram Singh',
      mobile: '9876543214',
      category: 'grievance',
      purpose: 'Road repair request',
      summary: 'Sector 4 main road has severe potholes and traffic risk.',
      preferredDay: 'Monday',
      mode: 'in-person',
      status: 'rejected',
      aiTriage: {
        urgency: 'high',
        staffSummary: 'Citizen reports severe potholes on the Sector 4 main road and requests repair intervention.',
        rationale: 'Road-safety risk and infrastructure damage justify elevated urgency even though it may be routed onward.',
        confidence: 'medium',
        modelUsed: 'seed',
        generatedAt: isoFromNow(4 * 24 * 60 * 60 * 1000),
      },
      rejectionReason: 'Forwarded to Zonal Engineering division. Does not require Commissioner hearing.',
      createdAt: isoFromNow(4 * 24 * 60 * 60 * 1000),
      updatedAt: isoFromNow(2.5 * 24 * 60 * 60 * 1000),
      auditTimeline: [
        { id: 'e1', timestamp: isoFromNow(4 * 24 * 60 * 60 * 1000), action: 'Request Submitted', actor: 'citizen' },
        { id: 'e2', timestamp: isoFromNow(2.5 * 24 * 60 * 60 * 1000), action: 'Request Rejected', actor: 'staff', details: 'Forwarded to Zonal Engineering division. Does not require Commissioner hearing.' },
      ],
      communications: [],
    },
    {
      id: 'REQ-1006',
      applicantName: 'Lakshmi N.',
      mobile: '9876543215',
      category: 'general_inquiry',
      purpose: 'Walk-in registration',
      summary: 'Walk-in regarding pension document clarification.',
      preferredDay: toDayString(nextTuesday),
      mode: 'in-person',
      status: 'closed',
      publicOfficeNote: 'Issue resolved during the walk-in session.',
      createdAt: isoFromNow(6 * 24 * 60 * 60 * 1000),
      updatedAt: isoFromNow(5 * 24 * 60 * 60 * 1000),
      auditTimeline: [
        { id: 'f1', timestamp: isoFromNow(6 * 24 * 60 * 60 * 1000), action: 'Walk-in Preregistered', actor: 'citizen' },
        { id: 'f2', timestamp: isoFromNow(5.5 * 24 * 60 * 60 * 1000), action: 'Visitor Attended', actor: 'staff' },
        { id: 'f3', timestamp: isoFromNow(5 * 24 * 60 * 60 * 1000), action: 'Request Closed', actor: 'staff' },
      ],
      communications: [],
    },
    {
      id: 'REQ-1007',
      applicantName: 'Chandrashekar Rao',
      mobile: '9700560070',
      category: 'grievance',
      purpose: 'Sewage overflow near homes',
      summary: 'Drain water is overflowing on the lane and residents are facing unsafe conditions.',
      preferredDay: toDayString(nextMonday),
      mode: 'in-person',
      status: 'under_review',
      aiTriage: {
        urgency: 'critical',
        staffSummary: 'Sewage overflow near residences is creating an immediate public health and safety concern.',
        rationale: 'Possible contamination and unsafe street conditions justify same-day escalation.',
        confidence: 'high',
        modelUsed: 'seed',
        generatedAt: isoFromNow(8 * 60 * 60 * 1000),
      },
      internalStaffNote: 'Escalation recommended to engineering and health coordination cell.',
      createdAt: isoFromNow(8 * 60 * 60 * 1000),
      updatedAt: isoFromNow(3 * 60 * 60 * 1000),
      auditTimeline: [
        { id: 'g1', timestamp: isoFromNow(8 * 60 * 60 * 1000), action: 'Request Submitted', actor: 'citizen' },
        { id: 'g2', timestamp: isoFromNow(3 * 60 * 60 * 1000), action: 'Moved to Under Review', actor: 'staff', details: 'Marked for priority handling.' },
      ],
      communications: [],
    },
  ];

  const notices: NoticeBanner[] = [
    {
      id: 'NOT-1',
      text: 'Service Notice: Thursday Open House slots for this week are fully booked. Citizens may still submit requests for the next available cycle.',
      active: true,
      type: 'warning',
    },
    {
      id: 'NOT-2',
      text: 'Demo mode: request statuses, queue actions, and tracking updates are being persisted for this presentation.',
      active: true,
      type: 'info',
    },
  ];

  return { requests, notices };
}
