import React, { useState, useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Button from '../components/Button';
import Toast from '../components/Toast';
import Modal from '../components/Modal';
import { TaskContext } from '../context/TaskContext';
import CreateRoadmapModal from '../components/CreateRoadmapModal';

const FILTER_TABS = ['All', 'Programming', 'Web Development', 'Data / AI', 'Mobile Development', 'Cybersecurity', 'Career', 'Other'];

const Roadmaps = () => {
  const navigate = useNavigate();
  const { userRoadmaps, addRoadmap, updateRoadmap, deleteRoadmap, workspaces } = useContext(TaskContext);

  const [activeTab, setActiveTab] = useState('All');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createInitialMode, setCreateInitialMode] = useState('ai');
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Edit Roadmap Modal State
  const [editingRoadmap, setEditingRoadmap] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState('');

  // Dropdown menu state for roadmap cards
  const [activeMenuId, setActiveMenuId] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const filteredRoadmaps = useMemo(() => {
    if (!userRoadmaps) return [];
    if (activeTab === 'All') return userRoadmaps;
    return userRoadmaps.filter(r => (r.category || 'Programming') === activeTab);
  }, [userRoadmaps, activeTab]);

  const handleSaveRoadmap = async (roadmapData) => {
    try {
      const newId = await addRoadmap(roadmapData);
      showToast('✓ Roadmap created successfully');
      if (newId) {
        navigate(`/roadmaps/${newId}`);
      }
    } catch (err) {
      console.error(err);
      showToast('Could not save roadmap. Please try again.', 'error');
    }
  };

  const handleDeleteRoadmap = async (id) => {
    try {
      await deleteRoadmap(id);
      showToast('Roadmap deleted', 'info');
      setDeleteConfirmId(null);
    } catch (err) {
      console.error(err);
      showToast('Could not delete roadmap', 'error');
    }
  };

  const handleDuplicateRoadmap = async (roadmap) => {
    try {
      const duplicatedSkills = (roadmap.skills || []).map(sk => ({
        ...sk,
        id: `sk-dup-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        done: false,
        isCurrent: false,
        linkedWorkspaceId: null
      }));
      if (duplicatedSkills[0]) duplicatedSkills[0].isCurrent = true;

      const dupId = await addRoadmap({
        title: `${roadmap.title} (Copy)`,
        description: roadmap.description,
        category: roadmap.category,
        isAiGenerated: false,
        estimatedTime: roadmap.estimatedTime || '~2–4 weeks',
        skills: duplicatedSkills
      });

      showToast('✓ Roadmap duplicated successfully');
      setActiveMenuId(null);
      if (dupId) navigate(`/roadmaps/${dupId}`);
    } catch (err) {
      console.error(err);
      showToast('Could not duplicate roadmap', 'error');
    }
  };

  const handleOpenEditModal = (roadmap) => {
    setEditingRoadmap(roadmap);
    setEditTitle(roadmap.title);
    setEditCategory(roadmap.category || 'Programming');
    setActiveMenuId(null);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingRoadmap) return;
    try {
      await updateRoadmap(editingRoadmap.id, {
        title: editTitle.trim(),
        category: editCategory
      });
      showToast('✓ Roadmap updated');
      setEditingRoadmap(null);
    } catch (err) {
      console.error(err);
      showToast('Could not update roadmap', 'error');
    }
  };

  const handleOpenCreateModal = (mode = 'ai') => {
    setCreateInitialMode(mode);
    setIsCreateModalOpen(true);
  };

  return (
    <div className="flex min-h-screen bg-[#050507] text-on-surface select-none font-dm-sans" onClick={() => setActiveMenuId(null)}>
      <Sidebar />

      <main className="flex-grow flex flex-col h-screen overflow-y-auto no-scrollbar relative z-10 animate-page-transition">
        <Header hideSearch={true} hideStreak={true} hideLogo={true} workspaceTitle="ROADMAPS" />

        <div className="px-4 py-6 md:px-10 md:py-8 max-w-7xl w-full mx-auto space-y-8">
          
          {/* Header Section */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/5 pb-6">
            <div>
              <h1 className="font-space-grotesk text-2xl md:text-3xl font-bold text-white tracking-tight">
                ROADMAPS
              </h1>
              <p className="text-zinc-400 text-xs md:text-sm mt-1 font-normal">
                Organize what you want to learn, dependencies, and parallel skills.
              </p>
            </div>

            <Button
              variant="primary"
              icon="add"
              className="w-full md:w-auto min-h-[44px] sm:min-h-0 py-2.5 px-5 font-space-grotesk text-xs font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(139,92,246,0.3)] flex items-center justify-center"
              onClick={() => handleOpenCreateModal('ai')}
            >
              + CREATE ROADMAP
            </Button>
          </div>

          {/* Filter Tabs */}
          {userRoadmaps && userRoadmaps.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
              {FILTER_TABS.map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer whitespace-nowrap border ${
                    activeTab === tab
                      ? 'bg-primary/15 text-primary border-primary/30 shadow-[0_0_12px_rgba(139,92,246,0.15)] font-bold'
                      : 'bg-white/[0.02] text-zinc-400 border-white/5 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          )}

          {/* Roadmaps List / Calm Minimal Empty State */}
          {filteredRoadmaps.length === 0 ? (
            <div className="bg-[#09090D] border border-white/5 rounded-2xl p-8 md:p-12 text-center space-y-4 max-w-md mx-auto my-12 shadow-2xl">
              <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mx-auto">
                <span className="material-symbols-outlined text-xl">alt_route</span>
              </div>

              <div className="space-y-1">
                <h3 className="font-space-grotesk text-base font-bold text-white">
                  No roadmaps yet
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed max-w-sm mx-auto">
                  Create a roadmap to organize what you want to learn and understand what to focus on next.
                </p>
              </div>

              <div className="pt-2 flex flex-col items-center gap-3">
                <Button
                  variant="primary"
                  className="py-2 px-5 text-xs font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(139,92,246,0.2)]"
                  onClick={() => handleOpenCreateModal('ai')}
                >
                  + Create Roadmap
                </Button>

                <button
                  onClick={() => handleOpenCreateModal('ai')}
                  className="text-xs text-primary/80 hover:text-primary transition-colors flex items-center gap-1 font-semibold cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">auto_awesome</span>
                  Generate with AI
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRoadmaps.map(roadmap => {
                const skills = roadmap.skills || [];
                const totalCount = skills.length;
                
                // Calculate progress dynamically considering linked workspace progress
                let progressSum = 0;
                skills.forEach(sk => {
                  if (sk.done) {
                    progressSum += 100;
                  } else if (sk.linkedWorkspaceId) {
                    const linkedWs = (workspaces || []).find(w => w.id === sk.linkedWorkspaceId);
                    if (linkedWs) {
                      progressSum += (linkedWs.progress || 0);
                    }
                  }
                });
                const overallProgress = totalCount > 0 ? Math.round(progressSum / totalCount) : 0;
                const isCompleted = overallProgress === 100;

                return (
                  <div
                    key={roadmap.id}
                    onClick={() => navigate(`/roadmaps/${roadmap.id}`)}
                    className="bg-[#0B0B10] border border-white/10 hover:border-primary/40 rounded-2xl p-5 space-y-4 transition-all duration-300 group hover:shadow-[0_0_25px_rgba(139,92,246,0.12)] relative overflow-hidden cursor-pointer flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      {/* Header: Category & Menu */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-zinc-400 text-[10px] font-bold uppercase tracking-wider">
                            {roadmap.category || 'Programming'}
                          </span>
                          <span className="text-[11px] text-zinc-500 font-semibold">
                            • {totalCount} {totalCount === 1 ? 'Skill' : 'Skills'}
                          </span>
                        </div>

                        {/* ••• Actions Menu */}
                        <div className="relative" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => setActiveMenuId(activeMenuId === roadmap.id ? null : roadmap.id)}
                            className="p-1 rounded-lg text-zinc-500 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-base">more_vert</span>
                          </button>

                          {activeMenuId === roadmap.id && (
                            <div className="absolute right-0 top-7 z-30 bg-[#12121A] border border-white/10 rounded-xl shadow-2xl py-1.5 w-40 space-y-0.5 animate-fadeIn">
                              <button
                                onClick={() => {
                                  setActiveMenuId(null);
                                  navigate(`/roadmaps/${roadmap.id}`);
                                }}
                                className="w-full text-left px-3 py-1.5 text-xs text-zinc-300 hover:text-white hover:bg-white/5 flex items-center gap-2 cursor-pointer"
                              >
                                <span className="material-symbols-outlined text-sm text-primary">visibility</span>
                                Open Roadmap
                              </button>
                              <button
                                onClick={() => handleOpenEditModal(roadmap)}
                                className="w-full text-left px-3 py-1.5 text-xs text-zinc-300 hover:text-white hover:bg-white/5 flex items-center gap-2 cursor-pointer"
                              >
                                <span className="material-symbols-outlined text-sm text-amber-400">edit</span>
                                Edit
                              </button>
                              <button
                                onClick={() => handleDuplicateRoadmap(roadmap)}
                                className="w-full text-left px-3 py-1.5 text-xs text-zinc-300 hover:text-white hover:bg-white/5 flex items-center gap-2 cursor-pointer"
                              >
                                <span className="material-symbols-outlined text-sm text-cyan-400">content_copy</span>
                                Duplicate
                              </button>
                              <div className="border-t border-white/5 my-1" />
                              <button
                                onClick={() => {
                                  setActiveMenuId(null);
                                  setDeleteConfirmId(roadmap.id);
                                }}
                                className="w-full text-left px-3 py-1.5 text-xs text-red-400 hover:bg-red-500/10 flex items-center gap-2 cursor-pointer"
                              >
                                <span className="material-symbols-outlined text-sm">delete</span>
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Roadmap Title & Description */}
                      <div>
                        <h3 className="font-space-grotesk text-base font-bold text-white group-hover:text-primary transition-colors line-clamp-1">
                          {roadmap.title}
                        </h3>
                        <p className="text-xs text-zinc-400 line-clamp-2 mt-1 font-normal">
                          {roadmap.description || 'Structured learning roadmap.'}
                        </p>
                      </div>

                      {/* Skill Flow Preview Pills */}
                      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
                        {skills.slice(0, 4).map((sk, idx) => (
                          <span
                            key={sk.id || idx}
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold whitespace-nowrap border ${
                              sk.done
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                : sk.isCurrent
                                ? 'bg-primary/20 text-primary border-primary/40 font-bold'
                                : 'bg-white/5 text-zinc-400 border-white/5'
                            }`}
                          >
                            {sk.done ? `✓ ${sk.title}` : sk.title}
                          </span>
                        ))}
                        {skills.length > 4 && (
                          <span className="text-[10px] text-zinc-500 font-bold shrink-0">
                            +{skills.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Progress Bar & Footer */}
                    <div className="pt-3 border-t border-white/5 space-y-2">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-semibold text-zinc-400">
                          {isCompleted ? 'Completed' : 'In Progress'}
                        </span>
                        <span className="font-bold text-primary">{overallProgress}%</span>
                      </div>

                      <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary-dark via-primary to-primary-light transition-all duration-500"
                          style={{ width: `${overallProgress}%` }}
                        />
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setDeleteConfirmId(null)} className="fixed inset-0 bg-black/75 backdrop-blur-sm" />
          <div className="relative bg-[#111118] border border-white/10 rounded-2xl max-w-sm w-full p-6 space-y-4 text-center z-10 shadow-2xl animate-scaleUp">
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
              <Button variant="ghost" className="px-4 py-2 text-xs" onClick={() => setDeleteConfirmId(null)}>
                Cancel
              </Button>
              <button
                onClick={() => handleDeleteRoadmap(deleteConfirmId)}
                className="px-4 py-2 rounded-xl bg-red-500/20 text-red-400 border border-red-500/40 text-xs font-bold uppercase hover:bg-red-500/30 transition-all cursor-pointer"
              >
                Delete Roadmap
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Edit Roadmap Modal */}
      {editingRoadmap && (
        <Modal isOpen={Boolean(editingRoadmap)} onClose={() => setEditingRoadmap(null)} title="Edit Roadmap">
          <form onSubmit={handleSaveEdit} className="space-y-4 text-on-surface select-none">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Roadmap Title</label>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full px-4 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-white text-sm focus:outline-none focus:border-primary/50"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Category</label>
              <select
                value={editCategory}
                onChange={(e) => setEditCategory(e.target.value)}
                className="w-full px-4 py-2 rounded-xl bg-[#0F0F16] border border-white/10 text-white text-sm focus:outline-none focus:border-primary/50 cursor-pointer"
              >
                {FILTER_TABS.filter(t => t !== 'All').map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-white/5">
              <button
                type="button"
                onClick={() => setEditingRoadmap(null)}
                className="px-4 py-2 rounded-xl text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <Button type="submit" variant="primary" className="py-2 px-5 text-xs font-bold uppercase">
                Save Changes
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* AI / Manual Roadmap Creation Modal */}
      <CreateRoadmapModal
        isOpen={isCreateModalOpen}
        initialMode={createInitialMode}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleSaveRoadmap}
      />

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

export default Roadmaps;
