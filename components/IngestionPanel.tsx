import React, { useState } from 'react';
import { analyzeAdverseEvent } from '../services/geminiService';
import { AnalysisResult } from '../types';

interface IngestionPanelProps {
  onProcessed: (text: string, analysis: AnalysisResult) => void;
  onStartScenario?: () => void;
}

const DEMO_SCENARIOS = [
  {
    label: "Patient Call (Incomplete)",
    text: "Hi, I'm calling about my mom. She took CardioFix yesterday and her face is very swollen and itchy. She's 68 years old."
  },
  {
    label: "HCP Note (Clinical)",
    text: "Patient (45F) reported severe hypoglycemia post-InsuLin-X injection. Currently monitored in clinical observation unit."
  }
];

export const IngestionPanel: React.FC<IngestionPanelProps> = ({ onProcessed, onStartScenario }) => {
  const [inputText, setInputText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleProcess = async () => {
    if (!inputText.trim()) return;
    setIsProcessing(true);
    onStartScenario?.();

    try {
      const analysis = await analyzeAdverseEvent(inputText);
      onProcessed(inputText, analysis);
      setInputText("");
    } catch {
      alert("Processing failed. Please review the input report.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-200">
      <h2 className="text-lg font-black text-slate-900 mb-4">
        Unstructured Report Intake
      </h2>

      <div className="flex flex-wrap gap-2 mb-4">
        {DEMO_SCENARIOS.map(s => (
          <button
            key={s.label}
            onClick={() => setInputText(s.text)}
            className="text-[10px] font-black px-3 py-1.5 bg-slate-50 text-slate-500 rounded-lg border border-slate-100 hover:border-indigo-200 hover:text-indigo-600 uppercase"
          >
            {s.label}
          </button>
        ))}
      </div>

      <textarea
        className="w-full h-40 p-4 text-sm bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none mb-4"
        placeholder="Paste adverse event narrative here..."
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
      />

      <button
        onClick={handleProcess}
        disabled={isProcessing || !inputText.trim()}
        className={`w-full py-3 rounded-xl text-xs font-black uppercase tracking-widest ${
          isProcessing
            ? 'bg-slate-200 text-slate-400'
            : 'bg-indigo-600 text-white hover:bg-indigo-700'
        }`}
      >
        {isProcessing ? 'Processing...' : 'Process Report'}
      </button>
    </div>
  );
};
