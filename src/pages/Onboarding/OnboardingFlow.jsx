import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import InputField from '../../components/InputField';
import { SearchableSingleSelect, SearchableMultiSelect } from '../../components/SearchableSelect';
import { TaskContext } from '../../context/TaskContext';
import { auth } from '../../firebase';


// Import JSON datasets
import universities from '../../data/universities.json';
import degrees from '../../data/degrees.json';
import branches from '../../data/branches.json';
import skillsData from '../../data/skills.json';
import technologies from '../../data/technologies.json';
import goalsData from '../../data/goals.json';

// Group skills by category dynamically
const SKILL_DATABASE = skillsData.reduce((acc, curr) => {
  if (!acc[curr.category]) acc[curr.category] = [];
  acc[curr.category].push(curr.name);
  return acc;
}, {});

const FLAT_SKILLS = Object.values(SKILL_DATABASE).flat();

const AVATAR_PRESETS = [
  { id: 'tech', label: 'Tech Prodigy', icon: 'developer_mode', bg: 'from-blue-500 to-indigo-600' },
  { id: 'startup', label: 'Founder', icon: 'rocket_launch', bg: 'from-amber-400 to-orange-600' },
  { id: 'design', label: 'Designer', icon: 'palette', bg: 'from-pink-500 to-rose-600' },
  { id: 'ai', label: 'AI Researcher', icon: 'psychology', bg: 'from-purple-500 to-violet-600' },
  { id: 'flow', label: 'Flow Master', icon: 'bolt', bg: 'from-teal-400 to-emerald-600' },
  { id: 'fitness', label: 'Athlete', icon: 'fitness_center', bg: 'from-red-500 to-crimson-600' }
];

const GOAL_PRESETS = goalsData.map(g => g.name);

const WORKSPACE_PRESETS = [
  { id: 'web-dev', title: 'Web Development', icon: 'terminal', desc: 'React, Node, and styling frameworks.' },
  { id: 'dsa', title: 'DSA', icon: 'code', desc: 'Data structures & algorithm practice.' },
  { id: 'college', title: 'College', icon: 'school', desc: 'Lecture tracking & assignment notes.' },
  { id: 'startup', title: 'Startup', icon: 'rocket_launch', desc: 'MVP architecture and validation loops.' },
  { id: 'fitness', title: 'Fitness', icon: 'fitness_center', desc: 'Gym cycles and macro metrics.' },
  { id: 'personal', title: 'Personal Growth', icon: 'auto_awesome', desc: 'Habits, reading lists, and journals.' }
];

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

