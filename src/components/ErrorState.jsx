import React from 'react';
import Button from './Button';

const ErrorState = ({ 
  title = 'Something went wrong', 
  description = 'We encountered an error loading this section. Please check your connection and try again.', 
  onRetry 
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 bg-[#1B0F14]/40 border border-red-500/10 backdrop-blur-xl rounded-2xl space-y-5 animate-fade-in py-12 max-w-lg mx-auto">
      {/* Premium Minimal Error Animation */}
      <div className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-red-500/5 border border-red-500/10 text-red-400">
        <span className="material-symbols-outlined text-3xl animate-bounce">
          warning
        </span>
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-red-400 animate-ping"></span>
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-red-400"></span>
      </div>

      <div className="space-y-2">
        <h4 className="text-base font-bold text-red-200 tracking-tight flex items-center justify-center gap-2">
          <span>🚧</span> {title}
        </h4>
        <p className="text-xs text-on-surface-variant max-w-xs mx-auto leading-relaxed">{description}</p>
      </div>

      {onRetry && (
        <Button 
          variant="secondary" 
          onClick={onRetry}
          className="text-[11px] px-5 py-2 font-bold uppercase tracking-wider border-red-500/20 hover:border-red-500/40 text-red-300 hover:bg-red-500/5"
        >
          Retry
        </Button>
      )}
    </div>
  );
};

export default ErrorState;
