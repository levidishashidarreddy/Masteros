import React, { useState, useContext, useEffect } from 'react';
import { TaskContext } from '../context/TaskContext';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Button from '../components/Button';
import Modal from '../components/Modal';
import InputField from '../components/InputField';
import { SkeletonBlock } from '../components/Skeleton';
import EmptyState from '../components/EmptyState';


const Tasks = () => {
  const {
    tasks,
    exams,
    assignments,
    addTask,
    editTask,
    deleteTask,
    toggleTask,
    togglePin,
    workspaces,
    loading
  } = useContext(TaskContext);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading) {
      setIsLoading(false);
    }
  }, [loading]);

  // Filter and Sorting state for Red (Overall) Personal Tasks
  const [filterType, setFilterType] = useState('All'); // All, Active, Completed, Overdue, Upcoming
  const [sortBy, setSortBy] = useState('Date'); // Date, Priority, Completion

  // State for accordions in Workspace Tasks
  const [expandedWorkspaces, setExpandedWorkspaces] = useState({
    'web-dev': true,
    'dsa': true,
    'startup': true,
    'fitness': true
  });

  // Modal States
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null); // null if adding new task

  const [isExamModalOpen, setIsExamModalOpen] = useState(false);
  const [editingExam, setEditingExam] = useState(null);

  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [editingAssign, setEditingAssign] = useState(null);

  // Form states - Personal Tasks
  const [taskText, setTaskText] = useState('');
  const [taskPriority, setTaskPriority] = useState('Med');
  const [taskDueDate, setTaskDueDate] = useState('');
  const [taskDueTime, setTaskDueTime] = useState('');
  const [taskRecurring, setTaskRecurring] = useState('None');
  const [taskReminder, setTaskReminder] = useState('');
  const [taskColorCategory, setTaskColorCategory] = useState('yellow'); // yellow (Today) or red (Overall)

  // Form states - Exams
  const [examName, setExamName] = useState('');
  const [examSubject, setExamSubject] = useState('');
  const [examDate, setExamDate] = useState('');

  // Form states - Assignments
  const [assignName, setAssignName] = useState('');
  const [assignSubject, setAssignSubject] = useState('');
  const [assignDueDate, setAssignDueDate] = useState('');
  const [assignProgress, setAssignProgress] = useState(0);

  // Open personal task modal for adding
  const handleOpenAddTask = () => {
    setEditingTask(null);
    setTaskText('');
    setTaskPriority('Med');
    setTaskDueDate(new Date().toISOString().split('T')[0]);
    setTaskDueTime('12:00');
    setTaskRecurring('None');
    setTaskReminder('');
    setTaskColorCategory('yellow');
    setIsTaskModalOpen(true);
  };

  // Open personal task modal for editing
  const handleOpenEditTask = (task) => {
    setEditingTask(task);
    setTaskText(task.text);
    setTaskPriority(task.priority);
    setTaskDueDate(task.dueDate || '');
    setTaskDueTime(task.dueTime || '');
    setTaskRecurring(task.recurring || 'None');
    setTaskReminder(task.reminder || '');
    setTaskColorCategory(task.colorCategory || 'yellow');
    setIsTaskModalOpen(true);
  };

  // Handle personal task form submit
  const handleTaskSubmit = (e) => {
    e.preventDefault();
    const taskData = {
      text: taskText,
      priority: taskPriority,
      dueDate: taskColorCategory === 'yellow' ? todayStr : taskDueDate,
      dueTime: taskColorCategory === 'yellow' ? '' : taskDueTime,
      workspaceId: null, // Strictly Personal Task
      recurring: taskColorCategory === 'yellow' ? taskRecurring : 'None',
      reminder: taskColorCategory === 'yellow' ? '' : taskReminder,
      colorCategory: taskColorCategory,
      progress: 0,
      done: editingTask ? editingTask.done : false
    };

    if (editingTask) {
      editTask(editingTask.id, taskData);
    } else {
      addTask(taskData);
    }
    setIsTaskModalOpen(false);
  };

  // Open exam modal
  const handleOpenAddExam = () => {
    setEditingExam(null);
    setExamName('');
    setExamSubject('');
    setExamDate('');
    setIsExamModalOpen(true);
  };

  const handleOpenEditExam = (exam) => {
    setEditingExam(exam);
    setExamName(exam.name);
    setExamSubject(exam.subject);
    setExamDate(exam.date);
    setIsExamModalOpen(true);
  };

  const handleExamSubmit = (e) => {
    e.preventDefault();
    const examData = {
      name: examName,
      subject: examSubject,
      date: examDate,
      status: editingExam ? editingExam.status : 'Pending'
    };

    if (editingExam) {
      editExam(editingExam.id, examData);
    } else {
      addExam(examData);
    }
    setIsExamModalOpen(false);
  };

  // Open assignment modal
  const handleOpenAddAssign = () => {
    setEditingAssign(null);
    setAssignName('');
    setAssignSubject('');
    setAssignDueDate('');
    setAssignProgress(0);
    setIsAssignModalOpen(true);
  };

  const handleOpenEditAssign = (assign) => {
    setEditingAssign(assign);
    setAssignName(assign.name);
    setAssignSubject(assign.subject);
    setAssignDueDate(assign.dueDate);
    setAssignProgress(assign.progress);
    setIsAssignModalOpen(true);
  };

  const handleAssignSubmit = (e) => {
    e.preventDefault();
    const assignData = {
      name: assignName,
      subject: assignSubject,
      dueDate: assignDueDate,
      progress: parseInt(assignProgress) || 0,
      status: parseInt(assignProgress) === 100 ? 'Submitted' : 'Pending'
    };

    if (editingAssign) {
      editAssignment(editingAssign.id, assignData);
    } else {
      addAssignment(assignData);
    }
    setIsAssignModalOpen(false);
  };

  // Toggle Accordions
  const toggleAccordion = (wsId) => {
    setExpandedWorkspaces(prev => ({
      ...prev,
      [wsId]: !prev[wsId]
    }));
  };

  const todayStr = new Date().toISOString().split('T')[0];

  // Separating Tasks
  const personalTasks = tasks.filter(t => t.workspaceId === null);
  const workspaceTasks = tasks.filter(t => t.workspaceId !== null);

  // Today's tasks (yellow)
  const yellowTasks = personalTasks.filter(t => t.colorCategory === 'yellow');
  // Overall tasks (red)
  const redTasks = personalTasks.filter(t => t.colorCategory === 'red');

  // Filtering Red (Overall) Tasks
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
        default: // All
          return true;
      }
    });
  };

  // Sorting Red (Overall) Tasks
  const getSortedTasks = (tasksList) => {
    const priorityMap = { 'High': 3, 'Med': 2, 'Low': 1 };
    return [...tasksList].sort((a, b) => {
      switch (sortBy) {
        case 'Priority':
          return priorityMap[b.priority] - priorityMap[a.priority];
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

  // Stats calculation
  const completedToday = personalTasks.filter(t => t.done && t.completedAt && t.completedAt.startsWith(todayStr)).length;
  const pendingTasksCount = personalTasks.filter(t => !t.done).length;
  const upcomingExamsCount = exams.filter(e => e.status !== 'Completed').length;
  const upcomingAssignCount = assignments.filter(a => a.status !== 'Submitted').length;
  
  const totalPersonalTasks = personalTasks.length;
  const completedPersonalTasks = personalTasks.filter(t => t.done).length;
  const completionRate = totalPersonalTasks > 0 ? Math.round((completedPersonalTasks / totalPersonalTasks) * 100) : 0;
  
  const activeFocusCount = personalTasks.filter(t => t.isPinned && !t.done).length;

  const overallFilteredTasks = getSortedTasks(getFilteredTasks(redTasks));
  const focusTasks = personalTasks.filter(t => t.isPinned);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-500/10 text-red-400 border border-red-500/20';
      case 'Med': return 'bg-primary/10 text-primary border border-primary/20';
      default: return 'bg-white/5 text-on-surface-variant border border-white/5';
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-background text-on-surface radial-glow-bg select-none">
        <Sidebar />
        <main className="flex-1 flex flex-col h-screen overflow-y-auto no-scrollbar relative z-10">
          <Header hideSearch={true} hideStreak={true} hideLogo={true} />
          <div className="w-full px-8 pt-4 pb-12 space-y-10">
            <div className="flex justify-between items-center">
              <div className="space-y-2">
                <SkeletonBlock className="h-8 w-44" />
                <SkeletonBlock className="h-4 w-96" />
              </div>
              <SkeletonBlock className="h-10 w-36 rounded-xl" />
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              {[1, 2, 3, 4, 5, 6, 7].map(i => (
                <div key={i} className="bg-[#111118]/60 border border-white/5 rounded-xl p-4 h-24 space-y-3">
                  <SkeletonBlock className="h-3 w-16" />
                  <SkeletonBlock className="h-6 w-8" />
                </div>
              ))}
            </div>

            <div className="grid grid-cols-12 gap-8">
              <div className="col-span-12 lg:col-span-8 bg-[#111118]/60 border border-white/5 p-6 rounded-2xl space-y-4">
                <SkeletonBlock className="h-5 w-32" />
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="flex gap-4 p-3 bg-[#0D0D14]/20 border border-white/5 rounded-xl">
                      <SkeletonBlock className="h-4 w-4 rounded" />
                      <SkeletonBlock className="h-4 w-full" />
                    </div>
                  ))}
                </div>
              </div>
              <div className="col-span-12 lg:col-span-4 space-y-6">
                <div className="bg-[#111118]/60 border border-white/5 p-6 rounded-2xl space-y-4">
                  <SkeletonBlock className="h-5 w-24" />
                  <div className="space-y-3">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-16 bg-[#0D0D14]/20 border border-white/5 rounded-xl"></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background text-on-surface radial-glow-bg select-none">
      <Sidebar />
      
      <main className="flex-1 flex flex-col h-screen overflow-y-auto no-scrollbar relative z-10">
        <Header hideSearch={true} hideStreak={true} hideLogo={true} />

        <div className="w-full px-8 pt-4 pb-12 animate-page-transition space-y-10">
          
          {/* Header Title */}
          <div className="flex items-center justify-between">
            <div className="animate-text-reveal">
              <h2 className="font-display-lg text-[32px] text-white font-bold tracking-tight mb-2">
                Tasks Workspace
              </h2>
              <p className="text-on-surface-variant text-sm font-medium">
                Unified personal productivity. Style Today's Tasks in <span className="text-yellow-400 font-bold">Yellow</span> and Overall Tasks in <span className="text-red-400 font-bold">Red</span>.
              </p>
            </div>
            <Button variant="primary" icon="add" onClick={handleOpenAddTask}>
              Add Personal Task
            </Button>
          </div>

          {/* ================= STATS CARDS SECTION ================= */}
          <section className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            <div className="bg-[#111118] border border-white/5 rounded-xl p-4 flex flex-col justify-between h-24">
              <span className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">Today's Tasks</span>
              <span className="text-2xl font-bold text-white">{yellowTasks.length}</span>
            </div>
            <div className="bg-[#111118] border border-white/5 rounded-xl p-4 flex flex-col justify-between h-24">
              <span className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">Completed Today</span>
              <span className="text-2xl font-bold text-primary">{completedToday}</span>
            </div>
            <div className="bg-[#111118] border border-white/5 rounded-xl p-4 flex flex-col justify-between h-24">
              <span className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">Pending Tasks</span>
              <span className="text-2xl font-bold text-white">{pendingTasksCount}</span>
            </div>
            <div className="bg-[#111118] border border-white/5 rounded-xl p-4 flex flex-col justify-between h-24">
              <span className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">Upcoming Exams</span>
              <span className="text-2xl font-bold text-secondary">{upcomingExamsCount}</span>
            </div>
            <div className="bg-[#111118] border border-white/5 rounded-xl p-4 flex flex-col justify-between h-24">
              <span className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">Assignments</span>
              <span className="text-2xl font-bold text-tertiary">{upcomingAssignCount}</span>
            </div>
            <div className="bg-[#111118] border border-white/5 rounded-xl p-4 flex flex-col justify-between h-24">
              <span className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">Completion Rate</span>
              <span className="text-2xl font-bold text-white">{completionRate}%</span>
            </div>
            <div className="bg-[#111118] border border-white/5 rounded-xl p-4 flex flex-col justify-between h-24">
              <span className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">Focus Pinned</span>
              <span className="text-2xl font-bold text-primary">{activeFocusCount}/6</span>
            </div>
          </section>

          {/* ================= SECTION 1: TODAY'S PERSONAL TASKS (YELLOW STYLE) ================= */}
          <section className="bg-yellow-500/5 border border-yellow-500/10 rounded-2xl p-6 space-y-4 shadow-[0_0_15px_rgba(234,180,8,0.02)]">
            <h3 className="text-lg font-bold text-yellow-400 flex items-center gap-2 border-b border-yellow-500/10 pb-3">
              <span className="material-symbols-outlined text-yellow-400 text-xl">today</span>
              Today's Personal Tasks
            </h3>
            {yellowTasks.length === 0 ? (
              <EmptyState
                icon="task_alt"
                title="No tasks due today"
                description="Your daily checklist is clean. Relax, or add a task to get ahead."
                actionLabel="Add Task"
                onAction={handleOpenAddTask}
              />
            ) : (
              <div className="space-y-2">
                {yellowTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 group bg-[#111118] hover:border-yellow-500/30 ${
                      task.done ? 'opacity-40 border-white/5' : 'border-white/5'
                    }`}
                  >
                    {/* Checkbox */}
                    <div 
                      onClick={() => toggleTask(task.id)}
                      className={`w-5 h-5 rounded border flex items-center justify-center transition-all cursor-pointer ${
                        task.done ? 'border-yellow-400 bg-yellow-400 text-background' : 'border-yellow-500/30 hover:border-yellow-400/60'
                      }`}
                    >
                      {task.done && <span className="material-symbols-outlined text-background text-xs font-black">check</span>}
                    </div>

                    {/* Task Title & Details */}
                    <div className="flex-grow flex flex-col sm:flex-row sm:items-center gap-2.5">
                      <span className={`text-sm font-medium ${task.done ? 'line-through text-on-surface-variant' : 'text-white'}`}>
                        {task.text}
                      </span>
                    </div>

                    {/* Priority Badge */}
                    <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>

                    {/* Actions */}
                    <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => togglePin(task.id)}
                        className={`p-1.5 rounded hover:bg-white/5 transition-colors cursor-pointer ${task.isPinned ? 'text-yellow-400' : 'text-on-surface-variant'}`}
                        title={task.isPinned ? 'Unpin Focus' : 'Pin to Focus'}
                      >
                        <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: task.isPinned ? "'FILL' 1" : "'FILL' 0" }}>star</span>
                      </button>
                      <button 
                        onClick={() => handleOpenEditTask(task)}
                        className="p-1.5 rounded hover:bg-white/5 text-on-surface-variant hover:text-white transition-colors cursor-pointer"
                        title="Edit Task"
                      >
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                      </button>
                      <button 
                        onClick={() => deleteTask(task.id)}
                        className="p-1.5 rounded hover:bg-white/5 text-on-surface-variant hover:text-red-400 transition-colors cursor-pointer"
                        title="Delete Task"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* ================= SECTIONS 2 & 3: OVERALL (RED STYLE) & FOCUS ================= */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* SECTION 2: OVERALL PERSONAL TASKS (RED STYLE) */}
            <div className="lg:col-span-8 bg-red-500/5 border border-red-500/10 rounded-2xl p-6 space-y-6 shadow-[0_0_15px_rgba(239,68,68,0.02)]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-red-500/10 pb-4">
                <h3 className="text-lg font-bold text-red-400 flex items-center gap-2">
                  <span className="material-symbols-outlined text-red-400 text-xl">assignment_turned_in</span>
                  Overall Personal Tasks
                </h3>
                
                {/* Filters and Sorting Controls */}
                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center bg-[#111118] border border-white/5 rounded-lg px-2.5 py-1 text-xs">
                    <span className="text-on-surface-variant mr-2 font-bold uppercase text-[9px] tracking-wider">Filter:</span>
                    <select 
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      className="bg-transparent text-white focus:outline-none cursor-pointer"
                    >
                      <option value="All">All</option>
                      <option value="Active">Active</option>
                      <option value="Completed">Completed</option>
                      <option value="Overdue">Overdue</option>
                      <option value="Upcoming">Upcoming</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center bg-[#111118] border border-white/5 rounded-lg px-2.5 py-1 text-xs">
                    <span className="text-on-surface-variant mr-2 font-bold uppercase text-[9px] tracking-wider">Sort by:</span>
                    <select 
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="bg-transparent text-white focus:outline-none cursor-pointer"
                    >
                      <option value="Date">Due Date</option>
                      <option value="Priority">Priority</option>
                      <option value="Completion">Status</option>
                    </select>
                  </div>
                </div>
              </div>

              {overallFilteredTasks.length === 0 ? (
                <EmptyState
                  icon="assignment_turned_in"
                  title={tasks.length === 0 ? "No tasks yet" : "No tasks available"}
                  description={tasks.length === 0 ? "Create your first task to start tracking your daily progress." : "No matching tasks found. Change your filter settings or create a task."}
                  actionLabel="Add Task"
                  onAction={handleOpenAddTask}
                />
              ) : (
                <div className="space-y-2">
                  {overallFilteredTasks.map((task) => (
                    <div
                      key={task.id}
                      className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 group bg-[#111118] hover:border-red-500/30 ${
                        task.done ? 'opacity-40 border-white/5' : 'border-white/5'
                      }`}
                    >
                      {/* Checkbox */}
                      <div 
                        onClick={() => toggleTask(task.id)}
                        className={`w-5 h-5 rounded border flex items-center justify-center transition-all cursor-pointer ${
                          task.done ? 'border-red-400 bg-red-400 text-white' : 'border-red-500/30 hover:border-red-400/60'
                        }`}
                      >
                        {task.done && <span className="material-symbols-outlined text-white text-xs font-black">check</span>}
                      </div>

                      {/* Content */}
                      <div className="flex-grow flex flex-col sm:flex-row sm:items-center gap-2">
                        <span className={`text-sm font-medium ${task.done ? 'line-through text-on-surface-variant' : 'text-white'}`}>
                          {task.text}
                        </span>
                        {task.dueDate && (
                          <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider bg-white/5 px-2 py-0.5 rounded flex items-center gap-1 w-max">
                            <span className="material-symbols-outlined text-[12px]">calendar_today</span>
                            Due: {task.dueDate} {task.dueTime}
                          </span>
                        )}
                        {task.reminder && (
                          <span className="text-[10px] text-primary/80 font-bold uppercase tracking-wider bg-primary/5 px-2 py-0.5 rounded flex items-center gap-1 w-max">
                            <span className="material-symbols-outlined text-[12px]">notifications_active</span>
                            Remind: {task.reminder}
                          </span>
                        )}
                      </div>

                      {/* Priority badge */}
                      <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>

                      {/* Hover Actions */}
                      <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => togglePin(task.id)}
                          className={`p-1.5 rounded hover:bg-white/5 transition-colors cursor-pointer ${task.isPinned ? 'text-red-400' : 'text-on-surface-variant'}`}
                          title={task.isPinned ? 'Unpin Focus' : 'Pin to Focus'}
                        >
                          <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: task.isPinned ? "'FILL' 1" : "'FILL' 0" }}>star</span>
                        </button>
                        <button 
                          onClick={() => handleOpenEditTask(task)}
                          className="p-1.5 rounded hover:bg-white/5 text-on-surface-variant hover:text-white transition-colors cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </button>
                        <button 
                          onClick={() => deleteTask(task.id)}
                          className="p-1.5 rounded hover:bg-white/5 text-on-surface-variant hover:text-red-400 transition-colors cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* SECTION 3: ⭐ FOCUS TASKS (PERSONAL ONLY) */}
            <div className="lg:col-span-4 bg-[#111118]/60 border border-white/5 rounded-2xl p-6 space-y-4 h-max">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-xl">star</span>
                  Focus Tasks
                </h3>
                <span className="text-[10px] font-bold text-on-surface-variant bg-white/5 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  {focusTasks.length}/6 Pinned
                </span>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Important personal tasks. Pinned items here appear automatically on the **Dashboard Focus Checklist** (max 6 active tasks allowed).
              </p>
              
              {focusTasks.length === 0 ? (
                <p className="text-on-surface-variant text-sm italic py-2">No focus tasks pinned. Click the ⭐ star icon on personal tasks to pin them.</p>
              ) : (
                <div className="space-y-3 pt-2">
                  {focusTasks.map((task) => (
                    <div 
                      key={task.id}
                      className={`p-3.5 rounded-xl border border-white/5 bg-[#111118] flex items-center justify-between gap-3 hover:border-primary/20 transition-all duration-200 ${
                        task.colorCategory === 'yellow' ? 'hover:border-yellow-500/20' : 'hover:border-red-500/20'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className={`material-symbols-outlined text-lg ${task.colorCategory === 'yellow' ? 'text-yellow-400' : 'text-red-400'}`} style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        <span className={`text-sm truncate font-medium ${task.done ? 'line-through text-on-surface-variant' : 'text-white'}`}>
                          {task.text}
                        </span>
                      </div>
                      <button 
                        onClick={() => togglePin(task.id)}
                        className="text-on-surface-variant hover:text-white transition-colors cursor-pointer shrink-0"
                        title="Unpin task"
                      >
                        <span className="material-symbols-outlined text-lg">close</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* ================= SECTIONS 4 & 5: EXAMS & ASSIGNMENTS ================= */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* SECTION 4: EXAMS TRACKER (NO PROGRESS TRACKING) */}
            <div className="bg-[#111118]/60 border border-white/5 rounded-2xl p-6 space-y-6">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-xl">school</span>
                  Exam Tracker
                </h3>
                <Button variant="secondary" className="py-1 px-3 text-xs" icon="add" onClick={handleOpenAddExam}>
                  New Exam
                </Button>
              </div>

              {exams.length === 0 ? (
                <p className="text-on-surface-variant text-sm italic py-2">No exams tracked yet.</p>
              ) : (
                <div className="space-y-4">
                  {exams.map((exam) => (
                    <div key={exam.id} className="p-4 rounded-xl border border-white/5 bg-[#111118] flex items-center justify-between hover:border-secondary/20 transition-all duration-200">
                      <div className="space-y-1">
                        <h4 className="font-bold text-white text-sm">{exam.name}</h4>
                        <p className="text-xs text-on-surface-variant font-medium">{exam.subject}</p>
                        <div className="flex items-center gap-1 text-[10px] text-on-surface-variant font-semibold pt-2">
                          <span className="material-symbols-outlined text-[13px]">calendar_today</span>
                          Date: {exam.date ? new Date(exam.date).toLocaleDateString(undefined, {month: 'short', day: 'numeric', year: 'numeric'}) : 'Not Set'}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 shrink-0">
                        <button 
                          onClick={() => toggleExam(exam.id)}
                          className={`px-2.5 py-1 rounded text-[9px] font-bold uppercase tracking-wider border cursor-pointer ${
                            exam.status === 'Completed'
                              ? 'bg-green-500/10 text-green-400 border-green-500/20'
                              : 'bg-secondary/10 text-secondary border-secondary/20'
                          }`}
                        >
                          {exam.status === 'Completed' ? 'Completed' : 'Upcoming'}
                        </button>
                        <button onClick={() => handleOpenEditExam(exam)} className="text-on-surface-variant hover:text-white transition-colors cursor-pointer" title="Edit Exam">
                          <span className="material-symbols-outlined text-base">edit</span>
                        </button>
                        <button onClick={() => deleteExam(exam.id)} className="text-on-surface-variant hover:text-red-400 transition-colors cursor-pointer" title="Delete Exam">
                          <span className="material-symbols-outlined text-base">delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* SECTION 5: ASSIGNMENTS TRACKER (WITH PROGRESS SLIDER) */}
            <div className="bg-[#111118]/60 border border-white/5 rounded-2xl p-6 space-y-6">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-tertiary text-xl">assignment</span>
                  Assignments Tracker
                </h3>
                <Button variant="secondary" className="py-1 px-3 text-xs" icon="add" onClick={handleOpenAddAssign}>
                  New Assignment
                </Button>
              </div>

              {assignments.length === 0 ? (
                <p className="text-on-surface-variant text-sm italic py-2">No assignments tracked yet.</p>
              ) : (
                <div className="space-y-4">
                  {assignments.map((assign) => (
                    <div key={assign.id} className="p-4 rounded-xl border border-white/5 bg-[#111118] space-y-4 hover:border-tertiary/20 transition-all duration-200">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-white text-sm">{assign.name}</h4>
                          <p className="text-xs text-on-surface-variant font-medium mt-0.5">{assign.subject}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => toggleAssignment(assign.id)}
                            className={`px-2.5 py-1 rounded text-[9px] font-bold uppercase tracking-wider border cursor-pointer ${
                              assign.status === 'Submitted'
                                ? 'bg-green-500/10 text-green-400 border-green-500/20'
                                : 'bg-tertiary/10 text-tertiary border-tertiary/20'
                            }`}
                          >
                            {assign.status}
                          </button>
                          <button onClick={() => handleOpenEditAssign(assign)} className="text-on-surface-variant hover:text-white transition-colors cursor-pointer" title="Edit Assignment">
                            <span className="material-symbols-outlined text-base">edit</span>
                          </button>
                          <button onClick={() => deleteAssignment(assign.id)} className="text-on-surface-variant hover:text-red-400 transition-colors cursor-pointer" title="Delete Assignment">
                            <span className="material-symbols-outlined text-base">delete</span>
                          </button>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex justify-between text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">
                          <span>Progress</span>
                          <span className="text-white">{assign.progress}%</span>
                        </div>
                        <div className="h-1.5 bg-background rounded-full overflow-hidden">
                          <div className="h-full bg-tertiary transition-all" style={{ width: `${assign.progress}%` }}></div>
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-on-surface-variant mt-2 font-semibold">
                          <div className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-[13px]">calendar_today</span>
                            Due Date: {assign.dueDate ? new Date(assign.dueDate).toLocaleDateString(undefined, {month: 'short', day: 'numeric'}) : 'Not Set'}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* ================= SECTION 6: WORKSPACE TASKS (COMPLETELY SEPARATE) ================= */}
          <section className="bg-[#111118]/60 border border-white/5 rounded-2xl p-6 space-y-6">
            <h3 className="text-lg font-bold text-white border-b border-white/5 pb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-xl">folder_open</span>
              Workspace Tasks (Grouped by Workspace)
            </h3>
            <p className="text-xs text-on-surface-variant max-w-2xl leading-relaxed">
              These tasks are created and managed strictly inside their respective workspaces. They do not appear in your personal checklist.
            </p>

            <div className="space-y-4">
              {workspaces.length === 0 ? (
                <div className="p-8 bg-[#0D0D14]/20 border border-white/5 rounded-xl text-center space-y-2">
                  <span className="material-symbols-outlined text-on-surface-variant/30 text-3xl">folder_off</span>
                  <p className="text-xs text-on-surface-variant italic">No workspaces created yet.</p>
                </div>
              ) : (
                workspaces.map((ws) => {
                  const wsTasks = workspaceTasks.filter(t => t.workspaceId === ws.id);
                  const isExpanded = expandedWorkspaces[ws.id];
                  const wsColorClass = ws.colorTheme === 'primary' ? 'text-primary border-primary/20 bg-primary/5'
                                    : ws.colorTheme === 'secondary' ? 'text-secondary border-secondary/20 bg-secondary/5'
                                    : ws.colorTheme === 'tertiary' ? 'text-tertiary border-tertiary/20 bg-tertiary/5'
                                    : 'text-white border-white/10 bg-white/5';
                  
                  return (
                    <div key={ws.id} className="border border-white/5 rounded-xl bg-[#111118]/45 overflow-hidden">
                      <button 
                        onClick={() => toggleAccordion(ws.id)}
                        className="w-full p-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors text-left cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded border flex items-center justify-center ${wsColorClass}`}>
                            <span className="material-symbols-outlined text-base">{ws.icon || 'folder'}</span>
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-white">{ws.title}</h4>
                            <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider mt-0.5">{wsTasks.length} Tasks</p>
                          </div>
                        </div>
                        <span className={`material-symbols-outlined text-on-surface-variant transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`}>
                          chevron_right
                        </span>
                      </button>

                      {isExpanded && (
                        <div className="border-t border-white/5 p-4 space-y-2 bg-[#0D0D14]/20 animate-fade-in">
                          {wsTasks.length === 0 ? (
                            <p className="text-xs text-on-surface-variant italic p-2">No tasks in this workspace.</p>
                          ) : (
                            wsTasks.map(task => (
                              <div 
                                key={task.id}
                                className={`flex items-center justify-between p-3 rounded-lg border border-white/5 bg-[#111118] hover:border-primary/20 transition-all ${
                                  task.done ? 'opacity-40 border-white/5' : ''
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <div 
                                    onClick={() => toggleTask(task.id)}
                                    className={`w-4.5 h-4.5 rounded border flex items-center justify-center transition-all cursor-pointer ${
                                      task.done ? 'border-primary bg-primary' : 'border-white/20 hover:border-primary/50'
                                    }`}
                                  >
                                    {task.done && <span className="material-symbols-outlined text-white text-[10px] font-bold">check</span>}
                                  </div>
                                  <span className={`text-xs font-semibold ${task.done ? 'line-through text-on-surface-variant' : 'text-white'}`}>
                                    {task.text}
                                  </span>
                                </div>
                                <div className="flex items-center gap-3">
                                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${getPriorityColor(task.priority)}`}>
                                    {task.priority}
                                  </span>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </section>

        </div>
      </main>

      {/* ================= PERSONAL TASK ADD/EDIT MODAL ================= */}
      <Modal 
        isOpen={isTaskModalOpen} 
        onClose={() => setIsTaskModalOpen(false)} 
        title={editingTask ? 'Edit Personal Task' : 'Add Personal Task'}
      >
        <form onSubmit={handleTaskSubmit} className="space-y-5">
          <InputField
            id="task-text"
            label="Task Name"
            placeholder="e.g. Drink 3L Water"
            value={taskText}
            onChange={(e) => setTaskText(e.target.value)}
            required
          />

          {/* Color Selector (Task Classification Option) */}
          <div className="space-y-2">
            <label className="block text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">Task Category / Type</label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setTaskColorCategory('yellow')}
                className={`flex-1 py-3 px-4 rounded-lg font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                  taskColorCategory === 'yellow'
                    ? 'bg-yellow-500/10 border-yellow-500 text-yellow-400 shadow-[0_0_10px_rgba(234,180,8,0.15)]'
                    : 'bg-white/5 border-white/5 text-on-surface-variant hover:text-white hover:bg-white/10'
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-400"></span>
                Today (Yellow)
              </button>
              <button
                type="button"
                onClick={() => setTaskColorCategory('red')}
                className={`flex-1 py-3 px-4 rounded-lg font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                  taskColorCategory === 'red'
                    ? 'bg-red-500/10 border-red-500 text-red-400 shadow-[0_0_10px_rgba(239,68,68,0.15)]'
                    : 'bg-white/5 border-white/5 text-on-surface-variant hover:text-white hover:bg-white/10'
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                Overall (Red)
              </button>
            </div>
            <p className="text-[10px] text-on-surface-variant italic mt-1 leading-normal">
              {taskColorCategory === 'yellow' 
                ? '⚡ Yellow category sets task due date to today automatically (date & time inputs are hidden).'
                : '📅 Red category is for general/upcoming items and requires specifying a due date & time.'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">Priority</label>
              <select 
                value={taskPriority}
                onChange={(e) => setTaskPriority(e.target.value)}
                className="w-full bg-[#111118] border border-white/5 rounded-lg p-3 text-on-surface focus:outline-none focus:border-primary text-xs"
              >
                <option value="High">🔴 High Priority</option>
                <option value="Med">🟣 Medium Priority</option>
                <option value="Low">⚪ Low Priority</option>
              </select>
            </div>

            {/* Display recurring only for Yellow (Today's Tasks) */}
            {taskColorCategory === 'yellow' ? (
              <div className="space-y-2">
                <label className="block text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">Recurring</label>
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
            ) : (
              <div className="space-y-2">
                {/* Dummy visual space filler to align columns */}
              </div>
            )}
          </div>

          {/* Show date/time selectors only for Red (Overall Tasks) */}
          {taskColorCategory === 'red' && (
            <div className="space-y-4 border-t border-white/5 pt-4 animate-fade-in">
              <div className="grid grid-cols-2 gap-4">
                <InputField
                  id="task-due-date"
                  label="Due Date"
                  type="date"
                  value={taskDueDate}
                  onChange={(e) => setTaskDueDate(e.target.value)}
                  required
                />
                <InputField
                  id="task-due-time"
                  label="Due Time"
                  type="time"
                  value={taskDueTime}
                  onChange={(e) => setTaskDueTime(e.target.value)}
                />
              </div>

              <InputField
                id="task-reminder"
                label="Reminder Time (Optional)"
                type="time"
                value={taskReminder}
                onChange={(e) => setTaskReminder(e.target.value)}
                placeholder="Set alert time"
              />
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
            <Button variant="ghost" onClick={() => setIsTaskModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {editingTask ? 'Save Changes' : 'Create Task'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* ================= EXAM ADD/EDIT MODAL ================= */}
      <Modal 
        isOpen={isExamModalOpen} 
        onClose={() => setIsExamModalOpen(false)} 
        title={editingExam ? 'Edit Exam' : 'Track New Exam'}
      >
        <form onSubmit={handleExamSubmit} className="space-y-5">
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
          <InputField
            id="exam-date"
            label="Exam Date"
            type="date"
            value={examDate}
            onChange={(e) => setExamDate(e.target.value)}
            required
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
            <Button variant="ghost" onClick={() => setIsExamModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {editingExam ? 'Save Changes' : 'Track Exam'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* ================= ASSIGNMENT ADD/EDIT MODAL ================= */}
      <Modal 
        isOpen={isAssignModalOpen} 
        onClose={() => setIsAssignModalOpen(false)} 
        title={editingAssign ? 'Edit Assignment' : 'Add New Assignment'}
      >
        <form onSubmit={handleAssignSubmit} className="space-y-5">
          <InputField
            id="assign-name"
            label="Assignment Name"
            placeholder="e.g. DSA Assignment"
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
          <div className="grid grid-cols-2 gap-4">
            <InputField
              id="assign-due-date"
              label="Due Date"
              type="date"
              value={assignDueDate}
              onChange={(e) => setAssignDueDate(e.target.value)}
              required
            />
            <div className="space-y-2">
              <label className="block text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">Completion Percentage ({assignProgress}%)</label>
              <input 
                type="range"
                min="0"
                max="100"
                step="5"
                value={assignProgress}
                onChange={(e) => setAssignProgress(e.target.value)}
                className="w-full mt-3 h-1.5 bg-white/5 rounded-lg appearance-none cursor-pointer accent-tertiary"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
            <Button variant="ghost" onClick={() => setIsAssignModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {editingAssign ? 'Save Changes' : 'Track Assignment'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Tasks;
