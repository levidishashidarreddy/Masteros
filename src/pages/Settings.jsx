import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Button from '../components/Button';
import InputField from '../components/InputField';
import { TaskContext } from '../context/TaskContext';
import { SearchableSingleSelect, SearchableMultiSelect } from '../components/SearchableSelect';

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

const Settings = () => {
  const navigate = useNavigate();
  const { privacySettings, setPrivacySettings, userProfile, setUserProfile, userId } = useContext(TaskContext);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [profileName, setProfileName] = useState(() => {
    return userProfile?.fullName || 'User';
  });
  const [usernameVal, setUsernameVal] = useState(() => {
    return userProfile?.username || '@user';
  });
  const [profileEmail, setProfileEmail] = useState(() => {
    const u = userProfile?.username || '@user';
    return `${u.replace('@', '')}@masteros.dev`;
  });

  // Selection state variables
  const [univId, setUnivId] = useState(userProfile.universityId || '');
  const [univName, setUnivName] = useState(userProfile.universityName || userProfile.university || '');
  const [degId, setDegId] = useState(userProfile.degreeId || '');
  const [degName, setDegName] = useState(userProfile.degreeName || userProfile.degree || '');
  const [brId, setBrId] = useState(userProfile.branchId || '');
  const [brName, setBrName] = useState(userProfile.branchName || userProfile.branch || '');
  const [countryVal, setCountryVal] = useState(userProfile.country || 'India');
  const [timezoneVal, setTimezoneVal] = useState(userProfile.timezone || 'GMT+5:30 (IST)');
  const [skillsVal, setSkillsVal] = useState(userProfile.skills || []);
  const [learningVal, setLearningVal] = useState(userProfile.currentlyLearning || []);
  const [goalsVal, setGoalsVal] = useState(userProfile.goals || []);

  const [toggles, setToggles] = useState({
    notifications: true,
    weeklyReport: true,
    publicProfile: false,
    aiSuggestions: true
  });

  const handleToggle = (key) => {
    setToggles({ ...toggles, [key]: !toggles[key] });
  };

  const handleSave = (e) => {
    e.preventDefault();
    const cleanUsername = usernameVal.trim().startsWith('@') ? usernameVal.trim() : `@${usernameVal.trim()}`;
    const updatedProfile = {
      ...userProfile,
      fullName: profileName,
      username: cleanUsername,
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
      goals: goalsVal
    };
    setUserProfile(updatedProfile);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

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
            {/* Form settings */}
            <form onSubmit={handleSave} className="lg:col-span-8 bg-[#111118] border border-white/5 p-8 rounded-2xl space-y-8">
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
                  value={userProfile.userId || userId}
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

                {/* Standardized Selection Fields */}
                <div className="space-y-2">
                  <label className="block text-[10px] uppercase font-bold text-on-surface-variant tracking-wider font-semibold">University</label>
                  <SearchableSingleSelect
                    options={universities}
                    value={univId}
                    onChange={(opt) => {
                      setUnivId(opt.id);
                      setUnivName(opt.name);
                    }}
                    placeholder="Search University..."
                    customRequestLabel="Request New University"
                    onCustomRequest={(query) => {
                      setUnivId('custom_univ');
                      setUnivName(query);
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] uppercase font-bold text-on-surface-variant tracking-wider font-semibold">Degree</label>
                  <SearchableSingleSelect
                    options={degrees}
                    value={degId}
                    onChange={(opt) => {
                      setDegId(opt.id);
                      setDegName(opt.name);
                    }}
                    placeholder="Select Degree..."
                    customRequestLabel="Add Custom Degree"
                    onCustomRequest={(query) => {
                      setDegId(query.toLowerCase().replace(/\s+/g, '_'));
                      setDegName(query);
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] uppercase font-bold text-on-surface-variant tracking-wider font-semibold">Branch</label>
                  <SearchableSingleSelect
                    options={branches}
                    value={brId}
                    onChange={(opt) => {
                      setBrId(opt.id);
                      setBrName(opt.name);
                    }}
                    placeholder="Select Branch..."
                    customRequestLabel="Add Custom Branch"
                    onCustomRequest={(query) => {
                      setBrId(query.toLowerCase().replace(/\s+/g, '_'));
                      setBrName(query);
                    }}
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

              {/* Toggles */}
              <div className="space-y-6 pt-4 border-t border-white/5">
                <h4 className="font-bold text-white uppercase text-xs tracking-wider">Preferences</h4>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-bold text-sm text-white">Push Notifications</h5>
                      <p className="text-xs text-on-surface-variant leading-relaxed">Receive instant notifications for completed milestones and task alerts.</p>
                    </div>
                    <button 
                      type="button"
                      onClick={() => handleToggle('notifications')}
                      className={`w-11 h-6 rounded-full transition-colors relative flex items-center cursor-pointer ${toggles.notifications ? 'bg-primary' : 'bg-white/10'}`}
                    >
                      <span className={`w-4 h-4 rounded-full bg-background absolute transition-all ${toggles.notifications ? 'right-1' : 'left-1'}`}></span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-bold text-sm text-white">Weekly momentum digest</h5>
                      <p className="text-xs text-on-surface-variant leading-relaxed">Deliver a weekly PDF compilation of focus hours directly to your inbox.</p>
                    </div>
                    <button 
                      type="button"
                      onClick={() => handleToggle('weeklyReport')}
                      className={`w-11 h-6 rounded-full transition-colors relative flex items-center cursor-pointer ${toggles.weeklyReport ? 'bg-primary' : 'bg-white/10'}`}
                    >
                      <span className={`w-4 h-4 rounded-full bg-background absolute transition-all ${toggles.weeklyReport ? 'right-1' : 'left-1'}`}></span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-bold text-sm text-white">Public Proof-of-Work Page</h5>
                      <p className="text-xs text-on-surface-variant leading-relaxed">Publish your progress widgets and heatmaps on a crawlable public web node.</p>
                    </div>
                    <button 
                      type="button"
                      onClick={() => handleToggle('publicProfile')}
                      className={`w-11 h-6 rounded-full transition-colors relative flex items-center cursor-pointer ${toggles.publicProfile ? 'bg-primary' : 'bg-white/10'}`}
                    >
                      <span className={`w-4 h-4 rounded-full bg-background absolute transition-all ${toggles.publicProfile ? 'right-1' : 'left-1'}`}></span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-bold text-sm text-white">AI Companion Activated</h5>
                      <p className="text-xs text-on-surface-variant leading-relaxed">Enable LLM predictions and text reveal milestones suggestion feeds.</p>
                    </div>
                    <button 
                      type="button"
                      onClick={() => handleToggle('aiSuggestions')}
                      className={`w-11 h-6 rounded-full transition-colors relative flex items-center cursor-pointer ${toggles.aiSuggestions ? 'bg-primary' : 'bg-white/10'}`}
                    >
                      <span className={`w-4 h-4 rounded-full bg-background absolute transition-all ${toggles.aiSuggestions ? 'right-1' : 'left-1'}`}></span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Privacy Controls */}
              <div className="space-y-6 pt-6 border-t border-white/5 animate-fade-in">
                <h4 className="font-bold text-white uppercase text-xs tracking-wider">Privacy Controls</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">Profile Visibility</label>
                    <select
                      value={privacySettings?.profileVisibility || 'Public'}
                      onChange={(e) => setPrivacySettings({ ...privacySettings, profileVisibility: e.target.value })}
                      className="w-full bg-[#0D0D14] border border-white/5 rounded-lg p-3 text-on-surface focus:outline-none focus:border-primary text-xs"
                    >
                      <option value="Public">Public Profile</option>
                      <option value="Friends Only">Friends Only Visibility</option>
                      <option value="Private">Private Profile</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">Who can see skills &amp; XP</label>
                    <select
                      value={privacySettings?.showSkills || 'Everyone'}
                      onChange={(e) => setPrivacySettings({ ...privacySettings, showSkills: e.target.value, showXP: e.target.value })}
                      className="w-full bg-[#0D0D14] border border-white/5 rounded-lg p-3 text-on-surface focus:outline-none focus:border-primary text-xs"
                    >
                      <option value="Everyone">Everyone</option>
                      <option value="Friends Only">Friends Only</option>
                      <option value="Only Me">Only Me</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">Who can send follow requests</label>
                    <select
                      value={privacySettings?.allowRequests || 'Everyone'}
                      onChange={(e) => setPrivacySettings({ ...privacySettings, allowRequests: e.target.value })}
                      className="w-full bg-[#0D0D14] border border-white/5 rounded-lg p-3 text-on-surface focus:outline-none focus:border-primary text-xs"
                    >
                      <option value="Everyone">Everyone</option>
                      <option value="Friends Only">Friends Only</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">Who can invite to collaborations</label>
                    <select
                      value={privacySettings?.allowCollaborations || 'Friends'}
                      onChange={(e) => setPrivacySettings({ ...privacySettings, allowCollaborations: e.target.value })}
                      className="w-full bg-[#0D0D14] border border-white/5 rounded-lg p-3 text-on-surface focus:outline-none focus:border-primary text-xs"
                    >
                      <option value="Everyone">Everyone</option>
                      <option value="Friends Only">Friends Only</option>
                      <option value="No One">No One</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-white/5">
                <Button type="submit" variant="primary">
                  Save Settings
                </Button>
              </div>
            </form>

            {/* Sidebar details */}
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
                <Button variant="ghost" className="w-full justify-center bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 border border-red-500/20">
                  Delete Workspace
                </Button>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default Settings;
