import React, { useState, useContext, useMemo, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Button from '../components/Button';
import Toast from '../components/Toast';
import Modal from '../components/Modal';
import { TaskContext } from '../context/TaskContext';
import DSAWorkspace from '../components/DSA/DSAWorkspace';
import { calculateRoadmapGraphLayout, normalizeRoadmapData } from '../utils/roadmapLayout';
import {
  normalizeSkillTitle,
  insertSkillBetween,
  insertSkillBefore,
  insertSkillAfter,
  reorderSkillPosition
} from '../utils/roadmapGraphEngine';

const RoadmapDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    userRoadmaps,
    addRoadmap,
    updateRoadmap,
    deleteRoadmap,
    setCurrentFocusSkill,
    workspaces,
    updateWorkspace,
    addWorkspace,
    linkSkillToWorkspace
  } = useContext(TaskContext);

  // Normalize roadmap data on load to strictly enforce single Current Focus & UPPERCASE
  const rawRoadmap = useMemo(() => {
    return (userRoadmaps || []).find(r => r.id === id);
  }, [userRoadmaps, id]);

  const roadmap = useMemo(() => {
    if (!rawRoadmap) return null;
    return normalizeRoadmapData(rawRoadmap);
  }, [rawRoadmap]);

  const [toast, setToast] = useState({ message: '', type: 'success' });
  const [selectedNode, setSelectedNode] = useState(null); // Node Detail Panel State

  // Edit Mode State
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingSkills, setEditingSkills] = useState([]);
  const [editRoadmapMeta, setEditRoadmapMeta] = useState({ title: '', description: '', category: '', estimatedTime: '' });

  // Sync editingSkills with roadmap skills when Edit Mode opens or roadmap changes
  useEffect(() => {
    if (roadmap) {
      setEditingSkills(roadmap.skills || []);
      setEditRoadmapMeta({
        title: roadmap.title || '',
        description: roadmap.description || '',
        category: roadmap.category || 'Programming',
        estimatedTime: roadmap.estimatedTime || '~2–4 weeks'
      });
    }
  }, [roadmap, isEditMode]);

  // Modals
  const [linkWorkspaceModalSkill, setLinkWorkspaceModalSkill] = useState(null);
  const [selectedWorkspaceToLink, setSelectedWorkspaceToLink] = useState('');

  // Add/Insert Skill Modal State
  const [isAddSkillModalOpen, setIsAddSkillModalOpen] = useState(false);
  const [addSkillConfig, setAddSkillConfig] = useState({
    title: '',
    positionType: 'after', // 'beginning' | 'after' | 'before' | 'parallel' | 'between'
    referenceSkillTitle: '',
    targetSkillTitle: '', // For 'between'
    isParallel: false,
    linkedWorkspaceId: ''
  });

  // Edit Skill Modal State
  const [editingSkill, setEditingSkill] = useState(null);
  const [editSkillForm, setEditSkillForm] = useState({
    title: '',
    prereqTitle: '',
    positionType: 'same', // 'same' | 'beginning' | 'after' | 'before'
    positionRefTitle: '',
    isParallel: false,
    linkedWorkspaceId: ''
  });

  // Delete Roadmap Modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // Active skills array depending on Edit Mode
  const currentSkills = isEditMode ? editingSkills : (roadmap ? roadmap.skills : []);

  // Synchronize selectedNode if skills update
  useEffect(() => {
    if (selectedNode && currentSkills) {
      const updated = currentSkills.find(s => s.id === selectedNode.id);
      if (updated) setSelectedNode(updated);
    }
  }, [currentSkills]);

  // Calculate dynamic 2D graph layout (nodes & SVG connector paths)
  const graphLayout = useMemo(() => {
    return calculateRoadmapGraphLayout(currentSkills, {
      cardWidth: 230,
      cardHeight: 90,
      xSpacing: 270,
      ySpacing: 140,
      paddingX: 100,
      paddingY: 60
    });
  }, [currentSkills]);

  if (!roadmap) {
    return (
      <div className="flex min-h-screen bg-[#050507] text-on-surface select-none font-dm-sans">
        <Sidebar />
        <main className="flex-grow flex flex-col h-screen overflow-y-auto relative z-10">
          <Header workspaceTitle="Roadmap Not Found" />
          <div className="p-8 text-center space-y-4 my-auto">
            <h2 className="text-xl font-bold text-white font-space-grotesk">Roadmap Not Found</h2>
            <p className="text-xs text-zinc-400">The roadmap you are looking for does not exist.</p>
            <Link to="/roadmaps">
              <Button variant="secondary" icon="arrow_back">Back to Roadmaps</Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const skills = currentSkills;
  const completedSkills = skills.filter(s => s.done);

  // EDIT MODE HANDLERS
  const handleToggleEditMode = () => {
    if (isEditMode) {
      // Cancel edit mode
      setIsEditMode(false);
      setEditingSkills(roadmap.skills || []);
    } else {
      // Enter edit mode
      setIsEditMode(true);
      setEditingSkills(roadmap.skills || []);
    }
  };

  const handleSaveEditMode = async () => {
    try {
      const normalizedRoadmap = normalizeRoadmapData({
        ...roadmap,
        title: editRoadmapMeta.title.trim() || roadmap.title,
        description: editRoadmapMeta.description.trim(),
        category: editRoadmapMeta.category,
        estimatedTime: editRoadmapMeta.estimatedTime,
        skills: editingSkills
      });

      await updateRoadmap(roadmap.id, {
        title: normalizedRoadmap.title,
        description: normalizedRoadmap.description,
        category: normalizedRoadmap.category,
        estimatedTime: normalizedRoadmap.estimatedTime,
        skills: normalizedRoadmap.skills
      });

      setIsEditMode(false);
      showToast('✓ Roadmap changes saved');
    } catch (err) {
      console.error(err);
      showToast('Could not save roadmap changes', 'error');
    }
  };

  // STRICT SINGLE CURRENT FOCUS HANDLER
  const handleSetCurrentFocus = async (skillId) => {
    if (isEditMode) {
      const updated = editingSkills.map(sk => ({
        ...sk,
        isCurrent: sk.id === skillId,
        status: sk.done ? 'completed' : (sk.id === skillId ? 'current' : (sk.isParallel ? 'parallel' : 'future'))
      }));
      setEditingSkills(updated);
    } else {
      await setCurrentFocusSkill(roadmap.id, skillId);
    }
    showToast('✓ Set as Current Focus');
  };

  // Toggle completion
  const handleToggleSkillDone = async (skillId) => {
    const targetSkill = skills.find(s => s.id === skillId);
    if (!targetSkill) return;

    const nextDone = !targetSkill.done;
    const updatedSkills = skills.map(s => {
      if (s.id === skillId) {
        return {
          ...s,
          done: nextDone,
          status: nextDone ? 'completed' : (s.isCurrent ? 'current' : 'future')
        };
      }
      return s;
    });

    if (isEditMode) {
      setEditingSkills(updatedSkills);
    } else {
      await updateRoadmap(roadmap.id, { skills: updatedSkills });
    }
    showToast('✓ Progress updated');
  };

  // Open Smart Add/Insert Skill Modal
  const handleOpenAddSkill = (config = {}) => {
    const defaultRef = skills.length > 0 ? skills[skills.length - 1].title : '';
    setAddSkillConfig({
      title: '',
      positionType: config.positionType || (skills.length === 0 ? 'beginning' : 'after'),
      referenceSkillTitle: config.referenceSkillTitle || defaultRef,
      targetSkillTitle: config.targetSkillTitle || '',
      isParallel: Boolean(config.isParallel),
      linkedWorkspaceId: ''
    });
    setIsAddSkillModalOpen(true);
  };

  // Submit Smart Add/Insert Skill
  const handleSaveAddSkill = async (e) => {
    e.preventDefault();
    const rawTitle = addSkillConfig.title.trim();
    if (!rawTitle) return;

    const newTitle = normalizeSkillTitle(rawTitle);
    const newSkillData = {
      id: `skill-${Date.now()}`,
      title: newTitle,
      category: roadmap.category || 'General',
      isParallel: addSkillConfig.isParallel || addSkillConfig.positionType === 'parallel',
      linkedWorkspaceId: addSkillConfig.linkedWorkspaceId || null
    };

    let updatedSkillsList = [...skills];

    if (addSkillConfig.positionType === 'between' && addSkillConfig.referenceSkillTitle && addSkillConfig.targetSkillTitle) {
      updatedSkillsList = insertSkillBetween(
        skills,
        addSkillConfig.referenceSkillTitle,
        addSkillConfig.targetSkillTitle,
        newSkillData
      );
    } else if (addSkillConfig.positionType === 'before' && addSkillConfig.referenceSkillTitle) {
      updatedSkillsList = insertSkillBefore(skills, addSkillConfig.referenceSkillTitle, newSkillData);
    } else if (addSkillConfig.positionType === 'beginning') {
      updatedSkillsList = insertSkillBefore(skills, skills[0]?.title || '', newSkillData);
    } else if (addSkillConfig.positionType === 'parallel' && addSkillConfig.referenceSkillTitle) {
      newSkillData.isParallel = true;
      updatedSkillsList = insertSkillAfter(skills, addSkillConfig.referenceSkillTitle, newSkillData);
    } else {
      // Default: after reference skill or at end
      updatedSkillsList = insertSkillAfter(
        skills,
        addSkillConfig.referenceSkillTitle || skills[skills.length - 1]?.title || '',
        newSkillData
      );
    }

    if (isEditMode) {
      setEditingSkills(updatedSkillsList);
    } else {
      await updateRoadmap(roadmap.id, { skills: updatedSkillsList });
    }

    setIsAddSkillModalOpen(false);
    showToast(`✓ Added ${newTitle} to roadmap`);
  };

  // Open Edit Skill Modal
  const handleOpenEditSkill = (skill) => {
    setEditingSkill(skill);
    setEditSkillForm({
      title: skill.title,
      prereqTitle: skill.dependencies ? skill.dependencies[0] || '' : '',
      positionType: 'same',
      positionRefTitle: '',
      isParallel: Boolean(skill.isParallel),
      linkedWorkspaceId: skill.linkedWorkspaceId || ''
    });
  };

  // Save Edit Skill
  const handleSaveSkillEdit = async (e) => {
    e.preventDefault();
    if (!editingSkill) return;

    const uppercaseTitle = normalizeSkillTitle(editSkillForm.title);
    if (!uppercaseTitle) return;

    let updatedSkillsList = skills.map(s => {
      if (s.id === editingSkill.id) {
        return {
          ...s,
          title: uppercaseTitle,
          isParallel: editSkillForm.isParallel,
          relationshipType: editSkillForm.isParallel ? 'parallel' : 'sequential',
          dependencies: editSkillForm.prereqTitle ? [normalizeSkillTitle(editSkillForm.prereqTitle)] : [],
          linkedWorkspaceId: editSkillForm.linkedWorkspaceId || null
        };
      }
      return s;
    });

    // Handle position reordering if changed
    if (editSkillForm.positionType !== 'same') {
      updatedSkillsList = reorderSkillPosition(
        updatedSkillsList,
        editingSkill.id,
        editSkillForm.positionType,
        editSkillForm.positionRefTitle
      );
    }

    if (isEditMode) {
      setEditingSkills(updatedSkillsList);
    } else {
      await updateRoadmap(roadmap.id, { skills: updatedSkillsList });
    }

    setEditingSkill(null);
    showToast('✓ Skill updated');
  };

  // Remove Skill
  const handleRemoveSkillFromRoadmap = async (skillId) => {
    const updated = skills.filter(s => s.id !== skillId);
    if (isEditMode) {
      setEditingSkills(updated);
    } else {
      await updateRoadmap(roadmap.id, { skills: updated });
    }
    if (selectedNode && selectedNode.id === skillId) {
      setSelectedNode(null);
    }
    showToast('Skill removed', 'info');
  };

  // Workspace linking helpers
  const handleConfirmLinkWorkspace = async () => {
    if (!linkWorkspaceModalSkill || !selectedWorkspaceToLink) return;

    if (isEditMode) {
      const updated = editingSkills.map(s => s.id === linkWorkspaceModalSkill.id ? { ...s, linkedWorkspaceId: selectedWorkspaceToLink } : s);
      setEditingSkills(updated);
    } else {
      await linkSkillToWorkspace(roadmap.id, linkWorkspaceModalSkill.id, selectedWorkspaceToLink);
    }
    showToast('✓ Workspace linked');
    setLinkWorkspaceModalSkill(null);
    setSelectedWorkspaceToLink('');
  };

  const handleCreateWorkspaceForSkill = async (skill) => {
    try {
      const skillUpper = normalizeSkillTitle(skill.title);
      const newWsId = `ws-sk-${Date.now()}`;
      await addWorkspace(newWsId, {
        title: `${skillUpper} Workspace`,
        description: `Dedicated workspace for learning ${skillUpper}.`,
        technology: skillUpper,
        category: 'Learning',
        tag: 'Skill',
        progress: 0,
        createdAt: new Date().toISOString()
      });

      if (isEditMode) {
        setEditingSkills(prev => prev.map(s => s.id === skill.id ? { ...s, linkedWorkspaceId: newWsId } : s));
      } else {
        await linkSkillToWorkspace(roadmap.id, skill.id, newWsId);
      }
      showToast('✓ Workspace created & linked');
      setLinkWorkspaceModalSkill(null);
      navigate(`/workspaces/${newWsId}`);
    } catch (err) {
      console.error(err);
      showToast('Could not create workspace', 'error');
    }
  };

  // Duplicate & Delete roadmap
  const handleDuplicateRoadmap = async () => {
    try {
      const dupSkills = skills.map((s, idx) => ({
        ...s,
        id: `sk-dup-${Date.now()}-${idx}`,
        title: normalizeSkillTitle(s.title),
        done: false,
        isCurrent: idx === 0,
        linkedWorkspaceId: null
      }));

      const dupId = await addRoadmap({
        title: `${roadmap.title} (COPY)`,
        description: roadmap.description,
        category: roadmap.category,
        isAiGenerated: false,
        estimatedTime: roadmap.estimatedTime || '~2–4 weeks',
        skills: dupSkills
      });

      showToast('✓ Roadmap duplicated');
      if (dupId) navigate(`/roadmaps/${dupId}`);
    } catch (err) {
      console.error(err);
      showToast('Could not duplicate roadmap', 'error');
    }
  };

  const handleDeleteRoadmap = async () => {
    try {
      await deleteRoadmap(roadmap.id);
      showToast('Roadmap deleted', 'info');
      navigate('/roadmaps');
    } catch (err) {
      console.error(err);
      showToast('Could not delete roadmap', 'error');
    }
  };

  return (
    <div className="flex min-h-screen bg-[#050507] text-on-surface select-none font-dm-sans">
      <Sidebar />

      <main className="flex-grow flex flex-col h-screen overflow-y-auto no-scrollbar relative z-10 animate-page-transition">
        <Header hideSearch={true} hideStreak={true} hideLogo={true} workspaceTitle={roadmap.title} />

        {(id === 'dsa' || roadmap?.category === 'DSA' || roadmap?.title?.toLowerCase().includes('dsa')) ? (
          <DSAWorkspace 
            workspace={workspaces?.find(w => w.category === 'DSA' || w.id === 'dsa' || w.title?.toLowerCase().includes('dsa')) || { id: 'dsa' }}
            updateWorkspace={updateWorkspace}
          />
        ) : (
        <div className="px-4 py-6 md:px-10 md:py-8 max-w-7xl w-full mx-auto space-y-6 pb-24">

          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-2 text-xs font-semibold text-zinc-400">
            <Link to="/roadmaps" className="hover:text-white transition-colors">Roadmaps</Link>
            <span>/</span>
            <span className="text-primary font-bold">{roadmap.title}</span>
            {isEditMode && (
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-bold uppercase tracking-wider ml-2">
                ✏ EDIT MODE ACTIVE
              </span>
            )}
          </nav>

          {/* Top Banner Header */}
          <div className={`border rounded-2xl p-6 md:p-8 space-y-4 relative overflow-hidden transition-all ${
            isEditMode ? 'bg-[#121020] border-primary/50 ring-1 ring-primary/40' : 'bg-[#0B0B10] border-white/10'
          }`}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1 space-y-2">
                {isEditMode ? (
                  <div className="space-y-3 max-w-xl">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">Roadmap Title</label>
                        <input
                          type="text"
                          value={editRoadmapMeta.title}
                          onChange={(e) => setEditRoadmapMeta(prev => ({ ...prev, title: e.target.value }))}
                          className="w-full px-3 py-1.5 rounded-xl bg-white/[0.05] border border-white/10 text-white text-xs focus:outline-none focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">Pace</label>
                        <input
                          type="text"
                          value={editRoadmapMeta.estimatedTime}
                          onChange={(e) => setEditRoadmapMeta(prev => ({ ...prev, estimatedTime: e.target.value }))}
                          className="w-full px-3 py-1.5 rounded-xl bg-white/[0.05] border border-white/10 text-white text-xs focus:outline-none focus:border-primary"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">Description</label>
                      <input
                        type="text"
                        value={editRoadmapMeta.description}
                        onChange={(e) => setEditRoadmapMeta(prev => ({ ...prev, description: e.target.value }))}
                        className="w-full px-3 py-1.5 rounded-xl bg-white/[0.05] border border-white/10 text-white text-xs focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-wider">
                        {roadmap.category || 'Programming'}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-zinc-400 text-[10px] font-medium">
                        Suggested pace: {roadmap.estimatedTime || '~2–4 weeks'}
                      </span>
                    </div>
                    <h1 className="font-space-grotesk text-2xl md:text-3xl font-bold text-white tracking-tight uppercase">
                      {roadmap.title}
                    </h1>
                    <p className="text-xs md:text-sm text-zinc-400 mt-1 max-w-xl">
                      {roadmap.description || 'Interactive visual skill dependency map.'}
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0 flex-wrap">
                {isEditMode ? (
                  <>
                    <Button variant="primary" icon="check" onClick={handleSaveEditMode} className="text-xs font-bold py-2 px-4 uppercase">
                      Save Changes
                    </Button>
                    <Button variant="ghost" onClick={handleToggleEditMode} className="text-xs font-bold py-2 px-3">
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="primary"
                      icon="add"
                      onClick={() => handleOpenAddSkill()}
                      className="text-xs font-bold py-2 px-4 uppercase tracking-wider"
                    >
                      + Add Skill
                    </Button>
                    <Button
                      variant="secondary"
                      icon="edit"
                      onClick={handleToggleEditMode}
                      className="text-xs font-bold py-2 px-3"
                    >
                      Edit Roadmap
                    </Button>
                    <Button variant="ghost" onClick={handleDuplicateRoadmap} icon="content_copy" className="text-xs font-bold" title="Duplicate Roadmap">
                      Duplicate
                    </Button>
                    <button
                      onClick={() => setIsDeleteModalOpen(true)}
                      className="p-2 rounded-xl text-zinc-500 hover:text-red-400 hover:bg-white/5 transition-all cursor-pointer"
                      title="Delete Roadmap"
                    >
                      <span className="material-symbols-outlined text-sm">delete</span>
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Summary Progress */}
            <div className="space-y-2 border-t border-white/5 pt-4">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-zinc-400">
                  {completedSkills.length} / {skills.length} skills completed
                </span>
                <span className="text-primary font-space-grotesk font-bold">
                  {skills.length > 0 ? Math.round((completedSkills.length / skills.length) * 100) : 0}% Overall Progress
                </span>
              </div>
              <div className="w-full h-1 rounded-full bg-white/5 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-primary-light transition-all duration-500 rounded-full"
                  style={{ width: `${skills.length > 0 ? Math.round((completedSkills.length / skills.length) * 100) : 0}%` }}
                />
              </div>
            </div>
          </div>

          {/* REAL SKILL GRAPH CANVAS VISUALIZATION */}
          <div className="bg-[#09090D] border border-white/10 rounded-2xl p-6 space-y-4 overflow-hidden relative shadow-2xl">
            
            {/* Canvas Header / Legend */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-4">
              <div>
                <h3 className="font-space-grotesk text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-base">account_tree</span>
                  SKILL GRAPH CANVAS {isEditMode && <span className="text-amber-400 text-xs font-normal">(Editing Graph)</span>}
                </h3>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  {isEditMode
                    ? 'Click connection line "+" to insert between skills. Use node "+ Before" / "+ After" buttons to add nodes.'
                    : 'Click any node to view details, transfer Current Focus, or link workspaces. Hover to preview workspace progress.'}
                </p>
              </div>

              {/* Legend Badges */}
              <div className="flex items-center gap-3 text-[10px] font-semibold flex-wrap">
                <span className="flex items-center gap-1.5 text-primary">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_8px_rgba(139,92,246,0.8)]" />
                  Current Focus (Single)
                </span>
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  Completed
                </span>
                <span className="flex items-center gap-1.5 text-indigo-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                  Parallel Branch
                </span>
              </div>
            </div>

            {/* Interactive Graph Canvas Area - DESKTOP ONLY (md:block) */}
            <div className="hidden md:block w-full overflow-x-auto overflow-y-auto no-scrollbar relative min-h-[480px] p-4 bg-[#050508]/60 rounded-xl border border-white/5">
              <div
                className="relative mx-auto transition-all"
                style={{
                  width: `${graphLayout.width}px`,
                  height: `${graphLayout.height}px`
                }}
              >
                {/* SVG Layer for Directed Connector Lines & Arrowheads */}
                <svg
                  className="absolute inset-0 pointer-events-none w-full h-full"
                  style={{ width: `${graphLayout.width}px`, height: `${graphLayout.height}px` }}
                >
                  <defs>
                    <marker
                      id="arrow"
                      viewBox="0 0 10 10"
                      refX="8"
                      refY="5"
                      markerWidth="6"
                      markerHeight="6"
                      orient="auto-start-reverse"
                    >
                      <path d="M 0 1 L 10 5 L 0 9 z" fill="#8B5CF6" />
                    </marker>
                  </defs>

                  {graphLayout.connections.map((conn) => {
                    const midY = (conn.y1 + conn.y2) / 2;
                    const pathD = `M ${conn.x1} ${conn.y1} C ${conn.x1} ${midY}, ${conn.x2} ${midY}, ${conn.x2} ${conn.y2}`;

                    return (
                      <path
                        key={conn.id}
                        d={pathD}
                        fill="none"
                        stroke={conn.isParallel ? '#6366F1' : '#8B5CF6'}
                        strokeWidth="2"
                        strokeDasharray={conn.isParallel ? '4,4' : 'none'}
                        opacity="0.6"
                        markerEnd="url(#arrow)"
                      />
                    );
                  })}
                </svg>

                {/* SVG Connection Line '+' Insert Control (In Edit Mode) */}
                {isEditMode && graphLayout.connections.map((conn) => (
                  <div
                    key={`insert-btn-${conn.id}`}
                    style={{
                      position: 'absolute',
                      left: `${conn.midX - 14}px`,
                      top: `${conn.midY - 14}px`
                    }}
                    className="z-20 group/conn"
                  >
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenAddSkill({
                          positionType: 'between',
                          referenceSkillTitle: conn.fromTitle,
                          targetSkillTitle: conn.toTitle
                        });
                      }}
                      className="w-7 h-7 rounded-full bg-[#16122C] border border-primary text-primary hover:bg-primary hover:text-black font-extrabold text-xs flex items-center justify-center transition-all shadow-[0_0_10px_rgba(139,92,246,0.5)] cursor-pointer"
                      title={`Insert Skill between ${conn.fromTitle} and ${conn.toTitle}`}
                    >
                      +
                    </button>
                    <div className="hidden group-hover/conn:block absolute left-1/2 -translate-x-1/2 -top-8 bg-[#111118] border border-white/10 text-[9px] font-bold text-white px-2 py-1 rounded whitespace-nowrap shadow-xl">
                      + Insert Between {conn.fromTitle} & {conn.toTitle}
                    </div>
                  </div>
                ))}

                {/* HTML Skill Node Cards Layer */}
                {graphLayout.nodes.map((node) => {
                  const isCurrent = Boolean(node.isCurrent);
                  const isCompleted = Boolean(node.done);
                  const isParallel = Boolean(node.isParallel);
                  const linkedWs = node.linkedWorkspaceId ? (workspaces || []).find(w => w.id === node.linkedWorkspaceId) : null;
                  const wsProgress = isCompleted ? 100 : (linkedWs ? linkedWs.progress || 0 : 0);
                  const isSelected = selectedNode && selectedNode.id === node.id;
                  const nodeTitleUpper = normalizeSkillTitle(node.title);

                  return (
                    <div
                      key={node.id}
                      onClick={() => setSelectedNode(node)}
                      style={{
                        position: 'absolute',
                        left: `${node.x}px`,
                        top: `${node.y}px`,
                        width: `${node.width}px`,
                        height: `${node.height}px`
                      }}
                      className={`p-3 rounded-xl border transition-all duration-300 cursor-pointer flex flex-col justify-between select-none group z-10 relative overflow-hidden ${
                        isCurrent
                          ? 'bg-[#0F0C22] border-primary shadow-[0_0_20px_rgba(139,92,246,0.35)] ring-1 ring-primary/50'
                          : isCompleted
                          ? 'bg-[#07070B] border-emerald-500/30 text-zinc-400 opacity-90'
                          : isParallel
                          ? 'bg-[#0A0A14] border-indigo-500/30 hover:border-indigo-400'
                          : 'bg-[#0B0B10] border-white/10 hover:border-white/25'
                      } ${isSelected ? 'ring-2 ring-primary' : ''}`}
                    >
                      {/* Node Action Buttons (In Edit Mode on Hover) */}
                      {isEditMode && (
                        <div className="absolute inset-x-0 top-0 bg-[#0F0C22]/95 backdrop-blur border-b border-primary/30 p-1 flex items-center justify-around opacity-0 group-hover:opacity-100 transition-opacity z-30">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenAddSkill({ positionType: 'before', referenceSkillTitle: nodeTitleUpper });
                            }}
                            className="text-[9px] font-extrabold text-primary hover:underline cursor-pointer"
                          >
                            + Before
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenEditSkill(node);
                            }}
                            className="text-[9px] font-bold text-white hover:underline cursor-pointer"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenAddSkill({ positionType: 'after', referenceSkillTitle: nodeTitleUpper });
                            }}
                            className="text-[9px] font-extrabold text-primary hover:underline cursor-pointer"
                          >
                            + After
                          </button>
                        </div>
                      )}

                      {/* Node Header Badge & Hover Progress % */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between gap-1">
                          {isCurrent ? (
                            <span className="px-1.5 py-0.5 rounded text-[8px] font-black uppercase bg-primary text-black tracking-wider flex items-center gap-1 shadow-[0_0_8px_rgba(139,92,246,0.6)]">
                              ● CURRENT FOCUS
                            </span>
                          ) : isCompleted ? (
                            <span className="px-1.5 py-0.5 rounded text-[8px] font-bold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                              ✓ COMPLETED
                            </span>
                          ) : isParallel ? (
                            <span className="px-1.5 py-0.5 rounded text-[8px] font-bold uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                              PARALLEL
                            </span>
                          ) : (
                            <span className="text-[9px] font-bold text-zinc-500">
                              STEP {node.level + 1}
                            </span>
                          )}

                          {linkedWs ? (
                            <span className="text-[10px] font-bold text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-mono">
                              {wsProgress}%
                            </span>
                          ) : isCompleted ? (
                            <span className="text-[10px] font-bold text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-mono">
                              100%
                            </span>
                          ) : (
                            <span className="text-[9px] text-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 italic">
                              No workspace
                            </span>
                          )}
                        </div>

                        <h4 className={`font-space-grotesk text-xs font-bold truncate tracking-tight uppercase ${
                          isCompleted ? 'text-zinc-400 line-through' : 'text-white group-hover:text-primary transition-colors'
                        }`}>
                          {nodeTitleUpper}
                        </h4>
                      </div>

                      {/* Bottom Meta */}
                      <div className="flex items-center justify-between text-[10px] text-zinc-500">
                        <span className="uppercase font-mono text-[9px] truncate max-w-[130px]">
                          {node.dependencies.length > 0 ? `After ${node.dependencies[0].toUpperCase()}` : 'Start'}
                        </span>
                        {linkedWs && (
                          <span className="material-symbols-outlined text-xs text-primary/80" title={`Workspace: ${linkedWs.title}`}>
                            folder_open
                          </span>
                        )}
                      </div>

                      {/* Smooth Hover Progress Line */}
                      {(linkedWs || isCompleted) && (
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                          <div
                            className="h-full bg-emerald-500 transition-all duration-500 rounded-r shadow-[0_0_6px_rgba(16,185,129,0.5)]"
                            style={{ width: `${wsProgress}%` }}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* DEDICATED MOBILE VERTICAL FLOW ROADMAP GRAPH (< md) */}
            <div className="block md:hidden space-y-2 py-2">
              {skills.map((node, index) => {
                const isCurrent = Boolean(node.isCurrent);
                const isCompleted = Boolean(node.done);
                const isParallel = Boolean(node.isParallel);
                const linkedWs = node.linkedWorkspaceId ? (workspaces || []).find(w => w.id === node.linkedWorkspaceId) : null;
                const wsProgress = isCompleted ? 100 : (linkedWs ? linkedWs.progress || 0 : 0);
                const isSelected = selectedNode && selectedNode.id === node.id;
                const nodeTitleUpper = normalizeSkillTitle(node.title);

                return (
                  <React.Fragment key={node.id}>
                    {/* Mobile Skill Node Card */}
                    <div
                      onClick={() => setSelectedNode(node)}
                      className={`w-full p-4 rounded-2xl border transition-all duration-300 cursor-pointer space-y-2.5 relative select-none ${
                        isCurrent
                          ? 'bg-[#0F0C22] border-primary shadow-[0_0_25px_rgba(139,92,246,0.35)] ring-1 ring-primary/50'
                          : isCompleted
                          ? 'bg-[#080B09] border-emerald-500/30'
                          : isParallel
                          ? 'bg-[#0A0A14] border-indigo-500/30 ml-3 w-[calc(100%-12px)]'
                          : 'bg-[#0B0B10] border-white/10'
                      } ${isSelected ? 'ring-2 ring-primary' : ''}`}
                    >
                      {/* Badge Row */}
                      <div className="flex items-center justify-between gap-2">
                        {isCompleted ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                            ✓ COMPLETED
                          </span>
                        ) : isCurrent ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-primary text-black tracking-wider flex items-center gap-1 shadow-[0_0_8px_rgba(139,92,246,0.6)] animate-pulse">
                            ● CURRENT FOCUS
                          </span>
                        ) : isParallel ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                            PARALLEL BRANCH
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-zinc-500">
                            STEP {index + 1}
                          </span>
                        )}

                        <span className="text-xs font-mono font-bold text-primary">
                          {wsProgress}%
                        </span>
                      </div>

                      {/* Title & Prerequisite */}
                      <div>
                        <h4 className={`font-space-grotesk text-base font-bold uppercase tracking-tight ${
                          isCompleted ? 'text-zinc-400 line-through' : 'text-white'
                        }`}>
                          {nodeTitleUpper}
                        </h4>
                        <p className="text-[11px] text-zinc-400 font-mono mt-0.5">
                          {node.dependencies && node.dependencies.length > 0
                            ? `After ${node.dependencies[0].toUpperCase()}`
                            : 'Starting Skill'}
                        </p>
                      </div>

                      {/* Explicit Progress Bar for Touch Devices */}
                      <div className="space-y-1 pt-1">
                        <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                          <div
                            className={`h-full transition-all duration-500 rounded-full ${
                              isCompleted
                                ? 'bg-emerald-400'
                                : isCurrent
                                ? 'bg-primary shadow-[0_0_10px_#8B5CF6]'
                                : 'bg-indigo-500'
                            }`}
                            style={{ width: `${wsProgress}%` }}
                          />
                        </div>
                      </div>

                      {/* Workspace Link Badge */}
                      {linkedWs && (
                        <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs text-primary font-semibold">
                          <span className="flex items-center gap-1.5 truncate">
                            <span className="material-symbols-outlined text-sm">folder_open</span>
                            {linkedWs.title}
                          </span>
                          <span className="text-[11px] font-bold">Open →</span>
                        </div>
                      )}
                    </div>

                    {/* Vertical Connector Line between nodes on mobile */}
                    {index < skills.length - 1 && (
                      <div className="flex justify-center my-0.5">
                        <div className="w-0.5 h-5 bg-gradient-to-b from-primary/60 to-white/10 flex items-center justify-center">
                          <span className="material-symbols-outlined text-[10px] text-primary/80 -rotate-90">chevron_right</span>
                        </div>
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>

          </div>

        </div>
        )}
      </main>

      {/* NODE DETAIL POPOVER / DRAWER PANEL */}
      {selectedNode && (
        <Modal
          isOpen={Boolean(selectedNode)}
          onClose={() => setSelectedNode(null)}
          title={`SKILL DETAILS: ${selectedNode.title.toUpperCase()}`}
          maxWidth="max-w-md"
        >
          <div className="space-y-5 text-on-surface select-none">
            {/* Status & Quick Transfer Actions */}
            <div className="p-4 bg-white/[0.02] border border-white/10 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-space-grotesk text-base font-bold text-white uppercase">{selectedNode.title}</h4>
                  <span className="text-xs text-zinc-400 font-medium">
                    {selectedNode.isParallel ? 'Parallel Branch' : 'Sequential Main Path'}
                  </span>
                </div>

                {selectedNode.isCurrent ? (
                  <span className="px-2.5 py-1 rounded-full bg-primary text-black text-[10px] font-black uppercase tracking-wider">
                    Current Focus
                  </span>
                ) : selectedNode.done ? (
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold uppercase">
                    Completed
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded-full bg-white/5 text-zinc-400 text-[10px] font-bold uppercase">
                    Not Started
                  </span>
                )}
              </div>

              {/* STRICT SINGLE CURRENT FOCUS TRANSFER BUTTON */}
              {!selectedNode.isCurrent && (
                <button
                  type="button"
                  onClick={() => handleSetCurrentFocus(selectedNode.id)}
                  className="w-full py-2 px-3 rounded-xl bg-primary/20 hover:bg-primary/30 border border-primary/40 text-primary text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">star</span>
                  Set as Current Focus
                </button>
              )}

              {/* Toggle Completion */}
              <button
                type="button"
                onClick={() => handleToggleSkillDone(selectedNode.id)}
                className={`w-full py-2 px-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer border ${
                  selectedNode.done
                    ? 'bg-zinc-800 border-white/10 text-zinc-400 hover:text-white'
                    : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30'
                }`}
              >
                <span className="material-symbols-outlined text-sm">
                  {selectedNode.done ? 'undo' : 'check_circle'}
                </span>
                {selectedNode.done ? 'Mark Incomplete' : 'Mark Completed'}
              </button>
            </div>

            {/* Prerequisites */}
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Prerequisite(s)</span>
              <p className="text-xs text-zinc-400 bg-white/[0.02] border border-white/5 p-2.5 rounded-xl uppercase font-mono">
                {selectedNode.dependencies && selectedNode.dependencies.length > 0
                  ? selectedNode.dependencies.join(', ')
                  : 'NONE (STARTING SKILL)'}
              </p>
            </div>

            {/* Linked Workspace Section */}
            <div className="space-y-2 pt-2 border-t border-white/5">
              <span className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Workspace Connection</span>
              {selectedNode.linkedWorkspaceId ? (
                (() => {
                  const linkedWs = (workspaces || []).find(w => w.id === selectedNode.linkedWorkspaceId);
                  return (
                    <div className="p-3 bg-white/[0.03] border border-white/10 rounded-xl space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-white flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-primary text-sm">folder_open</span>
                          {linkedWs ? linkedWs.title : 'Linked Workspace'}
                        </span>
                        <span className="text-primary font-bold">{linkedWs ? `${linkedWs.progress || 0}%` : 'Linked'}</span>
                      </div>
                      <div className="flex gap-2 pt-1">
                        <button
                          onClick={() => {
                            setSelectedNode(null);
                            navigate(`/workspaces/${selectedNode.linkedWorkspaceId}`);
                          }}
                          className="flex-1 py-1.5 rounded-lg bg-primary text-black text-xs font-bold uppercase cursor-pointer"
                        >
                          Open Workspace →
                        </button>
                        <button
                          onClick={() => setLinkWorkspaceModalSkill(selectedNode)}
                          className="px-3 py-1.5 rounded-lg bg-white/5 text-zinc-400 hover:text-white text-xs font-semibold cursor-pointer"
                        >
                          Change
                        </button>
                      </div>
                    </div>
                  );
                })()
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => setLinkWorkspaceModalSkill(selectedNode)}
                    className="flex-1 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    + Link Workspace
                  </button>
                  <button
                    onClick={() => handleCreateWorkspaceForSkill(selectedNode)}
                    className="flex-1 py-2 rounded-xl bg-primary/20 border border-primary/30 text-xs font-semibold text-primary hover:bg-primary/30 transition-colors cursor-pointer"
                  >
                    + Create Workspace
                  </button>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-white/5">
              <button
                type="button"
                onClick={() => handleRemoveSkillFromRoadmap(selectedNode.id)}
                className="text-xs text-red-400 hover:underline font-bold flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">delete</span>
                Delete Skill
              </button>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenEditSkill(selectedNode)}
                  className="px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-zinc-300 hover:text-white transition-colors cursor-pointer"
                >
                  Edit Skill
                </button>
                <Button variant="ghost" onClick={() => setSelectedNode(null)} className="py-1.5 text-xs font-bold">
                  Close
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* REQUIREMENT 5 & 6: SMART ADD/INSERT SKILL MODAL */}
      {isAddSkillModalOpen && (
        <Modal
          isOpen={isAddSkillModalOpen}
          onClose={() => setIsAddSkillModalOpen(false)}
          title={
            addSkillConfig.positionType === 'between'
              ? `INSERT SKILL BETWEEN ${addSkillConfig.referenceSkillTitle} & ${addSkillConfig.targetSkillTitle}`
              : addSkillConfig.positionType === 'before'
              ? `INSERT SKILL BEFORE ${addSkillConfig.referenceSkillTitle}`
              : `ADD SKILL TO ROADMAP`
          }
        >
          <form onSubmit={handleSaveAddSkill} className="space-y-4 text-on-surface select-none">
            
            {/* Skill Name Input (Allows typing normally, saved as UPPERCASE) */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Skill Name <span className="text-primary">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Python, Docker, PyTorch, React Native"
                value={addSkillConfig.title}
                onChange={(e) => setAddSkillConfig(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white text-xs focus:outline-none focus:border-primary/50"
                required
                autoFocus
              />
            </div>

            {/* Position Choice Selector */}
            {addSkillConfig.positionType !== 'between' && (
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-zinc-300">Where should this skill go?</label>
                <div className="space-y-2 bg-white/[0.02] border border-white/5 p-3 rounded-xl">
                  <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                    <input
                      type="radio"
                      name="posType"
                      checked={addSkillConfig.positionType === 'after'}
                      onChange={() => setAddSkillConfig(prev => ({ ...prev, positionType: 'after' }))}
                      className="accent-primary"
                    />
                    <span>After a skill</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                    <input
                      type="radio"
                      name="posType"
                      checked={addSkillConfig.positionType === 'before'}
                      onChange={() => setAddSkillConfig(prev => ({ ...prev, positionType: 'before' }))}
                      className="accent-primary"
                    />
                    <span>Before a skill</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                    <input
                      type="radio"
                      name="posType"
                      checked={addSkillConfig.positionType === 'beginning'}
                      onChange={() => setAddSkillConfig(prev => ({ ...prev, positionType: 'beginning' }))}
                      className="accent-primary"
                    />
                    <span>At beginning (First skill)</span>
                  </label>
                </div>
              </div>
            )}

            {/* Reference Skill Dropdown */}
            {(addSkillConfig.positionType === 'after' || addSkillConfig.positionType === 'before') && (
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Select Skill ({addSkillConfig.positionType === 'after' ? 'Prerequisite' : 'Follower'})
                </label>
                <select
                  value={addSkillConfig.referenceSkillTitle}
                  onChange={(e) => setAddSkillConfig(prev => ({ ...prev, referenceSkillTitle: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0F0F16] border border-white/10 text-white text-xs focus:outline-none focus:border-primary/50 cursor-pointer uppercase"
                >
                  {skills.map(sk => (
                    <option key={sk.id} value={sk.title}>{sk.title}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Learning Relationship Selector */}
            <div className="space-y-1.5 pt-1">
              <label className="block text-xs font-semibold text-zinc-300">Relationship</label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setAddSkillConfig(prev => ({ ...prev, isParallel: false }))}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    !addSkillConfig.isParallel
                      ? 'bg-primary/20 text-primary border-primary/40'
                      : 'bg-white/5 border-white/5 text-zinc-400 hover:text-white'
                  }`}
                >
                  Continue sequentially
                </button>
                <button
                  type="button"
                  onClick={() => setAddSkillConfig(prev => ({ ...prev, isParallel: true }))}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    addSkillConfig.isParallel
                      ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                      : 'bg-white/5 border-white/5 text-zinc-400 hover:text-white'
                  }`}
                >
                  Learn in parallel branch
                </button>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-white/5">
              <button
                type="button"
                onClick={() => setIsAddSkillModalOpen(false)}
                className="px-4 py-2 text-xs text-zinc-400 hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <Button type="submit" variant="primary" className="py-2 px-5 text-xs font-bold uppercase">
                Add Skill
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* REQUIREMENT 8 & 9: FULL SKILL EDIT MODAL */}
      {editingSkill && (
        <Modal isOpen={Boolean(editingSkill)} onClose={() => setEditingSkill(null)} title={`EDIT SKILL: ${editingSkill.title.toUpperCase()}`}>
          <form onSubmit={handleSaveSkillEdit} className="space-y-4 text-on-surface select-none">
            
            {/* Skill Name */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Skill Name</label>
              <input
                type="text"
                value={editSkillForm.title}
                onChange={(e) => setEditSkillForm(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white text-xs focus:outline-none focus:border-primary/50 uppercase font-bold"
                required
              />
            </div>

            {/* Position Change Dropdown */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Move Position</label>
                <select
                  value={editSkillForm.positionType}
                  onChange={(e) => setEditSkillForm(prev => ({ ...prev, positionType: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0F0F16] border border-white/10 text-white text-xs focus:outline-none focus:border-primary/50 cursor-pointer"
                >
                  <option value="same">Keep Current Position</option>
                  <option value="after">Move After...</option>
                  <option value="before">Move Before...</option>
                  <option value="beginning">Move to Beginning</option>
                </select>
              </div>

              {(editSkillForm.positionType === 'after' || editSkillForm.positionType === 'before') && (
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Reference Skill</label>
                  <select
                    value={editSkillForm.positionRefTitle}
                    onChange={(e) => setEditSkillForm(prev => ({ ...prev, positionRefTitle: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0F0F16] border border-white/10 text-white text-xs focus:outline-none focus:border-primary/50 cursor-pointer uppercase"
                  >
                    <option value="">Select Skill...</option>
                    {skills.filter(s => s.id !== editingSkill.id).map(sk => (
                      <option key={sk.id} value={sk.title}>{sk.title}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Learning Relationship */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-zinc-300">Learning Relationship</label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setEditSkillForm(prev => ({ ...prev, isParallel: false }))}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    !editSkillForm.isParallel
                      ? 'bg-primary/20 text-primary border-primary/40'
                      : 'bg-white/5 border-white/5 text-zinc-400 hover:text-white'
                  }`}
                >
                  Sequential Main Path
                </button>
                <button
                  type="button"
                  onClick={() => setEditSkillForm(prev => ({ ...prev, isParallel: true }))}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    editSkillForm.isParallel
                      ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                      : 'bg-white/5 border-white/5 text-zinc-400 hover:text-white'
                  }`}
                >
                  Parallel Branch
                </button>
              </div>
            </div>

            {/* Linked Workspace */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Workspace Connection</label>
              <select
                value={editSkillForm.linkedWorkspaceId}
                onChange={(e) => setEditSkillForm(prev => ({ ...prev, linkedWorkspaceId: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl bg-[#0F0F16] border border-white/10 text-white text-xs focus:outline-none focus:border-primary/50 cursor-pointer"
              >
                <option value="">No Workspace Linked</option>
                {(workspaces || []).map(ws => (
                  <option key={ws.id} value={ws.id}>{ws.title} ({ws.progress || 0}%)</option>
                ))}
              </select>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-white/5">
              <button
                type="button"
                onClick={() => handleRemoveSkillFromRoadmap(editingSkill.id)}
                className="text-xs text-red-400 hover:underline font-bold cursor-pointer"
              >
                Delete Skill
              </button>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditingSkill(null)}
                  className="px-4 py-2 text-xs text-zinc-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <Button type="submit" variant="primary" className="py-2 px-5 text-xs font-bold uppercase">
                  Save Changes
                </Button>
              </div>
            </div>
          </form>
        </Modal>
      )}

      {/* Link Workspace Modal */}
      {linkWorkspaceModalSkill && (
        <Modal
          isOpen={Boolean(linkWorkspaceModalSkill)}
          onClose={() => setLinkWorkspaceModalSkill(null)}
          title={`LINK WORKSPACE FOR ${linkWorkspaceModalSkill.title.toUpperCase()}`}
        >
          <div className="space-y-4 text-on-surface select-none">
            <p className="text-xs text-zinc-400">
              Select an existing Workspace to link progress to <strong className="text-white uppercase">{linkWorkspaceModalSkill.title}</strong>.
            </p>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Existing Workspaces</label>
              <select
                value={selectedWorkspaceToLink}
                onChange={(e) => setSelectedWorkspaceToLink(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#0F0F16] border border-white/10 text-white text-xs focus:outline-none focus:border-primary/50 cursor-pointer"
              >
                <option value="">Select a Workspace...</option>
                {(workspaces || []).map(ws => (
                  <option key={ws.id} value={ws.id}>
                    {ws.title} ({ws.progress || 0}% progress)
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-white/5">
              <button
                type="button"
                onClick={() => handleCreateWorkspaceForSkill(linkWorkspaceModalSkill)}
                className="text-xs text-primary font-bold hover:underline flex items-center gap-1 cursor-pointer"
              >
                + Create New Workspace
              </button>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setLinkWorkspaceModalSkill(null)}
                  className="px-3 py-1.5 rounded-lg text-xs text-zinc-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <Button
                  disabled={!selectedWorkspaceToLink}
                  onClick={handleConfirmLinkWorkspace}
                  variant="primary"
                  className="py-1.5 px-4 text-xs font-bold uppercase"
                >
                  Link Workspace
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setIsDeleteModalOpen(false)} className="fixed inset-0 bg-black/75 backdrop-blur-sm" />
          <div className="relative bg-[#111118] border border-white/10 rounded-2xl max-w-sm w-full p-6 space-y-4 text-center z-10 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mx-auto">
              <span className="material-symbols-outlined text-2xl">delete_forever</span>
            </div>
            <div className="space-y-1">
              <h3 className="font-space-grotesk text-lg font-bold text-white">Delete roadmap?</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                This will remove the roadmap and its structure. Linked workspaces will not be deleted.
              </p>
            </div>
            <div className="flex justify-center gap-3 pt-2">
              <Button variant="ghost" className="px-4 py-2 text-xs" onClick={() => setIsDeleteModalOpen(false)}>
                Cancel
              </Button>
              <button
                onClick={handleDeleteRoadmap}
                className="px-4 py-2 rounded-xl bg-red-500/20 text-red-400 border border-red-500/40 text-xs font-bold uppercase hover:bg-red-500/30 transition-all cursor-pointer"
              >
                Delete Roadmap
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast notifications */}
      {toast.message && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ message: '', type: 'success' })}
        />
      )}
    </div>
  );
};

export default RoadmapDetail;
