
import React, { useState } from 'react';
import { AEReport, CasePriority, CaseStatus, FollowUpRecipient } from '../types';
import { PriorityBadge } from './PriorityBadge';
import { SAFETY_CHECKLIST_TEMPLATE } from '../constants';
import { classify_case } from '../services/safetyLogic';
import { PatientForm } from './PatientForm';
import { DoctorForm } from './DoctorForm';
import { EmailPreview } from './EmailPreview';

interface FollowUpViewProps {
  report: AEReport;
  onClose: () => void;
  onUpdateStatus: (id: string, status: CaseStatus) => void;
}

export const FollowUpView: React.FC<FollowUpViewProps> = ({ report, onClose, onUpdateStatus }) => {
  const [activeView, setActiveView] = useState<'details' | 'form' | 'email'>('details');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formType, setFormType] = useState<FollowUpRecipient>(
    report.followup_recipient === FollowUpRecipient.BOTH ? FollowUpRecipient.DOCTOR : report.followup_recipient
  );
  const [formData, setFormData] = useState(report);
  const classification = classify_case(formData, formData.missing_fields);

  const handleFieldChange = (field: keyof AEReport, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate regulatory filing & database sync
    await new Promise(r => setTimeout(r, 1500));
    setShowSuccess(true);
    onUpdateStatus(report.id, CaseStatus.CLOSED);
    await new Promise(r => setTimeout(r, 2000));
    onClose();
  };

  const getRecipientBadge = (recipient: FollowUpRecipient) => {
    switch (recipient) {
      case FollowUpRecipient.PATIENT: return 'bg-purple-100 text-purple-700 border-purple-200';
      case FollowUpRecipient.DOCTOR: return 'bg-cyan-100 text-cyan-700 border-cyan-200';
      case FollowUpRecipient.BOTH: return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      default: return 'bg-slate-100 text-slate-400 border-slate-200';
    }
  };

  const DataField = ({ label, value, isMissing }: { label: string, value: any, isMissing?: boolean }) => (
    <div className={`p-4 rounded-xl border transition-all ${isMissing ? 'bg-red-50 border-red-100 shadow-inner' : 'bg-slate-50 border-slate-100'}`}>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      <p className={`text-sm font-bold ${isMissing ? 'text-red-500 italic' : 'text-slate-900'}`}>
        {isMissing ? 'Data Missing' : (value?.toString() || 'Not Specified')}
      </p>
    </div>
  );

  if (showSuccess) {
    return (
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-lg p-12 rounded-[3rem] text-center shadow-2xl animate-in zoom-in-95 duration-300">
           <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-500 mx-auto mb-8 shadow-inner">
             <i className="fa-solid fa-check-double text-4xl"></i>
           </div>
           <h2 className="text-3xl font-black text-slate-900 mb-4">Case Validated</h2>
           <p className="text-slate-500 font-medium leading-relaxed">
             Follow-up information successfully gathered. The report is now E2B compliant and ready for global regulatory filing.
           </p>
           <div className="mt-10 flex items-center justify-center gap-2">
             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce"></div>
             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce delay-150"></div>
             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce delay-300"></div>
             <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Syncing Global DB</span>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-7xl h-[95vh] rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden border border-white/20">
        
        {/* Header Section */}
        <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400">
              <i className="fa-solid fa-folder-open text-2xl"></i>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Case Detail: {report.id}</h2>
                <PriorityBadge priority={formData.priority} />
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Received: {report.dateReceived}</span>
                <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-black border uppercase tracking-widest ${getRecipientBadge(formData.followup_recipient)}`}>
                  Recommended Route: {formData.followup_recipient}
                </span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="w-12 h-12 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-400 transition-all flex items-center justify-center border border-slate-200">
            <i className="fa-solid fa-xmark text-xl"></i>
          </button>
        </div>

        <div className="flex-1 overflow-hidden flex">
          {/* Main Content Area */}
          <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar">
            
            {/* Nav Switcher */}
            <div className="flex gap-8 border-b border-slate-100 mb-6">
              <button 
                onClick={() => setActiveView('details')}
                className={`pb-4 text-xs font-black uppercase tracking-widest transition-all ${activeView === 'details' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
              >
                Case Analysis
              </button>
              <button 
                onClick={() => setActiveView('form')}
                className={`pb-4 text-xs font-black uppercase tracking-widest transition-all ${activeView === 'form' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
              >
                Follow-up Form
              </button>
              <button 
                onClick={() => setActiveView('email')}
                className={`pb-4 text-xs font-black uppercase tracking-widest transition-all ${activeView === 'email' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
              >
                Email Templates
              </button>
            </div>

            {activeView === 'details' ? (
              <>
                {/* Section 1: Initial AE Report */}
                <section>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                      <i className="fa-solid fa-file-medical text-indigo-500"></i>
                      I. Initial AE Report (Primary Source)
                    </h3>
                  </div>
                  
                  <div className="bg-indigo-50/50 p-6 rounded-3xl border border-indigo-100/50 mb-8">
                    <p className="text-indigo-900 leading-relaxed text-lg font-medium italic">
                      "{report.event_description}"
                    </p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <DataField label="Reporter Type" value={report.reporter_type} />
                    <DataField label="Patient Age" value={report.patient_age} isMissing={!report.patient_age} />
                    <DataField label="Gender" value={report.gender} isMissing={!report.gender} />
                    <DataField label="Drug Name" value={report.drug_name} />
                    <DataField label="Dosage" value={report.dose} isMissing={!report.dose} />
                    <DataField label="Hospitalized" value={report.hospitalized ? 'Yes' : 'No'} />
                    <DataField label="Onset Date" value={report.event_start_date} isMissing={!report.event_start_date} />
                    <DataField label="Outcome" value={report.outcome} isMissing={!report.outcome} />
                  </div>
                </section>

                {/* Section 2: AI / System Analysis Panel */}
                <section>
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                    <i className="fa-solid fa-microchip text-indigo-500"></i>
                    II. System Validation Summary

                  </h3>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Priority Reasoning */}
                    <div className="bg-white border-2 border-slate-100 rounded-[2rem] p-8 shadow-sm">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                          <i className="fa-solid fa-brain"></i>
                        </div>
                        <h4 className="font-black text-slate-900 uppercase tracking-widest text-[10px]">Priority Assignment Rules</h4>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between py-3 border-b border-slate-50">
                          <span className="text-sm font-bold text-slate-500">Assigned Priority</span>
                          <PriorityBadge priority={formData.priority} />
                        </div>
                        <p className="text-sm text-slate-600 leading-relaxed font-medium">
                          <span className="text-indigo-600 font-black mr-1">Rationale:</span>
                          {classification.reason}
                        </p>
                      </div>
                    </div>

                    {/* Missing Data Matrix */}
                    <div className="bg-slate-900 rounded-[2rem] p-8 text-white">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-emerald-400">
                            <i className="fa-solid fa-clipboard-list"></i>
                          </div>
                          <h4 className="font-black text-white uppercase tracking-widest text-[10px]">Follow-up Requirements</h4>
                        </div>
                        <span className="text-[10px] font-black px-2 py-1 bg-red-500 rounded uppercase">
                          {formData.missing_fields.length} Missing
                        </span>
                      </div>
                      <ul className="space-y-3">
                        {SAFETY_CHECKLIST_TEMPLATE.map(item => {
                          const isMissing = !formData[item.id as keyof AEReport];
                          return (
                            <li key={item.id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                              <span className="text-xs font-medium text-slate-400">{item.label}</span>
                              {isMissing ? (
                                <span className="flex items-center gap-2 text-red-400 text-[10px] font-black uppercase">
                                  <i className="fa-solid fa-circle-exclamation"></i> Required
                                </span>
                              ) : (
                                <i className="fa-solid fa-check text-emerald-500 text-xs"></i>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                </section>
              </>
            ) : activeView === 'form' ? (
              /* Follow-Up Form Selection View */
              <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">Active Follow-up Workflow</h3>
                    <p className="text-sm text-slate-400 font-medium">Auto-filled data is locked to maintain source integrity.</p>
                  </div>
                  <div className="flex p-1 bg-slate-100 rounded-2xl border border-slate-200">
                    <button 
                      onClick={() => setFormType(FollowUpRecipient.PATIENT)}
                      className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${formType === FollowUpRecipient.PATIENT ? 'bg-white text-indigo-600 shadow-md ring-1 ring-slate-200' : 'text-slate-400'}`}
                    >
                      Patient View
                    </button>
                    <button 
                      onClick={() => setFormType(FollowUpRecipient.DOCTOR)}
                      className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${formType === FollowUpRecipient.DOCTOR ? 'bg-white text-indigo-600 shadow-md ring-1 ring-slate-200' : 'text-slate-400'}`}
                    >
                      HCP View
                    </button>
                  </div>
                </div>

                {formType === FollowUpRecipient.PATIENT ? (
                  <PatientForm data={formData} onChange={handleFieldChange} />
                ) : (
                  <DoctorForm data={formData} onChange={handleFieldChange} />
                )}
              </div>
            ) : (
              /* Email Previews View */
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <EmailPreview report={formData} />
              </div>
            )}
          </div>

          {/* Right Action Rail */}
          <div className="w-80 bg-slate-50 border-l border-slate-100 p-8 flex flex-col justify-between">
            <div className="space-y-6">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Workflow Engine</h4>
              
              <button 
                onClick={() => {
                  alert("Follow-up strategy generated and logged in Audit Trail.");
                  onUpdateStatus(report.id, CaseStatus.PENDING_FOLLOWUP);
                  setActiveView('form');
                }}
                disabled={report.status === CaseStatus.CLOSED}
                className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl flex items-center justify-center gap-3 ${
                  report.status === CaseStatus.CLOSED 
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none' 
                  : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100'
                }`}
              >
                <i className="fa-solid fa-wand-sparkles text-indigo-300"></i>
                Auto-Fill Form
              </button>

              <button 
                onClick={() => setActiveView('email')}
                className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all border-2 flex items-center justify-center gap-3 ${
                  activeView === 'email' 
                  ? 'bg-white border-indigo-600 text-indigo-600 shadow-sm' 
                  : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-600 hover:text-indigo-600'
                }`}
              >
                <i className="fa-solid fa-envelope-open-text"></i>
                Preview Emails
              </button>

              <div className="pt-6 border-t border-slate-200">
                <p className="text-[10px] text-slate-400 font-bold uppercase mb-4">Case Lifecycle</p>
                <div className="space-y-3">
                  <button 
                    onClick={handleSubmit}
                    disabled={isSubmitting || report.status === CaseStatus.CLOSED}
                    className={`w-full py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest border transition-all flex items-center justify-center gap-2 ${
                      report.status === CaseStatus.CLOSED
                      ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                      : 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100'
                    }`}
                  >
                    {isSubmitting ? (
                      <i className="fa-solid fa-circle-notch animate-spin"></i>
                    ) : report.status === CaseStatus.CLOSED ? (
                      <><i className="fa-solid fa-check"></i> Filing Complete</>
                    ) : (
                      'Submit & Close Case'
                    )}
                  </button>
                  <button 
                    onClick={() => {
                      onUpdateStatus(report.id, CaseStatus.IN_PROGRESS);
                      onClose();
                    }}
                    disabled={report.status === CaseStatus.CLOSED}
                    className="w-full py-3 bg-white text-slate-400 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:text-slate-600 border border-slate-200 disabled:opacity-50"
                  >
                    Save Progress
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <span className={`w-1.5 h-1.5 rounded-full ${report.status === CaseStatus.CLOSED ? 'bg-emerald-500' : 'bg-amber-400 animate-pulse'}`}></span>
                <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">
                  {report.status === CaseStatus.CLOSED ? 'Audit History' : 'Audit Active'}
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-[10px]">
                  <span className="text-slate-400 font-medium tracking-tight">Operator:</span>
                  <span className="text-slate-900 font-black tracking-tight">NVS-4921</span>
                </div>
                <div className="flex justify-between text-[10px]">
                  <span className="text-slate-400 font-medium tracking-tight">Compliance:</span>
                  <span className={`font-black tracking-tight italic ${report.status === CaseStatus.CLOSED ? 'text-emerald-500' : 'text-amber-500'}`}>
                    {report.status === CaseStatus.CLOSED ? 'E2B Verified' : 'Pending E2B'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
