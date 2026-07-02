import React, { useState, useRef, useEffect } from 'react';

/**
 * Premium Searchable Single Selection Dropdown (Notion/Linear Style)
 */
export const SearchableSingleSelect = ({
  options = [],
  value = '',
  onChange,
  placeholder = 'Search or select...',
  customRequestLabel = 'Request New Option',
  onCustomRequest,
  className = '',
  error = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Determine current display label
  const selectedOption = options.find(opt => opt.id === value || opt.name === value);
  const displayLabel = selectedOption ? selectedOption.name : (value || '');

  // Filter options based on query
  const filteredOptions = options.filter(opt =>
    opt.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (option) => {
    onChange(option);
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleCustomRequest = () => {
    if (onCustomRequest) {
      onCustomRequest(searchQuery);
    }
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={`relative w-full text-left select-none ${className}`}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-[#0D0D14]/80 border rounded-lg p-3 text-xs text-on-surface cursor-pointer flex justify-between items-center transition-all ${
          isOpen ? 'border-primary shadow-[0_0_12px_rgba(139,92,246,0.15)]' : 'border-white/5 hover:border-white/10'
        } ${error ? 'border-red-500' : ''}`}
      >
        <span className={displayLabel ? 'text-white font-semibold' : 'text-on-surface-variant/40 font-medium'}>
          {displayLabel || placeholder}
        </span>
        <span className="material-symbols-outlined text-[16px] text-on-surface-variant transition-transform duration-200" style={{ transform: isOpen ? 'rotate(180deg)' : 'none' }}>
          expand_more
        </span>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 w-full mt-1 bg-[#111118] border border-white/10 rounded-xl shadow-2xl z-[100] max-h-60 overflow-hidden flex flex-col backdrop-blur-xl animate-fade-in">
          {/* Search Input inside Dropdown */}
          <div className="p-2 border-b border-white/5 flex items-center gap-2 bg-[#0D0D14]/50">
            <span className="material-symbols-outlined text-[16px] text-on-surface-variant">search</span>
            <input
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Type to search..."
              className="w-full bg-transparent border-0 text-xs text-white focus:outline-none focus:ring-0 placeholder:text-on-surface-variant/30 font-medium"
            />
          </div>

          {/* Options list */}
          <div className="overflow-y-auto no-scrollbar max-h-48 divide-y divide-white/2 py-1">
            {filteredOptions.length === 0 ? (
              <div className="p-3 text-center space-y-2">
                <p className="text-[10px] text-on-surface-variant italic">No matches found</p>
                {searchQuery.trim() && (
                  <button
                    type="button"
                    onClick={handleCustomRequest}
                    className="text-[10px] text-primary font-bold hover:underline cursor-pointer flex items-center justify-center gap-1.5 mx-auto py-1"
                  >
                    <span className="material-symbols-outlined text-[12px]">add_circle</span>
                    {customRequestLabel} "{searchQuery}"
                  </button>
                )}
              </div>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = value === opt.id || value === opt.name;
                return (
                  <div
                    key={opt.id}
                    onClick={() => handleSelect(opt)}
                    className="p-2.5 px-3.5 text-xs text-on-surface hover:bg-primary/10 hover:text-white cursor-pointer flex justify-between items-center transition-all font-semibold"
                  >
                    <span>{opt.name}</span>
                    {isSelected && (
                      <span className="material-symbols-outlined text-[14px] text-primary font-bold">check</span>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
      
      {error && (
        <p className="text-[10px] text-red-400 font-bold mt-1.5 animate-fade-in">❌ {error}</p>
      )}
    </div>
  );
};


/**
 * Premium Tag-Based Searchable Multi Selection Dropdown (Notion/Linear Style)
 */
export const SearchableMultiSelect = ({
  options = [],
  selectedValues = [],
  onChange,
  placeholder = 'Add skills or tags...',
  customPlaceholder = 'Add custom skill...',
  categoryField = '', // optional category grouping
  error = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggleValue = (valueId) => {
    // Standardize representation as id/name string
    if (selectedValues.includes(valueId)) {
      onChange(selectedValues.filter(val => val !== valueId));
    } else {
      onChange([...selectedValues, valueId]);
    }
  };

  const handleAddCustom = (name) => {
    const cleanName = name.trim();
    if (!cleanName) return;
    
    // Add custom tag if not already in list
    if (!selectedValues.includes(cleanName)) {
      onChange([...selectedValues, cleanName]);
    }
    setSearchQuery('');
  };

  // Filter unselected options based on search query
  const filteredOptions = options.filter(opt =>
    opt.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    !selectedValues.includes(opt.id) &&
    !selectedValues.includes(opt.name)
  );

  return (
    <div ref={containerRef} className="relative w-full space-y-2 text-left">
      {/* Selected Tags Display */}
      <div 
        onClick={() => setIsOpen(true)}
        className={`w-full bg-[#0D0D14]/80 border rounded-xl p-3 min-h-[46px] cursor-text transition-all ${
          isOpen ? 'border-primary ring-2 ring-primary/10 shadow-[0_0_15px_rgba(139,92,246,0.1)]' : 'border-white/5 hover:border-white/10'
        } ${error ? 'border-red-500' : ''}`}
      >
        <div className="flex flex-wrap gap-1.5 items-center">
          {selectedValues.length === 0 && !searchQuery && (
            <span className="text-on-surface-variant/40 font-medium text-xs pl-1 pointer-events-none">
              {placeholder}
            </span>
          )}
          
          {selectedValues.map(val => {
            // Find in standard options or fallback to string name
            const opt = options.find(o => o.id === val || o.name === val);
            const label = opt ? opt.name : val;
            return (
              <span 
                key={val}
                className="bg-primary/10 border border-primary/20 text-primary px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1.5 hover:bg-primary/15 transition-all"
              >
                {label}
                <button 
                  type="button" 
                  onClick={(e) => { e.stopPropagation(); handleToggleValue(val); }} 
                  className="text-[12px] hover:text-white leading-none cursor-pointer"
                >
                  ✕
                </button>
              </span>
            );
          })}
          
          {/* Inline search input */}
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setIsOpen(true); }}
            placeholder={selectedValues.length > 0 ? '' : ''}
            className="flex-grow min-w-[60px] bg-transparent border-0 p-0 text-xs text-white focus:outline-none focus:ring-0 placeholder:text-on-surface-variant/40 font-medium h-5"
          />
        </div>
      </div>

      {/* Dropdown suggestions list */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full mt-1.5 bg-[#111118] border border-white/10 rounded-xl shadow-2xl z-[100] max-h-60 overflow-hidden flex flex-col backdrop-blur-xl animate-fade-in">
          <div className="overflow-y-auto no-scrollbar max-h-56 divide-y divide-white/2 py-1">
            {/* Custom option adder row */}
            {searchQuery.trim() && (
              <div
                onClick={() => handleAddCustom(searchQuery)}
                className="p-2.5 px-3.5 text-xs text-primary hover:bg-primary/10 hover:text-white cursor-pointer flex items-center gap-2 transition-all font-bold"
              >
                <span className="material-symbols-outlined text-[14px]">add_circle</span>
                <span>Add custom "{searchQuery}"</span>
              </div>
            )}

            {filteredOptions.length === 0 ? (
              !searchQuery.trim() && (
                <div className="p-3 text-center text-[10px] text-on-surface-variant italic">
                  All standard options selected or list is empty
                </div>
              )
            ) : (
              filteredOptions.map((opt) => (
                <div
                  key={opt.id}
                  onClick={() => { handleToggleValue(opt.id); }}
                  className="p-2.5 px-3.5 text-xs text-on-surface hover:bg-primary/10 hover:text-white cursor-pointer flex justify-between items-center transition-all font-semibold"
                >
                  <div className="flex flex-col">
                    <span>{opt.name}</span>
                    {categoryField && opt[categoryField] && (
                      <span className="text-[9px] text-on-surface-variant font-bold uppercase tracking-wider mt-0.5">{opt[categoryField]}</span>
                    )}
                  </div>
                  <span className="material-symbols-outlined text-[14px] text-white/20 hover:text-primary">add</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {error && (
        <p className="text-[10px] text-red-400 font-bold mt-1 animate-fade-in">❌ {error}</p>
      )}
    </div>
  );
};
