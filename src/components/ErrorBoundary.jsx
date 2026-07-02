import React, { Component } from 'react';
import Button from './Button';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#07070a] text-on-surface flex flex-col items-center justify-center p-6 relative overflow-hidden">
          {/* Radial backgrounds */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-red-500/5 rounded-full blur-[80px] pointer-events-none z-0"></div>

          <div className="relative z-10 text-center max-w-md w-full space-y-6 bg-[#111118]/60 border border-white/5 p-8 rounded-2xl backdrop-blur-xl shadow-2xl">
            {/* Caution icon */}
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-500/5 border border-red-500/10 text-red-400">
              <span className="material-symbols-outlined text-3xl animate-pulse">
                construction
              </span>
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-black text-white tracking-tight">🚧 Something went wrong.</h2>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                MasterOS encountered a critical error. Don't worry, your data is safe. Let's try reloading the workspace environment.
              </p>
            </div>

            {this.state.error && (
              <div className="p-3 bg-[#150a0f] border border-red-500/10 rounded-lg text-left">
                <span className="text-[10px] uppercase font-bold text-red-400 block tracking-wide">Error Details</span>
                <p className="text-[10px] text-on-surface-variant font-mono truncate mt-1">
                  {this.state.error.toString()}
                </p>
              </div>
            )}

            <Button 
              variant="primary" 
              onClick={this.handleRetry}
              className="w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider hover:scale-[1.02] transition-transform"
            >
              Retry
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
