import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TaskContext } from '../context/TaskContext';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Button from '../components/Button';
import { SkeletonBlock } from '../components/Skeleton';
import EmptyState from '../components/EmptyState';

const CATEGORIES = ['All', 'Tasks', 'Exams', 'Assignments', 'Friends', 'Workspace', 'System'];

const Notifications = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.state && window.history.state.usr && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      // standard history back check
      navigate(-1);
    }
  };

  const {
    getNotifications,
    markNotificationRead,
    markAllNotificationsRead,
    deleteNotification,
    acceptFollowRequest,
    rejectFollowRequest,
    acceptCollaborationInvite,
    rejectCollaborationInvite,
    loading
  } = useContext(TaskContext);

  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading) {
      setIsLoading(false);
    }
  }, [loading]);

  const allNotifications = getNotifications();

  // Filter based on active category tab & search query
  const filteredNotifications = allNotifications.filter((notif) => {
    const matchesCategory = activeCategory === 'All' || notif.type === activeCategory;
    const matchesSearch = notif.text.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getNotifIcon = (type) => {
    switch (type) {
      case 'Tasks': return { icon: 'task_alt', color: 'text-primary' };
      case 'Exams': return { icon: 'school', color: 'text-secondary' };
      case 'Assignments': return { icon: 'assignment', color: 'text-tertiary' };
      case 'Friends': return { icon: 'person_add', color: 'text-yellow-400' };
      case 'Workspace': return { icon: 'groups', color: 'text-blue-400' };
      default: return { icon: 'info', color: 'text-white/60' };
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-background text-on-surface radial-glow-bg select-none">
        <Sidebar />
        <main className="flex-grow flex flex-col h-screen overflow-y-auto no-scrollbar relative z-10">
          <Header hideSearch={true} hideStreak={true} hideLogo={true} hideNotifications={true} />
          <div className="w-full px-8 pt-4 pb-12 space-y-8">
            <div className="flex justify-between items-center">
              <div className="space-y-2">
                <SkeletonBlock className="h-8 w-44" />
                <SkeletonBlock className="h-4 w-72" />
              </div>
              <SkeletonBlock className="h-10 w-32 rounded-xl" />
            </div>
            
            <div className="space-y-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-[#111118]/60 border border-white/5 p-5 rounded-xl flex gap-4 items-center">
                  <SkeletonBlock className="h-8 w-8 rounded" />
                  <div className="space-y-2 flex-grow">
                    <SkeletonBlock className="h-4 w-40" />
                    <SkeletonBlock className="h-3 w-72" />
                  </div>
                  <SkeletonBlock className="h-6 w-16" />
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background text-on-surface radial-glow-bg select-none">
      <Sidebar />

      <main className="flex-grow flex flex-col h-screen overflow-y-auto no-scrollbar relative z-10">
        <Header hideSearch={true} hideStreak={true} hideLogo={true} hideNotifications={true} />

        <div className="w-full px-8 pt-4 pb-12 space-y-8 animate-page-transition">
          {/* Back button */}
          <div className="animate-fade-in">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-on-surface-variant hover:text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer bg-transparent border-0"
            >
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
              Back
            </button>
          </div>

          {/* Title Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
            <div className="animate-text-reveal">
              <h2 className="font-display-lg text-[32px] text-white font-bold tracking-tight mb-2">
                Notifications Hub
              </h2>
              <p className="text-on-surface-variant text-sm font-medium">
                Monitor deadlines, friend interactions, and collaborative workspace sync pulses.
              </p>
            </div>
            
            <div className="flex gap-3">
              <Button variant="secondary" icon="done_all" onClick={markAllNotificationsRead}>
                Mark All Read
              </Button>
            </div>
          </div>

          {/* Filters & Search bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-[#111118]/85 border border-white/5 p-4 rounded-xl">
            {/* Category tabs */}
            <div className="flex flex-wrap gap-2 w-full md:w-auto">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                    activeCategory === cat
                      ? 'bg-primary/20 border border-primary text-white shadow-[0_0_10px_rgba(139,92,246,0.1)]'
                      : 'bg-white/5 border border-transparent text-on-surface-variant hover:text-white hover:bg-white/10'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search query input */}
            <div className="relative w-full md:w-72">
              <span className="material-symbols-outlined absolute left-3 top-3 text-on-surface-variant text-base">search</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#0D0D14] border border-white/5 rounded-lg pl-9 pr-4 py-2.5 text-xs text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary"
                placeholder="Search notifications..."
              />
            </div>
          </div>

          {/* Notifications List */}
          <div className="space-y-3">
            {filteredNotifications.length === 0 ? (
              <EmptyState 
                icon="notifications" 
                title="No notifications" 
                description="You're all caught up! No notifications in this view." 
              />
            ) : (
              filteredNotifications.map((notif) => {
                const styleObj = getNotifIcon(notif.type);
                return (
                  <div
                    key={notif.id}
                    className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl border bg-[#111118] hover:border-primary/20 transition-all duration-200 group ${
                      notif.read ? 'opacity-55 border-white/5' : 'border-primary/25 shadow-[0_0_12px_rgba(139,92,246,0.03)]'
                    }`}
                  >
                    <div className="flex items-start gap-4 flex-grow min-w-0">
                      {/* Icon */}
                      <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center shrink-0">
                        <span className={`material-symbols-outlined text-lg ${styleObj.color}`}>{styleObj.icon}</span>
                      </div>
                      
                      {/* Text */}
                      <div className="space-y-1 min-w-0">
                        <p className={`text-sm font-semibold leading-relaxed break-words ${notif.read ? 'text-on-surface-variant' : 'text-white'}`}>
                          {notif.text}
                        </p>
                        <div className="flex gap-2 text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">
                          <span>{notif.type}</span>
                          <span>•</span>
                          <span>{new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto justify-end sm:justify-start">
                      
                      {/* Conditional Buttons for Requests */}
                      {!notif.read && notif.meta?.isFriendRequest && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => acceptFollowRequest(notif.id)}
                            className="bg-primary/20 border border-primary text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-primary/30 transition-all cursor-pointer"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => rejectFollowRequest(notif.id)}
                            className="bg-white/5 border border-white/10 text-on-surface text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-white/10 transition-all cursor-pointer"
                          >
                            Reject
                          </button>
                        </div>
                      )}

                      {!notif.read && notif.meta?.isCollabRequest && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => acceptCollaborationInvite(notif.id)}
                            className="bg-primary/20 border border-primary text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-primary/30 transition-all cursor-pointer"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => rejectCollaborationInvite(notif.id)}
                            className="bg-white/5 border border-white/10 text-on-surface text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-white/10 transition-all cursor-pointer"
                          >
                            Reject
                          </button>
                        </div>
                      )}

                      {/* General actions */}
                      {!notif.read && (
                        <button
                          onClick={() => markNotificationRead(notif.id)}
                          className="p-1.5 rounded hover:bg-white/5 text-on-surface-variant hover:text-white transition-colors cursor-pointer"
                          title="Mark Read"
                        >
                          <span className="material-symbols-outlined text-[18px]">done</span>
                        </button>
                      )}

                      <button
                        onClick={() => deleteNotification(notif.id)}
                        className="p-1.5 rounded hover:bg-white/5 text-on-surface-variant hover:text-red-400 transition-colors cursor-pointer"
                        title="Delete"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>

                  </div>
                );
              })
            )}
          </div>

        </div>
      </main>
    </div>
  );
};

export default Notifications;
