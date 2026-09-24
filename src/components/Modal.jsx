import React, { useEffect } from 'react';

const Modal = ({ isOpen, onClose, title, children, maxWidth = 'max-w-lg' }) => {
  // Lock body scroll completely when modal is open to prevent background page bleeding
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 select-none">
      {/* Solid Backdrop Overlay — Isolated from modal scroll tree */}
      <div 
        className="fixed inset-0 bg-black/85 backdrop-blur-md animate-fade-in transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Shell */}
      <div
        className={`relative z-10 w-full ${maxWidth} bg-[#0D0D14] border border-white/10 rounded-3xl shadow-2xl flex flex-col max-h-[88vh] animate-scale-up overflow-hidden text-left`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Fixed Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4 bg-[#11111A] shrink-0">
          <h3 className="text-base sm:text-lg font-bold font-space-grotesk text-white flex items-center gap-2 truncate">
            {title}
          </h3>
          <button 
            onClick={onClose} 
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors flex items-center justify-center cursor-pointer shrink-0"
            aria-label="Close modal"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>

        {/* Independent Internal Scroll Area */}
        <div className="overflow-y-auto p-6 flex-1 text-zinc-200 space-y-4 no-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
