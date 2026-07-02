import React from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const Analytics = () => {
  return (
    <div className="flex min-h-screen bg-background text-on-surface radial-glow-bg select-none">
      <Sidebar />
      
      <main className="flex-grow p-8 overflow-y-auto no-scrollbar relative z-10 flex flex-col h-screen">
        <Header hideSearch={true} hideStreak={true} hideLogo={true} />
        
        <style>{`
          @keyframes radar-sweep {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes float-slow {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-8px); }
          }
          @keyframes bar-expand {
            0% { width: 0%; }
            100% { width: 68%; }
          }
        `}</style>

        <div className="w-full flex-grow flex items-center justify-center">
          
          <div className="max-w-xl mx-auto text-center space-y-8 animate-fade-in">
            {/* Badge */}
            <span className="inline-block bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest px-4.5 py-1.5 rounded-full shadow-[0_0_12px_rgba(139,92,246,0.15)]">
              Coming Soon
            </span>

            {/* Title */}
            <h2 className="font-display-lg text-[40px] text-white font-black tracking-tight leading-none">
              🚧 Analytics 2.0
            </h2>

            {/* Illustration */}
            <div className="relative w-72 h-72 mx-auto flex items-center justify-center bg-[#111118]/45 border border-white/5 rounded-full shadow-[0_0_50px_rgba(139,92,246,0.03)] style={{ animation: 'float-slow 6s ease-in-out infinite' }}">
              {/* Radar background grid lines */}
              <div className="absolute inset-4 rounded-full border border-white/[0.03]" />
              <div className="absolute inset-12 rounded-full border border-white/[0.04]" />
              <div className="absolute inset-20 rounded-full border border-white/[0.05]" />
              <div className="absolute inset-28 rounded-full border border-white/[0.06]" />
              
              {/* Sweep arm */}
              <div 
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{
                  background: 'conic-gradient(from 0deg at 50% 50%, rgba(139,92,246,0.12) 0deg, transparent 90deg)',
                  animation: 'radar-sweep 4s linear infinite'
                }}
              />

              {/* Pulsing nodes */}
              <div className="absolute w-2 h-2 rounded-full bg-primary animate-ping" style={{ top: '30%', left: '40%' }} />
              <div className="absolute w-2 h-2 rounded-full bg-primary" style={{ top: '30%', left: '40%' }} />
              
              {/* SVG animated chart lines */}
              <svg className="w-48 h-32 text-primary opacity-60 z-10" viewBox="0 0 100 50">
                <path 
                  d="M0 45 Q 25 15, 50 35 T 100 10" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2.5" 
                  strokeLinecap="round"
                />
                <path 
                  d="M0 45 Q 25 15, 50 35 T 100 10 L 100 50 L 0 50 Z" 
                  fill="url(#chart-glow-2)" 
                  opacity="0.15"
                />
                <defs>
                  <linearGradient id="chart-glow-2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8B5CF6" />
                    <stop offset="100%" stopColor="transparent" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* Description */}
            <p className="text-on-surface-variant text-sm leading-relaxed font-medium max-w-sm mx-auto">
              This feature is currently being redesigned and will be available in the next version.
            </p>

            {/* Progress Indicator */}
            <div className="w-64 mx-auto space-y-2.5">
              <div className="flex justify-between items-center text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">
                <span>Re-architecting</span>
                <span className="text-primary font-black">68%</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 border border-white/5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary to-secondary shadow-[0_0_10px_rgba(139,92,246,0.5)]" 
                  style={{ animation: 'bar-expand 2s cubic-bezier(0.4, 0, 0.2, 1) forwards' }}
                />
              </div>
            </div>
          </div>
          
        </div>
      </main>
    </div>
  );
};

export default Analytics;
