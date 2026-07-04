import React, { createContext, useState, useEffect, useRef } from 'react';
import { auth, db, googleProvider } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { 
  doc, 
  collection, 
  query, 
  where, 
  onSnapshot, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDoc, 
  getDocs,
  orderBy,
  writeBatch
} from 'firebase/firestore';


export const TaskContext = createContext();

const todayStr = new Date().toISOString().split('T')[0];
const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];
const yesterdayStr = new Date(Date.now() - 86400000).toISOString().split('T')[0];


// ROADMAP GENERATOR HELPER

export const getDefaultRoadmapForCategory = (cat) => {
  const isLanguageOrTech = [
    'JavaScript', 'Python', 'Java', 'C++', 'C', 'TypeScript', 'Go', 'Rust', 'Kotlin', 'SQL', 'React', 'NodeJS', 'Node.js'
  ].includes(cat);

  if (isLanguageOrTech) {
    return {
      id: `${cat.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
      title: cat,
      topics: [
        {
          id: 'basics',
          title: 'Basics',
          expanded: true,
          subtopics: [
            { id: 'b-1', title: 'Variables', done: false },
            { id: 'b-2', title: 'Datatypes', done: false },
            { id: 'b-3', title: 'Operators', done: false },
            { id: 'b-4', title: 'Functions', done: false }
          ]
        },
        {
          id: 'inter',
          title: 'Intermediate',
          expanded: false,
          subtopics: [
            { id: 'i-1', title: 'Arrays', done: false },
            { id: 'i-2', title: 'Objects', done: false },
            { id: 'i-3', title: 'DOM', done: false },
            { id: 'i-4', title: 'Events', done: false }
          ]
        },
        {
          id: 'adv',
          title: 'Advanced',
          expanded: false,
          subtopics: [
            { id: 'a-1', title: 'Async JS', done: false },
            { id: 'a-2', title: 'Fetch API', done: false },
            { id: 'a-3', title: 'ES6', done: false },
            { id: 'a-4', title: 'Projects', done: false }
          ]
        }
      ]
    };
  }

  switch (cat) {
    case 'Web Development':
      return {
        id: `web-dev-${Date.now()}`,
        title: 'Web Development',
        topics: [
          {
            id: 'html',
            title: 'HTML',
            expanded: true,
            subtopics: [
              { id: 'html-1', title: 'Introduction', done: true },
              { id: 'html-2', title: 'Basic Structure', done: true },
              { id: 'html-3', title: 'Headings', done: true },
              { id: 'html-4', title: 'Paragraphs', done: true },
              { id: 'html-5', title: 'Lists', done: true },
              { id: 'html-6', title: 'Tables', done: true },
              { id: 'html-7', title: 'Forms', done: true },
              { id: 'html-8', title: 'Semantic Tags', done: false },
              { id: 'html-9', title: 'Audio Video', done: false },
              { id: 'html-10', title: 'SEO Basics', done: false }
            ]
          },
          {
            id: 'css',
            title: 'CSS',
            expanded: false,
            subtopics: [
              { id: 'css-1', title: 'Selectors', done: true },
              { id: 'css-2', title: 'Box Model', done: true },
              { id: 'css-3', title: 'Positioning', done: true },
              { id: 'css-4', title: 'Flexbox', done: false },
              { id: 'css-5', title: 'Grid', done: false },
              { id: 'css-6', title: 'Responsive Design', done: false },
              { id: 'css-7', title: 'Animations', done: false },
              { id: 'css-8', title: 'Transitions', done: false },
              { id: 'css-9', title: 'Media Queries', done: false }
            ]
          },
          {
            id: 'js',
            title: 'JavaScript',
            expanded: false,
            subtopics: [
              { id: 'js-1', title: 'Variables', done: false },
              { id: 'js-2', title: 'Data Types', done: false },
              { id: 'js-3', title: 'Operators', done: false },
              { id: 'js-4', title: 'Functions', done: false },
              { id: 'js-5', title: 'Arrays', done: false },
              { id: 'js-6', title: 'Objects', done: false },
              { id: 'js-7', title: 'DOM', done: false },
              { id: 'js-8', title: 'Events', done: false },
              { id: 'js-9', title: 'Async JavaScript', done: false },
              { id: 'js-10', title: 'Fetch API', done: false },
              { id: 'js-11', title: 'ES6', done: false },
              { id: 'js-12', title: 'Projects', done: false }
            ]
          },
          {
            id: 'react',
            title: 'React',
            expanded: false,
            subtopics: [
              { id: 'react-1', title: 'Components', done: false },
              { id: 'react-2', title: 'Props', done: false },
              { id: 'react-3', title: 'State', done: false },
              { id: 'react-4', title: 'Hooks', done: false },
              { id: 'react-5', title: 'Routing', done: false },
              { id: 'react-6', title: 'API Calls', done: false }
            ]
          }
        ]
      };
    case 'DSA':
      return {
        id: `dsa-${Date.now()}`,
        title: 'DSA',
        topics: [
          { id: 'arrays', title: 'Arrays', expanded: true, subtopics: [{ id: 'arr-1', title: 'Kadane\'s Algorithm', done: false }, { id: 'arr-2', title: 'Two Pointers', done: false }] },
          { id: 'strings', title: 'Strings', expanded: false, subtopics: [{ id: 'str-1', title: 'Anagrams', done: false }, { id: 'str-2', title: 'Palindromes', done: false }] },
          { id: 'recursion', title: 'Recursion', expanded: false, subtopics: [{ id: 'rec-1', title: 'Backtracking', done: false }] },
          { id: 'linkedlists', title: 'Linked Lists', expanded: false, subtopics: [{ id: 'll-1', title: 'Reverse List', done: false }] },
          { id: 'stack', title: 'Stack', expanded: false, subtopics: [{ id: 'st-1', title: 'Valid Parentheses', done: false }] },
          { id: 'queue', title: 'Queue', expanded: false, subtopics: [{ id: 'qu-1', title: 'Queue using Stacks', done: false }] },
          { id: 'trees', title: 'Trees', expanded: false, subtopics: [{ id: 'tr-1', title: 'Binary Trees', done: false }] },
          { id: 'graphs', title: 'Graphs', expanded: false, subtopics: [{ id: 'gr-1', title: 'DFS and BFS', done: false }] },
          { id: 'dp', title: 'Dynamic Programming', expanded: false, subtopics: [{ id: 'dp-1', title: 'Knapsack 0/1', done: false }] }
        ]
      };
    case 'Python':
      return {
        id: `python-${Date.now()}`,
        title: 'Python',
        topics: [
          { id: 'py-basics', title: 'Basics', expanded: true, subtopics: [{ id: 'pyb-1', title: 'Variables & Loops', done: false }] },
          { id: 'py-oop', title: 'OOP', expanded: false, subtopics: [{ id: 'pyo-1', title: 'Inheritance & Polymorphism', done: false }] },
          { id: 'py-funcs', title: 'Functions', expanded: false, subtopics: [{ id: 'pyf-1', title: 'Lambda & Decorators', done: false }] },
          { id: 'py-mods', title: 'Modules', expanded: false, subtopics: [{ id: 'pym-1', title: 'pip & Venv', done: false }] },
          { id: 'py-files', title: 'File Handling', expanded: false, subtopics: [{ id: 'pyfi-1', title: 'Read & Write Text', done: false }] },
          { id: 'py-except', title: 'Exception Handling', expanded: false, subtopics: [{ id: 'pye-1', title: 'Try Except Blocks', done: false }] },
          { id: 'py-dsa', title: 'DSA with Python', expanded: false, subtopics: [{ id: 'pyd-1', title: 'Lists, Dicts, Sets', done: false }] },
          { id: 'py-libs', title: 'Libraries', expanded: false, subtopics: [{ id: 'pyl-1', title: 'NumPy & Pandas', done: false }] }
        ]
      };
    case 'Java':
      return {
        id: `java-${Date.now()}`,
        title: 'Java',
        topics: [
          { id: 'java-basics', title: 'Basics', expanded: true, subtopics: [{ id: 'javb-1', title: 'JVM, JRE, JDK', done: false }, { id: 'javb-2', title: 'Data Types', done: false }] },
          { id: 'java-oop', title: 'OOP', expanded: false, subtopics: [{ id: 'javo-1', title: 'Classes & Interfaces', done: false }] },
          { id: 'java-except', title: 'Exception Handling', expanded: false, subtopics: [{ id: 'jave-1', title: 'Try-catch throw', done: false }] },
          { id: 'java-coll', title: 'Collections Framework', expanded: false, subtopics: [{ id: 'javc-1', title: 'List, Set, Map APIs', done: false }] },
          { id: 'java-thread', title: 'Multithreading', expanded: false, subtopics: [{ id: 'javt-1', title: 'Runnable & ExecutorService', done: false }] },
          { id: 'java-jdbc', title: 'JDBC', expanded: false, subtopics: [{ id: 'javj-1', title: 'SQL Connections', done: false }] }
        ]
      };
    case 'AI/ML':
      return {
        id: `aiml-${Date.now()}`,
        title: 'AI/ML',
        topics: [
          { id: 'aiml-basics', title: 'Basics of AI', expanded: true, subtopics: [{ id: 'mlb-1', title: 'Supervised vs Unsupervised', done: false }] },
          { id: 'aiml-regr', title: 'Linear Regression', expanded: false, subtopics: [{ id: 'mlr-1', title: 'Cost Functions & Gradient Descent', done: false }] },
          { id: 'aiml-trees', title: 'Decision Trees', expanded: false, subtopics: [{ id: 'mlt-1', title: 'Random Forests', done: false }] },
          { id: 'aiml-deep', title: 'Deep Learning', expanded: false, subtopics: [{ id: 'mld-1', title: 'CNNs & RNNs', done: false }] },
          { id: 'aiml-nlp', title: 'NLP', expanded: false, subtopics: [{ id: 'mln-1', title: 'Tokenization & Embeddings', done: false }] },
          { id: 'aiml-llms', title: 'LLMs', expanded: false, subtopics: [{ id: 'mll-1', title: 'Transformers & Fine-Tuning', done: false }] }
        ]
      };
    case 'DevOps':
      return {
        id: `devops-${Date.now()}`,
        title: 'DevOps',
        topics: [
          { id: 'do-git', title: 'Git & GitHub', expanded: true, subtopics: [{ id: 'dog-1', title: 'Branching & Rebase', done: false }] },
          { id: 'do-docker', title: 'Docker', expanded: false, subtopics: [{ id: 'dod-1', title: 'Containers & Dockerfiles', done: false }] },
          { id: 'do-k8s', title: 'Kubernetes', expanded: false, subtopics: [{ id: 'dok-1', title: 'Pods, Services, Deployments', done: false }] },
          { id: 'do-cicd', title: 'CI/CD Pipelines', expanded: false, subtopics: [{ id: 'doci-1', title: 'GitHub Actions', done: false }] },
          { id: 'do-aws', title: 'AWS Basics', expanded: false, subtopics: [{ id: 'doa-1', title: 'EC2 & S3 Buckets', done: false }] },
          { id: 'do-linux', title: 'Linux', expanded: false, subtopics: [{ id: 'dol-1', title: 'Bash Scripts & Cron', done: false }] }
        ]
      };
    case 'Fitness':
    case 'Gym':
      return {
        id: `fitness-${Date.now()}`,
        title: 'Peak Fitness',
        topics: [
          { id: 'fit-workout', title: 'Workout Splits', expanded: true, subtopics: [{ id: 'fitw-1', title: 'Push Pull Legs split', done: false }, { id: 'fitw-2', title: 'Hypertrophy volume routines', done: false }] },
          { id: 'fit-cardio', title: 'Cardio Habits', expanded: false, subtopics: [{ id: 'fitc-1', title: 'High Intensity Intervals (HIIT)', done: false }] },
          { id: 'fit-diet', title: 'Diet & Macros', expanded: false, subtopics: [{ id: 'fitd-1', title: 'Tracking proteins & carbs', done: false }] }
        ]
      };
    case 'Startup':
      return {
        id: `startup-${Date.now()}`,
        title: 'Startup',
        topics: [
          { id: 'st-ideation', title: 'Ideation', expanded: true, subtopics: [{ id: 'sti-1', title: 'Problem validation', done: false }] },
          { id: 'st-mvp', title: 'MVP Development', expanded: false, subtopics: [{ id: 'stm-1', title: 'High fidelity mockups', done: false }, { id: 'stm-2', title: 'Interactive logic build', done: false }] },
          { id: 'st-landing', title: 'Landing Page', expanded: false, subtopics: [{ id: 'stl-1', title: 'Conversion rates optimization', done: false }] },
          { id: 'st-launch', title: 'Launch & Traction', expanded: false, subtopics: [{ id: 'stla-1', title: 'Product Hunt Launch', done: false }] }
        ]
      };
    default:
      return {
        id: `personal-${Date.now()}`,
        title: cat || 'Personal Growth',
        topics: [
          { id: 'per-books', title: 'Book reading list', expanded: true, subtopics: [{ id: 'perb-1', title: 'Read Atomic Habits', done: false }] },
          { id: 'per-morning', title: 'Morning routines', expanded: false, subtopics: [{ id: 'perm-1', title: '20 minutes meditation', done: false }] }
        ]
      };
  }
};


export const TaskProvider = ({ children }) => {
  // Authentication & Profile loading states
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(() => {
    const cached = localStorage.getItem('cache_userProfile');
    return cached ? JSON.parse(cached) : null;
  });
  const [isOnboarded, setIsOnboarded] = useState(() => {
    return localStorage.getItem('isOnboarded') === 'true';
  });
  const [loading, setLoading] = useState(true);

  // Firestore synced state variables
  const [tasks, setTasks] = useState(() => {
    const cached = localStorage.getItem('cache_tasks');
    return cached ? JSON.parse(cached) : [];
  });
  const [exams, setExams] = useState(() => {
    const cached = localStorage.getItem('cache_exams');
    return cached ? JSON.parse(cached) : [];
  });
  const [assignments, setAssignments] = useState(() => {
    const cached = localStorage.getItem('cache_assignments');
    return cached ? JSON.parse(cached) : [];
  });
  const [workspaces, setWorkspaces] = useState(() => {
    const cached = localStorage.getItem('cache_workspaces');
    return cached ? JSON.parse(cached) : [];
  });
  const [allUsers, setAllUsers] = useState([]);
  const [friends, setFriends] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [chats, setChats] = useState({});
  const [collaborators, setCollaborators] = useState({});
  const [presenceStates, setPresenceStates] = useState({});
  const [typingStates, setTypingStates] = useState({});
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'Public',
    showSkills: 'Everyone',
    showXP: 'Everyone',
    allowRequests: 'Everyone',
    allowCollaborations: 'Friends'
  });

  const msgListenersRef = useRef({});

  // Caching updates to localStorage
  useEffect(() => {
    if (userProfile) localStorage.setItem('cache_userProfile', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    if (tasks.length > 0) localStorage.setItem('cache_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    if (exams.length > 0) localStorage.setItem('cache_exams', JSON.stringify(exams));
  }, [exams]);

  useEffect(() => {
    if (assignments.length > 0) localStorage.setItem('cache_assignments', JSON.stringify(assignments));
  }, [assignments]);

  useEffect(() => {
    if (workspaces.length > 0) localStorage.setItem('cache_workspaces', JSON.stringify(workspaces));
  }, [workspaces]);

  const getYesterdayStr = (dateStr) => {
    const date = new Date(dateStr + 'T00:00:00');
    date.setDate(date.getDate() - 1);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const checkAndResetStreak = async (uid, profile) => {
    if (!uid || !profile) return;
    const tzOffset = new Date().getTimezoneOffset() * 60000;
    const localISOTime = new Date(Date.now() - tzOffset).toISOString();
    const todayStr = localISOTime.split('T')[0];

    const lastActivityDate = profile.lastActivityDate || '';
    if (lastActivityDate && lastActivityDate !== todayStr && lastActivityDate !== getYesterdayStr(todayStr)) {
      if (profile.currentStreak !== 0 || profile.streak !== 0) {
        await updateDoc(doc(db, 'users', uid), {
          currentStreak: 0,
          streak: 0
        });
        if (profile.userId) {
          await setDoc(doc(db, 'leaderboards', profile.userId), {
            streak: 0
          }, { merge: true });
        }
      }
    }
  };

  const logProductiveActivity = async (activityType) => {
    if (!currentUser || !userProfile) return;
    const uid = currentUser.uid;
    const userRef = doc(db, 'users', uid);
    
    const tzOffset = new Date().getTimezoneOffset() * 60000;
    const localISOTime = new Date(Date.now() - tzOffset).toISOString();
    const todayStr = localISOTime.split('T')[0];

    const activityHistory = userProfile.activityHistory || {};
    const currentCount = activityHistory[todayStr] || 0;
    const updatedHistory = {
      ...activityHistory,
      [todayStr]: currentCount + 1
    };

    let currentStreak = userProfile.currentStreak || 0;
    let highestStreak = userProfile.highestStreak || 0;
    const lastActivityDate = userProfile.lastActivityDate || '';

    if (lastActivityDate === todayStr) {
      // Already active today, streak remains same
    } else if (lastActivityDate === getYesterdayStr(todayStr)) {
      currentStreak += 1;
    } else {
      currentStreak = 1;
    }

    if (currentStreak > highestStreak) {
      highestStreak = currentStreak;
    }

    const newXp = (userProfile.xp || 0) + 15;

    await updateDoc(userRef, {
      currentStreak,
      highestStreak,
      streak: currentStreak,
      lastActivityDate: todayStr,
      activityHistory: updatedHistory,
      xp: newXp
    });

    if (userProfile.userId) {
      await setDoc(doc(db, 'leaderboards', userProfile.userId), {
        xp: newXp,
        streak: currentStreak
      }, { merge: true });
    }
  };

  // 1. Auth state observer
  useEffect(() => {
    const handleUser = async (user) => {
      setCurrentUser(user);
      if (user) {
        // Listen to active user's profile doc in Firestore
        const profileRef = doc(db, 'users', user.uid);
        const unsubscribeProfile = onSnapshot(profileRef, (docSnap) => {
          if (docSnap.exists()) {
            const profileData = docSnap.data();
            setUserProfile(profileData);
            setIsOnboarded(true);
            localStorage.setItem('isOnboarded', 'true');
            checkAndResetStreak(user.uid, profileData);
          } else {
            setUserProfile(null);
            setIsOnboarded(false);
            localStorage.setItem('isOnboarded', 'false');
          }
          setLoading(false);
        }, (error) => {
          console.error("Profile listen error:", error);
          setLoading(false);
        });

        return () => {
          unsubscribeProfile();
        };
      } else {
        setUserProfile(null);
        setIsOnboarded(false);
        setLoading(false);
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('isOnboarded');
      }
    };

    const unsubscribe = onAuthStateChanged(auth, handleUser);
    return () => unsubscribe();
  }, []);

  // Apply theme from localStorage instantly on mount to avoid flashes
  useEffect(() => {
    const cachedTheme = localStorage.getItem('themePreference') || 'cyberpunk';
    document.documentElement.setAttribute('data-theme', cachedTheme);
  }, []);

  // Update theme in localStorage & document element when userProfile changes
  useEffect(() => {
    if (userProfile?.themePreference) {
      localStorage.setItem('themePreference', userProfile.themePreference);
      document.documentElement.setAttribute('data-theme', userProfile.themePreference);
    }
  }, [userProfile?.themePreference]);

  // Presence heartbeat & unload hook
  useEffect(() => {
    if (!currentUser || !userProfile || !userProfile.userId) return;
    
    const presenceRef = doc(db, 'presence', userProfile.userId);
    let lastActivity = Date.now();
    let currentStatus = 'online';

    const updatePresenceInFirestore = async (newStatus) => {
      currentStatus = newStatus;
      try {
        await setDoc(presenceRef, {
          status: newStatus,
          lastSeen: new Date().toISOString()
        }, { merge: true });
      } catch (err) {
        console.error("Error setting presence:", err);
      }
    };

    const handleActivity = () => {
      lastActivity = Date.now();
      if (currentStatus === 'away') {
        updatePresenceInFirestore('online');
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        updatePresenceInFirestore('away');
      } else {
        updatePresenceInFirestore('online');
      }
    };

    // Add activity listeners
    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('click', handleActivity);
    window.addEventListener('scroll', handleActivity);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Initial online write
    updatePresenceInFirestore('online');

    // Heartbeat every 15 seconds
    const heartbeatInterval = setInterval(() => {
      const inactiveDuration = Date.now() - lastActivity;
      if (inactiveDuration > 120000 && currentStatus === 'online') {
        // Inactive for > 2 mins
        updatePresenceInFirestore('away');
      } else if (document.visibilityState === 'hidden' && currentStatus === 'online') {
        updatePresenceInFirestore('away');
      } else {
        // Send heartbeat
        updatePresenceInFirestore(currentStatus);
      }
    }, 15000);

    const setOffline = async () => {
      try {
        await setDoc(presenceRef, {
          status: 'offline',
          lastSeen: new Date().toISOString()
        }, { merge: true });
      } catch (err) {
        console.error("Error setting presence offline:", err);
      }
    };

    const handleUnload = () => {
      setOffline();
    };

    window.addEventListener('beforeunload', handleUnload);

    return () => {
      clearInterval(heartbeatInterval);
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('click', handleActivity);
      window.removeEventListener('scroll', handleActivity);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleUnload);
      setOffline();
    };
  }, [currentUser, userProfile?.userId]);

  // Logout method that updates presence to offline instantly
  const logout = async () => {
    if (currentUser && userProfile?.userId) {
      try {
        const presenceRef = doc(db, 'presence', userProfile.userId);
        await setDoc(presenceRef, {
          status: 'offline',
          lastSeen: new Date().toISOString()
        }, { merge: true });
      } catch (err) {
        console.error("Error setting presence offline during logout:", err);
      }
    }
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Error signing out:", err);
    }
  };

  // 2. Real-time Firestore sync of user collections
  useEffect(() => {
    if (!currentUser || !userProfile) {
      setTasks([]);
      setExams([]);
      setAssignments([]);
      setWorkspaces([]);
      setNotifications([]);
      setFriends([]);
      setSentRequests([]);
      setChats({});
      setAllUsers([]);
      setPresenceStates({});
      setTypingStates({});
      // Clean up any message subcollection listeners
      Object.values(msgListenersRef.current).forEach((unsub) => unsub());
      msgListenersRef.current = {};
      return;
    }

    const uid = currentUser.uid;

    // A. Fetch all users once instead of subscribing to all updates (Optimizing Firestore Reads)
    const fetchUsersOnce = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'users'));
        const list = [];
        snapshot.forEach((docSnap) => {
          list.push({ uid: docSnap.id, ...docSnap.data() });
        });
        setAllUsers(list);
      } catch (err) {
        console.error("Error fetching users list:", err);
      }
    };
    fetchUsersOnce();

    // B. Listen to tasks (both personal & workspace tasks)
    const tasksQuery = query(collection(db, 'tasks'), where('userId', '==', uid));
    const unsubscribeTasks = onSnapshot(tasksQuery, (snapshot) => {
      const list = [];
      snapshot.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...docSnap.data() });
      });
      setTasks(list);
    });

    // C. Listen to exams
    const examsQuery = query(collection(db, 'exams'), where('userId', '==', uid));
    const unsubscribeExams = onSnapshot(examsQuery, (snapshot) => {
      const list = [];
      snapshot.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...docSnap.data() });
      });
      setExams(list);
    });

    // D. Listen to assignments
    const assignQuery = query(collection(db, 'assignments'), where('userId', '==', uid));
    const unsubscribeAssign = onSnapshot(assignQuery, (snapshot) => {
      const list = [];
      snapshot.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...docSnap.data() });
      });
      setAssignments(list);
    });

    // E. Listen to workspaces
    const wsQuery = query(collection(db, 'workspaces'), where('ownerId', '==', uid));
    const unsubscribeWs = onSnapshot(wsQuery, (snapshot) => {
      const list = [];
      snapshot.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...docSnap.data() });
      });
      setWorkspaces(list);
    });

    // F. Listen to notifications
    const notifQuery = query(collection(db, 'notifications'), where('userId', '==', uid));
    const unsubscribeNotif = onSnapshot(notifQuery, (snapshot) => {
      const list = [];
      snapshot.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...docSnap.data() });
      });
      setNotifications(list);
    });

    // G. Listen to friendships (friends collection)
    const friendsQuery = query(collection(db, 'friends'), where('uids', 'array-contains', uid));
    const unsubscribeFriends = onSnapshot(friendsQuery, (snapshot) => {
      const friendList = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        const friendUserId = data.userIds.find(id => id !== userProfile.userId);
        if (friendUserId) friendList.push(friendUserId);
      });
      setFriends(friendList);
    });

    // H. Listen to sent friend requests (to maintain sentRequests state)
    const sentReqsQuery = query(
      collection(db, 'friendRequests'), 
      where('senderUid', '==', uid), 
      where('status', '==', 'pending')
    );
    const unsubscribeSentReqs = onSnapshot(sentReqsQuery, (snapshot) => {
      const list = [];
      snapshot.forEach((docSnap) => {
        list.push(docSnap.data().receiverUserId);
      });
      setSentRequests(list);
    });

    // I. Listen to active chats and their messages subcollections
    const chatsQuery = query(collection(db, 'chats'), where('uids', 'array-contains', uid));
    const unsubscribeChats = onSnapshot(chatsQuery, (snapshot) => {
      snapshot.forEach((chatDoc) => {
        const chatData = chatDoc.data();
        const chatRoomId = chatDoc.id;
        const friendUserId = chatData.userIds.find(id => id !== userProfile.userId);
        if (!friendUserId) return;

        if (!msgListenersRef.current[chatRoomId]) {
          const msgQuery = query(
            collection(db, `chats/${chatRoomId}/messages`), 
            orderBy('timestamp', 'asc')
          );
          msgListenersRef.current[chatRoomId] = onSnapshot(msgQuery, (msgSnapshot) => {
            const msgs = [];
            const batch = writeBatch(db);
            let hasDeliveryUpdate = false;

            msgSnapshot.forEach((mDoc) => {
              const data = mDoc.data();
              const msgId = mDoc.id;

              // Mark as delivered if received by us but marked as 'sent'
              if (data.senderId !== userProfile.userId && data.status === 'sent') {
                batch.update(doc(db, `chats/${chatRoomId}/messages`, msgId), { status: 'delivered' });
                hasDeliveryUpdate = true;
                data.status = 'delivered';
              }

              msgs.push({ id: msgId, ...data });
            });

            if (hasDeliveryUpdate) {
              batch.commit().catch(err => console.error("Error setting delivered status:", err));
            }

            setChats(prev => ({
              ...prev,
              [friendUserId]: msgs
            }));
          });
        }
      });
    });

    // J. Listen to presence
    const presenceQuery = collection(db, 'presence');
    const unsubscribePresence = onSnapshot(presenceQuery, (snapshot) => {
      const states = {};
      snapshot.forEach((docSnap) => {
        states[docSnap.id] = docSnap.data();
      });
      setPresenceStates(states);
    });

    // K. Listen to typing status
    const typingQuery = collection(db, 'typingStatus');
    const unsubscribeTyping = onSnapshot(typingQuery, (snapshot) => {
      const states = {};
      snapshot.forEach((docSnap) => {
        states[docSnap.id] = docSnap.data();
      });
      setTypingStates(states);
    });

    return () => {
      unsubscribeTasks();
      unsubscribeExams();
      unsubscribeAssign();
      unsubscribeWs();
      unsubscribeNotif();
      unsubscribeFriends();
      unsubscribeSentReqs();
      unsubscribeChats();
      unsubscribePresence();
      unsubscribeTyping();
      // Clean up message listeners
      Object.values(msgListenersRef.current).forEach((unsub) => unsub());
      msgListenersRef.current = {};
    };
  }, [currentUser, userProfile]);

  // Trigger badge updates in Firestore based on actual user metrics
  useEffect(() => {
    if (!currentUser || !userProfile) return;
    
    const unlockedBadges = [];
    const xp = userProfile.xp || 0;
    const streak = userProfile.streak || 0;
    const totalCompletedTasks = tasks.filter(t => t.done).length;
    const workspaceCount = workspaces.length;
    const completedFocusTasks = tasks.filter(t => t.isPinned && t.done).length;
    const completedHtmlTasks = tasks.filter(t => t.done && t.text.toLowerCase().includes('html')).length;
    
    // Check ranking
    const leaderboardList = [...allUsers].sort((a, b) => (b.xp || 0) - (a.xp || 0));
    const myIndex = leaderboardList.findIndex(u => u.userId === userProfile.userId);
    const rank = (xp > 0 && myIndex !== -1) ? myIndex + 1 : null;
    
    if (rank === 1) unlockedBadges.push('🥇');
    if (streak >= 7) unlockedBadges.push('🔥');
    if (xp >= 25000) unlockedBadges.push('💎');
    if (completedHtmlTasks > 0) unlockedBadges.push('📚');
    if (workspaceCount >= 1) unlockedBadges.push('🚀');
    if (completedFocusTasks >= 1) unlockedBadges.push('🎯');
    
    // Check if the badges in the DB match the computed list
    const currentBadges = userProfile.badges || [];
    const isDifferent = unlockedBadges.length !== currentBadges.length || 
                        unlockedBadges.some(b => !currentBadges.includes(b));
                        
    if (isDifferent) {
      const updateBadges = async () => {
        try {
          await updateDoc(doc(db, 'users', currentUser.uid), {
            badges: unlockedBadges
          });
        } catch (err) {
          console.error("Error updating user badges:", err);
        }
      };
      updateBadges();
    }
  }, [currentUser, userProfile?.xp, userProfile?.streak, tasks, workspaces, allUsers]);



  // Wrapper for setUserProfile to write back to Firestore and Leaderboards
  const setUserProfileWrapper = async (updateArg) => {
    if (!currentUser || !userProfile) return;
    let updated;
    if (typeof updateArg === 'function') {
      updated = updateArg(userProfile);
    } else {
      updated = updateArg;
    }
    
    const userDocRef = doc(db, 'users', currentUser.uid);
    await setDoc(userDocRef, updated, { merge: true });

    // Also update leaderboard entry
    const lbDocRef = doc(db, 'leaderboards', updated.userId || userProfile.userId);
    await setDoc(lbDocRef, {
      userId: updated.userId || userProfile.userId,
      fullName: updated.fullName || userProfile.fullName,
      username: updated.username || userProfile.username,
      university: updated.university || userProfile.university,
      xp: updated.xp !== undefined ? updated.xp : (userProfile.xp || 0),
      streak: updated.streak !== undefined ? updated.streak : (userProfile.streak || 0),
      tasksCompleted: tasks.filter(t => t.done).length,
      workspaceCompleted: workspaces.filter(w => w.progress === 100).length,
      profilePicture: updated.profilePicture || userProfile.profilePicture
    }, { merge: true });
  };

  // ================= TASK OPERATIONS =================
  const addTask = async (task) => {
    if (!currentUser) return;
    const taskId = `task-${Date.now()}`;
    const newTask = {
      userId: currentUser.uid,
      text: task.text || '',
      done: false,
      priority: task.priority || 'Low',
      dueDate: task.dueDate || '',
      dueTime: task.dueTime || '',
      progress: 0,
      isPinned: task.isPinned || false,
      workspaceId: task.workspaceId || null,
      recurring: task.recurring || 'None',
      completedAt: null,
      colorCategory: task.colorCategory || 'yellow'
    };
    if (newTask.colorCategory === 'yellow') {
      newTask.dueDate = todayStr;
      newTask.dueTime = '';
    }
    
    await setDoc(doc(db, 'tasks', taskId), newTask);
    
    if (newTask.workspaceId === null && newTask.isPinned) {
      await setDoc(doc(db, 'focusTasks', taskId), newTask);
    }
  };

  const editTask = async (id, updatedFields) => {
    if (!currentUser) return;
    const taskRef = doc(db, 'tasks', id);
    const mergedFields = { ...updatedFields };
    if (mergedFields.colorCategory === 'yellow') {
      mergedFields.dueDate = todayStr;
      mergedFields.dueTime = '';
    }
    await updateDoc(taskRef, mergedFields);
    
    const taskSnap = await getDoc(taskRef);
    if (taskSnap.exists()) {
      const taskData = taskSnap.data();
      if (taskData.workspaceId === null && taskData.isPinned) {
        await setDoc(doc(db, 'focusTasks', id), taskData);
      } else {
        await deleteDoc(doc(db, 'focusTasks', id));
      }
    }
  };

  const deleteTask = async (id) => {
    if (!currentUser) return;
    await deleteDoc(doc(db, 'tasks', id));
    await deleteDoc(doc(db, 'focusTasks', id));
  };

  const toggleTask = async (id) => {
    if (!currentUser) return;
    const taskRef = doc(db, 'tasks', id);
    const taskSnap = await getDoc(taskRef);
    if (taskSnap.exists()) {
      const task = taskSnap.data();
      const nextDone = !task.done;
      const updated = {
        done: nextDone,
        progress: nextDone ? 100 : 0,
        completedAt: nextDone ? new Date().toISOString() : null
      };
      await updateDoc(taskRef, updated);
      
      if (task.workspaceId === null && task.isPinned) {
        await updateDoc(doc(db, 'focusTasks', id), updated);
      }

      if (nextDone) {
        await logProductiveActivity('task');
        if (task.isPinned && task.workspaceId === null) {
          await logProductiveActivity('focusTask');
        }
      } else {
        if (userProfile) {
          const newXp = Math.max(0, (userProfile.xp || 0) - 15);
          await updateDoc(doc(db, 'users', currentUser.uid), { xp: newXp });
          if (userProfile.userId) {
            await setDoc(doc(db, 'leaderboards', userProfile.userId), { xp: newXp }, { merge: true });
          }
        }
      }
    }
  };

  const togglePin = async (id) => {
    if (!currentUser) return;
    const taskRef = doc(db, 'tasks', id);
    const taskSnap = await getDoc(taskRef);
    if (taskSnap.exists()) {
      const task = taskSnap.data();
      if (!task.isPinned) {
        const pinnedCount = tasks.filter((t) => t.isPinned && !t.workspaceId && !t.done).length;
        if (pinnedCount >= 6) return;
      }
      const updatedPinned = !task.isPinned;
      await updateDoc(taskRef, { isPinned: updatedPinned });
      
      if (task.workspaceId === null) {
        if (updatedPinned) {
          await setDoc(doc(db, 'focusTasks', id), { ...task, isPinned: true });
        } else {
          await deleteDoc(doc(db, 'focusTasks', id));
        }
      }
    }
  };

  // ================= EXAM OPERATIONS =================
  const addExam = async (exam) => {
    if (!currentUser) return;
    const examId = `exam-${Date.now()}`;
    const newExam = {
      userId: currentUser.uid,
      name: exam.name || '',
      subject: exam.subject || '',
      date: exam.date || '',
      status: 'Pending',
      prepProgress: exam.prepProgress || 0
    };
    await setDoc(doc(db, 'exams', examId), newExam);
  };

  const editExam = async (id, updatedFields) => {
    if (!currentUser) return;
    await updateDoc(doc(db, 'exams', id), updatedFields);
  };

  const deleteExam = async (id) => {
    if (!currentUser) return;
    await deleteDoc(doc(db, 'exams', id));
  };

  const toggleExam = async (id) => {
    if (!currentUser) return;
    const examRef = doc(db, 'exams', id);
    const examSnap = await getDoc(examRef);
    if (examSnap.exists()) {
      const exam = examSnap.data();
      const isCompleting = exam.status !== 'Completed';
      await updateDoc(examRef, {
        status: isCompleting ? 'Completed' : 'Pending'
      });

      if (isCompleting) {
        await logProductiveActivity('exam');
      } else {
        if (userProfile) {
          const newXp = Math.max(0, (userProfile.xp || 0) - 15);
          await updateDoc(doc(db, 'users', currentUser.uid), { xp: newXp });
          if (userProfile.userId) {
            await setDoc(doc(db, 'leaderboards', userProfile.userId), { xp: newXp }, { merge: true });
          }
        }
      }
    }
  };

  // ================= ASSIGNMENT OPERATIONS =================
  const addAssignment = async (assign) => {
    if (!currentUser) return;
    const assignId = `assign-${Date.now()}`;
    const newAssign = {
      userId: currentUser.uid,
      name: assign.name || '',
      subject: assign.subject || '',
      dueDate: assign.dueDate || '',
      status: 'Pending',
      progress: assign.progress || 0
    };
    await setDoc(doc(db, 'assignments', assignId), newAssign);
  };

  const editAssignment = async (id, updatedFields) => {
    if (!currentUser) return;
    await updateDoc(doc(db, 'assignments', id), updatedFields);
  };

  const deleteAssignment = async (id) => {
    if (!currentUser) return;
    await deleteDoc(doc(db, 'assignments', id));
  };

  const toggleAssignment = async (id) => {
    if (!currentUser) return;
    const assignRef = doc(db, 'assignments', id);
    const assignSnap = await getDoc(assignRef);
    if (assignSnap.exists()) {
      const assign = assignSnap.data();
      const isSubmitting = assign.status !== 'Submitted';
      await updateDoc(assignRef, {
        status: isSubmitting ? 'Submitted' : 'Pending',
        progress: isSubmitting ? 100 : 0
      });

      if (isSubmitting) {
        await logProductiveActivity('assignment');
      } else {
        if (userProfile) {
          const newXp = Math.max(0, (userProfile.xp || 0) - 15);
          await updateDoc(doc(db, 'users', currentUser.uid), { xp: newXp });
          if (userProfile.userId) {
            await setDoc(doc(db, 'leaderboards', userProfile.userId), { xp: newXp }, { merge: true });
          }
        }
      }
    }
  };

  // ================= WORKSPACE CRUD OPERATIONS =================
  const addWorkspace = async (workspace) => {
    if (!currentUser || !userProfile) return;
    const wsId = workspace.id || `ws-${Date.now()}`;
    const newWorkspace = {
      ownerId: currentUser.uid,
      title: workspace.title || '',
      description: workspace.description || '',
      tag: workspace.tag || '',
      progress: 0,
      streak: 0,
      isPublic: workspace.isPublic || false,
      icon: workspace.icon || 'folder',
      bannerImage: workspace.bannerImage || 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
      colorTheme: workspace.colorTheme || 'primary',
      category: workspace.category || 'Learning',
      roadmaps: workspace.roadmaps || [],
      notes: workspace.notes || '### Workspace Notes',
      resources: workspace.resources || [],
      projects: workspace.projects || [],
      milestones: workspace.milestones || []
    };
    await setDoc(doc(db, 'workspaces', wsId), newWorkspace);

    const featured = userProfile.featuredWorkspaces || [];
    await updateDoc(doc(db, 'users', currentUser.uid), {
      featuredWorkspaces: [wsId, ...featured]
    });
  };

  const updateWorkspace = async (wsId, updatedFields) => {
    if (!currentUser) return;
    await updateDoc(doc(db, 'workspaces', wsId), updatedFields);
  };

  const deleteWorkspace = async (wsId) => {
    if (!currentUser || !userProfile) return;
    await deleteDoc(doc(db, 'workspaces', wsId));
    
    if (userProfile.featuredWorkspaces) {
      const featured = userProfile.featuredWorkspaces.filter(id => id !== wsId);
      await updateDoc(doc(db, 'users', currentUser.uid), {
        featuredWorkspaces: featured
      });
    }
  };

  const toggleSubtopic = async (wsId, roadmapId, topicId, subtopicId) => {
    if (!currentUser) return;
    const wsRef = doc(db, 'workspaces', wsId);
    const wsSnap = await getDoc(wsRef);
    if (wsSnap.exists()) {
      const ws = wsSnap.data();
      let wasDone = false;
      const originalRm = (ws.roadmaps || []).find(rm => rm.id === roadmapId);
      if (originalRm) {
        const originalT = (originalRm.topics || []).find(t => t.id === topicId);
        if (originalT) {
          const originalSt = (originalT.subtopics || []).find(st => st.id === subtopicId);
          if (originalSt) {
            wasDone = originalSt.done;
          }
        }
      }
      const isNowDone = !wasDone;
      const xpChange = isNowDone ? 10 : -10;

      const updatedRoadmaps = (ws.roadmaps || []).map((rm) => {
        if (rm.id !== roadmapId) return rm;

        const updatedTopics = (rm.topics || []).map((t) => {
          if (t.id !== topicId) return t;

          const updatedSubtopics = (t.subtopics || []).map((st) => {
            if (st.id !== subtopicId) return st;
            return { ...st, done: isNowDone };
          });

          return { ...t, subtopics: updatedSubtopics };
        });

        return { ...rm, topics: updatedTopics };
      });

      let totalSubtopics = 0;
      let completedSubtopics = 0;

      updatedRoadmaps.forEach((rm) => {
        (rm.topics || []).forEach((t) => {
          (t.subtopics || []).forEach((st) => {
            totalSubtopics++;
            if (st.done) completedSubtopics++;
          });
        });
      });

      const overallProgress = totalSubtopics > 0 ? Math.round((completedSubtopics / totalSubtopics) * 100) : 0;

      await updateDoc(wsRef, {
        roadmaps: updatedRoadmaps,
        progress: overallProgress
      });

      if (isNowDone) {
        await logProductiveActivity('subtopic');
        // Check if all subtopics of this topic are completed
        const originalRm = (ws.roadmaps || []).find(rm => rm.id === roadmapId);
        if (originalRm) {
          const originalT = (originalRm.topics || []).find(t => t.id === topicId);
          if (originalT) {
            const updatedSubtopics = (originalT.subtopics || []).map((st) => {
              if (st.id === subtopicId) return { ...st, done: true };
              return st;
            });
            if (updatedSubtopics.every(st => st.done)) {
              await logProductiveActivity('topic');
            }
          }
        }
      } else {
        if (userProfile) {
          const newXp = Math.max(0, (userProfile.xp || 0) - 10);
          await updateDoc(doc(db, 'users', currentUser.uid), { xp: newXp });
          if (userProfile.userId) {
            await setDoc(doc(db, 'leaderboards', userProfile.userId), { xp: newXp }, { merge: true });
          }
        }
      }
    }
  };

  // ================= FOLLOW / SOCIAL OPERATIONS =================
  const sendFollowRequest = async (targetId) => {
    if (!currentUser || !userProfile) return;
    const targetUser = allUsers.find(u => u.userId === targetId);
    if (!targetUser) return;
    const targetUid = targetUser.uid;

    if (sentRequests.includes(targetId) || friends.includes(targetId)) return;

    const reqId = `req_${currentUser.uid}_${targetUid}`;
    await setDoc(doc(db, 'friendRequests', reqId), {
      senderUid: currentUser.uid,
      senderUserId: userProfile.userId,
      senderName: userProfile.fullName,
      receiverUid: targetUid,
      receiverUserId: targetId,
      status: 'pending',
      timestamp: new Date().toISOString()
    });

    await addDoc(collection(db, 'notifications'), {
      userId: targetUid,
      text: `Friend request from ${userProfile.fullName}.`,
      type: 'Friends',
      read: false,
      timestamp: new Date().toISOString(),
      meta: { senderId: userProfile.userId, isFriendRequest: true, requestDocId: reqId }
    });

    const sentNotifId = `notif-sent-${Date.now()}`;
    await setDoc(doc(db, 'notifications', sentNotifId), {
      userId: currentUser.uid,
      text: `Follow request sent to ${targetUser.fullName}.`,
      type: 'Friends',
      read: false,
      timestamp: new Date().toISOString(),
      meta: { senderId: targetId }
    });
  };

  const acceptFollowRequest = async (notifId) => {
    if (!currentUser || !userProfile) return;
    const notif = notifications.find((n) => n.id === notifId);
    if (!notif) return;
    
    const senderUserId = notif.meta.senderId;
    const senderUser = allUsers.find(u => u.userId === senderUserId);
    if (!senderUser) return;
    const senderUid = senderUser.uid;

    await deleteDoc(doc(db, 'notifications', notifId));

    const friendshipId = [currentUser.uid, senderUid].sort().join('_');
    await setDoc(doc(db, 'friends', friendshipId), {
      uids: [currentUser.uid, senderUid],
      userIds: [userProfile.userId, senderUserId].sort(),
      timestamp: new Date().toISOString()
    });

    const reqId = `req_${senderUid}_${currentUser.uid}`;
    await deleteDoc(doc(db, 'friendRequests', reqId));

    await addDoc(collection(db, 'notifications'), {
      userId: senderUid,
      text: `${userProfile.fullName} accepted your follow request.`,
      type: 'Friends',
      read: false,
      timestamp: new Date().toISOString(),
      meta: { senderId: userProfile.userId }
    });

    const accNotifId = `notif-acc-${Date.now()}`;
    await setDoc(doc(db, 'notifications', accNotifId), {
      userId: currentUser.uid,
      text: `You accepted ${senderUser.fullName}'s follow request.`,
      type: 'Friends',
      read: false,
      timestamp: new Date().toISOString(),
      meta: { senderId: senderUserId }
    });
  };

  const rejectFollowRequest = async (notifId) => {
    if (!currentUser) return;
    const notif = notifications.find((n) => n.id === notifId);
    if (!notif) return;

    const senderUserId = notif.meta.senderId;
    const senderUser = allUsers.find(u => u.userId === senderUserId);
    if (senderUser) {
      const reqId = `req_${senderUser.uid}_${currentUser.uid}`;
      await deleteDoc(doc(db, 'friendRequests', reqId));
    }

    await deleteDoc(doc(db, 'notifications', notifId));
  };

  const unfollowFriend = async (friendUserId) => {
    if (!currentUser || !userProfile) return;
    const friendUser = allUsers.find(u => u.userId === friendUserId);
    if (!friendUser) return;

    const friendshipId = [currentUser.uid, friendUser.uid].sort().join('_');
    await deleteDoc(doc(db, 'friends', friendshipId));

    const reqId1 = `req_${currentUser.uid}_${friendUser.uid}`;
    const reqId2 = `req_${friendUser.uid}_${currentUser.uid}`;
    await deleteDoc(doc(db, 'friendRequests', reqId1));
    await deleteDoc(doc(db, 'friendRequests', reqId2));
  };

  // ================= CHAT OPERATIONS =================
  const sendChatMessage = async (friendUserId, text, type = 'text', payload = null, replyTo = null) => {
    if (!currentUser || !userProfile) return;
    const friendUser = allUsers.find(u => u.userId === friendUserId);
    if (!friendUser) return;

    const chatRoomId = [userProfile.userId, friendUserId].sort().join('_');

    await setDoc(doc(db, 'chats', chatRoomId), {
      userIds: [userProfile.userId, friendUserId].sort(),
      uids: [currentUser.uid, friendUser.uid].sort(),
      lastMessage: text,
      lastMessageTimestamp: new Date().toISOString()
    }, { merge: true });

    const msgId = `msg-${Date.now()}`;
    const newMsg = {
      senderId: userProfile.userId,
      senderUserId: userProfile.userId,
      text,
      timestamp: new Date().toISOString(),
      seen: false,
      status: 'sent',
      reactions: [],
      type,
      payload,
      replyTo
    };
    await setDoc(doc(db, `chats/${chatRoomId}/messages`, msgId), newMsg);
  };

  const markMessagesAsSeen = async (friendUserId) => {
    if (!currentUser || !userProfile || !userProfile.userId) return;
    const chatRoomId = [userProfile.userId, friendUserId].sort().join('_');
    const friendMessages = chats[friendUserId] || [];
    
    // Find all messages from the friend that are not 'seen'
    const unseenMsgs = friendMessages.filter(
      (msg) => msg.senderId !== userProfile.userId && msg.status !== 'seen'
    );
    
    if (unseenMsgs.length > 0) {
      try {
        const batch = writeBatch(db);
        unseenMsgs.forEach((msg) => {
          batch.update(doc(db, `chats/${chatRoomId}/messages`, msg.id), { 
            status: 'seen', 
            seen: true 
          });
        });
        await batch.commit();
      } catch (err) {
        console.error("Error marking messages as seen:", err);
      }
    }
  };

  const setMyTypingStatus = async (isTyping) => {
    if (!currentUser || !userProfile || !userProfile.userId) return;
    try {
      const typingRef = doc(db, 'typingStatus', userProfile.userId);
      await setDoc(typingRef, {
        typing: isTyping,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (err) {
      console.error("Error setting typing status:", err);
    }
  };

  const addChatReaction = async (friendUserId, msgIndex, reaction) => {
    if (!currentUser || !userProfile) return;
    const friendMessages = chats[friendUserId] || [];
    const targetMsg = friendMessages[msgIndex];
    if (!targetMsg || !targetMsg.id) return;

    const chatRoomId = [userProfile.userId, friendUserId].sort().join('_');
    const msgRef = doc(db, `chats/${chatRoomId}/messages`, targetMsg.id);
    const msgSnap = await getDoc(msgRef);
    if (msgSnap.exists()) {
      const msg = msgSnap.data();
      const reactions = msg.reactions || [];
      const updatedReactions = reactions.includes(reaction)
        ? reactions.filter(r => r !== reaction)
        : [...reactions, reaction];
      await updateDoc(msgRef, { reactions: updatedReactions });
    }
  };

  // ================= COLLABORATION OPERATIONS =================
  const inviteCollaborator = async (workspaceId, friendUserId, role = 'Editor') => {
    if (!currentUser || !userProfile) return;
    const friendUser = allUsers.find(u => u.userId === friendUserId);
    if (!friendUser) return;

    const list = collaborators[workspaceId] || [];
    if (list.some(c => c.userId === friendUserId)) return;

    const collabRef = doc(db, 'collaborators', workspaceId);
    await setDoc(collabRef, {
      workspaceId,
      users: [...list, { userId: friendUserId, role }]
    }, { merge: true });

    const wsRef = doc(db, 'workspaces', workspaceId);
    const wsSnap = await getDoc(wsRef);
    const wsTitle = wsSnap.exists() ? wsSnap.data().title : 'Workspace';

    await addDoc(collection(db, 'notifications'), {
      userId: friendUser.uid,
      text: `Collaboration invite for workspace: ${wsTitle}.`,
      type: 'Workspace',
      read: false,
      timestamp: new Date().toISOString(),
      meta: { workspaceId, role, senderName: userProfile.fullName, isCollabRequest: true }
    });

    const inviteNotifId = `notif-invite-${Date.now()}`;
    await setDoc(doc(db, 'notifications', inviteNotifId), {
      userId: currentUser.uid,
      text: `Collaboration invite sent to ${friendUser.fullName}.`,
      type: 'Workspace',
      read: false,
      timestamp: new Date().toISOString(),
      meta: { workspaceId, role }
    });
  };

  const acceptCollaborationInvite = async (notifId) => {
    if (!currentUser || !userProfile) return;
    const notif = notifications.find(n => n.id === notifId);
    if (!notif) return;
    const wsId = notif.meta.workspaceId;
    const role = notif.meta.role;

    await deleteDoc(doc(db, 'notifications', notifId));

    const collabRef = doc(db, 'collaborators', wsId);
    const collabSnap = await getDoc(collabRef);
    const list = collabSnap.exists() ? (collabSnap.data().users || []) : [];
    
    if (!list.some(c => c.userId === userProfile.userId)) {
      await setDoc(collabRef, {
        workspaceId: wsId,
        users: [...list, { userId: userProfile.userId, role }]
      }, { merge: true });
    }

    const joinNotifId = `notif-joined-${Date.now()}`;
    await setDoc(doc(db, 'notifications', joinNotifId), {
      userId: currentUser.uid,
      text: 'You joined a workspace collaboration successfully.',
      type: 'Workspace',
      read: false,
      timestamp: new Date().toISOString(),
      meta: {}
    });
  };

  const rejectCollaborationInvite = async (notifId) => {
    if (!currentUser) return;
    await deleteDoc(doc(db, 'notifications', notifId));
  };

  // ================= NOTIFICATION UTILITIES =================
  const markNotificationRead = async (notifId) => {
    if (!currentUser) return;
    await updateDoc(doc(db, 'notifications', notifId), { read: true });
  };

  const markAllNotificationsRead = async () => {
    if (!currentUser) return;
    const batch = writeBatch(db);
    notifications.forEach((n) => {
      if (!n.read) {
        batch.update(doc(db, 'notifications', n.id), { read: true });
      }
    });
    await batch.commit();
  };

  const deleteNotification = async (notifId) => {
    if (!currentUser) return;
    await deleteDoc(doc(db, 'notifications', notifId));
  };

  // ================= NOTIFICATION ENGINE COMBINED GETTER =================
  const getNotifications = () => {
    const list = [...notifications];

    exams.forEach((exam) => {
      if (exam.status !== 'Completed' && exam.date === tomorrowStr) {
        if (!list.some((n) => n.id === `alert-exam-${exam.id}`)) {
          list.push({
            id: `alert-exam-${exam.id}`,
            text: `${exam.name} starts tomorrow.`,
            type: 'Exams',
            read: false,
            timestamp: new Date().toISOString(),
            time: 'Exam Tomorrow'
          });
        }
      }
    });

    assignments.forEach((assign) => {
      if (assign.status !== 'Submitted' && assign.dueDate === tomorrowStr) {
        if (!list.some((n) => n.id === `alert-assign-${assign.id}`)) {
          list.push({
            id: `alert-assign-${assign.id}`,
            text: `${assign.name} due in 12 hours.`,
            type: 'Assignments',
            read: false,
            timestamp: new Date().toISOString(),
            time: 'Due Tomorrow'
          });
        }
      }
    });

    tasks.forEach((task) => {
      if (!task.done && !task.workspaceId && task.dueDate && task.dueDate < todayStr) {
        if (!list.some((n) => n.id === `alert-task-od-${task.id}`)) {
          list.push({
            id: `alert-task-od-${task.id}`,
            text: `Focus task "${task.text}" is overdue.`,
            type: 'Tasks',
            read: false,
            timestamp: new Date().toISOString(),
            time: 'Overdue'
          });
        }
      }
    });

    tasks.forEach((task) => {
      if (!task.done && task.workspaceId && task.dueDate && task.dueDate < todayStr) {
        if (!list.some((n) => n.id === `alert-ws-task-od-${task.id}`)) {
          list.push({
            id: `alert-ws-task-od-${task.id}`,
            text: `Workspace task "${task.text}" deadline is approaching.`,
            type: 'Workspace',
            read: false,
            timestamp: new Date().toISOString(),
            time: 'Overdue'
          });
        }
      }
    });

    return list.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  };

  const initializeUserCollections = async (selectedPresetIds, customWorkspaceNames, profileData) => {
    if (!currentUser) return;
    const uid = currentUser.uid;

    const cleanedProfile = {
      ...profileData,
      xp: 0,
      streak: 0,
      connections: 0,
      workspaces: 0,
      todos: 0,
      activityHistory: {},
      badges: [],
      featuredWorkspaces: []
    };

    // 1. Save user profile doc in Firestore
    const userDocRef = doc(db, 'users', uid);
    await setDoc(userDocRef, cleanedProfile);

    // 2. Save leaderboard entry
    const lbDocRef = doc(db, 'leaderboards', profileData.userId);
    await setDoc(lbDocRef, {
      userId: profileData.userId,
      fullName: profileData.fullName,
      username: profileData.username,
      university: profileData.university,
      xp: 0,
      streak: 0,
      tasksCompleted: 0,
      workspaceCompleted: 0,
      profilePicture: profileData.profilePicture
    });
  };

  return (
    <TaskContext.Provider
      value={{
        currentUser,
        loading,
        isOnboarded,
        userProfile,
        setUserProfile: setUserProfileWrapper,
        logout,
        userId: userProfile?.userId || '',
        initializeUserCollections,
        tasks,
        exams,
        assignments,
        workspaces,
        allUsers,
        friends,
        sentRequests,
        chats,
        collaborators,
        presenceStates,
        typingStates,
        setMyTypingStatus,
        markMessagesAsSeen,
        privacySettings,
        setPrivacySettings,
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
        addWorkspace,
        updateWorkspace,
        deleteWorkspace,
        toggleSubtopic,
        sendFollowRequest,
        acceptFollowRequest,
        rejectFollowRequest,
        unfollowFriend,
        sendChatMessage,
        addChatReaction,
        inviteCollaborator,
        acceptCollaborationInvite,
        rejectCollaborationInvite,
        markNotificationRead,
        markAllNotificationsRead,
        deleteNotification,
        getNotifications,
        logProductiveActivity
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
