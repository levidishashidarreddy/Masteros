import React from 'react';

const QRModal = ({ isOpen, onClose, content, title = 'Scan with Phone' }) => {
  if (!isOpen || !content) return null;

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=10&data=${encodeURIComponent(content)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in select-none">
      <div onClick={onClose} className="fixed inset-0 bg-black/80 backdrop-blur-sm" />

      <div 
        className="relative bg-[#0D0D14] border border-white/10 rounded-3xl p-6 max-w-sm w-full text-center space-y-5 z-10 shadow-2xl animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <div className="flex items-center gap-2 text-left">
            <span className="material-symbols-outlined text-primary text-xl">qr_code_2</span>
            <div>
              <h3 className="font-space-grotesk text-sm font-bold text-white uppercase">{title}</h3>
              <p className="text-[11px] text-zinc-400">Scan to open on your camera or phone</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>

        {/* QR Code Container */}
        <div className="p-4 bg-white rounded-2xl inline-block shadow-lg border border-white/20">
          <img
            src={qrUrl}
            alt="QR Code"
            className="w-48 h-48 mx-auto object-contain"
          />
        </div>

        {/* Content Snippet */}
        <div className="bg-[#111118] border border-white/5 p-3 rounded-xl text-left space-y-1">
          <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Content</span>
          <p className="text-xs text-zinc-300 font-mono line-clamp-2 break-all">{content}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-3 pt-1">
          <button
            onClick={handleCopy}
            className="flex-1 py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white flex items-center justify-center gap-1.5 cursor-pointer transition-all"
          >
            <span className="material-symbols-outlined text-sm">content_copy</span>
            Copy Content
          </button>
          <button
            onClick={onClose}
            className="py-2 px-5 rounded-xl bg-primary text-black font-space-grotesk text-xs font-bold uppercase tracking-wider cursor-pointer transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default QRModal;
