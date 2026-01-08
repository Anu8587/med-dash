
import React from 'react';
import { AEReport } from '../types';

interface PatientFormProps {
  data: AEReport;
  onChange: (field: keyof AEReport, value: any) => void;
}

export const PatientForm: React.FC<PatientFormProps> = ({ data, onChange }) => {
  const isFilled = (val: any) => val !== undefined && val !== null && val !== '';

  const InputWrapper = ({ label, helper, field, children }: any) => (
    <div className={`p-6 rounded-3xl border-2 transition-all ${isFilled(data[field as keyof AEReport]) ? 'bg-white border-slate-100' : 'bg-red-50/50 border-red-100 ring-4 ring-red-500/5'}`}>
      <div className="flex justify-between items-start mb-2">
        <label className="text-sm font-black text-slate-900">{label}</label>
        {isFilled(data[field as keyof AEReport]) ? (
          <span className="text-[10px] font-black text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded uppercase tracking-wider">
            <i className="fa-solid fa-check-double mr-1"></i> Auto-filled
          </span>
        ) : (
          <span className="text-[10px] font-black text-red-500 bg-red-100 px-2 py-0.5 rounded uppercase tracking-wider">
            Required
          </span>
        )}
      </div>
      <p className="text-xs text-slate-400 mb-4">{helper}</p>
      {children}
    </div>
  );

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-8 rounded-[2.5rem] text-white mb-10 shadow-xl shadow-indigo-100">
        <h3 className="text-2xl font-black mb-2 italic">Hi there, we'd like to check in.</h3>
        <p className="text-indigo-100 text-sm leading-relaxed opacity-90">
          We received a report about your experience with <strong>{data.drug_name}</strong>. 
          Please help us understand exactly what happened so we can ensure the medicine is safe for everyone.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <InputWrapper 
          label="How are you feeling today?" 
          helper="Is the problem still happening, or has it gone away?"
          field="outcome"
        >
          <div className="flex gap-3">
            {['Better', 'Same', 'Not Well', 'Recovered'].map(opt => (
              <button
                key={opt}
                onClick={() => onChange('outcome', opt)}
                className={`flex-1 py-3 rounded-xl text-sm font-bold border-2 transition-all ${data.outcome === opt ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' : 'bg-white border-slate-100 text-slate-500 hover:border-indigo-200'}`}
              >
                {opt}
              </button>
            ))}
          </div>
        </InputWrapper>

        <InputWrapper 
          label="Tell us about the symptoms" 
          helper="Describe what you felt in your own words."
          field="event_description"
        >
          <textarea 
            value={data.event_description}
            onChange={(e) => onChange('event_description', e.target.value)}
            className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none h-32"
          />
        </InputWrapper>

        <div className="grid grid-cols-2 gap-6">
          <InputWrapper label="Your Age" helper="Verify your age" field="patient_age">
            <input 
              type="number"
              value={data.patient_age || ''}
              onChange={(e) => onChange('patient_age', parseInt(e.target.value))}
              className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm"
            />
          </InputWrapper>
          <InputWrapper label="Your Gender" helper="Verify your gender" field="gender">
            <select 
              value={data.gender || ''}
              onChange={(e) => onChange('gender', e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold"
            >
              <option value="">Select...</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </InputWrapper>
        </div>
      </div>
    </div>
  );
};
