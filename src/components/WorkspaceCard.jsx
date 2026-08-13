import React from 'react';
import { Link } from 'react-router-dom';

const CARD_LANG_THEMES = {
  cpp:          { gradientFrom: '#00243A', accent: '#00C8FF', iconSlug: 'cplusplus',   iconColor: '00C8FF', wordmark: 'C++' },
  c:            { gradientFrom: '#0D1E33', accent: '#5C9CD5', iconSlug: 'c',           iconColor: '5C9CD5', wordmark: 'C' },
  csharp:       { gradientFrom: '#150A2A', accent: '#512BD4', iconSlug: 'csharp',      iconColor: '512BD4', wordmark: 'C#' },
  python:       { gradientFrom: '#0A1A30', accent: '#3776AB', iconSlug: 'python',      iconColor: '3776AB', wordmark: 'Python' },
  java:         { gradientFrom: '#1E0E00', accent: '#ED8B00', iconSlug: 'openjdk',     iconColor: 'ED8B00', wordmark: 'Java' },
  javascript:   { gradientFrom: '#141200', accent: '#F7DF1E', iconSlug: 'javascript',  iconColor: 'F7DF1E', wordmark: 'JavaScript' },
  typescript:   { gradientFrom: '#050F1F', accent: '#3178C6', iconSlug: 'typescript',  iconColor: '3178C6', wordmark: 'TypeScript' },
  react:        { gradientFrom: '#001525', accent: '#61DAFB', iconSlug: 'react',       iconColor: '61DAFB', wordmark: 'React' },
  react_native: { gradientFrom: '#001525', accent: '#61DAFB', iconSlug: 'react',       iconColor: '61DAFB', wordmark: 'React Native' },
  node:         { gradientFrom: '#051005', accent: '#68A063', iconSlug: 'nodedotjs',   iconColor: '68A063', wordmark: 'Node.js' },
  html:         { gradientFrom: '#1A0400', accent: '#E34F26', iconSlug: 'html5',       iconColor: 'E34F26', wordmark: 'HTML5' },
  css:          { gradientFrom: '#00031A', accent: '#264DE4', iconSlug: 'css3',        iconColor: '264DE4', wordmark: 'CSS3' },
  sql:          { gradientFrom: '#00101A', accent: '#00758F', iconSlug: 'mysql',       iconColor: '00758F', wordmark: 'SQL' },
  mongodb:      { gradientFrom: '#051508', accent: '#47A248', iconSlug: 'mongodb',     iconColor: '47A248', wordmark: 'MongoDB' },
  aws:          { gradientFrom: '#100900', accent: '#FF9900', iconSlug: 'amazonaws',   iconColor: 'FF9900', wordmark: 'AWS' },
  docker:       { gradientFrom: '#000D1E', accent: '#2496ED', iconSlug: 'docker',      iconColor: '2496ED', wordmark: 'Docker' },
  kubernetes:   { gradientFrom: '#04102A', accent: '#326CE5', iconSlug: 'kubernetes',  iconColor: '326CE5', wordmark: 'Kubernetes' },
  git:          { gradientFrom: '#150200', accent: '#F05032', iconSlug: 'git',         iconColor: 'F05032', wordmark: 'Git' },
  flutter:      { gradientFrom: '#001020', accent: '#54C5F8', iconSlug: 'flutter',     iconColor: '54C5F8', wordmark: 'Flutter' },
  kotlin:       { gradientFrom: '#08001A', accent: '#7F52FF', iconSlug: 'kotlin',      iconColor: '7F52FF', wordmark: 'Kotlin' },
  swift:        { gradientFrom: '#180600', accent: '#F05138', iconSlug: 'swift',       iconColor: 'F05138', wordmark: 'Swift' },
  dart:         { gradientFrom: '#001220', accent: '#0175C2', iconSlug: 'dart',        iconColor: '0175C2', wordmark: 'Dart' },
  rust:         { gradientFrom: '#140400', accent: '#CE422B', iconSlug: 'rust',        iconColor: 'CE422B', wordmark: 'Rust' },
  go:           { gradientFrom: '#000E18', accent: '#00ACD7', iconSlug: 'go',          iconColor: '00ACD7', wordmark: 'Go' },
  angular:      { gradientFrom: '#1A0000', accent: '#DD0031', iconSlug: 'angular',     iconColor: 'DD0031', wordmark: 'Angular' },
  vue:          { gradientFrom: '#001A0A', accent: '#42B883', iconSlug: 'vuedotjs',    iconColor: '42B883', wordmark: 'Vue.js' },
  nextjs:       { gradientFrom: '#000000', accent: '#ffffff', iconSlug: 'nextdotjs',   iconColor: 'ffffff', wordmark: 'Next.js' },
  django:       { gradientFrom: '#04140D', accent: '#092E20', iconSlug: 'django',      iconColor: '44B78B', wordmark: 'Django' },
  spring_boot:  { gradientFrom: '#0B1A0A', accent: '#6DB33F', iconSlug: 'springboot',  iconColor: '6DB33F', wordmark: 'Spring Boot' },
  php:          { gradientFrom: '#0C0E20', accent: '#777BB4', iconSlug: 'php',         iconColor: '777BB4', wordmark: 'PHP' },
  ruby:         { gradientFrom: '#1A0404', accent: '#CC342D', iconSlug: 'ruby',        iconColor: 'CC342D', wordmark: 'Ruby' },
  tensorflow:   { gradientFrom: '#1C0A00', accent: '#FF6F00', iconSlug: 'tensorflow',  iconColor: 'FF6F00', wordmark: 'TensorFlow' },
  graphql:      { gradientFrom: '#1A0020', accent: '#E10098', iconSlug: 'graphql',     iconColor: 'E10098', wordmark: 'GraphQL' },
  linux:        { gradientFrom: '#0A0A00', accent: '#FCC624', iconSlug: 'linux',       iconColor: 'FCC624', wordmark: 'Linux' },
  default:      { gradientFrom: '#0D0822', accent: '#8B5CF6', iconSlug: null,          iconColor: '8B5CF6', wordmark: null },
};

