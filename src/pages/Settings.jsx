import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { TaskContext } from '../context/TaskContext';
import { AvatarImg, getAvatar, DEFAULT_AVATARS } from '../components/Avatar';
import Modal from '../components/Modal';

const SOCIAL_ICONS = [
  { key: 'github',    icon: 'fa-brands fa-github',    label: 'GitHub',      placeholder: 'https://github.com/username',     color: '#E2E8F0' },
  { key: 'linkedin',  icon: 'fa-brands fa-linkedin',  label: 'LinkedIn',    placeholder: 'https://linkedin.com/in/username', color: '#0A66C2' },
  { key: 'instagram', icon: 'fa-brands fa-instagram', label: 'Instagram',   placeholder: 'https://instagram.com/username',  color: '#E1306C' },
  { key: 'twitter',   icon: 'fa-brands fa-x-twitter', label: 'X / Twitter', placeholder: 'https://x.com/username',          color: '#E2E8F0' },
  { key: 'portfolio', icon: 'fa-solid fa-globe',      label: 'Portfolio',   placeholder: 'https://yoursite.com',            color: '#A78BFA' },
];

function Section({ title, icon, children }) {
  return (
    <div className="bg-[#111118] border border-white/5 rounded-2xl overflow-hidden">
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-white/5 bg-[#0D0D14]/40">
        <span className="material-symbols-outlined text-primary text-base">{icon}</span>
        <h3 className="text-[11px] font-black uppercase tracking-widest text-white">{title}</h3>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function FieldLabel({ children }) {
  return <label className="block text-[10px] uppercase font-bold text-on-surface-variant tracking-wider mb-1.5">{children}</label>;
}

function TextInput({ value, onChange, placeholder, disabled, id, type = 'text', maxLength }) {
  return (
    <input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      maxLength={maxLength}
      className={`w-full bg-[#0D0D14] border border-white/5 rounded-lg px-3.5 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/30 focus:outline-none focus:border-primary transition-colors ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    />
  );
}

function SaveBtn({ onClick, loading, label = 'Save' }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="flex items-center gap-2 px-5 py-2 bg-primary rounded-xl text-sm font-bold text-white hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed transition-all cursor-pointer shadow-[0_0_12px_rgba(139,92,246,0.25)]"
    >
      {loading ? (
        <>
          <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          Saving…
        </>
      ) : (
        <>
          <span className="material-symbols-outlined text-sm">save</span>
          {label}
        </>
      )}
    </button>
  );
}

const Settings = () => {
  const navigate = useNavigate();
  const {
    userProfile,
    setUserProfile,
    currentUser,
    userId,
    logout,
    submitFeedback,
    updateFeedbackStatus,
    feedbackReports,
    isAdmin,
    hasPasswordSet,
    hasGoogleConnected,
    linkPasswordToAccount,
    changeUserPassword
  } = useContext(TaskContext);

  // Profile fields
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');

  // Avatar state
  const [avatarMode, setAvatarMode] = useState('default');
  const [selectedAvatar, setSelectedAvatar] = useState('');
  const [avatarUrlInput, setAvatarUrlInput] = useState('');
  const [urlError, setUrlError] = useState('');

  // Social links
  const [socialLinks, setSocialLinks] = useState({ github: '', linkedin: '', instagram: '', twitter: '', portfolio: '' });

  // Save states
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingSocial, setSavingSocial] = useState(false);
  const [toast, setToast] = useState(null);
  const [logoutConfirm, setLogoutConfirm] = useState(false);

  // Feedback Form State
  const [feedbackType, setFeedbackType] = useState('problem');
  const [feedbackTitle, setFeedbackTitle] = useState('');
  const [feedbackDescription, setFeedbackDescription] = useState('');
  const [feedbackSection, setFeedbackSection] = useState('Roadmaps');
  const [feedbackSteps, setFeedbackSteps] = useState('');
  const [feedbackSeverity, setFeedbackSeverity] = useState('Normal');
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  // Password Setup / Change Modal State
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    if (!userProfile) return;
    setDisplayName(userProfile.fullName || '');
    setUsername(userProfile.username || '');
    setBio(userProfile.bio || '');
    setSocialLinks({
      github: userProfile.socialLinks?.github || '',
      linkedin: userProfile.socialLinks?.linkedin || '',
      instagram: userProfile.socialLinks?.instagram || '',
      twitter: userProfile.socialLinks?.twitter || '',
      portfolio: userProfile.socialLinks?.portfolio || '',
    });

    const saved = getAvatar(userProfile);
    if (DEFAULT_AVATARS.includes(saved)) {
      setAvatarMode('default');
      setSelectedAvatar(saved);
    } else if (saved && (saved.startsWith('http') || saved.startsWith('data:'))) {
      setAvatarMode('url');
      setAvatarUrlInput(saved);
      setSelectedAvatar('');
    } else {
      setAvatarMode('default');
      setSelectedAvatar(DEFAULT_AVATARS[0]);
    }
  }, [userProfile?.userId]);

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  const effectiveAvatar = avatarMode === 'url'
    ? (avatarUrlInput.trim() || DEFAULT_AVATARS[0])
    : (selectedAvatar || DEFAULT_AVATARS[0]);

  const validateUrl = url => {
    setUrlError('');
    if (!url) return true;
    try {
      const u = new URL(url);
      if (!['http:', 'https:'].includes(u.protocol)) {
        setUrlError('URL must start with http:// or https://');
        return false;
      }
      return true;
    } catch {
      setUrlError('Invalid URL format');
      return false;
    }
  };

  const handleSaveProfile = async () => {
    if (!currentUser || !userProfile) return;
    if (avatarMode === 'url' && !validateUrl(avatarUrlInput.trim())) return;

    setSavingProfile(true);
    try {
      const updatedData = {
        fullName: displayName.trim(),
        username: username.trim(),
        bio: bio.trim(),
        avatar: effectiveAvatar
      };
      await setUserProfile(updatedData);
      showToast('success', 'Profile updated successfully!');
    } catch (err) {
      console.error(err);
      showToast('error', 'Failed to update profile.');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSaveSocial = async () => {
    if (!currentUser || !userProfile) return;
    setSavingSocial(true);
    try {
      await setUserProfile({ socialLinks });
      showToast('success', 'Social links saved successfully!');
    } catch (err) {
      console.error(err);
      showToast('error', 'Failed to save social links.');
    } finally {
      setSavingSocial(false);
    }
  };

  const handleSubmitFeedbackForm = async (e) => {
    e.preventDefault();
    if (!feedbackTitle.trim() || !feedbackDescription.trim()) {
      showToast('error', 'Please fill out all required fields.');
      return;
    }

    setSubmittingFeedback(true);
    try {
      await submitFeedback({
        type: feedbackType,
        title: feedbackTitle,
        description: feedbackDescription,
        section: feedbackSection,
        stepsToReproduce: feedbackSteps,
        severity: feedbackSeverity
      });

      showToast('success', 'Thank you! Your feedback has been submitted.');
      setFeedbackTitle('');
      setFeedbackDescription('');
      setFeedbackSteps('');
    } catch (err) {
      console.error(err);
      showToast('error', 'Could not submit feedback.');
    } finally {
      setSubmittingFeedback(false);
    }
  };

  const handleSavePassword = async (e) => {
    e.preventDefault();
    if (newPasswordInput.length < 6) {
      setPasswordError('Password must be at least 6 characters.');
      return;
    }
    if (newPasswordInput !== confirmPasswordInput) {
      setPasswordError('Passwords do not match.');
      return;
    }

    setSavingPassword(true);
    setPasswordError('');
    try {
      if (hasPasswordSet) {
        await changeUserPassword(newPasswordInput);
        showToast('success', 'Password updated successfully!');
      } else {
        await linkPasswordToAccount(newPasswordInput);
        showToast('success', 'Password set up successfully! You can now log in with Email or Google.');
      }
      setIsPasswordModalOpen(false);
      setNewPasswordInput('');
      setConfirmPasswordInput('');
    } catch (err) {
      console.error("Password link/change error:", err);
      setPasswordError(err.message || 'Failed to save password.');
    } finally {
      setSavingPassword(false);
    }
  };

  const joinDate = userProfile?.createdAt
    ? new Date(userProfile.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    : 'Recently';

  return (
    <div className="flex h-screen overflow-hidden bg-background text-on-surface radial-glow-bg select-none font-dm-sans">
      <Sidebar />

      <main className="flex-1 h-full overflow-y-auto overflow-x-hidden scroll-smooth relative z-10">
        <Header hideSearch hideStreak hideLogo />

        <div className="max-w-3xl mx-auto px-5 pb-16 space-y-6 animate-page-transition">

          {/* Page title */}
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight font-space-grotesk">SETTINGS & SECURITY</h2>
            <p className="text-xs text-on-surface-variant mt-1">
              Manage profile, social links, authentication login methods, and support.
            </p>
          </div>

          {/* Toast */}
          {toast && (
            <div className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border text-xs font-bold animate-fade-in ${
              toast.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400'
                : 'bg-red-500/10 border-red-500/25 text-red-400'
            }`}>
              <span className="material-symbols-outlined text-sm">
                {toast.type === 'success' ? 'check_circle' : 'error'}
              </span>
              {toast.msg}
            </div>
          )}

          {/* PROFILE SECTION */}
          <Section title="Profile" icon="person">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 mb-6 pb-6 border-b border-white/5">
              <div className="shrink-0">
                <AvatarImg src={effectiveAvatar} sizeCls="w-20 h-20" iconCls="text-3xl" />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white mb-3">Profile Picture</p>
                <div className="flex gap-1 p-0.5 bg-[#0D0D14] border border-white/5 rounded-xl w-fit mb-4">
                  {[
                    { id: 'default', label: 'Default Avatars' },
                    { id: 'url',     label: 'Image URL'       },
                  ].map(m => (
                    <button
                      key={m.id}
                      onClick={() => setAvatarMode(m.id)}
                      className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                        avatarMode === m.id
                          ? 'bg-primary text-white shadow-sm'
                          : 'text-on-surface-variant hover:text-white'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>

                {avatarMode === 'default' && (
                  <div className="grid grid-cols-6 gap-2">
                    {DEFAULT_AVATARS.map((path, i) => (
                      <button
                        key={path}
                        title={`Avatar ${i + 1}`}
                        onClick={() => setSelectedAvatar(path)}
                        className={`rounded-full transition-all cursor-pointer ring-offset-2 ring-offset-[#0D0D14] ${
                          selectedAvatar === path
                            ? 'ring-2 ring-primary scale-110'
                            : 'opacity-70 hover:opacity-100 hover:scale-105'
                        }`}
                      >
                        <AvatarImg src={path} sizeCls="w-10 h-10" />
                      </button>
                    ))}
                  </div>
                )}

                {avatarMode === 'url' && (
                  <div className="space-y-1.5 w-full">
                    <input
                      type="url"
                      value={avatarUrlInput}
                      onChange={e => { setAvatarUrlInput(e.target.value); setUrlError(''); }}
                      onBlur={e => validateUrl(e.target.value.trim())}
                      placeholder="https://i.imgur.com/example.jpg"
                      className="w-full bg-[#0D0D14] border border-white/5 rounded-lg px-3.5 py-2.5 text-xs text-on-surface focus:outline-none focus:border-primary"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <FieldLabel>Display Name</FieldLabel>
                <TextInput
                  id="setting-name"
                  value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                  placeholder="Your full name"
                  maxLength={60}
                />
              </div>

              <div>
                <FieldLabel>Username</FieldLabel>
                <TextInput
                  id="setting-username"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="@username"
                  maxLength={30}
                />
              </div>

              <div>
                <FieldLabel>Bio ({bio.length}/160)</FieldLabel>
                <textarea
                  id="setting-bio"
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  placeholder="Tell peers something about yourself…"
                  rows={3}
                  maxLength={160}
                  className="w-full bg-[#0D0D14] border border-white/5 rounded-lg px-3.5 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary resize-none"
                />
              </div>

              <div className="flex justify-end pt-1">
                <SaveBtn onClick={handleSaveProfile} loading={savingProfile} label="Save Profile" />
              </div>
            </div>
          </Section>

          {/* ══════════════════ REQUIREMENT 3 & 4: SECURITY / LOGIN METHODS ═════════════════════════ */}
          <Section title="Security & Login Methods" icon="security">
            <div className="space-y-4">
              <p className="text-xs text-zinc-400 leading-relaxed">
                Manage authentication providers linked to your account. Multiple methods access the exact same profile & workspace data.
              </p>

              <div className="space-y-3">
                
                {/* 1. Google Authentication */}
                <div className="flex items-center justify-between p-4 bg-[#0D0D14] border border-white/5 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-lg">
                      🌐
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">Google Account</h4>
                      <p className="text-[11px] text-zinc-400 mt-0.5">
                        {hasGoogleConnected || currentUser?.email ? currentUser?.email : 'Google Authentication'}
                      </p>
                    </div>
                  </div>

                  <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
                    <span>✓ Connected</span>
                  </span>
                </div>

                {/* 2. Password Authentication */}
                <div className="flex items-center justify-between p-4 bg-[#0D0D14] border border-white/5 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-lg">
                      🔑
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">Password Authentication</h4>
                      <p className="text-[11px] text-zinc-400 mt-0.5">
                        {hasPasswordSet ? 'Password configured for email sign-in' : 'No password set (Optional)'}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => { setPasswordError(''); setIsPasswordModalOpen(true); }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      hasPasswordSet
                        ? 'bg-white/5 hover:bg-white/10 border border-white/10 text-white'
                        : 'bg-primary text-black font-extrabold uppercase shadow-[0_0_10px_rgba(139,92,246,0.3)]'
                    }`}
                  >
                    {hasPasswordSet ? 'Change Password' : '+ Set a Password'}
                  </button>
                </div>

                {/* 3. Passkey (Future) */}
                <div className="flex items-center justify-between p-4 bg-[#0D0D14] border border-white/5 rounded-xl opacity-60">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-lg">
                      📱
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">Passkey / Biometric</h4>
                      <p className="text-[11px] text-zinc-400 mt-0.5">Not configured</p>
                    </div>
                  </div>

                  <button
                    disabled
                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white/5 text-zinc-500 cursor-not-allowed"
                  >
                    Set Up Passkey
                  </button>
                </div>

              </div>
            </div>
          </Section>

          {/* SOCIAL LINKS */}
          <Section title="Social Links" icon="share">
            <div className="space-y-3">
              {SOCIAL_ICONS.map(({ key, icon, label, placeholder, color }) => (
                <div key={key} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/5 border border-white/5 shrink-0" style={{ color }}>
                    <i className={`${icon} text-sm`} />
                  </div>
                  <input
                    type="url"
                    value={socialLinks[key]}
                    onChange={e => setSocialLinks(prev => ({ ...prev, [key]: e.target.value }))}
                    placeholder={placeholder}
                    aria-label={label}
                    className="flex-1 bg-[#0D0D14] border border-white/5 rounded-lg px-3 py-2 text-xs text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-end mt-4">
              <SaveBtn onClick={handleSaveSocial} loading={savingSocial} label="Save Links" />
            </div>
          </Section>

          {/* FEEDBACK SECTION */}
          <Section title="Feedback & Support" icon="feedback">
            <form onSubmit={handleSubmitFeedbackForm} className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setFeedbackType('problem')}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-center cursor-pointer ${
                    feedbackType === 'problem' ? 'bg-rose-500/20 border-rose-500/40 text-rose-300' : 'bg-white/5 border-white/5 text-zinc-400'
                  }`}
                >
                  🐛 Bug Report
                </button>
                <button
                  type="button"
                  onClick={() => setFeedbackType('suggestion')}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-center cursor-pointer ${
                    feedbackType === 'suggestion' ? 'bg-amber-500/20 border-amber-500/40 text-amber-300' : 'bg-white/5 border-white/5 text-zinc-400'
                  }`}
                >
                  💡 Suggestion
                </button>
                <button
                  type="button"
                  onClick={() => setFeedbackType('feedback')}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-center cursor-pointer ${
                    feedbackType === 'feedback' ? 'bg-primary/20 border-primary/40 text-primary' : 'bg-white/5 border-white/5 text-zinc-400'
                  }`}
                >
                  💬 Feedback
                </button>
              </div>

              <TextInput
                value={feedbackTitle}
                onChange={e => setFeedbackTitle(e.target.value)}
                placeholder="Title / Summary"
              />

              <textarea
                value={feedbackDescription}
                onChange={e => setFeedbackDescription(e.target.value)}
                placeholder="Details & Description..."
                rows={3}
                className="w-full bg-[#0D0D14] border border-white/5 rounded-lg px-3.5 py-2 text-xs text-on-surface focus:outline-none focus:border-primary resize-none"
              />

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  disabled={submittingFeedback}
                  className="px-5 py-2 bg-primary text-black font-bold text-xs uppercase rounded-xl cursor-pointer"
                >
                  {submittingFeedback ? 'Submitting...' : 'Submit Report'}
                </button>
              </div>
            </form>
          </Section>

          {/* ADMIN MANAGEMENT PANEL */}
          {isAdmin && (
            <Section title="Admin Feedback Management" icon="admin_panel_settings">
              <div className="space-y-3 max-h-80 overflow-y-auto no-scrollbar">
                {feedbackReports.map((report) => (
                  <div key={report.id} className="p-3 bg-[#0D0D14] border border-white/10 rounded-xl space-y-2 text-xs">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-white">{report.title}</h4>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-primary/20 text-primary">
                        {report.status}
                      </span>
                    </div>
                    <p className="text-zinc-400 text-[11px]">{report.description}</p>
                    <div className="flex gap-2 pt-1">
                      {['VIEWED', 'IN PROGRESS', 'RESOLVED', 'CLOSED'].map((s) => (
                        <button
                          key={s}
                          onClick={() => updateFeedbackStatus(report.id, s)}
                          className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-white/5 hover:bg-white/10 text-zinc-300"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* ACCOUNT DETAILS */}
          <Section title="Account" icon="manage_accounts">
            <div className="space-y-2.5">
              {[
                { label: 'Email Address', value: currentUser?.email || '—', icon: 'email' },
                { label: 'User ID', value: userId || userProfile?.userId || '—', icon: 'badge' },
                { label: 'Member Since', value: joinDate, icon: 'calendar_today' },
              ].map(({ label, value, icon }) => (
                <div key={label} className="flex items-center gap-3 px-4 py-3 bg-[#0D0D14] rounded-xl border border-white/5">
                  <span className="material-symbols-outlined text-on-surface-variant text-base shrink-0">{icon}</span>
                  <div className="min-w-0">
                    <p className="text-[10px] text-on-surface-variant uppercase font-bold tracking-wider">{label}</p>
                    <p className="text-sm font-semibold text-white truncate mt-0.5 select-all">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* Logout */}
          <div className="pt-4 border-t border-white/5 flex justify-end">
            <button
              onClick={() => setLogoutConfirm(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-red-500/10 border border-red-500/25 text-red-400 hover:bg-red-500/20 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">logout</span>
              Sign Out of MasterOS
            </button>
          </div>

        </div>
      </main>

      {/* Password Setup / Change Modal */}
      {isPasswordModalOpen && (
        <Modal
          isOpen={isPasswordModalOpen}
          onClose={() => setIsPasswordModalOpen(false)}
          title={hasPasswordSet ? "CHANGE PASSWORD" : "SET A PASSWORD FOR YOUR ACCOUNT"}
          maxWidth="max-w-sm"
        >
          <form onSubmit={handleSavePassword} className="space-y-4 py-2 text-xs select-none">
            <p className="text-zinc-400 leading-relaxed">
              {hasPasswordSet
                ? "Enter your new password below."
                : "Setting a password allows you to log in with your email address while keeping Google Sign-In fully active."}
            </p>

            {passwordError && (
              <div className="p-2.5 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 font-semibold text-center">
                {passwordError}
              </div>
            )}

            <div>
              <label className="block text-[10px] font-bold uppercase text-zinc-400 mb-1">New Password</label>
              <input
                type="password"
                value={newPasswordInput}
                onChange={e => setNewPasswordInput(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full bg-[#0D0D14] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-primary"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-zinc-400 mb-1">Confirm Password</label>
              <input
                type="password"
                value={confirmPasswordInput}
                onChange={e => setConfirmPasswordInput(e.target.value)}
                placeholder="Re-enter new password"
                className="w-full bg-[#0D0D14] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-primary"
                required
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-white/5">
              <button
                type="button"
                onClick={() => setIsPasswordModalOpen(false)}
                className="px-3 py-1.5 rounded-xl text-zinc-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={savingPassword}
                className="px-5 py-1.5 rounded-xl bg-primary text-black font-bold uppercase"
              >
                {savingPassword ? 'Saving...' : 'Save Password'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Logout confirm modal */}
      {logoutConfirm && (
        <Modal isOpen={logoutConfirm} onClose={() => setLogoutConfirm(false)} title="Sign Out">
          <div className="space-y-4 py-2 text-center text-on-surface select-none">
            <p className="text-xs text-zinc-300">Are you sure you want to sign out of MasterOS?</p>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => setLogoutConfirm(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-zinc-400 hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={logout}
                className="px-5 py-2 rounded-xl bg-red-500 text-white font-bold text-xs uppercase cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Settings;
