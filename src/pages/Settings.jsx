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
    isAdmin
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

  // Feedback & Support Form State
  const [feedbackType, setFeedbackType] = useState('problem'); // 'problem' | 'suggestion' | 'feedback'
  const [feedbackTitle, setFeedbackTitle] = useState('');
  const [feedbackDescription, setFeedbackDescription] = useState('');
  const [feedbackSection, setFeedbackSection] = useState('Roadmaps');
  const [feedbackSteps, setFeedbackSteps] = useState('');
  const [feedbackSeverity, setFeedbackSeverity] = useState('Normal');
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const [selectedAdminReport, setSelectedAdminReport] = useState(null);

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

      showToast('success', 'Thank you! Your feedback has been submitted to the admin team.');
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

  const joinDate = userProfile?.createdAt
    ? new Date(userProfile.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    : 'Recently';

  return (
    <div className="flex h-screen overflow-hidden bg-background text-on-surface radial-glow-bg select-none">
      <Sidebar />

      <main className="flex-1 h-full overflow-y-auto overflow-x-hidden scroll-smooth relative z-10">
        <Header hideSearch hideStreak hideLogo />

        <div className="max-w-3xl mx-auto px-5 pb-16 space-y-6 animate-page-transition">

          {/* Page title */}
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight font-space-grotesk">SETTINGS & SUPPORT</h2>
            <p className="text-xs text-on-surface-variant mt-1">
              Manage profile settings, social links, account security, and feedback reporting.
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

          {/* ══════════════════ A) PROFILE ══════════════════════════════════ */}
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
                    <p className="text-[10px] text-on-surface-variant leading-relaxed">
                      Paste any public image URL (Imgur, Unsplash, etc.)
                    </p>
                    <input
                      type="url"
                      value={avatarUrlInput}
                      onChange={e => { setAvatarUrlInput(e.target.value); setUrlError(''); }}
                      onBlur={e => validateUrl(e.target.value.trim())}
                      placeholder="https://i.imgur.com/example.jpg"
                      className="w-full bg-[#0D0D14] border border-white/5 rounded-lg px-3.5 py-2.5 text-xs text-on-surface placeholder:text-on-surface-variant/30 focus:outline-none focus:border-primary transition-colors"
                    />
                    {urlError && (
                      <p className="text-[10px] text-red-400 font-semibold flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">error</span>
                        {urlError}
                      </p>
                    )}
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
                  className="w-full bg-[#0D0D14] border border-white/5 rounded-lg px-3.5 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/30 focus:outline-none focus:border-primary transition-colors resize-none"
                />
              </div>

              <div className="flex justify-end pt-1">
                <SaveBtn onClick={handleSaveProfile} loading={savingProfile} label="Save Profile" />
              </div>
            </div>
          </Section>

          {/* ══════════════════ B) SOCIAL LINKS ═════════════════════════════ */}
          <Section title="Social Links" icon="share">
            <p className="text-[11px] text-on-surface-variant mb-4 leading-relaxed">
              Links appear as icons on your public profile.
            </p>
            <div className="space-y-3">
              {SOCIAL_ICONS.map(({ key, icon, label, placeholder, color }) => (
                <div key={key} className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/5 border border-white/5 shrink-0"
                    style={{ color }}
                  >
                    <i className={`${icon} text-sm`} />
                  </div>
                  <input
                    type="url"
                    value={socialLinks[key]}
                    onChange={e => setSocialLinks(prev => ({ ...prev, [key]: e.target.value }))}
                    placeholder={placeholder}
                    aria-label={label}
                    className="flex-1 bg-[#0D0D14] border border-white/5 rounded-lg px-3 py-2 text-xs text-on-surface placeholder:text-on-surface-variant/25 focus:outline-none focus:border-primary transition-colors"
                  />
                  <span className="text-[10px] font-bold text-on-surface-variant w-16 shrink-0 hidden sm:block">{label}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-end mt-4">
              <SaveBtn onClick={handleSaveSocial} loading={savingSocial} label="Save Links" />
            </div>
          </Section>

          {/* ══════════════════ REQUIREMENT 16: FEEDBACK AND ERROR REPORTING ═════════════════════════ */}
          <Section title="Feedback & Support" icon="feedback">
            <form onSubmit={handleSubmitFeedbackForm} className="space-y-5">
              
              {/* Type Selection */}
              <div>
                <FieldLabel>What would you like to submit?</FieldLabel>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setFeedbackType('problem')}
                    className={`p-3 rounded-xl border text-xs font-bold transition-all text-center flex flex-col items-center gap-1.5 cursor-pointer ${
                      feedbackType === 'problem'
                        ? 'bg-rose-500/10 border-rose-500/40 text-rose-300 shadow-[0_0_10px_rgba(244,63,94,0.2)]'
                        : 'bg-white/5 border-white/5 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <span className="text-base">🐛</span>
                    <span>Report a Problem</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFeedbackType('suggestion')}
                    className={`p-3 rounded-xl border text-xs font-bold transition-all text-center flex flex-col items-center gap-1.5 cursor-pointer ${
                      feedbackType === 'suggestion'
                        ? 'bg-amber-500/10 border-amber-500/40 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.2)]'
                        : 'bg-white/5 border-white/5 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <span className="text-base">💡</span>
                    <span>Suggest Improvement</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFeedbackType('feedback')}
                    className={`p-3 rounded-xl border text-xs font-bold transition-all text-center flex flex-col items-center gap-1.5 cursor-pointer ${
                      feedbackType === 'feedback'
                        ? 'bg-primary/10 border-primary/40 text-primary shadow-[0_0_10px_rgba(139,92,246,0.2)]'
                        : 'bg-white/5 border-white/5 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <span className="text-base">💬</span>
                    <span>General Feedback</span>
                  </button>
                </div>
              </div>

              {/* Form Inputs */}
              <div>
                <FieldLabel>{feedbackType === 'problem' ? 'What happened?' : 'Summary / Title'}</FieldLabel>
                <TextInput
                  value={feedbackTitle}
                  onChange={(e) => setFeedbackTitle(e.target.value)}
                  placeholder={feedbackType === 'problem' ? 'e.g. Tasks are not adding when selecting Exam category' : 'e.g. Add dark calendar mode'}
                  maxLength={100}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <FieldLabel>Where did it occur?</FieldLabel>
                  <select
                    value={feedbackSection}
                    onChange={(e) => setFeedbackSection(e.target.value)}
                    className="w-full bg-[#0D0D14] border border-white/5 rounded-lg px-3.5 py-2.5 text-xs text-on-surface focus:outline-none focus:border-primary cursor-pointer"
                  >
                    <option value="Roadmaps">Roadmaps</option>
                    <option value="Tasks">Tasks & Checklist</option>
                    <option value="Workspaces">Workspaces</option>
                    <option value="Dashboard">Dashboard</option>
                    <option value="Settings">Settings</option>
                    <option value="General">General App</option>
                  </select>
                </div>

                {feedbackType === 'problem' && (
                  <div>
                    <FieldLabel>Severity</FieldLabel>
                    <select
                      value={feedbackSeverity}
                      onChange={(e) => setFeedbackSeverity(e.target.value)}
                      className="w-full bg-[#0D0D14] border border-white/5 rounded-lg px-3.5 py-2.5 text-xs text-on-surface focus:outline-none focus:border-primary cursor-pointer"
                    >
                      <option value="Minor">Minor (Cosmetic / Small glitch)</option>
                      <option value="Normal">Normal (Feature bug)</option>
                      <option value="Major">Major (Blocking error)</option>
                    </select>
                  </div>
                )}
              </div>

              <div>
                <FieldLabel>Details & Description</FieldLabel>
                <textarea
                  value={feedbackDescription}
                  onChange={(e) => setFeedbackDescription(e.target.value)}
                  placeholder="Describe your issue or suggestion in detail..."
                  rows={3}
                  className="w-full bg-[#0D0D14] border border-white/5 rounded-lg px-3.5 py-2.5 text-xs text-on-surface placeholder:text-on-surface-variant/30 focus:outline-none focus:border-primary transition-colors resize-none"
                  required
                />
              </div>

              {feedbackType === 'problem' && (
                <div>
                  <FieldLabel>Steps to reproduce (Optional)</FieldLabel>
                  <input
                    type="text"
                    value={feedbackSteps}
                    onChange={(e) => setFeedbackSteps(e.target.value)}
                    placeholder="1. Open Tasks -> 2. Click Add Exam..."
                    className="w-full bg-[#0D0D14] border border-white/5 rounded-lg px-3.5 py-2 text-xs text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>
              )}

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={submittingFeedback}
                  className="px-6 py-2.5 bg-primary text-black font-bold text-xs uppercase tracking-wider rounded-xl hover:opacity-90 transition-all cursor-pointer shadow-[0_0_15px_rgba(139,92,246,0.3)] disabled:opacity-50"
                >
                  {submittingFeedback ? 'Submitting...' : 'Submit Report'}
                </button>
              </div>
            </form>
          </Section>

          {/* ══════════════════ REQUIREMENT 17: ADMIN FEEDBACK MANAGEMENT PANEL ═════════════════════════ */}
          {isAdmin && (
            <Section title="Admin Feedback Management" icon="admin_panel_settings">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    All User Reports ({feedbackReports.length})
                  </span>
                  <span className="text-[10px] font-bold text-primary bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded-full uppercase">
                    Admin Verified
                  </span>
                </div>

                {feedbackReports.length === 0 ? (
                  <p className="text-xs text-zinc-500 italic py-2">No feedback reports submitted yet.</p>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto no-scrollbar">
                    {feedbackReports.map((report) => (
                      <div key={report.id} className="p-4 bg-[#0D0D14] border border-white/10 rounded-xl space-y-3 text-xs">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                                report.type === 'problem' ? 'bg-rose-500/20 text-rose-300' : report.type === 'suggestion' ? 'bg-amber-500/20 text-amber-300' : 'bg-primary/20 text-primary'
                              }`}>
                                {report.type === 'problem' ? '🐛 Problem' : report.type === 'suggestion' ? '💡 Suggestion' : '💬 Feedback'}
                              </span>
                              <span className="text-[10px] text-zinc-500 font-mono">{report.section}</span>
                            </div>
                            <h4 className="font-bold text-white text-sm font-space-grotesk">{report.title}</h4>
                            <p className="text-xs text-zinc-300 mt-1 leading-relaxed">{report.description}</p>
                          </div>

                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase shrink-0 ${
                            report.status === 'RESOLVED' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : report.status === 'IN PROGRESS' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-white/5 text-zinc-400 border border-white/10'
                          }`}>
                            {report.status}
                          </span>
                        </div>

                        {/* User & Metadata details */}
                        <div className="flex flex-wrap items-center gap-3 text-[10px] text-zinc-500 border-t border-white/5 pt-2">
                          <span>User: <strong className="text-zinc-300">{report.userEmail}</strong></span>
                          <span>Device: <strong className="text-zinc-300">{report.metadata?.screenCategory || 'Desktop'}</strong></span>
                          <span>Submitted: <strong className="text-zinc-300">{new Date(report.createdAt).toLocaleDateString()}</strong></span>
                        </div>

                        {/* Status Change Buttons */}
                        <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                          <span className="text-[10px] font-bold text-zinc-400 uppercase mr-1">Update Status:</span>
                          {['VIEWED', 'IN PROGRESS', 'RESOLVED', 'CLOSED'].map((status) => (
                            <button
                              key={status}
                              onClick={() => updateFeedbackStatus(report.id, status)}
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition-all cursor-pointer ${
                                report.status === status
                                  ? 'bg-primary text-black font-black'
                                  : 'bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white'
                              }`}
                            >
                              {status}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Section>
          )}

          {/* ══════════════════ ACCOUNT DETAILS ══════════════════════════════ */}
          <Section title="Account" icon="manage_accounts">
            <div className="space-y-2.5">
              {[
                { label: 'Email Address', value: currentUser?.email || '—',           icon: 'email'         },
                { label: 'User ID',       value: userId || userProfile?.userId || '—', icon: 'badge'         },
                { label: 'Member Since',  value: joinDate,                             icon: 'calendar_today' },
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
              Sign Out
            </button>
          </div>

        </div>
      </main>

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
