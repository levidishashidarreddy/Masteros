import React, { useState, useContext, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Button from '../components/Button';
import InputField from '../components/InputField';
import { TaskContext } from '../context/TaskContext';
import { SearchableSingleSelect, SearchableMultiSelect } from '../components/SearchableSelect';
import { storage } from '../firebase';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';

// Import JSON datasets
import universities from '../data/universities.json';
import degrees from '../data/degrees.json';
import branches from '../data/branches.json';
import skillsData from '../data/skills.json';
import goalsData from '../data/goals.json';

const COUNTRIES = [
  { id: 'in', name: 'India' },
  { id: 'us', name: 'United States' },
  { id: 'uk', name: 'United Kingdom' },
  { id: 'ca', name: 'Canada' },
  { id: 'sg', name: 'Singapore' },
  { id: 'au', name: 'Australia' }
];

const TIMEZONES = [
  { id: 'ist', name: 'GMT+5:30 (IST)' },
  { id: 'est', name: 'GMT-5:00 (EST)' },
  { id: 'pst', name: 'GMT-8:00 (PST)' },
  { id: 'gmt', name: 'GMT+0:00 (GMT)' },
  { id: 'sgt', name: 'GMT+8:00 (SGT)' }
];

const THEMES = [
  { id: 'default', label: 'Violet (Default)', color: '#7C3AED' },
  { id: 'indigo',  label: 'Indigo',           color: '#4F46E5' },
  { id: 'teal',   label: 'Teal',              color: '#0D9488' },
  { id: 'sunset', label: 'Sunset',            color: '#EA580C' }
];

// ==================== CropModal ====================
function CropModal({ imageSrc, onSave, onClose }) {
  const canvasRef = useRef(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [lastPos, setLastPos] = useState(null);
  const imgRef = useRef(new window.Image());
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    const img = imgRef.current;
    img.onload = () => setImgLoaded(true);
    img.src = imageSrc;
  }, [imageSrc]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !imgLoaded) return;
    const ctx = canvas.getContext('2d');
    const size = canvas.width;
    ctx.clearRect(0, 0, size, size);

    // Clip to circle
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

    // Overlay ring
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2 - 1, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(139,92,246,0.8)';
    ctx.lineWidth = 2;
    ctx.stroke();
  }, [imgLoaded, zoom, offset]);

  useEffect(() => { draw(); }, [draw]);

  const handleMouseDown = (e) => {
    setDragging(true);
    setLastPos({ x: e.clientX, y: e.clientY });
  };
  const handleMouseMove = (e) => {
    if (!dragging || !lastPos) return;
    const dx = e.clientX - lastPos.x;
    const dy = e.clientY - lastPos.y;
    setOffset(prev => ({ x: prev.x + dx, y: prev.y + dy }));
    setLastPos({ x: e.clientX, y: e.clientY });
  };
  const handleMouseUp = () => setDragging(false);

  const handleSave = () => {
    const canvas = canvasRef.current;
    onSave(canvas.toDataURL('image/jpeg', 0.85));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#111118] border border-white/10 rounded-2xl p-6 flex flex-col items-center gap-5 shadow-2xl w-[340px]">
        <div className="flex items-center justify-between w-full">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Crop Profile Photo</h3>
          <button onClick={onClose} className="p-1 rounded hover:bg-white/10 text-on-surface-variant hover:text-white transition-colors cursor-pointer">
            <span className="material-symbols-outlined text-base">close</span>
          </button>
        </div>
        <canvas
          ref={canvasRef}
          width={240}
          height={240}
          className="rounded-full cursor-grab active:cursor-grabbing touch-none select-none"
          style={{ background: '#0D0D14' }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />
        <div className="w-full space-y-1">
          <label className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">zoom_in</span>
            Zoom
          </label>
          <input
            type="range" min={1} max={4} step={0.05}
            value={zoom}
            onChange={e => setZoom(parseFloat(e.target.value))}
            className="w-full accent-primary cursor-pointer"
          />
        </div>
        <p className="text-[10px] text-on-surface-variant/70 text-center">Drag to pan · scroll slider to zoom</p>
        <div className="flex gap-3 w-full">
          <Button type="button" variant="ghost" className="flex-1 justify-center" onClick={onClose}>Cancel</Button>
          <Button type="button" variant="primary" className="flex-1 justify-center" onClick={handleSave}>Apply Photo</Button>
        </div>
      </div>
    </div>
  );
}

