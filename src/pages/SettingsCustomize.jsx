import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Button from '../components/Button';
import { TaskContext } from '../context/TaskContext';

const WIDGET_OPTIONS = [
  { key: 'streak', label: 'Streak', desc: 'Display consecutive focus days streak badge' },
  { key: 'tasksDone', label: 'Tasks Done', desc: 'Display total completed items metrics' },
  { key: 'workspaces', label: 'Workspaces', desc: 'Display grid of active workspaces cards' },
  { key: 'liveProjects', label: 'Projects', desc: 'Display workspace active progress indicators' },
  { key: 'xp', label: 'XP', desc: 'Display global rank experience metrics' },
  { key: 'focusTasks', label: 'Focus Tasks', desc: 'Display high-priority pinned tasks checklist' },
  { key: 'exams', label: 'Exams', desc: 'Display midterm/final exams dates alerts' },
  { key: 'assignments', label: 'Assignments', desc: 'Display academic assignments checklist' },
  { key: 'leaderboardRank', label: 'Leaderboards', desc: 'Display rank position card' },
  { key: 'activityHeatmap', label: 'Activity Heatmap', desc: 'Display contribution calendar activity heatmap' },
  { key: 'skillsProgress', label: 'Skills Progress', desc: 'Display overall growth indexes rings' }
];

