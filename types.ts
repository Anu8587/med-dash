
export enum CasePriority {
  HIGH = 'High',
  MEDIUM = 'Medium',
  LOW = 'Low'
}

export enum CaseStatus {
  NEW = 'New',
  IN_PROGRESS = 'In Progress',
  PENDING_FOLLOWUP = 'Pending Follow-up',
  CLOSED = 'Closed'
}

export enum FollowUpRecipient {
  PATIENT = 'Patient',
  DOCTOR = 'Doctor',
  BOTH = 'Both',
  NONE = 'None'
}

export enum ReporterType {
  PATIENT = 'Patient',
  DOCTOR = 'Doctor',
  PHARMACIST = 'Pharmacist',
  CONSUMER = 'Consumer'
}

export interface AEReport {
  id: string;
  dateReceived: string;
  reporter_type: ReporterType;
  patient_age?: number;
  gender?: string;
  drug_name: string;
  dose?: string;
  event_description: string;
  seriousness: 'Serious' | 'Non-Serious';
  hospitalized: boolean;
  event_start_date?: string;
  outcome?: string;
  status: CaseStatus;
  priority: CasePriority;
  followup_recipient: FollowUpRecipient;
  missing_fields: string[];
}

export interface AnalysisResult {
  detectedInfo: Partial<AEReport>;
  missingFields: string[];
  priority: CasePriority;
  reasoning: string;
}
