
import { AEReport, CasePriority, FollowUpRecipient, ReporterType } from '../types';

/**
 * Detects missing critical safety fields in an AE report.
 */
export const detect_missing_fields = (report: Partial<AEReport>): string[] => {
  const missing: string[] = [];
  if (!report.patient_age) missing.push('Patient Age');
  if (!report.gender) missing.push('Gender');
  if (!report.dose) missing.push('Drug Dosage');
  if (!report.event_start_date) missing.push('Event Start Date');
  if (!report.outcome) missing.push('Event Outcome');
  if (!report.event_description || report.event_description.length < 10) missing.push('Detailed Description');
  return missing;
};

/**
 * Classifies case priority using safety-first rules.
 */
export const classify_case = (report: Partial<AEReport>, missing_fields: string[]): { priority: CasePriority; reason: string } => {
  if (report.hospitalized || report.seriousness === 'Serious') {
    return { 
      priority: CasePriority.HIGH, 
      reason: "Case involves hospitalization or serious medical event (Rule: Priority = High for serious events)." 
    };
  }

  if (missing_fields.length > 3) {
    return { 
      priority: CasePriority.MEDIUM, 
      reason: "Multiple critical fields missing from report (Rule: Priority = Medium for high-uncertainty cases)." 
    };
  }

  if (report.event_description?.toLowerCase().includes('dizzy') || report.event_description?.toLowerCase().includes('pain')) {
    return { 
      priority: CasePriority.MEDIUM, 
      reason: "Symptom severity is moderate and requires investigation." 
    };
  }

  return { 
    priority: CasePriority.LOW, 
    reason: "Non-serious event with minimal clinical impact reported." 
  };
};

/**
 * Decides whether follow-up should go to patient, doctor, or both.
 */
export const decide_followup_recipient = (report: Partial<AEReport>, missing_fields: string[]): FollowUpRecipient => {
  const needsClinical = missing_fields.some(f => ['Event Outcome', 'Seriousness', 'Hospitalization Details'].includes(f));
  const needsDemographics = missing_fields.some(f => ['Patient Age', 'Gender', 'Medical History'].includes(f));
  const needsDrugData = missing_fields.some(f => ['Drug Dosage', 'Event Start Date'].includes(f));

  if (missing_fields.length === 0) return FollowUpRecipient.NONE;

  // Rule: If dosage or timing is missing, check with both as cross-verification is safety critical.
  if (needsDrugData) return FollowUpRecipient.BOTH;

  // Rule: If reporter was doctor, but demographics are missing, ask patient.
  if (report.reporter_type === ReporterType.DOCTOR && needsDemographics) return FollowUpRecipient.PATIENT;

  // Rule: If reporter was patient, but clinical outcome/medical data missing, ask doctor.
  if (report.reporter_type === ReporterType.PATIENT && needsClinical) return FollowUpRecipient.DOCTOR;

  // Default fallback
  return FollowUpRecipient.BOTH;
};