const SettingsCustomize = () => {
  const navigate = useNavigate();
  const { userProfile, setUserProfile, workspaces } = useContext(TaskContext);

  const [widgets, setWidgets] = useState(userProfile.dashboardWidgets || {
    streak: true,
    tasksDone: true,
    workspaces: true,
    liveProjects: true,
    xp: true,
    focusTasks: true,
    exams: true,
    assignments: true,
    leaderboardRank: false,
    activityHeatmap: true,
    skillsProgress: true
  });

  const [widgetOrder, setWidgetOrder] = useState(() => {
    return userProfile.widgetOrder || WIDGET_OPTIONS.map(opt => opt.key);
  });

  const [dashboardLayout] = useState('balanced'); // fixed default, not user-configurable

  const [featuredWorkspaces, setFeaturedWorkspaces] = useState(userProfile.featuredWorkspaces || workspaces.map(w => w.id));

  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleToggleWidget = (key) => {
    setWidgets(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleMoveWidget = (index, direction) => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= widgetOrder.length) return;

    const list = [...widgetOrder];
    const temp = list[index];
    list[index] = list[newIndex];
    list[newIndex] = temp;
    setWidgetOrder(list);
  };

  const handleToggleWorkspaceVisibility = (id) => {
    if (featuredWorkspaces.includes(id)) {
      setFeaturedWorkspaces(featuredWorkspaces.filter(wsId => wsId !== id));
    } else {
      setFeaturedWorkspaces([...featuredWorkspaces, id]);
    }
  };

  const handleMoveWorkspace = (index, direction) => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= featuredWorkspaces.length) return;

    const list = [...featuredWorkspaces];
    const temp = list[index];
    list[index] = list[newIndex];
    list[newIndex] = temp;
    setFeaturedWorkspaces(list);
  };

  const handleSave = () => {
    setUserProfile(prev => ({
      ...prev,
      dashboardWidgets: widgets,
      widgetOrder: widgetOrder,
      dashboardLayout: dashboardLayout,
      featuredWorkspaces: featuredWorkspaces
    }));
    setSaveSuccess(true);
    setTimeout(() => { setSaveSuccess(false); navigate('/settings'); }, 1800);
  };

  return (
    <div className="flex min-h-screen bg-background text-on-surface radial-glow-bg select-none">
      <Sidebar />

      <main className="flex-1 flex flex-col h-screen overflow-y-auto no-scrollbar relative z-10">
        <Header hideSearch={true} hideStreak={true} hideLogo={true} />

        <div className="w-full px-8 pt-4 pb-8 space-y-8 max-w-4xl animate-page-transition">
          {/* Breadcrumbs */}
          <nav className="flex gap-2 items-center font-label-md text-xs font-bold uppercase tracking-wider text-on-surface-variant">
            <span className="hover:text-white transition-colors cursor-pointer" onClick={() => navigate('/settings')}>Settings</span>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            <span className="text-primary">Customize Dashboard</span>
          </nav>

          <div className="animate-text-reveal">
            <h2 className="font-display-lg text-[32px] text-white font-bold tracking-tight mb-2">
              Customize Dashboard
            </h2>
            <p className="text-on-surface-variant text-sm font-medium">
              Toggle card visibility, reorder widgets, and manage featured workspaces.
            </p>
          </div>

          {/* Save Success Banner */}
          {saveSuccess && (
            <div className="flex items-center gap-3 px-5 py-3.5 bg-emerald-500/10 border border-emerald-500/25 rounded-xl animate-fade-in">
              <span className="material-symbols-outlined text-emerald-400 text-base">check_circle</span>
              <p className="text-xs font-semibold text-emerald-400">Dashboard customization saved. Redirecting to Settings…</p>
            </div>
          )}

          {/* Widgets Config */}
          <section className="bg-[#111118] border border-white/5 p-6 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-white/5 pb-3">Dashboard Cards Visibility</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {WIDGET_OPTIONS.map((opt) => {
                const active = widgets[opt.key];
                return (
                  <div 
                    key={opt.key}
                    onClick={() => handleToggleWidget(opt.key)}
                    className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all duration-200 hover:border-primary/40 ${
                      active ? 'border-primary bg-primary-container/5' : 'border-white/5 bg-[#0D0D14]/20'
                    }`}
                  >
                    <div>
                      <h4 className="text-xs font-bold text-white">{opt.label}</h4>
                      <p className="text-[10px] text-on-surface-variant mt-0.5">{opt.desc}</p>
                    </div>
                    <div className={`w-4.5 h-4.5 rounded border flex items-center justify-center transition-all ${
                      active ? 'border-primary bg-primary' : 'border-white/20'
                    }`}>
                      {active && <span className="material-symbols-outlined text-[10px] text-white font-bold">check</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Widget Ordering */}
          <section className="bg-[#111118] border border-white/5 p-6 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-white/5 pb-3">Widget Display Order</h3>
            <p className="text-xs text-on-surface-variant font-medium">Reorder your active widgets on the dashboard page.</p>
            <div className="space-y-3 pt-2">
              {widgetOrder.map((key, index) => {
                const opt = WIDGET_OPTIONS.find(o => o.key === key);
                if (!opt) return null;
                const active = widgets[key];
                
                return (
                  <div 
                    key={key} 
                    className={`p-4 border rounded-xl flex items-center justify-between gap-4 transition-all duration-200 ${
                      active ? 'bg-[#0D0D14]/30 border-white/5' : 'opacity-40 bg-[#0D0D14]/10 border-white/2'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`material-symbols-outlined text-[18px] ${active ? 'text-primary' : 'text-on-surface-variant'}`}>
                        {key === 'streak' ? 'local_fire_department' : (key === 'tasksDone' ? 'task_alt' : (key === 'workspaces' ? 'layers' : (key === 'liveProjects' ? 'account_tree' : (key === 'xp' ? 'workspace_premium' : (key === 'focusTasks' ? 'star' : (key === 'exams' ? 'school' : (key === 'assignments' ? 'assignment' : (key === 'leaderboardRank' ? 'military_tech' : (key === 'activityHeatmap' ? 'calendar_today' : 'trending_up')))))))))}
                      </span>
                      <div>
                        <h4 className="text-xs font-bold text-white leading-none">
                          {opt.label} {!active && <span className="text-[9px] text-on-surface-variant/60 font-medium uppercase ml-1">(Hidden)</span>}
                        </h4>
                        <span className="text-[9px] text-on-surface-variant mt-1 block">{opt.desc}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button 
                        type="button"
                        disabled={index === 0}
                        onClick={() => handleMoveWidget(index, 'up')}
                        className="p-1 rounded bg-white/5 border border-white/5 text-on-surface-variant hover:text-white disabled:opacity-30 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-sm">arrow_upward</span>
                      </button>
                      <button 
                        type="button"
                        disabled={index === widgetOrder.length - 1}
                        onClick={() => handleMoveWidget(index, 'down')}
                        className="p-1 rounded bg-white/5 border border-white/5 text-on-surface-variant hover:text-white disabled:opacity-30 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-sm">arrow_downward</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Workspaces order & vis */}
          <section className="bg-[#111118] border border-white/5 p-6 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-white/5 pb-3">Featured Workspaces Display</h3>
            <p className="text-xs text-on-surface-variant font-medium">Define which workspaces appear on the dashboard page and in what order.</p>

            <div className="space-y-3 pt-2">
              {workspaces.map((ws) => {
                const isFeatured = featuredWorkspaces.includes(ws.id);
                const featuredIndex = featuredWorkspaces.indexOf(ws.id);
                
                return (
                  <div key={ws.id} className="p-4 bg-[#0D0D14]/30 border border-white/5 rounded-xl flex items-center justify-between gap-4 group">
                    <div className="flex items-center gap-3">
                      <div 
                        onClick={() => handleToggleWorkspaceVisibility(ws.id)}
                        className={`w-4 h-4 rounded border flex items-center justify-center cursor-pointer transition-all ${
                          isFeatured ? 'border-primary bg-primary' : 'border-white/20'
                        }`}
                      >
                        {isFeatured && <span className="material-symbols-outlined text-[10px] text-white font-bold">check</span>}
                      </div>
                      <span className="material-symbols-outlined text-on-surface-variant">{ws.icon || 'folder'}</span>
                      <div>
                        <h4 className="text-xs font-bold text-white leading-none">{ws.title}</h4>
                        <span className="text-[9px] uppercase tracking-wider text-on-surface-variant font-bold block mt-1">{ws.category}</span>
                      </div>
                    </div>

                    {isFeatured && (
                      <div className="flex items-center gap-1.5">
                        <button 
                          disabled={featuredIndex <= 0}
                          onClick={() => handleMoveWorkspace(featuredIndex, 'up')}
                          className="p-1 rounded bg-white/5 border border-white/5 text-on-surface-variant hover:text-white disabled:opacity-30 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-sm">arrow_upward</span>
                        </button>
                        <button 
                          disabled={featuredIndex === -1 || featuredIndex >= featuredWorkspaces.length - 1}
                          onClick={() => handleMoveWorkspace(featuredIndex, 'down')}
                          className="p-1 rounded bg-white/5 border border-white/5 text-on-surface-variant hover:text-white disabled:opacity-30 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-sm">arrow_downward</span>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* Action buttons */}
          <div className="flex justify-end gap-3.5 border-t border-white/5 pt-6">
            <Button variant="ghost" onClick={() => navigate('/dashboard')}>Cancel</Button>
            <Button variant="primary" icon="save" onClick={handleSave}>Save Customization</Button>
          </div>

        </div>
      </main>
    </div>
  );
};

export default SettingsCustomize;
