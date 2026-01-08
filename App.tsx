
import React, { useState, useMemo } from 'react';
import { AEReport, CasePriority, CaseStatus, AnalysisResult, ReporterType } from './types';
import { MOCK_CASES } from './constants';
import { CaseTable } from './components/CaseTable';
import { IngestionPanel } from './components/IngestionPanel';
import { FollowUpView } from './components/FollowUpView';

import { detect_missing_fields, classify_case, decide_followup_recipient } from './services/safetyLogic';

const App: React.FC = () => {
  const [cases, setCases] = useState<AEReport[]>(MOCK_CASES);
  const [selectedCase, setSelectedCase] = useState<AEReport | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'high'>('all');
  const [showDemoMode, setShowDemoMode] = useState(false);
  const [demoStep, setDemoStep] = useState(1);

  const stats = useMemo(() => {
    return {
      total: cases.length,
      highPriority: cases.filter(c => c.priority === CasePriority.HIGH && c.status !== CaseStatus.CLOSED).length,
      new: cases.filter(c => c.status === CaseStatus.NEW).length,
      pending: cases.filter(c => c.status === CaseStatus.PENDING_FOLLOWUP).length,
      closed: cases.filter(c => c.status === CaseStatus.CLOSED).length,
    };
  }, [cases]);

  const filteredCases = useMemo(() => {
    if (activeTab === 'high') {
      return cases.filter(c => c.priority === CasePriority.HIGH);
    }
    return cases;
  }, [cases, activeTab]);

  const handleNewReport = (text: string, analysis: AnalysisResult) => {
    const rawData = analysis.detectedInfo as Partial<AEReport>;
    if (!rawData.event_description) rawData.event_description = text;

    const missing = detect_missing_fields(rawData);
    const classification = classify_case(rawData, missing);
    const followup = decide_followup_recipient(rawData, missing);

    const newCase: AEReport = {
      id: `AE-2024-${String(cases.length + 1).padStart(3, '0')}`,
      dateReceived: new Date().toISOString().split('T')[0],
      reporter_type: rawData.reporter_type || ReporterType.CONSUMER,
      patient_age: rawData.patient_age,
      gender: rawData.gender,
      drug_name: rawData.drug_name || 'Unidentified Drug',
      dose: rawData.dose,
      event_description: rawData.event_description,
      seriousness: rawData.seriousness || (rawData.hospitalized ? 'Serious' : 'Non-Serious'),
      hospitalized: !!rawData.hospitalized,
      event_start_date: rawData.event_start_date,
      outcome: rawData.outcome,
      status: CaseStatus.NEW,
      priority: classification.priority,
      followup_recipient: followup,
      missing_fields: missing
    };

    setCases(prev => [newCase, ...prev]);
    if (showDemoMode) setDemoStep(2);
  };

  const handleUpdateStatus = (id: string, status: CaseStatus) => {
    setCases(prev => prev.map(c => {
      if (c.id === id) {
        if (status === CaseStatus.CLOSED && showDemoMode) setDemoStep(5);
        if (status === CaseStatus.PENDING_FOLLOWUP && showDemoMode) setDemoStep(4);
        return { 
          ...c, 
          status, 
          missing_fields: status === CaseStatus.CLOSED ? [] : c.missing_fields 
        };
      }
      return c;
    }));
  };

  const handleCaseSelect = (report: AEReport) => {
    setSelectedCase(report);
    if (showDemoMode && demoStep < 3) setDemoStep(3);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans selection:bg-indigo-100 selection:text-indigo-900 antialiased flex flex-col">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-[1600px] mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-100">
              <i className="fa-solid fa-shield-virus text-white text-2xl"></i>
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight">HealthUp <span className="text-indigo-600 text-[10px] font-black px-2 py-0.5 bg-indigo-50 rounded ml-1 uppercase tracking-tighter">Safety v1.2</span></h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">PV Command Center</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            
            <div className="h-10 w-px bg-slate-100"></div>
            <div className="text-right hidden sm:block pr-6">
              <p className="text-sm font-black text-slate-900">Novartis Safety</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase italic">Global Dashboard</p>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex-1 flex overflow-hidden">
        {/* Main Console */}
        <main className="flex-1 overflow-y-auto p-6 md:p-10 space-y-10 custom-scrollbar">
          {/* KPI Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            <div className="bg-white p-7 rounded-[2rem] shadow-sm border border-slate-200">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Reports</p>
              <p className="text-4xl font-black text-slate-900">{stats.total}</p>
            </div>
            <div className="bg-white p-7 rounded-[2rem] shadow-sm border border-slate-200">
              <p className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-1">Urgent Gaps</p>
              <p className="text-4xl font-black text-slate-900">{stats.highPriority}</p>
            </div>
            <div className="bg-white p-7 rounded-[2rem] shadow-sm border border-slate-200">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Avg Analysis</p>
              <p className="text-4xl font-black text-slate-900">1.4s</p>
            </div>
            <div className="bg-white p-7 rounded-[2rem] shadow-sm border border-slate-200">
              <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">E2B Validated</p>
              <p className="text-4xl font-black text-slate-900">{stats.closed}</p>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-10">
            <div className="col-span-12 lg:col-span-8 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Case Management</h2>
                <div className="flex gap-2 bg-slate-100 p-1 rounded-xl">
                  <button onClick={() => setActiveTab('all')} className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${activeTab === 'all' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}>All</button>
                  <button onClick={() => setActiveTab('high')} className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${activeTab === 'high' ? 'bg-white text-red-600 shadow-sm' : 'text-slate-400'}`}>High Priority</button>
                </div>
              </div>
              <CaseTable cases={filteredCases} onSelectCase={handleCaseSelect} />
            </div>
            <div className="col-span-12 lg:col-span-4 space-y-8">
              <IngestionPanel 
                onProcessed={handleNewReport} 
                onStartScenario={() => showDemoMode && setDemoStep(1)}
              />
            </div>
          </div>
        </main>

        {/* Demo Sidebar */}
        {showDemoMode && (
          <DemoStoryline 
            currentStep={demoStep} 
            onStepClick={(s) => setDemoStep(s)}
          />
        )}
      </div>

      {selectedCase && (
        <FollowUpView 
          report={selectedCase} 
          onClose={() => setSelectedCase(null)}
          onUpdateStatus={handleUpdateStatus}
        />
      )}
    </div>
  );
};

export default App;
