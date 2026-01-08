
import React from 'react';
import { CasePriority } from '../types';

interface PriorityBadgeProps {
  priority: CasePriority;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
  const getStyles = () => {
    switch (priority) {
      case CasePriority.HIGH:
        return 'bg-red-50 text-red-600 border-red-100';
      case CasePriority.MEDIUM:
        return 'bg-amber-50 text-amber-600 border-amber-100';
      case CasePriority.LOW:
        return 'bg-blue-50 text-blue-600 border-blue-100';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  return (
    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${getStyles()}`}>
      {priority}
    </span>
  );
};
