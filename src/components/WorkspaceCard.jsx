import React from 'react';
import { Link } from 'react-router-dom';

const CARD_LANG_THEMES = {
  cpp:        { gradientFrom: '#00243A', accent: '#00C8FF', iconSlug: 'cplusplus',   iconColor: '00C8FF', wordmark: 'C++' },
  c:          { gradientFrom: '#0D1E33', accent: '#5C9CD5', iconSlug: 'c',           iconColor: '5C9CD5', wordmark: 'C' },
  python:     { gradientFrom: '#0A1A30', accent: '#4B8BBE', iconSlug: 'python',      iconColor: '4B8BBE', wordmark: 'Python' },
  java:       { gradientFrom: '#1E0E00', accent: '#ED8B00', iconSlug: 'openjdk',     iconColor: 'ED8B00', wordmark: 'Java' },
  javascript: { gradientFrom: '#141200', accent: '#F7DF1E', iconSlug: 'javascript',  iconColor: 'F7DF1E', wordmark: 'JavaScript' },
  typescript: { gradientFrom: '#050F1F', accent: '#3178C6', iconSlug: 'typescript',  iconColor: '3178C6', wordmark: 'TypeScript' },
  react:      { gradientFrom: '#001525', accent: '#61DAFB', iconSlug: 'react',       iconColor: '61DAFB', wordmark: 'React' },
  node:       { gradientFrom: '#051005', accent: '#68A063', iconSlug: 'nodedotjs',   iconColor: '68A063', wordmark: 'Node.js' },
  html:       { gradientFrom: '#1A0400', accent: '#E34F26', iconSlug: 'html5',       iconColor: 'E34F26', wordmark: 'HTML5' },
  css:        { gradientFrom: '#00031A', accent: '#264DE4', iconSlug: 'css3',        iconColor: '264DE4', wordmark: 'CSS3' },
  sql:        { gradientFrom: '#00101A', accent: '#00758F', iconSlug: 'mysql',       iconColor: '00758F', wordmark: 'SQL' },
  aws:        { gradientFrom: '#100900', accent: '#FF9900', iconSlug: 'amazonaws',   iconColor: 'FF9900', wordmark: 'AWS' },
  docker:     { gradientFrom: '#000D1E', accent: '#2496ED', iconSlug: 'docker',      iconColor: '2496ED', wordmark: 'Docker' },
  git:        { gradientFrom: '#150200', accent: '#F05032', iconSlug: 'git',         iconColor: 'F05032', wordmark: 'Git' },
  flutter:    { gradientFrom: '#001020', accent: '#54C5F8', iconSlug: 'flutter',     iconColor: '54C5F8', wordmark: 'Flutter' },
  kotlin:     { gradientFrom: '#08001A', accent: '#7F52FF', iconSlug: 'kotlin',      iconColor: '7F52FF', wordmark: 'Kotlin' },
  swift:      { gradientFrom: '#180600', accent: '#F05138', iconSlug: 'swift',       iconColor: 'F05138', wordmark: 'Swift' },
  rust:       { gradientFrom: '#140400', accent: '#CE422B', iconSlug: 'rust',        iconColor: 'CE422B', wordmark: 'Rust' },
  go:         { gradientFrom: '#000E18', accent: '#00ACD7', iconSlug: 'go',          iconColor: '00ACD7', wordmark: 'Go' },
  angular:    { gradientFrom: '#1A0000', accent: '#DD0031', iconSlug: 'angular',     iconColor: 'DD0031', wordmark: 'Angular' },
  vue:        { gradientFrom: '#001A0A', accent: '#42B883', iconSlug: 'vuedotjs',    iconColor: '42B883', wordmark: 'Vue.js' },
  nextjs:     { gradientFrom: '#000000', accent: '#999999', iconSlug: 'nextdotjs',   iconColor: 'ffffff', wordmark: 'Next.js' },
  graphql:    { gradientFrom: '#1A0020', accent: '#E10098', iconSlug: 'graphql',     iconColor: 'E10098', wordmark: 'GraphQL' },
  linux:      { gradientFrom: '#0A0A00', accent: '#FCC624', iconSlug: 'linux',       iconColor: 'FCC624', wordmark: 'Linux' },
  default:    { gradientFrom: '#0D0822', accent: '#8B5CF6', iconSlug: null,          iconColor: '8B5CF6', wordmark: null },
};

const detectCardTheme = (title, tag) => {
  const txt = ((title || '') + ' ' + (tag || '')).toLowerCase();
  if (txt.includes('c++') || txt.includes('cpp'))                          return CARD_LANG_THEMES.cpp;
  if (txt.includes('typescript') || /\bts\b/.test(txt))                    return CARD_LANG_THEMES.typescript;
  if (txt.includes('next.js') || txt.includes('nextjs'))                   return CARD_LANG_THEMES.nextjs;
  if (txt.includes('javascript') || /\bjs\b/.test(txt))                    return CARD_LANG_THEMES.javascript;
  if (txt.includes('react'))                                                return CARD_LANG_THEMES.react;
  if (txt.includes('node'))                                                 return CARD_LANG_THEMES.node;
  if (txt.includes('vue'))                                                  return CARD_LANG_THEMES.vue;
  if (txt.includes('angular'))                                              return CARD_LANG_THEMES.angular;
  if (txt.includes('graphql'))                                              return CARD_LANG_THEMES.graphql;
  if (txt.includes('python'))                                               return CARD_LANG_THEMES.python;
  if (txt.includes('html'))                                                 return CARD_LANG_THEMES.html;
  if (txt.includes('css') && !txt.includes('success'))                     return CARD_LANG_THEMES.css;
  if (txt.includes('java') && !txt.includes('javascript'))                  return CARD_LANG_THEMES.java;
  if (txt.includes('sql') || txt.includes('mysql') || txt.includes('postgres') || txt.includes('database')) return CARD_LANG_THEMES.sql;
  if (txt.includes('aws') || txt.includes('amazon web'))                   return CARD_LANG_THEMES.aws;
  if (txt.includes('docker') || txt.includes('container'))                 return CARD_LANG_THEMES.docker;
  if (txt.includes('flutter'))                                              return CARD_LANG_THEMES.flutter;
  if (txt.includes('kotlin'))                                               return CARD_LANG_THEMES.kotlin;
  if (txt.includes('swift'))                                                return CARD_LANG_THEMES.swift;
  if (txt.includes('rust'))                                                 return CARD_LANG_THEMES.rust;
  if (txt.includes('linux'))                                                return CARD_LANG_THEMES.linux;
  if (txt.includes('golang') || /\bgo\b/.test(txt))                        return CARD_LANG_THEMES.go;
  if (txt.includes('git'))                                                  return CARD_LANG_THEMES.git;
  if (/\bc\b/.test(txt) || txt.includes('c language'))                     return CARD_LANG_THEMES.c;
  return CARD_LANG_THEMES.default;
};

const WorkspaceCard = ({
  id,
  title,
  description,
  tag,
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
  const lang = detectCardTheme(title, tag);
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
