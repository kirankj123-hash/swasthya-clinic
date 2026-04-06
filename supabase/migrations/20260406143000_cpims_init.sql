create extension if not exists pgcrypto;

create sequence if not exists cpims_request_number_seq start 1001;

create table if not exists requests (
  id text primary key,
  applicant_name text not null,
  mobile text not null,
  category text not null check (category in ('grievance', 'project_review', 'open_house', 'general_inquiry')),
  purpose text not null,
  summary text not null,
  preferred_day text not null check (preferred_day in ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday')),
  mode text not null check (mode in ('in-person', 'online')),
  status text not null check (status in ('submitted', 'under_review', 'approved', 'rescheduled', 'rejected', 'attended', 'closed')),
  assigned_date date,
  assigned_time_str text,
  rejection_reason text,
  reschedule_reason text,
  public_office_note text,
  internal_staff_note text,
  ai_urgency text check (ai_urgency in ('low', 'medium', 'high', 'critical')),
  ai_staff_summary text,
  ai_rationale text,
  ai_confidence text check (ai_confidence in ('low', 'medium', 'high')),
  ai_model_used text,
  ai_generated_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists request_audit_events (
  id text primary key,
  request_id text not null references requests(id) on delete cascade,
  action text not null,
  actor text not null check (actor in ('citizen', 'staff', 'system')),
  details text,
  timestamp timestamptz not null default now()
);

create table if not exists request_communications (
  id text primary key,
  request_id text not null references requests(id) on delete cascade,
  channel text not null check (channel in ('email', 'SMS', 'WhatsApp', 'portal only')),
  state text not null check (state in ('queued', 'prepared', 'sent', 'failed', 'skipped')),
  summary text not null,
  timestamp timestamptz not null default now()
);

create table if not exists notice_banners (
  id text primary key,
  text text not null,
  active boolean not null default true,
  type text not null check (type in ('info', 'warning', 'error')),
  created_at timestamptz not null default now()
);

create index if not exists idx_requests_status on requests(status);
create index if not exists idx_requests_category on requests(category);
create index if not exists idx_requests_updated_at on requests(updated_at desc);
create index if not exists idx_requests_ai_urgency on requests(ai_urgency);
create index if not exists idx_request_audit_events_request_id on request_audit_events(request_id, timestamp);
create index if not exists idx_request_communications_request_id on request_communications(request_id, timestamp);
