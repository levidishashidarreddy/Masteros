import React, { useState, useEffect, useContext, useRef, useLayoutEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Button from '../components/Button';
import ProgressRing from '../components/ProgressRing';
import Modal from '../components/Modal';
import InputField from '../components/InputField';
import { TaskContext } from '../context/TaskContext';
import { WorkspaceDetailSkeleton } from '../components/Skeleton';
import ErrorState from '../components/ErrorState';

import Toast from '../components/Toast';
import DSAWorkspace from '../components/DSA/DSAWorkspace';

import { AvatarImg, getAvatar } from '../components/Avatar';

// ─── Language Visual Identity System ────────────────────────────────────────
const LANG_THEMES = {
  dsa:          { gradientFrom: '#1B0938', accent: '#A855F7', iconSlug: 'leetcode',   iconColor: 'FFA116', label: 'DSA & ALGORITHMS' },
  cpp:          { gradientFrom: '#00243A', accent: '#00C8FF', iconSlug: 'cplusplus',   iconColor: '00C8FF', label: 'C++ DEVELOPMENT' },
  c:            { gradientFrom: '#0D1E33', accent: '#5C9CD5', iconSlug: 'c',           iconColor: '5C9CD5', label: 'C LANGUAGE' },
  csharp:       { gradientFrom: '#150A2A', accent: '#512BD4', iconSlug: 'csharp',      iconColor: '512BD4', label: 'C# DEVELOPMENT' },
  python:       { gradientFrom: '#0A1A30', accent: '#3776AB', iconSlug: 'python',      iconColor: '3776AB', label: 'PYTHON DEVELOPMENT' },
  java:         { gradientFrom: '#1E0E00', accent: '#ED8B00', iconSlug: 'openjdk',     iconColor: 'ED8B00', label: 'JAVA DEVELOPMENT' },
  javascript:   { gradientFrom: '#141200', accent: '#F7DF1E', iconSlug: 'javascript',  iconColor: 'F7DF1E', label: 'JAVASCRIPT DEVELOPMENT' },
  typescript:   { gradientFrom: '#050F1F', accent: '#3178C6', iconSlug: 'typescript',  iconColor: '3178C6', label: 'TYPESCRIPT DEVELOPMENT' },
  react:        { gradientFrom: '#001525', accent: '#61DAFB', iconSlug: 'react',       iconColor: '61DAFB', label: 'REACT DEVELOPMENT' },
  react_native: { gradientFrom: '#001525', accent: '#61DAFB', iconSlug: 'react',       iconColor: '61DAFB', label: 'REACT NATIVE' },
  node:         { gradientFrom: '#051005', accent: '#68A063', iconSlug: 'nodedotjs',   iconColor: '68A063', label: 'NODE.JS DEVELOPMENT' },
  html:         { gradientFrom: '#1A0400', accent: '#E34F26', iconSlug: 'html5',       iconColor: 'E34F26', label: 'HTML5 DEVELOPMENT' },
  css:          { gradientFrom: '#00031A', accent: '#264DE4', iconSlug: 'css3',        iconColor: '264DE4', label: 'CSS3 DEVELOPMENT' },
  sql:          { gradientFrom: '#00101A', accent: '#00758F', iconSlug: 'mysql',       iconColor: '00758F', label: 'SQL / DATABASE' },
  mongodb:      { gradientFrom: '#051508', accent: '#47A248', iconSlug: 'mongodb',     iconColor: '47A248', label: 'MONGODB DATABASE' },
  aws:          { gradientFrom: '#100900', accent: '#FF9900', iconSlug: 'amazonaws',   iconColor: 'FF9900', label: 'AWS CLOUD' },
  docker:       { gradientFrom: '#000D1E', accent: '#2496ED', iconSlug: 'docker',      iconColor: '2496ED', label: 'DOCKER / CONTAINERS' },
  kubernetes:   { gradientFrom: '#04102A', accent: '#326CE5', iconSlug: 'kubernetes',  iconColor: '326CE5', label: 'KUBERNETES' },
  git:          { gradientFrom: '#150200', accent: '#F05032', iconSlug: 'git',         iconColor: 'F05032', label: 'GIT VERSION CONTROL' },
  flutter:      { gradientFrom: '#001020', accent: '#54C5F8', iconSlug: 'flutter',     iconColor: '54C5F8', label: 'FLUTTER DEVELOPMENT' },
  kotlin:       { gradientFrom: '#08001A', accent: '#7F52FF', iconSlug: 'kotlin',      iconColor: '7F52FF', label: 'KOTLIN DEVELOPMENT' },
  swift:        { gradientFrom: '#180600', accent: '#F05138', iconSlug: 'swift',       iconColor: 'F05138', label: 'SWIFT DEVELOPMENT' },
  dart:         { gradientFrom: '#001220', accent: '#0175C2', iconSlug: 'dart',        iconColor: '0175C2', label: 'DART DEVELOPMENT' },
  rust:         { gradientFrom: '#140400', accent: '#CE422B', iconSlug: 'rust',        iconColor: 'CE422B', label: 'RUST DEVELOPMENT' },
  go:           { gradientFrom: '#000E18', accent: '#00ACD7', iconSlug: 'go',          iconColor: '00ACD7', label: 'GO DEVELOPMENT' },
  angular:      { gradientFrom: '#1A0000', accent: '#DD0031', iconSlug: 'angular',     iconColor: 'DD0031', label: 'ANGULAR DEVELOPMENT' },
  vue:          { gradientFrom: '#001A0A', accent: '#42B883', iconSlug: 'vuedotjs',    iconColor: '42B883', label: 'VUE.JS DEVELOPMENT' },
  nextjs:       { gradientFrom: '#000000', accent: '#ffffff', iconSlug: 'nextdotjs',   iconColor: 'ffffff', label: 'NEXT.JS DEVELOPMENT' },
  django:       { gradientFrom: '#04140D', accent: '#092E20', iconSlug: 'django',      iconColor: '44B78B', label: 'DJANGO FRAMEWORK' },
  spring_boot:  { gradientFrom: '#0B1A0A', accent: '#6DB33F', iconSlug: 'springboot',  iconColor: '6DB33F', label: 'SPRING BOOT' },
  php:          { gradientFrom: '#0C0E20', accent: '#777BB4', iconSlug: 'php',         iconColor: '777BB4', label: 'PHP DEVELOPMENT' },
  ruby:         { gradientFrom: '#1A0404', accent: '#CC342D', iconSlug: 'ruby',        iconColor: 'CC342D', label: 'RUBY DEVELOPMENT' },
  tensorflow:   { gradientFrom: '#1C0A00', accent: '#FF6F00', iconSlug: 'tensorflow',  iconColor: 'FF6F00', label: 'TENSORFLOW MACHINE LEARNING' },
  graphql:      { gradientFrom: '#1A0020', accent: '#E10098', iconSlug: 'graphql',     iconColor: 'E10098', label: 'GRAPHQL API' },
  linux:        { gradientFrom: '#0A0A00', accent: '#FCC624', iconSlug: 'linux',       iconColor: 'FCC624', label: 'LINUX OS' },
  default:      { gradientFrom: '#0D0822', accent: '#8B5CF6', iconSlug: null,          iconColor: '8B5CF6', label: 'WORKSPACE' },
};

const SQL_CURATED_RESOURCES = [
  { name: 'SQLBolt', desc: 'Interactive browser SQL exercises', link: 'https://sqlbolt.com/', icon: 'terminal' },
  { name: 'Mode Analytics SQL Tutorial', desc: 'Analytical queries & practical usage', link: 'https://mode.com/sql-tutorial/', icon: 'analytics' },
  { name: 'LeetCode SQL 50', desc: 'Top 50 interview problem set', link: 'https://leetcode.com/studyplan/sql-50/', icon: 'code' },
  { name: 'HackerRank SQL', desc: 'Domain practice problems', link: 'https://www.hackerrank.com/domains/sql', icon: 'quiz' },
  { name: 'StrataScratch', desc: 'Real-world tech interview questions', link: 'https://www.stratascratch.com/', icon: 'work' },
  { name: 'W3Schools SQL', desc: 'Beginner syntax reference', link: 'https://www.w3schools.com/sql/', icon: 'menu_book' },
  { name: 'DataCamp SQL', desc: 'Guided data analysis track', link: 'https://www.datacamp.com/courses/tech:sql', icon: 'school' },
  { name: 'PostgreSQL / pgAdmin', desc: 'Official DBMS management client', link: 'https://www.pgadmin.org/', icon: 'dns' },
  { name: 'MySQL Workbench', desc: 'Visual database design tool', link: 'https://www.mysql.com/products/workbench/', icon: 'storage' },
  { name: 'DBeaver', desc: 'Universal database management tool', link: 'https://dbeaver.io/', icon: 'database' },
  { name: 'Google BigQuery', desc: 'Modern cloud data warehouse', link: 'https://cloud.google.com/bigquery', icon: 'cloud' },
  { name: 'Data Analysts SQL Telegram Community', desc: 'SQL specialists telegram channel', link: 'https://t.me/sqlspecialist', icon: 'send' },
  { name: 'Data Analysts WhatsApp Channel', desc: 'SQL, Tableau & Python updates', link: 'https://whatsapp.com/channel/0029VaGgzAk72WTmQFERKh02', icon: 'chat' },
  { name: 'CodeWithHarry SQL Complete Course', desc: 'Full YouTube video tutorial', link: 'https://www.youtube.com/results?search_query=codewithharry+sql', icon: 'play_circle' }
];

const detectLangTheme = (ws) => {
  if (!ws) return LANG_THEMES.default;
  // Step 1: Explicit technology property FIRST
  const target = (ws.technology || ws.technologySlug || ws.technologyId || '').toLowerCase().trim();
  if (target) {
    if (target.includes('dsa') || target.includes('data structure') || target.includes('algorithm')) return LANG_THEMES.dsa;
    if (target.includes('c++') || target === 'cpp' || target === 'cplusplus') return LANG_THEMES.cpp;
    if (target.includes('c#') || target === 'csharp' || target === 'cs') return LANG_THEMES.csharp;
    if (target === 'c' || target === 'c language') return LANG_THEMES.c;
    if (target.includes('python')) return LANG_THEMES.python;
    if (target.includes('javascript') || target === 'js') return LANG_THEMES.javascript;
    if (target.includes('typescript') || target === 'ts') return LANG_THEMES.typescript;
    if (target.includes('react native') || target === 'react_native') return LANG_THEMES.react_native;
    if (target.includes('react')) return LANG_THEMES.react;
    if (target.includes('node')) return LANG_THEMES.node;
    if (target.includes('next')) return LANG_THEMES.nextjs;
    if (target.includes('vue')) return LANG_THEMES.vue;
    if (target.includes('angular')) return LANG_THEMES.angular;
    if (target.includes('django')) return LANG_THEMES.django;
    if (target.includes('spring')) return LANG_THEMES.spring_boot;
    if (target.includes('docker')) return LANG_THEMES.docker;
    if (target.includes('kubernetes') || target.includes('k8s')) return LANG_THEMES.kubernetes;
    if (target.includes('aws') || target.includes('amazon')) return LANG_THEMES.aws;
    if (target.includes('flutter')) return LANG_THEMES.flutter;
    if (target.includes('sql') || target.includes('mysql') || target.includes('postgres') || target.includes('database')) return LANG_THEMES.sql;
    if (target.includes('mongo')) return LANG_THEMES.mongodb;
    if (target.includes('go') || target.includes('golang')) return LANG_THEMES.go;
    if (target.includes('rust')) return LANG_THEMES.rust;
    if (target.includes('php')) return LANG_THEMES.php;
    if (target.includes('ruby')) return LANG_THEMES.ruby;
    if (target.includes('kotlin')) return LANG_THEMES.kotlin;
    if (target.includes('swift')) return LANG_THEMES.swift;
    if (target.includes('dart')) return LANG_THEMES.dart;
    if (target.includes('html')) return LANG_THEMES.html;
    if (target.includes('css')) return LANG_THEMES.css;
    if (target.includes('git')) return LANG_THEMES.git;
    if (target.includes('tensorflow')) return LANG_THEMES.tensorflow;
    if (target.includes('graphql')) return LANG_THEMES.graphql;
    if (target.includes('linux')) return LANG_THEMES.linux;
    if (target.includes('java') && !target.includes('javascript')) return LANG_THEMES.java;

    return {
      ...LANG_THEMES.default,
      label: `${target.toUpperCase()} WORKSPACE`,
      iconSlug: target.replace(/[^a-z0-9]/g, '')
    };
  }

  // Step 2: Check Title & Description for language keywords
  const titleDescStr = `${ws.title || ''} ${ws.description || ''}`.toLowerCase();
  if (titleDescStr) {
    if (titleDescStr.includes('c++') || titleDescStr.includes('cpp')) return LANG_THEMES.cpp;
    if (titleDescStr.includes('c#') || titleDescStr.includes('csharp')) return LANG_THEMES.csharp;
    if (titleDescStr.includes('javascript') || /\bjs\b/.test(titleDescStr)) return LANG_THEMES.javascript;
    if (titleDescStr.includes('typescript') || /\bts\b/.test(titleDescStr)) return LANG_THEMES.typescript;
    if (titleDescStr.includes('python')) return LANG_THEMES.python;
    if (titleDescStr.includes('react')) return LANG_THEMES.react;
    if (titleDescStr.includes('node')) return LANG_THEMES.node;
    if (titleDescStr.includes('next')) return LANG_THEMES.nextjs;
    if (titleDescStr.includes('vue')) return LANG_THEMES.vue;
    if (titleDescStr.includes('angular')) return LANG_THEMES.angular;
    if (titleDescStr.includes('django')) return LANG_THEMES.django;
    if (titleDescStr.includes('spring')) return LANG_THEMES.spring_boot;
    if (titleDescStr.includes('docker')) return LANG_THEMES.docker;
    if (titleDescStr.includes('kubernetes')) return LANG_THEMES.kubernetes;
    if (titleDescStr.includes('aws')) return LANG_THEMES.aws;
    if (titleDescStr.includes('flutter')) return LANG_THEMES.flutter;
    if (titleDescStr.includes('sql') || titleDescStr.includes('mysql')) return LANG_THEMES.sql;
    if (titleDescStr.includes('mongo')) return LANG_THEMES.mongodb;
    if (titleDescStr.includes('rust')) return LANG_THEMES.rust;
    if (titleDescStr.includes('go')) return LANG_THEMES.go;
    if (titleDescStr.includes('php')) return LANG_THEMES.php;
    if (titleDescStr.includes('ruby')) return LANG_THEMES.ruby;
    if (titleDescStr.includes('kotlin')) return LANG_THEMES.kotlin;
    if (titleDescStr.includes('swift')) return LANG_THEMES.swift;
    if (titleDescStr.includes('dart')) return LANG_THEMES.dart;
    if (titleDescStr.includes('html')) return LANG_THEMES.html;
    if (titleDescStr.includes('css')) return LANG_THEMES.css;
    if (titleDescStr.includes('git')) return LANG_THEMES.git;
    if (titleDescStr.includes('java') && !titleDescStr.includes('javascript')) return LANG_THEMES.java;
    if (/\bc\b/.test(titleDescStr) || titleDescStr.includes('c language')) return LANG_THEMES.c;
  }

  // Step 3: Check category, tag, roadmaps fallback
  const tagStr = `${ws.category || ''} ${ws.tag || ''} ${ws.roadmaps && ws.roadmaps[0] ? ws.roadmaps[0].title : ''}`.toLowerCase();
  if (tagStr.includes('c++') || tagStr.includes('cpp')) return LANG_THEMES.cpp;
  if (tagStr.includes('c#') || tagStr.includes('csharp')) return LANG_THEMES.csharp;
  if (tagStr.includes('python')) return LANG_THEMES.python;
  if (tagStr.includes('typescript') || /\bts\b/.test(tagStr)) return LANG_THEMES.typescript;
  if (tagStr.includes('javascript') || /\bjs\b/.test(tagStr)) return LANG_THEMES.javascript;
  if (tagStr.includes('react')) return LANG_THEMES.react;
  if (tagStr.includes('node')) return LANG_THEMES.node;
  if (tagStr.includes('next')) return LANG_THEMES.nextjs;
  if (tagStr.includes('vue')) return LANG_THEMES.vue;
  if (tagStr.includes('angular')) return LANG_THEMES.angular;
  if (tagStr.includes('django')) return LANG_THEMES.django;
  if (tagStr.includes('spring')) return LANG_THEMES.spring_boot;
  if (tagStr.includes('docker')) return LANG_THEMES.docker;
  if (tagStr.includes('kubernetes')) return LANG_THEMES.kubernetes;
  if (tagStr.includes('aws')) return LANG_THEMES.aws;
  if (tagStr.includes('flutter')) return LANG_THEMES.flutter;
  if (tagStr.includes('sql') || tagStr.includes('mysql')) return LANG_THEMES.sql;
  if (tagStr.includes('mongo')) return LANG_THEMES.mongodb;
  if (tagStr.includes('rust')) return LANG_THEMES.rust;
  if (tagStr.includes('go')) return LANG_THEMES.go;
  if (tagStr.includes('php')) return LANG_THEMES.php;
  if (tagStr.includes('ruby')) return LANG_THEMES.ruby;
  if (tagStr.includes('kotlin')) return LANG_THEMES.kotlin;
  if (tagStr.includes('swift')) return LANG_THEMES.swift;
  if (tagStr.includes('dart')) return LANG_THEMES.dart;
  if (tagStr.includes('html')) return LANG_THEMES.html;
  if (tagStr.includes('css')) return LANG_THEMES.css;
  if (tagStr.includes('git')) return LANG_THEMES.git;
  if (tagStr.includes('java') && !tagStr.includes('javascript')) return LANG_THEMES.java;
  return LANG_THEMES.default;
};

// ─── Resource Service Branding System ───────────────────────────────────────
const RESOURCE_SERVICES = [
  { match: ['youtube.com', 'youtu.be'],            slug: 'youtube',        color: 'FF0000', label: 'YouTube' },
  { match: ['github.com'],                          slug: 'github',         color: 'ffffff', label: 'GitHub' },
  { match: ['drive.google.com'],                    slug: 'googledrive',    color: '4285F4', label: 'Google Drive' },
  { match: ['docs.google.com'],                     slug: 'googledocs',     color: '4285F4', label: 'Google Docs' },
  { match: ['notion.so', 'notion.com'],             slug: 'notion',         color: 'ffffff', label: 'Notion' },
  { match: ['linkedin.com'],                        slug: 'linkedin',       color: '0A66C2', label: 'LinkedIn' },
  { match: ['figma.com'],                           slug: 'figma',          color: 'F24E1E', label: 'Figma' },
  { match: ['stackoverflow.com'],                   slug: 'stackoverflow',  color: 'F58025', label: 'Stack Overflow' },
  { match: ['developer.mozilla.org', 'mdn.io'],     slug: 'mdnwebdocs',     color: 'ffffff', label: 'MDN Web Docs' },
  { match: ['leetcode.com'],                        slug: 'leetcode',       color: 'FFA116', label: 'LeetCode' },
  { match: ['codechef.com'],                        slug: 'codechef',       color: 'B92B27', label: 'CodeChef' },
  { match: ['coursera.org'],                        slug: 'coursera',       color: '0056D2', label: 'Coursera' },
  { match: ['udemy.com'],                           slug: 'udemy',          color: 'A435F0', label: 'Udemy' },
  { match: ['npmjs.com'],                           slug: 'npm',            color: 'CB3837', label: 'npm' },
  { match: ['medium.com'],                          slug: 'medium',         color: 'ffffff', label: 'Medium' },
  { match: ['dev.to'],                              slug: 'devdotto',       color: 'ffffff', label: 'DEV Community' },
  { match: ['twitter.com', 'x.com'],               slug: 'x',              color: 'ffffff', label: 'X / Twitter' },
  { match: ['hackerrank.com'],                      slug: 'hackerrank',     color: '00EA64', label: 'HackerRank' },
  { match: ['codeforces.com'],                      slug: 'codeforces',     color: '1F8ACB', label: 'Codeforces' },
  { match: ['geeksforgeeks.org'],                   slug: 'geeksforgeeks',  color: '2F8D46', label: 'GeeksforGeeks' },
  { match: ['freecodecamp.org'],                    slug: 'freecodecamp',   color: '0A0A23', label: 'freeCodeCamp' },
  { match: ['replit.com'],                          slug: 'replit',         color: 'F26207', label: 'Replit' },
  { match: ['codepen.io'],                          slug: 'codepen',        color: 'ffffff', label: 'CodePen' },
];

const CATEGORY_SLUG_MAP = {
  'YouTube':      { slug: 'youtube',      color: 'FF0000' },
  'GitHub':       { slug: 'github',       color: 'ffffff' },
  'Google Drive': { slug: 'googledrive',  color: '4285F4' },
  'Documentation':{ slug: 'readthedocs', color: '8CA1AF' },
  'PDF':          { slug: 'adobeacrobatreader', color: 'EC1C24' },
};

const getResourceMeta = (link, category) => {
  let domain = '';
  try { if (link) domain = new URL(link).hostname.replace('www.', ''); } catch (_) {}
  const matched = RESOURCE_SERVICES.find(s => s.match.some(m => domain.includes(m)));
  if (matched) return { iconUrl: `https://cdn.simpleicons.org/${matched.slug}/${matched.color}`, label: matched.label, domain: domain || category };
  const catMatch = CATEGORY_SLUG_MAP[category];
  if (catMatch) return { iconUrl: `https://cdn.simpleicons.org/${catMatch.slug}/${catMatch.color}`, label: category, domain: domain || category };
  return { iconUrl: null, label: category || 'Resource', domain: domain || category };
};

const WorkspaceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { 
    workspaces, 
    collaboratedWorkspaces,
    currentUser,
    updateWorkspace, 
    touchWorkspace,
    deleteWorkspace,
    toggleSubtopic,
    tasks, 
    addTask, 
    editTask, 
    deleteTask, 
    toggleTask, 
    togglePin,
    friends,
    inviteCollaborator,
    removeCollaborator,
    allUsers,
    userProfile,
    presenceStates,
    logProductiveActivity,
    loading: contextLoading
  } = useContext(TaskContext);

  const ws = (workspaces || []).find(w => w.id === id) || (collaboratedWorkspaces || []).find(w => w.id === id);

  // Pomodoro Study Timer states
  const [timerMinutes, setTimerMinutes] = useState(25);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [timerType, setTimerType] = useState('focus'); // 'focus' or 'break'
  const [selectedDuration, setSelectedDuration] = useState(25);

  useEffect(() => {
    let interval = null;
    if (timerActive) {
      interval = setInterval(() => {
        if (timerSeconds > 0) {
          setTimerSeconds(timerSeconds - 1);
        } else if (timerSeconds === 0) {
          if (timerMinutes === 0) {
            setTimerActive(false);
            clearInterval(interval);
            handleTimerComplete();
          } else {
            setTimerMinutes(timerMinutes - 1);
            setTimerSeconds(59);
          }
        }
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerActive, timerMinutes, timerSeconds]);

  const handleTimerComplete = async () => {
    if (timerType === 'focus') {
      alert("🎉 Great job! Study session completed. You earned +15 XP and maintained your streak!");
      if (logProductiveActivity) {
        await logProductiveActivity('studySession');
      }
    } else {
      alert("☕ Break time is over. Ready to build?");
    }
    resetTimer();
  };

  const startTimer = () => setTimerActive(true);
  const pauseTimer = () => setTimerActive(false);
  const resetTimer = () => {
    setTimerActive(false);
    setTimerMinutes(selectedDuration);
    setTimerSeconds(0);
  };

  const handleSelectDuration = (mins) => {
    setSelectedDuration(mins);
    setTimerMinutes(mins);
    setTimerSeconds(0);
    setTimerActive(false);
  };

  // Skeleton Loading simulation state
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!contextLoading) {
      setLoading(false);
    }
  }, [contextLoading, id]);

  // Form & Modal States
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [taskText, setTaskText] = useState('');
  const [taskPriority, setTaskPriority] = useState('Med');
  const [taskDueDate, setTaskDueDate] = useState('');
  const [taskDueTime, setTaskDueTime] = useState('');
  const [taskRecurring, setTaskRecurring] = useState('None');
  const [taskProgress, setTaskProgress] = useState(0);

  // Invite states
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteFriendId, setInviteFriendId] = useState('');
  const [inviteRole, setInviteRole] = useState('Editor');

  // Resource states
  const [isResourceModalOpen, setIsResourceModalOpen] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [resourceTitle, setResourceTitle] = useState('');
  const [resourceCategory, setResourceCategory] = useState('YouTube');
  const [resourceLink, setResourceLink] = useState('');
  const [resourceThumbnail, setResourceThumbnail] = useState('');

  // Topic add state
  const [isTopicModalOpen, setIsTopicModalOpen] = useState(false);
  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [activeRoadmapForTopic, setActiveRoadmapForTopic] = useState('');

  // Topic edit state
  const [isEditTopicModalOpen, setIsEditTopicModalOpen] = useState(false);
  const [topicToEdit, setTopicToEdit] = useState(null);
  const [editTopicRoadmapId, setEditTopicRoadmapId] = useState('');
  const [editTopicTitle, setEditTopicTitle] = useState('');

  // Overhaul & Delete states
  const [isDeletingWorkspace, setIsDeletingWorkspace] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteStep, setDeleteStep] = useState(0);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [isCollabCollapsed, setIsCollabCollapsed] = useState(true);

  const handleDeleteWorkspaceConfirm = async () => {
    if (!ws || !id) return;
    try {
      setIsDeletingWorkspace(true);
      await deleteWorkspace(id);
      setIsDeletingWorkspace(false);
      setIsDeleteModalOpen(false);
      setDeleteStep(0);
      showToast("Workspace deleted", "success");
      navigate('/workspaces');
    } catch (err) {
      console.error("Error deleting workspace:", err);
      setIsDeletingWorkspace(false);
      showToast("Unable to delete workspace. Please try again.", "error");
    }
  };

  const toggleCollabCollapse = () => {
    setIsCollabCollapsed(!isCollabCollapsed);
  };

  // Subtopic inline state
  const [activeTopicForSubtopic, setActiveTopicForSubtopic] = useState(null);
  const [newSubtopicText, setNewSubtopicText] = useState('');

  // Notepad state
  const [notesText, setNotesText] = useState(ws?.notes || '');
  const [isNotesEditing, setIsNotesEditing] = useState(false);

  useEffect(() => {
    if (ws) {
      setNotesText(ws.notes || '');
    }
  }, [ws]);

  // Local React state for topic accordion open/close state
  const [expandedTopics, setExpandedTopics] = useState({});

  useEffect(() => {
    if (ws && ws.roadmaps) {
      setExpandedTopics(prev => {
        const next = { ...prev };
        let updated = false;
        (ws.roadmaps || []).forEach(rm => {
          (rm.topics || []).forEach(t => {
            const key = `${rm.id}-${t.id}`;
            if (next[key] === undefined) {
              next[key] = !!t.expanded;
              updated = true;
            }
          });
        });
        return updated ? next : prev;
      });
    }
  }, [ws]);

  // Sharing PIN visibility state
  const [showPin, setShowPin] = useState(false);
  const [activeTopicMenu, setActiveTopicMenu] = useState(null);
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const [isSuggestedResourcesOpen, setIsSuggestedResourcesOpen] = useState(false);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  if (!ws) {
    return (
      <div className="flex min-h-screen bg-background text-on-surface select-none">
        <Sidebar />
        <main className="flex-grow p-8 flex items-center justify-center">
          <ErrorState 
            title="Failed to load workspace" 
            description="The workspace you are looking for does not exist or has been deleted."
            onRetry={() => navigate('/workspaces')}
          />
        </main>
      </div>
    );
  }

  // Check if Fitness or Gym category
  const isFitnessOrGym = 
    ws.category === 'Fitness' || 
    ws.id === 'fitness' || 
    ws.title.toLowerCase().includes('fitness') || 
    ws.title.toLowerCase().includes('gym');

  // Check if DSA category or title
  const isDSAWorkspace = 
    ws.category === 'DSA' || 
    ws.technology === 'DSA' || 
    ws.id === 'dsa' || 
    (ws.title && ws.title.toLowerCase().includes('dsa')) || 
    (ws.title && ws.title.toLowerCase().includes('data structures'));

  const isWorkspaceOwner = !ws.ownerId || ws.ownerId === currentUser?.uid;
  const ownerUser = allUsers.find(u => u.uid === ws.ownerId);
  const ownerName = ownerUser ? (ownerUser.fullName || ownerUser.username) : 'Owner';
  const langTheme = detectLangTheme(ws);

  // Construct collabList from ws.collaborators array
  const collabList = [
    { userId: ownerUser?.userId || 'owner', role: 'Owner', fullName: ownerName, username: ownerUser?.username || 'owner', isOwner: true },
    ...(ws.collaborators || []).map(collabUserId => {
      const u = allUsers.find(user => user.userId === collabUserId);
      return {
        userId: collabUserId,
        role: 'Collaborator',
        fullName: u ? u.fullName : collabUserId,
        username: u ? u.username : collabUserId,
        isOwner: false
      };
    })
  ];

  const workspaceTasks = tasks.filter(t => t.workspaceId === id);
  
  // Calculate Roadmap Progresses
  const getRoadmapProgress = (rm) => {
    let total = 0;
    let completed = 0;
    (rm.topics || []).forEach(t => {
      (t.subtopics || []).forEach(st => {
        total++;
        if (st.done) completed++;
      });
    });
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  // Topic control actions
  const handleToggleTopicExpand = (roadmapId, topicId) => {
    const key = `${roadmapId}-${topicId}`;
    setExpandedTopics(prev => ({
      ...prev,
      [key]: !prev[key]
    }));

    const updatedRoadmaps = (ws.roadmaps || []).map(rm => {
      if (rm.id !== roadmapId) return rm;
      return {
        ...rm,
        topics: (rm.topics || []).map(t => {
          if (t.id !== topicId) return t;
          return { ...t, expanded: !t.expanded };
        })
      };
    });
    updateWorkspace(id, { roadmaps: updatedRoadmaps });
  };

  const copyToClipboard = async (text, label) => {
    if (!text) {
      showToast("Nothing to copy.", "error");
      return;
    }
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      showToast(`✓ ${label} copied`);
    } catch (err) {
      console.error(err);
      showToast("Could not copy. Tap and hold to copy manually.", "error");
    }
  };

  const handleToggleSharing = async () => {
    const isShared = !ws.isShared;
    if (isShared) {
      const shareId = ws.shareId || ('MOS-' + Math.random().toString(36).substring(2, 8).toUpperCase());
      const sharePassword = ws.sharePassword || Math.random().toString(36).substring(2, 10).toUpperCase();
      await updateWorkspace(ws.id, {
        isShared: true,
        shareId,
        sharePassword
      });
      showToast("✓ Workspace sharing enabled");
    } else {
      await updateWorkspace(ws.id, {
        isShared: false
      });
      showToast("Workspace sharing disabled", "info");
    }
  };

  const handleRegenerateShareId = async () => {
    const shareId = 'MOS-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    await updateWorkspace(ws.id, { shareId });
    showToast("✓ New Workspace ID generated");
  };

  const handleRegeneratePassword = async () => {
    const sharePassword = Math.random().toString(36).substring(2, 10).toUpperCase();
    await updateWorkspace(ws.id, { sharePassword });
    showToast("✓ New password generated");
  };

  const handleAddTopicSubmit = (e) => {
    e.preventDefault();
    if (!newTopicTitle.trim() || !activeRoadmapForTopic) return;

    const newTopic = {
      id: `topic-${Date.now()}`,
      title: newTopicTitle.trim(),
      expanded: true,
      subtopics: []
    };

    const updatedRoadmaps = (ws.roadmaps || []).map(rm => {
      if (rm.id !== activeRoadmapForTopic) return rm;
      return {
        ...rm,
        topics: [...(rm.topics || []), newTopic]
      };
    });

    updateWorkspace(id, { roadmaps: updatedRoadmaps });
    setNewTopicTitle('');
    setIsTopicModalOpen(false);
  };

  // Open Edit Topic Rename Modal
  const handleOpenEditTopic = (roadmapId, topic) => {
    setEditTopicRoadmapId(roadmapId);
    setTopicToEdit(topic);
    setEditTopicTitle(topic.title);
    setIsEditTopicModalOpen(true);
  };

  const handleEditTopicSubmit = (e) => {
    e.preventDefault();
    if (!editTopicTitle.trim() || !topicToEdit || !editTopicRoadmapId) return;

    const updatedRoadmaps = (ws.roadmaps || []).map(rm => {
      if (rm.id !== editTopicRoadmapId) return rm;
      return {
        ...rm,
        topics: (rm.topics || []).map(t => {
          if (t.id !== topicToEdit.id) return t;
          return { ...t, title: editTopicTitle.trim() };
        })
      };
    });

    updateWorkspace(id, { roadmaps: updatedRoadmaps });
    setIsEditTopicModalOpen(false);
    setTopicToEdit(null);
  };

  const handleRemoveTopic = (roadmapId, topicId) => {
    const updatedRoadmaps = (ws.roadmaps || []).map(rm => {
      if (rm.id !== roadmapId) return rm;
      return {
        ...rm,
        topics: (rm.topics || []).filter(t => t.id !== topicId)
      };
    });
    updateWorkspace(id, { roadmaps: updatedRoadmaps });
  };

  const handleReorderTopic = (roadmapId, topicId, direction) => {
    const rm = (ws.roadmaps || []).find(r => r.id === roadmapId);
    if (!rm) return;
    const index = (rm.topics || []).findIndex(t => t.id === topicId);
    if (index === -1) return;

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= (rm.topics || []).length) return;

    const newTopics = [...(rm.topics || [])];
    const temp = newTopics[index];
    newTopics[index] = newTopics[newIndex];
    newTopics[newIndex] = temp;

    const updatedRoadmaps = (ws.roadmaps || []).map(r => {
      if (r.id !== roadmapId) return r;
      return { ...r, topics: newTopics };
    });
    updateWorkspace(id, { roadmaps: updatedRoadmaps });
  };

  const handleAddSubtopicSubmit = (e, roadmapId, topicId) => {
    e.preventDefault();
    if (!newSubtopicText.trim()) return;

    const newSt = {
      id: `subtopic-${Date.now()}`,
      title: newSubtopicText.trim(),
      done: false
    };

    const updatedRoadmaps = (ws.roadmaps || []).map(rm => {
      if (rm.id !== roadmapId) return rm;
      return {
        ...rm,
        topics: (rm.topics || []).map(t => {
          if (t.id !== topicId) return t;
          return {
            ...t,
            subtopics: [...(t.subtopics || []), newSt]
          };
        })
      };
    });

    updateWorkspace(id, { roadmaps: updatedRoadmaps });
    setNewSubtopicText('');
    setActiveTopicForSubtopic(null);
  };

  const handleRemoveSubtopic = (roadmapId, topicId, subtopicId) => {
    const updatedRoadmaps = (ws.roadmaps || []).map(rm => {
      if (rm.id !== roadmapId) return rm;
      return {
        ...rm,
        topics: (rm.topics || []).map(t => {
          if (t.id !== topicId) return t;
          return {
            ...t,
            subtopics: (t.subtopics || []).filter(st => st.id !== subtopicId)
          };
        })
      };
    });
    updateWorkspace(id, { roadmaps: updatedRoadmaps });
  };

  // Task Actions
  const handleOpenAddTask = () => {
    setEditingTask(null);
    setTaskText('');
    setTaskPriority('Med');
    setTaskDueDate(new Date().toISOString().split('T')[0]);
    setTaskDueTime('12:00');
    setTaskRecurring('None');
    setTaskProgress(0);
    setIsTaskModalOpen(true);
  };

  const handleOpenEditTask = (task) => {
    setEditingTask(task);
    setTaskText(task.text);
    setTaskPriority(task.priority);
    setTaskDueDate(task.dueDate || '');
    setTaskDueTime(task.dueTime || '');
    setTaskRecurring(task.recurring || 'None');
    setTaskProgress(task.progress || 0);
    setIsTaskModalOpen(true);
  };

  const handleTaskSubmit = (e) => {
    e.preventDefault();
    const taskData = {
      text: taskText,
      priority: taskPriority,
      dueDate: taskDueDate,
      dueTime: taskDueTime,
      workspaceId: id,
      recurring: taskRecurring,
      progress: parseInt(taskProgress) || 0,
      done: parseInt(taskProgress) === 100
    };

    if (editingTask) {
      editTask(editingTask.id, taskData);
    } else {
      addTask(taskData);
    }
    setIsTaskModalOpen(false);
  };

  // Notepad Actions
  const handleSaveNotes = () => {
    updateWorkspace(id, { notes: notesText });
    setIsNotesEditing(false);
  };

  const appendNoteTemplate = (templateType) => {
    let tag = '';
    switch (templateType) {
      case 'code':
        tag = '\n```javascript\n// Code block here\n\n```\n';
        break;
      case 'list':
        tag = '\n- [ ] Task checkitem\n- [ ] Task checkitem\n';
        break;
      case 'table':
        tag = '\n| Title | Category | Link |\n|---|---|---|\n| concept | key | data |\n';
        break;
      default:
        tag = '\n**Important Concept:** ';
    }
    setNotesText(prev => prev + tag);
  };

  // Resource Actions
  const handleOpenAddResource = () => {
    setEditingResource(null);
    setResourceTitle('');
    setResourceCategory('YouTube');
    setResourceLink('');
    setResourceThumbnail('');
    setIsResourceModalOpen(true);
  };

  const handleOpenEditResource = (res) => {
    setEditingResource(res);
    setResourceTitle(res.title);
    setResourceCategory(res.category);
    setResourceLink(res.link);
    setResourceThumbnail(res.thumbnail);
    setIsResourceModalOpen(true);
  };

  const handleResourceSubmit = (e) => {
    e.preventDefault();
    const resData = {
      id: editingResource ? editingResource.id : `res-${Date.now()}`,
      title: resourceTitle,
      category: resourceCategory,
      link: resourceLink,
      thumbnail: resourceThumbnail || 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=150&q=80'
    };

    let updatedResources = [];
    if (editingResource) {
      updatedResources = (ws.resources || []).map(r => r.id === editingResource.id ? resData : r);
    } else {
      updatedResources = [...(ws.resources || []), resData];
    }

    updateWorkspace(id, { resources: updatedResources });
    setIsResourceModalOpen(false);
  };

  const handleDeleteResource = (resId) => {
    const updated = (ws.resources || []).filter(r => r.id !== resId);
    updateWorkspace(id, { resources: updated });
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-500/10 text-red-400 border border-red-500/20';
      case 'Med': return 'bg-primary/10 text-primary border border-primary/20';
      default: return 'bg-white/5 text-on-surface-variant border border-white/5';
    }
  };

  // Skeleton view
  if (loading) {
    return (
      <div className="flex min-h-screen bg-background text-on-surface select-none">
        <Sidebar />
        <main className="flex-1 flex flex-col h-screen overflow-y-auto no-scrollbar relative z-10">
          <Header hideSearch={true} hideStreak={true} hideLogo={true} workspaceTitle={ws?.title || 'Workspace'} />
          <div className="p-8 space-y-8">
            <WorkspaceDetailSkeleton />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background text-on-surface radial-glow-bg select-none relative">
      <style>{`
        @keyframes glow-pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(0, 240, 255, 0.3);
            border-color: rgba(0, 240, 255, 0.4);
          }
          70% {
            box-shadow: 0 0 15px 8px rgba(0, 240, 255, 0);
            border-color: rgba(0, 240, 255, 0.1);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(0, 240, 255, 0);
            border-color: rgba(255, 255, 255, 0.08);
          }
        }
        .completed-track-card {
          border-color: rgba(255, 255, 255, 0.08) !important;
          background: rgba(255, 255, 255, 0.015) !important;
          box-shadow: 0 0 20px rgba(0, 240, 255, 0.02) !important;
          animation: glow-pulse 0.7s ease-out;
          transition: all 0.2s ease-in-out;
        }
        .completed-track-card:hover {
          background: rgba(255, 255, 255, 0.035) !important;
          box-shadow: 0 4px 20px rgba(0, 240, 255, 0.04), 0 0 0 1px rgba(255, 255, 255, 0.12) !important;
          transform: translateY(-1px);
        }
        .completed-track-card-active {
          border-color: rgba(255, 255, 255, 0.08) !important;
          background: rgba(255, 255, 255, 0.025) !important;
          box-shadow: 0 0 25px rgba(0, 240, 255, 0.03) !important;
          animation: glow-pulse 0.7s ease-out;
        }
      `}</style>
      <Sidebar />

      {/* Restricted Workspace Disabled Overlay Banner */}
      {isFitnessOrGym && (
        <div className="absolute inset-0 bg-[#0D0D14]/95 backdrop-blur-md z-40 flex flex-col items-center justify-center space-y-5 p-6 text-center">
          <span className="material-symbols-outlined text-yellow-500 text-6xl animate-bounce">construction</span>
          <h2 className="text-2xl font-bold text-white tracking-tight">🚧 {ws?.title || 'Gym Workspace'}</h2>
          <p className="text-on-surface-variant text-sm font-semibold text-center max-w-sm">
            "Will be available in the next version."
          </p>
          <div className="flex flex-col gap-3 w-full max-w-xs pt-2">
            <Link to="/workspaces" className="w-full">
              <Button variant="secondary" icon="arrow_back" className="w-full justify-center">
                Go back to Workspaces
              </Button>
            </Link>
            {isWorkspaceOwner && (
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(true)}
                className="w-full px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 hover:border-red-500/40 active:scale-95 shadow-[0_0_15px_rgba(239,68,68,0.1)] hover:shadow-[0_0_20px_rgba(239,68,68,0.2)] cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">delete</span>
                DELETE WORKSPACE
              </button>
            )}
          </div>
        </div>
      )}

      <main className="flex-grow flex flex-col h-screen overflow-y-auto no-scrollbar relative z-10 animate-page-transition">
        <Header hideSearch={true} hideStreak={true} hideLogo={true} workspaceTitle={ws?.title || 'Workspace'} />

        {/* Top Breadcrumb Navigation */}
        <div className="hidden md:flex bg-background/60 backdrop-blur-xl border-b border-white/5 px-8 py-4 items-center justify-between shrink-0">
          <nav className="flex gap-2 items-center font-label-md text-xs font-bold uppercase tracking-wider">
            <Link to="/workspaces" className="text-on-surface-variant hover:text-white transition-colors flex items-center gap-1">
              Workspaces 
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            </Link>
            <span className="text-primary font-bold">{ws.title}</span>
          </nav>
        </div>

        {isDSAWorkspace ? (
          <DSAWorkspace workspace={ws} updateWorkspace={updateWorkspace} deleteWorkspace={deleteWorkspace} />
        ) : (
          <>
        {/* Workspace Banner — Language-Themed Hero */}
        <div className="relative w-full h-[220px] md:h-[280px] overflow-hidden shrink-0 workspace-banner-container">
          {/* Base gradient tinted by detected language */}
          <div
            className="absolute inset-0"
            style={{ background: `linear-gradient(135deg, ${langTheme.gradientFrom} 0%, #0D0D14 65%)` }}
          />
          {/* Accent radial glow top-right */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: `radial-gradient(ellipse at 78% 25%, ${langTheme.accent}1C 0%, transparent 58%)` }}
          />
          {/* Subtle dot-grid texture overlay */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ opacity: 0.04 }}
            preserveAspectRatio="xMidYMid slice"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern id="ws-dot-grid" x="0" y="0" width="22" height="22" patternUnits="userSpaceOnUse">
                <circle cx="1.5" cy="1.5" r="1" fill="white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#ws-dot-grid)" />
          </svg>
          {/* Thin accent line at bottom of hero */}
          <div
            className="absolute bottom-0 left-0 right-0 h-px pointer-events-none"
            style={{ background: `linear-gradient(90deg, transparent, ${langTheme.accent}30, transparent)` }}
          />
          {/* Dark gradient to merge hero into page content below */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/55 to-transparent" />

          {/* Hero Content: left info + right actions */}
          <div className="absolute bottom-0 left-0 w-full px-4 pb-4 md:px-8 md:pb-6 flex flex-col md:flex-row items-start md:items-end justify-between gap-4 md:gap-6 z-10">
            <div className="flex items-start gap-4 md:gap-6">
              {/* Language Icon Box */}
              <div
                className="w-12 h-12 md:w-16 md:h-16 rounded-xl flex items-center justify-center shrink-0 shadow-2xl border overflow-hidden"
                style={{
                  background: `${langTheme.accent}12`,
                  borderColor: `${langTheme.accent}35`,
                  boxShadow: `0 0 20px ${langTheme.accent}18`,
                }}
              >
                {langTheme.iconSlug ? (
                  <img
                    src={`https://cdn.simpleicons.org/${langTheme.iconSlug}/${langTheme.iconColor}`}
                    alt={langTheme.label}
                    className="w-6 h-6 md:w-8 md:h-8 object-contain select-none"
                    draggable={false}
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                ) : (
                  <span className="material-symbols-outlined text-2xl md:text-3xl" style={{ color: langTheme.accent }}>
                    {ws.icon || 'code'}
                  </span>
                )}
              </div>

              <div>
                {/* Language wordmark + tag badges */}
                <div className="flex flex-wrap items-center gap-1.5 mb-1 md:mb-2">
                  <span
                    className="px-2 py-0.5 rounded-full font-mono text-[8px] md:text-[9px] uppercase tracking-wider border font-bold"
                    style={{ color: langTheme.accent, background: `${langTheme.accent}10`, borderColor: `${langTheme.accent}30` }}
                  >
                    {langTheme.label}
                  </span>
                  {ws.tag && (
                    <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full font-mono text-[8px] md:text-[9px] uppercase tracking-wider border border-primary/20 shadow-sm">
                      {ws.tag}
                    </span>
                  )}
                </div>
                <h1 className="font-display-lg text-lg md:text-2xl font-bold text-white tracking-tight leading-tight">
                  {ws.title}
                </h1>

                <div className="flex items-center gap-4 mt-2.5 text-on-surface-variant font-label-md text-xs font-bold uppercase tracking-wider">
                  <div className="flex flex-col">
                    <span className="text-primary font-bold text-xs md:text-sm">{ws.progress}%</span>
                    <span className="opacity-60 text-[7px] md:text-[8px] mt-0.5">Workspace</span>
                  </div>
                  <div className="w-px h-4 md:h-5 bg-white/10"></div>
                  <div className="flex flex-col">
                    <span className="text-white font-bold text-xs md:text-sm">{ws.streak} Days</span>
                    <span className="opacity-60 text-[7px] md:text-[8px] mt-0.5">Streak</span>
                  </div>
                  <div className="w-px h-4 md:h-5 bg-white/10"></div>
                  <div className="flex flex-col">
                    <span className="text-white font-bold text-xs md:text-sm">{workspaceTasks.length}</span>
                    <span className="opacity-60 text-[7px] md:text-[8px] mt-0.5">Tasks Left</span>
                  </div>
                </div>
              </div>
            </div>

            {isWorkspaceOwner && (
              <div className="flex items-center gap-2 mb-1 w-full md:w-auto">
                <Button variant="secondary" className="w-full md:w-auto text-xs justify-center py-2 px-4" icon="group_add" onClick={() => setIsInviteModalOpen(true)}>Collaborate</Button>
                <button
                  type="button"
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-1.5 bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 hover:border-red-500/40 active:scale-95 cursor-pointer shadow-[0_0_15px_rgba(239,68,68,0.1)] hover:shadow-[0_0_20px_rgba(239,68,68,0.2)]"
                  title="Delete Workspace"
                >
                  <span className="material-symbols-outlined text-sm">delete</span>
                  <span className="hidden sm:inline">Delete Workspace</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Content Layout Grid */}
        <div className="px-3 py-4 md:px-8 md:py-8 grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-8 w-full flex-grow min-h-0 workspace-detail-content">
          
          {/* Column 1: Left Milestones / Roadmap */}
          <div className="lg:col-span-8 space-y-4 md:space-y-8 workspace-detail-left-col">
            
            {/* Multi-Roadmaps Section */}
            <section className="bg-[#111118]/90 border border-white/5 rounded-2xl p-3 md:p-6 space-y-4 md:space-y-6 workspace-roadmap-section shadow-lg shadow-black/10">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div>
                  <h3 className="font-display-lg text-lg font-bold text-white uppercase tracking-wider">Roadmap Progress</h3>
                  <p className="text-on-surface-variant text-xs mt-1">Independent roadmap tracker loops</p>
                </div>
              </div>

              {ws.roadmaps && ws.roadmaps.length > 0 ? (
                <div className="space-y-4 md:space-y-8">
                  {ws.roadmaps.map((rm) => {
                    const rmProg = getRoadmapProgress(rm);
                    return (
                      <div key={rm.id} className="space-y-3 md:space-y-6 bg-[#0B0B10] border border-white/5 p-3 md:p-6 rounded-xl animate-fade-in shadow-lg shadow-black/10">
                        
                        {/* ── Roadmap Header — Mobile: single compact row ── */}
                        <div className="border-b border-white/5 pb-3">
                          {/* Mobile layout: title left | % right */}
                          <div className="flex items-center justify-between gap-2 md:hidden">
                            <h4 className="font-extrabold font-display-lg text-[10px] tracking-widest text-zinc-300 uppercase flex items-center gap-1.5 min-w-0 truncate">
                              <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                              <span className="truncate">{rm.title}</span>
                            </h4>
                            <div className="shrink-0">
                              {rmProg === 100 ? (
                                <span className="text-[9px] text-[#FFB800] font-extrabold flex items-center gap-0.5">
                                  <span className="material-symbols-outlined text-[10px]">emoji_events</span>
                                  MASTERED
                                </span>
                              ) : (
                                <span className="text-[10px] text-primary font-bold">{rmProg}%</span>
                              )}
                            </div>
                          </div>
                          {/* Mobile: progress bar */}
                          <div className="md:hidden mt-2 h-[3px] w-full bg-white/5 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{
                                width: `${rmProg}%`,
                                background: rmProg === 100 ? 'linear-gradient(90deg,#00C8E0,#00F0FF)' : 'linear-gradient(90deg,#8B5CF6,#6366F1)'
                              }}
                            />
                          </div>
                          {/* Mobile: Add Topic button */}
                          <div className="md:hidden flex justify-end mt-2">
                            <button
                              onClick={() => {
                                setActiveRoadmapForTopic(rm.id);
                                setIsTopicModalOpen(true);
                              }}
                              className="px-3 py-1 bg-white/5 border border-white/5 rounded text-[9px] uppercase font-bold text-on-surface-variant hover:text-white transition-all cursor-pointer"
                            >
                              + Add Topic
                            </button>
                          </div>

                          {/* Desktop layout: unchanged */}
                          <div className="hidden md:flex md:items-center justify-between gap-3">
                            <div className="space-y-1">
                              <h4 className="font-extrabold font-display-lg text-xs tracking-widest text-zinc-150 uppercase flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                                {rm.title}
                              </h4>
                            </div>
                            <div className="flex items-center gap-3">
                              {rmProg === 100 ? (
                                <span className="text-xs text-[#FFB800] font-extrabold flex items-center gap-1.5 shadow-[0_0_12px_rgba(255,184,0,0.15)] bg-[#FFB800]/5 px-2.5 py-0.5 border border-[#FFB800]/20 rounded-full">
                                  <span className="material-symbols-outlined text-[13px] font-bold">emoji_events</span>
                                  100% MASTERED
                                </span>
                              ) : (
                                <span className="text-xs text-primary font-bold">{rmProg}% Done</span>
                              )}
                              <button
                                onClick={() => {
                                  setActiveRoadmapForTopic(rm.id);
                                  setIsTopicModalOpen(true);
                                }}
                                className="px-2.5 py-1 bg-white/5 border border-white/5 rounded text-[10px] uppercase font-bold text-on-surface-variant hover:text-white transition-all cursor-pointer"
                              >
                                + Add Topic
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Topics Loop */}
                        <div className="space-y-2 md:space-y-5">
                          {(rm.topics || []).map((topic) => {
                            const doneSubtopics = (topic.subtopics || []).filter(s => s.done).length;
                            const totalSubtopics = (topic.subtopics || []).length;
                            const progressPercent = totalSubtopics > 0 ? Math.round((doneSubtopics / totalSubtopics) * 100) : 0;
                            const isExpanded = !!expandedTopics[`${rm.id}-${topic.id}`];
                            const isFullyCompleted = totalSubtopics > 0 && doneSubtopics === totalSubtopics;
                            
                            return (
                              <div 
                                key={topic.id} 
                                className={`border rounded-xl overflow-hidden transition-all duration-200 ${
                                  isFullyCompleted
                                    ? (isExpanded ? 'completed-track-card-active relative before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[3px] before:bg-[#00F0FF]/60' : 'completed-track-card')
                                    : (isExpanded ? 'border-primary/45 bg-[#0e0e16]/80 shadow-[0_0_20px_rgba(139,92,246,0.12)] relative before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[3px] before:bg-primary' : 'border-white/[0.08] bg-[#0D0D14]/20 hover:bg-white/[0.035] hover:border-white/12')
                                }`}
                              >
                                
                                {/* ── Topic Header ── */}
                                <div className="flex items-center justify-between px-3 md:px-4 py-2.5 md:py-3.5 bg-zinc-900/10 hover:bg-zinc-900/35 transition-all duration-300 cursor-pointer select-none border-b border-white/5">
                                  {/* Left: chevron + title + count/badges — fills available space */}
                                  <div className="flex items-center gap-2 min-w-0 flex-1" onClick={() => handleToggleTopicExpand(rm.id, topic.id)}>
                                    {isFullyCompleted ? (
                                      <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-[#00F0FF]/10 border border-[#00F0FF]/30 text-[#00F0FF] flex items-center justify-center shrink-0 shadow-[0_0_6px_rgba(0,240,255,0.25)]">
                                        <span className="material-symbols-outlined text-[10px] md:text-xs font-bold">check</span>
                                      </div>
                                    ) : (
                                      <span className={`material-symbols-outlined text-zinc-400 text-sm md:text-base transition-transform duration-200 shrink-0 ${isExpanded ? 'rotate-90 text-primary' : ''}`}>
                                        chevron_right
                                      </span>
                                    )}

                                    <div className="flex flex-col min-w-0 flex-1">
                                      {/* Title row with count and MASTERED badge */}
                                      <div className="flex items-center gap-1.5 md:gap-2 flex-wrap">
                                        <span className={`font-semibold text-zinc-150 text-[12px] md:text-[13px] tracking-wide leading-tight ${isFullyCompleted ? 'text-zinc-100 font-bold' : ''}`}>
                                          {topic.title}
                                        </span>
                                        <span className={`text-[9px] font-bold px-1.5 md:px-2.5 py-0.5 rounded-full border shrink-0 ${isFullyCompleted ? 'text-[#00F0FF] bg-[#00F0FF]/[0.07] border-[#00F0FF]/20' : 'text-zinc-400 bg-white/3 border-white/5'}`}>
                                          {doneSubtopics}/{totalSubtopics}
                                        </span>
                                        {isFullyCompleted && (
                                          <span className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-[#00F0FF] bg-[#00F0FF]/[0.07] px-1.5 md:px-2.5 py-0.5 border border-[#00F0FF]/20 rounded-md">
                                            MASTERED
                                          </span>
                                        )}
                                      </div>
                                      {/* Progress bar — always visible, not hidden on mobile */}
                                      <div className="w-full bg-[#09090D] h-[3px] md:h-[4px] rounded-full overflow-hidden mt-1.5 md:mt-2 border border-white/3">
                                        <div 
                                          className="h-full rounded-full transition-all duration-500 ease-out"
                                          style={{
                                            width: `${progressPercent}%`,
                                            background: isFullyCompleted
                                              ? 'linear-gradient(90deg,#00C8E0,#00F0FF)'
                                              : progressPercent > 0
                                                ? 'linear-gradient(90deg,#8B5CF6,#6366F1)'
                                                : 'rgba(255,255,255,0.08)'
                                          }}
                                        />
                                      </div>
                                    </div>
                                  </div>

                                  {/* Desktop Actions (hidden on mobile) */}
                                  <div className="hidden md:flex items-center gap-1.5 shrink-0 ml-3">
                                    <button 
                                      onClick={() => handleOpenEditTopic(rm.id, topic)}
                                      className="p-1.5 rounded-lg bg-white/2 text-zinc-400 hover:text-primary hover:bg-primary/10 hover:shadow-[0_0_8px_rgba(139,92,246,0.2)] transition-all duration-300 cursor-pointer"
                                      title="Edit Topic Title"
                                    >
                                      <span className="material-symbols-outlined text-sm">edit</span>
                                    </button>
                                    <button
                                      onClick={() => {
                                        setActiveTopicForSubtopic(topic.id);
                                        setNewSubtopicText('');
                                      }}
                                      className="p-1.5 rounded-lg bg-white/2 text-zinc-400 hover:text-primary hover:bg-primary/10 hover:shadow-[0_0_8px_rgba(139,92,246,0.2)] transition-all duration-300 cursor-pointer"
                                      title="Add Subtopic"
                                    >
                                      <span className="material-symbols-outlined text-sm">add_circle</span>
                                    </button>
                                    <button 
                                      onClick={() => handleReorderTopic(rm.id, topic.id, 'up')}
                                      className="p-1.5 rounded-lg bg-white/2 text-zinc-400 hover:text-primary hover:bg-primary/10 hover:shadow-[0_0_8px_rgba(139,92,246,0.2)] transition-all duration-300 cursor-pointer"
                                    >
                                      <span className="material-symbols-outlined text-sm">arrow_upward</span>
                                    </button>
                                    <button 
                                      onClick={() => handleReorderTopic(rm.id, topic.id, 'down')}
                                      className="p-1.5 rounded-lg bg-white/2 text-zinc-400 hover:text-primary hover:bg-primary/10 hover:shadow-[0_0_8px_rgba(139,92,246,0.2)] transition-all duration-300 cursor-pointer"
                                    >
                                      <span className="material-symbols-outlined text-sm">arrow_downward</span>
                                    </button>
                                    <button 
                                      onClick={() => handleRemoveTopic(rm.id, topic.id)}
                                      className="p-1.5 rounded-lg bg-white/2 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300 cursor-pointer"
                                    >
                                      <span className="material-symbols-outlined text-sm">delete</span>
                                    </button>
                                  </div>

                                  {/* Portal-backed Three-Dot Topic Actions Button & Viewport-aware Menu */}
                                  <TopicActionButton
                                    topic={topic}
                                    rmId={rm.id}
                                    activeTopicMenu={activeTopicMenu}
                                    setActiveTopicMenu={setActiveTopicMenu}
                                    handleOpenEditTopic={handleOpenEditTopic}
                                    setActiveTopicForSubtopic={setActiveTopicForSubtopic}
                                    setNewSubtopicText={setNewSubtopicText}
                                    handleReorderTopic={handleReorderTopic}
                                    handleRemoveTopic={handleRemoveTopic}
                                  />
                                </div>

                                {/* Inline Subtopic Adder Form */}
                                {activeTopicForSubtopic === topic.id && (
                                  <form 
                                    onSubmit={(e) => handleAddSubtopicSubmit(e, rm.id, topic.id)}
                                    className="px-3 py-2 md:p-3 bg-zinc-950/20 border-t border-white/5 flex gap-2 items-center"
                                  >
                                    <input
                                      type="text"
                                      value={newSubtopicText}
                                      onChange={(e) => setNewSubtopicText(e.target.value)}
                                      placeholder="Add task name..."
                                      className="flex-1 min-w-0 bg-[#111118] border border-white/5 rounded-lg px-2.5 py-2 md:py-1.5 text-xs text-on-surface focus:outline-none focus:border-primary/40 transition-colors"
                                      autoFocus
                                      required
                                    />
                                    <Button type="submit" variant="secondary" className="px-2.5 py-1.5 md:px-3 md:py-1 text-[10px] shrink-0">Add</Button>
                                    <Button type="button" variant="ghost" className="px-2 py-1.5 md:py-1 text-[10px] shrink-0" onClick={() => setActiveTopicForSubtopic(null)}>✕</Button>
                                  </form>
                                )}

                                {/* ── Subtopics/Task List ── */}
                                {isExpanded && (
                                  <div className="px-2 py-2 md:p-4 md:space-y-0 border-t border-white/5 bg-[#0D0D14]/10 animate-fade-in">
                                    {topic.subtopics && topic.subtopics.length === 0 ? (
                                      <p className="text-[11px] text-zinc-500 italic px-2 py-2">No tasks yet.</p>
                                    ) : (
                                      (topic.subtopics || []).map((st) => (
                                        <div 
                                          key={st.id} 
                                          className={`flex items-center gap-2 group rounded-lg transition-colors ${
                                            st.done
                                              ? 'bg-[#00F0FF]/[0.025] border border-[#00F0FF]/[0.06] mb-px'
                                              : 'hover:bg-white/[0.025] border border-transparent'
                                          }`}
                                        >
                                          {/* Checkbox + Text — takes up all space except delete button */}
                                          <div 
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              toggleSubtopic(ws.id, rm.id, topic.id, st.id);
                                            }}
                                            onKeyDown={(e) => {
                                              if (e.key === ' ' || e.key === 'Enter') {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                toggleSubtopic(ws.id, rm.id, topic.id, st.id);
                                              }
                                            }}
                                            tabIndex={0}
                                            role="checkbox"
                                            aria-checked={st.done}
                                            className="flex items-start gap-2.5 cursor-pointer select-none outline-none focus-visible:ring-1 focus-visible:ring-primary/50 rounded-md flex-1 min-w-0 px-1.5 py-1.5 md:py-1 min-h-[40px] md:min-h-0"
                                          >
                                            {/* Checkbox — fixed size, always aligned top when text wraps */}
                                            <div className={`w-[18px] h-[18px] md:w-5 md:h-5 rounded-[5px] border flex items-center justify-center shrink-0 mt-px transition-all duration-200 ${
                                              st.done 
                                                ? 'bg-[#00F0FF]/[0.08] border-[#00F0FF]/30 shadow-[0_0_5px_rgba(0,240,255,0.12)] text-[#00F0FF]' 
                                                : 'bg-zinc-900/30 border-white/10 group-hover:border-primary/40 group-hover:bg-zinc-900/50'
                                            }`}>
                                              {st.done && (
                                                <span className="material-symbols-outlined text-[11px] md:text-[12px] text-[#00F0FF] font-bold">
                                                  check
                                                </span>
                                              )}
                                            </div>
                                            {/* Task text — left aligned, wraps naturally */}
                                            <span className={`text-[12px] md:text-[12.5px] font-medium leading-snug text-left transition-colors duration-200 ${
                                              st.done 
                                                ? 'line-through text-zinc-500/70 decoration-[#00F0FF]/15 font-normal' 
                                                : 'text-zinc-200 group-hover:text-white'
                                            }`}>
                                              {st.title}
                                            </span>
                                          </div>

                                          {/* Delete — hidden until hover/focus */}
                                          <button
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleRemoveSubtopic(rm.id, topic.id, st.id);
                                            }}
                                            className="opacity-0 group-hover:opacity-100 focus:opacity-100 p-1 mr-1 text-zinc-600 hover:text-red-400 transition-all cursor-pointer rounded hover:bg-zinc-900/40 shrink-0"
                                            title="Delete task"
                                          >
                                            <span className="material-symbols-outlined text-xs">close</span>
                                          </button>
                                        </div>
                                      ))
                                    )}
                                  </div>
                                )}

                              </div>
                            );
                          })}
                        </div>

                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-on-surface-variant italic">No combined roadmaps found. Add roadmap segments to customize.</p>
              )}
            </section>

            {/* Workspace Notepad Card */}
            <section className="bg-[#111118]/90 border border-white/5 rounded-2xl p-6 space-y-5 workspace-notepad-section shadow-lg shadow-black/10">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div>
                  <h3 className="font-display-lg text-lg font-bold text-white uppercase tracking-wider">Workspace Notepad</h3>
                  <p className="text-on-surface-variant text-xs mt-1">Study notes, templates, and revision observations</p>
                </div>
                
                <div className="flex gap-2">
                  {isNotesEditing ? (
                    <>
                      <Button variant="ghost" className="px-3 py-1 text-[10px]" onClick={() => setIsNotesEditing(false)}>Cancel</Button>
                      <Button variant="primary" className="px-3 py-1 text-[10px]" onClick={handleSaveNotes}>Save Notes</Button>
                    </>
                  ) : (
                    <Button variant="secondary" className="px-3 py-1 text-[10px]" onClick={() => setIsNotesEditing(true)} icon="edit">Edit Notepad</Button>
                  )}
                </div>
              </div>

              {isNotesEditing ? (
                <div className="space-y-4">
                  <div className="flex gap-2 bg-[#0D0D14]/80 p-2 rounded border border-white/5">
                    <button type="button" onClick={() => appendNoteTemplate('code')} className="px-2 py-1 bg-white/5 rounded text-[9px] font-bold text-on-surface-variant hover:text-white uppercase">Code Block</button>
                    <button type="button" onClick={() => appendNoteTemplate('list')} className="px-2 py-1 bg-white/5 rounded text-[9px] font-bold text-on-surface-variant hover:text-white uppercase">Checklist</button>
                    <button type="button" onClick={() => appendNoteTemplate('table')} className="px-2 py-1 bg-white/5 rounded text-[9px] font-bold text-on-surface-variant hover:text-white uppercase">Table</button>
                  </div>
                  <textarea
                    value={notesText}
                    onChange={(e) => setNotesText(e.target.value)}
                    className="w-full bg-[#0D0D14] border border-white/5 rounded-lg p-3 text-xs text-on-surface focus:outline-none h-48 font-mono leading-relaxed resize-none"
                    placeholder="Write workspace study logs..."
                  />
                </div>
              ) : (
                <div className="bg-[#0D0D14]/30 border border-white/5 p-5 rounded-lg text-xs leading-relaxed text-on-surface-variant font-medium whitespace-pre-line max-h-60 overflow-y-auto no-scrollbar">
                  {ws.notes || 'Notepad is empty. Click edit to begin storing revision sheets and interview questions.'}
                </div>
              )}
            </section>

            {/* Task Management Section */}
            <section className="bg-[#111118]/90 border border-white/5 rounded-2xl p-6 space-y-6 workspace-todo-section shadow-lg shadow-black/10">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div>
                  <h3 className="font-display-lg text-lg font-bold text-white uppercase tracking-wider">Workspace Todo List</h3>
                  <p className="text-on-surface-variant text-xs mt-1">Tasks linked to this workspace</p>
                </div>
                <Button variant="primary" icon="add" className="py-1.5 px-3 text-[10px] font-bold uppercase tracking-wider" onClick={handleOpenAddTask}>
                  Add Todo
                </Button>
              </div>

              <div className="space-y-3">
                {workspaceTasks.length === 0 ? (
                  <p className="text-on-surface-variant text-xs italic py-2">No tasks bound to this workspace.</p>
                ) : (
                  workspaceTasks.map(t => (
                    <div 
                      key={t.id}
                      className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-250 group bg-[#111118] hover:border-primary/20 ${
                        t.done ? 'border-white/5 opacity-40' : 'border-white/5'
                      }`}
                    >
                      <div 
                        onClick={() => toggleTask(t.id)}
                        className={`w-4.5 h-4.5 rounded border flex items-center justify-center transition-all cursor-pointer ${
                          t.done ? 'bg-primary border-primary' : 'border-primary/30 group-hover:bg-primary/10'
                        }`}
                      >
                        {t.done && <span className="material-symbols-outlined text-[12px] text-white font-bold">check</span>}
                      </div>

                      <div className="flex-grow flex flex-col gap-0.5">
                        <span className={`text-xs text-white font-medium ${t.done ? 'line-through text-on-surface-variant' : ''}`}>
                          {t.text}
                        </span>
                        {t.dueDate && (
                          <span className="text-[9px] text-on-surface-variant font-semibold flex items-center gap-1">
                            <span className="material-symbols-outlined text-[10px]">calendar_today</span>
                            Due: {t.dueDate} {t.dueTime}
                          </span>
                        )}
                      </div>

                      <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider shrink-0 ${getPriorityColor(t.priority)}`}>
                        {t.priority}
                      </span>

                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                        <button 
                          onClick={() => togglePin(t.id)}
                          className={`p-1 rounded hover:bg-white/5 transition-colors cursor-pointer ${t.isPinned ? 'text-primary' : 'text-on-surface-variant'}`}
                          title="Pin Task"
                        >
                          <span className="material-symbols-outlined text-[14px]">star</span>
                        </button>
                        <button 
                          onClick={() => handleOpenEditTask(t)}
                          className="p-1 rounded hover:bg-white/5 text-on-surface-variant hover:text-white transition-colors cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[14px]">edit</span>
                        </button>
                        <button 
                          onClick={() => deleteTask(t.id)}
                          className="p-1 rounded hover:bg-white/5 text-on-surface-variant hover:text-red-400 transition-colors cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[14px]">delete</span>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>

          </div>

          {/* Column 2: Right Sidebar */}
          <div className="lg:col-span-4 space-y-8 workspace-detail-right-col">
            
            {/* Progress Rings */}
            <section className="bg-[#111118]/90 border border-white/5 rounded-2xl p-6 workspace-progress-section shadow-lg shadow-black/10">
              <h3 className="font-label-sm uppercase tracking-widest text-on-surface-variant mb-6 text-[10px] font-bold">
                Overall Progress
              </h3>
              <div className="flex flex-col items-center gap-6">
                <ProgressRing percentage={ws.progress} label="Completion index" size={135} color={`text-primary`} />
              </div>
            </section>

            {/* Study Session Pomodoro Timer */}
            <section className="bg-[#111118]/95 border border-white/5 backdrop-blur-xl rounded-2xl p-6 space-y-6 relative overflow-hidden workspace-timer-section shadow-lg shadow-black/10">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <div>
                  <h3 className="font-display-lg text-xs font-black tracking-[0.2em] uppercase text-on-surface-variant">
                    Study Session Timer
                  </h3>
                  <p className="text-[9px] text-on-surface-variant uppercase tracking-wider font-bold mt-0.5">Productive Pomodoro</p>
                </div>
                <span className="material-symbols-outlined text-primary text-base animate-pulse">
                  alarm
                </span>
              </div>

              <div className="flex flex-col items-center justify-center space-y-4">
                {/* Visual Circle / Progress and Timer */}
                <div className="relative w-32 h-32 flex items-center justify-center bg-[#0D0D14]/80 rounded-full border border-white/5 shadow-2xl">
                  {/* Glowing ambient radial inside */}
                  <div className="absolute inset-2 bg-gradient-to-tr from-primary/5 to-secondary/5 rounded-full blur-sm" />
                  
                  <div className="text-center z-10">
                    <span className="font-mono text-3xl font-extrabold tracking-tight text-white block">
                      {String(timerMinutes).padStart(2, '0')}:{String(timerSeconds).padStart(2, '0')}
                    </span>
                    <span className="text-[8px] font-black uppercase tracking-widest text-primary mt-1 block">
                      {timerType === 'focus' ? 'Deep Work' : 'Break'}
                    </span>
                  </div>
                </div>

                {/* Duration select tags */}
                <div className="flex gap-2">
                  <button 
                    onClick={() => { setTimerType('focus'); handleSelectDuration(25); }}
                    className={`px-3 py-1 text-[9px] font-black uppercase tracking-wider rounded border transition-all ${
                      selectedDuration === 25 && timerType === 'focus'
                        ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-105'
                        : 'bg-white/5 text-on-surface-variant border-white/5 hover:text-white'
                    }`}
                  >
                    25 Min
                  </button>
                  <button 
                    onClick={() => { setTimerType('focus'); handleSelectDuration(50); }}
                    className={`px-3 py-1 text-[9px] font-black uppercase tracking-wider rounded border transition-all ${
                      selectedDuration === 50 && timerType === 'focus'
                        ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-105'
                        : 'bg-white/5 text-on-surface-variant border-white/5 hover:text-white'
                    }`}
                  >
                    50 Min
                  </button>
                  <button 
                    onClick={() => { setTimerType('break'); handleSelectDuration(5); }}
                    className={`px-3 py-1 text-[9px] font-black uppercase tracking-wider rounded border transition-all ${
                      timerType === 'break'
                        ? 'bg-secondary text-white border-secondary shadow-lg shadow-secondary/20 scale-105'
                        : 'bg-white/5 text-on-surface-variant border-white/5 hover:text-white'
                    }`}
                  >
                    5m Break
                  </button>
                </div>

                {/* Controls */}
                <div className="flex gap-3 w-full pt-2">
                  {timerActive ? (
                    <Button 
                      variant="secondary" 
                      className="flex-1 py-2 font-bold uppercase tracking-wider text-xs" 
                      onClick={pauseTimer}
                      icon="pause"
                    >
                      Pause
                    </Button>
                  ) : (
                    <Button 
                      variant="primary" 
                      className="flex-1 py-2 font-bold uppercase tracking-wider text-xs" 
                      onClick={startTimer}
                      icon="play_arrow"
                    >
                      Start
                    </Button>
                  )}
                  <Button 
                    variant="ghost" 
                    className="flex-1 py-2 font-bold uppercase tracking-wider text-xs border border-white/5" 
                    onClick={resetTimer}
                    icon="refresh"
                  >
                    Reset
                  </Button>
                </div>
              </div>
            </section>

            {/* Links Resources Manager */}
            <section className="bg-[#111118]/90 border border-white/5 rounded-2xl p-6 space-y-5 workspace-resources-section shadow-lg shadow-black/10">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <h3 className="font-label-sm uppercase tracking-widest text-on-surface-variant text-[10px] font-bold">
                  Resources ({(ws.resources || []).length})
                </h3>
                <button 
                  onClick={handleOpenAddResource}
                  className="p-1 text-on-surface-variant hover:text-white transition-colors cursor-pointer"
                  title="Add Resource link"
                >
                  <span className="material-symbols-outlined text-base">add_box</span>
                </button>
              </div>

              <div className="space-y-2.5 max-h-[320px] overflow-y-auto pr-1 no-scrollbar animate-fade-in">
                {(ws.resources || []).length === 0 ? (
                  <div className="flex flex-col items-center gap-2 py-6 text-center">
                    <span className="material-symbols-outlined text-2xl text-on-surface-variant/40">link</span>
                    <p className="text-[11px] text-on-surface-variant/60 italic">No study resource links attached.</p>
                  </div>
                ) : (
                  (ws.resources || []).map((res) => {
                    const meta = getResourceMeta(res.link, res.category);
                    return (
                      <div key={res.id} className="p-3 bg-[#0D0D14]/80 border border-white/[0.06] rounded-xl flex items-center justify-between gap-3 group hover:bg-white/[0.025] hover:border-white/10 transition-all duration-150">
                        <div className="flex items-center gap-3 min-w-0">
                          {/* Auto-detected service logo */}
                          <div className="w-9 h-9 rounded-lg bg-white/[0.04] border border-white/[0.07] flex items-center justify-center shrink-0 overflow-hidden">
                            {meta.iconUrl ? (
                              <img
                                src={meta.iconUrl}
                                alt={meta.label}
                                className="w-[18px] h-[18px] object-contain select-none"
                                draggable={false}
                                onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextSibling.style.display = 'block'; }}
                              />
                            ) : null}
                            <span
                              className="material-symbols-outlined text-[17px] text-on-surface-variant/60"
                              style={{ display: meta.iconUrl ? 'none' : 'block' }}
                            >
                              language
                            </span>
                          </div>
                          <div className="min-w-0">
                            <a
                              href={res.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[12px] font-semibold text-white hover:text-primary transition-colors truncate block leading-snug"
                            >
                              {res.title}
                            </a>
                            <span className="text-[9px] text-on-surface-variant/60 block mt-0.5 truncate">{meta.domain}</span>
                          </div>
                        </div>

                        <div className="opacity-0 group-hover:opacity-100 flex gap-0.5 transition-opacity shrink-0">
                          <button
                            onClick={() => handleOpenEditResource(res)}
                            className="p-1.5 text-on-surface-variant hover:text-white rounded-md hover:bg-white/5 transition-colors"
                          >
                            <span className="material-symbols-outlined text-xs">edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteResource(res.id)}
                            className="p-1.5 text-on-surface-variant hover:text-red-400 rounded-md hover:bg-red-500/5 transition-colors"
                          >
                            <span className="material-symbols-outlined text-xs">delete</span>
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* ✨ Suggested by Master OS — Collapsible Line-by-Line SQL Resources */}
              {(ws.category === 'SQL' || ws.technology === 'sql' || (ws.title && ws.title.toLowerCase().includes('sql'))) && (
                <div className="pt-3 border-t border-white/10 space-y-2">
                  <button
                    type="button"
                    onClick={() => setIsSuggestedResourcesOpen(!isSuggestedResourcesOpen)}
                    className="w-full flex items-center justify-between p-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 transition-all cursor-pointer select-none group"
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-xs text-amber-400">auto_awesome</span>
                      <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                        Suggested by Master OS
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] text-zinc-500 font-mono">Curated SQL</span>
                      <span 
                        className="material-symbols-outlined text-zinc-400 text-sm transition-transform duration-200"
                        style={{ transform: isSuggestedResourcesOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                      >
                        expand_more
                      </span>
                    </div>
                  </button>

                  {isSuggestedResourcesOpen && (
                    <div className="space-y-1.5 max-h-[300px] overflow-y-auto no-scrollbar pr-0.5 animate-fade-in pt-1">
                      {SQL_CURATED_RESOURCES.map((item) => (
                        <div 
                          key={item.name} 
                          className="p-2 bg-[#08080E] border border-white/[0.06] hover:border-blue-500/30 rounded-xl flex items-center justify-between gap-2.5 group transition-all"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="material-symbols-outlined text-sm text-blue-400 shrink-0">{item.icon}</span>
                            <div className="min-w-0">
                              <a
                                href={item.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[11px] font-bold text-white hover:text-blue-300 transition-colors truncate block leading-snug"
                              >
                                {item.name}
                              </a>
                              <span className="text-[9px] text-zinc-400 truncate block leading-tight">{item.desc}</span>
                            </div>
                          </div>
                          <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2 py-0.5 rounded-lg bg-blue-500/10 hover:bg-blue-500 text-blue-300 hover:text-black font-bold text-[9px] transition-all shrink-0 border border-blue-500/20 shadow-sm"
                          >
                            Open ↗
                          </a>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </section>

            {/* Collaborators */}
            <section className="bg-[#111118]/90 border border-white/5 rounded-2xl p-6 workspace-collaborators-section shadow-lg shadow-black/10">
              <div 
                className="flex items-center justify-between cursor-pointer md:cursor-default"
                onClick={toggleCollabCollapse}
              >
                <h3 className="font-label-sm uppercase tracking-widest text-on-surface-variant text-[10px] font-bold">
                  Collaborators ({collabList.length})
                </h3>
                <span className={`material-symbols-outlined text-sm text-on-surface-variant transition-transform md:hidden ${isCollabCollapsed ? '' : 'rotate-180'}`}>
                  expand_more
                </span>
              </div>
              
              <div className={`${isCollabCollapsed ? 'hidden md:block' : 'block'} space-y-4 pt-4`}>
                {collabList.map((collab) => {
                  const isCurrentUser = collab.userId === userProfile.userId || (collab.isOwner && isWorkspaceOwner);
                  const userObj = allUsers.find(u => u.userId === collab.userId);
                  const name = collab.fullName;
                  const username = collab.username ? `@${collab.username}` : '@user';

                  // Presence checking
                  const presence = presenceStates && presenceStates[collab.userId];
                  const presenceStatus = presence ? presence.status : 'offline';

                  let statusColor = 'bg-neutral-500';
                  if (presenceStatus === 'online') {
                    statusColor = 'bg-green-500 shadow-[0_0_8px_#22c55e]';
                  } else if (presenceStatus === 'away') {
                    statusColor = 'bg-amber-500 shadow-[0_0_8px_#f59e0b]';
                  }

                  return (
                    <div key={collab.userId} className="flex items-center justify-between gap-3 group/item">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <AvatarImg src={getAvatar(isCurrentUser ? userProfile : userObj)} sizeCls="w-8 h-8" iconCls="text-xs" />
                          <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border border-[#111118] ${statusColor}`} title={presenceStatus}></span>
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-white leading-none">
                            {name} {isCurrentUser && <span className="text-[8px] text-primary">(You)</span>}
                          </h4>
                          <span className="text-[10px] text-on-surface-variant leading-none block mt-1">{username}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {collab.isOwner ? (
                          <span className="px-2 py-0.5 rounded text-[8px] font-black bg-primary/20 border border-primary/20 text-primary uppercase tracking-wider">
                            Owner
                          </span>
                        ) : (
                          <>
                            <span className="px-2 py-0.5 rounded text-[8px] font-black bg-white/5 border border-white/5 text-on-surface-variant uppercase tracking-wider">
                              {collab.role}
                            </span>
                            {isWorkspaceOwner && (
                              <button
                                type="button"
                                onClick={async () => {
                                  if (window.confirm(`Are you sure you want to remove ${name} from this workspace?`)) {
                                    await removeCollaborator(id, collab.userId);
                                  }
                                }}
                                className="p-1 text-on-surface-variant hover:text-red-400 bg-transparent border-0 cursor-pointer opacity-85 md:opacity-0 md:group-hover/item:opacity-100 transition-opacity"
                                title="Remove collaborator"
                              >
                                <span className="material-symbols-outlined text-xs">close</span>
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Sharing Settings Card (Owner Only) */}
            {isWorkspaceOwner && (
              <section className="bg-[#111118]/90 border border-white/5 rounded-2xl p-6 space-y-5 workspace-sharing-section shadow-lg shadow-black/10">
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <h3 className="font-label-sm uppercase tracking-widest text-on-surface-variant text-[10px] font-bold">
                    Workspace Sharing
                  </h3>
                  <span className="material-symbols-outlined text-primary text-base">
                    share
                  </span>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-on-surface-variant">Enable Workspace Sharing</span>
                    <button
                      onClick={handleToggleSharing}
                      className={`w-10 h-6 rounded-full transition-colors duration-200 relative ${
                        ws.isShared ? 'bg-primary' : 'bg-zinc-800'
                      }`}
                    >
                      <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
                        ws.isShared ? 'translate-x-4' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>

                  {ws.isShared && (
                    <div className="space-y-3 pt-2 animate-fade-in">
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase tracking-wider text-on-surface-variant font-bold">Workspace ID</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            readOnly
                            value={ws.shareId || ''}
                            className="flex-grow bg-[#0D0D14] border border-white/5 rounded px-2.5 py-1.5 text-xs text-white select-all font-mono"
                          />
                          <button
                            onClick={() => copyToClipboard(ws.shareId, 'Workspace ID')}
                            className="px-3 py-1 bg-white/5 border border-white/5 hover:bg-white/10 rounded text-[10px] uppercase font-bold text-on-surface-variant hover:text-white"
                          >
                            Copy
                          </button>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] uppercase tracking-wider text-on-surface-variant font-bold">Workspace Password</label>
                        <div className="flex gap-2">
                          <input
                            type={showPin ? 'text' : 'password'}
                            readOnly
                            value={ws.sharePassword || ws.sharePin || ''}
                            className="flex-grow bg-[#0D0D14] border border-white/5 rounded px-2.5 py-1.5 text-xs text-white select-all font-mono tracking-widest"
                          />
                          <button
                            onClick={() => setShowPin(!showPin)}
                            className="px-2 py-1 bg-white/5 border border-white/5 hover:bg-white/10 rounded text-[10px] flex items-center justify-center"
                          >
                            <span className="material-symbols-outlined text-xs">
                              {showPin ? 'visibility_off' : 'visibility'}
                            </span>
                          </button>
                          <button
                            onClick={() => copyToClipboard(ws.sharePassword || ws.sharePin, 'Workspace Password')}
                            className="px-3 py-1 bg-white/5 border border-white/5 hover:bg-white/10 rounded text-[10px] uppercase font-bold text-on-surface-variant hover:text-white"
                          >
                            Copy
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-2">
                        <button
                          onClick={handleRegenerateShareId}
                          className="py-2 bg-white/5 border border-white/5 hover:bg-white/10 rounded text-[9px] uppercase font-bold text-on-surface-variant hover:text-white transition-all cursor-pointer"
                        >
                          Regenerate ID
                        </button>
                        <button
                          onClick={handleRegeneratePassword}
                          className="py-2 bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 hover:bg-[#8B5CF6]/20 rounded text-[9px] uppercase font-bold text-primary transition-all cursor-pointer text-center"
                        >
                          Regenerate Password
                        </button>
                      </div>
                    </div>
                  )}

                  <p className="text-[10px] text-on-surface-variant/70 leading-normal">
                    {ws.isShared 
                      ? "Anyone with the Workspace ID and Password can view this workspace's tracks and overall progress."
                      : "Sharing is disabled. Enable to share a read-only snapshot of this workspace's track structure and overall progress."
                    }
                  </p>
                </div>
              </section>
            )}

            {/* Delete Workspace Button (Owner Only) */}
            {isWorkspaceOwner && (
              <div className="pt-4 flex justify-end workspace-delete-section">
                <Button 
                  variant="ghost" 
                  className="bg-red-950/20 border border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-white px-5 py-2.5 font-bold uppercase tracking-wider text-xs flex items-center gap-1.5 w-full justify-center cursor-pointer"
                  onClick={() => setIsDeleteModalOpen(true)}
                  icon="delete"
                >
                  Delete Workspace
                </Button>
              </div>
            )}

          </div>

        </div>
        </>
        )}
      </main>

      {/* Task Creation & Edit Modal */}
      <Modal isOpen={isTaskModalOpen} onClose={() => setIsTaskModalOpen(false)} title={editingTask ? 'Edit Todo' : 'Create Todo'}>
        <form onSubmit={handleTaskSubmit} className="space-y-5">
          <InputField
            id="workspace-task-text"
            label="Task Title"
            placeholder="e.g. Implement layout hook"
            value={taskText}
            onChange={(e) => setTaskText(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-[10px] uppercase font-bold text-on-surface-variant tracking-wider text-xs font-semibold">Priority</label>
              <select 
                value={taskPriority}
                onChange={(e) => setTaskPriority(e.target.value)}
                className="w-full bg-[#111118] border border-white/5 rounded-lg p-3 text-on-surface focus:outline-none focus:border-primary text-xs"
              >
                <option value="High">High</option>
                <option value="Med">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] uppercase font-bold text-on-surface-variant tracking-wider text-xs font-semibold">Recurring</label>
              <select 
                value={taskRecurring}
                onChange={(e) => setTaskRecurring(e.target.value)}
                className="w-full bg-[#111118] border border-white/5 rounded-lg p-3 text-on-surface focus:outline-none focus:border-primary text-xs"
              >
                <option value="None">No Repeat</option>
                <option value="Daily">Daily</option>
                <option value="Weekly">Weekly</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <InputField
              id="workspace-task-date"
              label="Due Date"
              type="date"
              value={taskDueDate}
              onChange={(e) => setTaskDueDate(e.target.value)}
            />
            <InputField
              id="workspace-task-time"
              label="Due Time"
              type="time"
              value={taskDueTime}
              onChange={(e) => setTaskDueTime(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] uppercase font-bold text-on-surface-variant tracking-wider text-xs font-semibold">Progress ({taskProgress}%)</label>
            <input 
              type="range"
              min="0"
              max="100"
              step="10"
              value={taskProgress}
              onChange={(e) => setTaskProgress(e.target.value)}
              className="w-full mt-2 h-1.5 bg-white/5 rounded-lg appearance-none cursor-pointer accent-primary"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
            <Button variant="ghost" onClick={() => setIsTaskModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">{editingTask ? 'Save' : 'Create'}</Button>
          </div>
        </form>
      </Modal>

      {/* Collaborate Invite Modal */}
      <Modal isOpen={isInviteModalOpen} onClose={() => setIsInviteModalOpen(false)} title="Collaborate Workspace">
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            if (!inviteFriendId) return;
            inviteCollaborator(id, inviteFriendId, inviteRole);
            setIsInviteModalOpen(false);
          }} 
          className="space-y-5"
        >
          <div className="space-y-2">
            <label className="block text-[10px] uppercase font-bold text-on-surface-variant tracking-wider text-xs font-semibold">Select Friend</label>
            <select
              value={inviteFriendId}
              onChange={(e) => setInviteFriendId(e.target.value)}
              className="w-full bg-[#111118] border border-white/5 rounded-lg p-3 text-on-surface focus:outline-none focus:border-primary text-xs"
              required
            >
              <option value="">-- Choose Friend --</option>
              {friends.map((friendId) => {
                const user = allUsers.find(u => u.userId === friendId);
                return (
                  <option key={friendId} value={friendId}>
                    {user ? `${user.fullName} (${user.username})` : friendId}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] uppercase font-bold text-on-surface-variant tracking-wider text-xs font-semibold">Role & Permissions</label>
            <select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value)}
              className="w-full bg-[#111118] border border-white/5 rounded-lg p-3 text-on-surface focus:outline-none focus:border-primary text-xs"
            >
              <option value="Editor">Editor (Can complete tasks & edits)</option>
              <option value="Viewer">Viewer (Read-only access)</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
            <Button variant="ghost" onClick={() => setIsInviteModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" icon="send">Send Invite</Button>
          </div>
        </form>
      </Modal>

      {/* Add / Edit Resource Modal */}
      <Modal isOpen={isResourceModalOpen} onClose={() => setIsResourceModalOpen(false)} title={editingResource ? 'Edit Resource' : 'Add Resource'}>
        <form onSubmit={handleResourceSubmit} className="space-y-5">
          {/* URL field first — drives service detection preview */}
          <div className="space-y-2">
            <InputField
              id="res-link"
              label="Link URL"
              placeholder="https://youtube.com/watch?v=..."
              value={resourceLink}
              onChange={(e) => setResourceLink(e.target.value)}
              required
            />
            {/* Live service preview */}
            {resourceLink && (() => {
              const preview = getResourceMeta(resourceLink, resourceCategory);
              return (
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.07]">
                  <div className="w-6 h-6 flex items-center justify-center">
                    {preview.iconUrl ? (
                      <img src={preview.iconUrl} alt={preview.label} className="w-4 h-4 object-contain" onError={(e) => { e.currentTarget.style.display='none'; }} />
                    ) : (
                      <span className="material-symbols-outlined text-[15px] text-on-surface-variant">language</span>
                    )}
                  </div>
                  <span className="text-[10px] text-on-surface-variant">{preview.label}</span>
                  {preview.domain && <span className="text-[10px] text-on-surface-variant/50 ml-auto truncate">{preview.domain}</span>}
                </div>
              );
            })()}
          </div>

          <InputField
            id="res-title"
            label="Resource Title"
            placeholder="e.g. Flexbox visual cheat sheet"
            value={resourceTitle}
            onChange={(e) => setResourceTitle(e.target.value)}
            required
          />

          <div className="space-y-2">
            <label className="block text-[10px] uppercase font-bold text-on-surface-variant tracking-wider text-xs font-semibold">Category <span className="text-on-surface-variant/50 normal-case tracking-normal">(auto-detected from URL)</span></label>
            <select
              value={resourceCategory}
              onChange={(e) => setResourceCategory(e.target.value)}
              className="w-full bg-[#111118] border border-white/5 rounded-lg p-3 text-on-surface focus:outline-none focus:border-primary text-xs"
            >
              <option value="YouTube">YouTube Video</option>
              <option value="GitHub">GitHub Repository</option>
              <option value="Google Drive">Google Drive</option>
              <option value="Documentation">Documentation</option>
              <option value="Article">Article / Blog Post</option>
              <option value="PDF">PDF / eBook</option>
              <option value="Course">Online Course</option>
              <option value="Tool">Tool / App</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
            <Button variant="ghost" onClick={() => setIsResourceModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">{editingResource ? 'Save' : 'Add Link'}</Button>
          </div>
        </form>
      </Modal>

      {/* Add Topic Modal */}
      <Modal isOpen={isTopicModalOpen} onClose={() => setIsTopicModalOpen(false)} title="Add Roadmap Topic">
        <form onSubmit={handleAddTopicSubmit} className="space-y-5">
          <InputField
            id="topic-title"
            label="Topic Name"
            placeholder="e.g. Advanced Graph Traversals"
            value={newTopicTitle}
            onChange={(e) => setNewTopicTitle(e.target.value)}
            required
          />
          <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
            <Button variant="ghost" onClick={() => setIsTopicModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Add Topic</Button>
          </div>
        </form>
      </Modal>

      {/* Edit Topic Title Modal */}
      <Modal isOpen={isEditTopicModalOpen} onClose={() => setIsEditTopicModalOpen(false)} title="Edit Topic Title">
        <form onSubmit={handleEditTopicSubmit} className="space-y-5">
          <InputField
            id="edit-topic-title"
            label="Topic Name"
            placeholder="e.g. Basics of Programming"
            value={editTopicTitle}
            onChange={(e) => setEditTopicTitle(e.target.value)}
            required
          />
          <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
            <Button variant="ghost" onClick={() => setIsEditTopicModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Rename Topic</Button>
          </div>
        </form>
      </Modal>

      {/* Delete Workspace Confirmation Modal */}
      <Modal 
        isOpen={isDeleteModalOpen || deleteStep > 0} 
        onClose={() => {
          if (!isDeletingWorkspace) {
            setIsDeleteModalOpen(false);
            setDeleteStep(0);
          }
        }} 
        title="Delete Workspace?"
      >
        <div className="space-y-4 text-left">
          <p className="text-sm text-on-surface-variant leading-relaxed">
            Are you sure you want to delete <strong className="text-white font-bold">"{ws?.title}"</strong>?
          </p>
          <p className="text-xs text-red-400 font-semibold">
            This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
            <Button 
              variant="ghost" 
              onClick={() => {
                setIsDeleteModalOpen(false);
                setDeleteStep(0);
              }}
              disabled={isDeletingWorkspace}
            >
              Cancel
            </Button>
            <Button 
              variant="primary" 
              onClick={handleDeleteWorkspaceConfirm}
              disabled={isDeletingWorkspace}
              className="bg-red-600 border border-red-600 text-white hover:bg-red-700 shadow-[0_0_15px_rgba(239,68,68,0.3)] cursor-pointer"
            >
              {isDeletingWorkspace ? 'Deleting...' : 'Delete Workspace'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Non-blocking MasterOS Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'success' })}
      />
    </div>
  );
};

/* ── Portal-backed Viewport-Aware Topic Action Menu Button Component ── */
const TopicActionButton = ({
  topic,
  rmId,
  activeTopicMenu,
  setActiveTopicMenu,
  handleOpenEditTopic,
  setActiveTopicForSubtopic,
  setNewSubtopicText,
  handleReorderTopic,
  handleRemoveTopic
}) => {
  const btnRef = useRef(null);
  const isOpen = activeTopicMenu === topic.id;
  const [coords, setCoords] = useState({ top: 0, left: 0 });

  useLayoutEffect(() => {
    if (!isOpen || !btnRef.current) return;

    const updatePosition = () => {
      if (!btnRef.current) return;
      const rect = btnRef.current.getBoundingClientRect();
      const menuWidth = 180;
      const menuHeight = 220;
      const vh = window.innerHeight;
      const vw = window.innerWidth;

      let top = rect.bottom + 6;
      if (vh - rect.bottom < menuHeight && rect.top > menuHeight) {
        top = rect.top - menuHeight - 6;
      }

      let left = rect.right - menuWidth;
      if (left < 10) left = 10;
      if (left + menuWidth > vw - 10) left = vw - menuWidth - 10;

      setCoords({ top, left });
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);
    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [isOpen]);

  return (
    <div className="relative shrink-0 ml-1">
      <button
        ref={btnRef}
        onClick={(e) => {
          e.stopPropagation();
          setActiveTopicMenu(isOpen ? null : topic.id);
        }}
        className="w-8 h-8 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        aria-label="Topic actions"
      >
        <span className="material-symbols-outlined text-[16px]">more_vert</span>
      </button>

      {isOpen && createPortal(
        <>
          <div
            className="fixed inset-0 z-[99990]"
            onClick={(e) => {
              e.stopPropagation();
              setActiveTopicMenu(null);
            }}
          />
          <div
            className="fixed z-[99999] min-w-[170px] bg-[#111118] border border-white/10 rounded-xl shadow-2xl py-1.5 overflow-hidden text-left"
            style={{
              top: `${coords.top}px`,
              left: `${coords.left}px`,
              boxShadow: '0 20px 60px rgba(0,0,0,0.85)'
            }}
          >
            <div className="px-3 py-1.5 text-[9px] uppercase font-black tracking-widest text-primary/70 border-b border-white/5 mb-1">
              Topic Actions
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveTopicMenu(null);
                handleOpenEditTopic(rmId, topic);
              }}
              className="w-full text-left px-3 py-2 text-[12px] text-zinc-200 hover:text-white hover:bg-white/5 flex items-center gap-2.5 cursor-pointer border-0 bg-transparent transition-colors"
            >
              <span className="material-symbols-outlined text-[14px] shrink-0">edit</span>
              Edit Topic
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveTopicMenu(null);
                setActiveTopicForSubtopic(topic.id);
                setNewSubtopicText('');
              }}
              className="w-full text-left px-3 py-2 text-[12px] text-zinc-200 hover:text-white hover:bg-white/5 flex items-center gap-2.5 cursor-pointer border-0 bg-transparent transition-colors"
            >
              <span className="material-symbols-outlined text-[14px] shrink-0">add_circle</span>
              Add Task
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveTopicMenu(null);
                handleReorderTopic(rmId, topic.id, 'up');
              }}
              className="w-full text-left px-3 py-2 text-[12px] text-zinc-200 hover:text-white hover:bg-white/5 flex items-center gap-2.5 cursor-pointer border-0 bg-transparent transition-colors"
            >
              <span className="material-symbols-outlined text-[14px] shrink-0">arrow_upward</span>
              Move Up
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveTopicMenu(null);
                handleReorderTopic(rmId, topic.id, 'down');
              }}
              className="w-full text-left px-3 py-2 text-[12px] text-zinc-200 hover:text-white hover:bg-white/5 flex items-center gap-2.5 cursor-pointer border-0 bg-transparent transition-colors"
            >
              <span className="material-symbols-outlined text-[14px] shrink-0">arrow_downward</span>
              Move Down
            </button>
            <div className="border-t border-white/5 my-1" />
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveTopicMenu(null);
                handleRemoveTopic(rmId, topic.id);
              }}
              className="w-full text-left px-3 py-2 text-[12px] text-red-400 hover:text-red-300 hover:bg-red-500/5 flex items-center gap-2.5 cursor-pointer border-0 bg-transparent transition-colors"
            >
              <span className="material-symbols-outlined text-[14px] shrink-0">delete</span>
              Delete
            </button>
          </div>
        </>,
        document.body
      )}
    </div>
  );
};

export default WorkspaceDetail;
