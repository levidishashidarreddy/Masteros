import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ShaderBackground from '../components/ShaderBackground';
import { auth, db, googleProvider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const Auth = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');


  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Check if user exists in Firestore
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('isOnboarded', 'true');
        navigate('/dashboard');
      } else {
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('isOnboarded', 'false');
        navigate('/onboarding');
      }
    } catch (err) {
      console.error("Firebase Auth Error Debug Log:", err);
      console.error("Firebase Error Code:", err.code);
      console.error("Firebase Error Message:", err.message);
      
      let friendlyMessage = 'Authentication failed. Please try again.';
      if (err.code === 'auth/popup-blocked') {
        friendlyMessage = 'Sign-in popup was blocked by your browser. Please enable popups for this site and try again.';
      } else if (err.code === 'auth/popup-closed-by-user') {
        friendlyMessage = 'Sign-in window was closed before completion. Please try again.';
      } else if (err.code === 'auth/cancelled-popup-request') {
        friendlyMessage = 'Sign-in request was cancelled. Please try again.';
      } else if (err.code === 'auth/network-request-failed') {
        friendlyMessage = 'A network error occurred. Please check your internet connection and try again.';
      } else if (err.message) {
        friendlyMessage = err.message;
      }
      setError(friendlyMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen text-on-surface select-none overflow-hidden radial-glow-bg">
      <main className="flex min-h-screen w-full flex-col md:flex-row">
        
        {/* LEFT SIDE: BRANDING SECTION */}
        <section className="relative hidden md:flex md:w-1/2 lg:w-[55%] flex-col justify-between p-16 overflow-hidden">
          <ShaderBackground type="auth" />

          {/* Branding Content */}
          <div className="relative z-10 flex flex-col h-full justify-between animate-fade-in">
            {/* Logo */}
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => { if (window.location.pathname !== '/dashboard') navigate('/dashboard'); }}>
              <div className="w-10 h-10 bg-primary-container rounded-lg flex items-center justify-center text-primary shadow-[0_0_15px_rgba(139,92,246,0.25)] border border-primary/20">
                <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  dashboard_customize
                </span>
              </div>
              <span className="font-display-lg text-[22px] font-bold tracking-tight text-white">
                Master<span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">OS</span>
              </span>
            </div>

            {/* Headline */}
            <div className="max-w-xl mt-auto mb-16 space-y-6">
              <h1 className="font-display-lg text-[44px] leading-[1.1] text-white font-extrabold">
                Build your future.<br />
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Track your velocity.</span>
              </h1>
              <p className="font-body-lg text-on-surface-variant text-base leading-relaxed">
                Unlock your workspace nodes. Connect courses, tasks, habits, and OKRs into a beautifully coordinated operating system.
              </p>
            </div>

            {/* Stats Cards Bento Grid */}
            <div className="grid grid-cols-2 gap-4 w-full max-w-xl">
              <div className="bg-[#111118]/80 border border-white/5 p-5 rounded-xl animate-float">
                <div className="flex items-center gap-2 mb-2 text-primary">
                  <span className="material-symbols-outlined text-[18px]">target</span>
                  <span className="font-label-sm text-[10px] uppercase tracking-widest font-bold">Goals</span>
                </div>
                <p className="text-2xl font-bold text-white">50K+</p>
                <p className="text-[10px] text-on-surface-variant font-medium mt-1">Objectives achieved</p>
              </div>

              <div className="bg-[#111118]/80 border border-white/5 p-5 rounded-xl animate-float-delay">
                <div className="flex items-center gap-2 mb-2 text-secondary">
                  <span className="material-symbols-outlined text-[18px]">task_alt</span>
                  <span className="font-label-sm text-[10px] uppercase tracking-widest font-bold">Tasks</span>
                </div>
                <p className="text-2xl font-bold text-white">1M+</p>
                <p className="text-[10px] text-on-surface-variant font-medium mt-1">Tasks resolved</p>
              </div>
            </div>
          </div>
          
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-40 z-[1]"></div>
        </section>

        {/* RIGHT SIDE: LOGIN SECTION */}
        <section className="flex-1 flex flex-col items-center justify-center p-8 md:p-12 lg:p-20 relative bg-background">
          {/* Ambient center blur background */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-primary/5 rounded-full blur-[80px] pointer-events-none" />

          {/* Mobile Logo Only */}
          <div className="md:hidden absolute top-12 left-1/2 -translate-x-1/2 flex items-center gap-2" onClick={() => { if (window.location.pathname !== '/dashboard') navigate('/dashboard'); }}>
            <div className="w-8 h-8 bg-primary-container rounded-lg flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                dashboard_customize
              </span>
            </div>
            <span className="font-display-lg text-lg font-bold tracking-tight text-white">MasterOS</span>
          </div>

          <div className="w-full max-w-[420px] animate-fade-in relative z-10">
                        {/* Login Card */}
            <div className="p-8 rounded-2xl border border-white/5 bg-[#111118]/80 backdrop-blur-xl">
              <div className="text-center mb-8">
                <h2 className="font-display-lg text-white mb-2 text-2xl font-bold">Welcome back</h2>
                <p className="text-on-surface-variant text-sm font-medium">Continue your growth momentum</p>
              </div>

              {error && (
                <div className="mb-5 flex flex-col items-center gap-2.5 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-center animate-fade-in">
                  <div className="flex items-start gap-2.5 text-red-400 text-xs font-semibold leading-normal">
                    <span className="material-symbols-outlined text-[18px] shrink-0 mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>
                      error
                    </span>
                    <span>{error}</span>
                  </div>
                  <button 
                    type="button"
                    onClick={handleGoogleSignIn}
                    className="text-[10px] font-bold text-white uppercase tracking-widest bg-white/5 border border-white/10 hover:bg-white/10 px-3 py-1.5 rounded transition-all cursor-pointer mt-1"
                  >
                    Try Again
                  </button>
                </div>
              )}

              <div className="space-y-4">


                <button 
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 bg-white text-background py-3.5 px-6 rounded-lg font-bold hover:scale-[1.02] active:scale-95 transition-all duration-300 shadow-md shadow-white/5 font-label-md text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="w-5 h-5 border-2 border-background border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"></path>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                    </svg>
                  )}
                  {loading ? 'Connecting...' : 'Continue with Google'}
                </button>
              </div>              {/* Status footer widgets */}
              <div className="mt-8 pt-6 border-t border-white/5 grid grid-cols-3 gap-2">
                <div className="flex flex-col items-center text-center">
                  <span className="material-symbols-outlined text-primary mb-1.5 text-[18px]">
                    trending_up
                  </span>
                  <span className="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider">
                    Velocity
                  </span>
                </div>
                <div className="flex flex-col items-center text-center border-x border-white/5">
                  <span className="material-symbols-outlined text-primary mb-1.5 text-[18px]">
                    auto_awesome
                  </span>
                  <span className="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider">
                    AI Roadmap
                  </span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <span className="material-symbols-outlined text-primary mb-1.5 text-[18px]">
                    groups
                  </span>
                  <span className="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider">
                    Peers
                  </span>
                </div>
              </div>
            </div>

            {/* Legal Links */}
            <p className="mt-6 text-center text-[11px] text-on-surface-variant/50 max-w-[280px] mx-auto">
              By continuing, you agree to our{' '}
              <a className="text-on-surface hover:text-primary transition-colors underline decoration-white/5" href="#">Terms</a>{' '}
              and{' '}
              <a className="text-on-surface hover:text-primary transition-colors underline decoration-white/5" href="#">Privacy Policy</a>.
            </p>
          </div>

          {/* Footer */}
          <div className="absolute bottom-10 flex gap-6 text-[11px] text-on-surface-variant/40">
            <span>© 2024 MasterOS</span>
            <a className="hover:text-on-surface transition-colors" href="#">Help</a>
            <a className="hover:text-on-surface transition-colors" href="#">Terms</a>
          </div>
        </section>

      </main>
    </div>
  );
};

export default Auth;
