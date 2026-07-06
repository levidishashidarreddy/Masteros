import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Button from '../components/Button';
import ProgressRing from '../components/ProgressRing';
import Modal from '../components/Modal';
import InputField from '../components/InputField';
import { TaskContext } from '../context/TaskContext';
import { WorkspaceDetailSkeleton } from '../components/Skeleton';
import ErrorState from '../components/ErrorState';

import { AvatarImg, getAvatar } from '../components/Avatar';

const WorkspaceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { 
    workspaces, 
    collaboratedWorkspaces,
    currentUser,
    updateWorkspace, 
    deleteWorkspace,
    toggleSubtopic,
    tasks, 
    addTask, 
    editTask, 
    deleteTask, 
    toggleTask, 
    togglePin,
    friends,
    inviteCollaborator,
    removeCollaborator,
    allUsers,
    userProfile,
    presenceStates,
    logProductiveActivity,
    loading: contextLoading
  } = useContext(TaskContext);

  const ws = (workspaces || []).find(w => w.id === id) || (collaboratedWorkspaces || []).find(w => w.id === id);

  // Pomodoro Study Timer states
  const [timerMinutes, setTimerMinutes] = useState(25);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [timerType, setTimerType] = useState('focus'); // 'focus' or 'break'
  const [selectedDuration, setSelectedDuration] = useState(25);

  useEffect(() => {
    let interval = null;
    if (timerActive) {
      interval = setInterval(() => {
        if (timerSeconds > 0) {
          setTimerSeconds(timerSeconds - 1);
        } else if (timerSeconds === 0) {
          if (timerMinutes === 0) {
            setTimerActive(false);
            clearInterval(interval);
            handleTimerComplete();
          } else {
            setTimerMinutes(timerMinutes - 1);
            setTimerSeconds(59);
          }
        }
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerActive, timerMinutes, timerSeconds]);

  const handleTimerComplete = async () => {
    if (timerType === 'focus') {
      alert("🎉 Great job! Study session completed. You earned +15 XP and maintained your streak!");
      if (logProductiveActivity) {
        await logProductiveActivity('studySession');
      }
    } else {
      alert("☕ Break time is over. Ready to build?");
    }
    resetTimer();
  };

  const startTimer = () => setTimerActive(true);
  const pauseTimer = () => setTimerActive(false);
  const resetTimer = () => {
    setTimerActive(false);
    setTimerMinutes(selectedDuration);
    setTimerSeconds(0);
  };

  const handleSelectDuration = (mins) => {
    setSelectedDuration(mins);
    setTimerMinutes(mins);
    setTimerSeconds(0);
    setTimerActive(false);
  };

  // Skeleton Loading simulation state
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!contextLoading) {
      setLoading(false);
    }
  }, [contextLoading, id]);

  // Form & Modal States
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [taskText, setTaskText] = useState('');
  const [taskPriority, setTaskPriority] = useState('Med');
  const [taskDueDate, setTaskDueDate] = useState('');
  const [taskDueTime, setTaskDueTime] = useState('');
  const [taskRecurring, setTaskRecurring] = useState('None');
  const [taskProgress, setTaskProgress] = useState(0);

  // Invite states
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteFriendId, setInviteFriendId] = useState('');
  const [inviteRole, setInviteRole] = useState('Editor');

  // Resource states
  const [isResourceModalOpen, setIsResourceModalOpen] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [resourceTitle, setResourceTitle] = useState('');
  const [resourceCategory, setResourceCategory] = useState('YouTube');
  const [resourceLink, setResourceLink] = useState('');
  const [resourceThumbnail, setResourceThumbnail] = useState('');

  // Topic add state
  const [isTopicModalOpen, setIsTopicModalOpen] = useState(false);
  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [activeRoadmapForTopic, setActiveRoadmapForTopic] = useState('');

  // Topic edit state
  const [isEditTopicModalOpen, setIsEditTopicModalOpen] = useState(false);
  const [topicToEdit, setTopicToEdit] = useState(null);
  const [editTopicRoadmapId, setEditTopicRoadmapId] = useState('');
  const [editTopicTitle, setEditTopicTitle] = useState('');

  // Overhaul states
  const [deleteStep, setDeleteStep] = useState(0);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [isCollabCollapsed, setIsCollabCollapsed] = useState(true);

  const toggleCollabCollapse = () => {
    setIsCollabCollapsed(!isCollabCollapsed);
  };

  // Subtopic inline state
  const [activeTopicForSubtopic, setActiveTopicForSubtopic] = useState(null);
  const [newSubtopicText, setNewSubtopicText] = useState('');

  // Notepad state
  const [notesText, setNotesText] = useState(ws?.notes || '');
  const [isNotesEditing, setIsNotesEditing] = useState(false);

  useEffect(() => {
    if (ws) {
      setNotesText(ws.notes || '');
    }
  }, [ws]);

  if (!ws) {
    return (
      <div className="flex min-h-screen bg-background text-on-surface select-none">
        <Sidebar />
        <main className="flex-grow p-8 flex items-center justify-center">
          <ErrorState 
            title="Failed to load workspace" 
            description="The workspace you are looking for does not exist or has been deleted."
            onRetry={() => navigate('/workspaces')}
          />
        </main>
      </div>
    );
  }

  // Check if Fitness or Gym category
  const isFitnessOrGym = 
    ws.category === 'Fitness' || 
    ws.id === 'fitness' || 
    ws.title.toLowerCase().includes('fitness') || 
    ws.title.toLowerCase().includes('gym');

  const isWorkspaceOwner = ws.ownerId === currentUser?.uid;
  const ownerUser = allUsers.find(u => u.uid === ws.ownerId);
  const ownerName = ownerUser ? (ownerUser.fullName || ownerUser.username) : 'Owner';

  // Construct collabList from ws.collaborators array
  const collabList = [
    { userId: ownerUser?.userId || 'owner', role: 'Owner', fullName: ownerName, username: ownerUser?.username || 'owner', isOwner: true },
    ...(ws.collaborators || []).map(collabUserId => {
      const u = allUsers.find(user => user.userId === collabUserId);
      return {
        userId: collabUserId,
        role: 'Collaborator',
        fullName: u ? u.fullName : collabUserId,
        username: u ? u.username : collabUserId,
        isOwner: false
      };
    })
  ];

  const workspaceTasks = tasks.filter(t => t.workspaceId === id);
  
  // Calculate Roadmap Progresses
  const getRoadmapProgress = (rm) => {
    let total = 0;
    let completed = 0;
    (rm.topics || []).forEach(t => {
      (t.subtopics || []).forEach(st => {
        total++;
        if (st.done) completed++;
      });
    });
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  // Topic control actions
  const handleToggleTopicExpand = (roadmapId, topicId) => {
    const updatedRoadmaps = (ws.roadmaps || []).map(rm => {
      if (rm.id !== roadmapId) return rm;
      return {
        ...rm,
        topics: (rm.topics || []).map(t => {
          if (t.id !== topicId) return t;
          return { ...t, expanded: !t.expanded };
        })
      };
    });
    updateWorkspace(id, { roadmaps: updatedRoadmaps });
  };

  const handleAddTopicSubmit = (e) => {
    e.preventDefault();
    if (!newTopicTitle.trim() || !activeRoadmapForTopic) return;

    const newTopic = {
      id: `topic-${Date.now()}`,
      title: newTopicTitle.trim(),
      expanded: true,
      subtopics: []
    };

    const updatedRoadmaps = (ws.roadmaps || []).map(rm => {
      if (rm.id !== activeRoadmapForTopic) return rm;
      return {
        ...rm,
        topics: [...(rm.topics || []), newTopic]
      };
    });

    updateWorkspace(id, { roadmaps: updatedRoadmaps });
    setNewTopicTitle('');
    setIsTopicModalOpen(false);
  };

  // Open Edit Topic Rename Modal
  const handleOpenEditTopic = (roadmapId, topic) => {
    setEditTopicRoadmapId(roadmapId);
    setTopicToEdit(topic);
    setEditTopicTitle(topic.title);
    setIsEditTopicModalOpen(true);
  };

  const handleEditTopicSubmit = (e) => {
    e.preventDefault();
    if (!editTopicTitle.trim() || !topicToEdit || !editTopicRoadmapId) return;

    const updatedRoadmaps = (ws.roadmaps || []).map(rm => {
      if (rm.id !== editTopicRoadmapId) return rm;
      return {
        ...rm,
        topics: (rm.topics || []).map(t => {
          if (t.id !== topicToEdit.id) return t;
          return { ...t, title: editTopicTitle.trim() };
        })
      };
    });

    updateWorkspace(id, { roadmaps: updatedRoadmaps });
    setIsEditTopicModalOpen(false);
    setTopicToEdit(null);
  };

  const handleRemoveTopic = (roadmapId, topicId) => {
    const updatedRoadmaps = (ws.roadmaps || []).map(rm => {
      if (rm.id !== roadmapId) return rm;
      return {
        ...rm,
        topics: (rm.topics || []).filter(t => t.id !== topicId)
      };
    });
    updateWorkspace(id, { roadmaps: updatedRoadmaps });
  };

  const handleReorderTopic = (roadmapId, topicId, direction) => {
    const rm = (ws.roadmaps || []).find(r => r.id === roadmapId);
    if (!rm) return;
    const index = (rm.topics || []).findIndex(t => t.id === topicId);
    if (index === -1) return;

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= (rm.topics || []).length) return;

    const newTopics = [...(rm.topics || [])];
    const temp = newTopics[index];
    newTopics[index] = newTopics[newIndex];
    newTopics[newIndex] = temp;

    const updatedRoadmaps = (ws.roadmaps || []).map(r => {
      if (r.id !== roadmapId) return r;
      return { ...r, topics: newTopics };
    });
    updateWorkspace(id, { roadmaps: updatedRoadmaps });
  };

  const handleAddSubtopicSubmit = (e, roadmapId, topicId) => {
    e.preventDefault();
    if (!newSubtopicText.trim()) return;

    const newSt = {
      id: `subtopic-${Date.now()}`,
      title: newSubtopicText.trim(),
      done: false
    };

    const updatedRoadmaps = (ws.roadmaps || []).map(rm => {
      if (rm.id !== roadmapId) return rm;
      return {
        ...rm,
        topics: (rm.topics || []).map(t => {
          if (t.id !== topicId) return t;
          return {
            ...t,
            subtopics: [...(t.subtopics || []), newSt]
          };
        })
      };
    });

    updateWorkspace(id, { roadmaps: updatedRoadmaps });
    setNewSubtopicText('');
    setActiveTopicForSubtopic(null);
  };

  const handleRemoveSubtopic = (roadmapId, topicId, subtopicId) => {
    const updatedRoadmaps = (ws.roadmaps || []).map(rm => {
      if (rm.id !== roadmapId) return rm;
      return {
        ...rm,
        topics: (rm.topics || []).map(t => {
          if (t.id !== topicId) return t;
          return {
            ...t,
            subtopics: (t.subtopics || []).filter(st => st.id !== subtopicId)
          };
        })
      };
    });
    updateWorkspace(id, { roadmaps: updatedRoadmaps });
  };

  // Task Actions
  const handleOpenAddTask = () => {
    setEditingTask(null);
    setTaskText('');
    setTaskPriority('Med');
    setTaskDueDate(new Date().toISOString().split('T')[0]);
    setTaskDueTime('12:00');
    setTaskRecurring('None');
    setTaskProgress(0);
    setIsTaskModalOpen(true);
  };

  const handleOpenEditTask = (task) => {
    setEditingTask(task);
    setTaskText(task.text);
    setTaskPriority(task.priority);
    setTaskDueDate(task.dueDate || '');
    setTaskDueTime(task.dueTime || '');
    setTaskRecurring(task.recurring || 'None');
    setTaskProgress(task.progress || 0);
    setIsTaskModalOpen(true);
  };

  const handleTaskSubmit = (e) => {
    e.preventDefault();
    const taskData = {
      text: taskText,
      priority: taskPriority,
      dueDate: taskDueDate,
      dueTime: taskDueTime,
      workspaceId: id,
      recurring: taskRecurring,
      progress: parseInt(taskProgress) || 0,
      done: parseInt(taskProgress) === 100
    };

    if (editingTask) {
      editTask(editingTask.id, taskData);
    } else {
      addTask(taskData);
    }
    setIsTaskModalOpen(false);
  };

  // Notepad Actions
  const handleSaveNotes = () => {
    updateWorkspace(id, { notes: notesText });
    setIsNotesEditing(false);
  };

  const appendNoteTemplate = (templateType) => {
    let tag = '';
    switch (templateType) {
      case 'code':
        tag = '\n```javascript\n// Code block here\n\n```\n';
        break;
      case 'list':
        tag = '\n- [ ] Task checkitem\n- [ ] Task checkitem\n';
        break;
      case 'table':
        tag = '\n| Title | Category | Link |\n|---|---|---|\n| concept | key | data |\n';
        break;
      default:
        tag = '\n**Important Concept:** ';
    }
    setNotesText(prev => prev + tag);
  };

  // Resource Actions
  const handleOpenAddResource = () => {
    setEditingResource(null);
    setResourceTitle('');
    setResourceCategory('YouTube');
    setResourceLink('');
    setResourceThumbnail('');
    setIsResourceModalOpen(true);
  };

  const handleOpenEditResource = (res) => {
    setEditingResource(res);
    setResourceTitle(res.title);
    setResourceCategory(res.category);
    setResourceLink(res.link);
    setResourceThumbnail(res.thumbnail);
    setIsResourceModalOpen(true);
  };

  const handleResourceSubmit = (e) => {
    e.preventDefault();
    const resData = {
      id: editingResource ? editingResource.id : `res-${Date.now()}`,
      title: resourceTitle,
      category: resourceCategory,
      link: resourceLink,
      thumbnail: resourceThumbnail || 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=150&q=80'
    };

    let updatedResources = [];
    if (editingResource) {
      updatedResources = (ws.resources || []).map(r => r.id === editingResource.id ? resData : r);
    } else {
      updatedResources = [...(ws.resources || []), resData];
    }

    updateWorkspace(id, { resources: updatedResources });
    setIsResourceModalOpen(false);
  };

  const handleDeleteResource = (resId) => {
    const updated = (ws.resources || []).filter(r => r.id !== resId);
    updateWorkspace(id, { resources: updated });
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-500/10 text-red-400 border border-red-500/20';
      case 'Med': return 'bg-primary/10 text-primary border border-primary/20';
      default: return 'bg-white/5 text-on-surface-variant border border-white/5';
    }
  };

  // Skeleton view
  if (loading) {
    return (
      <div className="flex min-h-screen bg-background text-on-surface select-none">
        <Sidebar />
        <main className="flex-1 flex flex-col h-screen overflow-y-auto no-scrollbar relative z-10">
          <Header hideSearch={true} hideStreak={true} hideLogo={true} />
          <div className="p-8 space-y-8">
            <WorkspaceDetailSkeleton />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background text-on-surface radial-glow-bg select-none relative">
      <Sidebar />

      {/* Gym Workspace Disabled Overlay Banner */}
      {isFitnessOrGym && (
        <div className="absolute inset-0 bg-[#0D0D14]/90 backdrop-blur-md z-[80] flex flex-col items-center justify-center space-y-5">
          <span className="material-symbols-outlined text-yellow-500 text-6xl animate-bounce">construction</span>
          <h2 className="text-2xl font-bold text-white tracking-tight">🚧 Gym Workspace</h2>
          <p className="text-on-surface-variant text-sm font-semibold text-center max-w-sm">
            "Will be available in the next version."
          </p>
          <Link to="/workspaces">
            <Button variant="secondary" icon="arrow_back">Go back to Workspaces</Button>
          </Link>
        </div>
      )}

      <main className="flex-grow flex flex-col h-screen overflow-y-auto no-scrollbar relative z-10 animate-page-transition">
        <Header hideSearch={true} hideStreak={true} hideLogo={true} />

        {/* Top Breadcrumb Navigation */}
        <div className="bg-background/60 backdrop-blur-xl border-b border-white/5 px-8 py-4 flex items-center justify-between shrink-0">
          <nav className="flex gap-2 items-center font-label-md text-xs font-bold uppercase tracking-wider">
            <Link to="/workspaces" className="text-on-surface-variant hover:text-white transition-colors flex items-center gap-1">
              Workspaces 
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            </Link>
            <span className="text-primary font-bold">{ws.title}</span>
          </nav>
        </div>

        {/* Workspace Banner */}
        <div className="relative w-full h-[280px] overflow-hidden shrink-0">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ 
              backgroundImage: `url('${ws.bannerImage || 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80'}')`
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent"></div>
          
          <div className="absolute bottom-0 left-0 w-full px-8 pb-6 flex flex-col md:flex-row items-end justify-between gap-6 z-10">
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 rounded-xl bg-[#111118] border border-white/10 flex items-center justify-center text-white shrink-0 shadow-2xl">
                <span className="material-symbols-outlined text-3xl">{ws.icon || 'folder'}</span>
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="bg-white/5 text-on-surface-variant px-2.5 py-0.5 rounded-full font-mono text-[9px] uppercase tracking-wider border border-white/5">
                    {ws.category}
                  </span>
                  <span className="bg-primary/10 text-primary px-2.5 py-0.5 rounded-full font-mono text-[9px] uppercase tracking-wider border border-primary/20 shadow-sm">
                    {ws.tag || 'JS · TS'}
                  </span>
                </div>
                <h1 className="font-display-lg text-2xl font-bold text-white tracking-tight leading-tight">
                  {ws.title}
                </h1>
                
                <div className="flex items-center gap-4 mt-3 text-on-surface-variant font-label-md text-xs font-bold uppercase tracking-wider">
                  <div className="flex flex-col">
                    <span className="text-primary font-bold text-sm">{ws.progress}%</span>
                    <span className="opacity-60 text-[8px] mt-0.5">Workspace</span>
                  </div>
                  <div className="w-px h-5 bg-white/10"></div>
                  <div className="flex flex-col">
                    <span className="text-white font-bold text-sm">{ws.streak} Days</span>
                    <span className="opacity-60 text-[8px] mt-0.5">Streak</span>
                  </div>
                  <div className="w-px h-5 bg-white/10"></div>
                  <div className="flex flex-col">
                    <span className="text-white font-bold text-sm">{workspaceTasks.length}</span>
                    <span className="opacity-60 text-[8px] mt-0.5">Tasks Left</span>
                  </div>
                </div>
              </div>
            </div>
            
            {isWorkspaceOwner && (
              <div className="flex items-center gap-2 mb-1">
                <Button variant="secondary" icon="group_add" onClick={() => setIsInviteModalOpen(true)}>Collaborate</Button>
              </div>
            )}
          </div>
        </div>

        {/* Content Layout Grid */}
        <div className="px-8 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 w-full flex-grow min-h-0 workspace-detail-content">
          
          {/* Column 1: Left Milestones / Roadmap */}
          <div className="lg:col-span-8 space-y-8 workspace-detail-left-col">
            
            {/* Multi-Roadmaps Section */}
            <section className="bg-[#111118] border border-white/5 rounded-2xl p-6 space-y-6 workspace-roadmap-section">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div>
                  <h3 className="font-display-lg text-lg font-bold text-white uppercase tracking-wider">Roadmap Progress</h3>
                  <p className="text-on-surface-variant text-xs mt-1">Independent roadmap tracker loops</p>
                </div>
              </div>

              {ws.roadmaps && ws.roadmaps.length > 0 ? (
                <div className="space-y-8">
                  {ws.roadmaps.map((rm) => {
                    const rmProg = getRoadmapProgress(rm);
                    return (
                      <div key={rm.id} className="space-y-5 bg-[#0D0D14]/40 border border-white/5 p-5 rounded-xl animate-fade-in">
                        
                        {/* Roadmap Header */}
                        <div className="flex justify-between items-center border-b border-white/5 pb-3">
                          <h4 className="font-bold text-white text-sm uppercase tracking-wider flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                            {rm.title}
                          </h4>
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-primary font-bold">{rmProg}% Done</span>
                            <button
                              onClick={() => {
                                setActiveRoadmapForTopic(rm.id);
                                setIsTopicModalOpen(true);
                              }}
                              className="px-2.5 py-1 bg-white/5 border border-white/5 rounded text-[10px] uppercase font-bold text-on-surface-variant hover:text-white transition-all cursor-pointer"
                            >
                              + Add Topic
                            </button>
                          </div>
                        </div>

                        {/* Topics Loop */}
                        <div className="space-y-4">
                          {(rm.topics || []).map((topic) => {
                            const doneSubtopics = (topic.subtopics || []).filter(s => s.done).length;
                            const totalSubtopics = (topic.subtopics || []).length;
                            
                            return (
                              <div key={topic.id} className="border border-white/5 rounded-lg bg-[#111118]/50 overflow-hidden">
                                
                                {/* Topic Header */}
                                <div className="flex items-center justify-between p-3.5 bg-[#0D0D14]/20 hover:bg-[#0D0D14]/40 transition-colors cursor-pointer">
                                  <div className="flex items-center gap-3 min-w-0" onClick={() => handleToggleTopicExpand(rm.id, topic.id)}>
                                    <span className="material-symbols-outlined text-on-surface-variant text-base">
                                      {topic.expanded ? 'expand_more' : 'chevron_right'}
                                    </span>
                                    <span className="font-bold text-white text-xs truncate">{topic.title}</span>
                                    <span className="text-[10px] text-on-surface-variant font-medium">({doneSubtopics}/{totalSubtopics} done)</span>
                                  </div>

                                  <div className="flex items-center gap-2 shrink-0">
                                    {/* Edit Topic Title */}
                                    <button 
                                      onClick={() => handleOpenEditTopic(rm.id, topic)}
                                      className="p-1 rounded hover:bg-white/5 text-on-surface-variant hover:text-white transition-colors"
                                      title="Edit Topic Title"
                                    >
                                      <span className="material-symbols-outlined text-sm">edit</span>
                                    </button>

                                    {/* Inline Add Subtopic */}
                                    <button
                                      onClick={() => {
                                        setActiveTopicForSubtopic(topic.id);
                                        setNewSubtopicText('');
                                      }}
                                      className="p-1 rounded hover:bg-white/5 text-on-surface-variant hover:text-white transition-colors"
                                      title="Add Subtopic"
                                    >
                                      <span className="material-symbols-outlined text-sm">add_circle</span>
                                    </button>

                                    {/* Reordering */}
                                    <button 
                                      onClick={() => handleReorderTopic(rm.id, topic.id, 'up')}
                                      className="p-1 rounded hover:bg-white/5 text-on-surface-variant hover:text-white transition-colors"
                                    >
                                      <span className="material-symbols-outlined text-sm">arrow_upward</span>
                                    </button>
                                    <button 
                                      onClick={() => handleReorderTopic(rm.id, topic.id, 'down')}
                                      className="p-1 rounded hover:bg-white/5 text-on-surface-variant hover:text-white transition-colors"
                                    >
                                      <span className="material-symbols-outlined text-sm">arrow_downward</span>
                                    </button>

                                    {/* Remove Topic */}
                                    <button 
                                      onClick={() => handleRemoveTopic(rm.id, topic.id)}
                                      className="p-1 rounded hover:bg-white/5 text-on-surface-variant hover:text-red-400 transition-colors"
                                    >
                                      <span className="material-symbols-outlined text-sm">delete</span>
                                    </button>
                                  </div>
                                </div>

                                {/* Inline Subtopic Adder Form */}
                                {activeTopicForSubtopic === topic.id && (
                                  <form 
                                    onSubmit={(e) => handleAddSubtopicSubmit(e, rm.id, topic.id)}
                                    className="p-3 bg-[#0D0D14]/15 border-t border-white/5 flex gap-2"
                                  >
                                    <input
                                      type="text"
                                      value={newSubtopicText}
                                      onChange={(e) => setNewSubtopicText(e.target.value)}
                                      placeholder="Add subtopic name..."
                                      className="flex-grow bg-[#111118] border border-white/5 rounded px-2.5 py-1.5 text-xs text-on-surface focus:outline-none"
                                      required
                                    />
                                    <Button type="submit" variant="secondary" className="px-3 py-1 text-[10px]">Add</Button>
                                    <Button type="button" variant="ghost" className="px-2 py-1 text-[10px]" onClick={() => setActiveTopicForSubtopic(null)}>Cancel</Button>
                                  </form>
                                )}

                                {/* Subtopics List */}
                                {topic.expanded && (
                                  <div className="p-3.5 space-y-2 border-t border-white/5 bg-[#0D0D14]/5 animate-fade-in">
                                    {topic.subtopics && topic.subtopics.length === 0 ? (
                                      <p className="text-[11px] text-on-surface-variant italic">No subtopics available.</p>
                                    ) : (
                                      (topic.subtopics || []).map((st) => (
                                        <div key={st.id} className="flex items-center justify-between gap-3 group">
                                          <div 
                                            onClick={() => toggleSubtopic(ws.id, rm.id, topic.id, st.id)}
                                            className="flex items-center gap-3 cursor-pointer"
                                          >
                                            <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                                              st.done ? 'bg-primary border-primary' : 'border-white/20 group-hover:border-primary'
                                            }`}>
                                              {st.done && <span className="material-symbols-outlined text-[10px] text-white font-bold">check</span>}
                                            </div>
                                            <span className={`text-xs ${st.done ? 'line-through text-on-surface-variant' : 'text-white'}`}>
                                              {st.title}
                                            </span>
                                          </div>

                                          <button
                                            onClick={() => handleRemoveSubtopic(rm.id, topic.id, st.id)}
                                            className="opacity-0 group-hover:opacity-100 p-1 text-on-surface-variant hover:text-red-400 transition-all cursor-pointer"
                                            title="Delete Subtopic"
                                          >
                                            <span className="material-symbols-outlined text-xs">close</span>
                                          </button>
                                        </div>
                                      ))
                                    )}
                                  </div>
                                )}

                              </div>
                            );
                          })}
                        </div>

                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-on-surface-variant italic">No combined roadmaps found. Add roadmap segments to customize.</p>
              )}
            </section>

            {/* Workspace Notepad Card */}
            <section className="bg-[#111118] border border-white/5 rounded-2xl p-6 space-y-5 workspace-notepad-section">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div>
                  <h3 className="font-display-lg text-lg font-bold text-white uppercase tracking-wider">Workspace Notepad</h3>
                  <p className="text-on-surface-variant text-xs mt-1">Study notes, templates, and revision observations</p>
                </div>
                
                <div className="flex gap-2">
                  {isNotesEditing ? (
                    <>
                      <Button variant="ghost" className="px-3 py-1 text-[10px]" onClick={() => setIsNotesEditing(false)}>Cancel</Button>
                      <Button variant="primary" className="px-3 py-1 text-[10px]" onClick={handleSaveNotes}>Save Notes</Button>
                    </>
                  ) : (
                    <Button variant="secondary" className="px-3 py-1 text-[10px]" onClick={() => setIsNotesEditing(true)} icon="edit">Edit Notepad</Button>
                  )}
                </div>
              </div>

              {isNotesEditing ? (
                <div className="space-y-4">
                  <div className="flex gap-2 bg-[#0D0D14]/80 p-2 rounded border border-white/5">
                    <button type="button" onClick={() => appendNoteTemplate('code')} className="px-2 py-1 bg-white/5 rounded text-[9px] font-bold text-on-surface-variant hover:text-white uppercase">Code Block</button>
                    <button type="button" onClick={() => appendNoteTemplate('list')} className="px-2 py-1 bg-white/5 rounded text-[9px] font-bold text-on-surface-variant hover:text-white uppercase">Checklist</button>
                    <button type="button" onClick={() => appendNoteTemplate('table')} className="px-2 py-1 bg-white/5 rounded text-[9px] font-bold text-on-surface-variant hover:text-white uppercase">Table</button>
                  </div>
                  <textarea
                    value={notesText}
                    onChange={(e) => setNotesText(e.target.value)}
                    className="w-full bg-[#0D0D14] border border-white/5 rounded-lg p-3 text-xs text-on-surface focus:outline-none h-48 font-mono leading-relaxed resize-none"
                    placeholder="Write workspace study logs..."
                  />
                </div>
              ) : (
                <div className="bg-[#0D0D14]/30 border border-white/5 p-5 rounded-lg text-xs leading-relaxed text-on-surface-variant font-medium whitespace-pre-line max-h-60 overflow-y-auto no-scrollbar">
                  {ws.notes || 'Notepad is empty. Click edit to begin storing revision sheets and interview questions.'}
                </div>
              )}
            </section>

            {/* Task Management Section */}
            <section className="bg-[#111118] border border-white/5 rounded-2xl p-6 space-y-6 workspace-todo-section">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div>
                  <h3 className="font-display-lg text-lg font-bold text-white uppercase tracking-wider">Workspace Todo List</h3>
                  <p className="text-on-surface-variant text-xs mt-1">Tasks linked to this workspace</p>
                </div>
                <Button variant="primary" icon="add" className="py-1.5 px-3 text-[10px] font-bold uppercase tracking-wider" onClick={handleOpenAddTask}>
                  Add Todo
                </Button>
              </div>

              <div className="space-y-3">
                {workspaceTasks.length === 0 ? (
                  <p className="text-on-surface-variant text-xs italic py-2">No tasks bound to this workspace.</p>
                ) : (
                  workspaceTasks.map(t => (
                    <div 
                      key={t.id}
                      className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-250 group bg-[#111118] hover:border-primary/20 ${
                        t.done ? 'border-white/5 opacity-40' : 'border-white/5'
                      }`}
                    >
                      <div 
                        onClick={() => toggleTask(t.id)}
                        className={`w-4.5 h-4.5 rounded border flex items-center justify-center transition-all cursor-pointer ${
                          t.done ? 'bg-primary border-primary' : 'border-primary/30 group-hover:bg-primary/10'
                        }`}
                      >
                        {t.done && <span className="material-symbols-outlined text-[12px] text-white font-bold">check</span>}
                      </div>

                      <div className="flex-grow flex flex-col gap-0.5">
                        <span className={`text-xs text-white font-medium ${t.done ? 'line-through text-on-surface-variant' : ''}`}>
                          {t.text}
                        </span>
                        {t.dueDate && (
                          <span className="text-[9px] text-on-surface-variant font-semibold flex items-center gap-1">
                            <span className="material-symbols-outlined text-[10px]">calendar_today</span>
                            Due: {t.dueDate} {t.dueTime}
                          </span>
                        )}
                      </div>

                      <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider shrink-0 ${getPriorityColor(t.priority)}`}>
                        {t.priority}
                      </span>

                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                        <button 
                          onClick={() => togglePin(t.id)}
                          className={`p-1 rounded hover:bg-white/5 transition-colors cursor-pointer ${t.isPinned ? 'text-primary' : 'text-on-surface-variant'}`}
                          title="Pin Task"
                        >
                          <span className="material-symbols-outlined text-[14px]">star</span>
                        </button>
                        <button 
                          onClick={() => handleOpenEditTask(t)}
                          className="p-1 rounded hover:bg-white/5 text-on-surface-variant hover:text-white transition-colors cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[14px]">edit</span>
                        </button>
                        <button 
                          onClick={() => deleteTask(t.id)}
                          className="p-1 rounded hover:bg-white/5 text-on-surface-variant hover:text-red-400 transition-colors cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[14px]">delete</span>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>

          </div>

          {/* Column 2: Right Sidebar */}
          <div className="lg:col-span-4 space-y-8 workspace-detail-right-col">
            
            {/* Progress Rings */}
            <section className="bg-[#111118] border border-white/5 rounded-2xl p-6 workspace-progress-section">
              <h3 className="font-label-sm uppercase tracking-widest text-on-surface-variant mb-6 text-[10px] font-bold">
                Overall Progress
              </h3>
              <div className="flex flex-col items-center gap-6">
                <ProgressRing percentage={ws.progress} label="Completion index" size={135} color={`text-primary`} />
              </div>
            </section>

            {/* Study Session Pomodoro Timer */}
            <section className="bg-[#111118]/80 border border-white/5 backdrop-blur-xl rounded-2xl p-6 space-y-6 relative overflow-hidden workspace-timer-section">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <div>
                  <h3 className="font-display-lg text-xs font-black tracking-[0.2em] uppercase text-on-surface-variant">
                    Study Session Timer
                  </h3>
                  <p className="text-[9px] text-on-surface-variant uppercase tracking-wider font-bold mt-0.5">Productive Pomodoro</p>
                </div>
                <span className="material-symbols-outlined text-primary text-base animate-pulse">
                  alarm
                </span>
              </div>

              <div className="flex flex-col items-center justify-center space-y-4">
                {/* Visual Circle / Progress and Timer */}
                <div className="relative w-32 h-32 flex items-center justify-center bg-[#0D0D14]/80 rounded-full border border-white/5 shadow-2xl">
                  {/* Glowing ambient radial inside */}
                  <div className="absolute inset-2 bg-gradient-to-tr from-primary/5 to-secondary/5 rounded-full blur-sm" />
                  
                  <div className="text-center z-10">
                    <span className="font-mono text-3xl font-extrabold tracking-tight text-white block">
                      {String(timerMinutes).padStart(2, '0')}:{String(timerSeconds).padStart(2, '0')}
                    </span>
                    <span className="text-[8px] font-black uppercase tracking-widest text-primary mt-1 block">
                      {timerType === 'focus' ? 'Deep Work' : 'Break'}
                    </span>
                  </div>
                </div>

                {/* Duration select tags */}
                <div className="flex gap-2">
                  <button 
                    onClick={() => { setTimerType('focus'); handleSelectDuration(25); }}
                    className={`px-3 py-1 text-[9px] font-black uppercase tracking-wider rounded border transition-all ${
                      selectedDuration === 25 && timerType === 'focus'
                        ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-105'
                        : 'bg-white/5 text-on-surface-variant border-white/5 hover:text-white'
                    }`}
                  >
                    25 Min
                  </button>
                  <button 
                    onClick={() => { setTimerType('focus'); handleSelectDuration(50); }}
                    className={`px-3 py-1 text-[9px] font-black uppercase tracking-wider rounded border transition-all ${
                      selectedDuration === 50 && timerType === 'focus'
                        ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-105'
                        : 'bg-white/5 text-on-surface-variant border-white/5 hover:text-white'
                    }`}
                  >
                    50 Min
                  </button>
                  <button 
                    onClick={() => { setTimerType('break'); handleSelectDuration(5); }}
                    className={`px-3 py-1 text-[9px] font-black uppercase tracking-wider rounded border transition-all ${
                      timerType === 'break'
                        ? 'bg-secondary text-white border-secondary shadow-lg shadow-secondary/20 scale-105'
                        : 'bg-white/5 text-on-surface-variant border-white/5 hover:text-white'
                    }`}
                  >
                    5m Break
                  </button>
                </div>

                {/* Controls */}
                <div className="flex gap-3 w-full pt-2">
                  {timerActive ? (
                    <Button 
                      variant="secondary" 
                      className="flex-1 py-2 font-bold uppercase tracking-wider text-xs" 
                      onClick={pauseTimer}
                      icon="pause"
                    >
                      Pause
                    </Button>
                  ) : (
                    <Button 
                      variant="primary" 
                      className="flex-1 py-2 font-bold uppercase tracking-wider text-xs" 
                      onClick={startTimer}
                      icon="play_arrow"
                    >
                      Start
                    </Button>
                  )}
                  <Button 
                    variant="ghost" 
                    className="flex-1 py-2 font-bold uppercase tracking-wider text-xs border border-white/5" 
                    onClick={resetTimer}
                    icon="refresh"
                  >
                    Reset
                  </Button>
                </div>
              </div>
            </section>

            {/* Links Resources Manager */}
            <section className="bg-[#111118] border border-white/5 rounded-2xl p-6 space-y-5 workspace-resources-section">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <h3 className="font-label-sm uppercase tracking-widest text-on-surface-variant text-[10px] font-bold">
                  Resources ({(ws.resources || []).length})
                </h3>
                <button 
                  onClick={handleOpenAddResource}
                  className="p-1 text-on-surface-variant hover:text-white transition-colors cursor-pointer"
                  title="Add Resource link"
                >
                  <span className="material-symbols-outlined text-base">add_box</span>
                </button>
              </div>

              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1 no-scrollbar animate-fade-in">
                {(ws.resources || []).length === 0 ? (
                  <p className="text-[11px] text-on-surface-variant italic">No study resource links attached.</p>
                ) : (
                  (ws.resources || []).map((res) => (
                    <div key={res.id} className="p-3 bg-[#0D0D14]/80 border border-white/5 rounded-xl flex items-center justify-between gap-3 group">
                      <div className="flex items-center gap-3 min-w-0">
                        <img 
                          src={res.thumbnail} 
                          alt={res.title}
                          className="w-11 h-11 object-cover rounded-lg border border-white/5 shrink-0" 
                        />
                        <div className="min-w-0">
                          <a 
                            href={res.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-xs font-bold text-white hover:text-primary hover:underline truncate block"
                          >
                            {res.title}
                          </a>
                          <span className="text-[9px] font-bold uppercase tracking-wider text-on-surface-variant block mt-0.5">{res.category}</span>
                        </div>
                      </div>

                      <div className="opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity shrink-0">
                        <button 
                          onClick={() => handleOpenEditResource(res)}
                          className="p-1 text-on-surface-variant hover:text-white"
                        >
                          <span className="material-symbols-outlined text-xs">edit</span>
                        </button>
                        <button 
                          onClick={() => handleDeleteResource(res.id)}
                          className="p-1 text-on-surface-variant hover:text-red-400"
                        >
                          <span className="material-symbols-outlined text-xs">delete</span>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>

            {/* Collaborators */}
            <section className="bg-[#111118] border border-white/5 rounded-2xl p-6 workspace-collaborators-section">
              <div 
                className="flex items-center justify-between cursor-pointer md:cursor-default"
                onClick={toggleCollabCollapse}
              >
                <h3 className="font-label-sm uppercase tracking-widest text-on-surface-variant text-[10px] font-bold">
                  Collaborators ({collabList.length})
                </h3>
                <span className={`material-symbols-outlined text-sm text-on-surface-variant transition-transform md:hidden ${isCollabCollapsed ? '' : 'rotate-180'}`}>
                  expand_more
                </span>
              </div>
              
              <div className={`${isCollabCollapsed ? 'hidden md:block' : 'block'} space-y-4 pt-4`}>
                {collabList.map((collab) => {
                  const isCurrentUser = collab.userId === userProfile.userId || (collab.isOwner && isWorkspaceOwner);
                  const userObj = allUsers.find(u => u.userId === collab.userId);
                  const name = collab.fullName;
                  const username = collab.username ? `@${collab.username}` : '@user';

                  // Presence checking
                  const presence = presenceStates && presenceStates[collab.userId];
                  const presenceStatus = presence ? presence.status : 'offline';

                  let statusColor = 'bg-neutral-500';
                  if (presenceStatus === 'online') {
                    statusColor = 'bg-green-500 shadow-[0_0_8px_#22c55e]';
                  } else if (presenceStatus === 'away') {
                    statusColor = 'bg-amber-500 shadow-[0_0_8px_#f59e0b]';
                  }

                  return (
                    <div key={collab.userId} className="flex items-center justify-between gap-3 group/item">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <AvatarImg src={getAvatar(isCurrentUser ? userProfile : userObj)} sizeCls="w-8 h-8" iconCls="text-xs" />
                          <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border border-[#111118] ${statusColor}`} title={presenceStatus}></span>
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-white leading-none">
                            {name} {isCurrentUser && <span className="text-[8px] text-primary">(You)</span>}
                          </h4>
                          <span className="text-[10px] text-on-surface-variant leading-none block mt-1">{username}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {collab.isOwner ? (
                          <span className="px-2 py-0.5 rounded text-[8px] font-black bg-primary/20 border border-primary/20 text-primary uppercase tracking-wider">
                            Owner
                          </span>
                        ) : (
                          <>
                            <span className="px-2 py-0.5 rounded text-[8px] font-black bg-white/5 border border-white/5 text-on-surface-variant uppercase tracking-wider">
                              {collab.role}
                            </span>
                            {isWorkspaceOwner && (
                              <button
                                type="button"
                                onClick={async () => {
                                  if (window.confirm(`Are you sure you want to remove ${name} from this workspace?`)) {
                                    await removeCollaborator(id, collab.userId);
                                  }
                                }}
                                className="p-1 text-on-surface-variant hover:text-red-400 bg-transparent border-0 cursor-pointer opacity-85 md:opacity-0 md:group-hover/item:opacity-100 transition-opacity"
                                title="Remove collaborator"
                              >
                                <span className="material-symbols-outlined text-xs">close</span>
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Delete Workspace Button (Owner Only) */}
            {isWorkspaceOwner && (
              <div className="pt-4 flex justify-end workspace-delete-section">
                <Button 
                  variant="ghost" 
                  className="bg-red-950/20 border border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-white px-5 py-2.5 font-bold uppercase tracking-wider text-xs flex items-center gap-1.5 w-full justify-center"
                  onClick={() => {
                    setDeleteStep(1);
                    setDeleteConfirmText('');
                  }}
                  icon="delete"
                >
                  Delete Workspace
                </Button>
              </div>
            )}

          </div>

        </div>
      </main>

      {/* Task Creation & Edit Modal */}
      <Modal isOpen={isTaskModalOpen} onClose={() => setIsTaskModalOpen(false)} title={editingTask ? 'Edit Todo' : 'Create Todo'}>
        <form onSubmit={handleTaskSubmit} className="space-y-5">
          <InputField
            id="workspace-task-text"
            label="Task Title"
            placeholder="e.g. Implement layout hook"
            value={taskText}
            onChange={(e) => setTaskText(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-[10px] uppercase font-bold text-on-surface-variant tracking-wider text-xs font-semibold">Priority</label>
              <select 
                value={taskPriority}
                onChange={(e) => setTaskPriority(e.target.value)}
                className="w-full bg-[#111118] border border-white/5 rounded-lg p-3 text-on-surface focus:outline-none focus:border-primary text-xs"
              >
                <option value="High">High</option>
                <option value="Med">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] uppercase font-bold text-on-surface-variant tracking-wider text-xs font-semibold">Recurring</label>
              <select 
                value={taskRecurring}
                onChange={(e) => setTaskRecurring(e.target.value)}
                className="w-full bg-[#111118] border border-white/5 rounded-lg p-3 text-on-surface focus:outline-none focus:border-primary text-xs"
              >
                <option value="None">No Repeat</option>
                <option value="Daily">Daily</option>
                <option value="Weekly">Weekly</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <InputField
              id="workspace-task-date"
              label="Due Date"
              type="date"
              value={taskDueDate}
              onChange={(e) => setTaskDueDate(e.target.value)}
            />
            <InputField
              id="workspace-task-time"
              label="Due Time"
              type="time"
              value={taskDueTime}
              onChange={(e) => setTaskDueTime(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] uppercase font-bold text-on-surface-variant tracking-wider text-xs font-semibold">Progress ({taskProgress}%)</label>
            <input 
              type="range"
              min="0"
              max="100"
              step="10"
              value={taskProgress}
              onChange={(e) => setTaskProgress(e.target.value)}
              className="w-full mt-2 h-1.5 bg-white/5 rounded-lg appearance-none cursor-pointer accent-primary"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
            <Button variant="ghost" onClick={() => setIsTaskModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">{editingTask ? 'Save' : 'Create'}</Button>
          </div>
        </form>
      </Modal>

      {/* Collaborate Invite Modal */}
      <Modal isOpen={isInviteModalOpen} onClose={() => setIsInviteModalOpen(false)} title="Collaborate Workspace">
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            if (!inviteFriendId) return;
            inviteCollaborator(id, inviteFriendId, inviteRole);
            setIsInviteModalOpen(false);
          }} 
          className="space-y-5"
        >
          <div className="space-y-2">
            <label className="block text-[10px] uppercase font-bold text-on-surface-variant tracking-wider text-xs font-semibold">Select Friend</label>
            <select
              value={inviteFriendId}
              onChange={(e) => setInviteFriendId(e.target.value)}
              className="w-full bg-[#111118] border border-white/5 rounded-lg p-3 text-on-surface focus:outline-none focus:border-primary text-xs"
              required
            >
              <option value="">-- Choose Friend --</option>
              {friends.map((friendId) => {
                const user = allUsers.find(u => u.userId === friendId);
                return (
                  <option key={friendId} value={friendId}>
                    {user ? `${user.fullName} (${user.username})` : friendId}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] uppercase font-bold text-on-surface-variant tracking-wider text-xs font-semibold">Role & Permissions</label>
            <select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value)}
              className="w-full bg-[#111118] border border-white/5 rounded-lg p-3 text-on-surface focus:outline-none focus:border-primary text-xs"
            >
              <option value="Editor">Editor (Can complete tasks & edits)</option>
              <option value="Viewer">Viewer (Read-only access)</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
            <Button variant="ghost" onClick={() => setIsInviteModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" icon="send">Send Invite</Button>
          </div>
        </form>
      </Modal>

      {/* Add / Edit Resource Modal */}
      <Modal isOpen={isResourceModalOpen} onClose={() => setIsResourceModalOpen(false)} title={editingResource ? 'Edit Resource' : 'Add Resource'}>
        <form onSubmit={handleResourceSubmit} className="space-y-5">
          <InputField
            id="res-title"
            label="Resource Title"
            placeholder="e.g. Flexbox visual cheat sheet"
            value={resourceTitle}
            onChange={(e) => setResourceTitle(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-[10px] uppercase font-bold text-on-surface-variant tracking-wider text-xs font-semibold">Category</label>
              <select
                value={resourceCategory}
                onChange={(e) => setResourceCategory(e.target.value)}
                className="w-full bg-[#111118] border border-white/5 rounded-lg p-3 text-on-surface focus:outline-none focus:border-primary text-xs"
              >
                <option value="YouTube">YouTube Video</option>
                <option value="Google Drive">Google Drive folder</option>
                <option value="Article">Article / Paper</option>
                <option value="PDF">PDF eBook</option>
                <option value="Documentation">Documentation Docs</option>
                <option value="GitHub">GitHub Repository</option>
              </select>
            </div>
            <InputField
              id="res-thumb"
              label="Thumbnail URL"
              placeholder="https://..."
              value={resourceThumbnail}
              onChange={(e) => setResourceThumbnail(e.target.value)}
            />
          </div>

          <InputField
            id="res-link"
            label="Link URL"
            placeholder="https://..."
            value={resourceLink}
            onChange={(e) => setResourceLink(e.target.value)}
            required
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
            <Button variant="ghost" onClick={() => setIsResourceModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">{editingResource ? 'Save' : 'Add Link'}</Button>
          </div>
        </form>
      </Modal>

      {/* Add Topic Modal */}
      <Modal isOpen={isTopicModalOpen} onClose={() => setIsTopicModalOpen(false)} title="Add Roadmap Topic">
        <form onSubmit={handleAddTopicSubmit} className="space-y-5">
          <InputField
            id="topic-title"
            label="Topic Name"
            placeholder="e.g. Advanced Graph Traversals"
            value={newTopicTitle}
            onChange={(e) => setNewTopicTitle(e.target.value)}
            required
          />
          <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
            <Button variant="ghost" onClick={() => setIsTopicModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Add Topic</Button>
          </div>
        </form>
      </Modal>

      {/* Edit Topic Title Modal */}
      <Modal isOpen={isEditTopicModalOpen} onClose={() => setIsEditTopicModalOpen(false)} title="Edit Topic Title">
        <form onSubmit={handleEditTopicSubmit} className="space-y-5">
          <InputField
            id="edit-topic-title"
            label="Topic Name"
            placeholder="e.g. Basics of Programming"
            value={editTopicTitle}
            onChange={(e) => setEditTopicTitle(e.target.value)}
            required
          />
          <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
            <Button variant="ghost" onClick={() => setIsEditTopicModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Rename Topic</Button>
          </div>
        </form>
      </Modal>

      {/* Delete Workspace - Step 1: Warning and Name Match */}
      <Modal 
        isOpen={deleteStep === 1} 
        onClose={() => setDeleteStep(0)} 
        title="Delete Workspace"
      >
        <div className="space-y-4">
          <div className="p-3.5 bg-red-950/20 border border-red-500/20 rounded-xl text-red-400 text-xs font-semibold leading-relaxed">
            ⚠️ <strong>Warning:</strong> This action is permanent and cannot be undone. All tasks, roadmaps, and files associated with this workspace will be deleted forever.
          </div>
          <p className="text-xs text-on-surface-variant leading-relaxed text-left">
            To confirm deletion, please type the workspace name exactly as shown below:
          </p>
          <div className="py-2 px-3 bg-white/5 border border-white/5 rounded-lg text-xs font-mono font-bold text-white text-center select-all">
            {ws.title}
          </div>
          <InputField
            id="delete-workspace-confirm-input"
            label="Type workspace name to confirm"
            placeholder="Type name here..."
            value={deleteConfirmText}
            onChange={(e) => setDeleteConfirmText(e.target.value)}
          />
          <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
            <Button variant="ghost" onClick={() => setDeleteStep(0)}>Cancel</Button>
            <Button 
              variant="primary" 
              onClick={() => {
                if (deleteConfirmText === ws.title) {
                  setDeleteStep(2);
                }
              }}
              disabled={deleteConfirmText !== ws.title}
              className="bg-red-600 border border-red-600 text-white hover:bg-red-700"
            >
              Continue
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Workspace - Step 2: Final Confirmation */}
      <Modal 
        isOpen={deleteStep === 2} 
        onClose={() => setDeleteStep(0)} 
        title="Are you absolutely sure?"
      >
        <div className="space-y-4">
          <p className="text-xs text-on-surface-variant leading-relaxed text-left">
            You are about to delete <strong>{ws.title}</strong> permanently. This will delete all task records, timeline logs, and active invitations.
          </p>
          <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
            <Button variant="ghost" onClick={() => setDeleteStep(0)}>Cancel</Button>
            <Button 
              variant="primary" 
              onClick={async () => {
                setDeleteStep(0);
                await deleteWorkspace(id);
                navigate('/workspaces');
              }}
              className="bg-red-600 border border-red-600 text-white hover:bg-red-700"
            >
              Delete permanently
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default WorkspaceDetail;
