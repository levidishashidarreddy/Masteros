import React from 'react';
import { useNavigate } from 'react-router-dom';
import ShaderBackground from '../components/ShaderBackground';
import ThreeJSAnimation from '../components/ThreeJSAnimation';
import Button from '../components/Button';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen text-on-surface flex flex-col justify-between selection:bg-primary/30 radial-glow-bg">
      {/* Top Navbar */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-xl bg-background/60 border-b border-white/5 shadow-2xl">
        <div className="max-w-[1200px] mx-auto px-margin-desktop h-20 flex justify-between items-center">
          <div className="flex items-center gap-12">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary-container rounded-lg flex items-center justify-center text-primary shadow-[0_0_15px_rgba(139,92,246,0.25)] border border-primary/20">
                <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  dashboard_customize
                </span>
              </div>
              <span className="font-display-lg text-[22px] leading-tight font-bold tracking-tight text-white">
                Master<span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">OS</span>
              </span>
            </div>
            <div className="hidden md:flex gap-8">
              <a className="text-primary font-bold border-b border-primary pb-1 font-body-md text-sm transition-all" href="#features">Features</a>
              <a className="text-on-surface-variant font-medium font-body-md text-sm hover:text-white transition-colors" href="#how-it-works">How It Works</a>
              <a className="text-on-surface-variant font-medium font-body-md text-sm hover:text-white transition-colors" href="#social">Proof of Work</a>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/auth')}
              className="hidden md:block text-on-surface-variant font-medium font-body-md text-sm px-4 py-2 hover:text-white transition-colors active:scale-95 cursor-pointer"
            >
              Sign In
            </button>
            <Button variant="primary" onClick={() => navigate('/auth')}>
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-32 pb-20 px-margin-mobile md:px-0">
        <ShaderBackground type="landing" />

        {/* Ambient radial blur top glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60vw] h-[50vh] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="z-10 text-center max-w-4xl mx-auto px-4 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 mb-4 animate-text-reveal" style={{ animationDelay: '0.1s' }}>
            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_#8B5CF6]"></span>
            <span className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-widest text-[10px] font-bold">
              The operating system for ambitious builders
            </span>
          </div>

          <h1 className="font-display-lg text-[44px] leading-[1.1] md:text-[72px] md:leading-[1.05] tracking-tight text-white font-black animate-text-reveal" style={{ animationDelay: '0.2s' }}>
            Track your learning, projects,<br />
            goals, and growth — <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">all in one place.</span>
          </h1>

          <p className="font-body-lg text-on-surface-variant max-w-2xl mx-auto mb-10 text-base leading-relaxed animate-text-reveal" style={{ animationDelay: '0.3s' }}>
            Outpero-inspired elegant workspace. Transform chaotic inspiration into actionable roadmaps, beautiful milestones, and verifiable proof of progress.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-text-reveal" style={{ animationDelay: '0.4s' }}>
            <Button variant="primary" className="px-8 py-3.5 text-base" onClick={() => navigate('/auth')}>
              Get Started for Free
            </Button>
            <a href="#features">
              <Button variant="secondary" className="px-8 py-3.5 text-base w-full">
                Explore Demo
              </Button>
            </a>
          </div>
        </div>

        {/* Hero Scene Container */}
        <div className="relative w-full max-w-[1000px] mx-auto h-[480px] mt-16 rounded-2xl overflow-hidden glass-panel p-[1px] shadow-2xl animate-text-reveal" style={{ animationDelay: '0.5s' }}>
          <div className="absolute inset-0 w-full h-full">
            <ThreeJSAnimation />
          </div>

          {/* Outpero radial lighting overlays inside container */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#07070A]/90 pointer-events-none" />

          {/* Dashboard Overlay Mockup */}
          <div className="absolute bottom-6 left-6 right-6 h-40 rounded-xl bg-[#0D0D14]/85 backdrop-blur-xl border border-white/5 p-6 flex gap-6 overflow-hidden z-10">
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <div className="text-[10px] font-label-sm text-on-surface-variant uppercase tracking-widest font-semibold mb-1">
                  Weekly Momentum
                </div>
                <div className="text-2xl font-bold flex items-center gap-2 text-white">
                  14 Days{' '}
                  <span className="material-symbols-outlined text-primary shadow-[0_0_10px_rgba(139,92,246,0.4)]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    local_fire_department
                  </span>
                </div>
              </div>
              <div className="h-10 flex items-end gap-2">
                <div className="flex-1 bg-primary/10 rounded-t h-[30%]"></div>
                <div className="flex-1 bg-primary/10 rounded-t h-[45%]"></div>
                <div className="flex-1 bg-primary/10 rounded-t h-[20%]"></div>
                <div className="flex-1 bg-primary/30 rounded-t h-[60%]"></div>
                <div className="flex-1 bg-primary/50 rounded-t h-[85%]"></div>
                <div className="flex-1 bg-primary rounded-t h-[100%] shadow-[0_0_12px_rgba(139,92,246,0.3)]"></div>
                <div className="flex-1 bg-primary/10 rounded-t h-[10%]"></div>
              </div>
            </div>
            <div className="w-[1px] bg-white/5 h-full"></div>
            <div className="w-1/3 flex flex-col justify-between">
              <div>
                <div className="text-[10px] font-label-sm text-on-surface-variant uppercase tracking-widest font-semibold mb-2">
                  Active Roadmap: AI Core
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="w-[72%] h-full bg-primary shadow-[0_0_8px_rgba(139,92,246,0.4)]"></div>
                </div>
                <div className="flex justify-between mt-2 text-[10px] font-semibold text-on-surface-variant">
                  <span>72% Complete</span>
                  <span>12 Tasks Left</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-28 px-margin-mobile md:px-0 relative overflow-hidden">
        {/* Ambient background blur circles */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[35vw] h-[35vh] bg-secondary/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-1/3 right-0 -translate-y-1/2 w-[40vw] h-[40vh] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-[1200px] mx-auto relative z-10">
          <div className="mb-20 text-center md:text-left">
            <h2 className="font-display-lg text-[36px] md:text-[48px] font-bold mb-4 text-white">
              Precision Tools for Modern Builders
            </h2>
            <p className="text-on-surface-variant font-body-md text-base max-w-xl">
              Every detail has been calibrated to minimize friction, support focus, and scale your personal velocity.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="group glass-panel p-8 rounded-2xl">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform shadow-[inset_0_0_12px_rgba(139,92,246,0.15)] border border-primary/20">
                <span className="material-symbols-outlined text-2xl">school</span>
              </div>
              <h3 className="font-headline-md mb-3 text-lg text-white font-bold">Learning Tracker</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed">
                Centralize courses, articles, books, and courses. Track syllabus progress and concepts in real-time.
              </p>
            </div>
            <div className="group glass-panel p-8 rounded-2xl">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform shadow-[inset_0_0_12px_rgba(139,92,246,0.15)] border border-primary/20">
                <span className="material-symbols-outlined text-2xl">psychology</span>
              </div>
              <h3 className="font-headline-md mb-3 text-lg text-white font-bold">AI Roadmap Builder</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed">
                Describe your target path and let our AI engine draft your personal milestones, timelines, and resource guides.
              </p>
            </div>
            <div className="group glass-panel p-8 rounded-2xl">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform shadow-[inset_0_0_12px_rgba(139,92,246,0.15)] border border-primary/20">
                <span className="material-symbols-outlined text-2xl">layers</span>
              </div>
              <h3 className="font-headline-md mb-3 text-lg text-white font-bold">Project Hub</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed">
                Track issues, code PRs, features, and roadmaps in a lightweight, keyboard-friendly card board.
              </p>
            </div>
            <div className="group glass-panel p-8 rounded-2xl">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform shadow-[inset_0_0_12px_rgba(139,92,246,0.15)] border border-primary/20">
                <span className="material-symbols-outlined text-2xl">target</span>
              </div>
              <h3 className="font-headline-md mb-3 text-lg text-white font-bold">Goal Architecture</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed">
                Connect daily habits directly with long-term OKRs. Know exactly how today's session affects your ultimate goals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-28 relative overflow-hidden bg-[#0D0D14]/30 border-y border-white/5">
        <div className="max-w-[1200px] mx-auto px-margin-desktop relative z-10">
          <h2 className="font-display-lg text-[36px] md:text-[48px] text-center mb-24 text-white font-bold">
            Your Path to Mastery
          </h2>
          <div className="relative flex flex-col md:flex-row justify-between items-start gap-12">
            
            {/* Step 1 */}
            <div className="flex-1 flex flex-col items-center text-center group">
              <div className="w-20 h-20 rounded-full bg-surface border border-white/5 flex items-center justify-center mb-8 relative transition-colors group-hover:border-primary/30 shadow-lg">
                <span className="font-display-lg text-primary text-2xl font-bold group-hover:scale-110 transition-transform">1</span>
                <div className="absolute inset-0 bg-primary/5 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
              <h3 className="font-headline-md text-[20px] mb-4 text-white font-semibold">Create Workspace</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed max-w-xs">
                Set up your dashboard context. Initialize learning courses or import code issues in a clean layout.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex-1 flex flex-col items-center text-center group">
              <div className="w-20 h-20 rounded-full bg-surface border border-white/5 flex items-center justify-center mb-8 relative transition-colors group-hover:border-primary/30 shadow-lg">
                <span className="font-display-lg text-primary text-2xl font-bold group-hover:scale-110 transition-transform">2</span>
                <div className="absolute inset-0 bg-primary/5 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
              <h3 className="font-headline-md text-[20px] mb-4 text-white font-semibold">Build Roadmap</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed max-w-xs">
                Create steps or generate them using our AI partner. Set your target milestone dates and commitment slider.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex-1 flex flex-col items-center text-center group">
              <div className="w-20 h-20 rounded-full bg-surface border border-white/5 flex items-center justify-center mb-8 relative transition-colors group-hover:border-primary/30 shadow-lg">
                <span className="font-display-lg text-primary text-2xl font-bold group-hover:scale-110 transition-transform">3</span>
                <div className="absolute inset-0 bg-primary/5 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
              <h3 className="font-headline-md text-[20px] mb-4 text-white font-semibold">Verify Momentum</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed max-w-xs">
                Update cards, verify checkboxes, and review productivity charts as you achieve daily growth targets.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Proof of work / Social features */}
      <section id="social" className="py-28 relative">
        <div className="max-w-[1200px] mx-auto px-margin-desktop grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <h2 className="font-display-lg text-[36px] md:text-[48px] leading-[1.1] mb-6 text-white font-bold">
              Built for Private Focus &amp;<br />
              Public Proof-of-Work
            </h2>
            <p className="text-on-surface-variant text-base leading-relaxed mb-10">
              Easily toggle between deep work in your private workspace and sharing verified progress logs with your team. Show off your consistency with public rank badges and skill tree maps.
            </p>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0 border border-primary/20">
                  <span className="material-symbols-outlined text-[20px]">lock</span>
                </div>
                <div>
                  <h4 className="font-semibold text-base mb-1 text-white">Private Vaults</h4>
                  <p className="text-on-surface-variant text-sm">
                    Isolated local databases for tracking sensitive documents and personal notes.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0 border border-primary/20">
                  <span className="material-symbols-outlined text-[20px]">public</span>
                </div>
                <div>
                  <h4 className="font-semibold text-base mb-1 text-white">Verifiable Progress Cards</h4>
                  <p className="text-on-surface-variant text-sm">
                    Generate visual skill nodes and streak graphs to share on LinkedIn or with team members.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative">
            {/* Ambient glow container */}
            <div className="absolute inset-0 bg-primary/10 rounded-3xl blur-[40px] pointer-events-none" />

            <div className="glass-panel rounded-2xl p-8 overflow-hidden min-h-[380px] flex flex-col justify-between relative z-10">
              <div className="flex justify-between items-center mb-6">
                <span className="text-[10px] font-label-sm uppercase tracking-widest text-on-surface-variant font-bold">
                  Shared Live Workspace Log
                </span>
                <span className="flex h-2.5 w-2.5 rounded-full bg-primary animate-pulse shadow-[0_0_8px_#8B5CF6]"></span>
              </div>
              
              <div className="space-y-4">
                <div className="bg-[#0D0D14]/75 border border-white/5 p-4 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined text-[18px]">terminal</span>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">System PR Merged</div>
                      <div className="text-xs text-on-surface-variant mt-0.5">Optimized radial lighting loops</div>
                    </div>
                  </div>
                  <div className="text-primary font-bold text-sm">+25 XP</div>
                </div>

                <div className="bg-[#0D0D14]/75 border border-white/5 p-4 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-secondary/10 border border-secondary/20 flex items-center justify-center text-secondary">
                      <span className="material-symbols-outlined text-[18px]">menu_book</span>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">Course Completed</div>
                      <div className="text-xs text-on-surface-variant mt-0.5">Advanced Distributed Shaders</div>
                    </div>
                  </div>
                  <div className="text-secondary font-bold text-sm">+80 XP</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 relative z-10 bg-background/50">
        <div className="max-w-[1200px] mx-auto px-margin-desktop flex flex-col sm:flex-row justify-between items-center text-on-surface-variant text-[12px] gap-4">
          <span>© 2024 MasterOS. Inspired by Outpero.</span>
          <div className="flex gap-6">
            <a className="hover:text-white transition-colors" href="#features">Privacy</a>
            <a className="hover:text-white transition-colors" href="#features">API Status</a>
            <a className="hover:text-white transition-colors" href="#features">Enterprise</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
