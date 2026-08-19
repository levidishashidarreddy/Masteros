import React, { useState, useContext, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { TaskContext } from '../context/TaskContext';
import PandaCompanion from './PandaCompanion';
import { AvatarImg, getAvatar } from './Avatar';

const Sidebar = () => {
  const navigate = useNavigate();
  const { userProfile, isGuestMode, exitGuestMode } = useContext(TaskContext);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPandaModalOpen, setIsPandaModalOpen] = useState(false);

  const avatarSrc = getAvatar(userProfile);

  useEffect(() => {
    const handleOpen = () => setIsExpanded(true);
    window.addEventListener('open-mobile-sidebar', handleOpen);
    return () => window.removeEventListener('open-mobile-sidebar', handleOpen);
  }, []);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const prefetchRoute = (route) => {
    if (route === '/dashboard') import('../pages/Dashboard');
    else if (route === '/workspaces') import('../pages/Workspaces');

    else if (route === '/tasks') import('../pages/Tasks');
    else if (route === '/analytics') import('../pages/Analytics');
    else if (route === '/friends') import('../pages/Friends');
    else if (route === '/settings') import('../pages/Settings');
  };

  return (
    <>
      {/* Backdrop for mobile drawer */}
      {isExpanded && (
        <div 
          onClick={() => setIsExpanded(false)}
          className="md:hidden fixed inset-0 bg-black/75 backdrop-blur-md z-45 animate-fade-in"
        />
      )}

      {/* MOBILE FLOATING PANDA AI AGENT BUTTON (< md) */}
      <div 
        className={`fixed right-4 bottom-[calc(16px+env(safe-area-inset-bottom))] z-40 md:hidden transition-all duration-300 ${
          isExpanded ? 'opacity-0 scale-90 pointer-events-none' : 'opacity-100 scale-100'
        }`}
      >
        <PandaCompanion onClick={() => setIsPandaModalOpen(true)} />
      </div>

      {/* SINGLE IN-PLACE COLLAPSIBLE SIDEBAR CONTAINER */}
      <aside 
        className={`fixed top-0 bottom-0 left-0 h-screen max-h-screen border-r border-white/5 bg-[#0D0D14]/95 md:bg-[#0D0D14]/80 backdrop-blur-2xl shrink-0 z-50 md:z-40 select-none transition-transform duration-300 box-border overflow-y-auto no-scrollbar shadow-2xl md:shadow-none ${
          isExpanded
            ? 'translate-x-0 w-[280px] max-w-[calc(100vw-36px)]'
            : '-translate-x-full md:translate-x-0 md:w-[72px] md:relative'
        }`}
        style={{ 
          transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' 
        }}
      >
        
        {/* Profile Avatar (Top-left) */}
        <div 
          onClick={() => { setIsExpanded(false); navigate('/profile'); }}
          className="absolute left-[14px] top-6 h-11 w-11 rounded-full overflow-hidden border border-primary/20 p-[1.5px] cursor-pointer hover:border-primary transition-colors shadow-lg shadow-primary/5 z-10"
          title="Profile Page"
        >
          <AvatarImg src={avatarSrc} sizeCls="w-full h-full" iconCls="text-[20px]" />
        </div>

        {/* Hamburger Toggle button (Left-middle-top, directly under avatar) */}
        <div 
          className={`absolute left-[14px] top-[85px] w-11 h-11 z-10 transition-opacity duration-200 ${
            isExpanded ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        >
          <button 
            onClick={toggleExpand}
            className="w-full h-full rounded-lg flex items-center justify-center border border-white/5 hover:border-primary/30 text-on-surface-variant hover:text-white transition-all cursor-pointer bg-[#111118]/60"
            title="Open Menu"
          >
            <span className="material-symbols-outlined text-[24px]">
              menu
            </span>
          </button>
        </div>

        {/* Desktop Panda Companion (Bottom-left) */}
        <div className="absolute left-[10px] bottom-5 z-10 hidden md:block">
          <PandaCompanion onClick={() => setIsPandaModalOpen(true)} />
        </div>

        {/* Close Button (✕) on the top-right of expanded menu */}
        <div 
          className={`absolute right-3.5 top-6 z-10 transition-all duration-300 ${
            isExpanded ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'
          }`}
        >
          <button 
            onClick={() => setIsExpanded(false)}
            className="group/close relative w-9 h-9 flex items-center justify-center text-on-surface-variant hover:text-white transition-all cursor-pointer rounded-full bg-white/5 border border-white/10 hover:border-primary/40 active:scale-95"
            title="Close Menu"
          >
            <span className="material-symbols-outlined text-[20px]">
              close
            </span>
          </button>
        </div>

        {/* Navigation links list positioned directly under the avatar */}
        <div 
          className={`absolute left-0 top-[148px] w-full px-3.5 pb-24 transition-all duration-300 ${
            isExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 pointer-events-none'
          }`}
        >
          <nav className="space-y-2.5 w-full">
            <NavLink
              to="/dashboard"
              onClick={() => setIsExpanded(false)}
              onMouseEnter={() => prefetchRoute('/dashboard')}
              className={({ isActive }) =>
                `flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 relative group border ${
                  isActive
                    ? 'sidebar-link-active text-primary font-bold border-primary/10 bg-primary-container/20 shadow-[inset_0_0_12px_rgba(139,92,246,0.03)]'
                    : 'text-on-surface-variant font-medium border-transparent hover:bg-white/5 hover:border-white/5 hover:text-white hover:translate-x-0.5 hover:-translate-y-px hover:shadow-lg'
                }`
              }
            >
              <span className="absolute left-0 top-3 bottom-3 w-[3px] bg-primary rounded-r transition-transform duration-300 origin-center scale-y-0 group-[.sidebar-link-active]:scale-y-100" />
              <span className="material-symbols-outlined nav-grid-icon transition-all duration-300 group-[.sidebar-link-active]:scale-110 group-[.sidebar-link-active]:rotate-[5deg]">dashboard</span>
              <span className="font-label-md text-label-md transition-all duration-300 group-[.sidebar-link-active]:translate-x-1">Dashboard</span>
            </NavLink>

            <NavLink
              to="/workspaces"
              onClick={() => setIsExpanded(false)}
              onMouseEnter={() => prefetchRoute('/workspaces')}
              className={({ isActive }) =>
                `flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 relative group border ${
                  isActive
                    ? 'sidebar-link-active text-primary font-bold border-primary/10 bg-primary-container/20 shadow-[inset_0_0_12px_rgba(139,92,246,0.03)]'
                    : 'text-on-surface-variant font-medium border-transparent hover:bg-white/5 hover:border-white/5 hover:text-white hover:translate-x-0.5 hover:-translate-y-px hover:shadow-lg'
                }`
              }
            >
              <span className="absolute left-0 top-3 bottom-3 w-[3px] bg-primary rounded-r transition-transform duration-300 origin-center scale-y-0 group-[.sidebar-link-active]:scale-y-100" />
              <span className="material-symbols-outlined nav-folder-icon transition-all duration-300 group-[.sidebar-link-active]:scale-110 group-[.sidebar-link-active]:rotate-[5deg]">folder_open</span>
              <span className="font-label-md text-label-md transition-all duration-300 group-[.sidebar-link-active]:translate-x-1">Workspaces</span>
            </NavLink>

            <NavLink
              to="/roadmaps"
              onClick={() => setIsExpanded(false)}
              className={({ isActive }) =>
                `flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 relative group border ${
                  isActive
                    ? 'sidebar-link-active text-primary font-bold border-primary/10 bg-primary-container/20 shadow-[inset_0_0_12px_rgba(139,92,246,0.03)]'
                    : 'text-on-surface-variant font-medium border-transparent hover:bg-white/5 hover:border-white/5 hover:text-white hover:translate-x-0.5 hover:-translate-y-px hover:shadow-lg'
                }`
              }
            >
              <span className="absolute left-0 top-3 bottom-3 w-[3px] bg-primary rounded-r transition-transform duration-300 origin-center scale-y-0 group-[.sidebar-link-active]:scale-y-100" />
              <span className="material-symbols-outlined nav-map-icon transition-all duration-300 group-[.sidebar-link-active]:scale-110 group-[.sidebar-link-active]:rotate-[5deg]">alt_route</span>
              <span className="font-label-md text-label-md transition-all duration-300 group-[.sidebar-link-active]:translate-x-1">Roadmaps</span>
            </NavLink>

            <NavLink
              to="/tasks"
              onClick={() => setIsExpanded(false)}
              onMouseEnter={() => prefetchRoute('/tasks')}
              className={({ isActive }) =>
                `flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 relative group border ${
                  isActive
                    ? 'sidebar-link-active text-primary font-bold border-primary/10 bg-primary-container/20 shadow-[inset_0_0_12px_rgba(139,92,246,0.03)]'
                    : 'text-on-surface-variant font-medium border-transparent hover:bg-white/5 hover:border-white/5 hover:text-white hover:translate-x-0.5 hover:-translate-y-px hover:shadow-lg'
                }`
              }
            >
              <span className="absolute left-0 top-3 bottom-3 w-[3px] bg-primary rounded-r transition-transform duration-300 origin-center scale-y-0 group-[.sidebar-link-active]:scale-y-100" />
              <span className="material-symbols-outlined nav-check-icon transition-all duration-300 group-[.sidebar-link-active]:scale-110 group-[.sidebar-link-active]:rotate-[5deg]">task_alt</span>
              <span className="font-label-md text-label-md transition-all duration-300 group-[.sidebar-link-active]:translate-x-1">Tasks</span>
            </NavLink>

            <NavLink
              to="/analytics"
              onClick={() => setIsExpanded(false)}
              onMouseEnter={() => prefetchRoute('/analytics')}
              className={({ isActive }) =>
                `flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 relative group border ${
                  isActive
                    ? 'sidebar-link-active text-primary font-bold border-primary/10 bg-primary-container/20 shadow-[inset_0_0_12px_rgba(139,92,246,0.03)]'
                    : 'text-on-surface-variant font-medium border-transparent hover:bg-white/5 hover:border-white/5 hover:text-white hover:translate-x-0.5 hover:-translate-y-px hover:shadow-lg'
                }`
              }
            >
              <span className="absolute left-0 top-3 bottom-3 w-[3px] bg-primary rounded-r transition-transform duration-300 origin-center scale-y-0 group-[.sidebar-link-active]:scale-y-100" />
              <div className="h-6 flex items-end gap-[2px] nav-chart-icon transition-all duration-300 group-[.sidebar-link-active]:scale-110 group-[.sidebar-link-active]:rotate-[5deg] pr-1">
                <div className="w-[3px] h-[50%] bg-current rounded-t-sm"></div>
                <div className="w-[3px] h-[80%] bg-current rounded-t-sm"></div>
                <div className="w-[3px] h-[40%] bg-current rounded-t-sm"></div>
              </div>
              <span className="font-label-md text-label-md transition-all duration-300 group-[.sidebar-link-active]:translate-x-1">Analytics</span>
            </NavLink>

            {!isGuestMode && (
              <NavLink
                to="/friends"
                onClick={() => setIsExpanded(false)}
                onMouseEnter={() => prefetchRoute('/friends')}
                className={({ isActive }) =>
                  `flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 relative group border ${
                    isActive
                      ? 'sidebar-link-active text-primary font-bold border-primary/10 bg-primary-container/20 shadow-[inset_0_0_12px_rgba(139,92,246,0.03)]'
                      : 'text-on-surface-variant font-medium border-transparent hover:bg-white/5 hover:border-white/5 hover:text-white hover:translate-x-0.5 hover:-translate-y-px hover:shadow-lg'
                  }`
                }
              >
                <span className="absolute left-0 top-3 bottom-3 w-[3px] bg-primary rounded-r transition-transform duration-300 origin-center scale-y-0 group-[.sidebar-link-active]:scale-y-100" />
                <span className="material-symbols-outlined nav-user-icon transition-all duration-300 group-[.sidebar-link-active]:scale-110 group-[.sidebar-link-active]:rotate-[5deg]">groups</span>
                <span className="font-label-md text-label-md transition-all duration-300 group-[.sidebar-link-active]:translate-x-1">Friends</span>
              </NavLink>
            )}

            <NavLink
              to="/settings"
              onClick={() => setIsExpanded(false)}
              onMouseEnter={() => prefetchRoute('/settings')}
              className={({ isActive }) =>
                `flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 relative group border ${
                  isActive
                    ? 'sidebar-link-active text-primary font-bold border-primary/10 bg-primary-container/20 shadow-[inset_0_0_12px_rgba(139,92,246,0.03)]'
                    : 'text-on-surface-variant font-medium border-transparent hover:bg-white/5 hover:border-white/5 hover:text-white hover:translate-x-0.5 hover:-translate-y-px hover:shadow-lg'
                }`
              }
            >
              <span className="absolute left-0 top-3 bottom-3 w-[3px] bg-primary rounded-r transition-transform duration-300 origin-center scale-y-0 group-[.sidebar-link-active]:scale-y-100" />
              <span className="material-symbols-outlined nav-gear-icon transition-all duration-300 group-[.sidebar-link-active]:scale-110 group-[.sidebar-link-active]:rotate-[5deg]">settings</span>
              <span className="font-label-md text-label-md transition-all duration-300 group-[.sidebar-link-active]:translate-x-1">Settings</span>
            </NavLink>

            {isGuestMode && (
              <button
                onClick={() => { setIsExpanded(false); exitGuestMode(); navigate('/auth'); }}
                className="w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 relative group border border-amber-500/20 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 hover:border-amber-500/40 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">login</span>
                <span className="font-label-md text-label-md font-bold">Sign In / Register</span>
              </button>
            )}
          </nav>
        </div>

      </aside>

      {/* AI PANDA ASSISTANT MODAL */}
      {isPandaModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            onClick={() => setIsPandaModalOpen(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur-md transition-all animate-fade-in"
          />

          <div className="relative bg-[#111118]/90 border border-white/5 rounded-3xl w-full max-w-md p-8 text-center z-10 shadow-2xl scale-100 animate-fade-in flex flex-col items-center gap-6 overflow-hidden">
            
            {/* Animated bamboo stalks */}
            <div className="absolute left-2 top-0 bottom-0 w-2 pointer-events-none opacity-20 flex flex-col justify-around">
              <div className="h-10 w-1 bg-green-500/80 rounded-full"></div>
              <div className="h-12 w-1.5 bg-green-600/80 rounded-full"></div>
              <div className="h-8 w-1 bg-green-500/80 rounded-full"></div>
            </div>
            <div className="absolute right-2 top-0 bottom-0 w-2 pointer-events-none opacity-20 flex flex-col justify-around">
              <div className="h-8 w-1 bg-green-500/80 rounded-full"></div>
              <div className="h-12 w-1.5 bg-green-600/80 rounded-full"></div>
              <div className="h-10 w-1 bg-green-500/80 rounded-full"></div>
            </div>

            {/* Floating leaves */}
            <div className="absolute top-10 left-10 pointer-events-none text-green-500/30 animate-leaf-1">
              <span className="material-symbols-outlined text-lg">eco</span>
            </div>
            <div className="absolute bottom-16 right-12 pointer-events-none text-green-500/30 animate-leaf-2">
              <span className="material-symbols-outlined text-lg">eco</span>
            </div>

            {/* Floating Panda Header */}
            <div className="w-20 h-20 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-lg shadow-primary/5 mt-4">
              <span className="material-symbols-outlined text-4xl animate-float">smart_toy</span>
            </div>

            <div className="space-y-2 relative z-10">
              <h3 className="font-display-lg text-2xl font-bold text-white flex items-center justify-center gap-2">
                🐼 AI Panda Assistant
              </h3>
              <span className="inline-block bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-[0_0_8px_rgba(139,92,246,0.1)]">
                Coming Soon
              </span>
              <p className="text-on-surface-variant text-sm leading-relaxed pt-4 max-w-xs mx-auto">
                "Our AI companion is preparing something magical to help you learn, build and grow."
              </p>
            </div>

            <button 
              onClick={() => setIsPandaModalOpen(false)}
              className="mt-4 px-6 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-white font-semibold text-xs transition-all cursor-pointer relative z-10"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
