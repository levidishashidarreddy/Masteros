import React from 'react';
import { Link } from 'react-router-dom';

const TECH_SVG_LOGOS = {
  cpp: (
    <div className="relative group-hover:scale-110 transition-transform duration-300 flex items-center justify-center">
      <svg viewBox="0 0 100 100" className="w-[52px] h-[52px] drop-shadow-[0_0_14px_rgba(0,200,255,0.5)]">
        <polygon points="50,5 90,27.5 90,72.5 50,95 10,72.5 10,27.5" fill="#00599C" stroke="#00C8FF" strokeWidth="3.5" />
        <text x="50" y="62" textAnchor="middle" fill="#FFFFFF" fontSize="28" fontStyle="normal" fontWeight="900" fontFamily="Segoe UI, sans-serif">C++</text>
      </svg>
    </div>
  ),
  javascript: (
    <div className="w-[46px] h-[46px] bg-[#F7DF1E] rounded-xl flex items-end justify-end p-1.5 shadow-[0_0_18px_rgba(247,223,30,0.4)] group-hover:scale-110 transition-transform duration-300">
      <span className="font-black text-[#000000] text-xl tracking-tighter leading-none select-none font-sans">JS</span>
    </div>
  ),
  python: (
    <svg viewBox="0 0 128 128" className="w-[50px] h-[50px] object-contain drop-shadow-[0_0_14px_rgba(55,118,171,0.5)] group-hover:scale-110 transition-transform duration-300">
      <path fill="#3776AB" d="M63.5 12c-27.1 0-25.5 11.7-25.5 11.7l.1 12.1h26.1v3.7H27.5S12 37.8 12 65s13.6 26 13.6 26h8.1V78.7s-.4-14.7 14.7-14.7h25.4s14.1.2 14.1-13.8V25.7s1.9-13.7-26.4-13.7zm-14.2 8.3c2.6 0 4.7 2.1 4.7 4.7s-2.1 4.7-4.7 4.7-4.7-2.1-4.7-4.7 2.1-4.7 4.7-4.7z" />
      <path fill="#FFD43B" d="M64.5 116c27.1 0 25.5-11.7 25.5-11.7l-.1-12.1H63.8v-3.7h36.7s15.5 1.7 15.5-25.5-13.6-26-13.6-26h-8.1v12.3s.4 14.7-14.7 14.7H64.2s-14.1-.2-14.1 13.8v24.5s-1.9 13.7 26.4 13.7zm14.2-8.3c-2.6 0-4.7-2.1-4.7-4.7s2.1-4.7 4.7-4.7 4.7 2.1 4.7 4.7-2.1 4.7-4.7 4.7z" />
    </svg>
  ),
  java: (
    <div className="w-[48px] h-[48px] bg-gradient-to-br from-[#2A1400] to-[#502200] border border-[#ED8B00]/50 rounded-xl flex items-center justify-center shadow-[0_0_18px_rgba(237,139,0,0.4)] group-hover:scale-110 transition-transform duration-300">
      <span className="font-black text-[#ED8B00] text-xs tracking-widest uppercase font-mono">JAVA</span>
    </div>
  ),
  typescript: (
    <div className="w-[46px] h-[46px] bg-[#3178C6] rounded-xl flex items-end justify-end p-1.5 shadow-[0_0_18px_rgba(49,120,198,0.4)] group-hover:scale-110 transition-transform duration-300">
      <span className="font-black text-[#FFFFFF] text-xl tracking-tighter leading-none select-none font-sans">TS</span>
    </div>
  ),
  react: (
    <svg viewBox="0 0 100 100" className="w-[52px] h-[52px] object-contain drop-shadow-[0_0_16px_rgba(97,218,251,0.5)] group-hover:scale-110 transition-transform duration-300">
      <circle cx="50" cy="50" r="9" fill="#61DAFB" />
      <ellipse cx="50" cy="50" rx="40" ry="15" fill="none" stroke="#61DAFB" strokeWidth="4" />
      <ellipse cx="50" cy="50" rx="40" ry="15" fill="none" stroke="#61DAFB" strokeWidth="4" transform="rotate(60 50 50)" />
      <ellipse cx="50" cy="50" rx="40" ry="15" fill="none" stroke="#61DAFB" strokeWidth="4" transform="rotate(120 50 50)" />
    </svg>
  ),
  csharp: (
    <div className="w-[46px] h-[46px] bg-[#512BD4] rounded-xl flex items-center justify-center shadow-[0_0_18px_rgba(81,43,212,0.4)] group-hover:scale-110 transition-transform duration-300">
      <span className="font-black text-[#FFFFFF] text-lg tracking-tighter font-sans">C#</span>
    </div>
  ),
  node: (
    <div className="w-[48px] h-[48px] bg-[#0A200A] border border-[#68A063]/40 rounded-xl flex items-center justify-center shadow-[0_0_18px_rgba(104,160,99,0.4)] group-hover:scale-110 transition-transform duration-300">
      <span className="font-black text-[#68A063] text-xs tracking-wider uppercase font-mono">NODE</span>
    </div>
  ),
  sql: (
    <div className="w-[48px] h-[48px] bg-[#001824] border border-[#00758F]/40 rounded-xl flex items-center justify-center shadow-[0_0_18px_rgba(0,117,143,0.4)] group-hover:scale-110 transition-transform duration-300">
      <span className="font-black text-[#00758F] text-xs tracking-wider uppercase font-mono">SQL</span>
    </div>
  ),
  dsa: (
    <div className="w-[48px] h-[48px] bg-gradient-to-br from-[#2D0B5A] to-[#120429] border border-[#A855F7]/50 rounded-2xl flex flex-col items-center justify-center p-1 shadow-[0_0_20px_rgba(168,85,247,0.4)] group-hover:scale-110 transition-transform duration-300">
      <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#A855F7] fill-none stroke-current stroke-[2.2] stroke-round stroke-linejoin-round">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
      <span className="text-[7px] font-black text-[#A855F7] tracking-widest uppercase font-mono mt-0.5">DSA</span>
    </div>
  )
};

