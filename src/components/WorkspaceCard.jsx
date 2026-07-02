import React from 'react';
import { Link } from 'react-router-dom';

const WorkspaceCard = ({
  id,
  title,
  description,
  tag,
  progress = 0,
  streak = 0,
  isPublic = false,
  tasksLeft = 0,
  totalTasks = 10,
  icon = 'terminal',
  bannerImage = '',
  colorTheme = 'primary'
}) => {
  const getThemeColor = () => {
    switch (colorTheme) {
      case 'secondary':
        return {
          text: 'text-secondary',
          bg: 'bg-secondary',
          glow: 'group-hover:border-secondary/15',
          lightBg: 'bg-secondary/5',
          lightBorder: 'border-secondary/10',
          gradient: 'from-secondary/5 to-transparent'
        };
      case 'tertiary':
        return {
          text: 'text-tertiary',
          bg: 'bg-tertiary',
          glow: 'group-hover:border-tertiary/15',
          lightBg: 'bg-tertiary/5',
          lightBorder: 'border-tertiary/10',
          gradient: 'from-tertiary/5 to-transparent'
        };
      default: // primary
        return {
          text: 'text-primary',
          bg: 'bg-primary',
          glow: 'group-hover:border-primary/15',
          lightBg: 'bg-primary/5',
          lightBorder: 'border-primary/10',
          gradient: 'from-primary/5 to-transparent'
        };
    }
  };

  const theme = getThemeColor();

  return (
    <div className={`group relative bg-[#111118] rounded-xl border border-white/5 overflow-hidden hover:-translate-y-1 transition-all duration-300 flex flex-col h-full shadow-md hover:shadow-black/50 ${theme.glow}`}>
      
      {/* Banner portion if bannerImage is provided */}
      {bannerImage && (
        <div className="h-20 w-full relative overflow-hidden border-b border-white/5">
          <div className={`absolute inset-0 bg-gradient-to-br ${theme.gradient}`}></div>
          <div
            className="absolute inset-0 opacity-15 group-hover:scale-105 group-hover:opacity-25 transition-all duration-500 bg-cover bg-center"
            style={{ backgroundImage: `url('${bannerImage}')` }}
          />
        </div>
      )}

      <div className={`p-6 flex-1 flex flex-col justify-between ${bannerImage ? 'pt-4' : ''}`}>
        <div>
          {/* Header row with Icon and status pills */}
          <div className="flex justify-between items-start mb-4">
            <div className={`w-9 h-9 rounded-lg bg-[#0D0D14] flex items-center justify-center border border-white/5 relative z-10 ${bannerImage ? '-mt-9' : ''}`}>
              <span className={`material-symbols-outlined text-[18px] ${theme.text}`} style={{ fontVariationSettings: "'FILL' 1" }}>
                {icon}
              </span>
            </div>
            <div className="flex gap-2">
              <span className="bg-[#08080C] text-[9px] px-2 py-0.5 rounded text-on-surface-variant font-bold border border-white/5 uppercase tracking-wider">
                {isPublic ? 'Public' : 'Private'}
              </span>
              {streak > 0 && (
                <span className={`${theme.lightBg} ${theme.text} text-[9px] px-2 py-0.5 rounded font-bold border ${theme.lightBorder} flex items-center gap-0.5`}>
                  <span className="material-symbols-outlined text-[10px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    bolt
                  </span>
                  {streak}d
                </span>
              )}
            </div>
          </div>

          <Link to={`/workspaces/${id}`}>
            <h3 className="font-headline-md text-base text-white mb-2 group-hover:text-primary transition-colors font-bold leading-snug">
              {title}
            </h3>
          </Link>
          <p className="text-on-surface-variant text-[13px] mb-4 line-clamp-2 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Progress block */}
        <div className="space-y-2 mt-auto">
          <div className="flex justify-between text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold">
            <span>Progress</span>
            <span className={`${theme.text} font-bold`}>{progress}%</span>
          </div>
          <div className="h-1 bg-[#08080C] rounded-full overflow-hidden">
            <div
              className={`h-full ${theme.bg} transition-all duration-1000`}
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5 text-on-surface-variant text-[11px]">
            <div className="flex items-center gap-1.5 font-medium">
              <span className="material-symbols-outlined text-[14px]">task_alt</span>
              <span>{totalTasks - tasksLeft}/{totalTasks} Tasks</span>
            </div>
            <span className="text-[9px] font-bold text-on-surface-variant tracking-wider uppercase">
              {tag}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkspaceCard;
