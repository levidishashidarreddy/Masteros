import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { TaskContext } from '../context/TaskContext';
import { AvatarImg, getAvatar, DEFAULT_AVATARS } from '../components/Avatar';

// ─── Social links config ──────────────────────────────────────────────────────
const SOCIAL_ICONS = [
  { key: 'github',    icon: 'fa-brands fa-github',    label: 'GitHub',      placeholder: 'https://github.com/username',     color: '#E2E8F0' },
  { key: 'linkedin',  icon: 'fa-brands fa-linkedin',  label: 'LinkedIn',    placeholder: 'https://linkedin.com/in/username', color: '#0A66C2' },
  { key: 'instagram', icon: 'fa-brands fa-instagram', label: 'Instagram',   placeholder: 'https://instagram.com/username',  color: '#E1306C' },
  { key: 'twitter',   icon: 'fa-brands fa-x-twitter', label: 'X / Twitter', placeholder: 'https://x.com/username',          color: '#E2E8F0' },
  { key: 'portfolio', icon: 'fa-solid fa-globe',      label: 'Portfolio',   placeholder: 'https://yoursite.com',            color: '#A78BFA' },
];

// ─── UI helpers ───────────────────────────────────────────────────────────────
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

// ═══════════════════════════════════════════════════════════════════════════════
// SETTINGS PAGE
// ═══════════════════════════════════════════════════════════════════════════════
const Settings = () => {
  const navigate = useNavigate();
  const { userProfile, setUserProfile, currentUser, userId, logout } = useContext(TaskContext);

  // ── Profile fields ─────────────────────────────────────────────────────────
  const [displayName, setDisplayName] = useState('');
  const [username,    setUsername]    = useState('');
  const [bio,         setBio]         = useState('');

  // ── Avatar state ───────────────────────────────────────────────────────────
  // 'default' → grid picker   'url' → URL input
  const [avatarMode,    setAvatarMode]    = useState('default');
  const [selectedAvatar, setSelectedAvatar] = useState('');   // path from DEFAULT_AVATARS
  const [avatarUrlInput, setAvatarUrlInput] = useState('');   // user-pasted URL
  const [urlError,       setUrlError]       = useState('');

  // ── Social links ───────────────────────────────────────────────────────────
  const [socialLinks, setSocialLinks] = useState({ github: '', linkedin: '', instagram: '', twitter: '', portfolio: '' });

  // ── Save states ────────────────────────────────────────────────────────────
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingSocial,  setSavingSocial]  = useState(false);
  const [toast, setToast] = useState(null);
  const [logoutConfirm, setLogoutConfirm] = useState(false);

  // ── Sync from Firestore on load ────────────────────────────────────────────
  useEffect(() => {
    if (!userProfile) return;
    setDisplayName(userProfile.fullName  || '');
    setUsername(   userProfile.username  || '');
    setBio(        userProfile.bio       || '');
    setSocialLinks({
      github:    userProfile.socialLinks?.github    || '',
      linkedin:  userProfile.socialLinks?.linkedin  || '',
      instagram: userProfile.socialLinks?.instagram || '',
      twitter:   userProfile.socialLinks?.twitter   || '',
      portfolio: userProfile.socialLinks?.portfolio || '',
    });

    // Determine avatar mode from saved value
    const saved = getAvatar(userProfile);
    if (DEFAULT_AVATARS.includes(saved)) {
      setAvatarMode('default');
      setSelectedAvatar(saved);
    } else if (saved && (saved.startsWith('http') || saved.startsWith('data:'))) {
      setAvatarMode('url');
      setAvatarUrlInput(saved);
      setSelectedAvatar('');
    } else {
      // legacy preset or nothing
      setAvatarMode('default');
      setSelectedAvatar(DEFAULT_AVATARS[0]);
    }
  }, [userProfile?.userId]); // eslint-disable-line

  // ── Toast helper ───────────────────────────────────────────────────────────
  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  // ── Compute the effective avatar to preview & save ─────────────────────────
  const effectiveAvatar = avatarMode === 'url'
    ? (avatarUrlInput.trim() || DEFAULT_AVATARS[0])
    : (selectedAvatar || DEFAULT_AVATARS[0]);

  // ── Validate URL ───────────────────────────────────────────────────────────
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

  // ── Save profile ───────────────────────────────────────────────────────────
  const handleSaveProfile = async () => {
    if (!currentUser || !userProfile) return;
    if (avatarMode === 'url' && !validateUrl(avatarUrlInput.trim())) return;

    setSavingProfile(true);
    try {
      const cleanUsername = username.trim().startsWith('@')
        ? username.trim()
        : `@${username.trim()}`;

      await setUserProfile({
        ...userProfile,
        fullName:       displayName.trim() || userProfile.fullName,
        username:       cleanUsername,
        bio:            bio.trim(),
        // Single source-of-truth field used everywhere
        profilePicture: effectiveAvatar,
        // Also store helper fields so getAvatar() has fallbacks
        avatarUrl:      avatarMode === 'url' ? avatarUrlInput.trim() : (userProfile.avatarUrl || ''),
        selectedAvatar: avatarMode === 'default' ? selectedAvatar : (userProfile.selectedAvatar || ''),
      });
      showToast('success', 'Profile saved successfully.');
    } catch (err) {
      console.error('Save profile error:', err);
      showToast('error', 'Failed to save profile. Try again.');
    } finally {
      setSavingProfile(false);
    }
  };

  // ── Save social links ──────────────────────────────────────────────────────
  const handleSaveSocial = async () => {
    if (!currentUser || !userProfile) return;
    setSavingSocial(true);
    try {
      await setUserProfile({ ...userProfile, socialLinks });
      showToast('success', 'Social links updated.');
    } catch (err) {
      console.error('Save social error:', err);
      showToast('error', 'Failed to save social links.');
    } finally {
      setSavingSocial(false);
    }
  };

  // ── Logout ─────────────────────────────────────────────────────────────────
  const handleLogout = async () => {
    if (logout) await logout();
    navigate('/');
  };

  // ── Join date ──────────────────────────────────────────────────────────────
  const joinDate = userProfile?.createdAt
    ? new Date(userProfile.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : '—';

  return (
    /*
     * Layout:
     *  - Outer wrapper: h-screen overflow-hidden → prevents body scroll
     *  - <main>: flex-1 h-full overflow-y-auto → only content scrolls
     *  - Sidebar stays fixed/sticky (its own CSS handles that)
     */
    <div className="flex h-screen overflow-hidden bg-background text-on-surface radial-glow-bg">
      <Sidebar />

      <main className="flex-1 h-full overflow-y-auto overflow-x-hidden scroll-smooth relative z-10">
        <Header hideSearch hideStreak hideLogo />

        <div className="max-w-2xl mx-auto px-5 pb-16 space-y-6 animate-page-transition">

          {/* Page title */}
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight">Settings</h2>
            <p className="text-xs text-on-surface-variant mt-1">Manage your profile, social links, and account.</p>
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

            {/* Avatar preview + mode tabs */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 mb-6 pb-6 border-b border-white/5">
              {/* Live preview */}
              <div className="shrink-0">
                <AvatarImg src={effectiveAvatar} sizeCls="w-20 h-20" iconCls="text-3xl" />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white mb-3">Profile Picture</p>

                {/* Mode toggle */}
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

                {/* ── Default avatars grid ── */}
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

                {/* ── Image URL input ── */}
                {avatarMode === 'url' && (
                  <div className="space-y-1.5 w-full">
                    <p className="text-[10px] text-on-surface-variant leading-relaxed">
                      Paste any public image URL (Imgur, Unsplash, Twitter, etc.)
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

            {/* Text fields */}
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
              Links appear as icons on your public profile. Raw URLs are never displayed publicly.
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

          {/* ══════════════════ C) ACCOUNT ══════════════════════════════════ */}
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

          {/* ══════════════════ D) DANGER ZONE ══════════════════════════════ */}
          <Section title="Danger Zone" icon="warning">
            {!logoutConfirm ? (
              <button
                onClick={() => setLogoutConfirm(true)}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-bold hover:bg-orange-500/20 hover:text-orange-300 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">logout</span>
                Log Out
              </button>
            ) : (
              <div className="space-y-3 p-4 bg-orange-500/5 border border-orange-500/15 rounded-xl animate-fade-in">
                <p className="text-sm font-bold text-orange-400">Confirm log out?</p>
                <p className="text-[11px] text-on-surface-variant">Your data is cloud-synced and will be available on next login.</p>
                <div className="flex gap-2.5 pt-1">
                  <button
                    onClick={handleLogout}
                    className="flex-1 py-2 rounded-xl bg-orange-500 text-white text-xs font-bold hover:bg-orange-400 transition-colors cursor-pointer"
                  >Yes, Log Out</button>
                  <button
                    onClick={() => setLogoutConfirm(false)}
                    className="flex-1 py-2 rounded-xl bg-white/5 border border-white/5 text-on-surface-variant text-xs font-bold hover:bg-white/10 transition-colors cursor-pointer"
                  >Cancel</button>
                </div>
              </div>
            )}
          </Section>

        </div>
      </main>
    </div>
  );
};

export default Settings;
