import React from 'react';

const PandaCompanion = ({ onClick }) => {
  return (
    <div
      onClick={onClick}
      className="flex items-center justify-center w-[52px] h-[52px] rounded-xl border border-white/5 hover:border-primary/20 bg-[#111118]/80 hover:bg-[#151522]/90 transition-all cursor-pointer shadow-md shadow-black/40 group"
      title="Click me for AI companion!"
    >
      {/* Animated SVG Panda — fitted to sidebar rail */}
      <svg
        width="38"
        height="38"
        viewBox="0 0 100 100"
        className="animate-panda-sway"
        style={{ overflow: 'visible' }}
      >
        {/* Left Ear (Wiggle) */}
        <g className="animate-panda-ear-l">
          <circle cx="25" cy="25" r="15" fill="#1E1E2E" />
          <circle cx="25" cy="25" r="8"  fill="#08080C" />
        </g>

        {/* Right Ear (Wiggle) */}
        <g className="animate-panda-ear-r">
          <circle cx="75" cy="25" r="15" fill="#1E1E2E" />
          <circle cx="75" cy="25" r="8"  fill="#08080C" />
        </g>

        {/* Body / Face (Breathing) */}
        <g className="animate-panda-breath">
          {/* Head base */}
          <circle cx="50" cy="55" r="36" fill="#F8F8FC" />

          {/* Eye patches */}
          <ellipse cx="37" cy="52" rx="10" ry="13" fill="#1E1E2E" transform="rotate(-15 37 52)" />
          <ellipse cx="63" cy="52" rx="10" ry="13" fill="#1E1E2E" transform="rotate(15 63 52)" />

          {/* Blinking eyes */}
          <g className="animate-panda-blink">
            <circle cx="38" cy="51" r="4"   fill="#F8F8FC" />
            <circle cx="62" cy="51" r="4"   fill="#F8F8FC" />
            {/* Pupils — indigo accent */}
            <circle cx="38" cy="51" r="2.5" fill="#6366F1" />
            <circle cx="62" cy="51" r="2.5" fill="#6366F1" />
            {/* Reflections */}
            <circle cx="39.5" cy="49.5" r="1" fill="#FFFFFF" />
            <circle cx="63.5" cy="49.5" r="1" fill="#FFFFFF" />
          </g>

          {/* Nose */}
          <polygon points="47,58 53,58 50,62" fill="#1E1E2E" />

          {/* Mouth */}
          <path
            d="M 47 64 Q 50 68 53 64"
            stroke="#1E1E2E"
            strokeWidth="2"
            fill="transparent"
            strokeLinecap="round"
          />

          {/* Rosy cheeks */}
          <ellipse cx="24" cy="62" rx="5" ry="2.5" fill="#FDA4AF" opacity="0.45" />
          <ellipse cx="76" cy="62" rx="5" ry="2.5" fill="#FDA4AF" opacity="0.45" />
        </g>

        {/* Waving paw */}
        <g className="animate-panda-wave" style={{ transformOrigin: '78px 78px' }}>
          <circle cx="82" cy="74" r="9" fill="#1E1E2E" />
          <circle cx="82" cy="74" r="5" fill="#08080C" />
        </g>
      </svg>
    </div>
  );
};

export default PandaCompanion;