const CARD_LANG_THEMES = {
  dsa:          { gradientFrom: '#1B0938', accent: '#A855F7', iconKey: 'dsa',        iconSlug: 'leetcode',   iconColor: 'FFA116', wordmark: 'DSA & ALGORITHMS' },
  cpp:          { gradientFrom: '#00243A', accent: '#00C8FF', iconKey: 'cpp',        iconSlug: 'cplusplus',   iconColor: '00C8FF', wordmark: 'C++' },
  c:            { gradientFrom: '#0D1E33', accent: '#5C9CD5', iconKey: null,       iconSlug: 'c',           iconColor: '5C9CD5', wordmark: 'C' },
  csharp:       { gradientFrom: '#150A2A', accent: '#512BD4', iconKey: 'csharp',     iconSlug: 'csharp',      iconColor: '512BD4', wordmark: 'C#' },
  python:       { gradientFrom: '#0A1A30', accent: '#3776AB', iconKey: 'python',     iconSlug: 'python',      iconColor: '3776AB', wordmark: 'PYTHON' },
  java:         { gradientFrom: '#1E0E00', accent: '#ED8B00', iconKey: 'java',       iconSlug: 'openjdk',     iconColor: 'ED8B00', wordmark: 'JAVA' },
  javascript:   { gradientFrom: '#1A1600', accent: '#F7DF1E', iconKey: 'javascript', iconSlug: 'javascript',  iconColor: 'F7DF1E', wordmark: 'JAVASCRIPT' },
  typescript:   { gradientFrom: '#050F1F', accent: '#3178C6', iconKey: 'typescript', iconSlug: 'typescript',  iconColor: '3178C6', wordmark: 'TYPESCRIPT' },
  react:        { gradientFrom: '#001525', accent: '#61DAFB', iconKey: 'react',      iconSlug: 'react',       iconColor: '61DAFB', wordmark: 'REACT' },
  react_native: { gradientFrom: '#001525', accent: '#61DAFB', iconKey: 'react',      iconSlug: 'react',       iconColor: '61DAFB', wordmark: 'REACT NATIVE' },
  node:         { gradientFrom: '#051005', accent: '#68A063', iconKey: 'node',       iconSlug: 'nodedotjs',   iconColor: '68A063', wordmark: 'NODE.JS' },
  html:         { gradientFrom: '#1A0400', accent: '#E34F26', iconKey: null,       iconSlug: 'html5',       iconColor: 'E34F26', wordmark: 'HTML5' },
  css:          { gradientFrom: '#00031A', accent: '#264DE4', iconKey: null,       iconSlug: 'css3',        iconColor: '264DE4', wordmark: 'CSS3' },
  sql:          { gradientFrom: '#00101A', accent: '#00758F', iconKey: 'sql',        iconSlug: 'mysql',       iconColor: '00758F', wordmark: 'SQL' },
  mongodb:      { gradientFrom: '#051508', accent: '#47A248', iconKey: null,       iconSlug: 'mongodb',     iconColor: '47A248', wordmark: 'MONGODB' },
  aws:          { gradientFrom: '#100900', accent: '#FF9900', iconKey: null,       iconSlug: 'amazonaws',   iconColor: 'FF9900', wordmark: 'AWS' },
  docker:       { gradientFrom: '#000D1E', accent: '#2496ED', iconKey: null,       iconSlug: 'docker',      iconColor: '2496ED', wordmark: 'DOCKER' },
  kubernetes:   { gradientFrom: '#04102A', accent: '#326CE5', iconKey: null,       iconSlug: 'kubernetes',  iconColor: '326CE5', wordmark: 'KUBERNETES' },
  git:          { gradientFrom: '#150200', accent: '#F05032', iconKey: null,       iconSlug: 'git',         iconColor: 'F05032', wordmark: 'GIT' },
  flutter:      { gradientFrom: '#001020', accent: '#54C5F8', iconKey: null,       iconSlug: 'flutter',     iconColor: '54C5F8', wordmark: 'FLUTTER' },
  kotlin:       { gradientFrom: '#08001A', accent: '#7F52FF', iconKey: null,       iconSlug: 'kotlin',      iconColor: '7F52FF', wordmark: 'KOTLIN' },
  swift:        { gradientFrom: '#180600', accent: '#F05138', iconKey: null,       iconSlug: 'swift',       iconColor: 'F05138', wordmark: 'SWIFT' },
  dart:         { gradientFrom: '#001220', accent: '#0175C2', iconKey: null,       iconSlug: 'dart',        iconColor: '0175C2', wordmark: 'DART' },
  rust:         { gradientFrom: '#140400', accent: '#CE422B', iconKey: null,       iconSlug: 'rust',        iconColor: 'CE422B', wordmark: 'RUST' },
  go:           { gradientFrom: '#000E18', accent: '#00ACD7', iconKey: null,       iconSlug: 'go',          iconColor: '00ACD7', wordmark: 'GO' },
  angular:      { gradientFrom: '#1A0000', accent: '#DD0031', iconKey: null,       iconSlug: 'angular',     iconColor: 'DD0031', wordmark: 'ANGULAR' },
  vue:          { gradientFrom: '#001A0A', accent: '#42B883', iconKey: null,       iconSlug: 'vuedotjs',    iconColor: '42B883', wordmark: 'VUE.JS' },
  nextjs:       { gradientFrom: '#000000', accent: '#ffffff', iconKey: null,       iconSlug: 'nextdotjs',   iconColor: 'ffffff', wordmark: 'NEXT.JS' },
  django:       { gradientFrom: '#04140D', accent: '#092E20', iconKey: null,       iconSlug: 'django',      iconColor: '44B78B', wordmark: 'DJANGO' },
  spring_boot:  { gradientFrom: '#0B1A0A', accent: '#6DB33F', iconKey: null,       iconSlug: 'springboot',  iconColor: '6DB33F', wordmark: 'SPRING BOOT' },
  php:          { gradientFrom: '#0C0E20', accent: '#777BB4', iconKey: null,       iconSlug: 'php',         iconColor: '777BB4', wordmark: 'PHP' },
  ruby:         { gradientFrom: '#1A0404', accent: '#CC342D', iconKey: null,       iconSlug: 'ruby',        iconColor: 'CC342D', wordmark: 'RUBY' },
  tensorflow:   { gradientFrom: '#1C0A00', accent: '#FF6F00', iconKey: null,       iconSlug: 'tensorflow',  iconColor: 'FF6F00', wordmark: 'TENSORFLOW' },
  graphql:      { gradientFrom: '#1A0020', accent: '#E10098', iconKey: null,       iconSlug: 'graphql',     iconColor: 'E10098', wordmark: 'GRAPHQL' },
  linux:        { gradientFrom: '#0A0A00', accent: '#FCC624', iconKey: null,       iconSlug: 'linux',       iconColor: 'FCC624', wordmark: 'LINUX' },
  default:      { gradientFrom: '#0D0822', accent: '#8B5CF6', iconKey: null,       iconSlug: null,          iconColor: '8B5CF6', wordmark: null },
};