const OnboardingFlow = () => {
  const navigate = useNavigate();
  const { initializeUserCollections } = useContext(TaskContext);
  const [step, setStep] = useState(1);

  // STEP 2: Basic Profile state
  const [fullName, setFullName] = useState(() => auth.currentUser?.displayName || '');
  const [username, setUsername] = useState('');
  const [age, setAge] = useState('');
  const [universityId, setUniversityId] = useState('');
  const [universityName, setUniversityName] = useState('');
  const [degreeId, setDegreeId] = useState('');
  const [degreeName, setDegreeName] = useState('');
  const [branchId, setBranchId] = useState('');
  const [branchName, setBranchName] = useState('');
  const [year, setYear] = useState('2nd Year');
  const [profilePicture, setProfilePicture] = useState(() => auth.currentUser?.photoURL || 'tech'); // avatar preset ID or custom URL
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');
  const [country, setCountry] = useState('India');
  const [timezone, setTimezone] = useState('GMT+5:30 (IST)');

  // STEP 3: Skills & Technologies state
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedTechs, setSelectedTechs] = useState([]);
  const [selectedLearning, setSelectedLearning] = useState([]);
  const [isTechModalOpen, setIsTechModalOpen] = useState(false);
  const [techSearch, setTechSearch] = useState('');
  const [skillSearch, setSkillSearch] = useState('');
  const [customSkillInput, setCustomSkillInput] = useState('');

  // STEP 4: Goals state
  const [selectedGoals, setSelectedGoals] = useState([]);

  // STEP 5: Workspace state
  const [selectedWorkspaces, setSelectedWorkspaces] = useState(['web-dev', 'dsa', 'college']);
  const [customWorkspaces, setCustomWorkspaces] = useState([]);
  const [newWorkspaceText, setNewWorkspaceText] = useState('');

  // STEP 6: Optional Fitness Details state
  const [fitnessHeight, setFitnessHeight] = useState('174cm');
  const [fitnessWeight, setFitnessWeight] = useState('79kg');
  const [fitnessTargetWeight, setFitnessTargetWeight] = useState('72kg');
  const [fitnessGoal, setFitnessGoal] = useState('Muscle Gain');
  const [fitnessExperience, setFitnessExperience] = useState('Intermediate');

  // Inline Validation state
  const [errors, setErrors] = useState({});

  // Loading state
  const [generating, setGenerating] = useState(false);

  const validateStep = (currentStep) => {
    const err = {};
    if (currentStep === 2) {
      if (!fullName.trim()) err.fullName = 'This field is required.';
      if (!age.trim()) err.age = 'This field is required.';
      if (!universityName.trim()) err.university = 'This field is required.';
      if (!degreeName.trim()) err.degree = 'This field is required.';
      if (!branchName.trim()) err.branch = 'This field is required.';

      if (Object.keys(err).length === 0) {
        const generated = '@' + fullName.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
        setUsername(generated);
      }
    }
    if (currentStep === 3) {
      if (selectedSkills.length === 0 && selectedTechs.length === 0 && selectedLearning.length === 0) {
        err.skills = 'Please select at least one known skill, technology, or currently learning topic.';
      }
    }
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  // Skill Add/Remove helpers
  const handleToggleSkill = (skill) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
      // Clear skills validation error
      if (errors.skills) {
        setErrors(prev => {
          const copy = { ...prev };
          delete copy.skills;
          return copy;
        });
      }
    }
  };

  const handleAddCustomSkill = (e) => {
    e.preventDefault();
    const cleanSkill = customSkillInput.trim();
    if (cleanSkill && !selectedSkills.includes(cleanSkill)) {
      setSelectedSkills([...selectedSkills, cleanSkill]);
      setCustomSkillInput('');
      if (errors.skills) {
        setErrors(prev => {
          const copy = { ...prev };
          delete copy.skills;
          return copy;
        });
      }
    }
  };

  // Goal togglers
  const handleToggleGoal = (goal) => {
    if (selectedGoals.includes(goal)) {
      setSelectedGoals(selectedGoals.filter(g => g !== goal));
    } else {
      setSelectedGoals([...selectedGoals, goal]);
    }
  };

  // Workspace togglers
  const handleToggleWorkspacePreset = (wsId) => {
    if (selectedWorkspaces.includes(wsId)) {
      setSelectedWorkspaces(selectedWorkspaces.filter(id => id !== wsId));
    } else {
      setSelectedWorkspaces([...selectedWorkspaces, wsId]);
    }
  };

  const handleAddCustomWorkspace = (e) => {
    e.preventDefault();
    const cleanWs = newWorkspaceText.trim();
    if (cleanWs && !customWorkspaces.includes(cleanWs)) {
      setCustomWorkspaces([...customWorkspaces, cleanWs]);
      setNewWorkspaceText('');
    }
  };

  const handleRemoveCustomWorkspace = (wsName) => {
    setCustomWorkspaces(customWorkspaces.filter(ws => ws !== wsName));
  };

  // Fitness condition checker
  const needsFitnessInfo = () => {
    const combinedWorkspaceNames = [
      ...WORKSPACE_PRESETS.filter(w => selectedWorkspaces.includes(w.id)).map(w => w.title.toLowerCase()),
      ...customWorkspaces.map(w => w.toLowerCase())
    ];
    const goalsMatch = selectedGoals.some(g => ['fitness', 'gym', 'workout'].some(kw => g.toLowerCase().includes(kw)));
    const workspaceMatch = combinedWorkspaceNames.some(w => ['fitness', 'gym', 'workout'].some(kw => w.includes(kw)));
    return goalsMatch || workspaceMatch;
  };

  // Onboarding submission
  const handleComplete = async () => {
    setGenerating(true);
    try {
      const resolvedFullName = fullName || auth.currentUser?.displayName || null;
      const finalUsername = username || (resolvedFullName ? ('@' + resolvedFullName.trim().toLowerCase().replace(/[^a-z0-9]/g, '')) : '@user');
      const finalUserId = 'POS_' + Math.floor(100000 + Math.random() * 900000);

      // Create user profile object
      const userProfile = {
        fullName: resolvedFullName,
        username: finalUsername,
        userId: finalUserId,
        age: age || null,
        universityId: universityId || null,
        universityName: universityName || null,
        university: universityName || null,
        degreeId: degreeId || null,
        degreeName: degreeName || null,
        degree: degreeName || null,
        branchId: branchId || null,
        branchName: branchName || null,
        branch: branchName || null,
        year: year || null,
        profilePicture: customAvatarUrl || profilePicture,
        country: country || null,
        timezone: timezone || null,
        skills: [...new Set([...selectedSkills, ...selectedTechs])],
        currentlyLearning: selectedLearning || [],
        technologies: selectedTechs || [],
        goals: selectedGoals || [],
        connections: 0,
        bio: "We're going to personalize your productivity system.",
        fitness: needsFitnessInfo() ? {
          height: fitnessHeight,
          weight: fitnessWeight,
          targetWeight: fitnessTargetWeight,
          goal: fitnessGoal,
          experience: fitnessExperience
        } : null,
        dashboardWidgets: {
          streak: true,
          tasksDone: true,
          workspaces: true,
          liveProjects: true,
          xp: true,
          studyHours: true,
          leaderboardRank: false,
          focusTasks: true,
          skillsProgress: true,
          assignments: true,
          exams: true,
          activityHeatmap: true
        },
        featuredWorkspaces: selectedWorkspaces
      };

      // Call Firestore initialization helper
      await initializeUserCollections(selectedWorkspaces, customWorkspaces, userProfile);

      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('isOnboarded', 'true');

      // Advance to final welcome screen (step 7)
      setStep(7);
    } catch (err) {
      console.error("Error during onboarding completion:", err);
      setErrors({ submit: err.message || "Failed to complete onboarding. Please try again." });
    } finally {
      setGenerating(false);
    }
  };

  const handleStartJourney = () => {
    navigate('/dashboard');
  };

  // Filter skills by search query
  const filteredDatabaseSkills = FLAT_SKILLS.filter(skill => 
    skill.toLowerCase().includes(skillSearch.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen bg-background text-on-surface select-none radial-glow-bg">
      
      {/* Top Navbar */}
      <nav className="fixed top-0 w-full bg-background/60 backdrop-blur-xl border-b border-white/5 flex justify-between items-center px-8 h-20 z-50">
        <div className="flex items-center gap-3 cursor-pointer animate-fade-in" onClick={() => { if (window.location.pathname !== '/dashboard') navigate('/dashboard'); }}>
          <div className="w-8 h-8 bg-primary-container rounded-lg flex items-center justify-center text-primary border border-primary/20">
            <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              dashboard_customize
            </span>
          </div>
          <span className="font-display-lg text-lg font-bold text-white tracking-tight">
            Master<span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">OS</span>
          </span>
        </div>
        {step <= 6 && (
          <div className="flex items-center gap-4">
            <span className="font-label-md text-label-md text-primary font-bold text-xs bg-primary/10 border border-primary/20 px-3 py-1 rounded-full">
              STEP {step} OF {needsFitnessInfo() ? '6' : '5'}
            </span>
          </div>
        )}
      </nav>

      {/* Main Container */}
      <main className="flex-grow pt-28 pb-32 px-6 flex flex-col items-center justify-center relative">
        
        {/* Progress Tracker */}
        {step <= 6 && (
          <div className="w-72 h-1 bg-white/5 rounded-full overflow-hidden mb-12">
            <div 
              className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500 shadow-[0_0_10px_rgba(139,92,246,0.3)]" 
              style={{ width: `${(step / (needsFitnessInfo() ? 6 : 5)) * 100}%` }}
            />
          </div>
        )}

        <div className="max-w-4xl w-full">
          
          {/* ================= STEP 1: WELCOME SCREEN ================= */}
          {step === 1 && (
            <div className="max-w-xl mx-auto text-center space-y-8 animate-text-reveal">
              <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-tr from-primary to-secondary p-0.5 shadow-2xl flex items-center justify-center">
                <div className="w-full h-full bg-background rounded-[14px] flex items-center justify-center">
                  <span className="material-symbols-outlined text-4xl text-primary animate-pulse">auto_awesome</span>
                </div>
              </div>
              <div className="space-y-4">
                <h1 className="font-display-lg text-4xl md:text-5xl font-black text-white leading-tight tracking-tight">
                  Welcome to MasterOS
                </h1>
                <p className="text-on-surface-variant text-base leading-relaxed max-w-md mx-auto font-medium">
                  "We're going to personalize your productivity system."
                </p>
              </div>
              
              <div className="flex justify-center pt-8">
                <Button variant="primary" className="px-12 py-4 text-base rounded-xl" icon="arrow_forward" onClick={() => setStep(2)}>
                  Continue
                </Button>
              </div>
            </div>
          )}

          {/* ================= STEP 2: BASIC PROFILE ================= */}
          {step === 2 && (
            <div className="space-y-8 animate-text-reveal">
              <div className="text-center max-w-xl mx-auto space-y-2">
                <h2 className="font-display-lg text-3xl font-black text-white">Create Profile</h2>
                <p className="text-on-surface-variant text-sm font-medium">Let's gather some academic and professional identifiers.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                {/* Left Profile avatar preset */}
                <div className="md:col-span-4 bg-[#111118] border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center space-y-6 h-max">
                  <label className="block text-[10px] uppercase font-bold text-on-surface-variant tracking-wider text-center">Profile Avatar</label>
                  
                  <div className="w-24 h-24 rounded-full p-0.5 border-2 border-primary shadow-2xl flex items-center justify-center overflow-hidden">
                    {profilePicture && AVATAR_PRESETS.some(p => p.id === profilePicture) ? (
                      <div className={`w-full h-full rounded-full bg-gradient-to-tr ${AVATAR_PRESETS.find(p => p.id === profilePicture).bg} flex items-center justify-center text-white`}>
                        <span className="material-symbols-outlined text-4xl font-bold">{AVATAR_PRESETS.find(p => p.id === profilePicture).icon}</span>
                      </div>
                    ) : (
                      <img 
                        className="w-full h-full object-cover rounded-full" 
                        src={customAvatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'} 
                        alt="Profile Preview"
                      />
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-2 w-full">
                    {AVATAR_PRESETS.map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => { setProfilePicture(preset.id); setCustomAvatarUrl(''); }}
                        className={`p-2 rounded-xl border flex items-center justify-center bg-gradient-to-tr ${preset.bg} text-white cursor-pointer hover:scale-105 active:scale-95 transition-all ${
                          profilePicture === preset.id ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : 'opacity-65'
                        }`}
                        title={preset.label}
                      >
                        <span className="material-symbols-outlined text-lg">{preset.icon}</span>
                      </button>
                    ))}
                  </div>

                  <div className="w-full border-t border-white/5 pt-4 space-y-2">
                    <InputField
                      id="custom-pic"
                      label="Or Custom Image URL"
                      placeholder="https://..."
                      value={customAvatarUrl}
                      onChange={(e) => {
                        setCustomAvatarUrl(e.target.value);
                        setProfilePicture(e.target.value);
                      }}
                      className="text-xs"
                    />
                  </div>
                </div>

                {/* Right Form */}
                <div className="md:col-span-8 bg-[#111118] border border-white/5 rounded-2xl p-6 space-y-5">
                  <div className="grid grid-cols-1 gap-4">
                    <InputField
                      id="fullName"
                      label="Full Name"
                      placeholder="e.g. Shashidar"
                      value={fullName}
                      onChange={(e) => { setFullName(e.target.value); if (errors.fullName) setErrors(p => ({ ...p, fullName: '' })); }}
                      required
                      error={errors.fullName}
                    />
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <InputField
                      id="age"
                      label="Age"
                      type="number"
                      placeholder="20"
                      value={age}
                      onChange={(e) => { setAge(e.target.value); if (errors.age) setErrors(p => ({ ...p, age: '' })); }}
                      required
                      error={errors.age}
                    />
                    <div className="space-y-2 col-span-3">
                      <label className="block text-[10px] uppercase font-bold text-on-surface-variant tracking-wider text-xs font-semibold">Year of Study</label>
                      <select 
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        className="w-full bg-[#0D0D14] border border-white/5 rounded-lg p-3 text-on-surface focus:outline-none focus:border-primary text-xs"
                      >
                        <option>1st Year</option>
                        <option>2nd Year</option>
                        <option>3rd Year</option>
                        <option>4th Year</option>
                        <option>Postgraduate</option>
                        <option>Graduate / Professional</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="block text-[10px] uppercase font-bold text-on-surface-variant tracking-wider text-xs font-semibold">University / College</label>
                      <SearchableSingleSelect
                        options={universities}
                        value={universityId}
                        onChange={(opt) => {
                          setUniversityId(opt.id);
                          setUniversityName(opt.name);
                          if (errors.university) setErrors(p => ({ ...p, university: '' }));
                        }}
                        placeholder="Search University..."
                        customRequestLabel="Request New University"
                        onCustomRequest={(query) => {
                          alert(`Request sent to add: "${query}". We will review and append this shortly.`);
                          setUniversityId('custom_univ');
                          setUniversityName(query);
                          if (errors.university) setErrors(p => ({ ...p, university: '' }));
                        }}
                        error={errors.university}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-[10px] uppercase font-bold text-on-surface-variant tracking-wider text-xs font-semibold">Degree / Course</label>
                      <SearchableSingleSelect
                        options={degrees}
                        value={degreeId}
                        onChange={(opt) => {
                          setDegreeId(opt.id);
                          setDegreeName(opt.name);
                          if (errors.degree) setErrors(p => ({ ...p, degree: '' }));
                        }}
                        placeholder="Select Degree..."
                        customRequestLabel="Add Custom Degree"
                        onCustomRequest={(query) => {
                          setDegreeId(query.toLowerCase().replace(/\s+/g, '_'));
                          setDegreeName(query);
                          if (errors.degree) setErrors(p => ({ ...p, degree: '' }));
                        }}
                        error={errors.degree}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-[10px] uppercase font-bold text-on-surface-variant tracking-wider text-xs font-semibold">Branch</label>
                      <SearchableSingleSelect
                        options={branches}
                        value={branchId}
                        onChange={(opt) => {
                          setBranchId(opt.id);
                          setBranchName(opt.name);
                          if (errors.branch) setErrors(p => ({ ...p, branch: '' }));
                        }}
                        placeholder="Select Branch..."
                        customRequestLabel="Add Custom Branch"
                        onCustomRequest={(query) => {
                          setBranchId(query.toLowerCase().replace(/\s+/g, '_'));
                          setBranchName(query);
                          if (errors.branch) setErrors(p => ({ ...p, branch: '' }));
                        }}
                        error={errors.branch}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-white/5 pt-4">
                    <div className="space-y-2">
                      <label className="block text-[10px] uppercase font-bold text-on-surface-variant tracking-wider text-xs font-semibold">Country</label>
                      <SearchableSingleSelect
                        options={COUNTRIES}
                        value={country}
                        onChange={(opt) => setCountry(opt.name)}
                        placeholder="Select Country..."
                        customRequestLabel="Add Custom Country"
                        onCustomRequest={(query) => setCountry(query)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-[10px] uppercase font-bold text-on-surface-variant tracking-wider text-xs font-semibold">Timezone</label>
                      <SearchableSingleSelect
                        options={TIMEZONES}
                        value={timezone}
                        onChange={(opt) => setTimezone(opt.name)}
                        placeholder="Select Timezone..."
                        customRequestLabel="Add Custom Timezone"
                        onCustomRequest={(query) => setTimezone(query)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= STEP 3: CURRENT SKILLS ================= */}
          {step === 3 && (
            <div className="space-y-8 animate-text-reveal max-w-2xl mx-auto">
              <div className="text-center max-w-xl mx-auto space-y-2">
                <h2 className="font-display-lg text-3xl font-black text-white">Skills &amp; Technologies</h2>
                <p className="text-on-surface-variant text-sm font-medium">Select your tech stack, programming languages, and skills.</p>
              </div>

              {/* Technologies Section */}
              <div className="bg-[#111118]/60 border border-white/5 p-6 rounded-2xl space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs uppercase font-bold text-primary tracking-wider flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                    Popular Technologies
                  </h4>
                  <button
                    type="button"
                    onClick={() => setIsTechModalOpen(true)}
                    className="text-[10px] text-primary font-bold hover:underline cursor-pointer bg-transparent border-0 uppercase tracking-wider"
                  >
                    + More Technologies
                  </button>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {['Python', 'Java', 'JavaScript', 'C', 'C++', 'SQL', 'React', 'NodeJS', 'TypeScript', 'Go', 'Rust'].map(tech => {
                    const active = selectedTechs.includes(tech);
                    return (
                      <button
                        key={tech}
                        type="button"
                        onClick={() => {
                          if (active) {
                            setSelectedTechs(selectedTechs.filter(t => t !== tech));
                          } else {
                            setSelectedTechs([...selectedTechs, tech]);
                          }
                        }}
                        className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                          active
                            ? 'bg-primary/20 border-primary text-white shadow-[0_0_10px_rgba(139,92,246,0.2)]'
                            : 'bg-[#0D0D14]/50 border-white/5 text-on-surface-variant hover:text-white hover:border-white/10'
                        }`}
                      >
                        {tech}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Skills Section with Multi Select */}
              <div className="bg-[#111118]/60 border border-white/5 p-6 rounded-2xl space-y-4">
                <h4 className="text-xs uppercase font-bold text-primary tracking-wider flex items-center gap-1.5 border-b border-white/5 pb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                  Database Skills &amp; Capabilities
                </h4>
                
                <SearchableMultiSelect
                  options={skillsData}
                  selectedValues={selectedSkills}
                  onChange={(vals) => {
                    setSelectedSkills(vals);
                    if (errors.skills) setErrors(p => { const copy = { ...p }; delete copy.skills; return copy; });
                  }}
                  placeholder="Type to search skills (e.g. Docker, Figma...)"
                  categoryField="category"
                  error={errors.skills}
                />

                {/* Popular skills suggestions by category */}
                <div className="space-y-4 pt-2 overflow-y-auto max-h-60 no-scrollbar">
                  {Object.entries(SKILL_DATABASE).map(([category, list]) => (
                    <div key={category} className="space-y-2">
                      <span className="text-[9px] uppercase font-bold text-on-surface-variant/70 tracking-wider block">{category}</span>
                      <div className="flex flex-wrap gap-1.5">
                        {list.slice(0, 5).map(skill => {
                          const active = selectedSkills.includes(skill);
                          return (
                            <button
                              key={skill}
                              type="button"
                              onClick={() => {
                                if (active) {
                                  setSelectedSkills(selectedSkills.filter(s => s !== skill));
                                } else {
                                  setSelectedSkills([...selectedSkills, skill]);
                                }
                              }}
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                                active
                                  ? 'bg-primary/15 border-primary/40 text-primary'
                                  : 'bg-[#0D0D14]/30 border-white/5 text-on-surface-variant/70 hover:text-white'
                              }`}
                            >
                              + {skill}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Currently Learning Section */}
              <div className="bg-[#111118]/60 border border-white/5 p-6 rounded-2xl space-y-4">
                <div className="flex justify-between items-center border-b border-white/5 pb-3">
                  <h4 className="text-xs uppercase font-bold text-secondary tracking-wider flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
                    Currently Learning
                  </h4>
                  <span className="text-[9px] text-on-surface-variant font-medium italic">For beginners — select what you're exploring</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {[
                    'Web Development', 'DSA & Algorithms', 'Python', 'Java', 'C++',
                    'JavaScript', 'AI / Machine Learning', 'DevOps & Cloud', 'Cybersecurity',
                    'App Development', 'Database Design', 'System Design', 'UI/UX Design',
                    'Competitive Programming', 'Open Source', 'Blockchain'
                  ].map(topic => {
                    const active = selectedLearning.includes(topic);
                    return (
                      <button
                        key={topic}
                        type="button"
                        onClick={() => {
                          if (active) {
                            setSelectedLearning(selectedLearning.filter(t => t !== topic));
                          } else {
                            setSelectedLearning([...selectedLearning, topic]);
                            if (errors.skills) setErrors(p => { const copy = { ...p }; delete copy.skills; return copy; });
                          }
                        }}
                        className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                          active
                            ? 'bg-secondary/20 border-secondary text-white shadow-[0_0_10px_rgba(99,102,241,0.2)]'
                            : 'bg-[#0D0D14]/50 border-white/5 text-on-surface-variant hover:text-white hover:border-white/10'
                        }`}
                      >
                        {active ? '✓ ' : '+ '}{topic}
                      </button>
                    );
                  })}
                </div>
                {selectedLearning.length > 0 && (
                  <p className="text-[10px] text-secondary font-medium">{selectedLearning.length} topic{selectedLearning.length > 1 ? 's' : ''} selected</p>
                )}
              </div>

              {/* Technologies Search Modal */}
              {isTechModalOpen && (
                <div className="fixed inset-0 bg-[#07070a]/90 backdrop-blur-md flex items-center justify-center z-[150] animate-fade-in p-4">
                  <div className="bg-[#111118] border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
                    <div className="p-5 border-b border-white/5 flex justify-between items-center bg-[#0D0D14]/50">
                      <h3 className="font-display-lg text-sm font-bold text-white uppercase tracking-wider">Search Technologies</h3>
                      <button 
                        type="button" 
                        onClick={() => setIsTechModalOpen(false)}
                        className="text-on-surface-variant hover:text-white text-xs font-bold uppercase tracking-wider cursor-pointer"
                      >
                        Close
                      </button>
                    </div>

                    <div className="p-6 overflow-y-auto space-y-6">
                      <SearchableMultiSelect
                        options={technologies}
                        selectedValues={selectedTechs}
                        onChange={(vals) => setSelectedTechs(vals)}
                        placeholder="Search more technologies (e.g. NextJS, Spring Boot)..."
                        customPlaceholder="Add custom tech..."
                      />

                      <div className="space-y-3">
                        <span className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider block">Selected Technologies ({selectedTechs.length})</span>
                        {selectedTechs.length === 0 ? (
                          <p className="text-xs text-on-surface-variant italic">No technologies selected yet.</p>
                        ) : (
                          <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto pr-2 no-scrollbar">
                            {selectedTechs.map(tech => (
                              <span 
                                key={tech}
                                className="bg-primary/10 border border-primary/20 text-primary px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5"
                              >
                                {tech}
                                <button 
                                  type="button" 
                                  onClick={() => setSelectedTechs(selectedTechs.filter(t => t !== tech))} 
                                  className="text-[14px] hover:text-white cursor-pointer"
                                >
                                  ✕
                                </button>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="p-4 border-t border-white/5 bg-[#0D0D14]/40 flex justify-end">
                      <Button variant="primary" className="px-6 py-2 rounded-lg" onClick={() => setIsTechModalOpen(false)}>
                        Save &amp; Close
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================= STEP 4: GOALS ================= */}
          {step === 4 && (
            <div className="max-w-2xl mx-auto space-y-8 animate-text-reveal">
              <div className="text-center space-y-2">
                <h2 className="font-display-lg text-3xl font-black text-white">What are your goals?</h2>
                <p className="text-on-surface-variant text-sm font-medium">Select all target ambitions you want to accomplish inside MasterOS.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {GOAL_PRESETS.map((goal) => {
                  const active = selectedGoals.includes(goal);
                  return (
                    <div
                      key={goal}
                      onClick={() => handleToggleGoal(goal)}
                      className={`bg-[#111118] border p-5 rounded-xl cursor-pointer flex items-center justify-between group transition-all duration-200 hover:border-primary/40 ${
                        active ? 'border-primary bg-primary-container/10 ring-1 ring-primary' : 'border-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`material-symbols-outlined text-lg ${active ? 'text-primary' : 'text-on-surface-variant'}`}>target</span>
                        <span className="text-sm font-semibold text-white">{goal}</span>
                      </div>
                      <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${
                        active ? 'border-primary bg-primary' : 'border-white/20'
                      }`}>
                        {active && <span className="material-symbols-outlined text-[12px] text-white font-bold">check</span>}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Custom Goal Input */}
              <div className="bg-[#111118]/60 border border-white/5 p-6 rounded-2xl space-y-3 max-w-xl mx-auto">
                <span className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider block">Add Custom Goal</span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    id="custom-goal-input"
                    className="flex-grow bg-[#0D0D14] border border-white/5 rounded-xl px-4 py-3 text-xs text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary"
                    placeholder="e.g. Learn System Design..."
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (e.target.value.trim() && !selectedGoals.includes(e.target.value.trim())) {
                          setSelectedGoals([...selectedGoals, e.target.value.trim()]);
                          e.target.value = '';
                        }
                      }
                    }}
                  />
                  <Button 
                    type="button" 
                    variant="secondary" 
                    className="px-5 shrink-0 animate-none hover:scale-105 transition-transform"
                    onClick={() => {
                      const input = document.getElementById('custom-goal-input');
                      if (input && input.value.trim() && !selectedGoals.includes(input.value.trim())) {
                        setSelectedGoals([...selectedGoals, input.value.trim()]);
                        input.value = '';
                      }
                    }}
                  >
                    Add
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* ================= STEP 5: WORKSPACE SETUP ================= */}
          {step === 5 && (
            <div className="space-y-8 animate-text-reveal">
              <div className="text-center max-w-xl mx-auto space-y-2">
                <h2 className="font-display-lg text-3xl font-black text-white">Create Workspaces</h2>
                <p className="text-on-surface-variant text-sm font-medium">Select presets or establish custom project boards to launch your core dashboard.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {WORKSPACE_PRESETS.map((ws) => {
                  const active = selectedWorkspaces.includes(ws.id);
                  return (
                    <div
                      key={ws.id}
                      onClick={() => handleToggleWorkspacePreset(ws.id)}
                      className={`bg-[#111118] border p-5 rounded-xl cursor-pointer flex flex-col justify-between h-36 group transition-all duration-200 hover:border-primary/40 ${
                        active ? 'border-primary bg-primary-container/10' : 'border-white/5'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <span className={`material-symbols-outlined text-2xl ${active ? 'text-primary' : 'text-on-surface-variant'}`}>
                          {ws.icon}
                        </span>
                        <div className={`w-4.5 h-4.5 rounded-full border flex items-center justify-center transition-all ${
                          active ? 'border-primary bg-primary' : 'border-white/20'
                        }`}>
                          {active && <span className="material-symbols-outlined text-[10px] text-white font-bold">check</span>}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-bold text-white text-sm">{ws.title}</h4>
                        <p className="text-xs text-on-surface-variant leading-tight">{ws.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Custom Workspace Builder */}
              <div className="bg-[#111118]/60 border border-white/5 p-6 rounded-2xl space-y-4">
                <h3 className="text-xs uppercase font-bold text-on-surface-variant tracking-wider">Custom Workspaces</h3>
                
                <form onSubmit={handleAddCustomWorkspace} className="flex gap-2">
                  <input
                    type="text"
                    className="flex-grow bg-[#111118] border border-white/5 rounded-xl px-4 py-3.5 text-xs text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary"
                    placeholder="Create a custom workspace board (e.g. Peak Fitness, SRM Robotics...)"
                    value={newWorkspaceText}
                    onChange={(e) => setNewWorkspaceText(e.target.value)}
                  />
                  <Button type="submit" variant="secondary" className="px-6 shrink-0" icon="add">
                    Add
                  </Button>
                </form>

                {customWorkspaces.length > 0 && (
                  <div className="flex flex-wrap gap-2.5 pt-2">
                    {customWorkspaces.map(ws => (
                      <span key={ws} className="px-3.5 py-1.5 bg-[#111118] border border-primary/25 text-primary rounded-full text-xs font-semibold flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">folder</span>
                        {ws}
                        <button type="button" onClick={() => handleRemoveCustomWorkspace(ws)} className="text-xs hover:text-white leading-none">✕</button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ================= STEP 6: OPTIONAL FITNESS DETAILS ================= */}
          {step === 6 && (
            <div className="max-w-xl mx-auto space-y-8 animate-text-reveal">
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center gap-2 text-primary">
                  <span className="material-symbols-outlined text-3xl">fitness_center</span>
                  <h2 className="font-display-lg text-3xl font-black text-white">Fitness Profiling</h2>
                </div>
                <p className="text-on-surface-variant text-sm font-medium">Let's personalize your fitness trackers and metabolic goals.</p>
              </div>

              <div className="bg-[#111118] border border-white/5 p-6 rounded-2xl space-y-5">
                <div className="grid grid-cols-3 gap-4">
                  <InputField
                    id="fit-height"
                    label="Height"
                    placeholder="e.g. 174cm"
                    value={fitnessHeight}
                    onChange={(e) => setFitnessHeight(e.target.value)}
                    required
                  />
                  <InputField
                    id="fit-weight"
                    label="Current Weight"
                    placeholder="e.g. 79kg"
                    value={fitnessWeight}
                    onChange={(e) => setFitnessWeight(e.target.value)}
                    required
                  />
                  <InputField
                    id="fit-target"
                    label="Goal Weight"
                    placeholder="e.g. 72kg"
                    value={fitnessTargetWeight}
                    onChange={(e) => setFitnessTargetWeight(e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-[10px] uppercase font-bold text-on-surface-variant tracking-wider text-xs font-semibold">Fitness Goal</label>
                    <select
                      value={fitnessGoal}
                      onChange={(e) => setFitnessGoal(e.target.value)}
                      className="w-full bg-[#0D0D14] border border-white/5 rounded-lg p-3 text-on-surface focus:outline-none focus:border-primary text-xs font-semibold"
                    >
                      <option>Fat Loss</option>
                      <option>Muscle Gain</option>
                      <option>Endurance</option>
                      <option>Cardiovascular Health</option>
                      <option>Flexibility & Mobility</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[10px] uppercase font-bold text-on-surface-variant tracking-wider text-xs font-semibold">Experience Level</label>
                    <select
                      value={fitnessExperience}
                      onChange={(e) => setFitnessExperience(e.target.value)}
                      className="w-full bg-[#0D0D14] border border-white/5 rounded-lg p-3 text-on-surface focus:outline-none focus:border-primary text-xs font-semibold"
                    >
                      <option>Beginner</option>
                      <option>Intermediate</option>
                      <option>Advanced / Athlete</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= STEP 7: FINAL WELCOME BACK ================= */}
          {step === 7 && (
            <div className="max-w-md mx-auto text-center space-y-8 animate-text-reveal">
              <div className="w-24 h-24 mx-auto rounded-full overflow-hidden p-0.5 border-2 border-primary shadow-2xl flex items-center justify-center bg-[#111118]">
                {profilePicture && AVATAR_PRESETS.some(p => p.id === profilePicture) ? (
                  <div className={`w-full h-full rounded-full bg-gradient-to-tr ${AVATAR_PRESETS.find(p => p.id === profilePicture).bg} flex items-center justify-center text-white`}>
                    <span className="material-symbols-outlined text-4xl font-bold">{AVATAR_PRESETS.find(p => p.id === profilePicture).icon}</span>
                  </div>
                ) : (
                  <img 
                    className="w-full h-full object-cover rounded-full" 
                    src={customAvatarUrl || profilePicture} 
                    alt="Profile Avatar"
                  />
                )}
              </div>

              <div className="space-y-3">
                <h1 className="font-display-lg text-4xl font-black text-white leading-none">
                  Welcome to MasterOS,
                </h1>
                <h2 className="font-display-lg text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent leading-relaxed">
                  {username.startsWith('@') ? username : `@${username || 'shashi'}`}
                </h2>
                <p className="text-on-surface-variant text-base font-medium">
                  We've successfully set up your custom workspaces and learning trackers.
                </p>
              </div>

              <div className="pt-6">
                <button
                  onClick={handleStartJourney}
                  className="w-full bg-gradient-to-r from-primary to-secondary text-white py-4 px-8 rounded-xl font-bold hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2 cursor-pointer text-base font-label-md"
                >
                  Enter MasterOS
                  <span className="material-symbols-outlined">space_dashboard</span>
                </button>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* Loading Overlay */}
      {generating && (
        <div className="fixed inset-0 bg-background/90 backdrop-blur-md z-[100] flex flex-col items-center justify-center space-y-6">
          <div className="w-16 h-16 rounded-full border-4 border-white/5 border-t-primary animate-spin"></div>
          <div className="text-center space-y-2.5">
            <h3 className="font-headline-md text-white text-lg font-bold">Personalizing MasterOS...</h3>
            <p className="text-xs text-on-surface-variant font-medium animate-pulse">Partitioning workspaces, indexing database nodes, configuring dashboard widgets...</p>
          </div>
        </div>
      )}

      {/* Bottom Action Footer */}
      {step > 1 && step <= 6 && (
        <footer className="fixed bottom-0 left-0 w-full z-40 flex justify-center items-center px-8 py-6 bg-background/60 backdrop-blur-xl border-t border-white/5">
          <div className="w-full max-w-4xl flex justify-between items-center px-4">
            
            <Button
              variant="ghost"
              disabled={step === 1 || generating}
              onClick={() => setStep(step - 1)}
              icon="arrow_back"
            >
              Back
            </Button>

            <Button
              variant="primary"
              disabled={generating}
              onClick={() => {
                if (validateStep(step)) {
                  if (step === 5) {
                    if (needsFitnessInfo()) {
                      setStep(6);
                    } else {
                      handleComplete();
                    }
                  } else if (step === 6) {
                    handleComplete();
                  } else {
                    setStep(step + 1);
                  }
                }
              }}
              className="px-8 py-3 rounded-lg"
              icon={(step === 5 && !needsFitnessInfo()) || step === 6 ? 'rocket_launch' : 'arrow_forward'}
            >
              {(step === 5 && !needsFitnessInfo()) || step === 6 ? 'Finish & Build' : 'Continue'}
            </Button>

          </div>
        </footer>
      )}
    </div>
  );
};

export default OnboardingFlow;
