import { createDemoState } from './demoData';
import { getSql } from './db';
import {
  AIConfidence,
  AuditEvent,
  CitizenRequest,
  CommunicationChannel,
  CommunicationEvent,
  CommunicationState,
  GrievanceUrgency,
  NoticeBanner,
} from './types';

type RequestDraft = Omit<CitizenRequest, 'id' | 'createdAt' | 'updatedAt' | 'auditTimeline' | 'communications'>;

type RequestRow = {
  id: string;
  applicant_name: string;
  mobile: string;
  category: CitizenRequest['category'];
  purpose: string;
  summary: string;
  preferred_day: CitizenRequest['preferredDay'];
  mode: CitizenRequest['mode'];
  status: CitizenRequest['status'];
  assigned_date: string | Date | null;
  assigned_time_str: string | null;
  rejection_reason: string | null;
  reschedule_reason: string | null;
  public_office_note: string | null;
  internal_staff_note: string | null;
  ai_urgency: GrievanceUrgency | null;
  ai_staff_summary: string | null;
  ai_rationale: string | null;
  ai_confidence: AIConfidence | null;
  ai_model_used: string | null;
  ai_generated_at: string | Date | null;
  created_at: string | Date;
  updated_at: string | Date;
};

type AuditRow = {
  id: string;
  request_id: string;
  action: string;
  actor: AuditEvent['actor'];
  details: string | null;
  timestamp: string | Date;
};

type CommunicationRow = {
  id: string;
  request_id: string;
  channel: CommunicationChannel;
  state: CommunicationState;
  summary: string;
  timestamp: string | Date;
};

type NoticeRow = {
  id: string;
  text: string;
  active: boolean;
  type: NoticeBanner['type'];
};

let seedPromise: Promise<void> | null = null;

function toIsoString(value: string | Date) {
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
}

function toDateOnlyString(value: string | Date | null) {
  if (!value) {
    return undefined;
  }
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }
  return value;
}

function randomId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function mapRequestRow(
  row: RequestRow,
  auditTimeline: AuditEvent[],
  communications: CommunicationEvent[]
): CitizenRequest {
  return {
    id: row.id,
    applicantName: row.applicant_name,
    mobile: row.mobile,
    category: row.category,
    purpose: row.purpose,
    summary: row.summary,
    preferredDay: row.preferred_day,
    mode: row.mode,
    status: row.status,
    assignedDate: toDateOnlyString(row.assigned_date),
    assignedTimeStr: row.assigned_time_str ?? undefined,
    rejectionReason: row.rejection_reason ?? undefined,
    rescheduleReason: row.reschedule_reason ?? undefined,
    publicOfficeNote: row.public_office_note ?? undefined,
    internalStaffNote: row.internal_staff_note ?? undefined,
    aiTriage: row.ai_urgency && row.ai_staff_summary && row.ai_rationale && row.ai_confidence && row.ai_model_used && row.ai_generated_at
      ? {
          urgency: row.ai_urgency,
          staffSummary: row.ai_staff_summary,
          rationale: row.ai_rationale,
          confidence: row.ai_confidence,
          modelUsed: row.ai_model_used,
          generatedAt: toIsoString(row.ai_generated_at),
        }
      : undefined,
    createdAt: toIsoString(row.created_at),
    updatedAt: toIsoString(row.updated_at),
    auditTimeline,
    communications,
  };
}

async function insertRequest(tx: any, request: CitizenRequest) {
  await tx`
    insert into requests (
      id, applicant_name, mobile, category, purpose, summary, preferred_day, mode, status,
      assigned_date, assigned_time_str, rejection_reason, reschedule_reason, public_office_note, internal_staff_note,
      ai_urgency, ai_staff_summary, ai_rationale, ai_confidence, ai_model_used, ai_generated_at,
      created_at, updated_at
    ) values (
      ${request.id},
      ${request.applicantName},
      ${request.mobile},
      ${request.category},
      ${request.purpose},
      ${request.summary},
      ${request.preferredDay},
      ${request.mode},
      ${request.status},
      ${request.assignedDate ?? null},
      ${request.assignedTimeStr ?? null},
      ${request.rejectionReason ?? null},
      ${request.rescheduleReason ?? null},
      ${request.publicOfficeNote ?? null},
      ${request.internalStaffNote ?? null},
      ${request.aiTriage?.urgency ?? null},
      ${request.aiTriage?.staffSummary ?? null},
      ${request.aiTriage?.rationale ?? null},
      ${request.aiTriage?.confidence ?? null},
      ${request.aiTriage?.modelUsed ?? null},
      ${request.aiTriage?.generatedAt ?? null},
      ${request.createdAt},
      ${request.updatedAt}
    )
  `;

  for (const audit of request.auditTimeline) {
    await tx`
      insert into request_audit_events (id, request_id, action, actor, details, timestamp)
      values (${audit.id}, ${request.id}, ${audit.action}, ${audit.actor}, ${audit.details ?? null}, ${audit.timestamp})
    `;
  }

  for (const communication of request.communications) {
    await tx`
      insert into request_communications (id, request_id, channel, state, summary, timestamp)
      values (
        ${communication.id},
        ${request.id},
        ${communication.channel},
        ${communication.state},
        ${communication.summary},
        ${communication.timestamp}
      )
    `;
  }
}