const detectCardTheme = (technology, technologySlug, technologyId, tag, category, roadmaps, description, title) => {
  // Step 1: Explicit Technology property FIRST as single source of truth
  const explicitTarget = (technology || technologySlug || technologyId || '').toLowerCase().trim();
  if (explicitTarget) {
    if (explicitTarget.includes('dsa') || explicitTarget.includes('data structure') || explicitTarget.includes('algorithm')) return CARD_LANG_THEMES.dsa;
    if (explicitTarget.includes('c++') || explicitTarget === 'cpp' || explicitTarget === 'cplusplus') return CARD_LANG_THEMES.cpp;
    if (explicitTarget.includes('c#') || explicitTarget === 'csharp' || explicitTarget === 'cs') return CARD_LANG_THEMES.csharp;
    if (explicitTarget === 'c' || explicitTarget === 'c language') return CARD_LANG_THEMES.c;
    if (explicitTarget.includes('python')) return CARD_LANG_THEMES.python;
    if (explicitTarget.includes('javascript') || explicitTarget === 'js') return CARD_LANG_THEMES.javascript;
    if (explicitTarget.includes('typescript') || explicitTarget === 'ts') return CARD_LANG_THEMES.typescript;
    if (explicitTarget.includes('react native') || explicitTarget === 'react_native') return CARD_LANG_THEMES.react_native;
    if (explicitTarget.includes('react')) return CARD_LANG_THEMES.react;
    if (explicitTarget.includes('node')) return CARD_LANG_THEMES.node;
    if (explicitTarget.includes('next')) return CARD_LANG_THEMES.nextjs;
    if (explicitTarget.includes('vue')) return CARD_LANG_THEMES.vue;
    if (explicitTarget.includes('angular')) return CARD_LANG_THEMES.angular;
    if (explicitTarget.includes('django')) return CARD_LANG_THEMES.django;
    if (explicitTarget.includes('spring')) return CARD_LANG_THEMES.spring_boot;
    if (explicitTarget.includes('docker')) return CARD_LANG_THEMES.docker;
    if (explicitTarget.includes('kubernetes') || explicitTarget.includes('k8s')) return CARD_LANG_THEMES.kubernetes;
    if (explicitTarget.includes('aws') || explicitTarget.includes('amazon')) return CARD_LANG_THEMES.aws;
    if (explicitTarget.includes('flutter')) return CARD_LANG_THEMES.flutter;
    if (explicitTarget.includes('sql') || explicitTarget.includes('mysql') || explicitTarget.includes('postgres') || explicitTarget.includes('database')) return CARD_LANG_THEMES.sql;
    if (explicitTarget.includes('mongo')) return CARD_LANG_THEMES.mongodb;
    if (explicitTarget.includes('go') || explicitTarget.includes('golang')) return CARD_LANG_THEMES.go;
    if (explicitTarget.includes('rust')) return CARD_LANG_THEMES.rust;
    if (explicitTarget.includes('php')) return CARD_LANG_THEMES.php;
    if (explicitTarget.includes('ruby')) return CARD_LANG_THEMES.ruby;
    if (explicitTarget.includes('kotlin')) return CARD_LANG_THEMES.kotlin;
    if (explicitTarget.includes('swift')) return CARD_LANG_THEMES.swift;
    if (explicitTarget.includes('dart')) return CARD_LANG_THEMES.dart;
    if (explicitTarget.includes('html')) return CARD_LANG_THEMES.html;
    if (explicitTarget.includes('css')) return CARD_LANG_THEMES.css;
    if (explicitTarget.includes('git')) return CARD_LANG_THEMES.git;
    if (explicitTarget.includes('tensorflow')) return CARD_LANG_THEMES.tensorflow;
    if (explicitTarget.includes('graphql')) return CARD_LANG_THEMES.graphql;
    if (explicitTarget.includes('linux')) return CARD_LANG_THEMES.linux;
    if (explicitTarget.includes('java') && !explicitTarget.includes('javascript')) return CARD_LANG_THEMES.java;
    
    // Custom/unlisted technology selected: Return generic technology theme with custom wordmark
    return {
      ...CARD_LANG_THEMES.default,
      wordmark: explicitTarget.toUpperCase(),
      iconSlug: explicitTarget.replace(/[^a-z0-9]/g, '')
    };
  }

  // Step 2: Fallback check on Title & Description FIRST for exact programming languages (C++, JS, Python, Java, etc.)
  const titleDescStr = `${title || ''} ${description || ''}`.toLowerCase();
  if (titleDescStr) {
    if (titleDescStr.includes('c++') || titleDescStr.includes('cpp')) return CARD_LANG_THEMES.cpp;
    if (titleDescStr.includes('c#') || titleDescStr.includes('csharp')) return CARD_LANG_THEMES.csharp;
    if (titleDescStr.includes('javascript') || /\bjs\b/.test(titleDescStr)) return CARD_LANG_THEMES.javascript;
    if (titleDescStr.includes('typescript') || /\bts\b/.test(titleDescStr)) return CARD_LANG_THEMES.typescript;
    if (titleDescStr.includes('python')) return CARD_LANG_THEMES.python;
    if (titleDescStr.includes('react')) return CARD_LANG_THEMES.react;
    if (titleDescStr.includes('node')) return CARD_LANG_THEMES.node;
    if (titleDescStr.includes('next')) return CARD_LANG_THEMES.nextjs;
    if (titleDescStr.includes('vue')) return CARD_LANG_THEMES.vue;
    if (titleDescStr.includes('angular')) return CARD_LANG_THEMES.angular;
    if (titleDescStr.includes('django')) return CARD_LANG_THEMES.django;
    if (titleDescStr.includes('spring')) return CARD_LANG_THEMES.spring_boot;
    if (titleDescStr.includes('docker')) return CARD_LANG_THEMES.docker;
    if (titleDescStr.includes('kubernetes')) return CARD_LANG_THEMES.kubernetes;
    if (titleDescStr.includes('aws')) return CARD_LANG_THEMES.aws;
    if (titleDescStr.includes('flutter')) return CARD_LANG_THEMES.flutter;
    if (titleDescStr.includes('sql') || titleDescStr.includes('mysql')) return CARD_LANG_THEMES.sql;
    if (titleDescStr.includes('mongo')) return CARD_LANG_THEMES.mongodb;
    if (titleDescStr.includes('rust')) return CARD_LANG_THEMES.rust;
    if (titleDescStr.includes('go')) return CARD_LANG_THEMES.go;
    if (titleDescStr.includes('php')) return CARD_LANG_THEMES.php;
    if (titleDescStr.includes('ruby')) return CARD_LANG_THEMES.ruby;
    if (titleDescStr.includes('kotlin')) return CARD_LANG_THEMES.kotlin;
    if (titleDescStr.includes('swift')) return CARD_LANG_THEMES.swift;
    if (titleDescStr.includes('dart')) return CARD_LANG_THEMES.dart;
    if (titleDescStr.includes('html')) return CARD_LANG_THEMES.html;
    if (titleDescStr.includes('css')) return CARD_LANG_THEMES.css;
    if (titleDescStr.includes('git')) return CARD_LANG_THEMES.git;
    if (titleDescStr.includes('java') && !titleDescStr.includes('javascript')) return CARD_LANG_THEMES.java;
    if (/\bc\b/.test(titleDescStr) || titleDescStr.includes('c language')) return CARD_LANG_THEMES.c;
  }

  // Step 3: Secondary fallback check on Tag, Category, or Roadmaps
  const tagStr = `${tag || ''} ${category || ''} ${roadmaps && roadmaps[0] ? roadmaps[0].title : ''}`.toLowerCase();
  if (tagStr) {
    if (tagStr.includes('c++') || tagStr.includes('cpp')) return CARD_LANG_THEMES.cpp;
    if (tagStr.includes('c#') || tagStr.includes('csharp')) return CARD_LANG_THEMES.csharp;
    if (tagStr.includes('python')) return CARD_LANG_THEMES.python;
    if (tagStr.includes('typescript') || /\bts\b/.test(tagStr)) return CARD_LANG_THEMES.typescript;
    if (tagStr.includes('javascript') || /\bjs\b/.test(tagStr)) return CARD_LANG_THEMES.javascript;
    if (tagStr.includes('react')) return CARD_LANG_THEMES.react;
    if (tagStr.includes('node')) return CARD_LANG_THEMES.node;
    if (tagStr.includes('next')) return CARD_LANG_THEMES.nextjs;
    if (tagStr.includes('vue')) return CARD_LANG_THEMES.vue;
    if (tagStr.includes('angular')) return CARD_LANG_THEMES.angular;
    if (tagStr.includes('django')) return CARD_LANG_THEMES.django;
    if (tagStr.includes('spring')) return CARD_LANG_THEMES.spring_boot;
    if (tagStr.includes('docker')) return CARD_LANG_THEMES.docker;
    if (tagStr.includes('kubernetes')) return CARD_LANG_THEMES.kubernetes;
    if (tagStr.includes('aws')) return CARD_LANG_THEMES.aws;
    if (tagStr.includes('flutter')) return CARD_LANG_THEMES.flutter;
    if (tagStr.includes('sql') || tagStr.includes('mysql')) return CARD_LANG_THEMES.sql;
    if (tagStr.includes('mongo')) return CARD_LANG_THEMES.mongodb;
    if (tagStr.includes('rust')) return CARD_LANG_THEMES.rust;
    if (tagStr.includes('go')) return CARD_LANG_THEMES.go;
    if (tagStr.includes('php')) return CARD_LANG_THEMES.php;
    if (tagStr.includes('ruby')) return CARD_LANG_THEMES.ruby;
    if (tagStr.includes('kotlin')) return CARD_LANG_THEMES.kotlin;
    if (tagStr.includes('swift')) return CARD_LANG_THEMES.swift;
    if (tagStr.includes('dart')) return CARD_LANG_THEMES.dart;
    if (tagStr.includes('html')) return CARD_LANG_THEMES.html;
    if (tagStr.includes('css')) return CARD_LANG_THEMES.css;
    if (tagStr.includes('git')) return CARD_LANG_THEMES.git;
    if (tagStr.includes('java') && !tagStr.includes('javascript')) return CARD_LANG_THEMES.java;
  }

  return CARD_LANG_THEMES.default;
};

