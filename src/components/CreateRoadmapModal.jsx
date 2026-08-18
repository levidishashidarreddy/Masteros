import React, { useState, useContext, useMemo } from 'react';
import Modal from './Modal';
import Button from './Button';
import { TaskContext } from '../context/TaskContext';
import { generateRoadmapFromGemini } from '../utils/gemini';

const CATEGORIES = [
  'Programming',
  'Web Development',
  'Data / AI',
  'Mobile Development',
  'Cybersecurity',
  'Career',
  'Other'
];

const CreateRoadmapModal = ({ isOpen, onClose, onSave, initialMode = 'ai' }) => {
  const { workspaces, tasks } = useContext(TaskContext);

  const [step, setStep] = useState(1);
  const [mode, setMode] = useState(initialMode); // 'ai' | 'manual'
  const [roadmapName, setRoadmapName] = useState('');
  const [learningGoal, setLearningGoal] = useState('');
  const [category, setCategory] = useState('Programming');

  // Manual Skills State
  const [manualSkills, setManualSkills] = useState([
    { id: 'sk-1', title: 'Fundamentals', isParallel: false, prereqId: '' },
    { id: 'sk-2', title: 'Core Concepts', isParallel: false, prereqId: 'sk-1' }
  ]);

  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Extract user's currently learned skills from workspaces/tasks
  const userCurrentSkills = useMemo(() => {
    const skillsSet = new Set();
    (workspaces || []).forEach(ws => {
      if (ws.technology) skillsSet.add(ws.technology);
      if (ws.title) skillsSet.add(ws.title.replace(/workspace/i, '').trim());
    });
    (tasks || []).forEach(t => {
      if (t.done && t.text) {
        const text = t.text.toLowerCase();
        if (text.includes('html')) skillsSet.add('HTML');
        if (text.includes('css')) skillsSet.add('CSS');
        if (text.includes('javascript') || text.includes('js')) skillsSet.add('JavaScript');
        if (text.includes('c++')) skillsSet.add('C++');
        if (text.includes('python')) skillsSet.add('Python');
        if (text.includes('react')) skillsSet.add('React');
      }
    });
    return Array.from(skillsSet).filter(Boolean);
  }, [workspaces, tasks]);

  const handleReset = () => {
    setStep(1);
    setMode('ai');
    setRoadmapName('');
    setLearningGoal('');
    setCategory('Programming');
    setManualSkills([
      { id: 'sk-1', title: 'Fundamentals', isParallel: false, prereqId: '' },
      { id: 'sk-2', title: 'Core Concepts', isParallel: false, prereqId: 'sk-1' }
    ]);
    setErrorMsg('');
    setIsGenerating(false);
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const handleAddManualSkill = () => {
    const newId = `sk-${Date.now()}`;
    const lastSkill = manualSkills[manualSkills.length - 1];
    setManualSkills(prev => [
      ...prev,
      {
        id: newId,
        title: '',
        isParallel: false,
        prereqId: lastSkill ? lastSkill.id : ''
      }
    ]);
  };

  const handleRemoveManualSkill = (id) => {
    if (manualSkills.length <= 1) return;
    setManualSkills(prev => prev.filter(s => s.id !== id));
  };

  const handleUpdateManualSkill = (id, field, value) => {
    setManualSkills(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    if (!roadmapName.trim()) {
      setErrorMsg('Please enter a roadmap name.');
      return;
    }
    setErrorMsg('');
    setStep(2);
  };

  const handleSubmitRoadmap = async () => {
    setErrorMsg('');

    if (mode === 'manual') {
      const validSkills = manualSkills.filter(s => s.title.trim().length > 0);
      if (validSkills.length === 0) {
        setErrorMsg('Please add at least one valid skill to your roadmap.');
        return;
      }

      const formattedSkills = validSkills.map((sk, idx) => ({
        id: sk.id || `sk-${idx}`,
        title: sk.title.trim().toUpperCase(),
        category: category,
        done: false,
        status: idx === 0 ? 'current' : sk.isParallel ? 'parallel' : 'future',
        isCurrent: idx === 0,
        isParallel: Boolean(sk.isParallel),
        dependencies: sk.prereqId ? [validSkills.find(v => v.id === sk.prereqId)?.title.trim().toUpperCase()].filter(Boolean) : [],
        why: `Skill ${idx + 1} in your custom ${roadmapName} roadmap.`
      }));

      const newRoadmap = {
        title: roadmapName.trim(),
        description: learningGoal.trim() || `${category} learning path.`,
        category,
        isAiGenerated: false,
        targetRole: roadmapName.trim(),
        estimatedTime: '~2–4 weeks',
        skills: formattedSkills
      };

      onSave(newRoadmap);
      handleClose();
      return;
    }

    // ✨ AI Mode Creation
    setIsGenerating(true);
    try {
      const knownSkillsStr = userCurrentSkills.length > 0 ? userCurrentSkills.join(', ') : 'None';
      const promptGoal = `Roadmap Name: ${roadmapName.trim()}.\nGoal: ${learningGoal.trim() || roadmapName.trim()}.\nCategory: ${category}.\nUser Already Known/Learned Skills: [${knownSkillsStr}].`;

      const res = await generateRoadmapFromGemini(
        promptGoal,
        'Intermediate',
        2,
        '4 weeks'
      );

      let generatedSkills = [];

      if (res && res.tracks && res.tracks.length > 0) {
        res.tracks.forEach((track, tIdx) => {
          (track.topics || []).forEach((topic, tpIdx) => {
            const isFirst = tIdx === 0 && tpIdx === 0;
            const isParallel = tpIdx === 1 && tIdx > 0;
            generatedSkills.push({
              id: `sk-ai-${Date.now()}-${tIdx}-${tpIdx}`,
              title: topic.name || `Topic ${tpIdx + 1}`,
              category: track.name || category,
              done: false,
              status: isFirst ? 'current' : isParallel ? 'parallel' : 'future',
              isCurrent: isFirst,
              isParallel: isParallel,
              dependencies: tIdx > 0 ? [res.tracks[tIdx - 1]?.name] : [],
              why: isFirst
                ? `Entry topic for ${roadmapName.trim()}. Starts after your known skills.`
                : `Next recommended skill following ${res.tracks[tIdx - 1]?.name || 'previous topics'}.`
            });
          });
        });
      }

      // Fallback if AI response structure differs
      if (generatedSkills.length === 0) {
        const defaultTopics = [
          { name: `${roadmapName} Fundamentals`, isParallel: false },
          { name: 'Core Principles & Best Practices', isParallel: false },
          { name: 'Advanced Applied Skills', isParallel: true },
          { name: 'Real-world Capstone Project', isParallel: false }
        ];
        generatedSkills = defaultTopics.map((t, idx) => ({
          id: `sk-ai-${Date.now()}-${idx}`,
          title: t.name,
          category: category,
          done: false,
          status: idx === 0 ? 'current' : t.isParallel ? 'parallel' : 'future',
          isCurrent: idx === 0,
          isParallel: t.isParallel,
          dependencies: idx > 0 ? [defaultTopics[idx - 1].name] : [],
          why: `Personalized step based on your learning goal and known skills.`
        }));
      }

      const newRoadmap = {
        title: roadmapName.trim(),
        description: learningGoal.trim() || `AI-generated roadmap for ${roadmapName.trim()}.`,
        category,
        isAiGenerated: true,
        targetRole: roadmapName.trim(),
        estimatedTime: '~2–4 weeks',
        skills: generatedSkills
      };

      onSave(newRoadmap);
      handleClose();
    } catch (err) {
      console.error("Error generating roadmap:", err);
      setErrorMsg('Could not generate roadmap with AI. You can create it manually.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create Roadmap" maxWidth="max-w-2xl">
      <div className="space-y-6 text-on-surface select-none">

        {/* Step Indicator Header */}
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <div className="flex items-center gap-3">
            <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
              step === 1 ? 'bg-primary text-black' : 'bg-primary/20 text-primary border border-primary/30'
            }`}>
              1
            </span>
            <span className="text-xs font-semibold text-zinc-300">Basic Info</span>
            <span className="text-zinc-600">→</span>
            <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
              step === 2 ? 'bg-primary text-black' : 'bg-white/5 text-zinc-500 border border-white/10'
            }`}>
              2
            </span>
            <span className="text-xs font-semibold text-zinc-300">Creation Method</span>
          </div>

          <span className="text-[11px] text-zinc-500 font-medium">Step {step} of 2</span>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">warning</span>
            <span>{errorMsg}</span>
          </div>
        )}

        {/* STEP 1: BASIC INFORMATION */}
        {step === 1 && (
          <form onSubmit={handleNextStep} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Roadmap Name <span className="text-primary">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Full Stack Developer Journey"
                value={roadmapName}
                onChange={(e) => setRoadmapName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white text-sm focus:outline-none focus:border-primary/50 placeholder:text-zinc-600"
                required
                autoFocus
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#0F0F16] border border-white/10 text-white text-sm focus:outline-none focus:border-primary/50 cursor-pointer"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Goal / What do you want to learn?
              </label>
              <textarea
                placeholder="e.g. I want to become a full stack developer and learn the technologies in the correct order, starting after C++."
                value={learningGoal}
                onChange={(e) => setLearningGoal(e.target.value)}
                rows={3}
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white text-sm focus:outline-none focus:border-primary/50 placeholder:text-zinc-600 resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <Button type="submit" variant="primary" className="py-2.5 px-5 text-xs font-bold uppercase tracking-wider">
                Next: Choose Method →
              </Button>
            </div>
          </form>
        )}

        {/* STEP 2: CHOOSE HOW TO CREATE */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              {/* ✨ AI Option Card */}
              <div
                onClick={() => setMode('ai')}
                className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-3 relative overflow-hidden ${
                  mode === 'ai'
                    ? 'bg-primary/10 border-primary/50 shadow-[0_0_20px_rgba(139,92,246,0.15)]'
                    : 'bg-white/[0.02] border-white/10 hover:border-white/20 hover:bg-white/[0.04]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-primary/20 text-primary border border-primary/30 flex items-center justify-center">
                    <span className="material-symbols-outlined text-xl">auto_awesome</span>
                  </div>
                  {mode === 'ai' && (
                    <span className="w-4 h-4 rounded-full bg-primary flex items-center justify-center text-black">
                      <span className="material-symbols-outlined text-[12px] font-bold">check</span>
                    </span>
                  )}
                </div>
                <div>
                  <h4 className="font-space-grotesk text-sm font-bold text-white flex items-center gap-1.5">
                    ✨ Generate with AI
                  </h4>
                  <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                    AI creates a personalized learning path based on your goal and current skills.
                  </p>
                </div>

                {userCurrentSkills.length > 0 && (
                  <div className="pt-2 border-t border-white/5 text-[10px] text-zinc-400">
                    <span className="text-zinc-500 font-semibold">Known skills detected: </span>
                    <span className="text-primary font-medium">{userCurrentSkills.slice(0, 4).join(', ')}</span>
                  </div>
                )}
              </div>

              {/* 🛠 Manual Option Card */}
              <div
                onClick={() => setMode('manual')}
                className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-3 relative overflow-hidden ${
                  mode === 'manual'
                    ? 'bg-primary/10 border-primary/50 shadow-[0_0_20px_rgba(139,92,246,0.15)]'
                    : 'bg-white/[0.02] border-white/10 hover:border-white/20 hover:bg-white/[0.04]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-white/5 text-zinc-300 border border-white/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-xl">build</span>
                  </div>
                  {mode === 'manual' && (
                    <span className="w-4 h-4 rounded-full bg-primary flex items-center justify-center text-black">
                      <span className="material-symbols-outlined text-[12px] font-bold">check</span>
                    </span>
                  )}
                </div>
                <div>
                  <h4 className="font-space-grotesk text-sm font-bold text-white">
                    🛠 Create Manually
                  </h4>
                  <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                    Add skills, reorder sequence, and connect prerequisites manually.
                  </p>
                </div>
              </div>

            </div>

            {/* MANUAL SKILL BUILDER INPUTS */}
            {mode === 'manual' && (
              <div className="bg-[#07070A] border border-white/10 rounded-2xl p-4 space-y-4 max-h-60 overflow-y-auto no-scrollbar">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                    Skills / Learning Sequence
                  </span>
                  <button
                    type="button"
                    onClick={handleAddManualSkill}
                    className="text-xs text-primary hover:text-primary-light font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">add</span>
                    Add Skill
                  </button>
                </div>

                <div className="space-y-3">
                  {manualSkills.map((sk, idx) => (
                    <div key={sk.id} className="p-3 bg-white/[0.02] border border-white/5 rounded-xl space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-zinc-500 font-bold w-5">{idx + 1}.</span>
                        <input
                          type="text"
                          placeholder="e.g. C++ Basics, React, Data Structures"
                          value={sk.title}
                          onChange={(e) => handleUpdateManualSkill(sk.id, 'title', e.target.value)}
                          className="flex-1 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-primary/50"
                        />
                        {manualSkills.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveManualSkill(sk.id)}
                            className="p-1 text-zinc-500 hover:text-red-400 transition-colors cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-base">close</span>
                          </button>
                        )}
                      </div>

                      <div className="flex items-center gap-4 text-[11px] pl-7">
                        <label className="flex items-center gap-1.5 text-zinc-400 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={sk.isParallel}
                            onChange={(e) => handleUpdateManualSkill(sk.id, 'isParallel', e.target.checked)}
                            className="accent-primary rounded"
                          />
                          Parallel Skill (Can be learned alongside another)
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ACTION FOOTER */}
            <div className="flex items-center justify-between pt-4 border-t border-white/5">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                ← Back
              </button>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <Button
                  onClick={handleSubmitRoadmap}
                  disabled={isGenerating}
                  variant="primary"
                  className="py-2.5 px-6 text-xs font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(139,92,246,0.25)]"
                >
                  {isGenerating ? (
                    <span className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                      Generating Roadmap...
                    </span>
                  ) : mode === 'ai' ? (
                    '✨ Generate Roadmap'
                  ) : (
                    'Create Roadmap'
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}

      </div>
    </Modal>
  );
};

export default CreateRoadmapModal;
