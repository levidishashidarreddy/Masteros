import React from 'react';

const StatsCard = ({
  title,
  value,
  unit = '',
  icon = 'bolt',
  progress = 0,
  subtext = '',
  colorTheme = 'primary'
}) => {
  const getThemeClass = () => {
    switch (colorTheme) {
      case 'secondary':
        return {
          text: 'text-secondary',
          bg: 'bg-secondary',
          border: 'group-hover:border-secondary/15'
        };
      default: // primary
        return {
          text: 'text-primary',
          bg: 'bg-primary',
          border: 'group-hover:border-primary/15'
        };
    }
  };

  const theme = getThemeClass();

  return (
    <div className={`bg-[#111118] border border-white/5 p-6 rounded-xl relative overflow-hidden group hover:-translate-y-1 hover:shadow-black/50 transition-all duration-300 ${theme.border}`}>
      
      {/* Floating background icon */}
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity text-white">
        <span className="material-symbols-outlined text-4xl">{icon}</span>
      </div>

      <p className="font-label-sm text-on-surface-variant uppercase mb-2 text-xs font-semibold tracking-wider">
        {title}
      </p>
      
      <div className="flex items-baseline gap-2">
        <h3 className="text-3xl font-bold tracking-tight text-white font-display-lg">
          {value}
        </h3>
        {unit && <span className="text-sm text-on-surface-variant font-medium">{unit}</span>}
      </div>

      {progress > 0 ? (
        <div className="mt-4 h-1 w-full bg-[#08080C] rounded-full overflow-hidden">
          <div
            className={`h-full ${theme.bg} transition-all duration-1000`}
            style={{ width: `${progress}%` }}
          />
        </div>
      ) : (
        subtext && (
          <div className="mt-3 flex items-center gap-1.5">
            <span className={`text-[11px] font-bold ${theme.text}`}>{subtext}</span>
          </div>
        )
      )}
    </div>
  );
};

export default StatsCard;
