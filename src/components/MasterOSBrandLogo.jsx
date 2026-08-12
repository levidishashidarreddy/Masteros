import React from 'react';

/**
 * MasterOSBrandLogo
 *
 * The canonical MasterOS "M" lettermark — a stylised two-tone M with a purple
 * diagonal accent slash on the inner-right leg, matching the app splash screen.
 *
 * Props:
 *   size      — height of the SVG mark in pixels (default 32)
 *   showText  — whether to render "MasterOS" wordmark beside the mark (default false)
 *   className — extra class names for the wrapper element
 *   onClick   — optional click handler
 */
const MasterOSBrandLogo = ({ size = 32, showText = false, className = '', onClick }) => {
  // The mark is always square, so width = size
  const markSize = size;

  return (
    <div
      className={`flex items-center gap-2 shrink-0 ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      <img
        src="/brand/masteros-logo.svg"
        alt="MasterOS logo"
        style={{
          width: markSize,
          height: markSize,
          display: 'block',
          flexShrink: 0,
          objectFit: 'contain'
        }}
        draggable={false}
      />

      {/* ── Optional Wordmark ── */}
      {showText && (
        <span
          className="font-black tracking-tight text-white select-none leading-none"
          style={{ fontSize: markSize * 0.44 }}
        >
          Master
          <span className="bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] bg-clip-text text-transparent">
            OS
          </span>
        </span>
      )}
    </div>
  );
};

export default MasterOSBrandLogo;
