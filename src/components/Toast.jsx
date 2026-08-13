import React, { useEffect } from 'react';

const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      if (onClose) onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  const isSuccess = type === 'success';
  const isError = type === 'error';

  return (
    <div className="fixed top-5 right-5 z-[200] max-w-sm w-auto animate-fade-in pointer-events-auto select-none">
      <div 
        className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-2xl backdrop-blur-md ${
          isSuccess
            ? 'bg-[#111118]/95 border-[#8B5CF6]/40 text-white shadow-[0_0_20px_rgba(139,92,246,0.2)]'
            : isError
            ? 'bg-[#111118]/95 border-red-500/40 text-white shadow-[0_0_20px_rgba(239,68,68,0.2)]'
            : 'bg-[#111118]/95 border-white/10 text-white shadow-xl'
        }`}
      >
        <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
          isSuccess
            ? 'bg-[#8B5CF6]/20 text-[#A78BFA] border border-[#8B5CF6]/30'
            : isError
            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
            : 'bg-white/10 text-zinc-300 border border-white/10'
        }`}>
          <span className="material-symbols-outlined text-[18px]">
            {isSuccess ? 'check_circle' : isError ? 'error' : 'info'}
          </span>
        </div>
        <div className="text-xs font-semibold text-zinc-100 pr-2 leading-snug">
          {message}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="ml-auto text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-white/5 cursor-pointer shrink-0"
        >
          <span className="material-symbols-outlined text-sm">close</span>
        </button>
      </div>
    </div>
  );
};

export default Toast;
