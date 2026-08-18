import React, { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ShaderBackground from '../components/ShaderBackground';
import MasterOSBrandLogo from '../components/MasterOSBrandLogo';
import Modal from '../components/Modal';
import { TaskContext } from '../context/TaskContext';

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const targetDestination = location.state?.from?.pathname || '/dashboard';

  const {
    loginWithGoogle,
    loginWithEmail,
    registerWithEmail,
    sendResetPasswordEmail,
    loginAsGuest
  } = useContext(TaskContext);

  const [authMode, setAuthMode] = useState('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Password Reset Modal State
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    setSuccessMsg('');
    try {
      await loginWithGoogle();
      navigate(targetDestination, { replace: true });
    } catch (err) {
      console.error("Google Sign-In Error:", err);
      let friendlyMessage = 'Authentication failed. Please try again.';
      if (err.code === 'auth/popup-blocked') {
        friendlyMessage = 'Sign-in popup was blocked by your browser. Please enable popups and try again.';
      } else if (err.code === 'auth/popup-closed-by-user') {
        friendlyMessage = 'Sign-in window was closed before completion.';
      } else if (err.message) {
        friendlyMessage = err.message;
      }
      setError(friendlyMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuthSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      if (authMode === 'signin') {
        await loginWithEmail(email, password);
        navigate(targetDestination, { replace: true });
      } else {
        await registerWithEmail(email, password, fullName);
        setSuccessMsg('Account created successfully! Redirecting...');
        setTimeout(() => navigate(targetDestination, { replace: true }), 1000);
      }
    } catch (err) {
      console.error("Email Auth Error:", err);
      let msg = 'Authentication failed. Please try again.';
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        msg = 'Invalid email or password. Please check your credentials.';
      } else if (err.code === 'auth/email-already-in-use') {
        msg = 'An account with this email already exists. Try signing in with Google or resetting your password.';
      } else if (err.code === 'auth/weak-password') {
        msg = 'Password should be at least 6 characters long.';
      } else if (err.message) {
        msg = err.message;
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSendResetLink = async (e) => {
    e.preventDefault();
    if (!resetEmail.trim()) return;

    setResetLoading(true);
    try {
      await sendResetPasswordEmail(resetEmail);
      setResetSuccess(true);
    } catch (err) {
      console.error("Password reset error:", err);
      setResetSuccess(true); // Always display success for privacy
    } finally {
      setResetLoading(false);
    }
  };

  const handleGuestContinue = () => {
    loginAsGuest();
    navigate('/dashboard');
  };

  return (
    <div className="relative min-h-screen text-on-surface select-none overflow-hidden radial-glow-bg font-dm-sans">
      <main className="flex min-h-screen w-full flex-col md:flex-row">
        
        {/* LEFT SIDE: BRANDING SECTION */}
        <section className="relative hidden md:flex md:w-1/2 lg:w-[55%] flex-col justify-between p-16 overflow-hidden">
          <ShaderBackground type="auth" />

          <div className="relative z-10 flex flex-col h-full justify-between animate-fade-in">
            <MasterOSBrandLogo
              size={36}
              showText
              onClick={() => { if (window.location.pathname !== '/dashboard') navigate('/dashboard'); }}
            />

            <div className="max-w-xl mt-auto mb-16 space-y-6">
              <h1 className="font-display-lg text-[44px] leading-[1.1] text-white font-extrabold font-space-grotesk">
                Build your future.<br />
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Track your velocity.</span>
              </h1>
              <p className="font-body-lg text-on-surface-variant text-base leading-relaxed">
                Unlock your workspace nodes. Connect roadmaps, tasks, habits, and progress into a beautifully coordinated operating system.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 w-full max-w-xl">
              <div className="bg-[#111118]/80 border border-white/5 p-5 rounded-xl animate-float">
                <div className="flex items-center gap-2 mb-2 text-primary">
                  <span className="material-symbols-outlined text-[18px]">target</span>
                  <span className="font-label-sm text-[10px] uppercase tracking-widest font-bold">Goals</span>
                </div>
                <p className="text-2xl font-bold text-white font-space-grotesk">50K+</p>
                <p className="text-[10px] text-on-surface-variant font-medium mt-1">Objectives achieved</p>
              </div>

              <div className="bg-[#111118]/80 border border-white/5 p-5 rounded-xl animate-float-delay">
                <div className="flex items-center gap-2 mb-2 text-secondary">
                  <span className="material-symbols-outlined text-[18px]">task_alt</span>
                  <span className="font-label-sm text-[10px] uppercase tracking-widest font-bold">Tasks</span>
                </div>
                <p className="text-2xl font-bold text-white font-space-grotesk">1M+</p>
                <p className="text-[10px] text-on-surface-variant font-medium mt-1">Tasks resolved</p>
              </div>
            </div>
          </div>
          
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-40 z-[1]" />
        </section>

        {/* RIGHT SIDE: LOGIN / REGISTER CARD */}
        <section className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 lg:p-16 relative bg-background">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-primary/5 rounded-full blur-[80px] pointer-events-none" />

          {/* Mobile Logo */}
          <div className="md:hidden absolute top-8 left-1/2 -translate-x-1/2">
            <MasterOSBrandLogo
              size={32}
              showText
              onClick={() => { if (window.location.pathname !== '/dashboard') navigate('/dashboard'); }}
            />
          </div>

          <div className="w-full max-w-[420px] animate-fade-in relative z-10 my-auto">
            <div className="p-7 md:p-8 rounded-2xl border border-white/10 bg-[#111118]/90 backdrop-blur-xl shadow-2xl space-y-6">
              
              <div className="text-center">
                <h2 className="font-space-grotesk text-white text-2xl font-bold">Welcome to MasterOS</h2>
                <p className="text-on-surface-variant text-xs mt-1">The operating system for ambitious builders.</p>
              </div>

              {/* Error / Success Feedback */}
              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/25 rounded-xl text-center text-xs text-red-400 font-semibold animate-fade-in">
                  {error}
                </div>
              )}
              {successMsg && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/25 rounded-xl text-center text-xs text-emerald-400 font-semibold animate-fade-in">
                  {successMsg}
                </div>
              )}

              {/* PRIMARY: Continue with Google */}
              <button 
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 bg-white text-black py-3 px-5 rounded-xl font-bold hover:scale-[1.01] active:scale-95 transition-all duration-200 shadow-md shadow-white/5 text-xs uppercase tracking-wider cursor-pointer disabled:opacity-50"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                <span>Continue with Google</span>
              </button>

              {/* DIVIDER */}
              <div className="relative flex items-center justify-center">
                <div className="border-t border-white/10 w-full" />
                <span className="bg-[#111118] px-3 text-[10px] uppercase font-bold tracking-widest text-zinc-500 shrink-0">
                  OR EMAIL
                </span>
                <div className="border-t border-white/10 w-full" />
              </div>

              {/* Sign In / Register Tab Toggle */}
              <div className="flex p-1 bg-[#0D0D14] border border-white/10 rounded-xl">
                <button
                  type="button"
                  onClick={() => { setAuthMode('signin'); setError(''); }}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    authMode === 'signin'
                      ? 'bg-primary text-black shadow-sm'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => { setAuthMode('signup'); setError(''); }}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    authMode === 'signup'
                      ? 'bg-primary text-black shadow-sm'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Create Account
                </button>
              </div>

              {/* Email / Password Form */}
              <form onSubmit={handleEmailAuthSubmit} className="space-y-4">
                {authMode === 'signup' && (
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-zinc-400 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Your full name"
                      className="w-full bg-[#0D0D14] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-primary"
                      required
                    />
                  </div>
                )}

                <div>
                  <label className="block text-[10px] font-bold uppercase text-zinc-400 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-[#0D0D14] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-primary"
                    required
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[10px] font-bold uppercase text-zinc-400">Password</label>
                    {authMode === 'signin' && (
                      <button
                        type="button"
                        onClick={() => { setResetEmail(email); setIsResetModalOpen(true); }}
                        className="text-[10px] font-bold text-primary hover:underline cursor-pointer"
                      >
                        Forgot Password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-[#0D0D14] border border-white/10 rounded-xl pl-3.5 pr-9 py-2.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-primary"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
                    >
                      <span className="material-symbols-outlined text-sm">
                        {showPassword ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 bg-primary/20 border border-primary/40 text-primary hover:bg-primary/30 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer disabled:opacity-50"
                >
                  {loading ? 'Processing...' : authMode === 'signin' ? 'Sign In with Email' : 'Create Account'}
                </button>
              </form>

              {/* GUEST DEMO MODE */}
              <div className="pt-2 border-t border-white/5 text-center">
                <button
                  type="button"
                  onClick={handleGuestContinue}
                  className="w-full py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-zinc-400 hover:text-white text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>Continue as Guest</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </div>

            </div>

            <p className="mt-4 text-center text-[10px] text-zinc-500">
              By continuing, you agree to MasterOS Terms and Privacy Policy.
            </p>
          </div>
        </section>
      </main>

      {/* Password Reset Modal */}
      {isResetModalOpen && (
        <Modal
          isOpen={isResetModalOpen}
          onClose={() => { setIsResetModalOpen(false); setResetSuccess(false); }}
          title="RESET PASSWORD"
          maxWidth="max-w-xs"
        >
          <div className="space-y-4 py-1 text-xs select-none">
            {resetSuccess ? (
              <div className="text-center space-y-3 py-2">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center text-xl mx-auto">
                  ✓
                </div>
                <p className="text-zinc-300">
                  Password reset link sent! Check your inbox to create a new password.
                </p>
                <button
                  onClick={() => { setIsResetModalOpen(false); setResetSuccess(false); }}
                  className="w-full py-2 bg-primary text-black font-bold text-xs uppercase rounded-xl"
                >
                  Back to Sign In
                </button>
              </div>
            ) : (
              <form onSubmit={handleSendResetLink} className="space-y-3">
                <p className="text-zinc-400 leading-relaxed">
                  Enter your email address and we'll send you a password reset link.
                </p>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-zinc-400 mb-1">Email</label>
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-[#0D0D14] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-primary"
                    required
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsResetModalOpen(false)}
                    className="px-3 py-1.5 rounded-xl text-zinc-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={resetLoading}
                    className="px-4 py-1.5 rounded-xl bg-primary text-black font-bold uppercase"
                  >
                    {resetLoading ? 'Sending...' : 'Send Link'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </Modal>
      )}

    </div>
  );
};

export default Auth;
