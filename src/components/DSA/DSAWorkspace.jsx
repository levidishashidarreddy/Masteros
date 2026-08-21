import React, { useState, useMemo, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { TaskContext } from '../../context/TaskContext';
import Modal from '../Modal';
import InputField from '../InputField';
import Button from '../Button';
import { 
  DSA_CENTRAL_STORE, 
  countTotalCentralLeafConcepts,
  HARSHA_VERSE_INSPIRATION_DATA
} from '../../data/dsaCentralStore';
import { 
  DATA_STRUCTURES_LIST, 
  ALGORITHMS_LIST, 
  PATTERNS_LIST 
} from '../../data/dsaFullData';
import GlobalDetailOverlay from './GlobalDetailOverlay';
import DSAVisualMap from './DSAVisualMap';

const DSAWorkspace = ({ workspace, updateWorkspace, deleteWorkspace: propDeleteWorkspace }) => {
  const context = useContext(TaskContext);
  const deleteWorkspace = propDeleteWorkspace || context?.deleteWorkspace;
  const navigate = useNavigate();

  // Double Confirmation Delete States
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteStep, setDeleteStep] = useState(1);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const handleFinalDeleteDSAWorkspace = async () => {
    if (!workspace?.id || !deleteWorkspace) return;
    try {
      setIsDeleting(true);
      await deleteWorkspace(workspace.id);
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
      navigate('/workspaces');
    } catch (err) {
      console.error("Failed to delete DSA workspace:", err);
      setIsDeleting(false);
    }
  };
  const [activeTab, setActiveTab] = useState('ROADMAP'); // 'ROADMAP' | 'DATA STRUCTURES' | 'ALGORITHMS' | 'PATTERNS' | 'RESOURCES'
  const [roadmapView, setRoadmapView] = useState('learning'); // 'learning' | 'visual'
  const [resourceSubTab, setResourceSubTab] = useState('Patterns'); // 'Patterns' | 'Data Structures' | 'Algorithms' | 'Inspiration'

  // Expandable tree state for roadmap
  const [expandedNodes, setExpandedNodes] = useState({
    'phase-1': true,
    'algo-thinking': true,
    'arrays-track': true
  });

  // Selected item for global portal overlay drawer
  const [selectedTopic, setSelectedTopic] = useState(null);

  // Pattern notes state
  const [patternNotes, setPatternNotes] = useState(workspace?.patternNotes || {});
  const [activePatternForNotes, setActivePatternForNotes] = useState(null);
  const [noteText, setNoteText] = useState('');

  // Extract completed concepts map from workspace or fallback
  const completedConceptsMap = useMemo(() => {
    return workspace?.dsaCompletedConcepts || {};
  }, [workspace]);

  // Extract pattern solved problems map
  const solvedPatternProblemsMap = useMemo(() => {
    return workspace?.dsaSolvedPatternProblems || {};
  }, [workspace]);

  // Calculate overall progress stats
  const totalLeafConcepts = useMemo(() => countTotalCentralLeafConcepts(), []);
  
  const completedCount = useMemo(() => {
    return Object.values(completedConceptsMap).filter(Boolean).length;
  }, [completedConceptsMap]);

  const overallProgressPct = useMemo(() => {
    return totalLeafConcepts > 0 ? Math.round((completedCount / totalLeafConcepts) * 100) : 0;
  }, [completedCount, totalLeafConcepts]);

  // Toggle individual leaf concept completion
  const handleToggleConcept = (conceptId) => {
    if (!workspace?.id) return;
    const nextMap = {
      ...completedConceptsMap,
      [conceptId]: !completedConceptsMap[conceptId]
    };
    const nextCompletedCount = Object.values(nextMap).filter(Boolean).length;
    const nextPct = Math.round((nextCompletedCount / totalLeafConcepts) * 100);

    updateWorkspace(workspace.id, {
      dsaCompletedConcepts: nextMap,
      dsaProgress: nextPct
    });
  };

  // Toggle pattern problem completion
  const handleTogglePatternProblem = (problemId) => {
    if (!workspace?.id) return;
    const nextMap = {
      ...solvedPatternProblemsMap,
      [problemId]: !solvedPatternProblemsMap[problemId]
    };

    updateWorkspace(workspace.id, {
      dsaSolvedPatternProblems: nextMap
    });
  };

  // Toggle tree node expand/collapse
  const toggleNodeExpand = (nodeId) => {
    setExpandedNodes(prev => ({
      ...prev,
      [nodeId]: !prev[nodeId]
    }));
  };

  // Calculate subtrack concepts count & progress
  const getSubtrackCounts = (subtrack) => {
    if (!subtrack.concepts || subtrack.concepts.length === 0) return { done: 0, total: 0, pct: 0 };
    const done = subtrack.concepts.filter(c => completedConceptsMap[c.id]).length;
    const total = subtrack.concepts.length;
    return { done, total, pct: Math.round((done / total) * 100) };
  };

  // Calculate track concepts count & progress
  const getTrackCounts = (track) => {
    let total = 0;
    let done = 0;
    track.subtracks.forEach(st => {
      st.concepts.forEach(c => {
        total++;
        if (completedConceptsMap[c.id]) done++;
      });
    });
    return { done, total, pct: total > 0 ? Math.round((done / total) * 100) : 0 };
  };

  // Calculate phase concepts count & progress
  const getPhaseCounts = (phase) => {
    let total = 0;
    let done = 0;
    phase.tracks.forEach(tr => {
      tr.subtracks.forEach(st => {
        st.concepts.forEach(c => {
          total++;
          if (completedConceptsMap[c.id]) done++;
        });
      });
    });
    return { done, total, pct: total > 0 ? Math.round((done / total) * 100) : 0 };
  };

  // Save personal notes per pattern
  const handleSavePatternNotes = (patternId) => {
    if (!workspace?.id) return;
    const updatedNotes = {
      ...patternNotes,
      [patternId]: noteText
    };
    setPatternNotes(updatedNotes);
    updateWorkspace(workspace.id, { patternNotes: updatedNotes });
    setActivePatternForNotes(null);
  };

  return (
    <div className="flex-grow p-4 md:p-8 max-w-7xl mx-auto w-full space-y-8 animate-fade-in">
      {/* ─── DSA HEADER ────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden p-6 md:p-8 rounded-3xl bg-surface/70 border border-white/10 backdrop-blur-xl shadow-2xl space-y-6">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 blur-[120px] pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
                DSA Workspace System
              </span>
              <span className="text-xs font-semibold text-on-surface-variant flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Concept-Based Learning Path
              </span>
            </div>
            <h1 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight">
              DSA Learning Map
            </h1>
            <p className="text-sm text-on-surface-variant font-medium">
              Master your concepts. Track your progress. Learn systematically.
            </p>
          </div>

          {/* Action Bar & Stats Bar */}
          <div className="flex flex-wrap items-center gap-4 shrink-0">
            <div className="flex items-center gap-4 sm:gap-6 bg-surface-bright/40 p-4 rounded-2xl border border-white/5 shrink-0">
              <div className="space-y-0.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                  Overall Progress
                </span>
                <div className="text-2xl font-black text-primary">
                  {overallProgressPct}%
                </div>
              </div>

              <div className="w-[1px] h-10 bg-white/10" />

              <div className="space-y-0.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                  Concepts Completed
                </span>
                <div className="text-sm font-extrabold text-white">
                  <span className="text-emerald-400">{completedCount}</span> / {totalLeafConcepts}
                </div>
              </div>
            </div>

            {/* Delete DSA Workspace Button */}
            <button
              type="button"
              onClick={() => { setDeleteStep(1); setDeleteConfirmText(''); setIsDeleteModalOpen(true); }}
              className="px-4 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all duration-200 flex items-center gap-2 bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 hover:border-red-500/40 active:scale-95 cursor-pointer shadow-[0_0_15px_rgba(239,68,68,0.1)] hover:shadow-[0_0_20px_rgba(239,68,68,0.2)] shrink-0"
              title="Delete DSA Workspace"
            >
              <span className="material-symbols-outlined text-base">delete</span>
              <span>Delete Workspace</span>
            </button>
          </div>
        </div>

        {/* Dynamic Progress Bar */}
        <div className="space-y-2 relative z-10">
          <div className="flex justify-between text-xs font-bold text-on-surface-variant">
            <span>DSA Curriculum Progress</span>
            <span className="text-primary">{completedCount} / {totalLeafConcepts} Concepts ({overallProgressPct}%)</span>
          </div>
          <div className="w-full bg-black/40 h-3 rounded-full overflow-hidden p-0.5 border border-white/5">
            <div 
              className="bg-gradient-to-r from-primary via-purple-500 to-emerald-400 h-full rounded-full transition-all duration-500 ease-out shadow-[0_0_15px_rgba(139,92,246,0.3)]"
              style={{ width: `${overallProgressPct}%` }}
            />
          </div>
        </div>

        {/* Compact Inspired By Banner */}
        <div className="relative z-10 pt-2 border-t border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-xl">auto_awesome</span>
            <div className="text-xs">
              <span className="font-bold text-white">✨ Inspired By Harsha Verse</span>
              <span className="text-on-surface-variant block sm:inline sm:ml-2 text-[11px]">
                Educational approach, roadmap, and learning content
              </span>
            </div>
          </div>
          <button
            onClick={() => setSelectedTopic(HARSHA_VERSE_INSPIRATION_DATA)}
            className="px-3 py-1.5 rounded-xl bg-primary/10 text-primary border border-primary/20 text-xs font-bold hover:bg-primary/20 transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
          >
            <span>View Inspiration Resources</span>
            <span className="material-symbols-outlined text-xs">arrow_forward</span>
          </button>
        </div>
      </div>

      {/* ─── MAIN NAVIGATION TABS ───────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <nav className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {[
            { id: 'ROADMAP', label: 'ROADMAP', icon: 'route' },
            { id: 'DATA STRUCTURES', label: 'DATA STRUCTURES', icon: 'account_tree' },
            { id: 'ALGORITHMS', label: 'ALGORITHMS', icon: 'function' },
            { id: 'PATTERNS', label: 'PATTERNS', icon: 'grid_view' },
            { id: 'RESOURCES', label: 'RESOURCES', icon: 'auto_awesome' }
          ].map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 rounded-xl font-label-md text-xs font-bold uppercase tracking-wider transition-all duration-200 flex items-center gap-2 shrink-0 cursor-pointer ${
                  isActive 
                    ? 'bg-primary text-on-primary shadow-[0_0_20px_rgba(139,92,246,0.3)] scale-[1.02]' 
                    : 'bg-surface/50 text-on-surface-variant hover:text-white hover:bg-white/5 border border-white/5'
                }`}
              >
                <span className="material-symbols-outlined text-sm">{tab.icon}</span>
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* View Toggle inside ROADMAP Tab */}
        {activeTab === 'ROADMAP' && (
          <div className="flex items-center gap-1 bg-surface-bright/50 p-1 rounded-xl border border-white/10 self-start sm:self-center">
            <button
              onClick={() => setRoadmapView('learning')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                roadmapView === 'learning' 
                  ? 'bg-primary/20 text-primary border border-primary/30' 
                  : 'text-on-surface-variant hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-xs">format_list_bulleted</span>
              Learning View
            </button>
            <button
              onClick={() => setRoadmapView('visual')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                roadmapView === 'visual' 
                  ? 'bg-primary/20 text-primary border border-primary/30' 
                  : 'text-on-surface-variant hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-xs">hub</span>
              Visual Map
            </button>
          </div>
        )}
      </div>

      {/* ─── TAB 1: ROADMAP ────────────────────────────────────────────── */}
      {activeTab === 'ROADMAP' && (
        <div className="space-y-6">
          {roadmapView === 'visual' ? (
            <DSAVisualMap 
              onSelectTopic={(topic) => setSelectedTopic(topic)}
              completedConceptsMap={completedConceptsMap}
            />
          ) : (
            /* Interactive Expandable Learning Tree View */
            <div className="space-y-6">
              {DSA_CENTRAL_STORE.phases.map((phase) => {
                const isPhaseExpanded = !!expandedNodes[phase.id];
                const phaseCounts = getPhaseCounts(phase);

                return (
                  <div 
                    key={phase.id} 
                    className="rounded-2xl bg-surface/50 border border-white/10 overflow-hidden transition-all duration-300 shadow-lg"
                  >
                    {/* Phase Level Header */}
                    <div 
                      onClick={() => toggleNodeExpand(phase.id)}
                      className="p-5 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors select-none"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className={`material-symbols-outlined text-primary text-xl transition-transform duration-300 ${isPhaseExpanded ? 'rotate-90' : ''}`}>
                          chevron_right
                        </span>
                        <div>
                          <h3 className="text-lg font-bold text-white tracking-tight truncate">
                            {phase.title}
                          </h3>
                          <p className="text-xs text-on-surface-variant">
                            {phase.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 shrink-0">
                        <div className="hidden sm:flex flex-col items-end">
                          <span className="text-xs font-bold text-white">{phaseCounts.done} / {phaseCounts.total} Concepts ({phaseCounts.pct}%)</span>
                        </div>
                        <div className="w-24 bg-black/40 h-2 rounded-full overflow-hidden hidden sm:block border border-white/5">
                          <div 
                            className="bg-primary h-full rounded-full transition-all duration-300"
                            style={{ width: `${phaseCounts.pct}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Phase Sub-tracks */}
                    {isPhaseExpanded && (
                      <div className="px-5 pb-5 pt-1 space-y-4 border-t border-white/5 bg-black/20 animate-fade-in">
                        {phase.tracks.map((track) => {
                          const isTrackExpanded = !!expandedNodes[track.id];
                          const trackCounts = getTrackCounts(track);

                          return (
                            <div 
                              key={track.id} 
                              className="rounded-xl bg-surface-bright/30 border border-white/5 overflow-hidden transition-all"
                            >
                              {/* Track Level Header */}
                              <div className="p-4 flex items-center justify-between gap-4">
                                <div 
                                  onClick={() => toggleNodeExpand(track.id)}
                                  className="flex items-center gap-3 cursor-pointer group min-w-0 flex-grow"
                                >
                                  <span className={`material-symbols-outlined text-on-surface-variant group-hover:text-white text-lg transition-transform duration-300 ${isTrackExpanded ? 'rotate-90' : ''}`}>
                                    arrow_right
                                  </span>
                                  <div className="min-w-0">
                                    <h4 className="text-sm font-bold text-white group-hover:text-primary transition-colors truncate">
                                      {track.title}
                                    </h4>
                                    <p className="text-xs text-on-surface-variant">
                                      {trackCounts.done} / {trackCounts.total} Concepts Completed
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-center gap-3 shrink-0">
                                  <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-lg border border-primary/20">
                                    {trackCounts.pct}%
                                  </span>
                                  <button
                                    onClick={() => setSelectedTopic({
                                      title: track.title,
                                      subtitle: phase.title,
                                      subtracks: track.subtracks,
                                      resources: track.resources
                                    })}
                                    className="px-3 py-1.5 rounded-lg bg-surface-bright border border-white/10 hover:border-primary/40 text-xs font-bold text-white hover:text-primary transition-all flex items-center gap-1 cursor-pointer"
                                  >
                                    <span>Details</span>
                                    <span className="material-symbols-outlined text-xs">open_in_new</span>
                                  </button>
                                </div>
                              </div>

                              {/* Track Subtracks & Concepts */}
                              {isTrackExpanded && (
                                <div className="px-4 pb-4 pt-2 space-y-4 border-t border-white/5 pl-8 bg-black/40 animate-fade-in">
                                  {track.subtracks.map((subtrack) => {
                                    const isSubExpanded = expandedNodes[subtrack.id] !== false;
                                    const subCounts = getSubtrackCounts(subtrack);

                                    return (
                                      <div key={subtrack.id} className="space-y-2">
                                        <div 
                                          onClick={() => toggleNodeExpand(subtrack.id)}
                                          className="flex items-center justify-between cursor-pointer group py-1"
                                        >
                                          <div className="flex items-center gap-2">
                                            <span className={`material-symbols-outlined text-xs text-on-surface-variant transition-transform ${isSubExpanded ? 'rotate-90' : ''}`}>
                                              arrow_right
                                            </span>
                                            <h5 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant group-hover:text-white transition-colors">
                                              {subtrack.title}
                                            </h5>
                                          </div>
                                          <span className="text-[10px] font-semibold text-on-surface-variant">
                                            {subCounts.done} / {subCounts.total} ({subCounts.pct}%)
                                          </span>
                                        </div>

                                        {isSubExpanded && (
                                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pl-4 border-l border-white/10">
                                            {subtrack.concepts.map((concept) => {
                                              const isChecked = !!completedConceptsMap[concept.id];
                                              return (
                                                <label 
                                                  key={concept.id}
                                                  className={`p-3 rounded-xl border transition-all flex items-start gap-3 cursor-pointer select-none group ${
                                                    isChecked 
                                                      ? 'bg-emerald-500/5 border-emerald-500/20 text-on-surface-variant' 
                                                      : 'bg-surface/60 border-white/5 hover:border-primary/40 text-white'
                                                  }`}
                                                >
                                                  <input 
                                                    type="checkbox"
                                                    checked={isChecked}
                                                    onChange={() => handleToggleConcept(concept.id)}
                                                    className="w-4 h-4 rounded border-white/20 bg-black/40 text-primary focus:ring-primary focus:ring-offset-0 cursor-pointer mt-0.5"
                                                  />
                                                  <div className="min-w-0">
                                                    <span className={`text-xs font-semibold block ${isChecked ? 'line-through text-on-surface-variant' : 'text-white'} group-hover:text-primary transition-colors`}>
                                                      {concept.name}
                                                    </span>
                                                    {concept.learn && (
                                                      <span className="text-[10px] text-on-surface-variant line-clamp-1 mt-0.5">
                                                        {concept.learn}
                                                      </span>
                                                    )}
                                                  </div>
                                                </label>
                                              );
                                            })}
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ─── TAB 2: DATA STRUCTURES ────────────────────────────────────── */}
      {activeTab === 'DATA STRUCTURES' && (
        <div className="space-y-8 animate-fade-in">
          {DATA_STRUCTURES_LIST.map((group, gIdx) => (
            <div key={gIdx} className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-primary flex items-center gap-2">
                <span className="material-symbols-outlined text-base">account_tree</span>
                {group.category}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {group.items.map((item) => (
                  <div 
                    key={item.id}
                    className="p-5 rounded-2xl bg-surface/60 border border-white/10 hover:border-primary/50 transition-all duration-200 flex flex-col justify-between gap-4 group shadow-lg hover:-translate-y-0.5"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="text-base font-bold text-white group-hover:text-primary transition-colors">
                          {item.name}
                        </h4>
                        <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary text-sm transition-transform group-hover:translate-x-0.5">
                          arrow_forward
                        </span>
                      </div>
                      <p className="text-xs text-on-surface-variant font-mono">
                        {item.timeComplexity}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-white/5 text-[11px] text-on-surface-variant">
                      <span>Space: <code className="text-white font-mono">{item.spaceComplexity}</code></span>
                      <button
                        onClick={() => setSelectedTopic({
                          title: item.name,
                          subtitle: group.category,
                          desc: `Time Complexity: ${item.timeComplexity} | Space Complexity: ${item.spaceComplexity}`,
                          timeComplexity: item.timeComplexity,
                          spaceComplexity: item.spaceComplexity,
                          resources: {
                            preference1: [{ title: `${item.name} Implementation & Operations Guide`, type: 'GitHub', link: 'https://github.com/jwasham/coding-interview-university', why: 'Essential data structure implementation pattern' }],
                            preference2: [{ title: `Learn ${item.name} Complete Video Course`, type: 'YouTube', link: 'https://www.youtube.com/results?search_query=' + encodeURIComponent(item.name), why: 'Visual animation walkthrough' }],
                            preference3: [{ title: `LeetCode ${item.name} Tagged Problems`, type: 'Practice', link: 'https://leetcode.com/tag/' + item.id.replace('ds-', ''), why: 'Curated problem set' }]
                          }
                        })}
                        className="px-3 py-1 rounded-lg bg-primary/10 text-primary border border-primary/20 font-bold hover:bg-primary/20 transition-all cursor-pointer flex items-center gap-1"
                      >
                        Explore <span className="material-symbols-outlined text-xs">open_in_new</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ─── TAB 3: ALGORITHMS ─────────────────────────────────────────── */}
      {activeTab === 'ALGORITHMS' && (
        <div className="space-y-8 animate-fade-in">
          {ALGORITHMS_LIST.map((group, gIdx) => (
            <div key={gIdx} className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-purple-400 flex items-center gap-2">
                <span className="material-symbols-outlined text-base">function</span>
                {group.category}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {group.items.map((alg) => (
                  <div 
                    key={alg.id}
                    className="p-5 rounded-2xl bg-surface/60 border border-white/10 hover:border-purple-500/50 transition-all duration-200 flex flex-col justify-between gap-4 group shadow-lg"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="text-base font-bold text-white group-hover:text-purple-400 transition-colors">
                          {alg.name}
                        </h4>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-500/10 text-purple-300 border border-purple-500/20">
                          {alg.time}
                        </span>
                      </div>
                      <p className="text-xs text-on-surface-variant leading-relaxed">
                        {alg.desc}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-white/5 text-[11px]">
                      <span className="text-on-surface-variant">Space: <code className="text-white font-mono">{alg.space}</code></span>
                      <button
                        onClick={() => setSelectedTopic({
                          title: alg.name,
                          subtitle: group.category,
                          desc: alg.desc,
                          timeComplexity: alg.time,
                          spaceComplexity: alg.space,
                          resources: {
                            preference1: [{ title: `${alg.name} Masterclass Video`, type: 'YouTube', link: 'https://www.youtube.com/results?search_query=' + encodeURIComponent(alg.name), why: 'Video lecture walkthrough' }],
                            preference2: [{ title: `${alg.name} Source Implementation`, type: 'GitHub', link: 'https://github.com/trekhleb/javascript-algorithms', why: 'JavaScript implementation' }]
                          }
                        })}
                        className="px-3 py-1 rounded-lg bg-purple-500/10 text-purple-300 border border-purple-500/20 font-bold hover:bg-purple-500/20 transition-all cursor-pointer flex items-center gap-1"
                      >
                        Explore <span className="material-symbols-outlined text-xs">open_in_new</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ─── TAB 4: PATTERNS ───────────────────────────────────────────── */}
      {activeTab === 'PATTERNS' && (
        <div className="space-y-6 animate-fade-in">
          <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 text-xs text-on-surface-variant flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-xl shrink-0">lightbulb</span>
            <div>
              <span className="font-bold text-white block">16 Essential Coding Interview Patterns</span>
              Master these key patterns to solve LeetCode medium and hard problems systematically.
            </div>
          </div>

          <div className="space-y-6">
            {PATTERNS_LIST.map((pat) => {
              const solvedCount = pat.problems.filter(p => solvedPatternProblemsMap[p.id]).length;
              const patPct = Math.round((solvedCount / pat.targetProblemsCount) * 100);
              const isExpanded = !!expandedNodes[pat.id];

              return (
                <div 
                  key={pat.id} 
                  className="rounded-2xl bg-surface/60 border border-white/10 overflow-hidden transition-all shadow-xl"
                >
                  {/* Pattern Header */}
                  <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface-bright/30">
                    <div 
                      onClick={() => toggleNodeExpand(pat.id)}
                      className="flex items-center gap-4 cursor-pointer group min-w-0 flex-grow"
                    >
                      <span className="text-lg font-mono font-black text-primary/60 group-hover:text-primary transition-colors shrink-0">
                        {pat.number}
                      </span>
                      <div className="min-w-0">
                        <h4 className="text-base font-bold text-white group-hover:text-primary transition-colors truncate">
                          {pat.name}
                        </h4>
                        <p className="text-xs text-on-surface-variant line-clamp-1">
                          {pat.whenToIdentify}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0 justify-between md:justify-end">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-white">
                          Problems Solved: <span className="text-emerald-400">{solvedCount}</span> / {pat.targetProblemsCount}
                        </span>
                        <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-lg border border-primary/20">
                          {patPct}%
                        </span>
                      </div>

                      <button
                        onClick={() => setSelectedTopic({
                          title: pat.name,
                          subtitle: `Pattern ${pat.number}`,
                          whenToIdentify: pat.whenToIdentify,
                          coreLogic: pat.coreLogic,
                          templateCode: pat.templateCode,
                          resources: pat.resources
                        })}
                        className="px-3 py-1.5 rounded-lg bg-surface-bright border border-white/10 hover:border-primary/40 text-xs font-bold text-white hover:text-primary transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <span>Details</span>
                        <span className="material-symbols-outlined text-xs">open_in_new</span>
                      </button>
                    </div>
                  </div>

                  {/* Pattern Expanded Details */}
                  {isExpanded && (
                    <div className="p-6 space-y-6 border-t border-white/5 bg-black/30 animate-fade-in">
                      {/* Core Logic & When to Identify */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        <div className="p-4 rounded-xl bg-surface/50 border border-white/5 space-y-1.5">
                          <span className="font-bold uppercase tracking-wider text-primary text-[10px]">
                            🔍 When to Identify
                          </span>
                          <p className="text-white leading-relaxed">{pat.whenToIdentify}</p>
                        </div>

                        <div className="p-4 rounded-xl bg-surface/50 border border-white/5 space-y-1.5">
                          <span className="font-bold uppercase tracking-wider text-purple-400 text-[10px]">
                            🧠 Core Logic
                          </span>
                          <p className="text-white leading-relaxed">{pat.coreLogic}</p>
                        </div>
                      </div>

                      {/* Template Code snippet if present */}
                      {pat.templateCode && (
                        <div className="space-y-2">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                            💻 Common Template
                          </span>
                          <pre className="p-4 rounded-xl bg-black/80 border border-white/10 text-xs font-mono text-emerald-300 overflow-x-auto">
                            {pat.templateCode}
                          </pre>
                        </div>
                      )}

                      {/* Practice Problems checklist */}
                      <div className="space-y-3">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                          🎯 Practice Problems ({solvedCount} / {pat.targetProblemsCount} Solved)
                        </span>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {pat.problems.map((prob) => {
                            const isSolved = !!solvedPatternProblemsMap[prob.id];
                            return (
                              <div 
                                key={prob.id}
                                className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                                  isSolved 
                                    ? 'bg-emerald-500/5 border-emerald-500/20' 
                                    : 'bg-surface/40 border-white/5 hover:border-white/20'
                                }`}
                              >
                                <label className="flex items-center gap-3 cursor-pointer min-w-0">
                                  <input 
                                    type="checkbox"
                                    checked={isSolved}
                                    onChange={() => handleTogglePatternProblem(prob.id)}
                                    className="w-4 h-4 rounded border-white/20 bg-black/40 text-primary focus:ring-primary focus:ring-offset-0 cursor-pointer shrink-0"
                                  />
                                  <span className={`text-xs font-semibold truncate ${isSolved ? 'line-through text-on-surface-variant' : 'text-white'}`}>
                                    {prob.name}
                                  </span>
                                </label>

                                <a
                                  href={prob.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary hover:text-white p-1 rounded hover:bg-white/10 transition-colors shrink-0"
                                  title="Solve on LeetCode"
                                >
                                  <span className="material-symbols-outlined text-sm">open_in_new</span>
                                </a>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Personal Notes per pattern */}
                      <div className="space-y-2 pt-2 border-t border-white/5">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                            📝 Personal Notes
                          </span>
                          {activePatternForNotes !== pat.id && (
                            <button
                              onClick={() => {
                                setActivePatternForNotes(pat.id);
                                setNoteText(patternNotes[pat.id] || '');
                              }}
                              className="text-xs text-primary font-bold hover:underline cursor-pointer"
                            >
                              {patternNotes[pat.id] ? 'Edit Notes' : 'Add Notes'}
                            </button>
                          )}
                        </div>

                        {activePatternForNotes === pat.id ? (
                          <div className="space-y-3">
                            <textarea
                              value={noteText}
                              onChange={(e) => setNoteText(e.target.value)}
                              placeholder="Write key takeaways or templates for this pattern..."
                              className="w-full p-3 rounded-xl bg-black/50 border border-white/10 text-xs text-white placeholder-on-surface-variant/50 focus:outline-none focus:border-primary min-h-[90px]"
                            />
                            <div className="flex gap-2 justify-end">
                              <button
                                onClick={() => setActivePatternForNotes(null)}
                                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-on-surface-variant hover:text-white cursor-pointer"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => handleSavePatternNotes(pat.id)}
                                className="px-4 py-1.5 rounded-lg bg-primary text-on-primary font-bold text-xs cursor-pointer shadow-md"
                              >
                                Save Notes
                              </button>
                            </div>
                          </div>
                        ) : (
                          patternNotes[pat.id] && (
                            <div className="p-3 rounded-xl bg-surface/30 border border-white/5 text-xs text-on-surface-variant leading-relaxed font-mono whitespace-pre-wrap">
                              {patternNotes[pat.id]}
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ─── TAB 5: RESOURCES LIBRARY ──────────────────────────────────── */}
      {activeTab === 'RESOURCES' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-2xl">auto_awesome</span>
              📚 RESOURCES
            </h2>

            <div className="flex items-center gap-2 bg-surface-bright/40 p-1 rounded-xl border border-white/10 overflow-x-auto no-scrollbar">
              {['Inspiration', 'Patterns', 'Data Structures', 'Algorithms'].map((sub) => (
                <button
                  key={sub}
                  onClick={() => setResourceSubTab(sub)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer shrink-0 ${
                    resourceSubTab === sub 
                      ? 'bg-primary/20 text-primary border border-primary/30' 
                      : 'text-on-surface-variant hover:text-white'
                  }`}
                >
                  {sub === 'Inspiration' ? '✨ Inspiration' : sub}
                </button>
              ))}
            </div>
          </div>

          {/* 🌟 INSPIRATION & REFERENCES SECTION */}
          {resourceSubTab === 'Inspiration' && (
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-gradient-to-br from-primary/10 via-purple-500/5 to-surface border border-primary/20 space-y-3">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary text-2xl">auto_awesome</span>
                  <div>
                    <h3 className="text-base font-extrabold text-white">✨ Inspiration & Educational References</h3>
                    <p className="text-xs text-on-surface-variant mt-0.5">
                      This DSA Workspace was inspired by the learning approach, roadmap, and educational content shared by Harsha Verse.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {HARSHA_VERSE_INSPIRATION_DATA.resources.preference1.map((item, idx) => (
                  <div 
                    key={idx} 
                    className="p-5 rounded-2xl bg-surface/60 border border-white/10 hover:border-primary/40 transition-all flex flex-col justify-between gap-4 shadow-lg group"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
                          {item.badge}
                        </span>
                        <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary text-base transition-transform group-hover:translate-x-0.5">
                          link
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-white group-hover:text-primary transition-colors">
                        {item.title}
                      </h4>

                      <p className="text-xs text-on-surface-variant leading-relaxed">
                        {item.desc}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                      {item.link ? (
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3.5 py-1.5 rounded-xl bg-primary text-on-primary font-bold text-xs hover:bg-primary/90 transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
                        >
                          <span>Open Resource</span>
                          <span className="material-symbols-outlined text-xs">open_in_new</span>
                        </a>
                      ) : (
                        <button
                          disabled
                          className="px-3.5 py-1.5 rounded-xl bg-white/5 text-on-surface-variant font-bold text-xs cursor-not-allowed border border-white/5 flex items-center gap-1.5"
                          title="YouTube link reserved — will activate when URL is provided"
                        >
                          <span>Reserved Link</span>
                          <span className="material-symbols-outlined text-xs">lock</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {resourceSubTab === 'Patterns' && (
            <div className="space-y-8">
              {PATTERNS_LIST.map((pat) => (
                <div key={pat.id} className="p-5 rounded-2xl bg-surface/50 border border-white/10 space-y-4 shadow-lg">
                  <h4 className="text-base font-bold text-white flex items-center gap-2">
                    <span className="text-primary font-mono">{pat.number}.</span>
                    {pat.name} Resources
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Preference 1 */}
                    <div className="space-y-3 p-4 rounded-xl bg-yellow-500/5 border border-yellow-500/20">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-yellow-500/10 text-yellow-400 border border-yellow-500/30">
                        ⭐ Preference 1 — Recommended
                      </span>
                      <div className="space-y-2">
                        {pat.resources.preference1.map((r, idx) => (
                          <div key={idx} className="p-3 rounded-lg bg-surface-bright/40 border border-white/5 space-y-1.5">
                            <h5 className="text-xs font-bold text-white truncate">{r.title}</h5>
                            <p className="text-[10px] text-on-surface-variant line-clamp-2">{r.why || r.desc || 'Recommended learning resource'}</p>
                            <a href={r.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[11px] font-bold text-primary hover:underline pt-1">
                              Open Resource <span className="material-symbols-outlined text-xs">open_in_new</span>
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Preference 2 */}
                    <div className="space-y-3 p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/30">
                        🟡 Preference 2
                      </span>
                      <div className="space-y-2">
                        {pat.resources.preference2.map((r, idx) => (
                          <div key={idx} className="p-3 rounded-lg bg-surface-bright/40 border border-white/5 space-y-1.5">
                            <h5 className="text-xs font-bold text-white truncate">{r.title}</h5>
                            <p className="text-[10px] text-on-surface-variant line-clamp-2">{r.why || r.desc || 'Secondary learning resource'}</p>
                            <a href={r.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-400 hover:underline pt-1">
                              Open Resource <span className="material-symbols-outlined text-xs">open_in_new</span>
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Preference 3 */}
                    <div className="space-y-3 p-4 rounded-xl bg-zinc-500/5 border border-zinc-500/20">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-zinc-500/10 text-zinc-400 border border-zinc-500/30">
                        🔴 Preference 3
                      </span>
                      <div className="space-y-2">
                        {pat.resources.preference3.map((r, idx) => (
                          <div key={idx} className="p-3 rounded-lg bg-surface-bright/40 border border-white/5 space-y-1.5">
                            <h5 className="text-xs font-bold text-white truncate">{r.title}</h5>
                            <p className="text-[10px] text-on-surface-variant line-clamp-2">{r.why || r.desc || 'Reference docs'}</p>
                            <a href={r.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[11px] font-bold text-zinc-300 hover:underline pt-1">
                              Open Resource <span className="material-symbols-outlined text-xs">open_in_new</span>
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {resourceSubTab === 'Data Structures' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {DATA_STRUCTURES_LIST.map((group, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-surface/50 border border-white/10 space-y-3">
                  <h4 className="text-sm font-bold text-primary uppercase tracking-wider">{group.category}</h4>
                  <div className="space-y-2">
                    {group.items.map((item) => (
                      <div key={item.id} className="p-3 rounded-xl bg-surface-bright/30 border border-white/5 flex items-center justify-between">
                        <div>
                          <h5 className="text-xs font-bold text-white">{item.name}</h5>
                          <span className="text-[10px] text-on-surface-variant">{item.timeComplexity}</span>
                        </div>
                        <a href={'https://leetcode.com/tag/' + item.id.replace('ds-', '')} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary border border-primary/20 text-xs font-bold hover:bg-primary/20 transition-all flex items-center gap-1">
                          Practice <span className="material-symbols-outlined text-xs">open_in_new</span>
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {resourceSubTab === 'Algorithms' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ALGORITHMS_LIST.map((group, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-surface/50 border border-white/10 space-y-3">
                  <h4 className="text-sm font-bold text-purple-400 uppercase tracking-wider">{group.category}</h4>
                  <div className="space-y-2">
                    {group.items.map((alg) => (
                      <div key={alg.id} className="p-3 rounded-xl bg-surface-bright/30 border border-white/5 flex items-center justify-between">
                        <div>
                          <h5 className="text-xs font-bold text-white">{alg.name}</h5>
                          <span className="text-[10px] text-on-surface-variant">{alg.time} • {alg.space}</span>
                        </div>
                        <a href={'https://www.youtube.com/results?search_query=' + encodeURIComponent(alg.name)} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-lg bg-purple-500/10 text-purple-300 border border-purple-500/20 text-xs font-bold hover:bg-purple-500/20 transition-all flex items-center gap-1">
                          Watch <span className="material-symbols-outlined text-xs">open_in_new</span>
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ─── ABOUT / CREDITS FOOTER NOTE ─────────────────────────────── */}
      <div className="p-4 rounded-xl bg-surface/30 border border-white/5 text-center text-xs text-on-surface-variant">
        Built as a personalized interactive learning system, inspired by Harsha Verse's DSA learning roadmap and educational content.
      </div>

      {/* ─── GLOBAL PORTAL OVERLAY DRAWER ──────────────────────────────── */}
      <GlobalDetailOverlay 
        isOpen={!!selectedTopic}
        onClose={() => setSelectedTopic(null)}
        data={selectedTopic}
        completedConceptsMap={completedConceptsMap}
        onToggleConcept={handleToggleConcept}
      />

      {/* ─── DOUBLE CONFIRMATION DELETE WORKSPACE MODALS (ASK TWICE) ─────── */}
      {/* STEP 1 MODAL */}
      {isDeleteModalOpen && deleteStep === 1 && (
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          title="⚠️ Delete DSA Workspace? (Confirmation 1 of 2)"
        >
          <div className="space-y-5">
            <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-start gap-3">
              <span className="material-symbols-outlined text-amber-400 text-2xl shrink-0">warning</span>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-amber-300">Are you sure you want to delete your DSA Workspace?</h4>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Deleting <span className="text-white font-bold">{workspace?.title || 'DSA Workspace'}</span> will remove all your tracked concepts ({completedCount}/{totalLeafConcepts}), solved pattern questions, and study notes.
                </p>
              </div>
            </div>

            <p className="text-xs text-on-surface-variant font-medium text-center">
              ⚠️ Double confirmation is required to permanently delete this workspace.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button variant="ghost" onClick={() => setIsDeleteModalOpen(false)} className="text-xs font-bold uppercase">
                Cancel / Keep Workspace
              </Button>
              <button
                type="button"
                onClick={() => { setDeleteStep(2); setDeleteConfirmText(''); }}
                className="px-4 py-2 bg-amber-500 text-black hover:bg-amber-400 font-bold text-xs rounded-xl uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-lg shadow-amber-500/20"
              >
                <span>Continue to Step 2</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* STEP 2 MODAL (FINAL CONFIRMATION) */}
      {isDeleteModalOpen && deleteStep === 2 && (
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          title="🚨 Final Confirmation — Permanent Deletion (Step 2 of 2)"
        >
          <div className="space-y-5">
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-start gap-3">
              <span className="material-symbols-outlined text-red-400 text-2xl shrink-0">dangerous</span>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-red-400">THIS ACTION IS PERMANENT & CANNOT BE UNDONE!</h4>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Please type <span className="font-mono font-bold text-red-400 bg-red-500/20 px-1.5 py-0.5 rounded">DELETE</span> in the box below to authorize permanent deletion.
                </p>
              </div>
            </div>

            <InputField
              id="dsa-delete-confirm-input"
              label="Type DELETE to confirm permanent deletion"
              placeholder="DELETE"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
            />

            <div className="flex items-center justify-between pt-2">
              <Button variant="ghost" onClick={() => setDeleteStep(1)} className="text-xs font-bold uppercase">
                ← Back to Step 1
              </Button>

              <button
                type="button"
                disabled={deleteConfirmText.trim() !== 'DELETE' || isDeleting}
                onClick={handleFinalDeleteDSAWorkspace}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-lg ${
                  deleteConfirmText.trim() === 'DELETE' && !isDeleting
                    ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/30 scale-105'
                    : 'bg-white/5 text-zinc-600 border border-white/5 cursor-not-allowed'
                }`}
              >
                <span className="material-symbols-outlined text-sm">delete_forever</span>
                <span>{isDeleting ? 'Deleting Workspace...' : 'Yes, Delete DSA Workspace'}</span>
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default DSAWorkspace;