async function ensureDemoData() {
  if (!seedPromise) {
    seedPromise = (async () => {
      const sql = getSql();
      const [countRow] = await sql<{ count: number }[]>`select count(*)::int as count from requests`;
      if ((countRow?.count ?? 0) === 0) {
        await resetDemoData();
      }
    })().finally(() => {
      seedPromise = null;
    });
  }

  await seedPromise;
}

async function getRequestRows() {
  const sql = getSql();
  return sql<RequestRow[]>`
    select
      id,
      applicant_name,
      mobile,
      category,
      purpose,
      summary,
      preferred_day,
      mode,
      status,
      assigned_date,
      assigned_time_str,
      rejection_reason,
      reschedule_reason,
      public_office_note,
      internal_staff_note,
      ai_urgency,
      ai_staff_summary,
      ai_rationale,
      ai_confidence,
      ai_model_used,
      ai_generated_at,
      created_at,
      updated_at
    from requests
    order by created_at desc
  `;
}

async function hydrateRequests(rows: RequestRow[]) {
  if (rows.length === 0) {
    return [];
  }

  const sql = getSql();
  const requestIds = rows.map(row => row.id);
  const [auditRows, communicationRows] = await Promise.all([
    sql<AuditRow[]>`
      select id, request_id, action, actor, details, timestamp
      from request_audit_events
      where request_id in ${sql(requestIds)}
      order by timestamp asc
    `,
    sql<CommunicationRow[]>`
      select id, request_id, channel, state, summary, timestamp
      from request_communications
      where request_id in ${sql(requestIds)}
      order by timestamp asc
    `,
  ]);

  const auditsByRequest = new Map<string, AuditEvent[]>();
  const communicationsByRequest = new Map<string, CommunicationEvent[]>();

  for (const audit of auditRows) {
    const nextAudit: AuditEvent = {
      id: audit.id,
      timestamp: toIsoString(audit.timestamp),
      action: audit.action,
      actor: audit.actor,
      details: audit.details ?? undefined,
    };
    auditsByRequest.set(audit.request_id, [...(auditsByRequest.get(audit.request_id) ?? []), nextAudit]);
  }

  for (const communication of communicationRows) {
    const nextCommunication: CommunicationEvent = {
      id: communication.id,
      timestamp: toIsoString(communication.timestamp),
      channel: communication.channel,
      state: communication.state,
      summary: communication.summary,
    };
    communicationsByRequest.set(
      communication.request_id,
      [...(communicationsByRequest.get(communication.request_id) ?? []), nextCommunication]
    );
  }

  return rows.map(row =>
    mapRequestRow(row, auditsByRequest.get(row.id) ?? [], communicationsByRequest.get(row.id) ?? [])
  );
}

async function getNextRequestId() {
  const sql = getSql();
  const [row] = await sql<{ id: string }[]>`
    select 'REQ-' || nextval('cpims_request_number_seq')::text as id
  `;
  return row.id;
}

async function updateRequestRecord(id: string, request: CitizenRequest) {
  const sql = getSql();
  await sql`
    update requests
    set
      applicant_name = ${request.applicantName},
      mobile = ${request.mobile},
      category = ${request.category},
      purpose = ${request.purpose},
      summary = ${request.summary},
      preferred_day = ${request.preferredDay},
      mode = ${request.mode},
      status = ${request.status},
      assigned_date = ${request.assignedDate ?? null},
      assigned_time_str = ${request.assignedTimeStr ?? null},
      rejection_reason = ${request.rejectionReason ?? null},
      reschedule_reason = ${request.rescheduleReason ?? null},
      public_office_note = ${request.publicOfficeNote ?? null},
      internal_staff_note = ${request.internalStaffNote ?? null},
      ai_urgency = ${request.aiTriage?.urgency ?? null},
      ai_staff_summary = ${request.aiTriage?.staffSummary ?? null},
      ai_rationale = ${request.aiTriage?.rationale ?? null},
      ai_confidence = ${request.aiTriage?.confidence ?? null},
      ai_model_used = ${request.aiTriage?.modelUsed ?? null},
      ai_generated_at = ${request.aiTriage?.generatedAt ?? null},
      updated_at = ${request.updatedAt}
    where id = ${id}
  `;
}

