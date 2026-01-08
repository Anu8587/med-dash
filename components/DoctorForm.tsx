
import React from 'react';
import { AEReport } from '../types';

interface DoctorFormProps {
  data: AEReport;
  onChange: (field: keyof AEReport, value: any) => void;
}

export const DoctorForm: React.FC<DoctorFormProps> = ({ data, onChange }) => {
  const isFilled = (val: any) => val !== undefined && val !== null && val !== '';

  const ClinicalField = ({ label, field, children }: any) => (
    <div className={`p-4 rounded-xl border-l-4 transition-all ${isFilled(data[field as keyof AEReport]) ? 'bg-white border-slate-200 border-l-emerald-400' : 'bg-red-50 border-red-100 border-l-red-500'}`}>
      <div className="flex justify-between items-center mb-3">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</label>
        {isFilled(data[field as keyof AEReport]) && (
          <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">SYSTEM MAPPED</span>
        )}
      </div>
      {children}
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4 p-6 bg-slate-900 rounded-3xl text-white">
        <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-blue-400">
          <i className="fa-solid fa-stethoscope text-xl"></i>
        </div>
        <div>
          <h3 className="font-black text-lg">HCP Follow-up: Clinical Validation</h3>
          <p className="text-xs text-slate-400">Validated against MedDRA & ICH E2B standards</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">I. Diagnosis & Serious Criteria</h4>
          
          <ClinicalField label="Seriousness Classification" field="seriousness">
             <select 
              value={data.seriousness}
              onChange={(e) => onChange('seriousness', e.target.value)}
              className="w-full p-2 bg-slate-50 rounded-lg text-sm font-bold border-0 focus:ring-2 focus:ring-blue-500"
            >
              <option value="Non-Serious">Non-Serious</option>
              <option value="Serious">Serious (ICH Criteria)</option>
            </select>
          </ClinicalField>

          <ClinicalField label="Clinical Outcome" field="outcome">
             <select 
              value={data.outcome || ''}
              onChange={(e) => onChange('outcome', e.target.value)}
              className="w-full p-2 bg-slate-50 rounded-lg text-sm font-bold border-0 focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Pending Assessment...</option>
              <option value="Recovered">Recovered / Resolved</option>
              <option value="Recovering">Recovering / Resolving</option>
              <option value="Not Recovered">Not Recovered / Not Resolved</option>
              <option value="Fatal">Fatal</option>
              <option value="Unknown">Unknown</option>
            </select>
          </ClinicalField>
        </div>

        <div className="space-y-6">
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">II. Drug Exposure & Regimen</h4>
          
          <ClinicalField label="Verified Dosage" field="dose">
            <input 
              type="text"
              value={data.dose || ''}
              onChange={(e) => onChange('dose', e.target.value)}
              placeholder="e.g. 100mg QID"
              className="w-full p-2 bg-slate-50 rounded-lg text-sm font-bold outline-none border-0"
            />
          </ClinicalField>

          <ClinicalField label="Adverse Event Onset" field="event_start_date">
            <input 
              type="date"
              value={data.event_start_date || ''}
              onChange={(e) => onChange('event_start_date', e.target.value)}
              className="w-full p-2 bg-slate-50 rounded-lg text-sm font-bold outline-none border-0"
            />
          </ClinicalField>
        </div>
      </div>

      <div className="p-6 bg-blue-50/50 border border-blue-100 rounded-3xl">
        <label className="text-[10px] font-black text-blue-400 uppercase tracking-widest block mb-3">Clinical Narrative Update</label>
        <textarea 
          value={data.event_description}
          onChange={(e) => onChange('event_description', e.target.value)}
          className="w-full p-4 bg-white border border-blue-100 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 outline-none h-40 font-medium"
        />
      </div>
    </div>
  );
};
