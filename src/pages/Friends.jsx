import React, { useState, useContext, useEffect, useRef } from 'react';
import { TaskContext } from '../context/TaskContext';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Button from '../components/Button';
import Modal from '../components/Modal';
import { SkeletonBlock } from '../components/Skeleton';
import EmptyState from '../components/EmptyState';

const AVATAR_PRESETS = [
  { id: 'tech', label: 'Tech Prodigy', icon: 'developer_mode', bg: 'from-blue-500 to-indigo-600' },
  { id: 'startup', label: 'Founder', icon: 'rocket_launch', bg: 'from-amber-400 to-orange-600' },
  { id: 'design', label: 'Designer', icon: 'palette', bg: 'from-pink-500 to-rose-600' },
  { id: 'ai', label: 'AI Researcher', icon: 'psychology', bg: 'from-purple-500 to-violet-600' },
  { id: 'flow', label: 'Flow Master', icon: 'bolt', bg: 'from-teal-400 to-emerald-600' },
  { id: 'fitness', label: 'Athlete', icon: 'fitness_center', bg: 'from-red-500 to-crimson-600' }
];

const formatLastSeen = (timestamp) => {
  if (!timestamp) return 'Offline';
  const diffMs = Date.now() - new Date(timestamp).getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
};

const isOnlyEmojis = (str) => {
  if (!str) return false;
  const emojiRegex = /^(\s*[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F000}-\u{1F02F}\u{1F0A0}-\u{1F0FF}\u{1F100}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{2000}-\u{32FF}\u{1F200}-\u{1F2FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F900}-\u{1F9FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{1FC00}-\u{1FFFD}]\s*)+$/u;
  return emojiRegex.test(str);
};