export async function resetDemoData() {
  const sql = getSql();
  const { requests, notices } = createDemoState();

  await sql.begin(async tx => {
    await tx`truncate table request_communications, request_audit_events, notice_banners, requests restart identity cascade`;
    for (const request of requests) {
      await insertRequest(tx as never, request);
    }

    for (const notice of notices) {
      await tx`
        insert into notice_banners (id, text, active, type)
        values (${notice.id}, ${notice.text}, ${notice.active}, ${notice.type})
      `;
    }

    await tx`select setval('cpims_request_number_seq', ${requests.length + 1000}, true)`;
  });
}

export const api = {
  resetDemoData,

  async getRequests() {
    await ensureDemoData();
    const rows = await getRequestRows();
    return hydrateRequests(rows);
  },

  async getRequestById(id: string) {
    await ensureDemoData();
    const rows = await getSql()<RequestRow[]>`
      select
        id,
        applicant_name,
        mobile,
        category,
        purpose,
        summary,
        preferred_day,
        mode,
        status,
        assigned_date,
        assigned_time_str,
        rejection_reason,
        reschedule_reason,
        public_office_note,
        internal_staff_note,
        ai_urgency,
        ai_staff_summary,
        ai_rationale,
        ai_confidence,
        ai_model_used,
        ai_generated_at,
        created_at,
        updated_at
      from requests
      where id = ${id}
      limit 1
    `;
    const hydrated = await hydrateRequests(rows);
    return hydrated[0] ?? undefined;
  },

  async addRequest(request: RequestDraft) {
    await ensureDemoData();
    const id = await getNextRequestId();
    const createdAt = new Date().toISOString();
    const nextRequest: CitizenRequest = {
      ...request,
      id,
      createdAt,
      updatedAt: createdAt,
      auditTimeline: [
        {
          id: randomId('audit'),
          timestamp: createdAt,
          action: 'Request Submitted',
          actor: 'citizen',
        },
      ],
      communications: [],
    };

    await getSql().begin(async tx => {
      await insertRequest(tx as never, nextRequest);
    });

    return nextRequest;
  },

  async updateRequest(
    id: string,
    updates: Partial<CitizenRequest>,
    auditAction: string,
    actor: AuditEvent['actor'],
    details?: string
  ) {
    await ensureDemoData();
    const current = await this.getRequestById(id);
    if (!current) {
      return null;
    }

    const nextTimestamp = new Date().toISOString();
    const merged: CitizenRequest = {
      ...current,
      ...updates,
      id: current.id,
      createdAt: current.createdAt,
      updatedAt: nextTimestamp,
      auditTimeline: current.auditTimeline,
      communications: current.communications,
    };

    await getSql().begin(async tx => {
      await updateRequestRecord(id, merged);
      await tx`
        insert into request_audit_events (id, request_id, action, actor, details, timestamp)
        values (${randomId('audit')}, ${id}, ${auditAction}, ${actor}, ${details ?? null}, ${nextTimestamp})
      `;
    });

    return this.getRequestById(id);
  },

  async addCommunication(
    id: string,
    channel: CommunicationChannel,
    state: CommunicationState,
    summary: string,
    actor: 'staff' | 'system'
  ) {
    await ensureDemoData();
    const current = await this.getRequestById(id);
    if (!current) {
      return null;
    }

    const nextTimestamp = new Date().toISOString();
    await getSql().begin(async tx => {
      await tx`
        update requests
        set updated_at = ${nextTimestamp}
        where id = ${id}
      `;
      await tx`
        insert into request_communications (id, request_id, channel, state, summary, timestamp)
        values (${randomId('comm')}, ${id}, ${channel}, ${state}, ${summary}, ${nextTimestamp})
      `;
      await tx`
        insert into request_audit_events (id, request_id, action, actor, details, timestamp)
        values (${randomId('audit')}, ${id}, ${`Communication ${state}: ${channel}`}, ${actor}, ${summary}, ${nextTimestamp})
      `;
    });

    return this.getRequestById(id);
  },

  async getNotices() {
    await ensureDemoData();
    const rows = await getSql()<NoticeRow[]>`
      select id, text, active, type
      from notice_banners
      where active = true
      order by id asc
    `;
    return rows.map(row => ({
      id: row.id,
      text: row.text,
      active: row.active,
      type: row.type,
    }));
  },

  async getStaleRequests(hoursThreshold = 48) {
    const requests = await this.getRequests();
    const now = Date.now();
    const thresholdMs = hoursThreshold * 60 * 60 * 1000;
    return requests.filter(request => {
      const isPending = ['submitted', 'under_review'].includes(request.status);
      const lastUpdate = new Date(request.updatedAt).getTime();
      return isPending && now - lastUpdate > thresholdMs;
    });
  },
};
