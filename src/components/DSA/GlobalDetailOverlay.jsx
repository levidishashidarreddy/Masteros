import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';

/**
 * GlobalDetailOverlay
 * Portal-based viewport-level right-side drawer with 100% full-screen translucent backdrop blur,
 * background body scroll locking, sticky header, and structured resource preferences.
 */
const GlobalDetailOverlay = ({
  isOpen,
  onClose,
  data,
  completedConceptsMap = {},
  onToggleConcept
}) => {
  // Lock background body scroll when overlay is open and restore position on close
  useEffect(() => {
    if (!isOpen) return;

    const scrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      window.scrollTo(0, scrollY);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !data) return null;

  // Normalize data fields regardless of whether input came from a Track, Data Structure, Algorithm, or Pattern
  const title = data.title || data.name || 'Details';
  const subtitle = data.subtitle || data.dayRange || data.duration || data.category || '';
  const description = data.desc || data.description || data.whenToIdentify || data.coreLogic || '';
  const timeComp = data.timeComplexity || data.time || '';
  const spaceComp = data.spaceComplexity || data.space || '';
  const resources = data.resources || {};
  const preference1 = resources.preference1 || [];
  const preference2 = resources.preference2 || [];
  const preference3 = resources.preference3 || [];

  // Extract subtracks/concepts if available
  const subtracks = data.subtracks || [];
  const directConcepts = data.concepts || [];

  return createPortal(
    <div className="fixed inset-0 w-screen h-[100dvh] z-[9999] flex justify-end select-none animate-fade-in">
      {/* 100% Viewport Translucent Backdrop with Uniform Blur */}
      <div 
        onClick={onClose}
        className="fixed inset-0 w-screen h-[100dvh] bg-black/75 backdrop-blur-md transition-opacity duration-300"
      />

      {/* Viewport-Level Desktop Side Drawer / Mobile Sheet */}
      <div className="relative z-10 w-full sm:w-[520px] md:w-[560px] max-w-full h-[100dvh] bg-[#0C0B14] border-l border-white/10 shadow-2xl flex flex-col justify-between overflow-hidden animate-slide-left">
        
        {/* ─── STICKY HEADER ───────────────────────────────────────────── */}
        <div className="p-4 sm:p-5 md:p-6 bg-surface/90 backdrop-blur-xl border-b border-white/10 shrink-0 flex items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            {subtitle && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20 block w-max max-w-full truncate mb-1">
                {subtitle}
              </span>
            )}
            <h2 className="text-base sm:text-lg md:text-xl font-extrabold text-white tracking-tight truncate">
              {title}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-xl bg-surface-bright/50 border border-white/10 hover:bg-white/10 text-on-surface-variant hover:text-white transition-all cursor-pointer shrink-0 active:scale-95"
            title="Close Drawer (Esc)"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* ─── SCROLLABLE DRAWER BODY ──────────────────────────────────── */}
        <div className="flex-grow overflow-y-auto p-5 md:p-6 space-y-6 no-scrollbar">
          
          {/* Complexity Badges if available */}
          {(timeComp || spaceComp) && (
            <div className="grid grid-cols-2 gap-3">
              {timeComp && (
                <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 space-y-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Time Complexity</span>
                  <div className="text-xs font-mono font-bold text-white">{timeComp}</div>
                </div>
              )}
              {spaceComp && (
                <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 space-y-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300">Space Complexity</span>
                  <div className="text-xs font-mono font-bold text-white">{spaceComp}</div>
                </div>
              )}
            </div>
          )}

          {/* Description Overview */}
          {description && (
            <div className="space-y-1.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Overview</h3>
              <p className="text-xs text-white/90 leading-relaxed p-3.5 rounded-xl bg-surface/50 border border-white/5">
                {description}
              </p>
            </div>
          )}

          {/* Template Code if present */}
          {data.templateCode && (
            <div className="space-y-1.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Pattern Template</h3>
              <pre className="p-4 rounded-xl bg-black/80 border border-white/10 text-xs font-mono text-emerald-300 overflow-x-auto">
                {data.templateCode}
              </pre>
            </div>
          )}

          {/* Subtracks / Concepts Hierarchy */}
          {subtracks.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm">account_tree</span>
                Curriculum Hierarchy & Concepts
              </h3>

              <div className="space-y-4">
                {subtracks.map((st) => (
                  <div key={st.id} className="p-4 rounded-xl bg-surface/40 border border-white/5 space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-white border-b border-white/5 pb-2">
                      {st.title}
                    </h4>

                    <div className="space-y-2">
                      {st.concepts.map((c) => {
                        const isChecked = !!completedConceptsMap[c.id];
                        return (
                          <label 
                            key={c.id}
                            className={`p-2.5 rounded-lg border transition-all flex items-start gap-3 cursor-pointer select-none ${
                              isChecked 
                                ? 'bg-emerald-500/10 border-emerald-500/30 text-on-surface-variant' 
                                : 'bg-black/30 border-white/5 hover:border-primary/40 text-white'
                            }`}
                          >
                            <input 
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => onToggleConcept && onToggleConcept(c.id)}
                              className="w-4 h-4 rounded border-white/20 bg-black/40 text-primary focus:ring-primary focus:ring-offset-0 cursor-pointer mt-0.5 shrink-0"
                            />
                            <div className="min-w-0">
                              <span className={`text-xs font-semibold block ${isChecked ? 'line-through text-on-surface-variant' : 'text-white'}`}>
                                {c.name}
                              </span>
                              {c.learn && (
                                <span className="text-[10px] text-on-surface-variant block mt-0.5">
                                  {c.learn}
                                </span>
                              )}
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Direct Concepts list if present */}
          {directConcepts.length > 0 && subtracks.length === 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-primary">Concepts Checklist</h3>
              <div className="space-y-2">
                {directConcepts.map((c) => {
                  const isChecked = !!completedConceptsMap[c.id];
                  return (
                    <label 
                      key={c.id}
                      className={`p-2.5 rounded-lg border transition-all flex items-start gap-3 cursor-pointer select-none ${
                        isChecked 
                          ? 'bg-emerald-500/10 border-emerald-500/30' 
                          : 'bg-black/30 border-white/5 hover:border-primary/40 text-white'
                      }`}
                    >
                      <input 
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => onToggleConcept && onToggleConcept(c.id)}
                        className="w-4 h-4 rounded border-white/20 bg-black/40 text-primary focus:ring-primary focus:ring-offset-0 cursor-pointer mt-0.5 shrink-0"
                      />
                      <span className={`text-xs font-semibold ${isChecked ? 'line-through text-on-surface-variant' : 'text-white'}`}>
                        {c.name || c.title}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* 📚 RESOURCES SECTION */}
          {(preference1.length > 0 || preference2.length > 0 || preference3.length > 0) && (
            <div className="space-y-4 pt-4 border-t border-white/10">
              <h3 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm">auto_awesome</span>
                📚 RESOURCES & REFERENCES
              </h3>

              {/* Preference 1 ⭐ */}
              {preference1.length > 0 && (
                <div className="space-y-2 p-3.5 rounded-xl bg-yellow-500/5 border border-yellow-500/20">
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 inline-block mb-1">
                    ⭐ Preference 1 — Recommended
                  </span>
                  {preference1.map((r, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-black/40 border border-white/5 space-y-1">
                      <h4 className="text-xs font-bold text-white">{r.title}</h4>
                      {r.why && <p className="text-[10px] text-on-surface-variant">{r.why}</p>}
                      <a 
                        href={r.link} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-primary hover:underline pt-1"
                      >
                        Open Resource <span className="material-symbols-outlined text-xs">open_in_new</span>
                      </a>
                    </div>
                  ))}
                </div>
              )}

              {/* Preference 2 🟡 */}
              {preference2.length > 0 && (
                <div className="space-y-2 p-3.5 rounded-xl bg-blue-500/5 border border-blue-500/20">
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/30 inline-block mb-1">
                    🟡 Preference 2
                  </span>
                  {preference2.map((r, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-black/40 border border-white/5 space-y-1">
                      <h4 className="text-xs font-bold text-white">{r.title}</h4>
                      {r.why && <p className="text-[10px] text-on-surface-variant">{r.why}</p>}
                      <a 
                        href={r.link} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-400 hover:underline pt-1"
                      >
                        Open Resource <span className="material-symbols-outlined text-xs">open_in_new</span>
                      </a>
                    </div>
                  ))}
                </div>
              )}

              {/* Preference 3 🔴 */}
              {preference3.length > 0 && (
                <div className="space-y-2 p-3.5 rounded-xl bg-zinc-500/5 border border-zinc-500/20">
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-zinc-500/10 text-zinc-400 border border-zinc-500/30 inline-block mb-1">
                    🔴 Preference 3
                  </span>
                  {preference3.map((r, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-black/40 border border-white/5 space-y-1">
                      <h4 className="text-xs font-bold text-white">{r.title}</h4>
                      {r.why && <p className="text-[10px] text-on-surface-variant">{r.why}</p>}
                      <a 
                        href={r.link} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-zinc-300 hover:underline pt-1"
                      >
                        Open Resource <span className="material-symbols-outlined text-xs">open_in_new</span>
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ─── DRAWER FOOTER ───────────────────────────────────────────── */}
        <div className="p-4 bg-surface/90 border-t border-white/10 shrink-0 flex items-center justify-between">
          <span className="text-[10px] text-on-surface-variant font-mono">MasterOS DSA Learning Drawer</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-primary text-on-primary font-bold text-xs hover:bg-primary/90 transition-all cursor-pointer shadow-lg"
          >
            Done
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default GlobalDetailOverlay;
