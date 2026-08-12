import React, { useState, useContext, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { TaskContext } from '../context/TaskContext';
import MasterOSBrandLogo from './MasterOSBrandLogo';

const Header = ({ hideSearch = false, hideStreak = false, hideLogo = false, hideNotifications = false, workspaceTitle = '' }) => {
  const navigate = useNavigate();
  const {
    getNotifications,
    userProfile,
    workspaces,
    collaboratedWorkspaces,
    tasks,
    exams,
    assignments
  } = useContext(TaskContext);

  const alerts = getNotifications();

  // ── Global Search State ───────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const searchContainerRef = useRef(null);

  const handleHamburgerClick = () => {
    window.dispatchEvent(new CustomEvent('open-mobile-sidebar'));
  };

  // Debounce search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setDebouncedQuery('');
      setIsSearching(false);
      return;
    }
    setIsSearching(true);
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery.trim());
      setIsSearching(false);
    }, 150);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Click outside to close search dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Compute Search Results across user-accessible resources
  const searchResults = useMemo(() => {
    const q = debouncedQuery.toLowerCase();
    if (!q || q.length < 2) return [];

    const results = [];

    // 1. Workspaces (owned + collaborated)
    const allWs = [...(workspaces || []), ...(collaboratedWorkspaces || [])];
    const seenWsIds = new Set();

    allWs.forEach((ws) => {
      if (!ws || !ws.id || seenWsIds.has(ws.id)) return;
      seenWsIds.add(ws.id);

      const titleMatch = ws.title?.toLowerCase().includes(q);
      const descMatch = ws.description?.toLowerCase().includes(q);
      const catMatch = ws.category?.toLowerCase().includes(q);
      const tagMatch = ws.tag?.toLowerCase().includes(q);

      if (titleMatch || descMatch || catMatch || tagMatch) {
        results.push({
          id: `ws-${ws.id}`,
          type: 'Workspaces',
          icon: 'folder',
          title: ws.title,
          subtext: `${ws.category || 'Workspace'} • ${ws.progress || 0}% completed`,
          action: () => {
            navigate(`/workspaces/${ws.id}`);
            setIsDropdownOpen(false);
            setIsMobileSearchOpen(false);
          }
        });
      }

      // 2. Tracks & Topics inside workspace
      const topics = ws.topics || ws.roadmap?.topics || [];
      topics.forEach((topic) => {
        const tMatch = topic.title?.toLowerCase().includes(q);
        const matchedSub = (topic.subtopics || []).filter((sub) => sub.title?.toLowerCase().includes(q));

        if (tMatch || matchedSub.length > 0) {
          const mainTitle = tMatch ? topic.title : matchedSub[0].title;
          results.push({
            id: `topic-${ws.id}-${topic.id || Math.random()}`,
            type: 'Tracks & Topics',
            icon: 'alt_route',
            title: mainTitle,
            subtext: `In workspace: ${ws.title}`,
            action: () => {
              navigate(`/workspaces/${ws.id}`);
              setIsDropdownOpen(false);
              setIsMobileSearchOpen(false);
            }
          });
        }
      });

      // 3. Resources inside workspace
      const resList = ws.resources || [];
      resList.forEach((res) => {
        if (res.title?.toLowerCase().includes(q) || res.category?.toLowerCase().includes(q) || res.link?.toLowerCase().includes(q)) {
          results.push({
            id: `res-${ws.id}-${res.id || Math.random()}`,
            type: 'Resources',
            icon: 'link',
            title: res.title,
            subtext: `${res.category || 'Resource'} • ${ws.title}`,
            action: () => {
              if (res.link) {
                window.open(res.link, '_blank', 'noopener,noreferrer');
              } else {
                navigate(`/workspaces/${ws.id}`);
              }
              setIsDropdownOpen(false);
              setIsMobileSearchOpen(false);
            }
          });
        }
      });
    });

    // 4. Tasks
    (tasks || []).forEach((t) => {
      if (t.text?.toLowerCase().includes(q) || t.category?.toLowerCase().includes(q)) {
        results.push({
          id: `task-${t.id}`,
          type: 'Tasks',
          icon: 'task_alt',
          title: t.text,
          subtext: `${t.category || 'Task'} • ${t.done ? 'Completed' : 'Pending'}`,
          action: () => {
            if (t.workspaceId) navigate(`/workspaces/${t.workspaceId}`);
            else navigate('/tasks');
            setIsDropdownOpen(false);
            setIsMobileSearchOpen(false);
          }
        });
      }
    });

    // 5. Exams & Assignments
    (exams || []).forEach((ex) => {
      if (ex.name?.toLowerCase().includes(q) || ex.subject?.toLowerCase().includes(q)) {
        results.push({
          id: `exam-${ex.id}`,
          type: 'Exams & Goals',
          icon: 'school',
          title: ex.name,
          subtext: `Exam • ${ex.date || 'Upcoming'}`,
          action: () => {
            navigate('/tasks');
            setIsDropdownOpen(false);
            setIsMobileSearchOpen(false);
          }
        });
      }
    });

    (assignments || []).forEach((asg) => {
      if (asg.name?.toLowerCase().includes(q) || asg.subject?.toLowerCase().includes(q)) {
        results.push({
          id: `assign-${asg.id}`,
          type: 'Exams & Goals',
          icon: 'assignment',
          title: asg.name,
          subtext: `Assignment • Due: ${asg.dueDate || 'Soon'}`,
          action: () => {
            navigate('/tasks');
            setIsDropdownOpen(false);
            setIsMobileSearchOpen(false);
          }
        });
      }
    });

    return results;
  }, [debouncedQuery, workspaces, collaboratedWorkspaces, tasks, exams, assignments, navigate]);

  // Group search results by category type
  const groupedResults = useMemo(() => {
    const groups = {};
    searchResults.forEach((item) => {
      if (!groups[item.type]) groups[item.type] = [];
      groups[item.type].push(item);
    });
    return groups;
  }, [searchResults]);

  // Handle keyboard navigation inside search dropdown
  const handleKeyDown = (e) => {
    if (!searchResults.length) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % searchResults.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + searchResults.length) % searchResults.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (searchResults[selectedIndex]) {
        searchResults[selectedIndex].action();
      }
    } else if (e.key === 'Escape') {
      setIsDropdownOpen(false);
    }
  };

  // Build the breadcrumb or page title for mobile center
  let mobileTitleText = 'MASTEROS';
  const path = window.location.pathname;
  if (path.startsWith('/workspaces/')) {
    const parts = path.split('/');
    if (parts.length > 2 && parts[2] !== '') {
      mobileTitleText = `WORKSPACES > ${workspaceTitle ? workspaceTitle.toUpperCase() : 'WORKSPACE'}`;
    } else {
      mobileTitleText = 'WORKSPACES';
    }
  } else if (path.startsWith('/tasks')) {
    mobileTitleText = 'TASKS';
  } else if (path.startsWith('/analytics')) {
    mobileTitleText = 'ANALYTICS';
  } else if (path.startsWith('/friends')) {
    mobileTitleText = 'FRIENDS';
  } else if (path.startsWith('/settings')) {
    mobileTitleText = 'SETTINGS';
  } else if (path.startsWith('/profile')) {
    mobileTitleText = 'PROFILE';
  } else if (path.startsWith('/notifications')) {
    mobileTitleText = 'NOTIFICATIONS';
  }

  // Render search results panel
  const renderResultsPanel = () => {
    if (!isDropdownOpen || searchQuery.trim().length < 2) return null;

    let globalItemIndex = 0;

    return (
      <div className="absolute top-full left-0 right-0 mt-2 bg-[#111118] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 animate-fade-in max-h-[420px] flex flex-col">
        {isSearching ? (
          <div className="p-4 text-center text-xs text-on-surface-variant flex items-center justify-center gap-2">
            <span className="w-3.5 h-3.5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            Searching MasterOS...
          </div>
        ) : searchResults.length === 0 ? (
          <div className="p-6 text-center text-xs text-on-surface-variant space-y-1">
            <span className="material-symbols-outlined text-2xl text-on-surface-variant/40 block mb-1">search_off</span>
            <p className="font-semibold text-white">No results found</p>
            <p className="text-[11px] text-on-surface-variant/60">No matching workspaces, tasks, tracks, or resources.</p>
          </div>
        ) : (
          <div className="overflow-y-auto p-2 space-y-3 divide-y divide-white/5">
            {Object.keys(groupedResults).map((categoryGroup) => (
              <div key={categoryGroup} className="pt-2 first:pt-0">
                <div className="px-3 py-1 text-[9px] font-black uppercase tracking-widest text-primary font-mono">
                  {categoryGroup} ({groupedResults[categoryGroup].length})
                </div>
                <div className="space-y-0.5 mt-1">
                  {groupedResults[categoryGroup].map((item) => {
                    const currentIndex = globalItemIndex++;
                    const isSelected = currentIndex === selectedIndex;
                    return (
                      <button
                        key={item.id}
                        onClick={item.action}
                        onMouseEnter={() => setSelectedIndex(currentIndex)}
                        className={`w-full text-left px-3 py-2 rounded-xl flex items-center gap-3 transition-colors cursor-pointer ${
                          isSelected ? 'bg-primary/20 text-white border border-primary/30' : 'hover:bg-white/5 text-on-surface-variant'
                        }`}
                      >
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border ${isSelected ? 'bg-primary/30 border-primary/40 text-white' : 'bg-white/5 border-white/5 text-on-surface-variant'}`}>
                          <span className="material-symbols-outlined text-[16px]">{item.icon}</span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className={`text-xs font-semibold truncate ${isSelected ? 'text-white' : 'text-on-surface'}`}>{item.title}</p>
                          <p className="text-[10px] text-on-surface-variant/70 truncate">{item.subtext}</p>
                        </div>
                        <span className="material-symbols-outlined text-xs opacity-40 shrink-0">chevron_right</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* MOBILE STABLE HEADER */}
      <div className="md:hidden w-full h-[56px] bg-[#0D0D14]/90 border-b border-white/5 flex items-center justify-between px-4 sticky top-0 z-40 backdrop-blur-md safe-area-inset-top shrink-0 select-none relative">
        {/* Left: Hamburger menu trigger */}
        <button
          onClick={handleHamburgerClick}
          className="w-10 h-10 rounded-xl flex items-center justify-center text-on-surface-variant hover:text-white cursor-pointer hover:bg-white/5 active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined text-[22px]">menu</span>
        </button>

        {/* Center: Title / Breadcrumb */}
        <span className="absolute left-1/2 -translate-x-1/2 text-[10px] font-black tracking-widest text-zinc-300 font-mono text-center max-w-[calc(100vw-140px)] truncate pointer-events-none">
          {mobileTitleText}
        </span>

        {/* Right: Search & Notifications buttons */}
        <div className="flex items-center gap-1">
          {!hideSearch && (
            <button
              onClick={() => setIsMobileSearchOpen(true)}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-on-surface-variant hover:text-white cursor-pointer hover:bg-white/5 active:scale-95 transition-all"
              title="Global Search"
            >
              <span className="material-symbols-outlined text-[20px]">search</span>
            </button>
          )}

          {!hideNotifications && (
            <div className="relative">
              <button
                onClick={() => navigate('/notifications')}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-on-surface-variant hover:text-white cursor-pointer hover:bg-white/5 active:scale-95 transition-all relative"
              >
                <span className="material-symbols-outlined text-[20px]">notifications</span>
                {alerts.filter(n => !n.read).length > 0 && (
                  <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-primary rounded-full animate-pulse shadow-[0_0_8px_#8B5CF6]" />
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* MOBILE SEARCH OVERLAY MODAL */}
      {isMobileSearchOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-[#08080C]/95 backdrop-blur-xl flex flex-col p-4 animate-fade-in">
          <div className="flex items-center gap-3 mb-4">
            <div className="relative flex-1 flex items-center">
              <span className="material-symbols-outlined absolute left-3.5 text-primary text-[18px]">search</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setIsDropdownOpen(true); }}
                autoFocus
                placeholder="Search workspaces, tasks, topics..."
                className="w-full bg-[#111118] border border-primary/30 rounded-xl pl-10 pr-9 py-2.5 text-xs text-white placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary shadow-[0_0_15px_rgba(139,92,246,0.15)]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 text-on-surface-variant hover:text-white"
                >
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              )}
            </div>
            <button
              onClick={() => { setIsMobileSearchOpen(false); setSearchQuery(''); }}
              className="text-xs font-bold text-on-surface-variant hover:text-white px-2 py-1 cursor-pointer"
            >
              Cancel
            </button>
          </div>

          {/* Results Area */}
          <div className="flex-1 overflow-y-auto space-y-4">
            {isSearching ? (
              <div className="p-8 text-center text-xs text-on-surface-variant flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                Searching MasterOS...
              </div>
            ) : searchQuery.trim().length >= 2 && searchResults.length === 0 ? (
              <div className="p-8 text-center text-xs text-on-surface-variant space-y-2">
                <span className="material-symbols-outlined text-3xl text-on-surface-variant/40 block mb-1">search_off</span>
                <p className="font-semibold text-white text-sm">No results found</p>
                <p className="text-xs text-on-surface-variant/60">No matching workspaces, tasks, tracks, or resources.</p>
              </div>
            ) : searchQuery.trim().length >= 2 ? (
              <div className="space-y-4">
                {Object.keys(groupedResults).map((categoryGroup) => (
                  <div key={categoryGroup} className="space-y-1.5">
                    <div className="text-[10px] font-black uppercase tracking-widest text-primary font-mono px-1">
                      {categoryGroup} ({groupedResults[categoryGroup].length})
                    </div>
                    <div className="space-y-1">
                      {groupedResults[categoryGroup].map((item) => (
                        <button
                          key={item.id}
                          onClick={item.action}
                          className="w-full text-left p-3 rounded-xl bg-[#111118] border border-white/5 flex items-center gap-3 active:scale-[0.98] transition-transform cursor-pointer"
                        >
                          <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                            <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold text-white truncate">{item.title}</p>
                            <p className="text-[10px] text-on-surface-variant truncate">{item.subtext}</p>
                          </div>
                          <span className="material-symbols-outlined text-xs text-on-surface-variant">chevron_right</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-on-surface-variant/50 space-y-1">
                <p>Type at least 2 characters to search across all your workspaces, tracks, tasks, and resources.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* DESKTOP HEADER */}
      <header className={`hidden md:flex w-full ${hideSearch ? 'h-14' : 'h-20'} bg-transparent justify-between items-center px-8 select-none transition-all duration-300 relative app-header`}>
        
        {/* LEFT COL */}
        {!hideSearch && <div className="flex-1 flex justify-start"></div>}

        {/* CENTER COL: Global Search Bar */}
        {!hideSearch && (
          <div className="flex-1 flex justify-center header-search-container" ref={searchContainerRef}>
            <div className="relative flex items-center group header-search-wrapper w-full max-w-[380px]">
              <span className="material-symbols-outlined absolute left-3.5 text-on-surface-variant group-focus-within:text-primary transition-colors text-[18px]">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsDropdownOpen(true);
                  setSelectedIndex(0);
                }}
                onFocus={() => { if (searchQuery.trim().length >= 2) setIsDropdownOpen(true); }}
                onKeyDown={handleKeyDown}
                className="bg-[#111118]/80 border border-white/5 rounded-full pl-10 pr-8 py-2 text-xs focus:ring-4 focus:ring-primary/10 focus:border-primary/50 focus:outline-none w-full text-on-surface transition-all duration-[250ms] ease-out placeholder:text-on-surface-variant/40 focus:shadow-[0_0_15px_rgba(139,92,246,0.1)] header-search-input"
                style={{ transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }}
                placeholder="Search workspaces, tasks, topics..."
              />
              {searchQuery && (
                <button
                  onClick={() => { setSearchQuery(''); setIsDropdownOpen(false); }}
                  className="absolute right-3 text-on-surface-variant hover:text-white cursor-pointer"
                >
                  <span className="material-symbols-outlined text-xs">close</span>
                </button>
              )}

              {/* Search Results Dropdown Panel */}
              {renderResultsPanel()}
            </div>
          </div>
        )}

        {/* RIGHT COL: Status Badges, Fire Streak, MasterOS Logo */}
        <div className={`${hideSearch ? 'w-full' : 'flex-1'} flex justify-end items-center gap-6 header-right-col`}>
          
          {/* Notifications Icon Button */}
          {!hideNotifications && (
            <div className="relative">
              <button 
                onClick={() => navigate('/notifications')}
                className="p-2 rounded-full hover:bg-white/5 text-on-surface-variant hover:text-white transition-all relative cursor-pointer"
                title="Notifications"
              >
                <span className="material-symbols-outlined text-[20px]">notifications</span>
                {alerts.filter(n => !n.read).length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-primary text-white text-[8px] font-black rounded-full flex items-center justify-center animate-pulse border border-[#0D0D14] shadow-[0_0_8px_#8B5CF6]">
                    {alerts.filter(n => !n.read).length}
                  </span>
                )}
              </button>
            </div>
          )}

          {/* Streak Counter with Fire icon */}
          {!hideStreak && (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full shadow-[0_0_10px_rgba(139,92,246,0.1)]">
              <span className="text-xs">🔥</span>
              <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
                {(userProfile?.streak || 0)} Day Streak
              </span>
            </div>
          )}

          {/* MasterOS Brand Logo */}
          {!hideLogo && (
            <div className="border-l border-white/10 pl-6 shrink-0">
              <MasterOSBrandLogo
                size={28}
                showText
                onClick={() => { if (window.location.pathname !== '/dashboard') navigate('/dashboard'); }}
              />
            </div>
          )}

        </div>

      </header>
    </>
  );
};

export default Header;
