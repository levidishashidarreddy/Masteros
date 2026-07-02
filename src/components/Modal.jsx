import React, { useEffect } from 'react';

const Modal = ({ isOpen, onClose, title, children }) => {
  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto">
      {/* Overlay backdrop with blur */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-md animate-modal-backdrop"
        onClick={onClose}
      />

      {/* Modal box — scrollable, max 90vh */}
      <div
        className="relative glass-panel rounded-2xl w-full max-w-lg border border-white/10 z-10 animate-modal-content shadow-2xl bg-[#121212]/90 flex flex-col my-auto"
        style={{ maxHeight: '90vh' }}
      >
        {/* Sticky header — always visible at top */}
        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-white/5 px-8 py-5 bg-[#121212]/95 backdrop-blur-sm rounded-t-2xl shrink-0">
          <h3 className="text-xl font-bold font-headline-md text-white flex items-center gap-2">
            {title}
          </h3>
          <button 
            onClick={onClose} 
            className="text-on-surface-variant hover:text-white transition-colors hover:bg-white/5 rounded-lg p-1 -mr-1"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Scrollable content area */}
        <div className="overflow-y-auto px-8 py-6 flex-1 no-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
