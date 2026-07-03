import React, { useState, useContext, useEffect, useMemo } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import StatsCard from '../components/StatsCard';
import Modal from '../components/Modal';
import Button from '../components/Button';
import { TaskContext } from '../context/TaskContext';
import { ProfileSkeleton } from '../components/Skeleton';

const AVATAR_PRESETS = [
  { id: 'tech', label: 'Tech Prodigy', icon: 'developer_mode', bg: 'from-blue-500 to-indigo-600' },
  { id: 'startup', label: 'Founder', icon: 'rocket_launch', bg: 'from-amber-400 to-orange-600' },
  { id: 'design', label: 'Designer', icon: 'palette', bg: 'from-pink-500 to-rose-600' },
  { id: 'ai', label: 'AI Researcher', icon: 'psychology', bg: 'from-purple-500 to-violet-600' },
  { id: 'flow', label: 'Flow Master', icon: 'bolt', bg: 'from-teal-400 to-emerald-600' },
  { id: 'fitness', label: 'Athlete', icon: 'fitness_center', bg: 'from-red-500 to-crimson-600' }
];

const Profile = () => {
  const { userProfile, setUserProfile, userId, friends, allUsers, tasks, workspaces, loading } = useContext(TaskContext);

  const [isLoading, setIsLoading] = useState(true);

  const fullName = userProfile?.fullName || 'User';
  const username = userProfile?.username || '@user';
  const university = userProfile?.universityName || userProfile?.university || '';
  const degree = userProfile?.degreeName || userProfile?.degree || '';
  const branch = userProfile?.branchName || userProfile?.branch || '';
  const year = userProfile?.year || '';
  const skills = userProfile?.skills && userProfile?.skills.length > 0 ? userProfile?.skills : [];
  const currentlyLearning = userProfile?.currentlyLearning || [];
  const avatar = userProfile?.profilePicture || 'tech';
  const connections = friends ? friends.length : 0;
  const bio = userProfile?.bio || 'Focused on building clean, performant applications and leveling up every day.';
  const fitness = userProfile?.fitness;

  const xpValue = userProfile?.xp >= 1000 ? `${(userProfile.xp / 1000).toFixed(1)}k` : `${userProfile?.xp || 0}`;
  const streakValue = `${userProfile?.streak || 0}`;

  const leaderboardList = [...(allUsers || [])].sort((a, b) => (b.xp || 0) - (a.xp || 0));
  const myIndex = leaderboardList.findIndex(u => u.userId === userProfile?.userId);
  const globalRank = (userProfile?.xp > 0 && myIndex !== -1) ? `#${myIndex + 1}` : 'Unranked';

  const ALL_BADGES = useMemo(() => {
    return [
      { id: 'rank-1', label: 'Rank #1', category: 'Rank', icon: '🥇', desc: 'Reach Rank #1 on the Leaderboard', unlocked: globalRank === '#1' },
      { id: 'rank-2', label: 'Rank #2', category: 'Rank', icon: '🥈', desc: 'Reach Rank #2 on the Leaderboard', unlocked: globalRank === '#2' },
      { id: 'rank-3', label: 'Rank #3', category: 'Rank', icon: '🥉', desc: 'Reach Rank #3 on the Leaderboard', unlocked: globalRank === '#3' },

      { id: 'streak-7', label: '7 Day Streak', category: 'Streak', icon: '🔥', desc: 'Maintain focus for 7 straight days', unlocked: (userProfile?.streak || 0) >= 7 },
      { id: 'streak-30', label: '30 Day Streak', category: 'Streak', icon: '🔥', desc: 'Maintain focus for 30 straight days', unlocked: (userProfile?.streak || 0) >= 30 },
      { id: 'streak-100', label: '100 Day Streak', category: 'Streak', icon: '🔥', desc: 'Maintain focus for 100 straight days', unlocked: (userProfile?.streak || 0) >= 100 },
      { id: 'streak-365', label: '365 Day Streak', category: 'Streak', icon: '🔥', desc: 'Maintain focus for 365 straight days', unlocked: (userProfile?.streak || 0) >= 365 },

      { id: 'xp-bronze', label: 'Bronze', category: 'XP', icon: '🥉', desc: 'Accumulate over 1,000 focus XP points', unlocked: (userProfile?.xp || 0) >= 1000 },
      { id: 'xp-silver', label: 'Silver', category: 'XP', icon: '🥈', desc: 'Accumulate over 5,000 focus XP points', unlocked: (userProfile?.xp || 0) >= 5000 },
      { id: 'xp-gold', label: 'Gold', category: 'XP', icon: '🥇', desc: 'Accumulate over 10,000 focus XP points', unlocked: (userProfile?.xp || 0) >= 10000 },
      { id: 'xp-platinum', label: 'Platinum', category: 'XP', icon: '💎', desc: 'Accumulate over 25,000 focus XP points', unlocked: (userProfile?.xp || 0) >= 25000 },
      { id: 'xp-diamond', label: 'Diamond', category: 'XP', icon: '💠', desc: 'Accumulate over 50,000 focus XP points', unlocked: (userProfile?.xp || 0) >= 50000 },

      { id: 'learn-html', label: 'Completed HTML', category: 'Learning', icon: '📚', desc: 'Tick off all HTML roadmap topics', unlocked: tasks.filter(t => t.done && t.text.toLowerCase().includes('html')).length > 0 },
      { id: 'learn-proj', label: 'First Project', category: 'Learning', icon: '🚀', desc: 'Build and deploy your first roadmap project', unlocked: workspaces.length >= 1 },
      { id: 'learn-tasks', label: 'First 100 Tasks', category: 'Learning', icon: '💻', desc: 'Complete 100 tasks on your todos list', unlocked: tasks.filter(t => t.done).length >= 100 },
      { id: 'learn-goal', label: 'Goal Completed', category: 'Learning', icon: '🎯', desc: 'Fulfill your primary milestones', unlocked: tasks.filter(t => t.isPinned && t.done).length >= 1 }
    ];
  }, [globalRank, userProfile, tasks, workspaces]);

  useEffect(() => {
    if (!loading) {
      setIsLoading(false);
    }
  }, [loading]);


  const presetAvatar = AVATAR_PRESETS.find(p => p.id === avatar);

  const [isBioModalOpen, setIsBioModalOpen] = useState(false);
  const [bioText, setBioText] = useState(bio);

  // Social links state
  const socialLinks = userProfile?.socialLinks || {};
  const [isSocialModalOpen, setIsSocialModalOpen] = useState(false);
  const [socialForm, setSocialForm] = useState({
    github: '',
    linkedin: '',
    instagram: '',
    twitter: '',
    portfolio: ''
  });

  const openSocialModal = () => {
    setSocialForm({
      github: socialLinks.github || '',
      linkedin: socialLinks.linkedin || '',
      instagram: socialLinks.instagram || '',
      twitter: socialLinks.twitter || '',
      portfolio: socialLinks.portfolio || ''
    });
    setIsSocialModalOpen(true);
  };

  const handleSaveSocial = (e) => {
    e.preventDefault();
    setUserProfile((prev) => ({
      ...prev,
      socialLinks: { ...socialForm }
    }));
    setIsSocialModalOpen(false);
  };

  const SOCIAL_ICONS = [
    { key: 'github',    faClass: 'fa-brands fa-github',    label: 'GitHub',    color: '#E2E8F0' },
    { key: 'linkedin',  faClass: 'fa-brands fa-linkedin',  label: 'LinkedIn',  color: '#0A66C2' },
    { key: 'instagram', faClass: 'fa-brands fa-instagram', label: 'Instagram', color: '#E1306C' },
    { key: 'twitter',   faClass: 'fa-brands fa-x-twitter', label: 'X / Twitter', color: '#E2E8F0' },
    { key: 'portfolio', faClass: 'fa-solid fa-globe',      label: 'Portfolio', color: '#A78BFA' }
  ];

  const handleSaveBio = (e) => {
    e.preventDefault();
    setUserProfile((prev) => ({
      ...prev,
      bio: bioText
    }));
    setIsBioModalOpen(false);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-background text-on-surface radial-glow-bg select-none">
        <Sidebar />
        <main className="flex-grow p-8 overflow-y-auto no-scrollbar relative z-10">
          <Header hideSearch={true} hideStreak={true} hideLogo={true} />
          <div className="w-full mt-8">
            <ProfileSkeleton />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background text-on-surface radial-glow-bg select-none">
      <Sidebar />
      
      <main className="flex-grow p-8 overflow-y-auto no-scrollbar relative z-10">
        <Header hideSearch={true} hideStreak={true} hideLogo={true} />
        
        <div className="w-full mt-8 space-y-8 animate-page-transition">
          {/* Header Card */}
          <div className="flex items-center gap-6 p-8 rounded-2xl bg-[#111118] border border-white/5 relative overflow-hidden">
            <div className="h-20 w-20 rounded-full overflow-hidden border-2 border-primary p-0.5 shadow-2xl flex items-center justify-center bg-background shrink-0">
              {presetAvatar ? (
                <div className={`w-full h-full rounded-full bg-gradient-to-tr ${presetAvatar.bg} flex items-center justify-center text-white`}>
                  <span className="material-symbols-outlined text-3xl font-bold">{presetAvatar.icon}</span>
                </div>
              ) : (
                <img
                  className="w-full h-full object-cover rounded-full"
                  alt="Profile Avatar"
                  src={avatar}
                />
              )}
            </div>
            <div className="flex-grow min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-3xl font-bold text-white leading-tight">{fullName}</h2>
                <span className="text-[10px] text-on-surface-variant bg-white/5 px-2 py-0.5 rounded font-mono uppercase">User ID: {userId}</span>
              </div>
              <p className="text-primary font-bold text-sm mt-1 uppercase tracking-wider">{username}</p>
              
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-on-surface-variant text-[11px] font-bold uppercase tracking-wider">
                <span>{university}</span>
                <span>•</span>
                <span>{degree}</span>
                {branch && <><span>•</span><span>{branch}</span></>}
                <span>•</span>
                <span>{year}</span>
              </div>

              {/* Social Links Row */}
              <div className="flex items-center gap-3 mt-4">
                {SOCIAL_ICONS.map(({ key, faClass, label, color }) => {
                  const url = socialLinks[key];
                  if (!url) return null;
                  return (
                    <a
                      key={key}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={label}
                      onClick={e => { e.stopPropagation(); window.open(url, '_blank', 'noopener,noreferrer'); e.preventDefault(); }}
                      className="group w-8 h-8 rounded-lg flex items-center justify-center bg-white/5 border border-white/10 hover:border-primary/40 hover:bg-primary/10 transition-all duration-200 hover:scale-110"
                      style={{ color }}
                    >
                      <i className={`${faClass} text-sm`} />
                    </a>
                  );
                })}
                <button
                  onClick={openSocialModal}
                  className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/5 border border-white/5 hover:border-primary/20 hover:bg-white/10 text-on-surface-variant hover:text-white transition-all cursor-pointer"
                  title="Edit Social Links"
                >
                  <span className="material-symbols-outlined text-[15px]">add_link</span>
                </button>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <StatsCard title="Total XP" value={xpValue} unit="XP" icon="workspace_premium" />
            <StatsCard title="Current Streak" value={streakValue} unit="Days" icon="local_fire_department" />
            <StatsCard title="Connections" value={connections.toString()} unit="Peers" icon="groups" />
            <StatsCard title="Global Rank" value={globalRank} unit="Developer" icon="military_tech" />
          </div>

          {/* Fitness Stats Card if Onboarded */}
          {fitness && (
            <div className="p-6 bg-[#111118] border border-primary/20 rounded-2xl relative overflow-hidden group">
              <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />
              <div className="flex items-center gap-2 text-primary mb-4">
                <span className="material-symbols-outlined">fitness_center</span>
                <h4 className="font-bold text-xs uppercase tracking-widest text-white">Fitness Profiling Parameters</h4>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-6">
                <div className="space-y-1.5">
                  <span className="text-[9px] uppercase tracking-wider text-on-surface-variant block font-bold">Height</span>
                  <span className="text-base font-bold text-white">{fitness.height || '174cm'}</span>
                </div>
                <div className="space-y-1.5">
                  <span className="text-[9px] uppercase tracking-wider text-on-surface-variant block font-bold">Weight</span>
                  <span className="text-base font-bold text-white">{fitness.weight || '79kg'}</span>
                </div>
                <div className="space-y-1.5">
                  <span className="text-[9px] uppercase tracking-wider text-on-surface-variant block font-bold">Target Weight</span>
                  <span className="text-base font-bold text-white">{fitness.targetWeight || '72kg'}</span>
                </div>
                <div className="space-y-1.5">
                  <span className="text-[9px] uppercase tracking-wider text-on-surface-variant block font-bold">Fitness Goal</span>
                  <span className="text-base font-bold text-white">{fitness.goal || 'Muscle Gain'}</span>
                </div>
                <div className="space-y-1.5">
                  <span className="text-[9px] uppercase tracking-wider text-on-surface-variant block font-bold">Experience Level</span>
                  <span className="text-base font-bold text-white">{fitness.experience || 'Intermediate'}</span>
                </div>
              </div>
            </div>
          )}

          {/* Core Info Panels */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Bio Card */}
            <div className="lg:col-span-6 bg-[#111118] border border-white/5 p-8 rounded-2xl space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">About Me &amp; Bio</h3>
                  <button 
                    onClick={() => { setBioText(bio); setIsBioModalOpen(true); }}
                    className="p-1.5 rounded hover:bg-white/5 text-on-surface-variant hover:text-white transition-colors cursor-pointer"
                    title="Edit Bio"
                  >
                    <span className="material-symbols-outlined text-[18px]">edit</span>
                  </button>
                </div>
                <p className="text-sm text-on-surface-variant leading-relaxed italic">
                  "{bio}"
                </p>

                <div className="pt-4 space-y-2">
                  <h4 className="font-bold text-white uppercase text-xs tracking-wider">
                    Known Skills {skills.length > 0 && <span className="text-on-surface-variant font-normal">({skills.length})</span>}
                  </h4>
                  {skills.length > 0 ? (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {skills.map((skill, idx) => (
                        <span key={idx} className="bg-primary/10 border border-primary/20 px-3 py-1 rounded text-xs font-semibold text-primary">
                          {skill}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-on-surface-variant italic pt-1">No skills added yet. Update in Settings.</p>
                  )}
                </div>

                {currentlyLearning.length > 0 && (
                  <div className="pt-4 space-y-2 border-t border-white/5">
                    <h4 className="font-bold text-secondary uppercase text-xs tracking-wider">Currently Learning ({currentlyLearning.length})</h4>
                    <div className="flex flex-wrap gap-2 pt-2">
                      {currentlyLearning.map((topic, idx) => (
                        <span key={idx} className="bg-secondary/10 border border-secondary/20 px-3 py-1 rounded text-xs font-semibold text-secondary">
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Badges System Card */}
            <div className="lg:col-span-6 bg-[#111118] border border-white/5 p-8 rounded-2xl space-y-5">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-white/5 pb-4">Achievements &amp; Badges</h3>
              <div className="grid grid-cols-4 gap-3.5 max-h-[300px] overflow-y-auto pr-1 no-scrollbar">
                {ALL_BADGES.map((badge) => (
                  <div 
                    key={badge.id} 
                    className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center gap-1.5 transition-all duration-300 relative group cursor-help ${
                      badge.unlocked 
                        ? 'bg-primary/5 border-primary/20 hover:bg-primary/10 hover:border-primary/30' 
                        : 'bg-white/1 border-white/5 opacity-20'
                    }`}
                  >
                    <span className="text-2xl leading-none">{badge.icon}</span>
                    <span className={`text-[9px] font-black uppercase tracking-wider block ${badge.unlocked ? 'text-white' : 'text-on-surface-variant'}`}>{badge.label}</span>
                    
                    {/* Tooltip */}
                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-[#111118] border border-white/10 p-2.5 rounded-lg text-[10px] font-medium w-40 z-50 text-center opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 shadow-2xl text-on-surface-variant">
                      <p className="font-bold text-white mb-0.5">{badge.label}</p>
                      <p className="leading-tight text-[9px]">{badge.desc}</p>
                      <p className="mt-1 font-black uppercase text-[8px] tracking-wider text-primary">({badge.category} Badge)</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </main>

      <Modal isOpen={isBioModalOpen} onClose={() => setIsBioModalOpen(false)} title="Edit Bio">
        <form onSubmit={handleSaveBio} className="space-y-5">
          <div className="space-y-2">
            <label className="block text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">Bio Description</label>
            <textarea
              value={bioText}
              onChange={(e) => setBioText(e.target.value)}
              className="w-full bg-[#111118] border border-white/5 rounded-lg p-3 text-xs text-on-surface focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 h-28 resize-none"
              placeholder="Tell other peers about your focus goals..."
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
            <Button variant="ghost" onClick={() => setIsBioModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>

      {/* SOCIAL LINKS MODAL */}
      <Modal isOpen={isSocialModalOpen} onClose={() => setIsSocialModalOpen(false)} title="Social Links">
        <form onSubmit={handleSaveSocial} className="space-y-5">
          <p className="text-xs text-on-surface-variant">Add your profile URLs. Only icons will appear publicly. Leave blank to hide.</p>
          <div className="space-y-3">
            {SOCIAL_ICONS.map(({ key, faClass, label, color }) => (
              <div key={key} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0" style={{ color }}>
                  <i className={`${faClass} text-sm`} />
                </div>
                <input
                  type="url"
                  value={socialForm[key]}
                  onChange={e => setSocialForm(prev => ({ ...prev, [key]: e.target.value }))}
                  placeholder={`${label} profile URL`}
                  className="flex-1 bg-[#111118] border border-white/5 rounded-lg px-3 py-2 text-xs text-on-surface focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                />
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
            <Button variant="ghost" onClick={() => setIsSocialModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Save Links</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Profile;
