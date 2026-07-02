import React, { useEffect, useState } from 'react';

const PandaLoader = ({ message = "Loading your productivity universe...", duration = 2500, onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let start = null;
    let animFrame = null;

    const step = (timestamp) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const calculatedProgress = Math.min((elapsed / duration) * 100, 100);

      setProgress(calculatedProgress);

      if (elapsed < duration) {
        animFrame = requestAnimationFrame(step);
      } else {
        if (onComplete) onComplete();
      }
    };

    animFrame = requestAnimationFrame(step);

    return () => {
      if (animFrame) cancelAnimationFrame(animFrame);
    };
  }, [duration, onComplete]);

  return (
    <div className="fixed inset-0 bg-[#07070a]/90 backdrop-blur-md flex flex-col items-center justify-center z-[200] animate-fade-in">
      <style>{`
        @keyframes panda-ear-l {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(-8deg); }
        }
        @keyframes panda-ear-r {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(8deg); }
        }
        @keyframes panda-breath {
          0%, 100% { transform: scale(1) translateY(0); }
          50% { transform: scale(1.02) translateY(-1px); }
        }
        @keyframes panda-blink {
          0%, 90%, 100% { transform: scaleY(1); }
          95% { transform: scaleY(0.1); }
        }
        @keyframes paw-shake {
          0%, 100% { transform: rotate(0deg) translateY(0); }
          50% { transform: rotate(-15deg) translateY(-2px); }
        }
        .panda-ear-l-anim {
          animation: panda-ear-l 1.5s infinite ease-in-out;
          transform-origin: 25px 25px;
        }
        .panda-ear-r-anim {
          animation: panda-ear-r 1.5s infinite ease-in-out;
          transform-origin: 75px 25px;
        }
        .panda-breath-anim {
          animation: panda-breath 3s infinite ease-in-out;
        }
        .panda-blink-anim {
          animation: panda-blink 4s infinite ease-in-out;
        }
        .panda-paw-anim {
          animation: paw-shake 0.8s infinite ease-in-out;
        }
      `}</style>

      <div className="flex flex-col items-center justify-center space-y-8 max-w-sm w-full px-6">
        {/* Logo and Panda Row */}
        <div className="flex items-center gap-4 bg-[#111118]/80 px-6 py-4 rounded-2xl border border-white/5 backdrop-blur-xl shadow-2xl">
          {/* MasterOS Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary border border-primary/20">
              <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                dashboard_customize
              </span>
            </div>
            <span className="font-display-lg text-sm font-bold text-white tracking-tight">
              Master<span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">OS</span>
            </span>
          </div>
          
          <span className="text-white/10">|</span>
          
          {/* SVG Panda */}
          <svg width="46" height="46" viewBox="0 0 100 100" style={{ overflow: 'visible' }}>
            {/* Left Ear */}
            <g className="panda-ear-l-anim">
              <circle cx="25" cy="25" r="14" fill="#181825" />
              <circle cx="25" cy="25" r="7"  fill="#0B0B10" />
            </g>

            {/* Right Ear */}
            <g className="panda-ear-r-anim">
              <circle cx="75" cy="25" r="14" fill="#181825" />
              <circle cx="75" cy="25" r="7"  fill="#0B0B10" />
            </g>

            {/* Face/Body */}
            <g className="panda-breath-anim" style={{ transformOrigin: '50px 55px' }}>
              <circle cx="50" cy="55" r="35" fill="#FAFAFD" />
              
              {/* Eye patches */}
              <ellipse cx="37" cy="53" rx="10" ry="12" fill="#181825" transform="rotate(-15 37 53)" />
              <ellipse cx="63" cy="53" rx="10" ry="12" fill="#181825" transform="rotate(15 63 53)" />

              {/* Blinking eyes */}
              <g className="panda-blink-anim" style={{ transformOrigin: '50px 53px' }}>
                <circle cx="38" cy="52" r="3" fill="#6366F1" />
                <circle cx="62" cy="52" r="3" fill="#6366F1" />
                <circle cx="39" cy="50.5" r="0.8" fill="#FFFFFF" />
                <circle cx="63" cy="50.5" r="0.8" fill="#FFFFFF" />
              </g>

              {/* Nose & Mouth */}
              <polygon points="48,58 52,58 50,61" fill="#181825" />
              <path
                d="M 47 64 Q 50 67 53 64"
                stroke="#181825"
                strokeWidth="2"
                fill="transparent"
                strokeLinecap="round"
              />

              {/* Rosy Cheeks */}
              <ellipse cx="23" cy="62" rx="4.5" ry="2.2" fill="#FDA4AF" opacity="0.5" />
              <ellipse cx="77" cy="62" rx="4.5" ry="2.2" fill="#FDA4AF" opacity="0.5" />
            </g>

            {/* Cute Playing Hand */}
            <g className="panda-paw-anim" style={{ transformOrigin: '78px 78px' }}>
              <circle cx="80" cy="74" r="8" fill="#181825" />
            </g>
          </svg>
        </div>

        {/* Progress Bar with Sliding Paw */}
        <div className="w-full text-center space-y-4">
          <div className="h-2 w-full bg-white/5 border border-white/5 rounded-full relative overflow-visible">
            <div 
              className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-75 rounded-full"
              style={{ width: `${progress}%` }}
            />
            {/* Playing paw sliding along progress */}
            <span 
              className="absolute -top-[14px] text-base transition-all duration-75 animate-bounce select-none pointer-events-none"
              style={{ left: `calc(${progress}% - 8px)` }}
            >
              🐾
            </span>
          </div>
          
          <div className="space-y-1">
            <p className="text-xs text-white font-bold tracking-wide transition-all animate-pulse">
              🐼 {message}
            </p>
            <p className="text-[10px] text-on-surface-variant font-bold tracking-widest uppercase">
              {Math.round(progress)}% loaded
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PandaLoader;
