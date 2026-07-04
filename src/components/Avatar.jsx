import React from 'react';

// ─── Default avatar paths (served from /public/avatars/) ──────────────────────
export const DEFAULT_AVATARS = [
  '/avatars/avatar1.svg',
  '/avatars/avatar2.svg',
  '/avatars/avatar3.svg',
  '/avatars/avatar4.svg',
  '/avatars/avatar5.svg',
  '/avatars/avatar6.svg',
];

// ─── Legacy preset IDs kept for backward-compat ───────────────────────────────
const PRESET_IDS = new Set(['tech', 'startup', 'design', 'ai', 'flow', 'fitness']);
const AVATAR_PRESETS = [
  { id: 'tech',    icon: 'developer_mode', bg: 'from-blue-500 to-indigo-600'   },
  { id: 'startup', icon: 'rocket_launch',  bg: 'from-amber-400 to-orange-600'  },
  { id: 'design',  icon: 'palette',        bg: 'from-pink-500 to-rose-600'     },
  { id: 'ai',      icon: 'psychology',     bg: 'from-purple-500 to-violet-600' },
  { id: 'flow',    icon: 'bolt',           bg: 'from-teal-400 to-emerald-600'  },
  { id: 'fitness', icon: 'fitness_center', bg: 'from-red-500 to-rose-700'      },
];

// ─── Unified avatar resolver ──────────────────────────────────────────────────
/**
 * getAvatar(profile) → string (URL or preset-id)
 * Priority: profilePicture → avatarUrl → selectedAvatar → default
 */
export function getAvatar(profile) {
  const v = profile?.profilePicture || profile?.avatarUrl || profile?.selectedAvatar;
  return v || DEFAULT_AVATARS[0];
}

// ─── Universal avatar renderer ────────────────────────────────────────────────
export function AvatarImg({ src, sizeCls = 'w-10 h-10', iconCls = 'text-base', className = '' }) {
  const preset = PRESET_IDS.has(src) ? AVATAR_PRESETS.find(p => p.id === src) : null;
  if (preset) {
    return (
      <div className={`${sizeCls} rounded-full bg-gradient-to-tr ${preset.bg} flex items-center justify-center text-white shrink-0 ${className}`}>
        <span className={`material-symbols-outlined ${iconCls} font-bold`}>{preset.icon}</span>
      </div>
    );
  }
  // URL or SVG path → <img>
  const resolvedSrc = (src && (src.startsWith('http') || src.startsWith('/') || src.startsWith('data:')))
    ? src
    : DEFAULT_AVATARS[0];
  return (
    <div className={`${sizeCls} rounded-full overflow-hidden shrink-0 bg-white/5 ${className}`}>
      <img
        src={resolvedSrc}
        alt="avatar"
        className="w-full h-full object-cover"
        onError={e => { e.target.src = DEFAULT_AVATARS[0]; }}
      />
    </div>
  );
}
