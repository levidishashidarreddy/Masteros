import React, { useState, useEffect } from 'react';
import Modal from './Modal';

const PWAInstallBanner = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showBanner, setShowBanner] = useState(false);
  const [showIosModal, setShowIosModal] = useState(false);
  const [isIos, setIsIos] = useState(false);

  useEffect(() => {
    // Check if app is already running in standalone mode (installed)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    if (isStandalone) return;

    // Check dismissal timestamp
    const dismissedUntil = localStorage.getItem('pwa_dismissed_until');
    if (dismissedUntil && Date.now() < parseInt(dismissedUntil, 10)) {
      return;
    }

    // Detect iOS
    const ua = window.navigator.userAgent;
    const isIosDevice = /iphone|ipad|ipod/i.test(ua);
    setIsIos(isIosDevice);

    if (isIosDevice && !isStandalone) {
      setShowBanner(true);
    }

    // Handle standard browser install prompt
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleDismiss = () => {
    setShowBanner(false);
    // Dismiss for 7 days
    const next7Days = Date.now() + 7 * 24 * 60 * 60 * 1000;
    localStorage.setItem('pwa_dismissed_until', next7Days.toString());
  };

  const handleInstallClick = async () => {
    if (isIos) {
      setShowIosModal(true);
      return;
    }

    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowBanner(false);
    }
    setDeferredPrompt(null);
  };

  if (!showBanner) return null;

  return (
    <>
      {/* Subtle Bottom Card Install Suggestion */}
      <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-50 animate-slide-up select-none">
        <div className="bg-[#111118]/95 border border-primary/40 backdrop-blur-md rounded-2xl p-4 shadow-[0_0_25px_rgba(139,92,246,0.3)] space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/40 text-primary flex items-center justify-center text-xl shrink-0">
                📱
              </div>
              <div>
                <h4 className="text-xs font-bold text-white font-space-grotesk">Get the full experience</h4>
                <p className="text-[11px] text-zinc-400 mt-0.5 leading-snug">
                  Install MasterOS for quick access from your home screen.
                </p>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="text-zinc-500 hover:text-zinc-300 p-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          </div>

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              onClick={handleDismiss}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              Not now
            </button>
            <button
              onClick={handleInstallClick}
              className="px-4 py-1.5 rounded-xl bg-primary text-black text-xs font-bold uppercase tracking-wider shadow-[0_0_10px_rgba(139,92,246,0.5)] hover:opacity-90 transition-all cursor-pointer"
            >
              Install App
            </button>
          </div>
        </div>
      </div>

      {/* iOS Add to Home Screen Instructions Modal */}
      {showIosModal && (
        <Modal
          isOpen={showIosModal}
          onClose={() => setShowIosModal(false)}
          title="ADD TO HOME SCREEN"
          maxWidth="max-w-xs"
        >
          <div className="space-y-4 text-center text-on-surface select-none">
            <div className="w-12 h-12 rounded-2xl bg-primary/20 text-primary border border-primary/40 flex items-center justify-center text-2xl mx-auto">
              📲
            </div>
            <div className="space-y-2 text-xs text-zinc-300 text-left">
              <p className="font-semibold text-white">To install MasterOS on iPhone or iPad:</p>
              <ol className="list-decimal list-inside space-y-1.5 text-zinc-400">
                <li>Tap the <strong className="text-white">Share</strong> button in Safari toolbar.</li>
                <li>Scroll down and tap <strong className="text-primary">Add to Home Screen</strong>.</li>
                <li>Tap <strong className="text-white">Add</strong> in top right.</li>
              </ol>
            </div>
            <button
              onClick={() => setShowIosModal(false)}
              className="w-full py-2 rounded-xl bg-white/10 text-white text-xs font-bold uppercase cursor-pointer"
            >
              Got it
            </button>
          </div>
        </Modal>
      )}
    </>
  );
};

export default PWAInstallBanner;
