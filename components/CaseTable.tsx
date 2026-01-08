
import React from 'react';
import { AEReport, CaseStatus } from '../types';
import { PriorityBadge } from './PriorityBadge';

interface CaseTableProps {
  cases: AEReport[];
  onSelectCase: (report: AEReport) => void;
}

export const CaseTable: React.FC<CaseTableProps> = ({ cases, onSelectCase }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <table className="min-w-full divide-y divide-slate-100">
        <thead>
          <tr className="bg-slate-50/50">
            <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Case ID</th>
            <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Reporter Type</th>
            <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Priority</th>
            <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Missing Info</th>
            <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Follow-Up Status</th>
            <th className="px-6 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Action</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-slate-100">
          {cases.map((c) => (
            <tr key={c.id} className={`group transition-all cursor-default ${c.status === CaseStatus.CLOSED ? 'bg-slate-50/30' : 'hover:bg-indigo-50/30'}`}>
              <td className="px-6 py-5 whitespace-nowrap text-sm font-bold text-indigo-600">
                {c.id}
              </td>
              <td className="px-6 py-5 whitespace-nowrap">
                <div className="flex items-center gap-2">
                  <i className={`fa-solid ${c.reporter_type === 'Doctor' ? 'fa-user-doctor text-blue-400' : 'fa-user text-slate-400'} text-xs`}></i>
                  <span className="text-sm font-medium text-slate-700">{c.reporter_type}</span>
                </div>
              </td>
              <td className="px-6 py-5 whitespace-nowrap">
                <PriorityBadge priority={c.priority} />
              </td>
              <td className="px-6 py-5 whitespace-nowrap">
                {c.status === CaseStatus.CLOSED ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center text-[10px] text-emerald-600">
                      <i className="fa-solid fa-check"></i>
                    </div>
                    <span className="text-xs font-black text-emerald-600 uppercase tracking-tighter italic">E2B Valid</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-bold ${c.missing_fields.length > 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                      {c.missing_fields.length}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">fields</span>
                  </div>
                )}
              </td>
              <td className="px-6 py-5 whitespace-nowrap">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${
                    c.status === CaseStatus.CLOSED ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' : 
                    c.status === CaseStatus.PENDING_FOLLOWUP ? 'bg-amber-400 animate-pulse' : 
                    'bg-slate-300'
                  }`}></span>
                  <span className={`text-xs font-bold uppercase tracking-wide ${c.status === CaseStatus.CLOSED ? 'text-emerald-600' : 'text-slate-600'}`}>
                    {c.status === CaseStatus.NEW ? 'Pending' : c.status}
                  </span>
                </div>
              </td>
              <td className="px-6 py-5 whitespace-nowrap text-right">
                <button 
                  onClick={() => onSelectCase(c)}
                  className="px-4 py-1.5 bg-white border border-slate-200 text-indigo-600 text-xs font-black uppercase tracking-wider rounded-lg shadow-sm hover:border-indigo-200 hover:bg-indigo-50 transition-all"
                >
                  {c.status === CaseStatus.CLOSED ? 'Audit History' : 'View Case'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {cases.length === 0 && (
        <div className="py-20 text-center">
          <i className="fa-solid fa-inbox text-slate-200 text-5xl mb-4"></i>
          <p className="text-slate-400 font-medium">No safety cases in current queue</p>
        </div>
      )}
    </div>
  );
};
