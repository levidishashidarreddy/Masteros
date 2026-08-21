import React from 'react';

const getResourceBadge = (type) => {
  switch (type) {
    case 'GitHub':
      return { icon: 'code', bg: 'bg-zinc-800 text-white border-zinc-700' };
    case 'YouTube':
      return { icon: 'play_circle', bg: 'bg-red-500/10 text-red-400 border-red-500/20' };
    case 'Practice':
      return { icon: 'terminal', bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' };
    default:
      return { icon: 'article', bg: 'bg-blue-500/10 text-blue-400 border-blue-500/20' };
  }
};

const ResourceListGroup = ({ title, preferenceLabel, badgeColor, items }) => {
  if (!items || items.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${badgeColor}`}>
          {preferenceLabel}
        </span>
      </div>
      <div className="grid grid-cols-1 gap-2.5">
        {items.map((res, index) => {
          const badge = getResourceBadge(res.type);
          return (
            <div 
              key={index}
              className="p-3.5 rounded-xl bg-surface-bright/40 border border-white/5 hover:border-primary/40 transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
            >
              <div className="flex items-start gap-3 min-w-0">
                <div className={`p-2 rounded-lg shrink-0 border ${badge.bg} flex items-center justify-center`}>
                  <span className="material-symbols-outlined text-base">{badge.icon}</span>
                </div>
                <div className="min-w-0">
                  <h5 className="text-sm font-semibold text-white group-hover:text-primary transition-colors truncate">
                    {res.title}
                  </h5>
                  {res.desc && (
                    <p className="text-xs text-on-surface-variant line-clamp-1 mt-0.5">
                      {res.desc}
                    </p>
                  )}
                </div>
              </div>

              <a
                href={res.link}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 px-3 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 hover:border-primary/40 text-xs font-bold transition-all flex items-center gap-1.5 self-end sm:self-center"
              >
                <span>Open Resource</span>
                <span className="material-symbols-outlined text-xs">open_in_new</span>
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const DSATopicDrawer = ({ isOpen, onClose, topicData, completedConceptsMap, onToggleConcept }) => {
  if (!isOpen || !topicData) return null;

  const resources = topicData.resources || {};
  const pref1 = resources.preference1 || [];
  const pref2 = resources.preference2 || [];
  const pref3 = resources.preference3 || [];
  const hasResources = pref1.length > 0 || pref2.length > 0 || pref3.length > 0;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 animate-fade-in"
        onClick={onClose}
      />

      {/* Drawer content */}
      <div className="relative w-full max-w-xl bg-[#0F0E17] border-l border-white/10 h-full shadow-2xl flex flex-col z-10 animate-slide-left">
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between shrink-0 bg-surface/50 backdrop-blur-md">
          <div className="min-w-0 pr-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
              {topicData.duration ? `Track Detail • ${topicData.duration}` : 'Topic Detail'}
            </span>
            <h3 className="text-xl font-bold text-white tracking-tight truncate mt-0.5">
              {topicData.title || topicData.name}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-on-surface-variant hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-grow overflow-y-auto p-6 space-y-8 no-scrollbar">
          {/* Track Description / Metadata */}
          {topicData.desc && (
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 text-xs text-on-surface-variant leading-relaxed">
              {topicData.desc}
            </div>
          )}

          {/* Subtracks / Concepts list */}
          {topicData.subtracks && topicData.subtracks.length > 0 && (
            <div className="space-y-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant flex items-center gap-2">
                <span className="material-symbols-outlined text-base text-primary">route</span>
                📚 Learning Path & Concepts
              </h4>

              <div className="space-y-4">
                {topicData.subtracks.map((sub, sIdx) => (
                  <div key={sub.id || sIdx} className="space-y-2.5 p-4 rounded-xl bg-surface/40 border border-white/5">
                    <h5 className="text-sm font-bold text-white flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                      {sub.title}
                    </h5>

                    <div className="space-y-2 pl-3 border-l border-white/10">
                      {sub.concepts.map((c) => {
                        const isDone = !!completedConceptsMap?.[c.id];
                        return (
                          <div 
                            key={c.id} 
                            className="p-3 rounded-lg bg-surface-bright/30 border border-white/5 hover:border-white/10 transition-all flex flex-col gap-2"
                          >
                            <div className="flex items-center justify-between gap-3">
                              <label className="flex items-center gap-3 cursor-pointer group min-w-0">
                                <input
                                  type="checkbox"
                                  checked={isDone}
                                  onChange={() => onToggleConcept && onToggleConcept(c.id)}
                                  className="w-4 h-4 rounded border-white/20 bg-black/40 text-primary focus:ring-primary focus:ring-offset-0 cursor-pointer"
                                />
                                <span className={`text-xs font-semibold ${isDone ? 'line-through text-on-surface-variant' : 'text-white'} group-hover:text-primary transition-colors truncate`}>
                                  {c.name}
                                </span>
                              </label>

                              <button
                                onClick={() => onToggleConcept && onToggleConcept(c.id)}
                                className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase transition-all shrink-0 ${
                                  isDone 
                                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                                    : 'bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20'
                                }`}
                              >
                                {isDone ? 'Completed' : 'Mark Complete'}
                              </button>
                            </div>

                            {c.learn && (
                              <p className="text-[11px] text-on-surface-variant pl-7 leading-relaxed">
                                • {c.learn}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Resources Section with Preference 1 / 2 / 3 */}
          {hasResources && (
            <div className="space-y-5 pt-4 border-t border-white/10">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant flex items-center gap-2">
                  <span className="material-symbols-outlined text-base text-yellow-400">auto_awesome</span>
                  📚 RESOURCES
                </h4>
                <span className="text-[10px] text-on-surface-variant">Hierarchical Preference</span>
              </div>

              <div className="space-y-6">
                <ResourceListGroup 
                  preferenceLabel="⭐ Preference 1 — Recommended"
                  badgeColor="bg-yellow-500/10 text-yellow-400 border-yellow-500/30"
                  items={pref1}
                />

                <ResourceListGroup 
                  preferenceLabel="🟡 Preference 2"
                  badgeColor="bg-blue-500/10 text-blue-400 border-blue-500/30"
                  items={pref2}
                />

                <ResourceListGroup 
                  preferenceLabel="🔴 Preference 3"
                  badgeColor="bg-zinc-500/10 text-zinc-400 border-zinc-500/30"
                  items={pref3}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DSATopicDrawer;
