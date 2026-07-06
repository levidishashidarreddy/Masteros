import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { TaskContext } from '../context/TaskContext';

const Header = ({ hideSearch = false, hideStreak = false, hideLogo = false, hideNotifications = false }) => {
  const navigate = useNavigate();
  const { getNotifications, userProfile } = useContext(TaskContext);

  const alerts = getNotifications();

  return (
    <header className={`w-full ${hideSearch ? 'h-14' : 'h-20'} bg-transparent flex justify-between items-center px-8 select-none transition-all duration-300 relative app-header`}>
      
      {/* LEFT COL (Empty filler to balance flex layouts) */}
      {!hideSearch && <div className="flex-1 flex justify-start"></div>}

      {/* CENTER COL: Search bar (Center-aligned, expands on focus) */}
      {!hideSearch && (
        <div className="flex-1 flex justify-center header-search-container">
          <div className="relative flex items-center group header-search-wrapper">
            <span className="material-symbols-outlined absolute left-3.5 text-on-surface-variant group-focus-within:text-primary transition-colors text-[18px]">
              search
            </span>
            <input
              type="text"
              className="bg-[#111118]/80 border border-white/5 rounded-full pl-10 pr-4 py-1.5 text-xs focus:ring-4 focus:ring-primary/10 focus:border-primary/50 focus:outline-none w-60 focus:w-[360px] text-on-surface transition-all duration-[250ms] ease-out placeholder:text-on-surface-variant/40 focus:shadow-[0_0_15px_rgba(139,92,246,0.1)] header-search-input"
              style={{ transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }}
              placeholder="Search workspaces, tasks..."
            />
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

        {/* MasterOS Logo (size increased slightly) */}
        {!hideLogo && (
          <div className="flex items-center gap-2 border-l border-white/10 pl-6 cursor-pointer scale-105 transition-transform shrink-0" onClick={() => { if (window.location.pathname !== '/dashboard') navigate('/dashboard'); }}>
            <div className="w-7 h-7 bg-primary-container rounded flex items-center justify-center text-primary border border-primary/20 shadow-[0_0_12px_rgba(139,92,246,0.2)]">
              <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                dashboard_customize
              </span>
            </div>
            <span className="font-display-lg text-base font-black tracking-tight text-white">
              Master<span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">OS</span>
            </span>
          </div>
        )}

      </div>

    </header>
  );
};

export default Header;
