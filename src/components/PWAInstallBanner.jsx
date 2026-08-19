import React, { useState, useEffect } from 'react';
import Modal from './Modal';

const PWAInstallBanner = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showBanner, setShowBanner] = useState(false);
  const [showIosModal, setShowIosModal] = useState(false);
  const [isIos, setIsIos] = useState(false);

  useEffect(() => {
    // 1. Check if app is already installed or running in standalone mode
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone ||
      localStorage.getItem('pwa_installed') === 'true';

    if (isStandalone) return;

    // 2. Check per-session dismissal
    const sessionDismissed = sessionStorage.getItem('pwa_prompt_dismissed_session') === 'true';
    if (sessionDismissed) return;

    // 3. Detect iOS
    const ua = window.navigator.userAgent;
    const isIosDevice = /iphone|ipad|ipod/i.test(ua) || (window.navigator.maxTouchPoints && window.navigator.maxTouchPoints > 2 && /macintosh/i.test(ua));
    setIsIos(isIosDevice);

    if (isIosDevice && !isStandalone) {
      setShowBanner(true);
    }

    // 4. Handle Android / Chrome beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowBanner(true);
    };

    // 5. Handle appinstalled event when user completes installation
    const handleAppInstalled = () => {
      localStorage.setItem('pwa_installed', 'true');
      setShowBanner(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleDismiss = () => {
    setShowBanner(false);
    // Dismiss for the current session only
    sessionStorage.setItem('pwa_prompt_dismissed_session', 'true');
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
      localStorage.setItem('pwa_installed', 'true');
      setShowBanner(false);
    }
    setDeferredPrompt(null);
  };

  if (!showBanner) return null;

  return (
    <>
      {/* Compact MasterOS-Styled Install Banner Card */}
      <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-sm z-50 animate-slide-up select-none safe-area-inset-bottom">
        <div className="bg-[#111118]/95 border border-primary/40 backdrop-blur-xl rounded-2xl p-4 shadow-[0_0_30px_rgba(139,92,246,0.25)] space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center shrink-0 p-1.5 shadow-[0_0_12px_rgba(139,92,246,0.3)]">
                <img src="/brand/masteros-logo.svg" alt="MasterOS Icon" className="w-full h-full object-contain" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white font-space-grotesk leading-tight">Install MasterOS</h4>
                <p className="text-[11px] text-zinc-400 mt-0.5 leading-snug">
                  Access your workspace faster from your home screen.
                </p>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="text-zinc-500 hover:text-zinc-300 p-1 cursor-pointer transition-colors"
              title="Dismiss for now"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          </div>

          <div className="flex items-center justify-end gap-2 pt-1 border-t border-white/5">
            <button
              onClick={handleDismiss}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
            >
              Not Now
            </button>
            <button
              onClick={handleInstallClick}
              className="px-4 py-1.5 rounded-xl bg-primary text-black text-xs font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(139,92,246,0.4)] hover:opacity-95 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
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
          title="INSTALL MASTEROS"
          maxWidth="max-w-xs"
        >
          <div className="space-y-4 text-center text-on-surface select-none">
            <div className="w-12 h-12 rounded-2xl bg-primary/20 text-primary border border-primary/40 flex items-center justify-center mx-auto shadow-[0_0_15px_rgba(139,92,246,0.3)]">
              <img src="/brand/masteros-logo.svg" alt="MasterOS Logo" className="w-7 h-7 object-contain" />
            </div>
            <div className="space-y-2.5 text-xs text-zinc-300 text-left bg-[#0D0D14] p-3.5 border border-white/10 rounded-xl">
              <p className="font-semibold text-white">To install MasterOS on iOS Safari:</p>
              <ol className="space-y-2 text-zinc-300">
                <li className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center text-[10px] shrink-0">1</span>
                  <span>Tap the <strong className="text-white flex-inline items-center gap-1">Share <span className="material-symbols-outlined text-sm text-primary align-sub">ios_share</span></strong> button</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center text-[10px] shrink-0">2</span>
                  <span>Scroll down the menu</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center text-[10px] shrink-0">3</span>
                  <span>Select <strong className="text-primary font-bold">Add to Home Screen</strong></span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center text-[10px] shrink-0">4</span>
                  <span>Tap <strong className="text-white font-bold">Add</strong> in the top right</span>
                </li>
              </ol>
            </div>
            <button
              onClick={() => setShowIosModal(false)}
              className="w-full py-2 rounded-xl bg-primary text-black text-xs font-bold uppercase tracking-wider shadow-[0_0_12px_rgba(139,92,246,0.4)] hover:opacity-90 transition-all cursor-pointer"
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

