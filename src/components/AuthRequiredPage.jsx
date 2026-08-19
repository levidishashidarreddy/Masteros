import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const AuthRequiredPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen bg-background text-on-surface radial-glow-bg select-none font-dm-sans">
      <Sidebar />

      <main className="flex-1 flex flex-col h-screen overflow-y-auto no-scrollbar relative z-10">
        <Header hideSearch hideStreak hideLogo />

        <div className="w-full flex-1 flex flex-col items-center justify-center p-6 animate-page-transition">
          <div className="w-full max-w-md bg-[#111118]/90 border border-primary/30 backdrop-blur-xl rounded-3xl p-8 text-center space-y-6 shadow-[0_0_40px_rgba(139,92,246,0.15)] relative overflow-hidden">
            
            {/* Ambient Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

            {/* Lock Icon */}
            <div className="w-16 h-16 rounded-2xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary text-3xl mx-auto shadow-[0_0_20px_rgba(139,92,246,0.3)] animate-float">
              🔒
            </div>

            <div className="space-y-2">
              <h2 className="font-space-grotesk text-2xl font-bold text-white tracking-tight">
                Sign in to continue
              </h2>
              <p className="text-zinc-400 text-xs md:text-sm leading-relaxed max-w-xs mx-auto">
                Friends and Communities are available with a MasterOS account.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={() => navigate('/auth', { state: { mode: 'signin' } })}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-primary text-black font-extrabold text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(139,92,246,0.4)] hover:opacity-95 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
              >
                Sign In
              </button>
              <button
                onClick={() => navigate('/auth', { state: { mode: 'signup' } })}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
              >
                Create Account
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AuthRequiredPage;
