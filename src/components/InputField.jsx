import React from 'react';

const InputField = ({
  id,
  type = 'text',
  placeholder = '',
  value,
  onChange,
  label = '',
  icon = '',
  className = '',
  disabled = false,
  required = false,
  error = ''
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label htmlFor={id} className="block font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider text-xs font-semibold">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative flex items-center group">
        {icon && (
          <span className={`material-symbols-outlined absolute left-4 text-on-surface-variant transition-colors text-[20px] ${error ? 'text-red-400 group-focus-within:text-red-500' : 'group-focus-within:text-primary'}`}>
            {icon}
          </span>
        )}
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          className={`w-full bg-[#111118] rounded-lg p-3 text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none transition-all ${
            error 
              ? 'border border-red-500/50 focus:border-red-500 focus:ring-4 focus:ring-red-500/10' 
              : 'border border-white/5 focus:border-primary focus:ring-4 focus:ring-primary/10'
          } ${
            icon ? 'pl-12' : ''
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        />
      </div>
      {error && (
        <p className="text-[11px] text-red-400 font-bold mt-1 animate-fade-in flex items-center gap-1">
          <span>❌</span> {error}
        </p>
      )}
    </div>
  );
};

export default InputField;
