import React, { useState, useContext, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import StatsCard from '../components/StatsCard';
import ProgressRing from '../components/ProgressRing';
import Button from '../components/Button';
import { TaskContext } from '../context/TaskContext';
import { DashboardSkeleton } from '../components/Skeleton';
import EmptyState from '../components/EmptyState';

const BADGE_DESCRIPTIONS = {
  '🥇': 'Rank #1: Top performer on the global boards.',
  '🥈': 'Rank #2: Second-highest overall XP index.',
  '🥉': 'Rank #3: Third position milestone holder.',
  '🔥': 'Focus Streak: Active daily commitment badge.',
  '💎': 'Platinum: Fulfill over 25,000 focus XP nodes.',
  '💠': 'Diamond: Fulfill over 50,000 focus XP nodes.',
  '📚': 'Completed HTML: Mastered semantic tags and SEO basics.',
  '🚀': 'First Project: Launched your initial workspace module.',
  '💻': 'First 100 Tasks: Completed 100 items on the lists.',
  '🎯': 'Goal Completed: Accomplished primary targets.'
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { tasks, toggleTask, workspaces, userProfile, exams, assignments, toggleAssignment, loading } = useContext(TaskContext);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading) {
      setIsLoading(false);
    }
  }, [loading]);

  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  const oneWeekAgo = new Date(Date.now() - 86400000 * 7).toISOString();
  
  const personalTasks = tasks.filter(t => t.workspaceId === null);
  
  const completedToday = personalTasks.filter(t => t.done && t.completedAt && t.completedAt.startsWith(today)).length;
  const completedYesterday = personalTasks.filter(t => t.done && t.completedAt && t.completedAt.startsWith(yesterday)).length;
  const completedThisWeek = personalTasks.filter(t => t.done && t.completedAt && t.completedAt >= oneWeekAgo).length;
  
  const diffFromYesterday = completedToday - completedYesterday;
  const diffText = diffFromYesterday >= 0 ? `+${diffFromYesterday} from yesterday` : `${diffFromYesterday} from yesterday`;

  const displayName = userProfile?.fullName ? userProfile.fullName.split(' ')[0] : 'User';

  // Customize Dashboard configurations
  const widgets = userProfile.dashboardWidgets || {
    streak: true,
    tasksDone: true,
    workspaces: true,
    liveProjects: true,
    xp: true,
    focusTasks: true,
    exams: true,
    assignments: true,
    leaderboardRank: true,
    activityHeatmap: true,
    skillsProgress: true
  };

  const widgetOrder = userProfile.widgetOrder || [
    'streak', 'tasksDone', 'workspaces', 'liveProjects', 'xp', 'focusTasks', 'exams', 'assignments', 'leaderboardRank', 'activityHeatmap', 'skillsProgress'
  ];

  const dashboardLayout = userProfile.dashboardLayout || 'balanced';

  const featuredWorkspacesOrder = useMemo(() => {
    return userProfile?.featuredWorkspaces || [];
  }, [userProfile?.featuredWorkspaces]);

  // Filter workspaces by visibility and sort by order
  const dashboardWorkspaces = useMemo(() => {
    return workspaces
      .filter(ws => featuredWorkspacesOrder.includes(ws.id))
      .sort((a, b) => {
        return featuredWorkspacesOrder.indexOf(a.id) - featuredWorkspacesOrder.indexOf(b.id);
      });
  }, [workspaces, featuredWorkspacesOrder]);

  // Calculate Urgent Items (active database items that are upcoming within 7 days)
  const getUrgentItems = useMemo(() => {
    const list = [];
    
    const now = new Date();
    exams.forEach(ex => {
      const examDate = new Date(ex.date + 'T00:00:00');
      const diffTime = examDate.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays >= 0 && diffDays <= 7) {
        list.push({
          id: ex.id,
          type: 'Exam',
          title: ex.name,
          dueText: diffDays === 0 ? 'Due today' : (diffDays === 1 ? 'Due tomorrow' : `Due in ${diffDays} days`),
          diffTime: diffTime,
          symbol: '⚠️'
        });
      }
    });

    assignments.forEach(ass => {
      if (ass.done) return;
      const assDate = new Date(ass.dueDate + 'T23:59:59');
      const diffTime = assDate.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays >= 0 && diffDays <= 7) {
        list.push({
          id: ass.id,
          type: 'Assignment',
          title: ass.title,
          dueText: diffDays === 0 ? 'Due today' : (diffDays === 1 ? 'Due tomorrow' : `Due in ${diffDays} days`),
          diffTime: diffTime,
          symbol: '⚠️'
        });
      }
    });

    return list.sort((a, b) => a.diffTime - b.diffTime);
  }, [exams, assignments]);

  // Heatmap Cells Generation (53 columns * 7 rows = 371 cells)
  const heatmapData = useMemo(() => {
    const list = [];
    const now = new Date();
    // Start from 53 weeks ago, aligned to Sunday
    const startDate = new Date(now.getTime() - 86400000 * 370);
    const startDayOfWeek = startDate.getDay();
    const adjustedStartDate = new Date(startDate.getTime() - 86400000 * startDayOfWeek);

    const activityHistory = userProfile.activityHistory || {};

    for (let i = 0; i < 371; i++) {
      const date = new Date(adjustedStartDate.getTime() + 86400000 * i);
      const isFuture = date > now;
      
      const dateTooltipStr = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
      const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const yyyymmdd = `${year}-${month}-${day}`;

      const activityCount = activityHistory[yyyymmdd] || 0;
      const tasksVal = activityCount;
      const hoursVal = activityCount * 1.5; // Assume 1.5 study hours per activity
      const xpVal = activityCount * 15;

      let colorShade = 'bg-white/5';
      if (!isFuture && xpVal > 0) {
        if (xpVal <= 15) colorShade = 'bg-primary/20';
        else if (xpVal <= 30) colorShade = 'bg-primary/40';
        else if (xpVal <= 45) colorShade = 'bg-primary/60';
        else colorShade = 'bg-primary shadow-[0_0_8px_rgba(139,92,246,0.3)]';
      }

      list.push({
        date: dateTooltipStr,
        dateStr: dateStr,
        tasks: tasksVal,
        hours: hoursVal,
        xp: xpVal,
        colorClass: colorShade,
        isFuture
      });
    }
    return list;
  }, [userProfile.activityHistory]);

  // Split cells into columns of 7
  const heatmapCols = useMemo(() => {
    const cols = [];
    for (let i = 0; i < heatmapData.length; i += 7) {
      cols.push(heatmapData.slice(i, i + 7));
    }
    return cols;
  }, [heatmapData]);

  // Hovered Cell Tooltip state
  const [hoveredCell, setHoveredCell] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const handleCellMouseEnter = (e, cell) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPos({
      x: rect.left + window.scrollX + rect.width / 2,
      y: rect.top + window.scrollY - 110
    });
    setHoveredCell(cell);
  };

  // --- Weekly Summary Stats ---
  const oneWeekAgoDate = new Date(Date.now() - 86400000 * 7);
  const weeklySummary = useMemo(() => {
    const tasksThisWeek = tasks.filter(t => t.done && t.completedAt && new Date(t.completedAt) >= oneWeekAgoDate).length;
    const workspacesActive = workspaces.filter(ws => ws.progress > 0).length;
    const studySessions = tasks.filter(t => t.done && t.completedAt && new Date(t.completedAt) >= oneWeekAgoDate).length;
    const xpEarned = tasksThisWeek * 15;
    const goalsCompleted = userProfile?.goals ? Math.min(Math.floor(tasksThisWeek / 5), userProfile.goals.length) : 0;
    return { tasksThisWeek, workspacesActive, studySessions, xpEarned, goalsCompleted };
  }, [tasks, workspaces, userProfile.goals]);

  const hasActiveStatsWidgets = widgets.streak || widgets.tasksDone || widgets.workspaces || widgets.liveProjects;

  const largeWidgetKeys = ['workspaces', 'focusTasks', 'exams', 'assignments', 'leaderboardRank', 'skillsProgress'];
  const activeLargeWidgets = widgetOrder.filter(key => largeWidgetKeys.includes(key) && widgets[key]);

  const getWidgetColSpan = (key) => {
    if (dashboardLayout === 'focused') return 'col-span-12';
    if (dashboardLayout === 'balanced') {
      return key === 'skillsProgress' ? 'col-span-12' : 'col-span-12 lg:col-span-6';
    }
    // Bento (3 Columns)
    if (key === 'skillsProgress') return 'col-span-12';
    if (key === 'workspaces') return 'col-span-12 lg:col-span-8';
    return 'col-span-12 md:col-span-6 lg:col-span-4';
  };

  const renderLargeWidget = (key) => {
    switch (key) {
      case 'workspaces':
        return (
          <section key="workspaces" className="bg-[#111118]/60 border border-white/[0.04] backdrop-blur-xl p-8 rounded-2xl space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-display-lg text-xs font-black tracking-[0.2em] uppercase text-on-surface-variant">
                Featured Workspaces
              </h3>
              <button 
                onClick={() => navigate('/workspaces')}
                className="text-primary text-xs font-bold hover:underline font-label-md tracking-wider uppercase cursor-pointer bg-transparent border-0"
              >
                View All
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {dashboardWorkspaces.length === 0 ? (
                <div className="col-span-2 p-8 bg-[#0D0D14]/20 border border-white/5 rounded-xl text-center space-y-2.5">
                  <p className="text-xs text-on-surface-variant italic">No featured workspaces yet.</p>
                  <button 
                    onClick={() => navigate('/workspaces')}
                    className="text-[10px] font-bold text-white uppercase tracking-widest bg-primary/20 hover:bg-primary/30 border border-primary/30 px-3.5 py-2 rounded transition-all cursor-pointer inline-block"
                  >
                    Create your first workspace
                  </button>
                </div>
              ) : (
                dashboardWorkspaces.map(ws => (
                  <div 
                    key={ws.id} 
                    onClick={() => navigate(`/workspaces/${ws.id}`)}
                    className="p-6 bg-[#0D0D14]/30 border border-white/5 rounded-xl hover:border-primary/20 transition-all duration-300 cursor-pointer group flex flex-col justify-between h-44 animate-fade-in"
                  >
                    <div className="flex justify-between items-start">
                      <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-[18px]">{ws.icon || 'folder'}</span>
                      </div>
                      <span className="text-[9px] font-bold px-2.5 py-0.5 bg-primary/15 text-primary rounded-full uppercase tracking-wider">{ws.category}</span>
                    </div>

                    <div className="mt-4 flex-grow">
                      <h4 className="text-sm font-bold text-white group-hover:text-primary transition-colors line-clamp-1">{ws.title}</h4>
                      <p className="text-[11px] text-on-surface-variant mt-1.5 line-clamp-2 leading-relaxed">{ws.description}</p>
                    </div>

                    <div className="mt-4 pt-2 border-t border-white/2">
                      <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-primary shadow-[0_0_8px_rgba(139,92,246,0.3)]" style={{ width: `${ws.progress}%` }} />
                      </div>
                      <div className="flex justify-between items-center mt-2 text-[9px] text-on-surface-variant font-bold uppercase tracking-wider">
                        <span>Progress</span>
                        <span className="text-white">{ws.progress}%</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        );

      case 'focusTasks':
        return (
          <section key="focusTasks" className="bg-[#111118]/60 border border-white/[0.04] backdrop-blur-xl p-8 rounded-2xl flex flex-col min-h-[300px]">
            <div className="flex justify-between items-center border-b border-white/5 pb-4 mb-4">
              <h3 className="font-display-lg text-xs font-black tracking-[0.2em] uppercase text-on-surface-variant">
                Focus Tasks
              </h3>
              <span className="text-[9px] font-bold px-2.5 py-0.5 bg-primary/10 text-primary rounded-full uppercase tracking-wider">
                Pinned
              </span>
            </div>
            
            <div className="space-y-4 overflow-y-auto pr-2 no-scrollbar max-h-72">
              {tasks.filter(t => t.workspaceId === null && t.isPinned).slice(0, 6).length === 0 ? (
                <div className="h-28 flex flex-col items-center justify-center text-center p-4">
                  <span className="material-symbols-outlined text-on-surface-variant/30 text-3xl mb-2">star_border</span>
                  <p className="text-xs text-on-surface-variant italic text-center leading-normal">No focus tasks pinned. Pin tasks from the Tasks section.</p>
                </div>
              ) : (
                tasks.filter(t => t.workspaceId === null && t.isPinned).slice(0, 6).map(task => (
                  <div key={task.id} className="flex items-center gap-3.5">
                    <div className={`w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center ${
                      task.done ? 'border-primary bg-primary' : 'border-white/15'
                    }`}>
                      {task.done && <span className="material-symbols-outlined text-white text-[10px] font-bold">check</span>}
                    </div>
                    <span className={`text-xs font-semibold truncate ${
                      task.done ? 'line-through text-on-surface-variant' : 'text-on-surface'
                    }`}>
                      {task.text}
                    </span>
                    {task.priority === 'High' && !task.done && (
                      <span className="ml-auto text-[8px] font-black uppercase tracking-widest text-red-400 shrink-0">High</span>
                    )}
                  </div>
                ))
              )}
            </div>
          </section>
        );

      case 'exams':
        return (
          <section key="exams" className="bg-[#111118]/60 border border-white/[0.04] backdrop-blur-xl p-8 rounded-2xl space-y-4 min-h-[300px]">
            <div className="flex justify-between items-center border-b border-white/5 pb-4">
              <h3 className="font-display-lg text-xs font-black tracking-[0.2em] uppercase text-on-surface-variant">Upcoming Exams</h3>
              <span className="text-[9px] font-bold px-2.5 py-0.5 bg-secondary/10 text-secondary rounded-full uppercase tracking-wider">Midterms</span>
            </div>
            <div className="space-y-3.5 overflow-y-auto pr-2 no-scrollbar max-h-56">
              {exams.length === 0 ? (
                <div className="h-28 flex flex-col items-center justify-center text-center p-4">
                  <span className="material-symbols-outlined text-on-surface-variant/30 text-3xl mb-2">school</span>
                  <p className="text-xs text-on-surface-variant italic">No upcoming exams scheduled.</p>
                </div>
              ) : (
                exams.map(exam => (
                  <div key={exam.id} className="p-4 bg-[#0D0D14]/30 border border-white/5 rounded-xl flex flex-col gap-2">
                    <div className="flex justify-between items-start">
                      <h4 className="text-xs font-bold text-white line-clamp-1">{exam.name}</h4>
                      <span className="text-[9px] font-bold px-2 py-0.5 bg-secondary/15 text-secondary rounded uppercase tracking-wider shrink-0">{exam.subject}</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-on-surface-variant font-medium mt-1">
                      <span>Date: {new Date(exam.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      <span>Prep Progress: {exam.prepProgress}%</span>
                    </div>
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden mt-0.5">
                      <div className="h-full bg-secondary shadow-[0_0_8px_rgba(99,102,241,0.3)]" style={{ width: `${exam.prepProgress}%` }} />
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        );

      case 'assignments':
        return (
          <section key="assignments" className="bg-[#111118]/60 border border-white/[0.04] backdrop-blur-xl p-8 rounded-2xl space-y-4 min-h-[300px]">
            <div className="flex justify-between items-center border-b border-white/5 pb-4">
              <h3 className="font-display-lg text-xs font-black tracking-[0.2em] uppercase text-on-surface-variant">Assignments</h3>
              <span className="text-[9px] font-bold px-2.5 py-0.5 bg-tertiary/10 text-tertiary rounded-full uppercase tracking-wider">Due Soon</span>
            </div>
            <div className="space-y-2.5 overflow-y-auto pr-2 no-scrollbar max-h-56">
              {assignments.length === 0 ? (
                <div className="h-28 flex flex-col items-center justify-center text-center p-4">
                  <span className="material-symbols-outlined text-on-surface-variant/30 text-3xl mb-2">assignment</span>
                  <p className="text-xs text-on-surface-variant italic">No assignments pending.</p>
                </div>
              ) : (
                assignments.map(ass => {
                  const isSubmitted = ass.status === 'Submitted' || ass.done;
                  const dueDate = new Date(ass.dueDate);
                  const diffDays = Math.ceil((dueDate - new Date()) / 86400000);
                  const urgency = diffDays <= 1 ? 'text-red-400 bg-red-500/10 border-red-500/20' 
                                : diffDays <= 3 ? 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                                : 'text-tertiary bg-tertiary/10 border-tertiary/20';
                  return (
                    <div key={ass.id} className="p-3.5 bg-[#0D0D14]/30 border border-white/5 rounded-xl flex items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <span className={`text-xs font-semibold block truncate ${isSubmitted ? 'line-through text-on-surface-variant' : 'text-white'}`}>
                          {ass.title || ass.name}
                        </span>
                        <span className="text-[9px] text-on-surface-variant uppercase tracking-wider font-bold mt-1 block">
                          {ass.subject} · Due {dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded border shrink-0 ${
                        isSubmitted ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : urgency
                      }`}>
                        {isSubmitted ? 'Done' : diffDays <= 0 ? 'Overdue' : diffDays === 1 ? 'Tomorrow' : `${diffDays}d left`}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </section>
        );

      case 'leaderboardRank':
        return (
          <section key="leaderboardRank" className="bg-[#111118]/60 border border-white/[0.04] backdrop-blur-xl p-8 rounded-2xl space-y-6">
            <h3 className="font-display-lg text-xs font-black tracking-[0.2em] uppercase text-on-surface-variant border-b border-white/5 pb-3">
              Achievements Showcase
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-4">
              {(!userProfile.badges || userProfile.badges.length === 0) ? (
                <div className="col-span-6 p-8 bg-[#0D0D14]/20 border border-white/5 rounded-xl text-center">
                  <p className="text-xs text-on-surface-variant italic">No achievements unlocked yet. Start completing tasks to earn badges!</p>
                </div>
              ) : (
                userProfile.badges.map((badgeIcon, index) => (
                  <div 
                    key={index} 
                    className="bg-[#0D0D14]/30 border border-white/5 p-4 rounded-xl flex flex-col items-center justify-center gap-2 group cursor-help transition-all duration-300 hover:border-primary/20 animate-fade-in"
                    title={BADGE_DESCRIPTIONS[badgeIcon]}
                  >
                    <span className="text-3xl animate-pulse">{badgeIcon}</span>
                    <span className="text-[9px] font-bold text-center text-white truncate w-full mt-1">
                      {badgeIcon === '🥇' ? 'Rank #1' : (badgeIcon === '🔥' ? 'Focus streak' : (badgeIcon === '💎' ? 'Platinum' : (badgeIcon === '📚' ? 'HTML Done' : (badgeIcon === '🚀' ? 'First Project' : 'Goal Unlocked'))))}
                    </span>
                  </div>
                ))
              )}
            </div>
          </section>
        );

      case 'activityHeatmap':
        return (
          <section key="activityHeatmap" className="bg-[#111118]/60 border border-white/[0.04] backdrop-blur-xl p-8 rounded-2xl space-y-6">
            <div className="flex justify-between items-center border-b border-white/5 pb-3">
              <div>
                <h3 className="font-display-lg text-xs font-black tracking-[0.2em] uppercase text-on-surface-variant">
                  Commitment Heatmap
                </h3>
                <p className="text-on-surface-variant text-[11px] mt-1 font-medium">Daily commitment heatmap logs, tasks resolved, and XP increments</p>
              </div>
              
              <div className="flex justify-end items-center gap-1.5 text-[9px] text-on-surface-variant uppercase tracking-widest font-black">
                <span>Less</span>
                <div className="w-2.5 h-2.5 rounded-[2px] bg-white/5"></div>
                <div className="w-2.5 h-2.5 rounded-[2px] bg-primary/20"></div>
                <div className="w-2.5 h-2.5 rounded-[2px] bg-primary/40"></div>
                <div className="w-2.5 h-2.5 rounded-[2px] bg-primary/60"></div>
                <div className="w-2.5 h-2.5 rounded-[2px] bg-primary shadow-[0_0_8px_rgba(139,92,246,0.4)]"></div>
                <span>More</span>
              </div>
            </div>

            {/* Heatmap Grid Container */}
            <div className="overflow-x-auto no-scrollbar relative w-full pt-2">
              <div className="flex flex-col gap-1 min-w-[800px]">
                
                {/* Month Labels Row */}
                <div className="flex text-[9px] text-on-surface-variant/60 font-bold uppercase tracking-wider mb-2">
                  <div className="w-8 pr-2" /> {/* alignment spacer */}
                  <div className="flex flex-1 justify-between select-none relative h-4">
                    {heatmapCols.map((col, colIdx) => {
                      const dateObj = new Date(col[0].dateStr);
                      const prevCol = heatmapCols[colIdx - 1];
                      const prevDateObj = prevCol ? new Date(prevCol[0].dateStr) : null;
                      const isMonthStart = !prevDateObj || dateObj.getMonth() !== prevDateObj.getMonth();
                      
                      return (
                        <div key={colIdx} className="w-3.5 relative">
                          {isMonthStart && (
                            <span className="absolute left-0 top-0 whitespace-nowrap text-[9px] font-bold text-on-surface-variant/80">
                              {dateObj.toLocaleString('en-US', { month: 'short' })}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Heatmap Grid Layout with Row Labels */}
                <div className="flex gap-2">
                  {/* Weekday Labels Column */}
                  <div className="flex flex-col justify-between text-[9px] text-on-surface-variant/60 font-bold uppercase w-8 h-[106px] pr-2 select-none py-0.5 text-right">
                    <span>Sun</span>
                    <span>Mon</span>
                    <span>Tue</span>
                    <span>Wed</span>
                    <span>Thu</span>
                    <span>Fri</span>
                    <span>Sat</span>
                  </div>

                  {/* Grid of Cells */}
                  <div className="flex gap-1.5 flex-1 justify-between h-[106px]">
                    {heatmapCols.map((col, colIdx) => (
                      <div key={colIdx} className="flex flex-col gap-1.5">
                        {col.map((cell, rowIdx) => (
                          <div 
                            key={rowIdx} 
                            onMouseEnter={(e) => handleCellMouseEnter(e, cell)}
                            onMouseLeave={() => setHoveredCell(null)}
                            className={`w-3.5 h-3.5 rounded-[2px] ${cell.colorClass} hover:scale-125 transition-transform duration-150 cursor-pointer`}
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </section>
        );

      case 'skillsProgress':
        const totalFocus = tasks.filter(t => t.isPinned).length;
        const doneFocus = tasks.filter(t => t.isPinned && t.done).length;
        const learningIndex = tasks.length > 0 ? Math.round((tasks.filter(t => t.done).length / tasks.length) * 100) : 0;
        const projectsIndex = workspaces.length > 0 ? Math.round((workspaces.filter(w => w.progress === 100).length / workspaces.length) * 100) : 0;
        const goalsIndex = totalFocus > 0 ? Math.round((doneFocus / totalFocus) * 100) : 0;
        const overallGrowth = Math.round((learningIndex + projectsIndex + goalsIndex) / 3);

        return (
          <section key="skillsProgress" className="bg-[#111118]/60 border border-white/[0.04] backdrop-blur-xl p-8 rounded-2xl space-y-6">
            <h3 className="font-display-lg text-xs font-black tracking-[0.2em] uppercase text-on-surface-variant border-b border-white/5 pb-3">
              Growth Indexes &amp; Progress Rings
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 py-2">
              {widgets.xp && <ProgressRing percentage={learningIndex} label="Learning Index" color="text-primary" />}
              {widgets.liveProjects && <ProgressRing percentage={projectsIndex} label="Projects Index" color="text-secondary" />}
              {widgets.assignments && <ProgressRing percentage={goalsIndex} label="Goals Index" color="text-tertiary" />}
              {widgets.skillsProgress && <ProgressRing percentage={overallGrowth} label="Overall Growth" color="text-white" />}
            </div>
          </section>
        );

      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-background text-on-surface radial-glow-bg select-none">
        <Sidebar />
        <main className="flex-1 flex flex-col h-screen overflow-y-auto no-scrollbar relative z-10">
          <Header />
          <div className="w-full px-12 py-10">
            <DashboardSkeleton />
          </div>
        </main>
      </div>
    );
  }

  const hasNoData = tasks.length === 0 && workspaces.length === 0 && exams.length === 0 && assignments.length === 0;

  if (hasNoData) {
    return (
      <div className="flex min-h-screen bg-background text-on-surface radial-glow-bg select-none">
        <Sidebar />

        <main className="flex-1 flex flex-col h-screen overflow-y-auto no-scrollbar relative z-10">
          <Header />

          <div className="flex-grow flex items-center justify-center p-12">
            <EmptyState 
              icon="dashboard" 
              title="No data yet" 
              description="Get started by creating your first workspace or adding some tasks." 
              actionLabel="Create Workspace"
              onAction={() => navigate('/workspaces')}
            />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background text-on-surface radial-glow-bg select-none">
      <Sidebar />

      <main className="flex-1 flex flex-col h-screen overflow-y-auto no-scrollbar relative z-10">
        <Header />

        <div className="w-full px-12 py-10 animate-page-transition space-y-12">
          {/* Welcome Row */}
          <section className="flex flex-col md:flex-row md:items-center justify-between gap-6 animate-text-reveal">
            <div className="space-y-2">
              <h2 className="font-display-lg text-[42px] font-black tracking-tight text-white leading-none">
                {displayName} 👋
              </h2>
              <p className="text-on-surface-variant text-sm font-medium">
                {(userProfile.streak || 0) > 0 ? (
                  <>
                    You've maintained your focus momentum for <span className="text-white font-semibold">{userProfile.streak} day{(userProfile.streak || 0) > 1 ? 's' : ''}</span>. You are in the <span className="text-primary font-semibold">top 2%</span> of performers this week.
                  </>
                ) : (
                  <>
                    Start a daily action to begin your streak! You are currently <span className="text-primary font-semibold">unranked</span>.
                  </>
                )}
              </p>
            </div>
          </section>

          {/* This Week Summary */}
          <section className="bg-[#111118]/60 border border-white/[0.04] backdrop-blur-xl rounded-2xl px-8 py-6 animate-fade-in">
            <div className="flex items-center gap-2 mb-5">
              <span className="material-symbols-outlined text-primary text-base">calendar_view_week</span>
              <h3 className="font-display-lg text-xs font-black tracking-[0.2em] uppercase text-on-surface-variant">This Week</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
              {[
                { icon: 'task_alt', label: 'Tasks completed', value: weeklySummary.tasksThisWeek, color: 'text-primary', suffix: '' },
                { icon: 'self_improvement', label: 'Study sessions', value: weeklySummary.studySessions, color: 'text-secondary', suffix: '' },
                { icon: 'bolt', label: 'XP gained', value: weeklySummary.xpEarned, color: 'text-tertiary', suffix: '', prefix: '+' },
                { icon: 'emoji_events', label: 'Goals completed', value: weeklySummary.goalsCompleted, color: 'text-yellow-400', suffix: '' },
                { icon: 'layers', label: 'Workspaces', value: weeklySummary.workspacesActive, color: 'text-emerald-400', suffix: ' active' },
              ].map((stat, i) => (
                <div key={i} className="flex flex-col items-center justify-center p-4 bg-[#0D0D14]/30 border border-white/5 rounded-xl gap-1.5 hover:border-white/10 transition-colors">
                  <span className={`material-symbols-outlined ${stat.color} text-lg`}>{stat.icon}</span>
                  <span className={`text-2xl font-black text-white tracking-tight`}>
                    {stat.prefix || ''}{stat.value}{stat.suffix}
                  </span>
                  <span className="text-[9px] uppercase tracking-widest font-bold text-on-surface-variant/70 text-center leading-tight">{stat.label}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Stats Cards Row */}
          {hasActiveStatsWidgets && (
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
              {widgets.streak && (
                <StatsCard title="Current Streak" value={(userProfile.streak || 0).toString()} unit="Days" icon="local_fire_department" progress={Math.min((userProfile.streak || 0) * 10, 100)} />
              )}
              {widgets.tasksDone && (
                <StatsCard title="Tasks Done" value={completedToday} unit="Completed" icon="task_alt" subtext={`${diffText} · ${completedThisWeek} this week`} />
              )}
              {widgets.workspaces && (
                <StatsCard title="Workspaces" value={workspaces.length.toString()} unit="Active" icon="layers" subtext="Custom project boards" />
              )}
              {widgets.liveProjects && (
                <StatsCard title="Live Projects" value={workspaces.filter(w => w.progress > 0 && w.progress < 100).length.toString()} unit="Ongoing" icon="account_tree" subtext="Active learning boards" />
              )}
            </section>
          )}

          {/* 🚨 Important & Urgent Section (Preview only, placed in the middle of dashboard) */}
          <section className="bg-[#111118]/60 border border-white/[0.04] backdrop-blur-xl p-8 rounded-2xl space-y-6">
            <div className="flex items-center gap-2.5">
              <span className="text-lg">🚨</span>
              <h3 className="font-display-lg text-xs font-black tracking-[0.2em] uppercase text-on-surface-variant">
                Important &amp; Urgent
              </h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {getUrgentItems.length === 0 ? (
                <div className="col-span-3 p-6 bg-[#0D0D14]/20 border border-white/5 rounded-xl text-center">
                  <p className="text-xs text-on-surface-variant italic">All caught up! No urgent objectives due soon.</p>
                </div>
              ) : (
                getUrgentItems.slice(0, 3).map((item, idx) => (
                  <div 
                    key={idx} 
                    className="p-6 bg-[#0D0D14]/40 border border-red-500/10 rounded-xl hover:border-red-500/25 transition-all duration-300 flex flex-col justify-between min-h-[110px] relative overflow-hidden group"
                  >
                    <div className="absolute right-0 top-0 bottom-0 w-1 bg-red-500/20 group-hover:bg-red-500/40 transition-colors" />
                    <div>
                      <h4 className="text-xs font-bold text-white flex items-center gap-2 leading-tight">
                        <span className="text-red-400">{item.symbol}</span>
                        <span className="truncate">{item.title}</span>
                      </h4>
                      <p className="text-[9px] uppercase tracking-wider text-on-surface-variant font-bold mt-2">
                        {item.type}
                      </p>
                    </div>
                    <div className="mt-4 text-[10px] font-bold text-red-400 uppercase tracking-widest leading-none">
                      {item.dueText}
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Dynamic Grid Layout for Large Widgets */}
          <div className="grid grid-cols-12 gap-8">
            {activeLargeWidgets.map(key => (
              <div key={key} className={getWidgetColSpan(key)}>
                {renderLargeWidget(key)}
              </div>
            ))}
          </div>

          {/* Contribution Heatmap - Always visible at the bottom of the page */}
          {widgets.activityHeatmap !== false && renderLargeWidget('activityHeatmap')}

        </div>

        {/* Floating Tooltip Component */}
        {hoveredCell && (
          <div 
            style={{ 
              position: 'absolute', 
              left: `${tooltipPos.x}px`, 
              top: `${tooltipPos.y}px`,
              transform: 'translateX(-50%)'
            }}
            className="bg-[#111118] border border-white/10 p-3.5 rounded-xl text-[10px] w-44 shadow-2xl z-[90] pointer-events-none backdrop-blur-xl animate-fade-in text-left font-semibold text-on-surface-variant"
          >
            <p className="font-bold text-white mb-2 border-b border-white/5 pb-1">{hoveredCell.date}</p>
            <p className="flex justify-between items-center mt-1">
              <span>Tasks completed:</span>
              <span className="text-white font-bold">{hoveredCell.tasks}</span>
            </p>
            <p className="flex justify-between items-center mt-1 text-primary">
              <span>XP earned:</span>
              <span className="font-bold">+{hoveredCell.xp}</span>
            </p>
            <p className="flex justify-between items-center mt-1">
              <span>Study hours:</span>
              <span className="text-white font-bold">{hoveredCell.hours} hrs</span>
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
