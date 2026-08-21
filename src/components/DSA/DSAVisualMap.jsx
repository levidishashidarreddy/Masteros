import React, { useState, useRef } from 'react';
import { DSA_CENTRAL_STORE } from '../../data/dsaCentralStore';

const DSAVisualMap = ({ onSelectTopic, completedConceptsMap }) => {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 40, y: 40 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.15, 2.0));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.15, 0.4));
  const handleResetZoom = () => {
    setZoom(1);
    setPan({ x: 40, y: 40 });
  };

  const handleMouseDown = (e) => {
    if (e.button !== 0) return; // Left click only
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStartRef.current.x,
      y: e.clientY - dragStartRef.current.y
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  // Helper to calculate phase progress
  const getPhaseProgress = (phase) => {
    let total = 0;
    let done = 0;
    phase.tracks.forEach(tr => {
      tr.subtracks.forEach(st => {
        st.concepts.forEach(c => {
          total++;
          if (completedConceptsMap?.[c.id]) done++;
        });
      });
    });
    return total > 0 ? Math.round((done / total) * 100) : 0;
  };

  return (
    <div className="relative w-full h-[650px] bg-[#0A0910] border border-white/10 rounded-2xl overflow-hidden select-none shadow-2xl">
      {/* Visual Canvas Controls Bar */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-surface/80 backdrop-blur-md p-1.5 rounded-xl border border-white/10 shadow-lg">
        <button
          onClick={handleZoomIn}
          className="p-2 rounded-lg text-on-surface-variant hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          title="Zoom In"
        >
          <span className="material-symbols-outlined text-sm">add</span>
        </button>
        <span className="text-xs font-mono font-bold text-primary px-1">
          {Math.round(zoom * 100)}%
        </span>
        <button
          onClick={handleZoomOut}
          className="p-2 rounded-lg text-on-surface-variant hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          title="Zoom Out"
        >
          <span className="material-symbols-outlined text-sm">remove</span>
        </button>
        <div className="w-[1px] h-4 bg-white/10 mx-1" />
        <button
          onClick={handleResetZoom}
          className="px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase text-on-surface-variant hover:text-white hover:bg-white/10 transition-colors cursor-pointer flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-xs">center_focus_strong</span>
          Fit Screen
        </button>
      </div>

      <div className="absolute top-4 right-4 z-20 px-3 py-1.5 rounded-xl bg-surface/80 backdrop-blur-md border border-white/10 text-xs font-semibold text-on-surface-variant flex items-center gap-2">
        <span className="material-symbols-outlined text-sm text-primary">drag_pan</span>
        Drag canvas to navigate
      </div>

      {/* Pannable & Zoomable Canvas Wrapper */}
      <div 
        className="w-full h-full cursor-grab active:cursor-grabbing overflow-hidden"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div 
          className="transition-transform duration-75 origin-top-left p-12 min-w-[1200px]"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`
          }}
        >
          {/* Main Root Mindmap Hub */}
          <div className="flex items-center gap-12">
            <div className="shrink-0 p-6 rounded-2xl bg-gradient-to-br from-primary/20 via-purple-600/20 to-surface border border-primary/40 shadow-[0_0_40px_rgba(139,92,246,0.15)] flex flex-col items-center justify-center text-center w-56">
              <span className="material-symbols-outlined text-3xl text-primary mb-2">account_tree</span>
              <h3 className="text-base font-extrabold text-white tracking-tight">DSA LEARNING ROADMAP</h3>
              <p className="text-[11px] text-on-surface-variant font-medium mt-1">Interactive Concept Tree</p>
            </div>

            {/* Tree Branch Lines & Phases Grid */}
            <div className="flex flex-col gap-10">
              {DSA_CENTRAL_STORE.phases.map((phase) => {
                const phasePct = getPhaseProgress(phase);
                return (
                  <div key={phase.id} className="relative flex items-center gap-8 group">
                    {/* Connecting horizontal line */}
                    <div className="w-8 h-[2px] bg-gradient-to-r from-primary/40 to-white/10 shrink-0" />

                    {/* Phase Node */}
                    <div className="shrink-0 w-72 p-4 rounded-xl bg-surface/70 border border-white/10 hover:border-primary/50 transition-all shadow-lg backdrop-blur-md">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                          {phase.title}
                        </span>
                        <span className="text-xs font-bold text-white bg-primary/20 px-2 py-0.5 rounded-full border border-primary/30">
                          {phasePct}%
                        </span>
                      </div>
                      <h4 className="text-xs font-medium text-on-surface-variant mt-1 line-clamp-1">{phase.description}</h4>
                      <div className="w-full bg-black/40 h-1.5 rounded-full overflow-hidden mt-2.5">
                        <div 
                          className="bg-gradient-to-r from-primary to-purple-400 h-full rounded-full transition-all duration-300"
                          style={{ width: `${phasePct}%` }}
                        />
                      </div>
                    </div>

                    {/* Tracks Children */}
                    <div className="flex flex-wrap items-center gap-3">
                      {phase.tracks.map((track) => (
                        <div
                          key={track.id}
                          onClick={() => onSelectTopic && onSelectTopic(track)}
                          className="p-3 rounded-xl bg-surface-bright/40 border border-white/5 hover:border-primary/40 hover:bg-primary/10 transition-all cursor-pointer shadow-md group/track flex items-center gap-2"
                        >
                          <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                          <span className="text-xs font-semibold text-white group-hover/track:text-primary transition-colors">
                            {track.title}
                          </span>
                          <span className="material-symbols-outlined text-xs text-on-surface-variant group-hover/track:translate-x-0.5 transition-transform">
                            chevron_right
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DSAVisualMap;