const detectCardTheme = (technology, technologySlug, technologyId, tag, category, roadmaps) => {
  const target = (technology || technologySlug || technologyId || '').toLowerCase().trim();
  if (target) {
    if (target.includes('c++') || target === 'cpp' || target === 'cplusplus') return CARD_LANG_THEMES.cpp;
    if (target.includes('c#') || target === 'csharp' || target === 'cs') return CARD_LANG_THEMES.csharp;
    if (target === 'c' || target === 'c language') return CARD_LANG_THEMES.c;
    if (target.includes('python')) return CARD_LANG_THEMES.python;
    if (target.includes('javascript') || target === 'js') return CARD_LANG_THEMES.javascript;
    if (target.includes('typescript') || target === 'ts') return CARD_LANG_THEMES.typescript;
    if (target.includes('react native') || target === 'react_native') return CARD_LANG_THEMES.react_native;
    if (target.includes('react')) return CARD_LANG_THEMES.react;
    if (target.includes('node')) return CARD_LANG_THEMES.node;
    if (target.includes('next')) return CARD_LANG_THEMES.nextjs;
    if (target.includes('vue')) return CARD_LANG_THEMES.vue;
    if (target.includes('angular')) return CARD_LANG_THEMES.angular;
    if (target.includes('django')) return CARD_LANG_THEMES.django;
    if (target.includes('spring')) return CARD_LANG_THEMES.spring_boot;
    if (target.includes('docker')) return CARD_LANG_THEMES.docker;
    if (target.includes('kubernetes') || target.includes('k8s')) return CARD_LANG_THEMES.kubernetes;
    if (target.includes('aws') || target.includes('amazon')) return CARD_LANG_THEMES.aws;
    if (target.includes('flutter')) return CARD_LANG_THEMES.flutter;
    if (target.includes('sql') || target.includes('mysql') || target.includes('postgres') || target.includes('database')) return CARD_LANG_THEMES.sql;
    if (target.includes('mongo')) return CARD_LANG_THEMES.mongodb;
    if (target.includes('go') || target.includes('golang')) return CARD_LANG_THEMES.go;
    if (target.includes('rust')) return CARD_LANG_THEMES.rust;
    if (target.includes('php')) return CARD_LANG_THEMES.php;
    if (target.includes('ruby')) return CARD_LANG_THEMES.ruby;
    if (target.includes('kotlin')) return CARD_LANG_THEMES.kotlin;
    if (target.includes('swift')) return CARD_LANG_THEMES.swift;
    if (target.includes('dart')) return CARD_LANG_THEMES.dart;
    if (target.includes('html')) return CARD_LANG_THEMES.html;
    if (target.includes('css')) return CARD_LANG_THEMES.css;
    if (target.includes('git')) return CARD_LANG_THEMES.git;
    if (target.includes('tensorflow')) return CARD_LANG_THEMES.tensorflow;
    if (target.includes('graphql')) return CARD_LANG_THEMES.graphql;
    if (target.includes('linux')) return CARD_LANG_THEMES.linux;
    if (target.includes('java') && !target.includes('javascript')) return CARD_LANG_THEMES.java;
  }
  // Safe Fallback for older legacy workspace records that lack a technology property:
  // Check tag, category, or first roadmap track title (NEVER workspace title!)
  const fallbackStr = `${tag || ''} ${category || ''} ${roadmaps && roadmaps[0] ? roadmaps[0].title : ''}`.toLowerCase();
  if (fallbackStr) {
    if (fallbackStr.includes('c++') || fallbackStr.includes('cpp')) return CARD_LANG_THEMES.cpp;
    if (fallbackStr.includes('c#') || fallbackStr.includes('csharp')) return CARD_LANG_THEMES.csharp;
    if (fallbackStr.includes('python')) return CARD_LANG_THEMES.python;
    if (fallbackStr.includes('typescript') || /\bts\b/.test(fallbackStr)) return CARD_LANG_THEMES.typescript;
    if (fallbackStr.includes('javascript') || /\bjs\b/.test(fallbackStr)) return CARD_LANG_THEMES.javascript;
    if (fallbackStr.includes('react')) return CARD_LANG_THEMES.react;
    if (fallbackStr.includes('node')) return CARD_LANG_THEMES.node;
    if (fallbackStr.includes('next')) return CARD_LANG_THEMES.nextjs;
    if (fallbackStr.includes('vue')) return CARD_LANG_THEMES.vue;
    if (fallbackStr.includes('angular')) return CARD_LANG_THEMES.angular;
    if (fallbackStr.includes('django')) return CARD_LANG_THEMES.django;
    if (fallbackStr.includes('spring')) return CARD_LANG_THEMES.spring_boot;
    if (fallbackStr.includes('docker')) return CARD_LANG_THEMES.docker;
    if (fallbackStr.includes('kubernetes')) return CARD_LANG_THEMES.kubernetes;
    if (fallbackStr.includes('aws')) return CARD_LANG_THEMES.aws;
    if (fallbackStr.includes('flutter')) return CARD_LANG_THEMES.flutter;
    if (fallbackStr.includes('sql') || fallbackStr.includes('mysql')) return CARD_LANG_THEMES.sql;
    if (fallbackStr.includes('mongo')) return CARD_LANG_THEMES.mongodb;
    if (fallbackStr.includes('rust')) return CARD_LANG_THEMES.rust;
    if (fallbackStr.includes('go')) return CARD_LANG_THEMES.go;
    if (fallbackStr.includes('php')) return CARD_LANG_THEMES.php;
    if (fallbackStr.includes('ruby')) return CARD_LANG_THEMES.ruby;
    if (fallbackStr.includes('kotlin')) return CARD_LANG_THEMES.kotlin;
    if (fallbackStr.includes('swift')) return CARD_LANG_THEMES.swift;
    if (fallbackStr.includes('dart')) return CARD_LANG_THEMES.dart;
    if (fallbackStr.includes('html')) return CARD_LANG_THEMES.html;
    if (fallbackStr.includes('css')) return CARD_LANG_THEMES.css;
    if (fallbackStr.includes('git')) return CARD_LANG_THEMES.git;
    if (fallbackStr.includes('java') && !fallbackStr.includes('javascript')) return CARD_LANG_THEMES.java;
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
  const lang = detectCardTheme(technology, technologySlug, technologyId, tag, category, roadmaps);
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
          style={{ background: `radial-gradient(ellipse at 85% 10%, ${lang.accent}15 0%, transparent 50%)` }}
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
          style={{ background: `linear-gradient(90deg, transparent, ${lang.accent}28, transparent)` }}
        />
        {/* Fade into card body */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#111118]/55 pointer-events-none" />

        {/* Centred technology logo */}
        <div className="absolute inset-0 flex items-center justify-center">
          {iconUrl ? (
            <img
              src={iconUrl}
              alt={lang.wordmark || title}
              className="w-[42px] h-[42px] object-contain select-none group-hover:scale-110 group-hover:brightness-125 transition-all duration-300 ease-out"
              draggable={false}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                if (e.currentTarget.nextSibling) e.currentTarget.nextSibling.style.removeProperty('display');
              }}
            />
          ) : null}
          <span
            className="material-symbols-outlined text-4xl group-hover:scale-110 transition-transform duration-300"
            style={{ color: lang.accent, display: iconUrl ? 'none' : 'block', fontVariationSettings: "'FILL' 1" }}
          >
            {icon}
          </span>
        </div>

        {/* Language wordmark chip */}
        {lang.wordmark && (
          <div className="absolute bottom-2 left-3 z-10">
            <span
              className="font-mono text-[7.5px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border"
              style={{ color: lang.accent, background: `${lang.accent}0E`, borderColor: `${lang.accent}22` }}
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
                {icon}
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
