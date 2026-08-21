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

  // Feedback Form & Reports View State
  const [activeFeedbackTab, setActiveFeedbackTab] = useState('submit'); // 'submit' | 'my-reports'
  const [feedbackType, setFeedbackType] = useState('problem');
  const [feedbackTitle, setFeedbackTitle] = useState('');
  const [feedbackDescription, setFeedbackDescription] = useState('');
  const [feedbackSection, setFeedbackSection] = useState('Roadmaps');
  const [feedbackSteps, setFeedbackSteps] = useState('');
  const [feedbackSeverity, setFeedbackSeverity] = useState('Normal');
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const [adminStatusFilter, setAdminStatusFilter] = useState('All');
  const [adminReplies, setAdminReplies] = useState({});

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

      showToast('success', '✓ Report Sent Successfully - Your report has been sent privately to the Master OS admin.');
      setFeedbackTitle('');
      setFeedbackDescription('');
      setFeedbackSteps('');
      setActiveFeedbackTab('my-reports');
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

          {/* ══════════════════ SECURITY / LOGIN METHODS (Content-First -> Action Below) ═════════════════════════ */}
          <Section title="Security & Login Methods" icon="security">
            <div className="space-y-4">
              <p className="text-xs text-zinc-400 leading-relaxed">
                Manage authentication providers linked to your account. Multiple methods access the exact same profile & workspace data.
              </p>

              <div className="space-y-3">
                
                {/* 1. Google Authentication */}
                <div className="p-4 bg-[#0D0D14] border border-white/5 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-xl shrink-0">
                      🌐
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-white leading-tight">Google Account</h4>
                      <p className="text-[11px] text-zinc-400 mt-0.5 truncate">
                        {hasGoogleConnected || currentUser?.email ? currentUser?.email : 'Google Authentication'}
                      </p>
                    </div>
                  </div>

                  <span className="self-start sm:self-auto inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-lg shrink-0">
                    <span>✓ Connected</span>
                  </span>
                </div>

                {/* 2. Password Authentication */}
                <div className="p-4 bg-[#0D0D14] border border-white/5 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-xl shrink-0">
                      🔑
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-white leading-tight">Password Authentication</h4>
                      <p className="text-[11px] text-zinc-400 mt-0.5">
                        {hasPasswordSet ? 'Password configured' : 'Not configured'}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => { setPasswordError(''); setIsPasswordModalOpen(true); }}
                    className={`w-full sm:w-auto min-h-[44px] sm:min-h-0 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center shrink-0 ${
                      hasPasswordSet
                        ? 'bg-white/5 hover:bg-white/10 border border-white/10 text-white'
                        : 'bg-primary text-black font-extrabold uppercase shadow-[0_0_10px_rgba(139,92,246,0.3)]'
                    }`}
                  >
                    {hasPasswordSet ? 'Change Password' : '+ Set a Password'}
                  </button>
                </div>

                {/* 3. Passkey / Biometric */}
                <div className="p-4 bg-[#0D0D14] border border-white/5 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 opacity-60">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-xl shrink-0">
                      📱
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-white leading-tight">Passkey / Biometric</h4>
                      <p className="text-[11px] text-zinc-400 mt-0.5">Not configured</p>
                    </div>
                  </div>

                  <button
                    disabled
                    className="w-full sm:w-auto min-h-[44px] sm:min-h-0 px-4 py-2.5 rounded-xl text-xs font-bold bg-white/5 text-zinc-500 cursor-not-allowed flex items-center justify-center shrink-0"
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

          {/* PRIVATE BUG REPORT & SUPPORT SECTION */}
          <Section title="Private Bug Reports & Support" icon="lock">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveFeedbackTab('submit')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      activeFeedbackTab === 'submit' 
                        ? 'bg-primary text-black shadow-md' 
                        : 'bg-white/5 text-zinc-400 hover:text-white'
                    }`}
                  >
                    Submit Private Report
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveFeedbackTab('my-reports')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      activeFeedbackTab === 'my-reports' 
                        ? 'bg-primary text-black shadow-md' 
                        : 'bg-white/5 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <span>View My Reports</span>
                    {feedbackReports?.length > 0 && (
                      <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-[10px] font-mono font-bold">
                        {feedbackReports.filter(r => r.reporterId === currentUser?.uid || r.userId === currentUser?.uid).length}
                      </span>
                    )}
                  </button>
                </div>

                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">verified_user</span>
                  Private → Admin Only
                </span>
              </div>

              {activeFeedbackTab === 'submit' ? (
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
                    placeholder="Title / Summary of problem"
                  />

                  <textarea
                    value={feedbackDescription}
                    onChange={e => setFeedbackDescription(e.target.value)}
                    placeholder="Detailed description of the issue..."
                    rows={3}
                    className="w-full bg-[#0D0D14] border border-white/5 rounded-lg px-3.5 py-2 text-xs text-on-surface focus:outline-none focus:border-primary resize-none"
                  />

                  <textarea
                    value={feedbackSteps}
                    onChange={e => setFeedbackSteps(e.target.value)}
                    placeholder="Steps to reproduce (optional)..."
                    rows={2}
                    className="w-full bg-[#0D0D14] border border-white/5 rounded-lg px-3.5 py-2 text-xs text-on-surface focus:outline-none focus:border-primary resize-none"
                  />

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-zinc-500">
                      🔒 Your report will be routed privately to the Master OS admin (Shashidar).
                    </span>
                    <button
                      type="submit"
                      disabled={submittingFeedback}
                      className="px-5 py-2 bg-primary text-black font-bold text-xs uppercase rounded-xl cursor-pointer shadow-md"
                    >
                      {submittingFeedback ? 'Sending...' : 'Send Private Report'}
                    </button>
                  </div>
                </form>
              ) : (
                /* MY REPORTS VIEW */
                <div className="space-y-3">
                  {(() => {
                    const myReports = feedbackReports.filter(r => r.reporterId === currentUser?.uid || r.userId === currentUser?.uid);
                    if (myReports.length === 0) {
                      return (
                        <div className="p-8 text-center border border-white/5 rounded-xl space-y-2">
                          <span className="material-symbols-outlined text-zinc-500 text-3xl">inbox</span>
                          <p className="text-xs text-zinc-400">You haven't submitted any bug reports yet.</p>
                        </div>
                      );
                    }
                    return myReports.map((report) => (
                      <div key={report.id} className="p-4 bg-[#0D0D14] border border-white/10 rounded-xl space-y-2.5 text-xs">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-white/5 text-zinc-300">
                              {report.type}
                            </span>
                            <h4 className="font-bold text-white">{report.title}</h4>
                          </div>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                            report.status === 'Resolved' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' :
                            report.status === 'In Progress' ? 'bg-purple-500/20 text-purple-300 border-purple-500/40' :
                            report.status === 'Under Review' ? 'bg-blue-500/20 text-blue-300 border-blue-500/40' :
                            report.status === 'Closed' ? 'bg-zinc-500/20 text-zinc-400 border-zinc-500/40' :
                            'bg-rose-500/20 text-rose-300 border-rose-500/40'
                          }`}>
                            {report.status || 'Open'}
                          </span>
                        </div>
                        <p className="text-zinc-300 leading-relaxed">{report.description}</p>
                        {report.stepsToReproduce && (
                          <div className="p-2.5 bg-black/40 rounded-lg text-[11px] text-zinc-400">
                            <strong className="text-zinc-300">Steps to reproduce:</strong> {report.stepsToReproduce}
                          </div>
                        )}
                        {report.adminReply && (
                          <div className="p-3 bg-primary/10 border border-primary/20 rounded-xl text-xs space-y-1">
                            <span className="font-bold text-primary text-[10px] uppercase tracking-wider block">🛡️ Admin Response (Shashidar)</span>
                            <p className="text-white">{report.adminReply}</p>
                          </div>
                        )}
                        <div className="text-[10px] text-zinc-500 pt-1">
                          Submitted: {new Date(report.createdAt).toLocaleString()}
                        </div>
                      </div>
                    ));
                  })()}
                </div>
              )}
            </div>
          </Section>

          {/* ADMIN PRIVATE REPORTS DASHBOARD (SHASHIDAR) */}
          {isAdmin && (
            <Section title="Admin Private Reports Dashboard (Shashidar)" icon="admin_panel_settings">
              <div className="space-y-4">
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 border-b border-white/5">
                  {['All', 'Open', 'Under Review', 'In Progress', 'Resolved', 'Closed'].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setAdminStatusFilter(s)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
                        adminStatusFilter === s 
                          ? 'bg-primary text-black' 
                          : 'bg-white/5 text-zinc-400 hover:text-white'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>

                <div className="space-y-4 max-h-96 overflow-y-auto no-scrollbar">
                  {(() => {
                    const filtered = feedbackReports.filter(r => 
                      adminStatusFilter === 'All' ? true : (r.status || 'Open').toLowerCase() === adminStatusFilter.toLowerCase()
                    );
                    if (filtered.length === 0) {
                      return <p className="text-xs text-zinc-500 py-4 text-center">No reports match filter "{adminStatusFilter}".</p>;
                    }
                    return filtered.map((report) => (
                      <div key={report.id} className="p-4 bg-[#0D0D14] border border-white/10 rounded-2xl space-y-3 text-xs">
                        <div className="flex justify-between items-start gap-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-primary/20 text-primary border border-primary/30">
                                {report.type}
                              </span>
                              <span className="text-[11px] text-zinc-400 font-semibold">
                                From: <strong className="text-white">{report.reporterName || report.userName || 'User'}</strong> ({report.reporterEmail || report.userEmail})
                              </span>
                            </div>
                            <h4 className="font-bold text-white text-sm">{report.title}</h4>
                          </div>

                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shrink-0 border ${
                            report.status === 'Resolved' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' :
                            report.status === 'In Progress' ? 'bg-purple-500/20 text-purple-300 border-purple-500/40' :
                            report.status === 'Under Review' ? 'bg-blue-500/20 text-blue-300 border-blue-500/40' :
                            report.status === 'Closed' ? 'bg-zinc-500/20 text-zinc-400 border-zinc-500/40' :
                            'bg-rose-500/20 text-rose-300 border-rose-500/40'
                          }`}>
                            {report.status || 'Open'}
                          </span>
                        </div>

                        <p className="text-zinc-300 leading-relaxed bg-black/30 p-3 rounded-xl border border-white/5">{report.description}</p>

                        {report.stepsToReproduce && (
                          <div className="p-2.5 bg-black/40 rounded-lg text-[11px] text-zinc-400">
                            <strong className="text-zinc-300">Steps:</strong> {report.stepsToReproduce}
                          </div>
                        )}

                        {/* Status Update Buttons */}
                        <div className="space-y-2 pt-2 border-t border-white/5">
                          <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                            Update Report Status:
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {['Open', 'Under Review', 'In Progress', 'Resolved', 'Closed'].map((s) => (
                              <button
                                key={s}
                                type="button"
                                onClick={() => updateFeedbackStatus(report.id, s, adminReplies[report.id] || report.adminReply || '')}
                                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition-all cursor-pointer border ${
                                  report.status === s 
                                    ? 'bg-primary text-black border-primary' 
                                    : 'bg-white/5 hover:bg-white/10 text-zinc-300 border-white/10'
                                }`}
                              >
                                {s}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Admin Reply Area */}
                        <div className="space-y-2 pt-2">
                          <label className="block text-[10px] font-bold text-primary uppercase tracking-wider">
                            Admin Response (Visible to Reporter):
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={adminReplies[report.id] !== undefined ? adminReplies[report.id] : (report.adminReply || '')}
                              onChange={(e) => setAdminReplies({ ...adminReplies, [report.id]: e.target.value })}
                              placeholder="Write reply to reporter..."
                              className="flex-1 px-3 py-1.5 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:outline-none focus:border-primary"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                updateFeedbackStatus(report.id, report.status || 'Open', adminReplies[report.id] || '');
                                showToast('success', '✓ Response saved and reporter notified privately.');
                              }}
                              className="px-3 py-1.5 bg-primary text-black font-bold text-xs rounded-xl cursor-pointer shrink-0"
                            >
                              Send Reply
                            </button>
                          </div>
                        </div>
                      </div>
                    ));
                  })()}
                </div>
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
