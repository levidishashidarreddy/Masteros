import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { getCrossDeviceBaseUrl, formatCrossDevicePayload } from '../utils/urlUtils';

const QRModal = ({ isOpen, onClose, content, title = 'Scan with Phone' }) => {
  const [qrUrl, setQrUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [finalPayload, setFinalPayload] = useState('');

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      setError(null);

      // Determine the cross-device payload (guaranteed no localhost)
      const rawPayload = content || getCrossDeviceBaseUrl();
      const payload = formatCrossDevicePayload(rawPayload);
      setFinalPayload(payload);

      // Optimize error correction level based on payload length
      const ecc = payload.length > 220 ? 'L' : 'M';

      QRCode.toDataURL(payload, {
        width: 360,
        margin: 4, // ISO standard quiet zone for phone cameras
        color: {
          dark: '#000000',
          light: '#ffffff'
        },
        errorCorrectionLevel: ecc
      })
        .then(url => {
          setQrUrl(url);
          setLoading(false);
        })
        .catch(err => {
          console.error('QR generation error:', err);
          setError('Failed to generate QR code.');
          setLoading(false);
        });
    } else {
      setQrUrl('');
      setFinalPayload('');
      setLoading(false);
    }
  }, [isOpen, content]);

  if (!isOpen) return null;

  const handleCopy = () => {
    if (!finalPayload) return;
    navigator.clipboard.writeText(finalPayload);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!qrUrl) return;
    const link = document.createElement('a');
    link.href = qrUrl;
    link.download = `${(title || 'qr-code').toLowerCase().replace(/[^a-z0-9]/g, '-')}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isWebUrl = finalPayload.startsWith('http://') || finalPayload.startsWith('https://');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in select-none">
      <div onClick={onClose} className="fixed inset-0 bg-black/80 backdrop-blur-md" />

      <div 
        className="relative bg-[#0D0D14] border border-purple-500/20 rounded-3xl p-6 max-w-sm w-full text-center space-y-5 z-10 shadow-2xl animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2 text-left">
            <span className="material-symbols-outlined text-purple-400 text-xl">qr_code_2</span>
            <div>
              <h3 className="font-space-grotesk text-sm font-bold text-white uppercase tracking-wide">{title}</h3>
              <p className="text-[11px] text-zinc-400">Cross-Device Connection QR</p>
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
        <div className="p-4 bg-white rounded-2xl inline-block shadow-2xl border border-white/20 min-w-[216px] min-h-[216px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center p-8 gap-2 text-zinc-600 h-48 w-48">
              <span className="material-symbols-outlined animate-spin text-2xl">sync</span>
              <span className="text-xs font-medium">Generating QR...</span>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center p-6 gap-2 text-red-500 text-center h-48 w-48">
              <span className="material-symbols-outlined text-3xl">error_outline</span>
              <span className="text-xs font-medium">{error}</span>
            </div>
          ) : qrUrl ? (
            <img
              src={qrUrl}
              alt="Cross-Device QR Code"
              className="w-48 h-48 mx-auto object-contain rounded-lg"
            />
          ) : null}
        </div>

        {/* Mobile Connection Tip */}
        <div className="bg-purple-950/30 border border-purple-500/20 p-3 rounded-xl text-left space-y-1">
          <div className="flex items-center gap-1.5 text-purple-300 font-bold text-[11px]">
            <span className="material-symbols-outlined text-xs text-purple-400">wifi</span>
            <span>Mobile Connection Tip</span>
          </div>
          <p className="text-[11px] text-zinc-300 leading-tight">
            Make sure your phone and computer are connected to the same Wi-Fi.
          </p>
        </div>

        {/* Content Payload */}
        {finalPayload && (
          <div className="bg-[#111118] border border-white/5 p-3 rounded-xl text-left space-y-1">
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Content Payload</span>
            <p className="text-xs text-zinc-300 font-mono line-clamp-2 break-all">{finalPayload}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-center gap-2 pt-1">
          <button
            onClick={handleCopy}
            disabled={!finalPayload}
            className="flex-1 py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-50 border border-white/10 text-xs font-semibold text-white flex items-center justify-center gap-1.5 cursor-pointer transition-all"
          >
            <span className="material-symbols-outlined text-sm">
              {copied ? 'check' : 'content_copy'}
            </span>
            {copied ? 'Copied!' : 'Copy Content'}
          </button>

          {qrUrl && (
            <button
              onClick={handleDownload}
              className="py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white flex items-center justify-center gap-1.5 cursor-pointer transition-all"
              title="Download QR Image"
            >
              <span className="material-symbols-outlined text-sm">download</span>
              Download
            </button>
          )}

          <button
            onClick={onClose}
            className="py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-space-grotesk text-xs font-bold uppercase tracking-wider cursor-pointer transition-all shadow-lg shadow-purple-600/20"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default QRModal;
