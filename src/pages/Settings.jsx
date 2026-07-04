import React, { useState, useContext, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { TaskContext } from '../context/TaskContext';
import { storage } from '../firebase';
import { ref as storageRef, uploadString, getDownloadURL } from 'firebase/storage';

// ─── Avatar presets (must match the rest of the app) ─────────────────────────
const AVATAR_PRESETS = [
  { id: 'tech',    icon: 'developer_mode', bg: 'from-blue-500 to-indigo-600'   },
  { id: 'startup', icon: 'rocket_launch',  bg: 'from-amber-400 to-orange-600'  },
  { id: 'design',  icon: 'palette',        bg: 'from-pink-500 to-rose-600'     },
  { id: 'ai',      icon: 'psychology',     bg: 'from-purple-500 to-violet-600' },
  { id: 'flow',    icon: 'bolt',           bg: 'from-teal-400 to-emerald-600'  },
  { id: 'fitness', icon: 'fitness_center', bg: 'from-red-500 to-rose-700'      },
];

const SOCIAL_ICONS = [
  { key: 'github',    icon: 'fa-brands fa-github',    label: 'GitHub',      placeholder: 'https://github.com/username',     color: '#E2E8F0' },
  { key: 'linkedin',  icon: 'fa-brands fa-linkedin',  label: 'LinkedIn',    placeholder: 'https://linkedin.com/in/username', color: '#0A66C2' },
  { key: 'instagram', icon: 'fa-brands fa-instagram', label: 'Instagram',   placeholder: 'https://instagram.com/username',  color: '#E1306C' },
  { key: 'twitter',   icon: 'fa-brands fa-x-twitter', label: 'X / Twitter', placeholder: 'https://x.com/username',          color: '#E2E8F0' },
  { key: 'portfolio', icon: 'fa-solid fa-globe',      label: 'Portfolio',   placeholder: 'https://yoursite.com',            color: '#A78BFA' },
];

// ─── Inline avatar renderer (shared with Friends.jsx pattern) ─────────────────
function AvatarDisplay({ src, sizeCls = 'w-16 h-16', iconCls = 'text-2xl' }) {
  const preset = AVATAR_PRESETS.find(p => p.id === src);
  if (preset) {
    return (
      <div className={`${sizeCls} rounded-full bg-gradient-to-tr ${preset.bg} flex items-center justify-center text-white shrink-0`}>
        <span className={`material-symbols-outlined ${iconCls} font-bold`}>{preset.icon}</span>
      </div>
    );
  }
  if (src && (src.startsWith('http') || src.startsWith('data:'))) {
    return (
      <div className={`${sizeCls} rounded-full overflow-hidden shrink-0 border border-white/10`}>
        <img src={src} alt="avatar" className="w-full h-full object-cover" />
      </div>
    );
  }
  // Fallback
  const fallback = AVATAR_PRESETS[0];
  return (
    <div className={`${sizeCls} rounded-full bg-gradient-to-tr ${fallback.bg} flex items-center justify-center text-white shrink-0`}>
      <span className={`material-symbols-outlined ${iconCls} font-bold`}>{fallback.icon}</span>
    </div>
  );
}

// ─── Canvas crop modal ────────────────────────────────────────────────────────
function CropModal({ imageSrc, onSave, onClose }) {
  const canvasRef = useRef(null);
  const imgRef = useRef(new window.Image());
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [lastPos, setLastPos] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const img = imgRef.current;
    img.onload = () => setLoaded(true);
    img.src = imageSrc;
  }, [imageSrc]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !loaded) return;
    const ctx = canvas.getContext('2d');
    const size = canvas.width;
    ctx.clearRect(0, 0, size, size);
    ctx.save();
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
    ctx.clip();
    const img = imgRef.current;
    const scale = Math.max(size / img.width, size / img.height) * zoom;
    const w = img.width * scale;
    const h = img.height * scale;
    const x = (size - w) / 2 + offset.x;
    const y = (size - h) / 2 + offset.y;
    ctx.drawImage(img, x, y, w, h);
    ctx.restore();
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2 - 1, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(139,92,246,0.7)';
    ctx.lineWidth = 2;
    ctx.stroke();
  }, [loaded, zoom, offset]);

  useEffect(() => { draw(); }, [draw]);

  const onMouseDown = e => { setDragging(true); setLastPos({ x: e.clientX, y: e.clientY }); };
  const onMouseMove = e => {
    if (!dragging || !lastPos) return;
    setOffset(p => ({ x: p.x + (e.clientX - lastPos.x), y: p.y + (e.clientY - lastPos.y) }));
    setLastPos({ x: e.clientX, y: e.clientY });
  };
  const onMouseUp = () => setDragging(false);

  const handleSave = () => onSave(canvasRef.current.toDataURL('image/jpeg', 0.88));

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 backdrop-blur-sm">
      <div className="bg-[#111118] border border-white/10 rounded-2xl p-6 flex flex-col items-center gap-5 w-[320px] shadow-2xl">
        <div className="flex items-center justify-between w-full">
          <h3 className="text-xs font-black uppercase tracking-widest text-white">Crop Photo</h3>
          <button onClick={onClose} className="text-on-surface-variant hover:text-white transition-colors cursor-pointer p-1">
            <span className="material-symbols-outlined text-base">close</span>
          </button>
        </div>
        <canvas
          ref={canvasRef}
          width={220} height={220}
          className="rounded-full cursor-grab active:cursor-grabbing select-none"
          style={{ background: '#0D0D14', touchAction: 'none' }}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
        />
        <div className="w-full space-y-1.5">
          <label className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">
            <span className="material-symbols-outlined text-sm">zoom_in</span>Zoom
          </label>
          <input
            type="range" min={0.8} max={4} step={0.05}
            value={zoom}
            onChange={e => setZoom(parseFloat(e.target.value))}
            className="w-full accent-primary cursor-pointer"
          />
        </div>
        <p className="text-[10px] text-on-surface-variant/60 text-center -mt-2">Drag to reposition · slide to zoom</p>
        <div className="flex gap-2.5 w-full">
          <button
            onClick={onClose}
            className="flex-1 py-2 text-xs font-bold rounded-xl bg-white/5 border border-white/5 text-on-surface-variant hover:text-white hover:bg-white/10 transition-all cursor-pointer"
          >Cancel</button>
          <button
            onClick={handleSave}
            className="flex-1 py-2 text-xs font-bold rounded-xl bg-primary text-white hover:bg-primary/90 transition-all cursor-pointer shadow-[0_0_14px_rgba(139,92,246,0.3)]"
          >Apply Photo</button>
        </div>
      </div>
    </div>
  );
}