const Friends = () => {
  const {
    userId,
    allUsers,
    friends,
    sentRequests,
    chats,
    sendFollowRequest,
    unfollowFriend,
    sendChatMessage,
    addChatReaction,
    getNotifications,
    acceptFollowRequest,
    rejectFollowRequest,
    userProfile,
    tasks,
    workspaces,
    loading,
    presenceStates,
    typingStates,
    setMyTypingStatus,
    markMessagesAsSeen
  } = useContext(TaskContext);

  const myName = userProfile?.fullName || 'User';
  const myUsername = userProfile?.username || '@user';
  const myUniversity = userProfile?.university || '';
  const mySkills = userProfile?.skills || [];
  const myAvatar = userProfile?.profilePicture || 'tech';
  
  // Current user's stats for Leaderboard
  const myXP = userProfile?.xp || 0;
  const myStreak = userProfile?.streak || 0;
  const myTasksCompleted = tasks.filter(t => t.done).length;
  const myWorkspacesCompleted = workspaces.filter(w => w.progress === 100).length;

  const getUserTopBadges = (usr) => {
    const list = [];
    if (usr.xp >= 30000) list.push('💎');
    else if (usr.xp >= 20000) list.push('🥇');
    else if (usr.xp >= 10000) list.push('🥈');
    else if (usr.xp >= 5000) list.push('🥉');
    
    if (usr.streak >= 30) list.push('🔥');
    else if (usr.streak >= 7) list.push('🔥');
    
    if (usr.tasksCompleted >= 50) list.push('💻');
    if (usr.workspaceCompleted >= 3) list.push('🚀');
    return list;
  };

  // Tabs state
  const [activeTab, setActiveTab] = useState('Leaderboards'); // Leaderboards, Chats, Add Friends, Requests
  const [leaderboardFilter, setLeaderboardFilter] = useState('Global'); // Global, University, Friends

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading) {
      setIsLoading(false);
    }
  }, [loading]);
  
  // Searching users
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  // Selected Friend Profile modal
  const [selectedProfileUser, setSelectedProfileUser] = useState(null);

  // Chat window state
  const [activeChatFriendId, setActiveChatFriendId] = useState(null);
  const [chatMessageText, setChatMessageText] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [pendingAttachment, setPendingAttachment] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [chatSearchQuery, setChatSearchQuery] = useState('');
  const typingTimeoutRef = useRef(null);
  const chatBottomRef = useRef(null);

  // Scroll to chat bottom
  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chats, activeChatFriendId]);

  // Mark messages as seen when chat opens or gets new messages
  useEffect(() => {
    if (activeChatFriendId) {
      markMessagesAsSeen(activeChatFriendId);
    }
  }, [activeChatFriendId, chats, markMessagesAsSeen]);

  // Handle searching users
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    const filtered = allUsers.filter((user) => 
      user.fullName.toLowerCase().includes(query.toLowerCase()) ||
      user.username.toLowerCase().includes(query.toLowerCase()) ||
      user.userId.toLowerCase().includes(query.toLowerCase())
    );
    setSearchResults(filtered);
  };

  // Typing change and keystroke listeners
  const handleInputChange = (e) => {
    setChatMessageText(e.target.value);
    if (activeChatFriendId) {
      setMyTypingStatus(true);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      typingTimeoutRef.current = setTimeout(() => {
        setMyTypingStatus(false);
      }, 3000);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Chat reply typing status and message sending
  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    const textToSend = chatMessageText.trim();
    if ((!textToSend && !pendingAttachment) || !activeChatFriendId || isSending) return;

    setIsSending(true);

    // Stop typing status immediately
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    setMyTypingStatus(false);

    try {
      if (pendingAttachment) {
        // Send attachment message
        const attachType = pendingAttachment.type;
        const attachText = attachType === 'image' 
          ? `🖼️ Shared image: ${pendingAttachment.name}`
          : `📄 Shared attachment: ${pendingAttachment.name}`;
        
        await sendChatMessage(activeChatFriendId, textToSend || attachText, attachType, pendingAttachment, replyingTo);
      } else {
        // Send normal text message
        await sendChatMessage(activeChatFriendId, textToSend, 'text', null, replyingTo);
      }

      setChatMessageText('');
      setPendingAttachment(null);
      setReplyingTo(null);
      setShowEmojiPicker(false);
    } catch (err) {
      console.error("Error sending message:", err);
    } finally {
      setIsSending(false);
    }
  };

  // Chat Attachment handlers setting preview state
  const handleAttachFile = () => {
    if (!activeChatFriendId) return;
    setPendingAttachment({ name: 'dsa_roadmap_v2.pdf', type: 'pdf' });
  };

  const handleAttachImage = () => {
    if (!activeChatFriendId) return;
    setPendingAttachment({ 
      name: 'dashboard_mockup.png', 
      type: 'image', 
      url: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=400&q=80' 
    });
  };

  const handleShareWorkspace = () => {
    if (!activeChatFriendId) return;
    sendChatMessage(activeChatFriendId, '📂 Shared Collaboration Node: Web Development Masterclass', 'workspace', { title: 'Web Development', wsId: 'web-dev' });
  };

  // Leaderboard Sorting (primarily sorting by XP desc)
  const getLeaderboardList = () => {
    // Merge me + mock users
    const meObj = {
      userId: userId,
      fullName: myName,
      username: myUsername,
      university: myUniversity,
      skills: mySkills,
      xp: myXP,
      streak: myStreak,
      tasksCompleted: myTasksCompleted,
      workspaceCompleted: myWorkspacesCompleted,
      profilePicture: myAvatar,
      isMe: true
    };

    const otherUsers = allUsers.filter(u => u.userId !== userId);
    let fullList = [meObj, ...otherUsers];

    if (leaderboardFilter === 'University') {
      fullList = fullList.filter(u => u.university?.toLowerCase() === myUniversity?.toLowerCase() || u.isMe);
    } else if (leaderboardFilter === 'Friends') {
      fullList = fullList.filter(u => friends.includes(u.userId) || u.isMe);
    }

    return [...fullList].sort((a, b) => (b.xp || 0) - (a.xp || 0));
  };

  // Retrieve incoming requests from system notifications
  const incomingRequests = getNotifications().filter(
    (n) => n.meta?.isFriendRequest && !n.read
  );

  const getPresetStyles = (avatarId) => {
    const preset = AVATAR_PRESETS.find((p) => p.id === avatarId);
    return preset || { icon: 'person', bg: 'from-gray-500 to-slate-600' };
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-background text-on-surface radial-glow-bg select-none">
        <Sidebar />
        <main className="flex-1 flex flex-col h-screen overflow-y-auto no-scrollbar relative z-10">
          <Header hideSearch={true} hideStreak={true} hideLogo={true} />
          <div className="w-full px-8 pt-4 pb-12 space-y-8 flex flex-col h-[calc(100vh-80px)]">
            <div className="flex justify-between items-center">
              <div className="space-y-2">
                <SkeletonBlock className="h-8 w-44" />
                <SkeletonBlock className="h-4 w-96" />
              </div>
              <SkeletonBlock className="h-10 w-48 rounded-xl" />
            </div>
            
            <div className="flex-1 bg-[#111118]/60 border border-white/5 rounded-2xl p-6 space-y-4">
              <div className="flex gap-4">
                <SkeletonBlock className="h-8 w-24 rounded-full" />
                <SkeletonBlock className="h-8 w-24 rounded-full" />
                <SkeletonBlock className="h-8 w-24 rounded-full" />
              </div>
              <div className="space-y-3 pt-4">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="flex justify-between items-center p-3 bg-[#0D0D14]/20 border border-white/5 rounded-xl">
                    <div className="flex items-center gap-3">
                      <SkeletonBlock className="h-10 w-10 rounded-full" />
                      <div className="space-y-2">
                        <SkeletonBlock className="h-4 w-28" />
                        <SkeletonBlock className="h-3 w-40" />
                      </div>
                    </div>
                    <SkeletonBlock className="h-4 w-12" />
                  </div>
                ))}
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

        <div className="w-full px-8 pt-4 pb-12 space-y-8 flex flex-col h-[calc(100vh-80px)] animate-page-transition">
          
          {/* Header titles */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-5 shrink-0">
            <div>
              <h2 className="text-3xl font-bold text-white tracking-tight mb-1">Social Workspace</h2>
              <p className="text-on-surface-variant text-sm font-medium">Coordinate roadmaps, track streaks, and share development milestones.</p>
            </div>
            
            {/* Top Search bar */}
            <div className="relative w-full sm:w-72">
              <span className="material-symbols-outlined absolute left-3 top-3 text-on-surface-variant text-base">search</span>
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full bg-[#111118] border border-white/5 rounded-xl pl-9 pr-4 py-2.5 text-xs text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary"
                placeholder="Search other users by name, @username, or ID..."
              />
            </div>
          </div>

          {/* ================= SEARCH RESULTS PANEL ================= */}
          {searchQuery && (
            <div className="bg-[#111118]/95 border border-primary/20 p-5 rounded-2xl space-y-4 shrink-0 shadow-2xl animate-fade-in relative z-20">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <span className="text-[10px] font-black uppercase text-on-surface-variant tracking-wider">Search Results for "{searchQuery}"</span>
                <button onClick={() => setSearchQuery('')} className="text-[10px] font-bold text-primary hover:underline">Clear Search</button>
              </div>

              {searchResults.length === 0 ? (
                <p className="text-xs text-on-surface-variant italic p-2">No users found with details matching "{searchQuery}"</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {searchResults.map((user) => {
                    const preset = getPresetStyles(user.profilePicture);
                    const isFriend = friends.includes(user.userId);
                    const isRequested = sentRequests.includes(user.userId);
                    
                    return (
                      <div key={user.userId} className="p-4 bg-[#0D0D14]/80 border border-white/5 rounded-xl flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3.5 min-w-0 cursor-pointer" onClick={() => setSelectedProfileUser(user)}>
                          <div className={`w-11 h-11 rounded-full bg-gradient-to-tr ${preset.bg} flex items-center justify-center text-white shrink-0`}>
                            <span className="material-symbols-outlined text-lg">{preset.icon}</span>
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-sm font-bold text-white leading-tight flex items-center gap-1.5">
                              {user.fullName}
                              <span className="text-[9px] text-on-surface-variant bg-white/5 px-1.5 py-0.5 rounded font-mono uppercase">{user.userId}</span>
                            </h4>
                            <p className="text-xs text-on-surface-variant mt-0.5 truncate">{user.username} · {user.university}</p>
                            <p className="text-[10px] text-primary/70 font-semibold truncate mt-1">Skills: {user.skills.slice(0, 3).join(', ')}</p>
                          </div>
                        </div>

                        <div className="shrink-0">
                          {isFriend ? (
                            <button
                              onClick={() => unfollowFriend(user.userId)}
                              className="px-3 py-1.5 bg-white/5 border border-white/10 hover:border-red-500/20 hover:text-red-400 rounded-lg text-xs font-bold transition-all cursor-pointer"
                            >
                              Unfollow
                            </button>
                          ) : isRequested ? (
                            <span className="text-xs text-on-surface-variant font-bold px-3 py-1.5 bg-white/5 border border-white/5 rounded-lg">Requested</span>
                          ) : (
                            <button
                              onClick={() => sendFollowRequest(user.userId)}
                              className="px-3 py-1.5 bg-primary/20 border border-primary text-white text-xs font-bold rounded-lg hover:bg-primary/30 transition-all cursor-pointer"
                            >
                              Follow
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Tabs header */}
          <div className="flex border-b border-white/5 gap-6 shrink-0">
            {['Leaderboards', 'Chats', 'Add Friends', 'Requests'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 text-sm font-bold uppercase tracking-wider relative cursor-pointer ${
                  activeTab === tab ? 'text-primary' : 'text-on-surface-variant hover:text-white'
                }`}
              >
                {tab}
                {tab === 'Requests' && incomingRequests.length > 0 && (
                  <span className="ml-1.5 bg-primary text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">
                    {incomingRequests.length}
                  </span>
                )}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary animate-scale-in" />
                )}
              </button>
            ))}
          </div>

          {/* ================= TABS CONTENT ================= */}
          <div className="flex-1 min-h-0">
            
            {/* 1. LEADERBOARDS TAB */}
            {activeTab === 'Leaderboards' && (
              <div className="h-full flex flex-col space-y-6 animate-fade-in">
                {/* Ranking scope selectors */}
                <div className="flex gap-2 shrink-0">
                  {['Global', 'University', 'Friends'].map((scope) => (
                    <button
                      key={scope}
                      onClick={() => setLeaderboardFilter(scope)}
                      className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                        leaderboardFilter === scope
                          ? 'bg-primary/10 border border-primary/20 text-primary'
                          : 'bg-white/5 border border-transparent text-on-surface-variant hover:text-white'
                      }`}
                    >
                      {scope} Ranking
                    </button>
                  ))}
                </div>

                {/* Table */}
                <div className="flex-1 bg-[#111118]/60 border border-white/5 rounded-2xl overflow-y-auto no-scrollbar">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/5 text-[10px] font-black uppercase tracking-wider text-on-surface-variant bg-[#0D0D14]/40">
                        <th className="p-4 text-center w-16">Rank</th>
                        <th className="p-4">User</th>
                        <th className="p-4 hidden md:table-cell">University</th>
                        <th className="p-4 text-center">Streak</th>
                        <th className="p-4 text-center">Tasks</th>
                        <th className="p-4 text-right">XP</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-sm">
                      {getLeaderboardList().map((user, idx) => {
                        const preset = getPresetStyles(user.profilePicture);
                        const isMe = user.isMe;
                        
                        return (
                          <tr 
                            key={user.userId}
                            onClick={() => {
                              if (!isMe) {
                                setSelectedProfileUser(user);
                              }
                            }}
                            className={`transition-colors cursor-pointer group ${
                              isMe 
                                ? 'bg-primary/5 hover:bg-primary/10 font-bold border-l-2 border-primary' 
                                : 'hover:bg-white/[0.01]'
                            }`}
                          >
                            <td className="p-4 text-center font-bold text-white/90">
                              {idx === 0 && <span className="text-xl">🏆</span>}
                              {idx === 1 && <span className="text-xl">🥈</span>}
                              {idx === 2 && <span className="text-xl">🥉</span>}
                              {idx > 2 && `#${idx + 1}`}
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <div className={`w-9 h-9 rounded-full bg-gradient-to-tr ${preset.bg} flex items-center justify-center text-white shrink-0`}>
                                  <span className="material-symbols-outlined text-sm">{preset.icon}</span>
                                </div>
                                <div className="min-w-0">
                                  <h4 className="font-bold text-white text-xs leading-none flex items-center gap-1.5">
                                    {user.fullName}
                                    {getUserTopBadges(user).map((badge, bIdx) => (
                                      <span key={bIdx} className="text-xs" title="Unlocked Badge">{badge}</span>
                                    ))}
                                    {isMe && <span className="text-[8px] bg-primary/20 text-primary px-1.5 py-0.5 rounded uppercase font-bold tracking-wider">Me</span>}
                                  </h4>
                                  <span className="text-[10px] text-on-surface-variant font-medium mt-0.5 block">{user.username}</span>
                                </div>
                              </div>
                            </td>
                            <td className="p-4 hidden md:table-cell text-xs text-on-surface-variant">{user.university}</td>
                            <td className="p-4 text-center">
                              <span className="text-xs text-orange-400 font-bold flex items-center justify-center gap-1">
                                ⚡ {user.streak}d
                              </span>
                            </td>
                            <td className="p-4 text-center text-xs text-white/80">{user.tasksCompleted}</td>
                            <td className="p-4 text-right font-mono font-bold text-white">{user.xp.toLocaleString()} XP</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 2. CHATS TAB */}
            {activeTab === 'Chats' && (
              <div className="h-full grid grid-cols-1 md:grid-cols-12 border border-white/5 rounded-2xl bg-[#111118]/65 overflow-hidden animate-fade-in">
                
                {/* Chat Left pane (Friend drawer list) */}
                <div className="md:col-span-4 border-r border-white/5 flex flex-col h-full bg-[#0D0D14]/20">
                  <div className="p-4 border-b border-white/5 space-y-2">
                    <span className="text-[10px] font-black uppercase text-on-surface-variant tracking-wider block">Conversations</span>
                    <input
                      type="text"
                      placeholder="Filter conversations..."
                      value={chatSearchQuery}
                      onChange={(e) => setChatSearchQuery(e.target.value)}
                      className="w-full bg-[#111118]/80 border border-white/5 rounded-lg px-2.5 py-1.5 text-[11px] text-on-surface placeholder:text-on-surface-variant/30 focus:outline-none focus:border-primary"
                    />
                  </div>
                  
                  <div className="flex-1 overflow-y-auto no-scrollbar divide-y divide-white/5">
                    {friends.length === 0 ? (
                      <div className="p-4">
                        <EmptyState 
                          icon="groups" 
                          title="No friends yet" 
                          description="Follow peers to start private DMs." 
                        />
                      </div>
                    ) : (
                      (() => {
                        const filteredFriends = friends.filter(friendId => {
                          const userObj = allUsers.find(u => u.userId === friendId);
                          if (!userObj) return false;
                          return userObj.fullName.toLowerCase().includes(chatSearchQuery.toLowerCase()) ||
                                 userObj.username.toLowerCase().includes(chatSearchQuery.toLowerCase());
                        });

                        if (filteredFriends.length === 0) {
                          return <p className="text-xs text-on-surface-variant italic p-4 text-center">No friends match "{chatSearchQuery}"</p>;
                        }

                        return filteredFriends.map((friendId) => {
                          const userObj = allUsers.find(u => u.userId === friendId);
                          if (!userObj) return null;
                          const preset = getPresetStyles(userObj.profilePicture);
                          const chatHistory = chats[friendId] || [];
                          const lastMsg = chatHistory[chatHistory.length - 1];
                          const isCurrent = activeChatFriendId === friendId;

                          // Online status check
                          const isOnline = presenceStates[friendId]?.online;
                          const lastSeenTime = presenceStates[friendId]?.lastSeen;

                          // Typing check
                          const friendTypingData = typingStates[friendId];
                          const isFriendTyping = friendTypingData?.typing && 
                            (Date.now() - new Date(friendTypingData.updatedAt).getTime() < 10000);

                          // Unread badge count
                          const unreadCount = chatHistory.filter(
                            (msg) => msg.senderId !== userId && !msg.seen
                          ).length;

                          return (
                            <div
                              key={friendId}
                              onClick={() => {
                                setActiveChatFriendId(friendId);
                                setReplyingTo(null);
                                setPendingAttachment(null);
                              }}
                              className={`p-4 flex items-center justify-between gap-3 cursor-pointer hover:bg-white/[0.01] transition-all relative ${
                                isCurrent ? 'bg-primary/5' : ''
                              }`}
                            >
                              {isCurrent && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />}
                              <div className="flex items-center gap-3 min-w-0">
                                <div className="relative">
                                  <div className={`w-10 h-10 rounded-full bg-gradient-to-tr ${preset.bg} flex items-center justify-center text-white shrink-0`}>
                                    <span className="material-symbols-outlined text-sm">{preset.icon}</span>
                                  </div>
                                  <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 border border-[#0D0D14] rounded-full transition-all ${
                                    isOnline ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-gray-600'
                                  }`} />
                                </div>
                                <div className="min-w-0">
                                  <h4 className="text-xs font-bold text-white leading-tight flex items-center gap-1">
                                    {userObj.fullName}
                                    {isOnline && <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping inline-block" />}
                                  </h4>
                                  {isFriendTyping ? (
                                    <p className="text-[11px] text-green-400 font-bold italic animate-pulse mt-0.5">typing...</p>
                                  ) : (
                                    <p className="text-[11px] text-on-surface-variant truncate mt-0.5 flex items-center">
                                      {lastMsg && lastMsg.senderId === userId && (
                                        lastMsg.status === 'seen' || lastMsg.seen ? (
                                          <span className="text-primary font-bold text-[9px] mr-1 shrink-0">✓✓</span>
                                        ) : lastMsg.status === 'delivered' ? (
                                          <span className="text-on-surface-variant/40 font-bold text-[9px] mr-1 shrink-0">✓✓</span>
                                        ) : (
                                          <span className="text-on-surface-variant/40 font-bold text-[9px] mr-1 shrink-0">✓</span>
                                        )
                                      )}
                                      <span className="truncate">
                                        {lastMsg ? (lastMsg.senderId === userId ? 'You: ' : '') + lastMsg.text : 'Start chatting...'}
                                      </span>
                                    </p>
                                  )}
                                </div>
                              </div>
                              
                              <div className="shrink-0 flex flex-col items-end gap-1.5">
                                <span className="text-[9px] text-on-surface-variant/65 font-mono">
                                  {lastMsg ? new Date(lastMsg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : (isOnline ? 'Active' : formatLastSeen(lastSeenTime))}
                                </span>
                                {unreadCount > 0 && (
                                  <span className="bg-primary text-white text-[9px] font-black px-1.5 py-0.5 rounded-full min-w-[18px] text-center shadow-lg shadow-primary/20 animate-bounce">
                                    {unreadCount}
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        });
                      })()
                    )}
                  </div>
                </div>

                {/* Chat Right pane (Messaging Board) */}
                <div className="md:col-span-8 flex flex-col h-full bg-[#111118]/20">
                  {activeChatFriendId ? (
                    (() => {
                      const activeFriend = allUsers.find(u => u.userId === activeChatFriendId);
                      const chatHistory = chats[activeChatFriendId] || [];
                      const preset = getPresetStyles(activeFriend?.profilePicture);

                      // Presence
                      const activeFriendPresence = presenceStates[activeChatFriendId];
                      const isActiveFriendOnline = activeFriendPresence?.online;
                      const activeFriendLastSeen = activeFriendPresence?.lastSeen;

                      // Typing
                      const friendTypingData = typingStates[activeChatFriendId];
                      const isFriendTyping = friendTypingData?.typing && 
                        (Date.now() - new Date(friendTypingData.updatedAt).getTime() < 10000);
                      
                      return (
                        <div className="flex flex-col h-full relative">
                          {/* Chat Window Header */}
                          <div className="p-4 border-b border-white/5 flex items-center justify-between bg-[#0D0D14]/25 shrink-0">
                            <div className="flex items-center gap-3">
                              <div className="relative">
                                <div className={`w-9 h-9 rounded-full bg-gradient-to-tr ${preset.bg} flex items-center justify-center text-white`}>
                                  <span className="material-symbols-outlined text-sm">{preset.icon}</span>
                                </div>
                                <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 border border-[#0D0D14] rounded-full ${
                                  isActiveFriendOnline ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-gray-600'
                                }`} />
                              </div>
                              <div className="text-left">
                                <h4 className="text-xs font-bold text-white leading-none flex items-center gap-1.5">
                                  {activeFriend?.fullName}
                                  {activeFriend && getUserTopBadges(activeFriend).map((badge, bIdx) => (
                                    <span key={bIdx} className="text-xs" title="Unlocked Badge">{badge}</span>
                                  ))}
                                </h4>
                                {isActiveFriendOnline ? (
                                  <span className="text-[10px] text-green-400 font-bold uppercase tracking-wider flex items-center gap-1 mt-1 animate-pulse">
                                    ● Online
                                  </span>
                                ) : (
                                  <span className="text-[10px] text-on-surface-variant/70 font-semibold block mt-1">
                                    {activeFriendLastSeen ? `Last seen ${formatLastSeen(activeFriendLastSeen)}` : 'Offline'}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* DM Controls */}
                            <div className="flex gap-2">
                              <button 
                                onClick={handleShareWorkspace}
                                className="p-1.5 rounded hover:bg-white/5 text-on-surface-variant hover:text-white transition-colors cursor-pointer flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-white/2 border border-white/5"
                                title="Share Collaboration Workspace"
                              >
                                <span className="material-symbols-outlined text-[16px]">groups</span>
                                Invite
                              </button>
                            </div>
                          </div>

                          {/* Message Logs */}
                          <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar bg-[#0D0D14]/10">
                             {chatHistory.length === 0 ? (
                               <EmptyState 
                                 icon="chat" 
                                 title="No messages yet" 
                                 description="Write something to say hello and start collaborating!" 
                               />
                             ) : (
                              chatHistory.map((msg, index) => {
                                const isMe = msg.senderId === userId;
                                const isGrouped = index > 0 && chatHistory[index - 1].senderId === msg.senderId;
                                const showAvatar = !isMe && !isGrouped;
                                const onlyEmojis = isOnlyEmojis(msg.text);

                                return (
                                  <div key={msg.id || index} className={`flex items-start gap-2.5 ${isMe ? 'justify-end' : 'justify-start'} ${isGrouped ? 'mt-1' : 'mt-4'}`}>
                                    
                                    {/* Left Spacer/Avatar for non-Me messages */}
                                    {!isMe && (
                                      showAvatar ? (
                                        <div className={`w-7 h-7 rounded-full bg-gradient-to-tr ${preset.bg} flex items-center justify-center text-white shrink-0 shadow-md`} title={activeFriend?.fullName}>
                                          <span className="material-symbols-outlined text-[11px]">{preset.icon}</span>
                                        </div>
                                      ) : (
                                        <div className="w-7 shrink-0" />
                                      )
                                    )}

                                    {/* Message content block */}
                                    <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[70%]`}>
                                      {!isMe && !isGrouped && (
                                        <span className="text-[10px] font-bold text-on-surface-variant/80 mb-0.5 px-1">{activeFriend?.fullName}</span>
                                      )}
                                      
                                      <div className="flex items-center gap-2 group relative">
                                        
                                        {/* Hover actions (Reply & Emoji selection) */}
                                        <div className={`opacity-0 group-hover:opacity-100 flex items-center gap-1.5 p-1 bg-[#111118] border border-white/10 rounded-full scale-90 transition-all shadow-xl absolute -top-8 ${isMe ? 'left-0' : 'right-0'} z-20`}>
                                          {['👍', '❤️', '🔥', '😂'].map(emoji => (
                                            <button 
                                              key={emoji}
                                              onClick={() => addChatReaction(activeChatFriendId, index, emoji)}
                                              className="hover:scale-125 transition-transform text-xs cursor-pointer"
                                            >
                                              {emoji}
                                            </button>
                                          ))}
                                          <div className="w-[1px] h-3.5 bg-white/10 mx-0.5" />
                                          <button
                                            type="button"
                                            onClick={() => setReplyingTo({ id: msg.id, text: msg.text, senderId: msg.senderId, senderName: isMe ? 'You' : activeFriend?.fullName })}
                                            className="hover:scale-125 transition-transform text-xs text-on-surface-variant hover:text-white cursor-pointer px-1"
                                            title="Reply"
                                          >
                                            <span className="material-symbols-outlined text-[13px] font-bold">reply</span>
                                          </button>
                                        </div>

                                        {/* Message bubble itself */}
                                        <div className={`${
                                          onlyEmojis 
                                            ? 'text-3xl p-1 bg-transparent border-none' 
                                            : `p-3 rounded-2xl text-xs font-medium leading-relaxed relative ${
                                                isMe 
                                                  ? 'bg-primary text-white rounded-br-none shadow-[0_4px_12px_rgba(139,92,246,0.15)]' 
                                                  : 'bg-white/5 border border-white/5 text-white rounded-bl-none hover:bg-white/[0.08]'
                                              }`
                                        } transition-colors duration-150`}>
                                          
                                          {/* Replying context box */}
                                          {msg.replyTo && (
                                            <div className={`p-2.5 rounded-lg text-[10px] leading-tight mb-2 border-l-2 text-left ${
                                              isMe ? 'bg-black/25 border-white/30 text-white/80' : 'bg-[#0D0D14]/60 border-primary/40 text-on-surface-variant'
                                            }`}>
                                              <div className="font-bold text-[9px] mb-0.5">{msg.replyTo.senderName}</div>
                                              <div className="truncate italic">"{msg.replyTo.text}"</div>
                                            </div>
                                          )}

                                          {/* Shared Workspace Card */}
                                          {msg.type === 'workspace' && (
                                            <div className="p-3 bg-[#0D0D14]/65 border border-primary/20 rounded-xl space-y-3 mb-2 min-w-[200px]">
                                              <div className="flex items-center gap-2">
                                                <span className="material-symbols-outlined text-primary text-base">groups</span>
                                                <span className="font-bold text-white text-[11px]">Workspace Shared</span>
                                              </div>
                                              <p className="text-[10px] text-on-surface-variant font-medium">Collaborate inside: "{msg.payload?.title || 'Shared Workspace'}"</p>
                                              <button 
                                                onClick={() => alert(`Collaborative invitation loaded for workspace ID: ${msg.payload?.wsId}`)}
                                                className="w-full bg-primary/20 border border-primary text-[10px] font-bold uppercase tracking-wider text-white py-1.5 rounded hover:bg-primary/30 transition-all cursor-pointer"
                                              >
                                                Join Node
                                              </button>
                                            </div>
                                          )}

                                          {/* Image Attachment Rendering */}
                                          {msg.type === 'image' && msg.payload?.url && (
                                            <div className="mb-2 max-w-[240px] rounded-lg overflow-hidden border border-white/5 shadow-md">
                                              <img src={msg.payload.url} alt={msg.payload.name || 'Shared Image'} className="object-cover w-full h-32 hover:scale-105 transition-transform duration-300" />
                                            </div>
                                          )}

                                          {/* File Attachment Rendering */}
                                          {msg.type === 'file' && (
                                            <div className={`p-2.5 rounded-lg flex items-center gap-2.5 mb-2 border ${
                                              isMe ? 'bg-black/15 border-white/10' : 'bg-[#0D0D14]/40 border-white/5'
                                            }`}>
                                              <span className="material-symbols-outlined text-base text-primary">description</span>
                                              <div className="min-w-0 text-left">
                                                <p className="text-[10px] font-bold text-white truncate">{msg.payload?.name || 'Shared file'}</p>
                                                <p className="text-[8px] text-on-surface-variant">PDF Document</p>
                                              </div>
                                              <button 
                                                onClick={() => alert(`Downloading attachment: ${msg.payload?.name}`)}
                                                className="p-1 rounded hover:bg-white/10 text-white shrink-0 ml-auto"
                                              >
                                                <span className="material-symbols-outlined text-sm">download</span>
                                              </button>
                                            </div>
                                          )}

                                          {/* Message text content */}
                                          {!onlyEmojis && <p className="whitespace-pre-wrap text-left break-words">{msg.text}</p>}
                                          {onlyEmojis && <p className="text-3xl select-all">{msg.text}</p>}
                                          
                                          {/* Reactions display */}
                                          {msg.reactions && msg.reactions.length > 0 && (
                                            <div className="absolute -bottom-2.5 right-2 bg-[#111118] border border-white/10 rounded-full px-1.5 py-0.5 text-[9px] flex gap-0.5 shadow-md z-10 hover:scale-110 transition-transform">
                                              {Array.from(new Set(msg.reactions)).map((r, i) => <span key={i}>{r}</span>)}
                                            </div>
                                          )}
                                        </div>
                                      </div>

                                      {/* Timestamp and delivery status */}
                                      <span className="text-[9px] text-on-surface-variant/40 font-mono mt-1 px-1 flex items-center gap-1.5">
                                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        {isMe && (
                                          msg.status === 'seen' || msg.seen ? (
                                            <span className="text-primary font-bold text-[10px]" title="Seen">✓✓</span>
                                          ) : msg.status === 'delivered' ? (
                                            <span className="text-on-surface-variant/40 font-bold text-[10px]" title="Delivered">✓✓</span>
                                          ) : (
                                            <span className="text-on-surface-variant/40 font-bold text-[10px]" title="Sent">✓</span>
                                          )
                                        )}
                                      </span>

                                    </div>
                                  </div>
                                );
                              })
                             )}

                             {/* Typing Indicator */}
                             {isFriendTyping && (
                               <div className="flex items-center gap-3 mt-4 animate-fade-in">
                                 <div className={`w-7 h-7 rounded-full bg-gradient-to-tr ${preset.bg} flex items-center justify-center text-white shrink-0 shadow-md`}>
                                   <span className="material-symbols-outlined text-[11px]">{preset.icon}</span>
                                 </div>
                                 <div className="bg-white/5 border border-white/5 px-3 py-2 rounded-2xl rounded-bl-none flex items-center gap-1.5">
                                   <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0s' }}></span>
                                   <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                                   <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                                   <span className="text-[9px] uppercase font-black text-on-surface-variant tracking-wider ml-1">{activeFriend?.fullName} is typing...</span>
                                 </div>
                               </div>
                             )}

                             <div ref={chatBottomRef} />
                          </div>

                          {/* Replying Context Bar */}
                          {replyingTo && (
                            <div className="px-4 py-2 border-t border-white/5 bg-primary/5 flex items-center justify-between gap-3 border-l-2 border-primary animate-fade-in shrink-0">
                              <div className="min-w-0 text-left">
                                <p className="text-[10px] font-bold text-primary">Replying to {replyingTo.senderName}</p>
                                <p className="text-xs text-white/70 truncate">{replyingTo.text}</p>
                              </div>
                              <button 
                                type="button" 
                                onClick={() => setReplyingTo(null)}
                                className="p-1 rounded hover:bg-white/10 text-on-surface-variant hover:text-white transition-colors"
                              >
                                <span className="material-symbols-outlined text-xs">close</span>
                              </button>
                            </div>
                          )}

                          {/* Attachment Preview Bar */}
                          {pendingAttachment && (
                            <div className="px-4 py-2 border-t border-white/5 bg-[#0D0D14]/40 flex items-center justify-between gap-3 animate-fade-in shrink-0">
                              <div className="flex items-center gap-2 min-w-0 text-left">
                                <span className="material-symbols-outlined text-primary text-base">
                                  {pendingAttachment.type === 'image' ? 'image' : 'description'}
                                </span>
                                <div className="min-w-0">
                                  <p className="text-xs font-bold text-white truncate">{pendingAttachment.name}</p>
                                  <p className="text-[10px] text-on-surface-variant">Click Send to upload</p>
                                </div>
                              </div>
                              <button 
                                type="button" 
                                onClick={() => setPendingAttachment(null)}
                                className="p-1 rounded hover:bg-white/10 text-on-surface-variant hover:text-white transition-colors"
                              >
                                <span className="material-symbols-outlined text-xs">close</span>
                              </button>
                            </div>
                          )}

                          {/* Chat Input Bar */}
                          <form onSubmit={handleSendMessage} className="p-4 border-t border-white/5 bg-[#0D0D14]/25 flex items-center gap-3 shrink-0 relative">
                            
                            {/* Inline Emoji Picker Popover */}
                            {showEmojiPicker && (
                              <div className="absolute bottom-16 left-4 bg-[#111118] border border-white/10 p-2.5 rounded-xl flex gap-2 flex-wrap max-w-[220px] shadow-2xl z-30 animate-fade-in">
                                {['👍', '❤️', '🔥', '😂', '😮', '🎉', '💡', '🚀', '👀', '💯'].map(emoji => (
                                  <button
                                    key={emoji}
                                    type="button"
                                    onClick={() => {
                                      setChatMessageText(prev => prev + emoji);
                                      setShowEmojiPicker(false);
                                    }}
                                    className="text-base p-1.5 hover:bg-white/5 rounded hover:scale-125 transition-transform cursor-pointer"
                                  >
                                    {emoji}
                                  </button>
                                ))}
                              </div>
                            )}

                            {/* Attachments buttons */}
                            <div className="flex gap-1">
                              <button 
                                type="button"
                                onClick={handleAttachImage}
                                className="p-2 rounded hover:bg-white/5 text-on-surface-variant hover:text-white transition-colors cursor-pointer"
                                title="Share Image"
                              >
                                <span className="material-symbols-outlined text-[18px]">image</span>
                              </button>
                              <button 
                                type="button"
                                onClick={handleAttachFile}
                                className="p-2 rounded hover:bg-white/5 text-on-surface-variant hover:text-white transition-colors cursor-pointer"
                                title="Share File"
                              >
                                <span className="material-symbols-outlined text-[18px]">attach_file</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                className={`p-2 rounded hover:bg-white/5 transition-colors cursor-pointer ${
                                  showEmojiPicker ? 'text-primary' : 'text-on-surface-variant hover:text-white'
                                }`}
                                title="Pick Emoji"
                              >
                                <span className="material-symbols-outlined text-[18px]">mood</span>
                              </button>
                            </div>

                            {/* Upgraded Textarea Input */}
                            <textarea
                              value={chatMessageText}
                              onChange={handleInputChange}
                              onKeyDown={handleKeyDown}
                              placeholder="Write a message... (Enter to send, Shift+Enter for new line)"
                              rows="1"
                              className="flex-grow bg-[#111118] border border-white/5 rounded-xl px-4 py-2.5 text-xs text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary resize-none min-h-[38px] max-h-[120px] no-scrollbar"
                            />
                            
                            <button
                              type="submit"
                              disabled={(!chatMessageText.trim() && !pendingAttachment) || isSending}
                              className="p-2.5 rounded-xl bg-primary text-white hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20 flex items-center justify-center cursor-pointer disabled:opacity-40"
                            >
                              {isSending ? (
                                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                              ) : (
                                <span className="material-symbols-outlined text-sm font-bold">send</span>
                              )}
                            </button>
                          </form>
                        </div>
                      );
                    })()
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full p-8">
                      <EmptyState 
                        icon="forum" 
                        title="Start a conversation" 
                        description="Select a conversation thread to view chat logs and share workspaces." 
                      />
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* 3. ADD FRIENDS TAB */}
            {activeTab === 'Add Friends' && (
              <div className="space-y-6 animate-fade-in">
                <div className="border-b border-white/5 pb-2">
                  <h3 className="text-xs uppercase font-bold text-on-surface-variant tracking-wider">Recommended Peers</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {allUsers.filter(u => u.userId !== userId && !friends.includes(u.userId)).map((user) => {
                    const preset = getPresetStyles(user.profilePicture);
                    const isRequested = sentRequests.includes(user.userId);
                    
                    return (
                      <div key={user.userId} className="bg-[#111118]/80 border border-white/5 rounded-2xl p-5 flex flex-col justify-between h-48 hover:border-primary/20 transition-all group relative">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setSelectedProfileUser(user)}>
                            <div className={`w-11 h-11 rounded-full bg-gradient-to-tr ${preset.bg} flex items-center justify-center text-white shrink-0`}>
                              <span className="material-symbols-outlined text-lg">{preset.icon}</span>
                            </div>
                            <div className="min-w-0">
                              <h4 className="text-xs font-bold text-white leading-tight flex items-center gap-1">
                                {user.fullName}
                                <span className="text-[8px] text-on-surface-variant bg-white/5 px-1 rounded font-mono uppercase shrink-0">{user.userId}</span>
                              </h4>
                              <p className="text-[10px] text-on-surface-variant mt-0.5 truncate">{user.username}</p>
                              <p className="text-[9px] text-on-surface-variant font-medium mt-1 truncate">{user.university}</p>
                            </div>
                          </div>
                        </div>

                        <p className="text-[11px] text-on-surface-variant/80 italic leading-relaxed line-clamp-2 mt-2">
                          "{user.bio}"
                        </p>

                        <div className="border-t border-white/5 pt-4 mt-3 flex justify-end">
                          {isRequested ? (
                            <span className="text-[10px] text-on-surface-variant font-bold px-3 py-1.5 bg-[#0D0D14] border border-white/5 rounded-lg">Requested</span>
                          ) : (
                            <button
                              onClick={() => sendFollowRequest(user.userId)}
                              className="px-3.5 py-1.5 bg-primary/20 border border-primary text-white text-[10px] font-bold uppercase tracking-wider rounded-lg hover:bg-primary/30 transition-all cursor-pointer"
                            >
                              Follow Request
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 4. REQUESTS TAB */}
            {activeTab === 'Requests' && (
              <div className="space-y-6 animate-fade-in">
                <div className="border-b border-white/5 pb-2">
                  <h3 className="text-xs uppercase font-bold text-on-surface-variant tracking-wider">Follow Requests Inbox</h3>
                </div>

                {incomingRequests.length === 0 ? (
                  <div className="bg-[#111118]/50 border border-white/5 rounded-2xl p-16 text-center space-y-3">
                    <span className="material-symbols-outlined text-on-surface-variant/30 text-5xl">person_add_disabled</span>
                    <p className="text-on-surface-variant text-sm italic font-medium">No pending follow requests.</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-w-xl mx-auto">
                    {incomingRequests.map((req) => {
                      const userObj = allUsers.find(u => u.userId === req.meta.senderId);
                      const preset = getPresetStyles(userObj?.profilePicture);
                      
                      return (
                        <div key={req.id} className="p-4 bg-[#111118] border border-white/5 rounded-xl flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setSelectedProfileUser(userObj)}>
                            <div className={`w-10 h-10 rounded-full bg-gradient-to-tr ${preset.bg} flex items-center justify-center text-white shrink-0`}>
                              <span className="material-symbols-outlined text-sm">{preset.icon}</span>
                            </div>
                            <div>
                              <h4 className="text-xs font-bold text-white leading-none">{userObj ? userObj.fullName : 'Someone'}</h4>
                              <p className="text-[10px] text-on-surface-variant mt-1">{userObj?.username} · {userObj?.university}</p>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={() => acceptFollowRequest(req.id)}
                              className="px-3.5 py-1.5 bg-primary border border-primary text-white text-xs font-bold rounded-lg hover:scale-105 transition-all cursor-pointer"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => rejectFollowRequest(req.id)}
                              className="px-3.5 py-1.5 bg-white/5 border border-white/10 text-on-surface text-xs font-bold rounded-lg hover:bg-white/10 transition-all cursor-pointer"
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

          </div>

        </div>
      </main>

      {/* ================= PRIVACY PROTECTED FRIEND PROFILE MODAL ================= */}
      <Modal
        isOpen={selectedProfileUser !== null}
        onClose={() => setSelectedProfileUser(null)}
        title="Friend Profile View"
      >
        {selectedProfileUser && (() => {
          const preset = getPresetStyles(selectedProfileUser.profilePicture);
          const isFriend = friends.includes(selectedProfileUser.userId);
          
          return (
            <div className="space-y-6">
              
              {/* Profile Card Header */}
              <div className="flex items-center gap-4 bg-[#0D0D14] border border-white/5 p-5 rounded-xl">
                <div className={`w-16 h-16 rounded-full bg-gradient-to-tr ${preset.bg} flex items-center justify-center text-white shrink-0 shadow-xl`}>
                  <span className="material-symbols-outlined text-2xl font-bold">{preset.icon}</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white leading-tight flex items-center gap-1.5">
                    {selectedProfileUser.fullName}
                    {getUserTopBadges(selectedProfileUser).map((badge, bIdx) => (
                      <span key={bIdx} className="text-xs" title="Unlocked Badge">{badge}</span>
                    ))}
                  </h3>
                  <p className="text-xs text-on-surface-variant font-medium mt-0.5">{selectedProfileUser.username} · {selectedProfileUser.university}</p>
                  <div className="flex items-center gap-1.5 mt-2 bg-white/5 border border-white/5 px-2 py-0.5 rounded w-max text-[9px] font-mono text-on-surface-variant uppercase">
                    User ID: {selectedProfileUser.userId}
                  </div>
                </div>
              </div>

              {/* Bio & Achievements */}
              <div className="space-y-2">
                <label className="block text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">Bio</label>
                <p className="text-xs text-on-surface leading-relaxed italic bg-white/2 border border-white/5 p-3 rounded-lg">
                  "{selectedProfileUser.bio || 'No profile bio provided.'}"
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#0D0D14] border border-white/5 p-3.5 rounded-lg">
                  <span className="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider block mb-1">XP Level</span>
                  <span className="text-base font-bold text-white">{selectedProfileUser.xp.toLocaleString()} XP</span>
                </div>
                <div className="bg-[#0D0D14] border border-white/5 p-3.5 rounded-lg">
                  <span className="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider block mb-1">Streak</span>
                  <span className="text-base font-bold text-orange-400">🔥 {selectedProfileUser.streak} Days</span>
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">Achievements ({selectedProfileUser.achievements?.length || 0})</label>
                <div className="flex flex-wrap gap-2">
                  {selectedProfileUser.achievements && selectedProfileUser.achievements.length > 0 ? (
                    selectedProfileUser.achievements.map((ach) => (
                      <span key={ach} className="bg-primary/5 border border-primary/20 text-primary px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-sm">workspace_premium</span>
                        {ach}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-on-surface-variant italic">No achievements unlocked yet.</span>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">Public Skills ({selectedProfileUser.skills?.length || 0})</label>
                <div className="flex flex-wrap gap-1.5">
                  {selectedProfileUser.skills?.map((skill) => (
                    <span key={skill} className="bg-white/5 border border-white/5 px-2.5 py-1 rounded text-xs font-semibold text-white/90">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Private notice */}
              <div className="p-3 bg-yellow-500/5 border border-yellow-500/10 rounded-lg flex items-center gap-2.5 text-[10px] text-yellow-400 font-semibold leading-tight">
                <span className="material-symbols-outlined text-[16px]">lock</span>
                Personal goals, private workspaces, exams, and tasks are hidden for privacy.
              </div>

              <div className="flex justify-end pt-4 border-t border-white/5 gap-3">
                {isFriend ? (
                  <Button
                    variant="ghost"
                    onClick={() => {
                      unfollowFriend(selectedProfileUser.userId);
                      setSelectedProfileUser(null);
                    }}
                    className="text-red-400 hover:text-red-300"
                  >
                    Unfollow Peer
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    onClick={() => {
                      sendFollowRequest(selectedProfileUser.userId);
                      setSelectedProfileUser(null);
                    }}
                  >
                    Send Follow Request
                  </Button>
                )}
                <Button variant="secondary" onClick={() => setSelectedProfileUser(null)}>
                  Close View
                </Button>
              </div>

            </div>
          );
        })()}
      </Modal>

    </div>
  );
};

export default Friends;
