import React from 'react';
import Button from './Button';

const EmptyState = ({ 
  icon = 'inbox', 
  title = 'Nothing here yet', 
  description = 'No items found matching this view.', 
  actionLabel, 
  onAction,
  illustrationType = 'default' 
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 bg-[#111118]/40 border border-white/[0.04] backdrop-blur-xl rounded-2xl space-y-5 animate-fade-in py-12 max-w-lg mx-auto">
      {/* Premium Minimal Animation/Illustration */}
      <div className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/5 border border-primary/10 text-primary">
        <span className="material-symbols-outlined text-3xl animate-pulse">
          {icon}
        </span>
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-secondary animate-ping"></span>
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-secondary"></span>
      </div>

      <div className="space-y-2">
        <h4 className="text-base font-bold text-white tracking-tight">{title}</h4>
        <p className="text-xs text-on-surface-variant max-w-xs mx-auto leading-relaxed">{description}</p>
      </div>

      {actionLabel && onAction && (
        <Button 
          variant="primary" 
          onClick={onAction}
          className="text-[11px] px-5 py-2 font-bold uppercase tracking-wider hover:scale-105 transition-transform"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