// ─── Section card wrapper ─────────────────────────────────────────────────────
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

function InputRow({ label, children }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">{label}</label>
      {children}
    </div>
  );
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
        disabled ? 'opacity-50 cursor-not-allowed select-all' : ''
      }`}
    />
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SETTINGS PAGE
// ═══════════════════════════════════════════════════════════════════════════════
const Settings = () => {
  const navigate = useNavigate();
  const { userProfile, setUserProfile, currentUser, userId, logout } = useContext(TaskContext);

  // ── Local editable fields ──────────────────────────────────────────────────
  const [displayName, setDisplayName] = useState('');
  const [username,    setUsername]    = useState('');
  const [bio,         setBio]         = useState('');
  const [socialLinks, setSocialLinks] = useState({ github: '', linkedin: '', instagram: '', twitter: '', portfolio: '' });

  // ── Sync local state when userProfile loads ────────────────────────────────
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
  }, [userProfile?.userId]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Profile photo flow ─────────────────────────────────────────────────────
  const fileInputRef = useRef(null);
  const [rawImageSrc,  setRawImageSrc]  = useState(null);   // src for crop modal
  const [pendingPhoto, setPendingPhoto] = useState(null);   // base64 ready to upload
  const [showCrop,     setShowCrop]     = useState(false);

  const handleFileChange = e => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      setRawImageSrc(ev.target.result);
      setShowCrop(true);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleCropSave = base64 => {
    setPendingPhoto(base64);
    setShowCrop(false);
  };

  // Preview src: pending crop > saved picture > nothing
  const previewSrc = pendingPhoto || userProfile?.profilePicture || 'tech';

  // ── Save states ────────────────────────────────────────────────────────────
  const [saving,   setSaving]   = useState(false);
  const [toast,    setToast]    = useState(null); // { type: 'success'|'error', msg }
  const [logoutConfirm, setLogoutConfirm] = useState(false);

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  // ── Save profile section ───────────────────────────────────────────────────
  const handleSaveProfile = async () => {
    if (!currentUser || !userProfile) return;
    setSaving(true);
    try {
      let finalPicture = userProfile.profilePicture || 'tech';

      if (pendingPhoto) {
        try {
          const sRef = storageRef(storage, `avatars/${currentUser.uid}.jpg`);
          await uploadString(sRef, pendingPhoto, 'data_url');
          finalPicture = await getDownloadURL(sRef);
        } catch {
          // Firebase Storage may be restricted — fall back to base64 in Firestore
          finalPicture = pendingPhoto;
        }
        setPendingPhoto(null);
      }

      const cleanUsername = username.trim().startsWith('@')
        ? username.trim()
        : `@${username.trim()}`;

      await setUserProfile({
        ...userProfile,
        fullName:       displayName.trim() || userProfile.fullName,
        username:       cleanUsername,
        bio:            bio.trim(),
        profilePicture: finalPicture,
      });

      showToast('success', 'Profile saved successfully.');
    } catch (err) {
      console.error('Save profile error:', err);
      showToast('error', 'Failed to save profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // ── Save social links section ──────────────────────────────────────────────
  const [savingSocial, setSavingSocial] = useState(false);

  const handleSaveSocial = async () => {
    if (!currentUser || !userProfile) return;
    setSavingSocial(true);
    try {
      await setUserProfile({
        ...userProfile,
        socialLinks,
      });
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
    : 'Joined MasterOS';

  return (
    <div className="flex min-h-screen bg-background text-on-surface radial-glow-bg">
      <Sidebar />

      <main className="flex-grow overflow-y-auto relative z-10">
        <Header hideSearch hideStreak hideLogo />

        <div className="max-w-2xl mx-auto px-6 pb-16 space-y-6 animate-page-transition">

          {/* Page title */}
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight">Settings</h2>
            <p className="text-xs text-on-surface-variant mt-1">Manage your profile, social links, and account.</p>
          </div>

          {/* ── Toast ─────────────────────────────────────────────────────── */}
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

          {/* ═══════════ A) PROFILE ═══════════════════════════════════════════ */}
          <Section title="Profile" icon="person">
            {/* Photo row */}
            <div className="flex items-center gap-4 mb-5 pb-5 border-b border-white/5">
              <div className="relative shrink-0">
                <AvatarDisplay src={previewSrc} sizeCls="w-16 h-16" iconCls="text-2xl" />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-0.5 -right-0.5 w-6 h-6 rounded-full bg-primary border-2 border-background flex items-center justify-center hover:bg-primary/80 transition-colors cursor-pointer shadow-lg"
                  title="Change photo"
                >
                  <span className="material-symbols-outlined text-white text-xs">edit</span>
                </button>
              </div>
              <div>
                <p className="text-sm font-bold text-white">Profile Photo</p>
                <p className="text-[11px] text-on-surface-variant mt-0.5 leading-relaxed">PNG, JPG, or WebP. Max 5 MB.<br />You can pan and zoom before applying.</p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-2 text-[11px] font-bold text-primary hover:text-primary/80 transition-colors cursor-pointer flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">upload</span>
                  Upload new photo
                </button>
                {pendingPhoto && (
                  <p className="text-[10px] text-emerald-400 font-semibold mt-1 flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">check_circle</span>
                    New photo ready — save to apply
                  </p>
                )}
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            </div>

            {/* Fields */}
            <div className="space-y-4">
              <InputRow label="Display Name">
                <TextInput
                  id="setting-name"
                  value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                  placeholder="Your full name"
                  maxLength={60}
                />
              </InputRow>
              <InputRow label="Username">
                <TextInput
                  id="setting-username"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="@username"
                  maxLength={30}
                />
              </InputRow>
              <InputRow label={`Bio (${bio.length}/160)`}>
                <textarea
                  id="setting-bio"
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  placeholder="Tell peers something about yourself..."
                  rows={3}
                  maxLength={160}
                  className="w-full bg-[#0D0D14] border border-white/5 rounded-lg px-3.5 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/30 focus:outline-none focus:border-primary transition-colors resize-none"
                />
              </InputRow>

              <div className="flex justify-end pt-1">
                <button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="flex items-center gap-2 px-5 py-2 bg-primary rounded-xl text-sm font-bold text-white hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed transition-all cursor-pointer shadow-[0_0_12px_rgba(139,92,246,0.25)]"
                >
                  {saving ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Saving…
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-sm">save</span>
                      Save Profile
                    </>
                  )}
                </button>
              </div>
            </div>
          </Section>

          {/* ═══════════ B) SOCIAL LINKS ══════════════════════════════════════ */}
          <Section title="Social Links" icon="share">
            <p className="text-[11px] text-on-surface-variant mb-4 leading-relaxed">
              Links are displayed as icons on your public profile. URLs are never shown publicly.
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
                  <div className="flex-1 min-w-0">
                    <input
                      type="url"
                      value={socialLinks[key]}
                      onChange={e => setSocialLinks(prev => ({ ...prev, [key]: e.target.value }))}
                      placeholder={placeholder}
                      className="w-full bg-[#0D0D14] border border-white/5 rounded-lg px-3 py-2 text-xs text-on-surface placeholder:text-on-surface-variant/25 focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  <div className="text-[10px] font-bold text-on-surface-variant w-16 shrink-0 hidden sm:block">{label}</div>
                </div>
              ))}
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={handleSaveSocial}
                disabled={savingSocial}
                className="flex items-center gap-2 px-5 py-2 bg-primary rounded-xl text-sm font-bold text-white hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed transition-all cursor-pointer shadow-[0_0_12px_rgba(139,92,246,0.25)]"
              >
                {savingSocial ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving…
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-sm">save</span>
                    Save Links
                  </>
                )}
              </button>
            </div>
          </Section>

          {/* ═══════════ C) ACCOUNT ═══════════════════════════════════════════ */}
          <Section title="Account" icon="manage_accounts">
            <div className="space-y-3">
              {[
                {
                  label: 'Email Address',
                  value: currentUser?.email || '—',
                  icon: 'email',
                },
                {
                  label: 'User ID',
                  value: userId || userProfile?.userId || '—',
                  icon: 'badge',
                },
                {
                  label: 'Member Since',
                  value: joinDate,
                  icon: 'calendar_today',
                },
              ].map(({ label, value, icon }) => (
                <div key={label} className="flex items-center gap-3 p-3 bg-[#0D0D14] rounded-xl border border-white/5">
                  <span className="material-symbols-outlined text-on-surface-variant text-base shrink-0">{icon}</span>
                  <div className="min-w-0">
                    <p className="text-[10px] text-on-surface-variant uppercase font-bold tracking-wider">{label}</p>
                    <p className="text-sm font-semibold text-white truncate mt-0.5 select-all">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* ═══════════ D) DANGER ZONE ═══════════════════════════════════════ */}
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
                <p className="text-sm font-bold text-orange-400">Are you sure you want to log out?</p>
                <p className="text-[11px] text-on-surface-variant">Your data is saved to the cloud and will be available on your next login.</p>
                <div className="flex gap-2.5 pt-1">
                  <button
                    onClick={handleLogout}
                    className="flex-1 py-2 rounded-xl bg-orange-500 text-white text-xs font-bold hover:bg-orange-400 transition-colors cursor-pointer"
                  >
                    Yes, Log Out
                  </button>
                  <button
                    onClick={() => setLogoutConfirm(false)}
                    className="flex-1 py-2 rounded-xl bg-white/5 border border-white/5 text-on-surface-variant text-xs font-bold hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </Section>

        </div>
      </main>

      {/* Crop modal */}
      {showCrop && rawImageSrc && (
        <CropModal
          imageSrc={rawImageSrc}
          onSave={handleCropSave}
          onClose={() => setShowCrop(false)}
        />
      )}
    </div>
  );
};

export default Settings;
