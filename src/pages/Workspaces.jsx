import React, { useState, useContext, useMemo, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import WorkspaceCard from '../components/WorkspaceCard';
import Modal from '../components/Modal';
import InputField from '../components/InputField';
import Button from '../components/Button';
import { TaskContext, getDefaultRoadmapForCategory } from '../context/TaskContext';
import { SearchableSingleSelect } from '../components/SearchableSelect';
import { WorkspacesSkeleton } from '../components/Skeleton';
import EmptyState from '../components/EmptyState';
import { generateRoadmapFromGemini } from '../utils/gemini';
import { sortWorkspacesByRecentActivity } from '../utils/workspaceUtils';

import Toast from '../components/Toast';

// Import local JSON datasets
import roadmapsData from '../data/roadmaps.json';
import technologies from '../data/technologies.json';

const POPULAR_PATHS = [
  'Frontend',
  'Backend',
  'Full Stack',
  'DSA',
  'Python',
  'Java',
  'AI/ML',
  'DevOps'
];

const OTHER_PATH_OPTIONS = [
  'AI/ML',
  'DevOps',
  'Fitness',
  'Startup',
  'Personal',
  'Career',
  'Finance',
  'Design'
];

const extractTechnology = (text) => {
  if (!text || typeof text !== 'string') return null;
  const str = text.toLowerCase();

  if (str.includes('react native')) return 'React Native';
  if (str.includes('spring boot') || str.includes('springboot')) return 'Spring Boot';
  if (str.includes('c++') || /\bcpp\b/.test(str) || str.includes('cplusplus')) return 'C++';
  if (str.includes('c#') || /\bcsharp\b/.test(str)) return 'C#';
  if (str.includes('python')) return 'Python';
  if (str.includes('typescript') || /\bts\b/.test(str)) return 'TypeScript';
  if (str.includes('javascript') || /\bjs\b/.test(str)) return 'JavaScript';
  if (str.includes('react')) return 'React';
  if (str.includes('next.js') || str.includes('nextjs')) return 'NextJS';
  if (str.includes('vue')) return 'Vue';
  if (str.includes('angular')) return 'Angular';
  if (str.includes('node') || str.includes('nodejs')) return 'NodeJS';
  if (str.includes('django')) return 'Django';
  if (str.includes('docker')) return 'Docker';
  if (str.includes('kubernetes') || str.includes('k8s')) return 'Kubernetes';
  if (str.includes('aws') || str.includes('amazon')) return 'AWS';
  if (str.includes('flutter')) return 'Flutter';
  if (str.includes('mongodb') || str.includes('mongo')) return 'MongoDB';
  if (str.includes('sql') || str.includes('mysql') || str.includes('postgres')) return 'SQL';
  if (str.includes('golang') || /\bgo\b/.test(str)) return 'Go';
  if (str.includes('rust')) return 'Rust';
  if (str.includes('kotlin')) return 'Kotlin';
  if (str.includes('swift')) return 'Swift';
  if (str.includes('dart')) return 'Dart';
  if (str.includes('php')) return 'PHP';
  if (str.includes('ruby')) return 'Ruby';
  if (str.includes('html')) return 'HTML';
  if (str.includes('css')) return 'CSS';
  if (str.includes('git')) return 'Git';
  if (str.includes('tensorflow')) return 'TensorFlow';
  if (str.includes('graphql')) return 'GraphQL';
  if (str.includes('linux')) return 'Linux';
  if (str.includes('java')) return 'Java';

  return null;
};

const Workspaces = () => {
  const navigate = useNavigate();
  const { workspaces, collaboratedWorkspaces, allUsers, addWorkspace, updateWorkspace, touchWorkspace, verifySharedWorkspace, requestCollaboration, userProfile, tasks, loading, addTask } = useContext(TaskContext);

  const [isLoading, setIsLoading] = useState(loading);

  useEffect(() => {
    setIsLoading(loading);
  }, [loading]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const addWorkspaceBtnRef = useRef(null);
  const addWorkspacePopoverRef = useRef(null);
  const [popoverStyle, setPopoverStyle] = useState({
    position: 'fixed',
    top: '0px',
    right: '0px',
    opacity: 0,
    pointerEvents: 'none'
  });

  const updatePopoverPosition = React.useCallback(() => {
    if (!addWorkspaceBtnRef.current) return;
    const btnRect = addWorkspaceBtnRef.current.getBoundingClientRect();
    const vh = window.innerHeight;
    const vw = window.innerWidth;
    
    const popoverElem = addWorkspacePopoverRef.current;
    const popHeight = popoverElem ? popoverElem.offsetHeight : 190;
    const popWidth = popoverElem ? popoverElem.offsetWidth : 320;
    const padding = 12;

    const spaceAbove = btnRect.top;
    const spaceBelow = vh - btnRect.bottom;

    let targetTop = 0;
    // Prefer opening DOWNWARD below button when space permits (ideal for top header button)
    if (spaceBelow >= popHeight + padding) {
      targetTop = btnRect.bottom + 8;
    } 
    // Else open UPWARD above button
    else if (spaceAbove >= popHeight + padding) {
      targetTop = btnRect.top - popHeight - 8;
    } 
    // Else clamp top position inside viewport bounds [padding, vh - popHeight - padding]
    else {
      targetTop = Math.max(padding, Math.min(btnRect.bottom + 8, vh - popHeight - padding));
    }

    // Horizontal positioning: align right edge of popover with right edge of button
    let targetLeft = btnRect.right - popWidth;
    if (targetLeft < padding) {
      targetLeft = Math.max(padding, vw - popWidth - padding);
    }
    if (targetLeft + popWidth > vw - padding) {
      targetLeft = vw - popWidth - padding;
    }

    setPopoverStyle({
      position: 'fixed',
      top: `${targetTop}px`,
      left: `${targetLeft}px`,
      width: `${Math.min(popWidth, vw - 24)}px`,
      opacity: 1,
      pointerEvents: 'auto',
      zIndex: 99999
    });
  }, []);

  React.useLayoutEffect(() => {
    if (isAddMenuOpen) {
      updatePopoverPosition();
      const handleScrollOrResize = () => {
        updatePopoverPosition();
      };
      window.addEventListener('resize', handleScrollOrResize);
      window.addEventListener('scroll', handleScrollOrResize, true);
      return () => {
        window.removeEventListener('resize', handleScrollOrResize);
        window.removeEventListener('scroll', handleScrollOrResize, true);
      };
    }
  }, [isAddMenuOpen, updatePopoverPosition]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsAddMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Shared Workspace viewer states
  const [isJoinSharedModalOpen, setIsJoinSharedModalOpen] = useState(false);
  const [isCopyConfirmModalOpen, setIsCopyConfirmModalOpen] = useState(false);
  const [shareIdInput, setShareIdInput] = useState('');
  const [sharePinInput, setSharePinInput] = useState('');
  const [showJoinPassword, setShowJoinPassword] = useState(false);
  const [sharedWorkspaceData, setSharedWorkspaceData] = useState(null);
  const [sharedViewStep, setSharedViewStep] = useState('verify'); // 'verify', 'view', 'copy'
  const [selectedTracksToCopy, setSelectedTracksToCopy] = useState([]);
  const [targetWorkspaceIdToCopy, setTargetWorkspaceIdToCopy] = useState('');
  const [newWorkspaceNameToCopy, setNewWorkspaceNameToCopy] = useState('');
  const [isSharedWorkspaceLoading, setIsSharedWorkspaceLoading] = useState(false);
  const [sharedWorkspaceError, setSharedWorkspaceError] = useState('');

  const resetJoinSharedModal = () => {
    setIsJoinSharedModalOpen(false);
    setIsCopyConfirmModalOpen(false);
    setShareIdInput('');
    setSharePinInput('');
    setShowJoinPassword(false);
    setSharedWorkspaceData(null);
    setSharedViewStep('verify');
    setSelectedTracksToCopy([]);
    setTargetWorkspaceIdToCopy('');
    setNewWorkspaceNameToCopy('');
    setSharedWorkspaceError('');
    setIsSharedWorkspaceLoading(false);
  };

  const handleVerifyShare = async (e) => {
    if (e) e.preventDefault();
    if (!shareIdInput.trim() || !sharePinInput.trim()) {
      setSharedWorkspaceError('Please enter both Share ID and PIN.');
      return;
    }
    setSharedWorkspaceError('');
    setIsSharedWorkspaceLoading(true);

    try {
      const data = await verifySharedWorkspace(shareIdInput.trim(), sharePinInput.trim());
      setSharedWorkspaceData(data);
      // Pre-select all tracks by default
      const tracksList = data.tracks || data.roadmaps || [];
      if (tracksList && tracksList.length > 0) {
        setSelectedTracksToCopy(tracksList.map(t => t.id || t.title));
      }
      setSharedViewStep('view');
    } catch (err) {
      console.error(err);
      setSharedWorkspaceError(err.message || 'Invalid Share ID or PIN.');
    } finally {
      setIsSharedWorkspaceLoading(false);
    }
  };

  const handleCopySharedTracks = async (e) => {
    if (e) e.preventDefault();
    if (selectedTracksToCopy.length === 0) {
      showToast('Please select at least one track to copy.', 'error');
      return;
    }

    let targetWsId = targetWorkspaceIdToCopy;

    try {
      if (targetWsId === 'new') {
        if (!newWorkspaceNameToCopy.trim()) {
          showToast('Please enter a name for the new workspace.', 'error');
          return;
        }
        // Create new workspace first
        const newWsId = `ws-${Date.now()}-${Math.round(Math.random() * 100000)}`;
        await addWorkspace({
          id: newWsId,
          title: newWorkspaceNameToCopy.trim(),
          description: `Copied tracks from shared workspace "${sharedWorkspaceData.title}"`,
          category: 'Learning',
          roadmaps: []
        });
        targetWsId = newWsId;
      }

      // Now copy tracks
      const targetWorkspace = (workspaces || []).find(w => w.id === targetWsId);
      if (!targetWorkspace) {
        showToast('Target workspace not found.', 'error');
        return;
      }

      const sourceTracks = sharedWorkspaceData.tracks || sharedWorkspaceData.roadmaps || [];
      const tracksToCopyObj = sourceTracks.filter(t => selectedTracksToCopy.includes(t.id || t.title));

      const newRoadmaps = [
        ...(targetWorkspace.roadmaps || []),
        ...tracksToCopyObj.map((track, trackIdx) => ({
          id: `rm-${Date.now()}-${trackIdx}-${Math.round(Math.random() * 100000)}`,
          title: track.title,
          description: track.description || '',
          icon: track.icon || '',
          topics: (track.topics || []).map((t, topicIdx) => ({
            id: `topic-${Date.now()}-${trackIdx}-${topicIdx}-${Math.round(Math.random() * 100000)}`,
            title: t.title,
            expanded: false,
            icon: t.icon || '',
            subtopics: (t.subtopics || []).map((st, subIdx) => ({
              id: `subtopic-${Date.now()}-${trackIdx}-${topicIdx}-${subIdx}-${Math.round(Math.random() * 100000)}`,
              title: st.title,
              done: false
            })),
            resources: (t.resources || []).map((r, rIdx) => ({
              id: `res-${Date.now()}-${rIdx}-${Math.round(Math.random() * 100000)}`,
              title: r.title || 'Resource',
              link: r.link || r.url || '',
              category: r.category || r.type || 'Other'
            }))
          }))
        }))
      ];

      // Update workspace roadmaps
      const { doc, db, updateDoc } = await import('firebase/firestore');
      const wsRef = doc(db, 'workspaces', targetWsId);

      let totalSub = 0;
      let completedSub = 0;
      newRoadmaps.forEach(rm => {
        (rm.topics || []).forEach(t => {
          (t.subtopics || []).forEach(st => {
            totalSub++;
            if (st.done) completedSub++;
          });
        });
      });
      const newProg = totalSub > 0 ? Math.round((completedSub / totalSub) * 100) : 0;

      await updateDoc(wsRef, {
        roadmaps: newRoadmaps,
        progress: newProg
      });

      showToast('✓ Selected tracks successfully copied to your workspace!');
      resetJoinSharedModal();
    } catch (err) {
      console.error(err);
      showToast('Error copying tracks: ' + err.message, 'error');
    }
  };

  const handleOpenCopyConfirmModal = () => {
    if (!sharedWorkspaceData) return;
    setIsCopyConfirmModalOpen(true);
  };

  const handleExecuteCopyWorkspace = async () => {
    if (!sharedWorkspaceData) return;
    setIsCopyConfirmModalOpen(false);
    setIsSharedWorkspaceLoading(true);

    try {
      const sourceTracks = sharedWorkspaceData.tracks || sharedWorkspaceData.roadmaps || [];

      // Deep clone all tracks, topics, subtopics, and resources
      const clonedRoadmaps = sourceTracks.map((track, trackIdx) => ({
        id: `rm-${Date.now()}-${trackIdx}-${Math.round(Math.random() * 100000)}`,
        title: track.title || `Track ${trackIdx + 1}`,
        description: track.description || '',
        icon: track.icon || '',
        topics: (track.topics || []).map((t, topicIdx) => ({
          id: `topic-${Date.now()}-${trackIdx}-${topicIdx}-${Math.round(Math.random() * 100000)}`,
          title: t.title || `Topic ${topicIdx + 1}`,
          expanded: false,
          icon: t.icon || '',
          subtopics: (t.subtopics || []).map((st, subIdx) => ({
            id: `subtopic-${Date.now()}-${trackIdx}-${topicIdx}-${subIdx}-${Math.round(Math.random() * 100000)}`,
            title: st.title || `Task ${subIdx + 1}`,
            done: false
          })),
          resources: (t.resources || []).map((r, rIdx) => ({
            id: `res-${Date.now()}-${rIdx}-${Math.round(Math.random() * 100000)}`,
            title: r.title || 'Resource',
            link: r.link || r.url || '',
            category: r.category || r.type || 'Other'
          }))
        })),
        resources: (track.resources || []).map((r, rIdx) => ({
          id: `res-${Date.now()}-${rIdx}-${Math.round(Math.random() * 100000)}`,
          title: r.title || 'Resource',
          link: r.link || r.url || '',
          category: r.category || r.type || 'Other'
        }))
      }));

      // Validation: verify tracks were cloned if source had tracks
      if (sourceTracks.length > 0 && clonedRoadmaps.length === 0) {
        throw new Error("Cloning failed: tracks could not be cloned.");
      }

      const newWsId = `ws-${Date.now()}-${Math.round(Math.random() * 100000)}`;
      const newWsObj = {
        id: newWsId,
        title: `${sharedWorkspaceData.title} (Copy)`,
        description: sharedWorkspaceData.description || `Copied from shared workspace of @${sharedWorkspaceData.ownerUsername || 'user'}`,
        category: sharedWorkspaceData.category || 'Learning',
        tag: sharedWorkspaceData.tag || '',
        technology: sharedWorkspaceData.technology || '',
        technologySlug: sharedWorkspaceData.technologySlug || '',
        technologyId: sharedWorkspaceData.technologyId || '',
        icon: sharedWorkspaceData.icon || 'folder',
        colorTheme: sharedWorkspaceData.colorTheme || 'primary',
        bannerImage: sharedWorkspaceData.bannerImage || '',
        roadmaps: clonedRoadmaps,
        resources: (sharedWorkspaceData.resources || []).map((r, rIdx) => ({
          id: `res-${Date.now()}-${rIdx}-${Math.round(Math.random() * 100000)}`,
          title: r.title || 'Resource',
          link: r.link || r.url || '',
          category: r.category || r.type || 'Other'
        })),
        progress: 0
      };

      await addWorkspace(newWsObj);

      resetJoinSharedModal();
      showToast("✓ Workspace copied successfully!");
    } catch (err) {
      console.error(err);
      showToast("Unable to copy workspace. Please try again.", "error");
    } finally {
      setIsSharedWorkspaceLoading(false);
    }
  };

  const handleRequestCollabDirect = async () => {
    if (!sharedWorkspaceData) return;
    try {
      const res = await requestCollaboration(sharedWorkspaceData.workspaceId, sharedWorkspaceData.ownerId);
      showToast("✓ Collaboration request sent to owner!");
    } catch (err) {
      showToast(err.message || "Failed to send collaboration request.", "error");
    }
  };

  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState('Learning');
  const [creationMethod, setCreationMethod] = useState('manual'); // 'manual' or 'ai'

  // Custom roadmaps currently being customized
  const [activeRoadmaps, setActiveRoadmaps] = useState([]);

  // Custom & search path builders
  const [customPathText, setCustomPathText] = useState('');

  // AI prompt state
  const [aiPrompt, setAiPrompt] = useState('');

  // AI Assisted Workspace States
  const [aiStep, setAiStep] = useState(1); // 1 to 6
  const [aiSubject, setAiSubject] = useState('');
  const [aiLevel, setAiLevel] = useState('Beginner');
  const [aiHours, setAiHours] = useState('2');
  const [aiDuration, setAiDuration] = useState('6 months');

  const [aiRawData, setAiRawData] = useState(null);
  const [aiSelectedTracks, setAiSelectedTracks] = useState([]);
  const [aiConfiguredRoadmap, setAiConfiguredRoadmap] = useState([]);
  const [aiSelectedProjects, setAiSelectedProjects] = useState([]);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiError, setAiError] = useState('');
  const [aiProgress, setAiProgress] = useState(0);
  const [aiStage, setAiStage] = useState('');
  const abortControllerRef = useRef(null);

  // Full reset of modal + AI state — called on close and cancel
  const resetModalState = () => {
    // Abort any in-flight API request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsModalOpen(false);
    setNewTitle('');
    setNewDesc('');
    setNewCategory('Learning');
    setActiveRoadmaps([]);
    setAiPrompt('');
    setCreationMethod('manual');
    setAiStep(1);
    setAiSubject('');
    setAiLevel('Beginner');
    setAiHours('2');
    setAiDuration('6 months');
    setAiRawData(null);
    setAiConfiguredRoadmap([]);
    setAiSelectedTracks([]);
    setAiSelectedProjects([]);
    setAiGenerating(false);
    setAiError('');
    setErrors({});
  };
  const generateWithRetry = async (
    subject,
    level,
    hours,
    duration,
    signal,
    retries = 3
  ) => {

    let lastError;

    for (let i = 1; i <= retries; i++) {
      try {
        setAiStage(`🔄 Attempt ${i}/${retries}`);

        return await generateRoadmapFromGemini(
          subject,
          level,
          hours,
          duration,
          signal
        );

      } catch (err) {
        lastError = err;

        if (err.name === "AbortError")
          throw err;

        if (i < retries) {
          setAiStage(`⚠️ Retry ${i}/${retries}`);

          await new Promise(resolve =>
            setTimeout(resolve, i * 2000)
          );
        }
      }
    }

    throw lastError;
  };
  const handleStartAiGeneration = async () => {
    if (!aiSubject.trim()) {
      setErrors(prev => ({ ...prev, aiSubject: 'Please enter what you want to learn.' }));
      return;
    }
    setErrors({});
    setAiGenerating(true);
    setAiError('');
    const cacheKey =
      `roadmap_${aiSubject.trim().toLowerCase()
      }_${aiLevel
      }_${aiHours
      }_${aiDuration
      }`;

    // Check cache first
    const cachedRoadmap = localStorage.getItem(cacheKey);

    if (cachedRoadmap) {
      console.log("⚡ Loaded roadmap from cache");
      setAiProgress(100);
      setAiStage('⚡ Loaded from cache');

      const data = JSON.parse(cachedRoadmap);

      setAiRawData(data);

      const initialConfig = data.tracks.map((track, idx) => ({
        id: `${track.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}-${idx}`,
        title: track.name,
        projects: track.projects || [],
        milestones: track.milestones || [],
        topics: (track.topics || []).map((topic, tIdx) => ({
          id: `topic-${Date.now()}-${tIdx}-${Math.random()}`,
          title: topic.name,
          expanded: true,
          subtopics: (topic.subtopics || []).map((sub, sIdx) => ({
            id: `sub-${Date.now()}-${sIdx}-${Math.random()}`,
            title: typeof sub === 'string' ? sub : sub.name,
            done: false
          }))
        }))
      }));

      setAiConfiguredRoadmap(initialConfig);
      setAiSelectedTracks(initialConfig.map(t => t.title));

      setAiProgress(100);
      setAiStage('⚡ Loaded from cache');

      await new Promise(resolve =>
        setTimeout(resolve, 1000)
      );

      setAiStep(2);
      setAiGenerating(false);

      return;
    }
    setAiProgress(10);
    setAiStage('🧠 Understanding your goal');

    setTimeout(() => {
      setAiProgress(30);
      setAiStage('📚 Creating learning tracks');
    }, 1500);

    setTimeout(() => {
      setAiProgress(60);
      setAiStage('📝 Generating topics');
    }, 3000);

    setTimeout(() => {
      setAiProgress(85);
      setAiStage('🚀 Creating projects');
    }, 4500);

    // Create a new AbortController for this request
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const data = await generateWithRetry(
        aiSubject,
        aiLevel,
        aiHours,
        aiDuration,
        controller.signal
      );
      if (!data || !data.tracks || data.tracks.length === 0) {
        throw new Error("Invalid roadmap JSON returned");
      }
      setAiRawData(data);
      // Save roadmap to cache
      localStorage.setItem(
        cacheKey,
        JSON.stringify(data)
      );

      console.log("💾 Saved roadmap to cache");

      // Initialize all tracks as selected
      const initialConfig = data.tracks.map((track, idx) => ({
        id: `${track.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}-${idx}`,
        title: track.name,
        projects: track.projects || [],
        milestones: track.milestones || [],
        topics: (track.topics || []).map((topic, tIdx) => ({
          id: `topic-${Date.now()}-${tIdx}-${Math.random()}`,
          title: topic.name,
          expanded: true,
          subtopics: (topic.subtopics || []).map((sub, sIdx) => ({
            id: `sub-${Date.now()}-${sIdx}-${Math.random()}`,
            title: typeof sub === 'string' ? sub : sub.name,
            done: false
          }))
        }))
      }));

      setAiConfiguredRoadmap(initialConfig);
      setAiSelectedTracks(initialConfig.map(t => t.title));

      // Auto-populate Title and Desc
      if (!newTitle.trim()) {
        setNewTitle(aiSubject);
      }
      if (!newDesc.trim()) {
        setNewDesc(`AI Generated Track: ${aiSubject} (${aiLevel} level, ${aiHours}h/day for ${aiDuration})`);
      }
      setAiProgress(100);
      setAiStage('✅ Finalizing roadmap');

      await new Promise(resolve =>
        setTimeout(resolve, 1500)
      );

      setAiStep(2);
    } catch (err) {
      // Don't show error if the request was intentionally aborted (modal closed)
      if (err.name === 'AbortError') return;
      const isKeyError = err.message.includes('API_KEY') || err.message.includes('403') || err.message.includes('401');
      setAiError(
        isKeyError
          ? 'API key is missing or invalid. Please set VITE_GEMINI_API_KEY in your .env file.'
          : 'Please try again later. If this issue persists, the AI service is under maintenance and our engineering team will look into it.'
      );
    } finally {
      abortControllerRef.current = null;

      setAiGenerating(false);
      setAiProgress(0);
      setAiStage('');
    }
  };


  const handleToggleTrack = (trackTitle) => {
    if (aiSelectedTracks.includes(trackTitle)) {
      setAiSelectedTracks(aiSelectedTracks.filter(t => t !== trackTitle));
    } else {
      setAiSelectedTracks([...aiSelectedTracks, trackTitle]);
    }
  };

  const handleDeleteAiTopic = (tIdx, topicIdx) => {
    setAiConfiguredRoadmap(prev => {
      const copy = JSON.parse(JSON.stringify(prev));
      copy[tIdx].topics.splice(topicIdx, 1);
      return copy;
    });
  };

  const handleDeleteAiSubtopic = (tIdx, topicIdx, subIdx) => {
    setAiConfiguredRoadmap(prev => {
      const copy = JSON.parse(JSON.stringify(prev));
      copy[tIdx].topics[topicIdx].subtopics.splice(subIdx, 1);
      return copy;
    });
  };

  const handleAddAiTopic = (tIdx, title) => {
    const clean = title.trim();
    if (!clean) return;
    setAiConfiguredRoadmap(prev => {
      const copy = JSON.parse(JSON.stringify(prev));
      copy[tIdx].topics.push({
        id: `topic-${Date.now()}-${Math.random()}`,
        title: clean,
        expanded: true,
        subtopics: []
      });
      return copy;
    });
  };

  const handleAddAiSubtopic = (tIdx, topicIdx, title) => {
    const clean = title.trim();
    if (!clean) return;
    setAiConfiguredRoadmap(prev => {
      const copy = JSON.parse(JSON.stringify(prev));
      copy[tIdx].topics[topicIdx].subtopics.push({
        id: `sub-${Date.now()}-${Math.random()}`,
        title: clean,
        done: false
      });
      return copy;
    });
  };

  const handleMoveAiSubtopic = (tIdx, topicIdx, subIdx, direction) => {
    setAiConfiguredRoadmap(prev => {
      const copy = JSON.parse(JSON.stringify(prev));
      const subtopics = copy[tIdx].topics[topicIdx].subtopics;
      const targetIdx = direction === 'up' ? subIdx - 1 : subIdx + 1;
      if (targetIdx >= 0 && targetIdx < subtopics.length) {
        const temp = subtopics[subIdx];
        subtopics[subIdx] = subtopics[targetIdx];
        subtopics[targetIdx] = temp;
      }
      return copy;
    });
  };

  const handleEditAiTrackTitle = (tIdx, newTitle) => {
    setAiConfiguredRoadmap(prev => {
      const copy = JSON.parse(JSON.stringify(prev));
      copy[tIdx].title = newTitle;
      return copy;
    });
  };

  const handleEditAiTopicTitle = (tIdx, topicIdx, newTitle) => {
    setAiConfiguredRoadmap(prev => {
      const copy = JSON.parse(JSON.stringify(prev));
      copy[tIdx].topics[topicIdx].title = newTitle;
      return copy;
    });
  };

  const handleEditAiSubtopicTitle = (tIdx, topicIdx, subIdx, newTitle) => {
    setAiConfiguredRoadmap(prev => {
      const copy = JSON.parse(JSON.stringify(prev));
      copy[tIdx].topics[topicIdx].subtopics[subIdx].title = newTitle;
      return copy;
    });
  };

  // Get all projects of selected tracks
  const availableProjects = useMemo(() => {
    const list = [];
    aiConfiguredRoadmap.forEach((track) => {
      if (aiSelectedTracks.includes(track.title)) {
        (track.projects || []).forEach((proj) => {
          list.push({
            name: typeof proj === 'string' ? proj : proj.name,
            trackTitle: track.title
          });
        });
      }
    });
    return list;
  }, [aiConfiguredRoadmap, aiSelectedTracks]);

  const handleGoToProjects = () => {
    setAiSelectedProjects(availableProjects.map(p => p.name));
    setAiStep(5);
  };

  const [activeFilter, setActiveFilter] = useState('All');
  const filters = ['All', 'Learning', 'Projects', 'Goals', 'Fitness', 'Startup', 'Personal'];

  const handleSelectPath = (path) => {
    if (errors.roadmaps) {
      setErrors(prev => ({ ...prev, roadmaps: '' }));
    }

    // Toggle check: if already in activeRoadmaps, remove it
    if (activeRoadmaps.some(r => r.title.toLowerCase() === path.toLowerCase())) {
      setActiveRoadmaps(activeRoadmaps.filter(r => r.title.toLowerCase() !== path.toLowerCase()));
      return;
    }

    // Load from template or generate fallback
    let template = roadmapsData[path];
    if (!template) {
      template = getDefaultRoadmapForCategory(path);
    }

    const newRoadmap = {
      id: `${path.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
      title: template.title || path,
      topics: template.topics.map(t => ({
        id: t.id || `topic-${Math.random()}`,
        title: t.title,
        expanded: true,
        subtopics: t.subtopics.map(s => ({
          id: s.id || `sub-${Math.random()}`,
          title: s.title,
          done: false
        }))
      }))
    };

    setActiveRoadmaps(prev => [...prev, newRoadmap]);
  };

  const handleToggleSubtopic = (rIdx, tIdx, sIdx) => {
    setActiveRoadmaps(prev => {
      const copy = JSON.parse(JSON.stringify(prev));
      copy[rIdx].topics[tIdx].subtopics[sIdx].done = !copy[rIdx].topics[tIdx].subtopics[sIdx].done;
      return copy;
    });
  };

  const handleAddTopic = (rIdx, title) => {
    const cleanTitle = title.trim();
    if (!cleanTitle) return;
    setActiveRoadmaps(prev => {
      const copy = JSON.parse(JSON.stringify(prev));
      copy[rIdx].topics.push({
        id: `topic-${Date.now()}`,
        title: cleanTitle,
        expanded: true,
        subtopics: []
      });
      return copy;
    });
  };

  const handleAddSubtopic = (rIdx, tIdx, title) => {
    const cleanTitle = title.trim();
    if (!cleanTitle) return;
    setActiveRoadmaps(prev => {
      const copy = JSON.parse(JSON.stringify(prev));
      copy[rIdx].topics[tIdx].subtopics.push({
        id: `sub-${Date.now()}`,
        title: cleanTitle,
        done: false
      });
      return copy;
    });
  };

  const handleDeleteTopic = (rIdx, tIdx) => {
    setActiveRoadmaps(prev => {
      const copy = JSON.parse(JSON.stringify(prev));
      copy[rIdx].topics.splice(tIdx, 1);
      return copy;
    });
  };

  const handleDeleteSubtopic = (rIdx, tIdx, sIdx) => {
    setActiveRoadmaps(prev => {
      const copy = JSON.parse(JSON.stringify(prev));
      copy[rIdx].topics[tIdx].subtopics.splice(sIdx, 1);
      return copy;
    });
  };

  const handleDeleteRoadmap = (rIdx) => {
    setActiveRoadmaps(prev => prev.filter((_, idx) => idx !== rIdx));
  };

  const [errors, setErrors] = useState({});

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!newTitle.trim()) {
      newErrors.title = 'This field is required.';
    }

    if (creationMethod === 'manual' && activeRoadmaps.length === 0) {
      newErrors.roadmaps = 'Please select at least one learning path to compile.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    if (creationMethod === 'ai') {
      const filteredRoadmaps = aiConfiguredRoadmap.filter(track => aiSelectedTracks.includes(track.title));

      const tag = filteredRoadmaps.map(r => r.title.slice(0, 4).toUpperCase()).join(' · ');

      const rawText = `${aiSubject} ${newTitle} ${newDesc} ${filteredRoadmaps.map(r => r.title).join(' ')}`;
      const extractedTech = extractTechnology(rawText);
      const aiTech = extractedTech || aiSubject || (filteredRoadmaps[0] ? filteredRoadmaps[0].title : newTitle);
      const aiTechSlug = aiTech.toLowerCase().replace(/[^a-z0-9]/g, '');

      const wsId = `ws-${Date.now()}`;
      const newWs = {
        id: wsId,
        title: newTitle,
        description: newDesc,
        category: newCategory,
        tag: extractedTech ? extractedTech.toUpperCase() : (tag || 'AI'),
        technology: aiTech,
        technologySlug: aiTechSlug,
        technologyId: aiTechSlug,
        roadmaps: filteredRoadmaps,
        projects: aiSelectedProjects.map(name => {
          const matchingProj = availableProjects.find(p => p.name === name);
          return {
            name,
            trackTitle: matchingProj ? matchingProj.trackTitle : '',
            done: false
          };
        }),
        milestones: filteredRoadmaps.flatMap(r => r.milestones || []),
        colorTheme: 'tertiary',
        icon: 'auto_awesome'
      };

      await addWorkspace(newWs);

      // Create tasks for selected projects!
      for (const proj of newWs.projects) {
        await addTask({
          text: `Build project: ${proj.name} (${proj.trackTitle})`,
          workspaceId: wsId,
          priority: 'High',
          dueDate: '',
          dueTime: ''
        });
      }

      // Reset AI States
      setAiStep(1);
      setAiSubject('');
      setAiLevel('Beginner');
      setAiHours('2');
      setAiDuration('6 months');
      setAiRawData(null);
      setAiConfiguredRoadmap([]);
      setAiSelectedTracks([]);
      setAiSelectedProjects([]);
      setAiError('');
    } else {
      // Generate tag from selected paths
      const tag = activeRoadmaps
        .map(r => {
          if (r.title === 'Web Development') return 'WEB';
          return r.title.slice(0, 4).toUpperCase();
        })
        .join(' · ');

      const primaryRoadmap = activeRoadmaps[0];
      const rawText = `${primaryRoadmap ? primaryRoadmap.title : ''} ${newTitle} ${newDesc}`;
      const extractedTech = extractTechnology(rawText);
      const techName = extractedTech || (primaryRoadmap ? primaryRoadmap.title : newTitle);
      const techSlug = techName.toLowerCase().replace(/[^a-z0-9]/g, '');

      const newWs = {
        title: newTitle,
        description: newDesc,
        category: newCategory,
        tag: extractedTech ? extractedTech.toUpperCase() : tag,
        technology: techName,
        technologySlug: techSlug,
        technologyId: techSlug,
        roadmaps: activeRoadmaps,
        colorTheme: activeRoadmaps.length % 3 === 0 ? 'primary' : (activeRoadmaps.length % 3 === 1 ? 'secondary' : 'tertiary'),
        icon: activeRoadmaps.some(r => ['fitness', 'gym', 'workout'].some(kw => r.title.toLowerCase().includes(kw))) ? 'fitness_center' : (activeRoadmaps.some(r => r.title.toLowerCase().includes('startup')) ? 'rocket_launch' : 'terminal')
      };

      await addWorkspace(newWs);
    }

    // Clear & close via full reset
    resetModalState();
  };

  const handleOpenWorkspace = (wsId) => {
    navigate(`/workspaces/${wsId}`);
  };

  const filteredWorkspaces = useMemo(() => {
    const categoryFiltered = (workspaces || []).filter(ws => {
      if (activeFilter === 'All') return true;
      return ws.category === activeFilter;
    });
    return sortWorkspacesByRecentActivity(categoryFiltered);
  }, [workspaces, activeFilter]);

  const filteredCollaborated = useMemo(() => {
    const categoryFiltered = (collaboratedWorkspaces || []).filter(ws => {
      if (activeFilter === 'All') return true;
      return ws.category === activeFilter;
    });
    return sortWorkspacesByRecentActivity(categoryFiltered);
  }, [collaboratedWorkspaces, activeFilter]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-background text-on-surface radial-glow-bg select-none">
        <Sidebar />
        <main className="flex-1 flex flex-col h-screen overflow-y-auto no-scrollbar relative z-10">
          <Header hideSearch={true} hideStreak={true} hideLogo={true} />
          <div className="w-full px-8 pt-4 pb-8">
            <WorkspacesSkeleton />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background text-on-surface radial-glow-bg select-none">
      <style>{`
        .add-workspace-popover {
          animation: popover-fade-in 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .add-workspace-bottom-sheet {
          animation: bottom-sheet-slide-in 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes popover-fade-in {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes bottom-sheet-slide-in {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
      `}</style>
      <Sidebar />

      <main className="flex-1 flex flex-col h-screen overflow-y-auto no-scrollbar relative z-10">
        <Header hideSearch={true} hideStreak={true} hideLogo={true} />

        <div className="w-full px-8 pt-4 pb-8 animate-page-transition space-y-8">
          {/* Page Header */}
          <div className="mb-8 animate-text-reveal flex items-center justify-between gap-4">
            <div className="space-y-1 text-left">
              <h2 className="font-display-lg text-2xl md:text-[32px] text-white font-bold tracking-tight leading-tight">
                My Workspaces
              </h2>
              <p className="text-on-surface-variant text-xs md:text-sm font-medium">
                Combine topic roadmaps, log study diaries, and track completion progress rollups.
              </p>
            </div>
            
            {/* Compact Rounded Button on the right */}
            <div className="relative shrink-0">
              <button
                ref={addWorkspaceBtnRef}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsAddMenuOpen(!isAddMenuOpen);
                }}
                className="group flex items-center gap-1.5 px-3 py-1.5 md:px-4 md:py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer border border-[#8B5CF6]/30 bg-[#8B5CF6]/5 hover:bg-[#8B5CF6]/10 hover:border-[#8B5CF6]/50 shadow-[0_0_14px_rgba(139,92,246,0.1)] hover:shadow-[0_0_22px_rgba(139,92,246,0.25)] transition-all shrink-0 select-none text-violet-200 font-label-md"
                title="Add workspace"
              >
                <span className="material-symbols-outlined text-[16px] md:text-[18px] font-bold">add</span>
                <span className="hidden md:inline">Add Workspace</span>
              </button>

              {/* TWO-OPTION PORTAL POPOVER / MOBILE BOTTOM SHEET */}
              {isAddMenuOpen && createPortal(
                <>
                  {/* Mobile Bottom Sheet (Screen width < 768px) */}
                  <div className="md:hidden fixed inset-0 z-[99999] flex items-end justify-center">
                    <div 
                      className="fixed inset-0 bg-black/70 backdrop-blur-sm animate-fade-in"
                      onClick={() => setIsAddMenuOpen(false)}
                    />
                    <div className="relative w-full bg-[#111118] border-t border-white/10 rounded-t-3xl p-6 space-y-4 text-left z-10 shadow-2xl add-workspace-bottom-sheet">
                      <div className="flex items-center justify-between border-b border-white/5 pb-3">
                        <div className="flex items-center gap-2">
                          <span className="font-space-grotesk text-sm font-bold text-white uppercase tracking-wider">Add Workspace</span>
                          <span className="text-[9px] text-[#8B5CF6] font-bold uppercase tracking-widest bg-primary/10 px-2 py-0.5 rounded-full">MasterOS</span>
                        </div>
                        <button 
                          onClick={() => setIsAddMenuOpen(false)}
                          className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-zinc-400 hover:text-white"
                        >
                          <span className="material-symbols-outlined text-base">close</span>
                        </button>
                      </div>
                      
                      {/* Option 1: Create Workspace */}
                      <button
                        onClick={() => {
                          setIsAddMenuOpen(false);
                          setIsModalOpen(true);
                        }}
                        className="w-full text-left p-4 rounded-xl border border-[#8B5CF6]/30 bg-[#8B5CF6]/10 hover:bg-[#8B5CF6]/20 transition-all flex items-start gap-3.5 cursor-pointer text-white"
                      >
                        <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center text-primary shrink-0">
                          <span className="material-symbols-outlined text-xl">create_new_folder</span>
                        </div>
                        <div className="space-y-0.5">
                          <div className="text-xs font-black uppercase tracking-wider text-white">Create Workspace</div>
                          <div className="text-[11px] text-zinc-400 leading-relaxed font-medium">Start a new learning roadmap</div>
                        </div>
                      </button>
                      
                      {/* Option 2: Join / View Workspace */}
                      <button
                        onClick={() => {
                          setIsAddMenuOpen(false);
                          setIsJoinSharedModalOpen(true);
                        }}
                        className="w-full text-left p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all flex items-start gap-3.5 cursor-pointer text-white"
                      >
                        <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-[#8B5CF6] shrink-0">
                          <span className="material-symbols-outlined text-xl">hub</span>
                        </div>
                        <div className="space-y-0.5">
                          <div className="text-xs font-black uppercase tracking-wider text-white">Join / View Workspace</div>
                          <div className="text-[11px] text-zinc-400 leading-relaxed font-medium">Join or view a shared workspace</div>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Desktop Popover (Screen width >= 768px) */}
                  <div className="hidden md:block">
                    <div 
                      className="fixed inset-0 z-[99998] bg-black/20 backdrop-blur-[1px]" 
                      onClick={() => setIsAddMenuOpen(false)}
                    />
                    <div 
                      ref={addWorkspacePopoverRef}
                      style={popoverStyle}
                      className="bg-[#111118] border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(139,92,246,0.2)] z-[99999] p-4 space-y-3 add-workspace-popover text-left animate-fade-in"
                    >
                      <div className="text-[10px] uppercase tracking-widest font-black text-on-surface-variant mb-1 border-b border-white/5 pb-2 select-none flex items-center justify-between">
                        <span>Add Workspace</span>
                        <span className="text-[9px] text-[#8B5CF6] font-bold">MasterOS</span>
                      </div>
                      
                      {/* Option 1: Create Workspace */}
                      <button
                        onClick={() => {
                          setIsAddMenuOpen(false);
                          setIsModalOpen(true);
                        }}
                        className="w-full text-left p-3.5 rounded-xl border border-[#8B5CF6]/20 bg-[#8B5CF6]/5 hover:bg-[#8B5CF6]/15 hover:border-[#8B5CF6]/50 transition-all flex items-start gap-3 cursor-pointer group/opt text-white border-0 bg-transparent"
                      >
                        <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover/opt:scale-105 group-hover/opt:border-primary transition-all shrink-0">
                          <span className="material-symbols-outlined text-[18px]">create_new_folder</span>
                        </div>
                        <div className="space-y-0.5">
                          <div className="text-xs font-black uppercase tracking-wider text-white group-hover/opt:text-primary transition-colors">Create Workspace</div>
                          <div className="text-[10px] text-on-surface-variant leading-relaxed font-medium">Start a new learning roadmap</div>
                        </div>
                      </button>
                      
                      {/* Option 2: Join / View Workspace */}
                      <button
                        onClick={() => {
                          setIsAddMenuOpen(false);
                          setIsJoinSharedModalOpen(true);
                        }}
                        className="w-full text-left p-3.5 rounded-xl border border-white/5 bg-[#0D0D14]/60 hover:bg-white/[0.06] hover:border-white/15 transition-all flex items-start gap-3 cursor-pointer group/opt text-white border-0 bg-transparent"
                      >
                        <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[#8B5CF6] group-hover/opt:scale-105 group-hover/opt:border-[#8B5CF6] transition-all shrink-0">
                          <span className="material-symbols-outlined text-[18px]">hub</span>
                        </div>
                        <div className="space-y-0.5">
                          <div className="text-xs font-black uppercase tracking-wider text-white group-hover/opt:text-[#8B5CF6] transition-colors">Join / View Workspace</div>
                          <div className="text-[10px] text-on-surface-variant leading-relaxed font-medium">Join or view a shared workspace</div>
                        </div>
                      </button>
                    </div>
                  </div>
                </>,
                document.body
              )}
            </div>
          </div>

          {/* Filter buttons */}
          <div className="flex overflow-x-auto no-scrollbar gap-2.5 pb-1">
            {filters.map((filter, idx) => (
              <button
                key={idx}
                onClick={() => setActiveFilter(filter)}
                className={`px-5 py-2 rounded-full font-label-md text-xs font-semibold whitespace-nowrap transition-all duration-300 cursor-pointer ${activeFilter === filter
                  ? 'bg-primary text-white font-bold shadow-md shadow-primary/20'
                  : 'bg-[#111118] text-on-surface-variant border border-white/5 hover:text-white'
                  }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Workspaces Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {/* Render workspaces list */}
            {filteredWorkspaces.length === 0 ? (
              <div className="col-span-full flex justify-center py-10 w-full animate-fade-in px-4">
                <div className="w-full max-w-[580px] bg-white/[0.018] border border-white/[0.07] rounded-[20px] p-8 md:p-12 flex flex-col items-center text-center space-y-6 shadow-[0_8px_32px_rgba(0,0,0,0.45),0_0_25px_rgba(139,92,246,0.025)]">
                  {/* Icon Box */}
                  <div className="w-16 h-16 rounded-2xl bg-[#8B5CF6]/8 border border-[#8B5CF6]/18 flex items-center justify-center text-primary shadow-[0_0_12px_rgba(139,92,246,0.1)]">
                    <span className="material-symbols-outlined text-[32px]">layers</span>
                  </div>
                  
                  {/* Text Details */}
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-white tracking-tight">No workspaces yet</h3>
                    <p className="text-on-surface-variant text-xs md:text-sm font-medium leading-relaxed max-w-xs mx-auto">
                      Create your first workspace to start learning, building and tracking your progress.
                    </p>
                  </div>
                  
                  {/* CTA Button */}
                  <button 
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer shadow-lg shadow-primary/25 hover:bg-primary/90 hover:scale-105 hover:shadow-primary/35 transition-all duration-200"
                  >
                    <span className="material-symbols-outlined text-[16px]">add</span>
                    Create Workspace
                  </button>
                </div>
              </div>
            ) : (
              filteredWorkspaces.map((ws) => (
                <div key={ws.id} className="cursor-pointer" onClick={() => handleOpenWorkspace(ws.id)}>
                  <WorkspaceCard
                    id={ws.id}
                    title={ws.title}
                    description={ws.description}
                    tag={ws.tag}
                    technology={ws.technology}
                    technologySlug={ws.technologySlug}
                    technologyId={ws.technologyId}
                    progress={ws.progress}
                    streak={ws.streak}
                    isPublic={ws.isPublic}
                    tasksLeft={0}
                    totalTasks={0}
                    icon={ws.icon}
                    bannerImage={ws.bannerImage}
                    colorTheme={ws.colorTheme}
                  />
                </div>
              ))
            )}
          </div>

          {/* Collaborated Workspaces Section */}
          {(collaboratedWorkspaces || []).length > 0 && (
            <div className="space-y-6 pt-4">
              <div className="border-t border-white/5 pt-8">
                <h3 className="font-display-lg text-lg font-bold text-white uppercase tracking-wider mb-2">
                  Collaborated Workspaces
                </h3>
                <p className="text-on-surface-variant text-xs mb-6 font-medium">
                  Workspaces you have been invited to collaborate on.
                </p>
              </div>

              {filteredCollaborated.length === 0 ? (
                <div className="p-8 bg-white/[0.018] border border-white/[0.07] rounded-xl text-center space-y-2.5">
                  <span className="material-symbols-outlined text-on-surface-variant/40 text-3xl">group</span>
                  <p className="text-xs text-on-surface-variant italic font-medium">No collaborated workspaces match the active filter.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                  {filteredCollaborated.map((ws) => {
                    const ownerObj = allUsers.find(u => u.uid === ws.ownerId);
                    const ownerName = ownerObj ? ownerObj.fullName : 'Owner';
                    return (
                      <div key={ws.id} className="cursor-pointer" onClick={() => handleOpenWorkspace(ws.id)}>
                        <WorkspaceCard
                          id={ws.id}
                          title={ws.title}
                          description={ws.description}
                          tag={ws.tag}
                          technology={ws.technology}
                          technologySlug={ws.technologySlug}
                          technologyId={ws.technologyId}
                          progress={ws.progress}
                          streak={ws.streak}
                          isPublic={ws.isPublic}
                          tasksLeft={0}
                          totalTasks={0}
                          icon={ws.icon}
                          bannerImage={ws.bannerImage}
                          colorTheme={ws.colorTheme}
                          isCollaborated={true}
                          ownerName={ownerName}
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

        </div>
      </main>

      {/* Create Workspace Modal */}
      <Modal isOpen={isModalOpen} onClose={resetModalState} title="Create New Workspace">
        <form onSubmit={handleCreateSubmit} className="space-y-5">
          <InputField
            id="ws-title"
            label="Workspace Name"
            placeholder="e.g. My Placement Journey"
            value={newTitle}
            onChange={(e) => {
              setNewTitle(e.target.value);
              if (errors.title) setErrors(prev => ({ ...prev, title: '' }));
            }}
            required
            error={errors.title}
          />
          <InputField
            id="ws-desc"
            label="Description"
            placeholder="e.g. Solve DSA and learn React concepts"
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
          />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">Category</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full bg-[#111118] border border-white/5 rounded-lg p-3 text-on-surface focus:outline-none focus:border-primary text-xs"
              >
                <option value="Learning">Learning</option>
                <option value="Projects">Projects</option>
                <option value="Goals">Goals</option>
                <option value="Fitness">Fitness</option>
                <option value="Startup">Startup</option>
                <option value="Personal">Personal</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">Roadmap Method</label>
              <div className="flex gap-2 bg-[#111118] p-1.5 rounded-lg border border-white/5">
                <button
                  type="button"
                  onClick={() => {
                    setCreationMethod('manual');
                    setErrors(prev => ({ ...prev, ai: '', roadmaps: '' }));
                  }}
                  className={`flex-1 py-1 rounded text-[10px] font-bold uppercase transition-all cursor-pointer ${creationMethod === 'manual' ? 'bg-primary text-white' : 'text-on-surface-variant hover:text-white'
                    }`}
                >
                  Manual
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCreationMethod('ai');
                    setErrors(prev => ({ ...prev, roadmaps: '' }));
                  }}
                  className={`flex-1 py-1 rounded text-[10px] font-bold uppercase transition-all cursor-pointer ${creationMethod === 'ai' ? 'bg-primary text-white' : 'text-on-surface-variant hover:text-white'
                    }`}
                >
                  AI Generated
                </button>
              </div>
            </div>
          </div>

          {/* Manual Roadmap Builder with Popular Languages & Dropdowns */}
          {creationMethod === 'manual' ? (
            <div className="space-y-5">
              {/* Popular Learning Paths */}
              <div className="space-y-2">
                <label className="block text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">Popular Learning Paths</label>
                <div className="grid grid-cols-4 gap-2 bg-[#111118]/60 p-3 rounded-lg border border-white/5">
                  {POPULAR_PATHS.map(path => {
                    const active = activeRoadmaps.some(r => r.title.toLowerCase() === path.toLowerCase());
                    return (
                      <button
                        key={path}
                        type="button"
                        onClick={() => handleSelectPath(path)}
                        className={`py-2 px-1 text-[10px] font-bold uppercase rounded-lg border text-center transition-all cursor-pointer truncate ${active
                          ? 'border-primary bg-primary/25 text-white'
                          : 'border-white/5 bg-transparent text-on-surface-variant hover:text-white'
                          }`}
                      >
                        {path}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Search More Technologies / Custom Adder */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">Search More Technologies</label>
                  <SearchableSingleSelect
                    options={technologies}
                    value=""
                    onChange={(opt) => handleSelectPath(opt.name)}
                    placeholder="Search other paths..."
                    customRequestLabel="Add Custom Path"
                    onCustomRequest={(query) => handleSelectPath(query)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">Add Custom Technology</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      id="custom-tech-path"
                      placeholder="e.g. NextJS, Firebase"
                      className="flex-grow bg-[#111118] border border-white/5 rounded-lg p-2.5 text-[11px] text-on-surface focus:outline-none"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          if (e.target.value.trim()) {
                            handleSelectPath(e.target.value.trim());
                            e.target.value = '';
                          }
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const input = document.getElementById('custom-tech-path');
                        if (input && input.value.trim()) {
                          handleSelectPath(input.value.trim());
                          input.value = '';
                        }
                      }}
                      className="px-3 bg-white/5 border border-white/5 rounded-lg text-[10px] font-bold uppercase text-white hover:bg-white/10"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              {/* Topic Hierarchy Customizer / Editor */}
              {activeRoadmaps.length > 0 && (
                <div className="space-y-4 pt-2 border-t border-white/5">
                  <label className="block text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">Customize Topic Hierarchies</label>
                  <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1 no-scrollbar">
                    {activeRoadmaps.map((roadmap, rIdx) => (
                      <div key={roadmap.id} className="p-4 bg-[#0D0D14]/40 border border-white/5 rounded-xl space-y-4 relative">
                        <div className="flex justify-between items-center border-b border-white/5 pb-2">
                          <span className="text-[11px] font-bold text-white flex items-center gap-1.5 uppercase tracking-wider">
                            <span className="material-symbols-outlined text-[14px] text-primary">terminal</span>
                            {roadmap.title}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleDeleteRoadmap(rIdx)}
                            className="text-[9px] text-red-400 font-bold hover:underline cursor-pointer uppercase tracking-wider bg-transparent border-0"
                          >
                            Remove Path
                          </button>
                        </div>

                        <div className="space-y-4">
                          {roadmap.topics.map((topic, tIdx) => (
                            <div key={topic.id} className="space-y-2 pl-2 border-l border-primary/20">
                              <div className="flex justify-between items-center">
                                <span className="text-[10px] font-bold text-white/80">
                                  ▼ {topic.title}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteTopic(rIdx, tIdx)}
                                  className="text-[9px] text-on-surface-variant/60 hover:text-red-400 font-bold bg-transparent border-0 cursor-pointer"
                                >
                                  Delete Topic
                                </button>
                              </div>

                              {/* Subtopics */}
                              <div className="space-y-2 pl-4">
                                {topic.subtopics.map((sub, sIdx) => (
                                  <div key={sub.id} className="flex justify-between items-center text-[10px] group">
                                    <div
                                      onClick={() => handleToggleSubtopic(rIdx, tIdx, sIdx)}
                                      className="flex items-center gap-2 cursor-pointer select-none text-on-surface hover:text-white"
                                    >
                                      <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-all ${sub.done ? 'border-primary bg-primary' : 'border-white/10 group-hover:border-primary/50'
                                        }`}>
                                        {sub.done && <span className="material-symbols-outlined text-white text-[8px] font-bold">check</span>}
                                      </div>
                                      <span className={sub.done ? 'line-through text-on-surface-variant' : 'font-medium'}>
                                        {sub.title}
                                      </span>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteSubtopic(rIdx, tIdx, sIdx)}
                                      className="text-[9px] text-on-surface-variant/40 hover:text-red-400 cursor-pointer hidden group-hover:block bg-transparent border-0"
                                    >
                                      ✕
                                    </button>
                                  </div>
                                ))}

                                {/* Add subtopic input */}
                                <div className="flex gap-2 pt-1.5">
                                  <input
                                    type="text"
                                    placeholder="Add subtopic..."
                                    id={`new-sub-${rIdx}-${tIdx}`}
                                    className="bg-[#111118] border border-white/5 rounded px-2.5 py-1 text-[9px] text-white focus:outline-none focus:border-primary flex-grow max-w-[140px]"
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleAddSubtopic(rIdx, tIdx, e.target.value);
                                        e.target.value = '';
                                      }
                                    }}
                                  />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const input = document.getElementById(`new-sub-${rIdx}-${tIdx}`);
                                      if (input) {
                                        handleAddSubtopic(rIdx, tIdx, input.value);
                                        input.value = '';
                                      }
                                    }}
                                    className="px-2.5 py-1 bg-white/5 border border-white/5 rounded text-[9px] font-bold text-white hover:bg-white/10 uppercase"
                                  >
                                    Add
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}

                          {/* Add Topic Input */}
                          <div className="flex gap-2 pt-2 border-t border-white/5">
                            <input
                              type="text"
                              placeholder="New main topic (e.g. Intermediate)..."
                              id={`new-topic-${rIdx}`}
                              className="bg-[#111118] border border-white/5 rounded-lg px-3 py-1.5 text-[10px] text-white focus:outline-none focus:border-primary flex-grow"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  handleAddTopic(rIdx, e.target.value);
                                  e.target.value = '';
                                }
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const input = document.getElementById(`new-topic-${rIdx}`);
                                if (input) {
                                  handleAddTopic(rIdx, input.value);
                                  input.value = '';
                                }
                              }}
                              className="px-3 bg-white/5 border border-white/5 rounded-lg text-[9px] font-bold uppercase text-white hover:bg-white/10"
                            >
                              Add Topic
                            </button>
                          </div>
                        </div>

                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6 pt-2">
              {/* Stepper indicator */}
              <div className="flex justify-between items-center bg-[#111118]/80 p-3.5 rounded-xl border border-white/5">
                <span className="text-[10px] font-black uppercase text-primary tracking-widest">
                  AI Workspace Builder
                </span>
                <span className="text-[10px] font-black uppercase text-on-surface-variant tracking-wider">
                  Step {aiStep} of 6
                </span>
              </div>

              {/* Step 1: Input Setup */}
              {aiStep === 1 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="block text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">What do you want to learn?</label>
                    <input
                      type="text"
                      value={aiSubject}
                      onChange={(e) => {
                        setAiSubject(e.target.value);
                        if (errors.aiSubject) setErrors(prev => ({ ...prev, aiSubject: '' }));
                      }}
                      className="w-full bg-[#111118] border border-white/5 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-primary placeholder:text-on-surface-variant/40"
                      placeholder="e.g. Frontend Development, Full Stack, Python, DSA, AI/ML, DevOps"
                    />
                    {errors.aiSubject && (
                      <p className="text-[10px] text-red-400 font-bold">{errors.aiSubject}</p>
                    )}
                    {aiError && (
                      <div className="p-3 bg-red-950/20 border border-red-500/20 rounded-lg text-[11px] text-red-400 font-medium">
                        ⚠️ {aiError}
                      </div>
                    )}
                  </div>

                  {/* Suggestion Chips */}
                  <div className="space-y-1.5">
                    <span className="block text-[9px] uppercase font-bold text-on-surface-variant tracking-wider font-bold">Suggested Goals</span>
                    <div className="flex flex-wrap gap-2">
                      {['Frontend Development', 'Full Stack Development', 'Python', 'DSA', 'AI/ML', 'DevOps'].map(chip => (
                        <button
                          key={chip}
                          type="button"
                          onClick={() => {
                            setAiSubject(chip);
                            if (errors.aiSubject) setErrors(prev => ({ ...prev, aiSubject: '' }));
                          }}
                          className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${aiSubject === chip
                            ? 'bg-primary/20 border-primary text-white scale-[1.03]'
                            : 'bg-white/5 border-transparent text-on-surface-variant hover:text-white'
                            }`}
                        >
                          {chip}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="block text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">Level</label>
                      <select
                        value={aiLevel}
                        onChange={(e) => setAiLevel(e.target.value)}
                        className="w-full bg-[#111118] border border-white/5 rounded-lg p-3 text-on-surface focus:outline-none focus:border-primary text-xs"
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">Study Hours/day</label>
                      <select
                        value={aiHours}
                        onChange={(e) => setAiHours(e.target.value)}
                        className="w-full bg-[#111118] border border-white/5 rounded-lg p-3 text-on-surface focus:outline-none focus:border-primary text-xs"
                      >
                        <option value="1">1 hour</option>
                        <option value="2">2 hours</option>
                        <option value="4">4 hours</option>
                        <option value="6">6 hours</option>
                        <option value="8">8 hours</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">Duration</label>
                      <select
                        value={aiDuration}
                        onChange={(e) => setAiDuration(e.target.value)}
                        className="w-full bg-[#111118] border border-white/5 rounded-lg p-3 text-on-surface focus:outline-none focus:border-primary text-xs"
                      >
                        <option value="1 month">1 month</option>
                        <option value="3 months">3 months</option>
                        <option value="6 months">6 months</option>
                        <option value="12 months">12 months</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Button
                      type="button"
                      variant="primary"
                      className="w-full py-3.5 font-bold uppercase tracking-wider text-xs"
                      onClick={handleStartAiGeneration}
                      disabled={aiGenerating}
                      icon={aiGenerating ? 'sync' : 'auto_awesome'}
                    >
                      {aiGenerating ? 'Generating learning tracks...' : 'Generate Roadmap'}
                    </Button>
                    {aiGenerating && (
                      <div className="mt-4 p-4 rounded-xl bg-[#111118] border border-white/5">

                        <div className="flex justify-between mb-2">
                          <span className="text-[11px] text-white font-bold">
                            {aiStage}
                          </span>

                          <span className="text-[11px] text-primary font-bold">
                            {aiProgress}%
                          </span>
                        </div>

                        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary transition-all duration-700"
                            style={{ width: `${aiProgress}%` }}
                          />
                        </div>

                        <p className="mt-3 text-[10px] text-on-surface-variant">
                          Building your personalized roadmap...
                        </p>

                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 2: Tracks Selection */}
              {aiStep === 2 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-xs font-black text-white uppercase tracking-wider">Select Learning Tracks</h3>
                    <p className="text-[10px] text-on-surface-variant leading-relaxed">Choose which generated areas you want to include in your workspace roadmap.</p>
                  </div>

                  <div className="space-y-2 bg-[#111118]/60 p-4 rounded-xl border border-white/5 max-h-[250px] overflow-y-auto no-scrollbar">
                    {aiConfiguredRoadmap.map((track) => {
                      const checked = aiSelectedTracks.includes(track.title);
                      return (
                        <div
                          key={track.title}
                          onClick={() => handleToggleTrack(track.title)}
                          className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${checked ? 'bg-primary-container/10 border-primary' : 'bg-transparent border-white/5 hover:border-white/10'
                            }`}
                        >
                          <span className="text-[11px] font-bold text-white">{track.title}</span>
                          <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${checked ? 'border-primary bg-primary' : 'border-white/10'
                            }`}>
                            {checked && <span className="material-symbols-outlined text-white text-[10px] font-bold">check</span>}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex gap-3 justify-end pt-2">
                    <Button variant="ghost" onClick={() => setAiStep(1)}>Back</Button>
                    <Button
                      variant="primary"
                      onClick={() => setAiStep(3)}
                      disabled={aiSelectedTracks.length === 0}
                      icon="arrow_forward"
                    >
                      Configure Topics
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3 & 4: Configure Topics & Subtopics */}
              {aiStep === 3 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-xs font-black text-white uppercase tracking-wider">Configure Topics & Subtopics</h3>
                    <p className="text-[10px] text-on-surface-variant leading-relaxed">Edit, reorder, delete, or append topics and subtopics inside each track.</p>
                  </div>

                  <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1 no-scrollbar">
                    {aiConfiguredRoadmap
                      .filter(track => aiSelectedTracks.includes(track.title))
                      .map((track, tIdx) => (
                        <div key={track.id} className="p-4 bg-[#0D0D14]/40 border border-white/5 rounded-xl space-y-4 relative">
                          {/* Track Header */}
                          <div className="flex justify-between items-center border-b border-white/5 pb-2">
                            <input
                              type="text"
                              value={track.title}
                              onChange={(e) => handleEditAiTrackTitle(tIdx, e.target.value)}
                              className="text-[11px] font-bold text-white bg-transparent border-0 focus:ring-0 focus:outline-none w-2/3 uppercase tracking-wider"
                            />
                            <button
                              type="button"
                              onClick={() => handleToggleTrack(track.title)}
                              className="text-[9px] text-red-400 font-bold hover:underline cursor-pointer uppercase tracking-wider bg-transparent border-0"
                            >
                              Remove Track
                            </button>
                          </div>

                          {/* Topics List */}
                          <div className="space-y-4">
                            {track.topics.map((topic, topicIdx) => (
                              <div key={topic.id} className="space-y-2 pl-2 border-l border-primary/20">
                                <div className="flex justify-between items-center">
                                  <input
                                    type="text"
                                    value={topic.title}
                                    onChange={(e) => handleEditAiTopicTitle(tIdx, topicIdx, e.target.value)}
                                    className="text-[10px] font-bold text-white/80 bg-transparent border-0 focus:ring-0 focus:outline-none w-2/3"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteAiTopic(tIdx, topicIdx)}
                                    className="text-[9px] text-on-surface-variant/60 hover:text-red-400 font-bold bg-transparent border-0 cursor-pointer"
                                  >
                                    Delete Topic
                                  </button>
                                </div>

                                {/* Subtopics List */}
                                <div className="space-y-2 pl-4">
                                  {topic.subtopics.map((sub, subIdx) => (
                                    <div key={sub.id} className="flex justify-between items-center text-[10px] group">
                                      <input
                                        type="text"
                                        value={sub.title}
                                        onChange={(e) => handleEditAiSubtopicTitle(tIdx, topicIdx, subIdx, e.target.value)}
                                        className="text-[10px] text-on-surface bg-transparent border-0 focus:ring-0 focus:outline-none w-1/2"
                                      />
                                      <div className="flex items-center gap-2">
                                        <button
                                          type="button"
                                          onClick={() => handleMoveAiSubtopic(tIdx, topicIdx, subIdx, 'up')}
                                          disabled={subIdx === 0}
                                          className="text-[9px] text-on-surface-variant/40 hover:text-white disabled:opacity-20 cursor-pointer bg-transparent border-0"
                                        >
                                          ▲
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => handleMoveAiSubtopic(tIdx, topicIdx, subIdx, 'down')}
                                          disabled={subIdx === topic.subtopics.length - 1}
                                          className="text-[9px] text-on-surface-variant/40 hover:text-white disabled:opacity-20 cursor-pointer bg-transparent border-0"
                                        >
                                          ▼
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => handleDeleteAiSubtopic(tIdx, topicIdx, subIdx)}
                                          className="text-[9px] text-on-surface-variant/40 hover:text-red-400 cursor-pointer bg-transparent border-0"
                                        >
                                          ✕
                                        </button>
                                      </div>
                                    </div>
                                  ))}

                                  {/* Add Subtopic input */}
                                  <div className="flex gap-2 pt-1.5">
                                    <input
                                      type="text"
                                      placeholder="Add subtopic..."
                                      id={`new-sub-ai-${tIdx}-${topicIdx}`}
                                      className="bg-[#111118] border border-white/5 rounded px-2.5 py-1 text-[9px] text-white focus:outline-none focus:border-primary flex-grow max-w-[140px]"
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                          e.preventDefault();
                                          handleAddAiSubtopic(tIdx, topicIdx, e.target.value);
                                          e.target.value = '';
                                        }
                                      }}
                                    />
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const input = document.getElementById(`new-sub-ai-${tIdx}-${topicIdx}`);
                                        if (input && input.value.trim()) {
                                          handleAddAiSubtopic(tIdx, topicIdx, input.value.trim());
                                          input.value = '';
                                        }
                                      }}
                                      className="px-2.5 py-1 bg-white/5 border border-white/5 rounded text-[9px] font-bold text-white hover:bg-white/10 uppercase"
                                    >
                                      Add
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}

                            {/* Add Topic input */}
                            <div className="flex gap-2 pt-2 border-t border-white/5">
                              <input
                                type="text"
                                placeholder="New main topic (e.g. Intermediate)..."
                                id={`new-topic-ai-${tIdx}`}
                                className="bg-[#111118] border border-white/5 rounded-lg px-3 py-1.5 text-[10px] text-white focus:outline-none focus:border-primary flex-grow"
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleAddAiTopic(tIdx, e.target.value);
                                    e.target.value = '';
                                  }
                                }}
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const input = document.getElementById(`new-topic-ai-${tIdx}`);
                                  if (input && input.value.trim()) {
                                    handleAddAiTopic(tIdx, input.value.trim());
                                    input.value = '';
                                  }
                                }}
                                className="px-3 bg-white/5 border border-white/5 rounded-lg text-[9px] font-bold uppercase text-white hover:bg-white/10"
                              >
                                Add Topic
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>

                  <div className="flex gap-3 justify-end pt-2">
                    <Button variant="ghost" onClick={() => setAiStep(2)}>Back</Button>
                    <Button variant="primary" onClick={handleGoToProjects} icon="arrow_forward">
                      Configure Projects
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 5: Suggested Projects */}
              {aiStep === 5 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-xs font-black text-white uppercase tracking-wider">Choose Learning Projects</h3>
                    <p className="text-[10px] text-on-surface-variant leading-relaxed">Select which generated projects you want to build. These will be added as high priority workspace tasks.</p>
                  </div>

                  <div className="space-y-3 bg-[#111118]/60 p-4 rounded-xl border border-white/5 max-h-[250px] overflow-y-auto no-scrollbar">
                    {availableProjects.length > 0 ? (
                      availableProjects.map((project, idx) => {
                        const checked = aiSelectedProjects.includes(project.name);
                        return (
                          <div
                            key={idx}
                            onClick={() => {
                              if (checked) {
                                setAiSelectedProjects(aiSelectedProjects.filter(p => p !== project.name));
                              } else {
                                setAiSelectedProjects([...aiSelectedProjects, project.name]);
                              }
                            }}
                            className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${checked ? 'bg-primary-container/10 border-primary' : 'bg-transparent border-white/5 hover:border-white/10'
                              }`}
                          >
                            <div>
                              <span className="text-[11px] font-bold text-white block">{project.name}</span>
                              <span className="text-[8px] text-primary uppercase font-bold tracking-wider">{project.trackTitle}</span>
                            </div>
                            <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${checked ? 'border-primary bg-primary' : 'border-white/10'
                              }`}>
                              {checked && <span className="material-symbols-outlined text-white text-[10px] font-bold">check</span>}
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-[10px] text-on-surface-variant text-center py-4">No projects recommended for the selected tracks.</p>
                    )}
                  </div>

                  <div className="flex gap-3 justify-end pt-2">
                    <Button variant="ghost" onClick={() => setAiStep(3)}>Back</Button>
                    <Button variant="primary" onClick={() => setAiStep(6)} icon="arrow_forward">
                      Preview Roadmap
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 6: Final Preview */}
              {aiStep === 6 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-xs font-black text-white uppercase tracking-wider">Final Roadmap Preview</h3>
                    <p className="text-[10px] text-on-surface-variant leading-relaxed">Review the details and confirm the creation of your custom workspace.</p>
                  </div>

                  <div className="bg-[#111118]/60 p-4 rounded-xl border border-white/5 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-[9px] uppercase tracking-widest text-on-surface-variant font-bold block">Goal</span>
                        <span className="text-xs text-white font-bold">{aiSubject}</span>
                      </div>
                      <div>
                        <span className="text-[9px] uppercase tracking-widest text-on-surface-variant font-bold block">Timeline</span>
                        <span className="text-xs text-white font-bold">{aiDuration} ({aiHours}h/day)</span>
                      </div>
                    </div>

                    <div className="border-t border-white/5 pt-3">
                      <span className="text-[9px] uppercase tracking-widest text-on-surface-variant font-bold block mb-2">Compiled Tracks & Projects</span>
                      <div className="flex flex-wrap gap-2">
                        {aiConfiguredRoadmap
                          .filter(track => aiSelectedTracks.includes(track.title))
                          .map((track) => (
                            <span key={track.id} className="text-[9px] font-bold uppercase bg-white/5 border border-white/5 px-2.5 py-1 rounded-full text-white">
                              {track.title} ({track.topics.length} topics)
                            </span>
                          ))}
                      </div>

                      <div className="mt-3 space-y-1">
                        <span className="text-[9px] uppercase tracking-widest text-on-surface-variant font-bold block">Tasks to be Created ({aiSelectedProjects.length})</span>
                        {aiSelectedProjects.map((p, idx) => (
                          <div key={idx} className="text-[10px] text-on-surface flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-[12px] text-primary">task_alt</span>
                            {p}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 justify-end pt-2">
                    <Button variant="ghost" onClick={() => setAiStep(5)}>Back</Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {errors.roadmaps && (
            <p className="text-[11px] text-red-400 font-bold animate-fade-in flex items-center gap-1">
              <span>❌</span> {errors.roadmaps}
            </p>
          )}

          {errors.ai && (
            <p className="text-[11px] text-yellow-400 font-bold animate-fade-in flex items-center gap-1">
              <span>⚠️</span> {errors.ai}
            </p>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
            <Button variant="ghost" onClick={resetModalState}>
              Cancel
            </Button>
            {creationMethod === 'manual' ? (
              <Button type="submit" variant="primary" icon="add">
                Create Workspace
              </Button>
            ) : (
              aiStep === 6 && (
                <Button type="submit" variant="primary" icon="auto_awesome">
                  Confirm & Create Workspace
                </Button>
              )
            )}
          </div>
        </form>
      </Modal>

      <Modal isOpen={isJoinSharedModalOpen} onClose={resetJoinSharedModal} title={sharedViewStep === 'verify' ? "View Shared Workspace" : sharedViewStep === 'view' ? "Shared Workspace Preview" : "Copy Tracks"}>
        {sharedViewStep === 'verify' && (
          <form onSubmit={handleVerifyShare} className="space-y-5">
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">View Shared Workspace</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Enter the workspace credentials shared with you.
              </p>
            </div>
            
            <InputField
              id="workspace-share-id-input"
              label="Workspace ID"
              placeholder="e.g. MOS-FD7X29"
              value={shareIdInput}
              onChange={(e) => setShareIdInput(e.target.value)}
              required
            />
            
            <div className="space-y-2">
              <label className="block text-[10px] uppercase font-bold text-on-surface-variant tracking-wider text-xs font-semibold">Workspace Password</label>
              <div className="relative">
                <input
                  id="workspace-share-password-input"
                  type={showJoinPassword ? 'text' : 'password'}
                  placeholder="Enter sharing password"
                  value={sharePinInput}
                  onChange={(e) => setSharePinInput(e.target.value)}
                  className="w-full bg-[#111118] border border-white/5 rounded-lg px-3.5 py-2.5 text-xs text-on-surface focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowJoinPassword(!showJoinPassword)}
                  className="absolute right-3 top-3 text-on-surface-variant hover:text-white"
                >
                  <span className="material-symbols-outlined text-xs">
                    {showJoinPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {sharedWorkspaceError && (
              <p className="text-[11px] text-red-400 font-bold flex items-center gap-1">
                <span>❌</span> {sharedWorkspaceError}
              </p>
            )}
            
            <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
              <Button variant="ghost" type="button" onClick={resetJoinSharedModal}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={isSharedWorkspaceLoading} icon={isSharedWorkspaceLoading ? "sync" : "arrow_forward"}>
                {isSharedWorkspaceLoading ? "Verifying..." : "View Workspace"}
              </Button>
            </div>
          </form>
        )}

        {sharedViewStep === 'view' && sharedWorkspaceData && (
          <div className="space-y-6">
            <div className="text-center space-y-2 border-b border-white/5 pb-4">
              <span className="text-[9px] uppercase tracking-widest text-[#8B5CF6] font-black block">WORKSPACE</span>
              <span className="material-symbols-outlined text-[16px] text-zinc-500">arrow_downward</span>
              <h3 className="text-lg font-black text-white uppercase tracking-wider">{sharedWorkspaceData.title}</h3>
              <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Owner: @{sharedWorkspaceData.ownerUsername || 'user'}</p>
            </div>

            <div className="space-y-4">
              {sharedWorkspaceData.description && (
                <p className="text-xs text-on-surface-variant leading-relaxed text-center italic bg-white/2 p-3 rounded-lg border border-white/5">
                  "{sharedWorkspaceData.description}"
                </p>
              )}

              <div className="bg-[#111118]/80 border border-white/5 p-4 rounded-xl space-y-2.5">
                <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-wider text-on-surface-variant">
                  <span>Overall Progress</span>
                  <span className="text-primary font-black">{sharedWorkspaceData.progress}% Done</span>
                </div>
                <div className="w-full bg-[#0D0D14] h-2 rounded-full overflow-hidden border border-white/3">
                  <div 
                    className="bg-gradient-to-r from-primary to-secondary h-full rounded-full transition-all duration-500 ease-out shadow-[0_0_8px_rgba(139,92,246,0.4)]" 
                    style={{ width: `${sharedWorkspaceData.progress}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-[9px] uppercase tracking-widest text-on-surface-variant font-bold">Tracks</h4>
              <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1 no-scrollbar animate-fade-in">
                {sharedWorkspaceData.tracks && sharedWorkspaceData.tracks.length > 0 ? (
                  sharedWorkspaceData.tracks.map((track, idx) => (
                    <div key={track.id || idx} className="p-3 bg-background/50 border border-white/5 rounded-xl flex items-center justify-between shadow-sm hover:border-white/10 transition-colors">
                      <span className="text-xs font-bold text-white uppercase tracking-wider">
                        {idx + 1}. {track.title}
                      </span>
                      <span className="text-[10px] font-black text-primary">{track.progress}% Done</span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-on-surface-variant italic">No tracks available inside this workspace.</p>
                )}
              </div>
            </div>

            <div className="flex justify-between gap-3 pt-4 border-t border-white/5">
              <Button variant="ghost" onClick={() => setSharedViewStep('verify')}>
                Close
              </Button>
              <div className="flex gap-2">
                <Button variant="secondary" onClick={handleRequestCollabDirect} icon="groups">
                  Collaborate
                </Button>
                <Button variant="primary" onClick={handleOpenCopyConfirmModal} icon="content_copy">
                  Copy Workspace
                </Button>
              </div>
            </div>
          </div>
        )}

        {sharedViewStep === 'copy' && sharedWorkspaceData && (
          <form onSubmit={handleCopySharedTracks} className="space-y-6">
            <div className="space-y-3">
              <label className="block text-[9px] uppercase font-bold text-on-surface-variant tracking-wider">Copy tracks to workspace:</label>
              <select
                value={targetWorkspaceIdToCopy}
                onChange={(e) => {
                  setTargetWorkspaceIdToCopy(e.target.value);
                  if (e.target.value !== 'new') {
                    setNewWorkspaceNameToCopy('');
                  }
                }}
                className="w-full bg-[#111118] border border-white/5 rounded-lg px-3 py-2 text-xs text-on-surface focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                required
              >
                <option value="">-- Select Workspace --</option>
                <option value="new">+ Create new workspace</option>
                {(workspaces || []).map(ws => (
                  <option key={ws.id} value={ws.id}>{ws.title}</option>
                ))}
              </select>
            </div>

            {targetWorkspaceIdToCopy === 'new' && (
              <InputField
                id="new-workspace-name-to-copy"
                label="New Workspace Name"
                placeholder="e.g. My Study Copy"
                value={newWorkspaceNameToCopy}
                onChange={(e) => setNewWorkspaceNameToCopy(e.target.value)}
                required
              />
            )}

            <div className="space-y-3">
              <label className="block text-[9px] uppercase font-bold text-on-surface-variant tracking-wider">Select Tracks to Copy:</label>
              <div className="space-y-2.5 max-h-[180px] overflow-y-auto pr-1 no-scrollbar">
                {sharedWorkspaceData.tracks && sharedWorkspaceData.tracks.map((track) => {
                  const isChecked = selectedTracksToCopy.includes(track.id || track.title);
                  return (
                    <div
                      key={track.id || track.title}
                      onClick={() => {
                        if (isChecked) {
                          setSelectedTracksToCopy(selectedTracksToCopy.filter(id => id !== (track.id || track.title)));
                        } else {
                          setSelectedTracksToCopy([...selectedTracksToCopy, track.id || track.title]);
                        }
                      }}
                      className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                        isChecked 
                          ? 'bg-[#8B5CF6]/5 border-primary/45' 
                          : 'bg-transparent border-white/5 hover:border-white/10'
                      }`}
                    >
                      <span className="text-xs font-bold text-white uppercase tracking-wider">{track.title}</span>
                      <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                        isChecked ? 'border-primary bg-primary' : 'border-white/10'
                      }`}>
                        {isChecked && <span className="material-symbols-outlined text-white text-[10px] font-bold">check</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
              <Button variant="ghost" type="button" onClick={() => setSharedViewStep('view')}>
                Back
              </Button>
              <Button type="submit" variant="primary" icon="content_copy">
                Copy Selected Tracks
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* Custom MasterOS Copy Confirmation Modal */}
      <Modal
        isOpen={isCopyConfirmModalOpen}
        onClose={() => setIsCopyConfirmModalOpen(false)}
        title="Copy Workspace"
      >
        <div className="space-y-5 text-left">
          <div className="flex items-center gap-3.5 p-3.5 bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 rounded-xl text-white">
            <div className="w-10 h-10 rounded-lg bg-[#8B5CF6]/20 border border-[#8B5CF6]/30 flex items-center justify-center text-[#A78BFA] shrink-0">
              <span className="material-symbols-outlined text-xl">content_copy</span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-bold truncate text-white">{sharedWorkspaceData?.title}</div>
              <div className="text-[10px] text-on-surface-variant font-medium">Shared Workspace by @{sharedWorkspaceData?.ownerUsername || 'owner'}</div>
            </div>
          </div>

          <p className="text-xs text-on-surface-variant leading-relaxed">
            Create your own editable copy of this workspace and its complete roadmap tracks.
          </p>

          <div className="p-3.5 bg-[#0D0D14] border border-white/5 rounded-xl space-y-1.5">
            <div className="text-[11px] font-bold text-white flex items-center gap-1.5">
              <span className="material-symbols-outlined text-xs text-primary">info</span>
              Fresh Progress Notice
            </div>
            <p className="text-[10px] text-on-surface-variant/80 leading-normal">
              Your progress will start from 0%. Your own progress, streaks, and activity history will not be copied from the shared owner.
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
            <Button variant="ghost" onClick={() => setIsCopyConfirmModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              icon="content_copy"
              onClick={handleExecuteCopyWorkspace}
              disabled={isSharedWorkspaceLoading}
            >
              {isSharedWorkspaceLoading ? 'Copying...' : 'Copy Workspace'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Non-blocking MasterOS Toast System */}
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'success' })}
      />
    </div>
  );
};

export default Workspaces;
