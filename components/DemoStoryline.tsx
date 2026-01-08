import React from 'react';

interface DemoStorylineProps {
  currentStep: number;
  onStepClick: (step: number) => void;
}

export const DemoStoryline: React.FC<DemoStorylineProps> = () => {
  return (
    <div className="bg-white border-l border-slate-200 h-full w-[300px] p-6">
      <h3 className="text-xs font-black text-slate-400 uppercase mb-2">
        Guided Case Review
      </h3>
      <p className="text-sm text-slate-600 leading-relaxed">
        This panel provides an optional walkthrough for internal demos.
        It is not part of the operational workflow.
      </p>
    </div>
  );
};