const WorkspaceCard = ({
  id,
  title,
  description,
  tag,
  technology,
  technologySlug,
  technologyId,
  category = 'Learning',
  roadmaps = [],
  progress = 0,
  streak = 0,
  isPublic = false,
  tasksLeft = 0,
  totalTasks = 10,
  icon = 'terminal',
  bannerImage = '',
  colorTheme = 'primary',
  isCollaborated = false,
  ownerName = ''
}) => {
  const getThemeColor = () => {
    switch (colorTheme) {
      case 'secondary':
        return { text: 'text-secondary', bg: 'bg-secondary', glow: 'group-hover:border-secondary/15', lightBg: 'bg-secondary/5', lightBorder: 'border-secondary/10' };
      case 'tertiary':
        return { text: 'text-tertiary', bg: 'bg-tertiary', glow: 'group-hover:border-tertiary/15', lightBg: 'bg-tertiary/5', lightBorder: 'border-tertiary/10' };
      default:
        return { text: 'text-primary', bg: 'bg-primary', glow: 'group-hover:border-primary/15', lightBg: 'bg-primary/5', lightBorder: 'border-primary/10' };
    }
  };

  const theme = getThemeColor();
  const lang = detectCardTheme(technology, technologySlug, technologyId, tag, category, roadmaps, description, title);
  const iconUrl = lang.iconSlug
    ? `https://cdn.simpleicons.org/${lang.iconSlug}/${lang.iconColor}`
    : null;

  return (
    <div className={`group relative bg-[#111118] rounded-xl border border-white/5 overflow-hidden hover:-translate-y-1 transition-all duration-300 flex flex-col h-full shadow-md hover:shadow-black/50 ${theme.glow}`}>

      {/* Technology Cover Thumbnail */}
      <div className="relative h-[112px] w-full overflow-hidden border-b border-white/[0.05] shrink-0">
        {/* Language gradient base */}
        <div
          className="absolute inset-0"
          style={{ background: `linear-gradient(135deg, ${lang.gradientFrom} 0%, #0D0D14 70%)` }}
        />
        {/* MasterOS purple atmospheric layer */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 50% 130%, rgba(139,92,246,0.09) 0%, transparent 65%)' }}
        />
        {/* Language accent glow top-right */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(ellipse at 85% 10%, ${lang.accent}20 0%, transparent 50%)` }}
        />
        {/* Dot-grid texture */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ opacity: 0.038 }}
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id={`cd-${id}`} x="0" y="0" width="18" height="18" patternUnits="userSpaceOnUse">
              <circle cx="1.5" cy="1.5" r="1" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#cd-${id})`} />
        </svg>
        {/* Accent hairline at bottom */}
        <div
          className="absolute bottom-0 left-0 right-0 h-px pointer-events-none"
          style={{ background: `linear-gradient(90deg, transparent, ${lang.accent}35, transparent)` }}
        />
        {/* Fade into card body */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#111118]/55 pointer-events-none" />

        {/* Centred technology logo */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          {lang.iconKey && TECH_SVG_LOGOS[lang.iconKey] ? (
            TECH_SVG_LOGOS[lang.iconKey]
          ) : iconUrl ? (
            <img
              src={iconUrl}
              alt={lang.wordmark || title}
              className="w-[44px] h-[44px] object-contain select-none group-hover:scale-110 group-hover:brightness-125 transition-all duration-300 ease-out"
              draggable={false}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                if (e.currentTarget.nextSibling) e.currentTarget.nextSibling.style.removeProperty('display');
              }}
            />
          ) : null}
          <span
            className="material-symbols-outlined text-4xl group-hover:scale-110 transition-transform duration-300"
            style={{ color: lang.accent, display: (lang.iconKey && TECH_SVG_LOGOS[lang.iconKey]) || iconUrl ? 'none' : 'block', fontVariationSettings: "'FILL' 1" }}
          >
            {icon === 'auto_awesome' ? 'terminal' : icon}
          </span>
        </div>

        {/* Language wordmark chip */}
        {lang.wordmark && (
          <div className="absolute bottom-2 left-3 z-10">
            <span
              className="font-mono text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border shadow-sm"
              style={{ color: lang.accent, background: `${lang.accent}14`, borderColor: `${lang.accent}33` }}
            >
              {lang.wordmark}
            </span>
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Header row */}
          <div className="flex justify-between items-start mb-3">
            <div className="w-8 h-8 rounded-lg bg-[#0D0D14] flex items-center justify-center border border-white/5 relative z-10">
              <span className={`material-symbols-outlined text-[16px] ${theme.text}`} style={{ fontVariationSettings: "'FILL' 1" }}>
                {icon === 'auto_awesome' ? 'terminal' : icon}
              </span>
            </div>
            <div className="flex gap-1.5 flex-wrap justify-end">
              <span className="bg-[#08080C] text-[9px] px-2 py-0.5 rounded text-on-surface-variant font-bold border border-white/5 uppercase tracking-wider">
                {isPublic ? 'Public' : 'Private'}
              </span>
              {isCollaborated && (
                <span className="bg-primary/20 text-primary border border-primary/20 text-[9px] px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                  Shared
                </span>
              )}
              {streak > 0 && (
                <span className={`${theme.lightBg} ${theme.text} text-[9px] px-2 py-0.5 rounded font-bold border ${theme.lightBorder} flex items-center gap-0.5`}>
                  <span className="material-symbols-outlined text-[10px]" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
                  {streak}d
                </span>
              )}
            </div>
          </div>

          <Link to={`/workspaces/${id}`}>
            <h3 className="font-headline-md text-[15px] text-white mb-1.5 group-hover:text-primary transition-colors font-bold leading-snug flex items-center gap-1.5">
              {isCollaborated && (
                <span className="material-symbols-outlined text-xs text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>groups</span>
              )}
              {title}
            </h3>
          </Link>
          <p className="text-on-surface-variant text-[12px] mb-3 line-clamp-2 leading-relaxed">{description}</p>
          {isCollaborated && ownerName && (
            <div className="flex items-center gap-1 text-[11px] text-on-surface-variant font-medium mt-1 mb-2">
              <span className="opacity-60">Owner:</span>
              <span className="text-white font-bold">{ownerName}</span>
            </div>
          )}
        </div>

        {/* Progress */}
        <div className="space-y-2 mt-auto">
          <div className="flex justify-between text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold">
            <span>Progress</span>
            <span className={`${theme.text} font-bold`}>{progress}%</span>
          </div>
          <div className="h-[3px] bg-[#08080C] rounded-full overflow-hidden">
            <div
              className={`h-full ${theme.bg} transition-all duration-1000 rounded-full`}
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5 text-on-surface-variant text-[11px]">
            <div className="flex items-center gap-1.5 font-medium">
              <span className="material-symbols-outlined text-[14px]">task_alt</span>
              <span>{totalTasks - tasksLeft}/{totalTasks} Tasks</span>
            </div>
            <span className="text-[9px] font-bold text-on-surface-variant tracking-wider uppercase">{tag}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkspaceCard;
