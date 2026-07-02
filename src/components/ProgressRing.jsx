import React from 'react';

const ProgressRing = ({ percentage = 80, label = '', size = 128, strokeWidth = 8, color = 'text-primary' }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const getGlowFilter = () => {
    if (color.includes('primary')) return 'drop-shadow(0 0 8px rgba(139, 92, 246, 0.4))';
    if (color.includes('secondary')) return 'drop-shadow(0 0 8px rgba(99, 102, 241, 0.4))';
    return '';
  };

  return (
    <div className="flex flex-col items-center gap-4 animate-float">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg className="w-full h-full transform -rotate-90">
          {/* Track Circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            fill="transparent"
            r={radius}
            stroke="rgba(255, 255, 255, 0.03)"
            strokeWidth={strokeWidth}
          />
          {/* Progress Circle */}
          <circle
            className={`${color} transition-all duration-1000 ease-out`}
            cx={size / 2}
            cy={size / 2}
            fill="transparent"
            r={radius}
            stroke="currentColor"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            style={{ filter: getGlowFilter() }}
          />
        </svg>
        <span className="absolute text-2xl font-bold text-white font-display-lg">{percentage}%</span>
      </div>
      {label && (
        <span className="font-label-sm text-on-surface-variant uppercase tracking-widest text-xs font-semibold">
          {label}
        </span>
      )}
    </div>
  );
};

export default ProgressRing;
