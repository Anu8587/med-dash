
import React from 'react';
import { AEReport, FollowUpRecipient } from '../types';

interface EmailPreviewProps {
  report: AEReport;
}

export const EmailPreview: React.FC<EmailPreviewProps> = ({ report }) => {
  return (
    <div className="space-y-10 max-w-4xl mx-auto pb-10">
      <div className="bg-indigo-50/50 p-6 rounded-3xl border border-indigo-100 flex items-center gap-4">
        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm">
          <i className="fa-solid fa-envelope-circle-check text-xl"></i>
        </div>
        <div>
          <h3 className="font-black text-slate-900 tracking-tight">Communication Preview Console</h3>
          <p className="text-xs text-slate-500 font-medium">  Standardized follow-up communication for Case {report.id}.</p>
        </div>
      </div>

      {/* Patient Email */}
      <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm">
        <div className="bg-slate-50 px-8 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">To: Patient</span>
            <span className="text-xs font-bold text-slate-900">Encrypted Recipient</span>
          </div>
          <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">PATIENT_SAFE_TONE</span>
        </div>
        <div className="p-8 space-y-6">
          <div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Subject</p>
            <p className="text-sm font-bold text-slate-900">Important follow-up regarding your recent health report</p>
          </div>
          <div className="h-px bg-slate-100 w-full"></div>
          <div className="space-y-4 text-slate-700 leading-relaxed text-sm">
            <p>Dear Valued Patient,</p>
            <p>We are reaching out to you because we received a report regarding your experience with <strong>{report.drug_name}</strong> on {report.dateReceived}.</p>
            <p>At HealthUp, patient safety is our highest priority. We would like to learn a little more about how you are feeling to help us better understand this medicine. Your feedback is vital to ensuring the safety of all patients using this treatment.</p>
            <p>Could you please take <strong>less than 2 minutes</strong> to confirm a few details about your experience? Your response is kept strictly confidential and used only for safety monitoring purposes.</p>
            <div className="py-6 text-center">
              <a href="#" className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-indigo-100">
                Complete Secure Check-in
              </a>
            </div>
            <p>Thank you for your time and for helping us maintain high safety standards.</p>
            <p>Best regards,<br/><span className="font-bold text-slate-900 italic underline decoration-indigo-300">The Global Safety Team</span></p>
          </div>
        </div>
      </div>

      {/* Doctor Email */}
      <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm">
        <div className="bg-slate-900 px-8 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3 text-white">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">To: Healthcare Professional</span>
            <span className="text-xs font-bold">clinical.registry@hospital.org</span>
          </div>
          <span className="text-[10px] font-black text-blue-400 bg-white/5 px-2 py-0.5 rounded">REGULATORY_COMPLIANCE</span>
        </div>
        <div className="p-8 space-y-6">
          <div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Subject</p>
            <p className="text-sm font-bold text-slate-900">Required Clinical Follow-up: Adverse Event Case [{report.id}]</p>
          </div>
          <div className="h-px bg-slate-100 w-full"></div>
          <div className="space-y-4 text-slate-700 leading-relaxed text-sm">
            <p>Dear Healthcare Professional,</p>
            <p>In accordance with global pharmacovigilance regulatory requirements, we are conducting a follow-up investigation for an Adverse Event involving <strong>{report.drug_name}</strong> reported from your facility.</p>
            <p>To ensure our safety database reflects the most accurate clinical outcomes, we kindly request a brief validation of the patient's current status and specific clinical markers related to the event reported on {report.dateReceived}.</p>
            <p>We understand the demands on your time; the structured follow-up form linked below is designed for completion in under 60 seconds.</p>
            <div className="py-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Internal Reference</p>
                  <p className="text-xs font-bold text-slate-600">{report.id} / MED-QUERY-2024</p>
                </div>
                <a href="#" className="text-indigo-600 font-black text-xs uppercase tracking-widest hover:underline">
                  Open Secure Portal <i className="fa-solid fa-arrow-up-right-from-square ml-1 text-[10px]"></i>
                </a>
              </div>
            </div>
            <p>Your expert input is essential for our ongoing safety signaling process.</p>
            <p>Respectfully,<br/><span className="font-bold text-slate-900">Pharmacovigilance Department</span></p>
          </div>
        </div>
      </div>
    </div>
  );
};
