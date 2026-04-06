export type RequestStatus = 
  | 'submitted' 
  | 'under_review' 
  | 'approved' 
  | 'rescheduled' 
  | 'rejected' 
  | 'attended' 
  | 'closed';

export type RequestCategory = 'grievance' | 'project_review' | 'open_house' | 'general_inquiry';

export type InteractionMode = 'in-person' | 'online';
export type GrievanceUrgency = 'low' | 'medium' | 'high' | 'critical';
export type AIConfidence = 'low' | 'medium' | 'high';

export interface AuditEvent {
  id: string;
  timestamp: string;
  action: string;
  actor: 'citizen' | 'staff' | 'system';
  details?: string;
}

export type CommunicationChannel = 'email' | 'SMS' | 'WhatsApp' | 'portal only';

export type CommunicationState = 'queued' | 'prepared' | 'sent' | 'failed' | 'skipped';

export interface CommunicationEvent {
  id: string;
  timestamp: string;
  channel: CommunicationChannel;
  state: CommunicationState;
  summary: string;
}

export interface CitizenRequest {
  id: string; // e.g. REQ-1001
  applicantName: string;
  mobile: string;
  category: RequestCategory;
  purpose: string;
  summary: string;
  preferredDay: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  mode: InteractionMode;
  
  status: RequestStatus;
  createdAt: string;
  updatedAt: string;
  
  // Slot allocation
  assignedDate?: string; // YYYY-MM-DD
  assignedTimeStr?: string; // e.g. "14:30 - 15:00"
  
  // Context Notes
  rejectionReason?: string;
  rescheduleReason?: string;
  publicOfficeNote?: string;
  internalStaffNote?: string;
  aiTriage?: {
    urgency: GrievanceUrgency;
    staffSummary: string;
    rationale: string;
    confidence: AIConfidence;
    modelUsed: string;
    generatedAt: string;
  };
  
  // History
  auditTimeline: AuditEvent[];
  communications: CommunicationEvent[];
}

export interface NoticeBanner {
  id: string;
  text: string;
  active: boolean;
  type: 'info' | 'warning' | 'error';
}

export type VoiceDraftStatus = 'listening' | 'processing' | 'ready' | 'failed';

export type VoiceStructuredDraft = {
  applicantName: string | null;
  mobile: string | null;
  preferredDay: string | null;
  mode: "online" | "in-person" | null;
  purpose: string | null;
  summary: string;
  missingFields: string[];
};

export interface VoiceDraft {
  id: string;
  transcript: string;
  structuredData: VoiceStructuredDraft;
  isFallback: boolean;
  status: VoiceDraftStatus;
  modelUsed?: string; // Tracks 'mock', 'manual', or specific model like 'sarvam-30b'
  errorMsg?: string;
}