// ==================== Settings ====================
const Settings = () => {
  const navigate = useNavigate();
  const { privacySettings, setPrivacySettings, userProfile, setUserProfile, userId, logout } = useContext(TaskContext);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // ---- Personal fields ----
  const [profileName,   setProfileName]   = useState(userProfile?.fullName  || 'User');
  const [usernameVal,   setUsernameVal]   = useState(userProfile?.username  || '@user');
  const [profileEmail,  setProfileEmail]  = useState(() => {
    const u = userProfile?.username || '@user';
    return `${u.replace('@', '')}@masteros.dev`;
  });
  const [bioVal,        setBioVal]        = useState(userProfile?.bio       || '');

  // ---- Selection state ----
  const [univId,    setUnivId]    = useState(userProfile?.universityId || '');
  const [univName,  setUnivName]  = useState(userProfile?.universityName || userProfile?.university || '');
  const [degId,     setDegId]     = useState(userProfile?.degreeId    || '');
  const [degName,   setDegName]   = useState(userProfile?.degreeName  || userProfile?.degree   || '');
  const [brId,      setBrId]      = useState(userProfile?.branchId    || '');
  const [brName,    setBrName]    = useState(userProfile?.branchName  || userProfile?.branch   || '');
  const [countryVal,   setCountryVal]   = useState(userProfile?.country   || 'India');
  const [timezoneVal,  setTimezoneVal]  = useState(userProfile?.timezone  || 'GMT+5:30 (IST)');
  const [skillsVal,    setSkillsVal]    = useState(userProfile?.skills    || []);
  const [learningVal,  setLearningVal]  = useState(userProfile?.currentlyLearning || []);
  const [goalsVal,     setGoalsVal]     = useState(userProfile?.goals     || []);

  // ---- Theme ----
  const [themePref, setThemePref] = useState(userProfile?.themePreference || 'default');

  // ---- Social links ----
  const [socialLinks, setSocialLinks] = useState({
    github:    userProfile?.socialLinks?.github    || '',
    linkedin:  userProfile?.socialLinks?.linkedin  || '',
    instagram: userProfile?.socialLinks?.instagram || '',
    twitter:   userProfile?.socialLinks?.twitter   || '',
    portfolio: userProfile?.socialLinks?.portfolio || ''
  });

  // ---- Sync when userProfile changes (on first load) ----
  useEffect(() => {
    if (!userProfile) return;
    setProfileName(userProfile.fullName  || 'User');
    setUsernameVal(userProfile.username  || '@user');
    setBioVal(userProfile.bio            || '');
    setUnivId(userProfile.universityId   || '');
    setUnivName(userProfile.universityName || userProfile.university || '');
    setDegId(userProfile.degreeId        || '');
    setDegName(userProfile.degreeName    || userProfile.degree || '');
    setBrId(userProfile.branchId         || '');
    setBrName(userProfile.branchName     || userProfile.branch || '');
    setCountryVal(userProfile.country    || 'India');
    setTimezoneVal(userProfile.timezone  || 'GMT+5:30 (IST)');
    setSkillsVal(userProfile.skills      || []);
    setLearningVal(userProfile.currentlyLearning || []);
    setGoalsVal(userProfile.goals        || []);
    setThemePref(userProfile.themePreference || 'default');
    setSocialLinks({
      github:    userProfile.socialLinks?.github    || '',
      linkedin:  userProfile.socialLinks?.linkedin  || '',
      instagram: userProfile.socialLinks?.instagram || '',
      twitter:   userProfile.socialLinks?.twitter   || '',
      portfolio: userProfile.socialLinks?.portfolio || ''
    });
  }, [userProfile?.userId]);

  // ---- Profile photo ----
  const [photoPreview,    setPhotoPreview]    = useState(null); // base64 for crop
  const [croppedPhoto,    setCroppedPhoto]    = useState(null); // final base64 result
  const [showCropModal,   setShowCropModal]   = useState(false);
  const [photoUploading,  setPhotoUploading]  = useState(false);
  const fileInputRef = useRef(null);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setPhotoPreview(ev.target.result);
      setShowCropModal(true);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleCropSave = (dataUrl) => {
    setCroppedPhoto(dataUrl);
    setShowCropModal(false);
  };

  // ---- Toggles ----
  const [toggles, setToggles] = useState({
    notifications: true,
    weeklyReport: true,
    publicProfile: false,
    aiSuggestions: true
  });

  const handleToggle = (key) => {
    setToggles({ ...toggles, [key]: !toggles[key] });
  };

  // ---- Save ----
  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    let finalPicture = userProfile?.profilePicture || 'tech';

    if (croppedPhoto) {
      setPhotoUploading(true);
      try {
        // Try Firebase Storage first
        const storageRef = ref(storage, `avatars/${userId}.jpg`);
        await uploadString(storageRef, croppedPhoto, 'data_url');
        finalPicture = await getDownloadURL(storageRef);
      } catch {
        // Fallback: store base64 directly in Firestore via userProfile
        finalPicture = croppedPhoto;
      }
      setPhotoUploading(false);
    }

    const cleanUsername = usernameVal.trim().startsWith('@') ? usernameVal.trim() : `@${usernameVal.trim()}`;
    const updatedProfile = {
      ...userProfile,
      fullName: profileName,
      username: cleanUsername,
      bio: bioVal,
      universityId: univId,
      universityName: univName,
      university: univName,
      degreeId: degId,
      degreeName: degName,
      degree: degName,
      branchId: brId,
      branchName: brName,
      branch: brName,
      country: countryVal,
      timezone: timezoneVal,
      skills: skillsVal,
      currentlyLearning: learningVal,
      goals: goalsVal,
      themePreference: themePref,
      socialLinks,
      profilePicture: finalPicture
    };
    setUserProfile(updatedProfile);

    // Apply theme immediately
    document.documentElement.setAttribute('data-theme', themePref === 'default' ? '' : themePref);

    setCroppedPhoto(null);
    setIsSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // ---- Logout confirmation ----
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = async () => {
    if (logout) await logout();
  };

  // ---- Current avatar display ----
  const AVATAR_PRESETS = [
    { id: 'tech',    bg: 'from-blue-500 to-indigo-600',    icon: 'developer_mode' },
    { id: 'startup', bg: 'from-amber-400 to-orange-600',   icon: 'rocket_launch'  },
    { id: 'design',  bg: 'from-pink-500 to-rose-600',      icon: 'palette'        },
    { id: 'ai',      bg: 'from-purple-500 to-violet-600',  icon: 'psychology'     },
    { id: 'flow',    bg: 'from-teal-400 to-emerald-600',   icon: 'bolt'           },
    { id: 'fitness', bg: 'from-red-500 to-crimson-600',    icon: 'fitness_center' }
  ];
  const currentPic = croppedPhoto || userProfile?.profilePicture || 'tech';
  const preset = AVATAR_PRESETS.find(p => p.id === currentPic);

  return (
    <div className="flex min-h-screen bg-background text-on-surface radial-glow-bg">
      <Sidebar />
      <main className="flex-grow p-8 overflow-y-auto no-scrollbar relative z-10">
        <Header hideSearch={true} hideStreak={true} hideLogo={true} />

        <div className="w-full mt-4 space-y-8 animate-page-transition">
          <div className="animate-text-reveal">
            <h2 className="text-3xl font-bold text-white tracking-tight mb-2">Settings</h2>
            <p className="text-on-surface-variant text-sm font-medium">Configure your workspace modules, notifications, and API details.</p>
          </div>

          {/* Save Success Banner */}
          {saveSuccess && (
            <div className="flex items-center gap-3 px-5 py-3.5 bg-emerald-500/10 border border-emerald-500/25 rounded-xl animate-fade-in">
              <span className="material-symbols-outlined text-emerald-400 text-base">check_circle</span>
              <p className="text-xs font-semibold text-emerald-400">Settings saved successfully.</p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* =================== MAIN FORM =================== */}
            <form onSubmit={handleSave} className="lg:col-span-8 space-y-8">

              {/* ---- Profile Photo Section ---- */}
              <div className="bg-[#111118] border border-white/5 p-8 rounded-2xl space-y-6">
                <h3 className="text-lg font-bold text-white border-b border-white/5 pb-4 uppercase tracking-wider">Profile Photo</h3>
                <div className="flex items-center gap-6">
                  {/* Current avatar preview */}
                  <div className="relative shrink-0">
                    {preset ? (
                      <div className={`w-20 h-20 rounded-full bg-gradient-to-tr ${preset.bg} flex items-center justify-center text-white shadow-xl`}>
                        <span className="material-symbols-outlined text-3xl">{preset.icon}</span>
                      </div>
                    ) : (
                      <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-primary/40 shadow-xl">
                        <img src={currentPic} alt="avatar" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-primary flex items-center justify-center shadow-lg hover:scale-110 transition-transform cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-white text-sm">edit</span>
                    </button>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-bold text-white">Upload Custom Photo</p>
                    <p className="text-xs text-on-surface-variant leading-relaxed">PNG, JPG or WebP · max 5 MB. You'll be able to crop it before saving.</p>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="mt-1 px-4 py-2 text-xs font-bold bg-white/5 border border-white/10 hover:bg-white/10 rounded-lg transition-all cursor-pointer text-white flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-sm">upload</span>
                      Choose Photo
                    </button>
                    {croppedPhoto && (
                      <p className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">check_circle</span>
                        New photo ready — save to apply
                      </p>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoChange}
                  />
                </div>
              </div>

              {/* ---- Personal Details ---- */}
              <div className="bg-[#111118] border border-white/5 p-8 rounded-2xl space-y-8">
                <h3 className="text-lg font-bold text-white border-b border-white/5 pb-4 uppercase tracking-wider">Personal Details</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    id="profile-name"
                    label="Display Name"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                  />
                  <InputField
                    id="profile-username"
                    label="Username"
                    value={usernameVal}
                    onChange={(e) => setUsernameVal(e.target.value)}
                  />
                  <InputField
                    id="profile-id"
                    label="User ID (Read Only)"
                    value={userProfile?.userId || userId}
                    disabled
                    className="opacity-60 cursor-not-allowed"
                  />
                  <InputField
                    id="profile-email"
                    label="Email Address"
                    type="email"
                    value={profileEmail}
                    onChange={(e) => setProfileEmail(e.target.value)}
                  />

                  <div className="col-span-1 md:col-span-2 space-y-2">
                    <label className="block text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">Bio</label>
                    <textarea
                      id="profile-bio"
                      value={bioVal}
                      onChange={(e) => setBioVal(e.target.value)}
                      placeholder="Tell peers something about yourself..."
                      rows={3}
                      maxLength={240}
                      className="w-full bg-[#0D0D14] border border-white/5 rounded-lg px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary resize-none"
                    />
                    <p className="text-[10px] text-on-surface-variant/60 text-right">{bioVal.length}/240</p>
                  </div>

                  {/* Academic fields */}
                  <div className="space-y-2">
                    <label className="block text-[10px] uppercase font-bold text-on-surface-variant tracking-wider font-semibold">University</label>
                    <SearchableSingleSelect
                      options={universities}
                      value={univId}
                      onChange={(opt) => { setUnivId(opt.id); setUnivName(opt.name); }}
                      placeholder="Search University..."
                      customRequestLabel="Request New University"
                      onCustomRequest={(query) => { setUnivId('custom_univ'); setUnivName(query); }}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[10px] uppercase font-bold text-on-surface-variant tracking-wider font-semibold">Degree</label>
                    <SearchableSingleSelect
                      options={degrees}
                      value={degId}
                      onChange={(opt) => { setDegId(opt.id); setDegName(opt.name); }}
                      placeholder="Select Degree..."
                      customRequestLabel="Add Custom Degree"
                      onCustomRequest={(query) => { setDegId(query.toLowerCase().replace(/\s+/g, '_')); setDegName(query); }}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[10px] uppercase font-bold text-on-surface-variant tracking-wider font-semibold">Branch</label>
                    <SearchableSingleSelect
                      options={branches}
                      value={brId}
                      onChange={(opt) => { setBrId(opt.id); setBrName(opt.name); }}
                      placeholder="Select Branch..."
                      customRequestLabel="Add Custom Branch"
                      onCustomRequest={(query) => { setBrId(query.toLowerCase().replace(/\s+/g, '_')); setBrName(query); }}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[10px] uppercase font-bold text-on-surface-variant tracking-wider font-semibold">Country</label>
                    <SearchableSingleSelect
                      options={COUNTRIES}
                      value={countryVal}
                      onChange={(opt) => setCountryVal(opt.name)}
                      placeholder="Select Country..."
                      customRequestLabel="Add Custom Country"
                      onCustomRequest={(query) => setCountryVal(query)}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[10px] uppercase font-bold text-on-surface-variant tracking-wider font-semibold">Timezone</label>
                    <SearchableSingleSelect
                      options={TIMEZONES}
                      value={timezoneVal}
                      onChange={(opt) => setTimezoneVal(opt.name)}
                      placeholder="Select Timezone..."
                      customRequestLabel="Add Custom Timezone"
                      onCustomRequest={(query) => setTimezoneVal(query)}
                    />
                  </div>

                  <div className="col-span-1 md:col-span-2 space-y-2">
                    <label className="block text-[10px] uppercase font-bold text-on-surface-variant tracking-wider font-semibold">Skills &amp; Technologies</label>
                    <SearchableMultiSelect
                      options={skillsData}
                      selectedValues={skillsVal}
                      onChange={(vals) => setSkillsVal(vals)}
                      placeholder="Search and add skills..."
                      categoryField="category"
                    />
                  </div>

                  <div className="col-span-1 md:col-span-2 space-y-2">
                    <label className="block text-[10px] uppercase font-bold text-on-surface-variant tracking-wider font-semibold">Currently Learning</label>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {[
                        'Web Development', 'DSA & Algorithms', 'Python', 'Java', 'C++',
                        'JavaScript', 'AI / Machine Learning', 'DevOps & Cloud', 'Cybersecurity',
                        'App Development', 'Database Design', 'System Design', 'UI/UX Design',
                        'Competitive Programming', 'Open Source', 'Blockchain'
                      ].map(topic => {
                        const active = learningVal.includes(topic);
                        return (
                          <button
                            key={topic}
                            type="button"
                            onClick={() => setLearningVal(prev => active ? prev.filter(t => t !== topic) : [...prev, topic])}
                            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                              active
                                ? 'bg-secondary/20 border-secondary text-white'
                                : 'bg-[#0D0D14]/50 border-white/5 text-on-surface-variant hover:text-white'
                            }`}
                          >
                            {active ? '✓ ' : '+ '}{topic}
                          </button>
                        );
                      })}
                    </div>
                    {learningVal.length > 0 && (
                      <p className="text-[10px] text-secondary font-medium mt-2">{learningVal.length} topic{learningVal.length > 1 ? 's' : ''} selected</p>
                    )}
                  </div>

                  <div className="col-span-1 md:col-span-2 space-y-2">
                    <label className="block text-[10px] uppercase font-bold text-on-surface-variant tracking-wider font-semibold">Goals</label>
                    <SearchableMultiSelect
                      options={goalsData}
                      selectedValues={goalsVal}
                      onChange={(vals) => setGoalsVal(vals)}
                      placeholder="Search and add goals..."
                    />
                  </div>
                </div>
              </div>

              {/* ---- Social Links ---- */}
              <div className="bg-[#111118] border border-white/5 p-8 rounded-2xl space-y-6">
                <h3 className="text-lg font-bold text-white border-b border-white/5 pb-4 uppercase tracking-wider">Social Links</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {[
                    { key: 'github',    label: 'GitHub',       icon: 'fa-brands fa-github',    placeholder: 'https://github.com/username',        color: '#E2E8F0' },
                    { key: 'linkedin',  label: 'LinkedIn',     icon: 'fa-brands fa-linkedin',  placeholder: 'https://linkedin.com/in/username',    color: '#0A66C2' },
                    { key: 'instagram', label: 'Instagram',    icon: 'fa-brands fa-instagram', placeholder: 'https://instagram.com/username',      color: '#E1306C' },
                    { key: 'twitter',   label: 'X / Twitter',  icon: 'fa-brands fa-x-twitter', placeholder: 'https://twitter.com/username',        color: '#E2E8F0' },
                    { key: 'portfolio', label: 'Portfolio',    icon: 'fa-solid fa-globe',      placeholder: 'https://yourportfolio.com',           color: '#A78BFA' }
                  ].map(({ key, label, icon, placeholder, color }) => (
                    <div key={key} className="space-y-1.5">
                      <label className="flex items-center gap-2 text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">
                        <i className={`${icon} text-sm`} style={{ color }} />
                        {label}
                      </label>
                      <input
                        type="url"
                        value={socialLinks[key]}
                        onChange={(e) => setSocialLinks(prev => ({ ...prev, [key]: e.target.value }))}
                        placeholder={placeholder}
                        className="w-full bg-[#0D0D14] border border-white/5 rounded-lg px-3 py-2.5 text-xs text-on-surface placeholder:text-on-surface-variant/30 focus:outline-none focus:border-primary transition-colors"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* ---- Theme Preference ---- */}
              <div className="bg-[#111118] border border-white/5 p-8 rounded-2xl space-y-6">
                <h3 className="text-lg font-bold text-white border-b border-white/5 pb-4 uppercase tracking-wider">Theme Preference</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {THEMES.map(theme => (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() => setThemePref(theme.id)}
                      className={`flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                        themePref === theme.id
                          ? 'border-primary bg-primary/10'
                          : 'border-white/5 bg-white/2 hover:border-white/15'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-full shadow-lg" style={{ background: theme.color }} />
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${themePref === theme.id ? 'text-white' : 'text-on-surface-variant'}`}>
                        {theme.label}
                      </span>
                      {themePref === theme.id && (
                        <span className="material-symbols-outlined text-primary text-base">check_circle</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* ---- Preferences Toggles ---- */}
              <div className="bg-[#111118] border border-white/5 p-8 rounded-2xl space-y-6">
                <h4 className="font-bold text-white uppercase text-xs tracking-wider">Preferences</h4>
                <div className="space-y-6">
                  {[
                    { key: 'notifications',  title: 'Push Notifications',            desc: 'Receive instant notifications for completed milestones and task alerts.' },
                    { key: 'weeklyReport',   title: 'Weekly momentum digest',         desc: 'Deliver a weekly PDF compilation of focus hours directly to your inbox.' },
                    { key: 'publicProfile',  title: 'Public Proof-of-Work Page',      desc: 'Publish your progress widgets and heatmaps on a crawlable public web node.' },
                    { key: 'aiSuggestions', title: 'AI Companion Activated',         desc: 'Enable LLM predictions and text reveal milestones suggestion feeds.' }
                  ].map(({ key, title, desc }) => (
                    <div key={key} className="flex items-center justify-between">
                      <div>
                        <h5 className="font-bold text-sm text-white">{title}</h5>
                        <p className="text-xs text-on-surface-variant leading-relaxed">{desc}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleToggle(key)}
                        className={`w-11 h-6 rounded-full transition-colors relative flex items-center cursor-pointer shrink-0 ml-4 ${toggles[key] ? 'bg-primary' : 'bg-white/10'}`}
                      >
                        <span className={`w-4 h-4 rounded-full bg-background absolute transition-all ${toggles[key] ? 'right-1' : 'left-1'}`} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* ---- Privacy Controls ---- */}
              <div className="bg-[#111118] border border-white/5 p-8 rounded-2xl space-y-6">
                <h4 className="font-bold text-white uppercase text-xs tracking-wider">Privacy Controls</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {[
                    {
                      label: 'Profile Visibility',
                      field: 'profileVisibility',
                      options: ['Public', 'Friends Only', 'Private'],
                      optionLabels: ['Public Profile', 'Friends Only Visibility', 'Private Profile']
                    },
                    {
                      label: 'Who can see skills & XP',
                      field: 'showSkills',
                      options: ['Everyone', 'Friends Only', 'Only Me'],
                      optionLabels: ['Everyone', 'Friends Only', 'Only Me']
                    },
                    {
                      label: 'Who can send follow requests',
                      field: 'allowRequests',
                      options: ['Everyone', 'Friends Only'],
                      optionLabels: ['Everyone', 'Friends Only']
                    },
                    {
                      label: 'Who can invite to collaborations',
                      field: 'allowCollaborations',
                      options: ['Everyone', 'Friends Only', 'No One'],
                      optionLabels: ['Everyone', 'Friends Only', 'No One']
                    }
                  ].map(({ label, field, options, optionLabels }) => (
                    <div key={field} className="space-y-2">
                      <label className="block text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">{label}</label>
                      <select
                        value={privacySettings?.[field] || options[0]}
                        onChange={(e) => setPrivacySettings({ ...privacySettings, [field]: e.target.value })}
                        className="w-full bg-[#0D0D14] border border-white/5 rounded-lg p-3 text-on-surface focus:outline-none focus:border-primary text-xs"
                      >
                        {options.map((opt, i) => (
                          <option key={opt} value={opt}>{optionLabels[i]}</option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button type="submit" variant="primary" disabled={isSaving}>
                  {isSaving ? (
                    <span className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      {photoUploading ? 'Uploading photo...' : 'Saving...'}
                    </span>
                  ) : 'Save Settings'}
                </Button>
              </div>
            </form>

            {/* =================== SIDEBAR COLUMN =================== */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-[#111118] border border-white/5 p-6 rounded-2xl space-y-4">
                <h4 className="font-bold text-white uppercase text-xs tracking-wider">Account Level</h4>
                <div className="p-5 bg-primary-container/20 rounded-xl border border-primary/20 flex flex-col justify-between h-36">
                  <div>
                    <h5 className="font-bold text-primary text-base">MasterOS Pro</h5>
                    <p className="text-[11px] text-on-surface-variant mt-1">Unlimited roadmaps, team invites, and WebGL analytics.</p>
                  </div>
                  <span className="text-[10px] text-primary uppercase font-bold tracking-widest leading-none">Pro Tier Active</span>
                </div>
              </div>

              <div className="bg-[#111118] border border-white/5 p-6 rounded-2xl space-y-4">
                <h4 className="font-bold text-white uppercase text-xs tracking-wider">Dashboard Settings</h4>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Configure card visibility, custom widgets order, and dashboard grid layout.
                </p>
                <Button
                  type="button"
                  variant="secondary"
                  className="w-full justify-center"
                  onClick={() => navigate('/settings/customize')}
                >
                  Customize Dashboard
                </Button>
              </div>

              <div className="bg-[#111118] border border-white/5 p-6 rounded-2xl space-y-4">
                <h4 className="font-bold text-white uppercase text-xs tracking-wider">Danger Zone</h4>

                {/* Log Out */}
                {!showLogoutConfirm ? (
                  <button
                    type="button"
                    onClick={() => setShowLogoutConfirm(true)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/20 hover:bg-orange-500/20 hover:text-orange-300 transition-all text-xs font-bold cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-base">logout</span>
                    Log Out
                  </button>
                ) : (
                  <div className="space-y-3 p-3 bg-orange-500/5 border border-orange-500/20 rounded-lg animate-fade-in">
                    <p className="text-xs text-orange-400 font-semibold">Are you sure you want to log out?</p>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex-1 px-3 py-2 rounded-lg bg-orange-500 text-white text-xs font-bold hover:bg-orange-400 transition-all cursor-pointer"
                      >
                        Yes, Log Out
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowLogoutConfirm(false)}
                        className="flex-1 px-3 py-2 rounded-lg bg-white/5 text-on-surface-variant text-xs font-bold hover:bg-white/10 transition-all cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Delete Workspace */}
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full justify-center bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 border border-red-500/20"
                >
                  Delete Workspace
                </Button>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* ====== Crop Modal ====== */}
      {showCropModal && photoPreview && (
        <CropModal
          imageSrc={photoPreview}
          onSave={handleCropSave}
          onClose={() => setShowCropModal(false)}
        />
      )}
    </div>
  );
};

export default Settings;
