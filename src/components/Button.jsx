import React from 'react';

const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'secondary', // primary, secondary, ghost
  disabled = false,
  className = '',
  icon = ''
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-gradient-to-r from-primary to-secondary text-white font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98]';
      case 'ghost':
        return 'bg-transparent text-on-surface-variant hover:bg-white/5 hover:text-white';
      default: // secondary
        return 'bg-white/5 border border-white/10 text-on-surface hover:bg-white/10 hover:border-white/20 hover:text-white backdrop-blur-md';
    }
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-6 py-2.5 rounded-lg transition-all duration-300 font-label-md text-label-md flex items-center justify-center gap-2 cursor-pointer ${getVariantStyles()} ${
        disabled ? 'opacity-40 cursor-not-allowed hover:scale-100 active:scale-100' : ''
      } ${className}`}
    >
      {icon && <span className="material-symbols-outlined text-[18px]">{icon}</span>}
      {children}
    </button>
  );
};

export default Button;
