import React, { useState, useContext, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { TaskContext } from '../context/TaskContext';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Button from '../components/Button';
import Modal from '../components/Modal';
import InputField from '../components/InputField';
import { SkeletonBlock } from '../components/Skeleton';
import EmptyState from '../components/EmptyState';

const TASK_TYPES = [
  { value: 'General Task', label: '📌 General Task' },
  { value: 'Study', label: '📚 Study' },
  { value: 'Assignment', label: '📝 Assignment' },
  { value: 'Exam', label: '📖 Exam' },
  { value: 'Project', label: '🚀 Project' },
  { value: 'Revision', label: '🔄 Revision' }
];

const Tasks = () => {
  const navigate = useNavigate();

  const {
    tasks,
    exams,
    assignments,
    addTask,
    editTask,
    deleteTask,
    toggleTask,
    togglePin,
    addExam,
    editExam,
    deleteExam,
    toggleExam,
    addAssignment,
    editAssignment,
    deleteAssignment,
    toggleAssignment,
    workspaces,
    loading
  } = useContext(TaskContext);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading) {
      setIsLoading(false);
    }
  }, [loading]);

  // Filter and Sorting state for Personal Tasks
  const [filterType, setFilterType] = useState('All'); // All, Active, Completed, Overdue, Upcoming
  const [sortBy, setSortBy] = useState('Date'); // Date, Priority, Completion

  // State for accordions in Workspace Tasks
  const [expandedWorkspaces, setExpandedWorkspaces] = useState({});

  // Modal States
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const [isExamModalOpen, setIsExamModalOpen] = useState(false);
  const [editingExam, setEditingExam] = useState(null);

  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [editingAssign, setEditingAssign] = useState(null);

  // Form states - Task Modal
  const [taskText, setTaskText] = useState('');
  const [taskType, setTaskType] = useState('General Task');
  const [taskPriority, setTaskPriority] = useState('Med');
  const [taskWorkspaceId, setTaskWorkspaceId] = useState('');
  const [taskDueDate, setTaskDueDate] = useState('');
  const [taskColorCategory, setTaskColorCategory] = useState('yellow'); // yellow (Today) or red (Overall)

  // Date Picker Popover State
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const datePickerRef = useRef(null);

  // Form states - Exams
  const [examName, setExamName] = useState('');
  const [examSubject, setExamSubject] = useState('');
  const [examDate, setExamDate] = useState('');

  // Form states - Assignments
  const [assignName, setAssignName] = useState('');
  const [assignSubject, setAssignSubject] = useState('');
  const [assignDueDate, setAssignDueDate] = useState('');
  const [assignProgress, setAssignProgress] = useState(0);

  const todayStr = new Date().toISOString().split('T')[0];

  // Helper date calculations
  const getTomorrowStr = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  };

  const getEndOfWeekStr = () => {
    const d = new Date();
    const day = d.getDay();
    const diff = d.getDate() + (7 - day);
    const sunday = new Date(d.setDate(diff));
    return sunday.toISOString().split('T')[0];
  };

  const formatDateDisplay = (dateString) => {
    if (!dateString) return '📅 No due date';
    try {
      const parts = dateString.split('-');
      if (parts.length === 3) {
        const date = new Date(parts[0], parts[1] - 1, parts[2]);
        return `📅 ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
      }
    } catch (_) {}
    return `📅 ${dateString}`;
  };

  // Close date picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (datePickerRef.current && !datePickerRef.current.contains(e.target)) {
        setIsDatePickerOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Open personal task modal for adding
  const handleOpenAddTask = (defaultType = 'General Task') => {
    setEditingTask(null);
    setTaskText('');
    setTaskType(defaultType);
    setTaskPriority('Med');
    setTaskWorkspaceId('');
    setTaskDueDate(todayStr);
    setTaskColorCategory('yellow');
    setIsDatePickerOpen(false);
    setIsTaskModalOpen(true);
  };

  // Open personal task modal for editing
  const handleOpenEditTask = (task) => {
    setEditingTask(task);
    setTaskText(task.text);
    setTaskType(task.type || 'General Task');
    setTaskPriority(task.priority || 'Med');
    setTaskWorkspaceId(task.workspaceId || '');
    setTaskDueDate(task.dueDate || '');
    setTaskColorCategory(task.colorCategory || 'yellow');
    setIsDatePickerOpen(false);
    setIsTaskModalOpen(true);
  };

  // Handle personal task form submit
  const handleTaskSubmit = (e) => {
    e.preventDefault();
    const taskData = {
      text: taskText.trim(),
      type: taskType,
      priority: taskPriority,
      dueDate: taskDueDate,
      workspaceId: taskWorkspaceId || null,
      colorCategory: taskColorCategory,
      progress: 0,
      done: editingTask ? editingTask.done : false
    };

    if (editingTask) {
      editTask(editingTask.id, taskData);
    } else {
      addTask(taskData);
    }

    if (taskType === 'Exam' && !editingTask) {
      addExam({
        name: taskText.trim(),
        subject: 'General',
        date: taskDueDate
      });
    } else if (taskType === 'Assignment' && !editingTask) {
      addAssignment({
        name: taskText.trim(),
        subject: 'General',
        dueDate: taskDueDate
      });
    }

    setIsTaskModalOpen(false);
  };

  // Open exam modal
  const handleOpenAddExam = () => {
    setEditingExam(null);
    setExamName('');
    setExamSubject('');
    setExamDate(todayStr);
    setIsExamModalOpen(true);
  };

  const handleOpenEditExam = (exam) => {
    setEditingExam(exam);
    setExamName(exam.name);
    setExamSubject(exam.subject || '');
    setExamDate(exam.date || '');
    setIsExamModalOpen(true);
  };

  const handleExamSubmit = async (e) => {
    e.preventDefault();
    const examData = {
      name: examName.trim(),
      subject: examSubject.trim(),
      date: examDate,
      status: editingExam ? editingExam.status : 'Pending'
    };

    if (editingExam) {
      await editExam(editingExam.id, examData);
    } else {
      await addExam(examData);
    }
    setIsExamModalOpen(false);
  };

  // Open assignment modal
  const handleOpenAddAssign = () => {
    setEditingAssign(null);
    setAssignName('');
    setAssignSubject('');
    setAssignDueDate(todayStr);
    setAssignProgress(0);
    setIsAssignModalOpen(true);
  };

  const handleOpenEditAssign = (assign) => {
    setEditingAssign(assign);
    setAssignName(assign.name);
    setAssignSubject(assign.subject || '');
    setAssignDueDate(assign.dueDate || '');
    setAssignProgress(assign.progress || 0);
    setIsAssignModalOpen(true);
  };

  const handleAssignSubmit = async (e) => {
    e.preventDefault();
    const assignData = {
      name: assignName.trim(),
      subject: assignSubject.trim(),
      dueDate: assignDueDate,
      progress: parseInt(assignProgress) || 0,
      status: parseInt(assignProgress) === 100 ? 'Submitted' : 'Pending'
    };

    if (editingAssign) {
      await editAssignment(editingAssign.id, assignData);
    } else {
      await addAssignment(assignData);
    }
    setIsAssignModalOpen(false);
  };

  // Toggle Accordions for Workspace Tasks
  const toggleAccordion = (wsId) => {
    setExpandedWorkspaces(prev => ({
      ...prev,
      [wsId]: !prev[wsId]
    }));
  };

  // Separating Personal & Workspace Tasks
  const personalTasks = tasks.filter(t => t.workspaceId === null);
  const yellowTasks = personalTasks.filter(t => t.colorCategory === 'yellow');
  const redTasks = personalTasks.filter(t => t.colorCategory === 'red' || (t.colorCategory !== 'yellow' && t.workspaceId === null));

  // Filtering Red (Overall) Personal Tasks
  const getFilteredTasks = (tasksList) => {
    return tasksList.filter(task => {
      switch (filterType) {
        case 'Active':
          return !task.done;
        case 'Completed':
          return task.done;
        case 'Overdue':
          return !task.done && task.dueDate && task.dueDate < todayStr;
        case 'Upcoming':
          return !task.done && task.dueDate && task.dueDate > todayStr;
        default:
          return true;
      }
    });
  };

  // Sorting Tasks
  const getSortedTasks = (tasksList) => {
    const priorityMap = { 'High': 3, 'Med': 2, 'Low': 1 };
    return [...tasksList].sort((a, b) => {
      switch (sortBy) {
        case 'Priority':
          return priorityMap[b.priority || 'Low'] - priorityMap[a.priority || 'Low'];
        case 'Completion':
          return (a.done ? 1 : 0) - (b.done ? 1 : 0);
        case 'Date':
        default:
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return a.dueDate.localeCompare(b.dueDate);
      }
    });
  };

  const overallFilteredTasks = getSortedTasks(getFilteredTasks(redTasks));
  const focusTasks = personalTasks.filter(t => t.isPinned);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-500/10 text-red-400 border border-red-500/20';
      case 'Med': return 'bg-primary/10 text-primary border border-primary/20';
      default: return 'bg-white/5 text-zinc-400 border border-white/5';
    }
  };

  const renderTaskTypeBadge = (type) => {
    switch (type) {
      case 'Study':
        return <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-bold flex items-center gap-1 shrink-0">📚 Study</span>;
      case 'Assignment':
        return <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 text-[10px] font-bold flex items-center gap-1 shrink-0">📝 Assignment</span>;
      case 'Exam':
        return <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[10px] font-bold flex items-center gap-1 shrink-0">📖 Exam</span>;
      case 'Project':
        return <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-bold flex items-center gap-1 shrink-0">🚀 Project</span>;
      case 'Revision':
        return <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold flex items-center gap-1 shrink-0">🔄 Revision</span>;
      default:
        return <span className="px-2 py-0.5 rounded bg-white/5 text-zinc-400 border border-white/5 text-[10px] font-bold flex items-center gap-1 shrink-0">📌 General</span>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-background text-on-surface radial-glow-bg select-none">
        <Sidebar />
        <main className="flex-1 flex flex-col h-screen overflow-y-auto no-scrollbar relative z-10">
          <Header hideSearch={true} hideStreak={true} hideLogo={true} />
          <div className="w-full px-8 pt-4 pb-12 space-y-8">
            <SkeletonBlock className="h-8 w-44" />
            <SkeletonBlock className="h-24 w-full rounded-2xl" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#050507] text-on-surface select-none font-dm-sans">
      <Sidebar />
      
      <main className="flex-1 flex flex-col h-screen overflow-y-auto no-scrollbar relative z-10">
        <Header hideSearch={true} hideStreak={true} hideLogo={true} />

        <div className="w-full px-4 py-6 md:px-10 md:py-8 max-w-7xl mx-auto animate-page-transition space-y-8">
          
          {/* Header Title */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
            <div>
              <h1 className="font-space-grotesk text-2xl md:text-3xl font-bold text-white tracking-tight">
                TASKS WORKSPACE
              </h1>
              <p className="text-zinc-400 text-xs md:text-sm mt-1">
                Manage personal tasks, assignments, exams, and workspace tasks overview.
              </p>
            </div>
            
            <div className="flex items-center gap-2 flex-wrap">
              <Button variant="secondary" icon="school" onClick={handleOpenAddExam} className="text-xs font-bold py-2">
                + Exam
              </Button>
              <Button variant="secondary" icon="assignment" onClick={handleOpenAddAssign} className="text-xs font-bold py-2">
                + Assignment
              </Button>
              <Button variant="primary" icon="add" onClick={() => handleOpenAddTask('General Task')} className="text-xs font-bold py-2">
                + Add Task
              </Button>
            </div>
          </div>

          {/* Quick Category Action Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <button
              onClick={() => handleOpenAddTask('Study')}
              className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 hover:border-blue-500/40 text-left transition-all group cursor-pointer"
            >
              <span className="text-xl block mb-1">📚</span>
              <span className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors">Study Task</span>
            </button>
            <button
              onClick={handleOpenAddAssign}
              className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 hover:border-purple-500/40 text-left transition-all group cursor-pointer"
            >
              <span className="text-xl block mb-1">📝</span>
              <span className="text-xs font-bold text-white group-hover:text-purple-400 transition-colors">Assignment</span>
            </button>
            <button
              onClick={handleOpenAddExam}
              className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 hover:border-rose-500/40 text-left transition-all group cursor-pointer"
            >
              <span className="text-xl block mb-1">📖</span>
              <span className="text-xs font-bold text-white group-hover:text-rose-400 transition-colors">Exam Track</span>
            </button>
            <button
              onClick={() => handleOpenAddTask('Project')}
              className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 hover:border-amber-500/40 text-left transition-all group cursor-pointer"
            >
              <span className="text-xl block mb-1">🚀</span>
              <span className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors">Project Task</span>
            </button>
          </div>

          {/* ================= SECTION 1: TODAY'S TASKS (YELLOW STYLE) ================= */}
          <section className="bg-yellow-500/5 border border-yellow-500/10 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-yellow-500/10 pb-3">
              <h3 className="text-base font-bold text-yellow-400 flex items-center gap-2 font-space-grotesk">
                <span className="material-symbols-outlined text-yellow-400 text-lg">wb_sunny</span>
                Today's Daily Tasks
              </h3>
              <span className="text-[10px] font-bold text-yellow-400/80 bg-yellow-500/10 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                {yellowTasks.filter(t => t.done).length}/{yellowTasks.length} Completed
              </span>
            </div>

            {yellowTasks.length === 0 ? (
              <p className="text-xs text-zinc-400 italic py-2">No tasks scheduled for today. Add a daily task or switch to Overall tasks.</p>
            ) : (
              <div className="space-y-2">
                {yellowTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`flex items-center justify-between gap-4 p-3.5 rounded-xl border transition-all duration-200 group bg-[#0D0D14] hover:border-yellow-500/30 ${
                      task.done ? 'opacity-40 border-white/5' : 'border-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        onClick={() => toggleTask(task.id)}
                        className={`w-5 h-5 rounded border flex items-center justify-center transition-all cursor-pointer ${
                          task.done ? 'border-yellow-400 bg-yellow-400 text-black font-bold' : 'border-yellow-500/40 hover:border-yellow-400'
                        }`}
                      >
                        {task.done && <span className="material-symbols-outlined text-black text-xs font-bold">check</span>}
                      </div>

                      <span className={`text-xs md:text-sm font-medium ${task.done ? 'line-through text-zinc-500' : 'text-white'}`}>
                        {task.text}
                      </span>

                      {renderTaskTypeBadge(task.type)}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                      <button 
                        onClick={() => togglePin(task.id)}
                        className={`p-1 rounded hover:bg-white/5 transition-colors cursor-pointer ${task.isPinned ? 'text-yellow-400' : 'text-zinc-500'}`}
                      >
                        <span className="material-symbols-outlined text-base">star</span>
                      </button>
                      <button 
                        onClick={() => handleOpenEditTask(task)}
                        className="p-1 rounded hover:bg-white/5 text-zinc-500 hover:text-white transition-colors cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-base">edit</span>
                      </button>
                      <button 
                        onClick={() => deleteTask(task.id)}
                        className="p-1 rounded hover:bg-white/5 text-zinc-500 hover:text-red-400 transition-colors cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-base">delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* EXAMS & ASSIGNMENTS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* EXAMS CARD SECTION */}
            <div className="bg-[#0B0B10] border border-white/10 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <h3 className="font-space-grotesk text-sm font-bold text-rose-400 flex items-center gap-2">
                  <span className="material-symbols-outlined text-rose-400 text-lg">school</span>
                  Exams Tracker ({exams.length})
                </h3>
                <button onClick={handleOpenAddExam} className="text-xs text-rose-400 hover:underline font-bold cursor-pointer">
                  + Track Exam
                </button>
              </div>

              {exams.length === 0 ? (
                <p className="text-xs text-zinc-500 italic py-2">No exams tracked yet.</p>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto no-scrollbar">
                  {exams.map((ex) => (
                    <div key={ex.id} className="p-3 bg-white/[0.02] border border-white/5 rounded-xl flex items-center justify-between text-xs">
                      <div>
                        <h4 className={`font-bold ${ex.status === 'Completed' ? 'line-through text-zinc-500' : 'text-white'}`}>
                          {ex.name}
                        </h4>
                        <span className="text-[10px] text-zinc-400">{ex.subject} • Due: {ex.date || 'No date'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleExam(ex.id)}
                          className={`px-2 py-1 rounded text-[10px] font-bold uppercase cursor-pointer ${
                            ex.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-300'
                          }`}
                        >
                          {ex.status === 'Completed' ? '✓ Done' : 'Pending'}
                        </button>
                        <button onClick={() => deleteExam(ex.id)} className="text-zinc-500 hover:text-red-400 p-1 cursor-pointer">
                          <span className="material-symbols-outlined text-sm">delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ASSIGNMENTS CARD SECTION */}
            <div className="bg-[#0B0B10] border border-white/10 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <h3 className="font-space-grotesk text-sm font-bold text-purple-400 flex items-center gap-2">
                  <span className="material-symbols-outlined text-purple-400 text-lg">assignment</span>
                  Assignments Tracker ({assignments.length})
                </h3>
                <button onClick={handleOpenAddAssign} className="text-xs text-purple-400 hover:underline font-bold cursor-pointer">
                  + Add Assignment
                </button>
              </div>

              {assignments.length === 0 ? (
                <p className="text-xs text-zinc-500 italic py-2">No assignments added yet.</p>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto no-scrollbar">
                  {assignments.map((as) => (
                    <div key={as.id} className="p-3 bg-white/[0.02] border border-white/5 rounded-xl flex items-center justify-between text-xs">
                      <div>
                        <h4 className={`font-bold ${as.status === 'Submitted' ? 'line-through text-zinc-500' : 'text-white'}`}>
                          {as.name}
                        </h4>
                        <span className="text-[10px] text-zinc-400">{as.subject} • Due: {as.dueDate || 'No date'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleAssignment(as.id)}
                          className={`px-2 py-1 rounded text-[10px] font-bold uppercase cursor-pointer ${
                            as.status === 'Submitted' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-purple-500/20 text-purple-300'
                          }`}
                        >
                          {as.status === 'Submitted' ? '✓ Submitted' : 'Pending'}
                        </button>
                        <button onClick={() => deleteAssignment(as.id)} className="text-zinc-500 hover:text-red-400 p-1 cursor-pointer">
                          <span className="material-symbols-outlined text-sm">delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* OVERALL PERSONAL TASKS */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 bg-[#09090D] border border-white/10 rounded-2xl p-6 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
                <h3 className="text-base font-bold text-white font-space-grotesk flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-lg">checklist</span>
                  Overall Personal Tasks
                </h3>

                <div className="flex items-center gap-3">
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="bg-[#0F0F16] text-white border border-white/10 rounded-xl px-3 py-1.5 text-xs focus:outline-none cursor-pointer"
                  >
                    <option value="All">All Tasks</option>
                    <option value="Active">Active</option>
                    <option value="Completed">Completed</option>
                    <option value="Overdue">Overdue</option>
                  </select>

                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-[#0F0F16] text-white border border-white/10 rounded-xl px-3 py-1.5 text-xs focus:outline-none cursor-pointer"
                  >
                    <option value="Date">Sort by Date</option>
                    <option value="Priority">Sort by Priority</option>
                  </select>
                </div>
              </div>

              {overallFilteredTasks.length === 0 ? (
                <EmptyState
                  icon="checklist"
                  title="No matching tasks"
                  description="Create a task or change your filter settings."
                  actionLabel="Add Task"
                  onAction={() => handleOpenAddTask('General Task')}
                />
              ) : (
                <div className="space-y-2">
                  {overallFilteredTasks.map((task) => (
                    <div
                      key={task.id}
                      className={`flex items-center justify-between gap-4 p-3.5 rounded-xl border transition-all duration-200 group bg-[#0F0F16] hover:border-primary/30 ${
                        task.done ? 'opacity-40 border-white/5' : 'border-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          onClick={() => toggleTask(task.id)}
                          className={`w-5 h-5 rounded border flex items-center justify-center transition-all cursor-pointer ${
                            task.done ? 'border-primary bg-primary text-black font-bold' : 'border-white/20 hover:border-primary'
                          }`}
                        >
                          {task.done && <span className="material-symbols-outlined text-black text-xs font-bold">check</span>}
                        </div>

                        <div>
                          <span className={`text-xs md:text-sm font-medium ${task.done ? 'line-through text-zinc-500' : 'text-white'}`}>
                            {task.text}
                          </span>
                          {task.dueDate && (
                            <span className="text-[10px] text-zinc-400 block font-mono">
                              Due: {task.dueDate}
                            </span>
                          )}
                        </div>

                        {renderTaskTypeBadge(task.type)}
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                        <button
                          onClick={() => togglePin(task.id)}
                          className={`p-1 rounded hover:bg-white/5 transition-colors cursor-pointer ${task.isPinned ? 'text-primary' : 'text-zinc-500'}`}
                        >
                          <span className="material-symbols-outlined text-base">star</span>
                        </button>
                        <button
                          onClick={() => handleOpenEditTask(task)}
                          className="p-1 rounded hover:bg-white/5 text-zinc-500 hover:text-white transition-colors cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-base">edit</span>
                        </button>
                        <button
                          onClick={() => deleteTask(task.id)}
                          className="p-1 rounded hover:bg-white/5 text-zinc-500 hover:text-red-400 transition-colors cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-base">delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* FOCUS TASKS SIDEBAR */}
            <div className="lg:col-span-4 bg-[#09090D] border border-white/10 rounded-2xl p-6 space-y-4 h-max">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <h3 className="font-space-grotesk text-sm font-bold text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-base">star</span>
                  Focus Tasks
                </h3>
                <span className="text-[10px] font-bold text-zinc-400 bg-white/5 px-2 py-0.5 rounded-full">
                  {focusTasks.length}/6
                </span>
              </div>

              {focusTasks.length === 0 ? (
                <p className="text-xs text-zinc-500 italic py-2">No focus tasks pinned. Click star icon to pin important items.</p>
              ) : (
                <div className="space-y-2">
                  {focusTasks.map(t => (
                    <div key={t.id} className="p-3 bg-white/[0.02] border border-white/5 rounded-xl flex items-center justify-between text-xs">
                      <span className={`font-medium ${t.done ? 'line-through text-zinc-500' : 'text-white'}`}>{t.text}</span>
                      <button onClick={() => toggleTask(t.id)} className="text-primary font-bold text-[10px] hover:underline cursor-pointer">
                        {t.done ? '✓ Done' : 'Complete'}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ================= WORKSPACE TASKS (GROUPED BY WORKSPACE) ================= */}
          <section className="bg-[#09090D] border border-white/10 rounded-2xl p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-4">
              <div>
                <h3 className="font-space-grotesk text-base font-bold text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-lg">folder_open</span>
                  Workspace Tasks (Grouped by Workspace)
                </h3>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                  These tasks are created and managed inside their respective workspaces. They do not appear in your personal checklist.
                </p>
              </div>
            </div>

            {workspaces.length === 0 ? (
              <div className="p-8 bg-white/[0.01] border border-white/5 rounded-xl text-center space-y-2">
                <span className="material-symbols-outlined text-zinc-500 text-3xl">folder_off</span>
                <p className="text-xs text-zinc-400 italic">No workspaces created yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {workspaces.map((ws) => {
                  const wsTasks = tasks.filter(t => t.workspaceId === ws.id);
                  const isExpanded = Boolean(expandedWorkspaces[ws.id]);

                  return (
                    <div key={ws.id} className="border border-white/10 rounded-xl bg-[#0E0E14] overflow-hidden transition-all hover:border-white/20">
                      <button
                        onClick={() => toggleAccordion(ws.id)}
                        className="w-full p-4 flex items-center justify-between text-left cursor-pointer hover:bg-white/[0.02] transition-colors select-none"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-bold text-sm">
                            <span className="material-symbols-outlined text-lg">{ws.icon || 'folder'}</span>
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-white font-space-grotesk">{ws.title}</h4>
                            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                              {wsTasks.length} {wsTasks.length === 1 ? 'TASK' : 'TASKS'}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span
                            className="text-xs text-primary font-bold hover:underline cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/workspaces/${ws.id}`);
                            }}
                          >
                            Open Workspace →
                          </span>
                          <span className={`material-symbols-outlined text-zinc-400 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}>
                            chevron_right
                          </span>
                        </div>
                      </button>

                      {isExpanded && (
                        <div className="border-t border-white/5 p-4 space-y-2 bg-[#07070B] animate-fadeIn">
                          {wsTasks.length === 0 ? (
                            <p className="text-xs text-zinc-500 italic p-2">No tasks in this workspace.</p>
                          ) : (
                            wsTasks.map(task => (
                              <div
                                key={task.id}
                                className={`flex items-center justify-between p-3 rounded-xl border border-white/5 bg-[#0D0D14] hover:border-primary/30 transition-all ${
                                  task.done ? 'opacity-40 border-white/5' : ''
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <div
                                    onClick={() => toggleTask(task.id)}
                                    className={`w-4.5 h-4.5 rounded border flex items-center justify-center transition-all cursor-pointer ${
                                      task.done ? 'border-primary bg-primary text-black font-bold' : 'border-white/20 hover:border-primary'
                                    }`}
                                  >
                                    {task.done && <span className="material-symbols-outlined text-black text-[10px] font-bold">check</span>}
                                  </div>
                                  <span className={`text-xs font-semibold ${task.done ? 'line-through text-zinc-500' : 'text-white'}`}>
                                    {task.text}
                                  </span>
                                </div>

                                <div className="flex items-center gap-2">
                                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${getPriorityColor(task.priority)}`}>
                                    {task.priority || 'Low'}
                                  </span>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </section>

        </div>
      </main>

      {/* ================= REDESIGNED TASK ADD/EDIT MODAL ================= */}
      {isTaskModalOpen && (
        <Modal
          isOpen={isTaskModalOpen}
          onClose={() => setIsTaskModalOpen(false)}
          title={editingTask ? 'EDIT TASK' : 'ADD NEW TASK'}
        >
          <form onSubmit={handleTaskSubmit} className="space-y-5 text-on-surface select-none">
            
            {/* Task Title */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Task Title <span className="text-primary">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Complete Java Assignment"
                value={taskText}
                onChange={(e) => setTaskText(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white text-sm focus:outline-none focus:border-primary/50 placeholder:text-zinc-600"
                required
                autoFocus
              />
            </div>

            {/* Type & Workspace Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Type</label>
                <select
                  value={taskType}
                  onChange={(e) => setTaskType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0F0F16] border border-white/10 text-white text-xs focus:outline-none focus:border-primary/50 cursor-pointer"
                >
                  {TASK_TYPES.map(t => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Workspace</label>
                <select
                  value={taskWorkspaceId}
                  onChange={(e) => setTaskWorkspaceId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0F0F16] border border-white/10 text-white text-xs focus:outline-none focus:border-primary/50 cursor-pointer"
                >
                  <option value="">Personal (No Workspace)</option>
                  {(workspaces || []).map(ws => (
                    <option key={ws.id} value={ws.id}>{ws.title}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* REDESIGNED DATE SELECTION UI & PRIORITY */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              {/* Redesigned Compact Date Selection with Popover */}
              <div className="relative" ref={datePickerRef}>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Due Date</label>
                <button
                  type="button"
                  onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 hover:border-white/20 text-white text-xs flex items-center justify-between transition-colors cursor-pointer"
                >
                  <span className="font-semibold text-zinc-200">
                    {formatDateDisplay(taskDueDate)}
                  </span>
                  <span className="material-symbols-outlined text-sm text-zinc-400">calendar_today</span>
                </button>

                {/* Popover */}
                {isDatePickerOpen && (
                  <div className="absolute left-0 top-16 z-50 bg-[#12121A] border border-white/10 rounded-2xl p-4 shadow-2xl space-y-3 w-72 animate-fadeIn">
                    <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Quick Select</div>
                    
                    {/* Quick Selection Buttons */}
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setTaskDueDate(todayStr);
                          setIsDatePickerOpen(false);
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold text-center border transition-all cursor-pointer ${
                          taskDueDate === todayStr
                            ? 'bg-primary/20 text-primary border-primary/30'
                            : 'bg-white/5 border-white/5 text-zinc-300 hover:bg-white/10'
                        }`}
                      >
                        Today
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setTaskDueDate(getTomorrowStr());
                          setIsDatePickerOpen(false);
                        }}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold text-center border bg-white/5 border-white/5 text-zinc-300 hover:bg-white/10 cursor-pointer"
                      >
                        Tomorrow
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setTaskDueDate(getEndOfWeekStr());
                          setIsDatePickerOpen(false);
                        }}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold text-center border bg-white/5 border-white/5 text-zinc-300 hover:bg-white/10 cursor-pointer"
                      >
                        This Week
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setTaskDueDate('');
                          setIsDatePickerOpen(false);
                        }}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold text-center border bg-white/5 border-white/5 text-zinc-400 hover:text-white cursor-pointer"
                      >
                        No Due Date
                      </button>
                    </div>

                    <div className="border-t border-white/5 pt-2">
                      <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Specific Date</label>
                      <input
                        type="date"
                        value={taskDueDate}
                        onChange={(e) => {
                          setTaskDueDate(e.target.value);
                          setIsDatePickerOpen(false);
                        }}
                        className="w-full px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Priority Dropdown */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Priority</label>
                <select
                  value={taskPriority}
                  onChange={(e) => setTaskPriority(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0F0F16] border border-white/10 text-white text-xs focus:outline-none focus:border-primary/50 cursor-pointer"
                >
                  <option value="High">🔴 High Priority</option>
                  <option value="Med">🟣 Medium Priority</option>
                  <option value="Low">⚪ Low Priority</option>
                </select>
              </div>

            </div>

            {/* Classification (Today vs Overall) */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setTaskColorCategory('yellow')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                  taskColorCategory === 'yellow'
                    ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/40 font-bold'
                    : 'bg-white/5 text-zinc-400 border-white/5 hover:text-white'
                }`}
              >
                Today's Task
              </button>
              <button
                type="button"
                onClick={() => setTaskColorCategory('red')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                  taskColorCategory === 'red'
                    ? 'bg-red-500/10 text-red-400 border-red-500/40 font-bold'
                    : 'bg-white/5 text-zinc-400 border-white/5 hover:text-white'
                }`}
              >
                Overall Task
              </button>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
              <button
                type="button"
                onClick={() => setIsTaskModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <Button type="submit" variant="primary" className="py-2 px-5 text-xs font-bold uppercase">
                {editingTask ? 'Save Changes' : 'Add Task'}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* EXAM MODAL */}
      {isExamModalOpen && (
        <Modal
          isOpen={isExamModalOpen}
          onClose={() => setIsExamModalOpen(false)}
          title={editingExam ? 'EDIT EXAM' : 'TRACK NEW EXAM'}
        >
          <form onSubmit={handleExamSubmit} className="space-y-4 text-on-surface select-none">
            <InputField
              id="exam-name"
              label="Exam Name"
              placeholder="e.g. Java Midterm"
              value={examName}
              onChange={(e) => setExamName(e.target.value)}
              required
            />
            <InputField
              id="exam-subject"
              label="Subject"
              placeholder="e.g. Computer Science"
              value={examSubject}
              onChange={(e) => setExamSubject(e.target.value)}
              required
            />
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Exam Date</label>
              <input
                type="date"
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white text-xs focus:outline-none focus:border-primary/50"
                required
              />
            </div>
            <div className="flex justify-end gap-3 pt-3 border-t border-white/5">
              <button
                type="button"
                onClick={() => setIsExamModalOpen(false)}
                className="px-4 py-2 text-xs text-zinc-400 hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <Button type="submit" variant="primary" className="py-2 px-5 text-xs font-bold uppercase">
                {editingExam ? 'Save Changes' : 'Track Exam'}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* ASSIGNMENT MODAL */}
      {isAssignModalOpen && (
        <Modal
          isOpen={isAssignModalOpen}
          onClose={() => setIsAssignModalOpen(false)}
          title={editingAssign ? 'EDIT ASSIGNMENT' : 'ADD ASSIGNMENT'}
        >
          <form onSubmit={handleAssignSubmit} className="space-y-4 text-on-surface select-none">
            <InputField
              id="assign-name"
              label="Assignment Name"
              placeholder="e.g. DSA Assignment 2"
              value={assignName}
              onChange={(e) => setAssignName(e.target.value)}
              required
            />
            <InputField
              id="assign-subject"
              label="Subject"
              placeholder="e.g. Data Structures"
              value={assignSubject}
              onChange={(e) => setAssignSubject(e.target.value)}
              required
            />
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Submission Deadline</label>
              <input
                type="date"
                value={assignDueDate}
                onChange={(e) => setAssignDueDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white text-xs focus:outline-none focus:border-primary/50"
                required
              />
            </div>
            <div className="flex justify-end gap-3 pt-3 border-t border-white/5">
              <button
                type="button"
                onClick={() => setIsAssignModalOpen(false)}
                className="px-4 py-2 text-xs text-zinc-400 hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <Button type="submit" variant="primary" className="py-2 px-5 text-xs font-bold uppercase">
                {editingAssign ? 'Save Changes' : 'Add Assignment'}
              </Button>
            </div>
          </form>
        </Modal>
      )}

    </div>
  );
};

export default Tasks;
