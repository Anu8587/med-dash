
import { AEReport, CasePriority, CaseStatus, ReporterType, FollowUpRecipient } from './types';
import { detect_missing_fields, classify_case, decide_followup_recipient } from './services/safetyLogic';

const createCase = (data: Partial<AEReport>): AEReport => {
  const missing = detect_missing_fields(data);
  const classification = classify_case(data, missing);
  const followup = decide_followup_recipient(data, missing);

  return {
    id: data.id || 'AE-TEMP',
    dateReceived: data.dateReceived || '2024-05-15',
    reporter_type: data.reporter_type || ReporterType.CONSUMER,
    patient_age: data.patient_age,
    gender: data.gender,
    drug_name: data.drug_name || 'Unknown',
    dose: data.dose,
    event_description: data.event_description || '',
    seriousness: data.seriousness || 'Non-Serious',
    hospitalized: !!data.hospitalized,
    event_start_date: data.event_start_date,
    outcome: data.outcome,
    status: data.status || CaseStatus.NEW,
    priority: classification.priority,
    followup_recipient: followup,
    missing_fields: missing
  };
};

export const MOCK_CASES: AEReport[] = [
  createCase({
    id: "AE-2024-001",
    reporter_type: ReporterType.DOCTOR,
    patient_age: 62,
    gender: "Male",
    drug_name: "CardioFix",
    dose: "10mg daily",
    event_description: "Patient experienced sudden anaphylaxis 15 minutes after ingestion. Admitted to ER immediately.",
    seriousness: "Serious",
    hospitalized: true,
    event_start_date: "2024-05-10",
    outcome: "Recovering",
    status: CaseStatus.NEW
  }),
  createCase({
    id: "AE-2024-002",
    reporter_type: ReporterType.PATIENT,
    drug_name: "MigraStop",
    event_description: "I feel very nauseous after taking the blue pill. It happened twice now.",
    seriousness: "Non-Serious",
    hospitalized: false,
    status: CaseStatus.NEW
  }),
  createCase({
    id: "AE-2024-003",
    reporter_type: ReporterType.PHARMACIST,
    patient_age: 45,
    gender: "Female",
    drug_name: "InsuLin-X",
    dose: "20 Units",
    event_description: "Reported hypoglycemia episode. Patient was found disoriented by family.",
    seriousness: "Serious",
    hospitalized: false,
    event_start_date: "2024-05-12",
    outcome: "Recovered",
    status: CaseStatus.IN_PROGRESS
  }),
  createCase({
    id: "AE-2024-004",
    reporter_type: ReporterType.DOCTOR,
    patient_age: 30,
    gender: "Female",
    drug_name: "Dermacure",
    event_description: "Mild contact dermatitis at application site.",
    seriousness: "Non-Serious",
    hospitalized: false,
    event_start_date: "2024-05-14",
    outcome: "Unknown",
    status: CaseStatus.PENDING_FOLLOWUP
  }),
  createCase({
    id: "AE-2024-005",
    reporter_type: ReporterType.CONSUMER,
    drug_name: "VitaBoost",
    dose: "1 tablet",
    event_description: "Slight headache after use.",
    seriousness: "Non-Serious",
    hospitalized: false,
    status: CaseStatus.NEW
  })
];

export const SAFETY_CHECKLIST_TEMPLATE = [
  { id: 'patient_age', label: 'Patient Age' },
  { id: 'gender', label: 'Gender' },
  { id: 'dose', label: 'Drug Dosage' },
  { id: 'event_start_date', label: 'Event Start Date' },
  { id: 'outcome', label: 'Event Outcome' },
];
