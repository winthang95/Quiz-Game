
import React from 'react';

interface HealthBarProps {
  current: number;
  max: number;
  label: string;
  color?: string;
}

const HealthBar: React.FC<HealthBarProps> = ({ current, max, label, color = "bg-red-500" }) => {
  const percentage = Math.max(0, (current / max) * 100);
  
  return (
    <div className="w-full max-w-md">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-bold uppercase tracking-wider">{label}</span>
        <span className="text-sm font-mono">{current}/{max} HP</span>
      </div>
      <div className="w-full bg-slate-800 rounded-full h-4 border-2 border-slate-700 overflow-hidden">
        <div 
          className={`h-full transition-all duration-500 ease-out ${color}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default HealthBar;
