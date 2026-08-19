import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TaskContext } from '../context/TaskContext';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Button from '../components/Button';
import Modal from '../components/Modal';
import { SkeletonBlock } from '../components/Skeleton';
import EmptyState from '../components/EmptyState';

const CATEGORIES = ['All', 'Feedback', 'Tasks', 'Exams', 'Assignments', 'Friends', 'Workspace'];

const Notifications = () => {
  const navigate = useNavigate();

  const {
    getNotifications,
    userNotifications,
    feedbackReports,
    isAdmin,
    updateFeedbackStatus,
    markNotificationAsRead,
    markAllNotificationsAsRead,
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
  const [isLoading, setIsLoading] = useState(loading);
  const [selectedReportModal, setSelectedReportModal] = useState(null);

  useEffect(() => {
    setIsLoading(loading);
  }, [loading]);

  const rawAlerts = getNotifications();

  // Merge Firestore notifications with local alerts
  const combinedNotifications = [
    ...(userNotifications || []).map(n => ({
      id: n.id,
      text: `${n.title}: ${n.message}`,
      type: n.type === 'bug' || n.type === 'suggestion' || n.type === 'feedback' || n.type === 'feedback_update' ? 'Feedback' : 'System',
      read: !n.unread,
      timestamp: n.createdAt || new Date().toISOString(),
      feedbackId: n.feedbackId,
      rawNotif: n
    })),
    ...rawAlerts.map(a => ({
      ...a,
      timestamp: a.timestamp || new Date().toISOString()
    }))
  ];

  // Remove duplicates by ID
  const seenIds = new Set();
  const allNotifications = combinedNotifications.filter(n => {
    if (seenIds.has(n.id)) return false;
    seenIds.add(n.id);
    return true;
  });

  const filteredNotifications = allNotifications.filter((notif) => {
    const matchesCategory = activeCategory === 'All' || notif.type === activeCategory;
    const matchesSearch = notif.text.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const unreadCount = allNotifications.filter(n => !n.read).length;

  const handleNotificationClick = (notif) => {
    if (!notif.read) {
      if (notif.rawNotif) {
        markNotificationAsRead(notif.id);
      } else {
        markNotificationRead(notif.id);
      }
    }

    if (notif.feedbackId) {
      const report = (feedbackReports || []).find(f => f.id === notif.feedbackId);
      if (report) {
        setSelectedReportModal(report);
      } else {
        navigate('/settings');
      }
    }
  };

  const handleMarkAllRead = () => {
    markAllNotificationsAsRead();
    markAllNotificationsRead();
  };

  const getNotifIcon = (type) => {
    switch (type) {
      case 'Feedback': return { icon: 'bug_report', color: 'text-amber-400' };
      case 'Tasks': return { icon: 'task_alt', color: 'text-primary' };
      case 'Exams': return { icon: 'school', color: 'text-secondary' };
      case 'Assignments': return { icon: 'assignment', color: 'text-tertiary' };
      case 'Friends': return { icon: 'group', color: 'text-emerald-400' };
      case 'Workspace': return { icon: 'folder', color: 'text-blue-400' };
      default: return { icon: 'notifications', color: 'text-on-surface-variant' };
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-background text-on-surface radial-glow-bg select-none">
        <Sidebar />
        <main className="flex-1 flex flex-col h-screen overflow-y-auto no-scrollbar relative z-10">
          <Header hideSearch hideStreak hideLogo />
          <div className="w-full px-8 pt-4 pb-12 space-y-8 max-w-4xl mx-auto">
            <SkeletonBlock className="h-8 w-44" />
            <SkeletonBlock className="h-64 w-full rounded-2xl" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#050507] text-on-surface select-none font-dm-sans">
      <Sidebar />
      
      <main className="flex-1 flex flex-col h-screen overflow-y-auto no-scrollbar relative z-10">
        <Header hideSearch hideStreak hideLogo />

        <div className="w-full px-4 py-6 md:px-10 md:py-8 max-w-5xl mx-auto animate-page-transition space-y-6">
          
          {/* Header Title */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-space-grotesk text-2xl md:text-3xl font-bold text-white tracking-tight">
                  NOTIFICATIONS
                </h1>
                {unreadCount > 0 && (
                  <span className="px-2.5 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30 text-xs font-bold font-mono">
                    {unreadCount} unread
                  </span>
                )}
              </div>
              <p className="text-zinc-400 text-xs md:text-sm mt-1">
                Stay updated with feedback status, workspace alerts, tasks, and system activity.
              </p>
            </div>

            {allNotifications.length > 0 && (
              <div className="flex items-center gap-3">
                <Button variant="ghost" icon="done_all" onClick={handleMarkAllRead} className="text-xs font-bold">
                  Mark All Read
                </Button>
              </div>
            )}
          </div>

          {/* Search & Category Filter Tabs */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-[#0B0B10] p-3 rounded-2xl border border-white/10">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    activeCategory === cat
                      ? 'bg-primary text-black font-extrabold shadow-[0_0_10px_rgba(139,92,246,0.3)]'
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="relative flex items-center min-w-[200px]">
              <span className="material-symbols-outlined absolute left-3 text-zinc-500 text-sm">search</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search notifications..."
                className="w-full bg-[#111118] border border-white/10 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          {/* Notifications List */}
          <div className="space-y-3">
            {filteredNotifications.length === 0 ? (
              <EmptyState
                icon="notifications_off"
                title="No Notifications"
                description="You are all caught up! No recent alerts or feedback updates found."
              />
            ) : (
              filteredNotifications.map((notif) => {
                const styleObj = getNotifIcon(notif.type);

                return (
                  <div
                    key={notif.id}
                    onClick={() => handleNotificationClick(notif)}
                    className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl border transition-all duration-200 group cursor-pointer ${
                      notif.read ? 'bg-[#09090D] opacity-60 border-white/5' : 'bg-[#0E0E14] border-primary/30 shadow-[0_0_15px_rgba(139,92,246,0.05)]'
                    }`}
                  >
                    <div className="flex items-start gap-3.5 flex-grow min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                        <span className={`material-symbols-outlined text-lg ${styleObj.color}`}>{styleObj.icon}</span>
                      </div>
                      
                      <div className="space-y-1 min-w-0">
                        <p className={`text-xs md:text-sm font-semibold leading-relaxed break-words ${notif.read ? 'text-zinc-400' : 'text-white'}`}>
                          {notif.text}
                        </p>
                        <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
                          <span className="text-primary font-mono">{notif.type}</span>
                          <span>•</span>
                          <span>{new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      {notif.feedbackId && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleNotificationClick(notif);
                          }}
                          className="px-3 py-1 rounded-lg bg-primary/10 border border-primary/30 text-primary text-[11px] font-bold uppercase hover:bg-primary/20 transition-all cursor-pointer"
                        >
                          View Report →
                        </button>
                      )}

                      {!notif.read && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (notif.rawNotif) markNotificationAsRead(notif.id);
                            else markNotificationRead(notif.id);
                          }}
                          className="p-1.5 rounded-lg hover:bg-white/5 text-zinc-500 hover:text-white transition-colors cursor-pointer"
                          title="Mark Read"
                        >
                          <span className="material-symbols-outlined text-base">done</span>
                        </button>
                      )}

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notif.id);
                        }}
                        className="p-1.5 rounded-lg hover:bg-white/5 text-zinc-500 hover:text-red-400 transition-colors cursor-pointer"
                        title="Delete"
                      >
                        <span className="material-symbols-outlined text-base">delete</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

        </div>
      </main>

      {/* Admin / User Feedback Report Detail Modal */}
      {selectedReportModal && (
        <Modal
          isOpen={Boolean(selectedReportModal)}
          onClose={() => setSelectedReportModal(null)}
          title={`FEEDBACK REPORT: ${selectedReportModal.title}`}
        >
          <div className="space-y-4 text-on-surface select-none text-xs">
            <div className="p-4 bg-[#0D0D14] border border-white/10 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                  Type: {selectedReportModal.type}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30 font-bold uppercase text-[10px]">
                  {selectedReportModal.status}
                </span>
              </div>
              <h4 className="font-space-grotesk text-base font-bold text-white">{selectedReportModal.title}</h4>
              <p className="text-zinc-300 leading-relaxed">{selectedReportModal.description}</p>
            </div>

            {selectedReportModal.stepsToReproduce && (
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Steps to Reproduce</label>
                <p className="p-3 bg-white/5 border border-white/5 rounded-xl text-zinc-300 font-mono text-[11px]">
                  {selectedReportModal.stepsToReproduce}
                </p>
              </div>
            )}

            {isAdmin && (
              <div className="space-y-2 border-t border-white/5 pt-3">
                <label className="block text-[10px] font-bold text-zinc-400 uppercase">Admin Action: Update Report Status</label>
                <div className="flex items-center gap-2 flex-wrap">
                  {['VIEWED', 'IN PROGRESS', 'RESOLVED', 'CLOSED'].map((status) => (
                    <button
                      key={status}
                      onClick={() => {
                        updateFeedbackStatus(selectedReportModal.id, status);
                        setSelectedReportModal(prev => prev ? { ...prev, status } : null);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase cursor-pointer transition-all ${
                        selectedReportModal.status === status
                          ? 'bg-primary text-black font-extrabold shadow-[0_0_10px_rgba(139,92,246,0.5)]'
                          : 'bg-white/5 text-zinc-400 hover:text-white'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end pt-2 border-t border-white/5">
              <button
                onClick={() => setSelectedReportModal(null)}
                className="px-4 py-1.5 rounded-xl bg-white/10 text-white text-xs font-bold uppercase cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
};

export default Notifications;
