import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export default function CustomSelect({ 
  value, 
  onChange, 
  options = [], 
  placeholder = 'Chọn một mục...', 
  disabled = false,
  className = '' 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative w-full ${className}`} ref={containerRef}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-sm rounded-lg px-3.5 py-2.5 text-left flex items-center justify-between transition focus:outline-none focus:ring-1 focus:ring-zinc-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-sm ${
          isOpen ? 'ring-1 ring-zinc-500 border-zinc-700' : ''
        }`}
      >
        <span className={`truncate ${selectedOption ? 'text-zinc-100 font-medium' : 'text-zinc-500'}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform duration-200 shrink-0 ml-2 ${isOpen ? 'rotate-180 text-zinc-200' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 z-50 mt-1.5 max-h-60 overflow-y-auto bg-zinc-900 border border-zinc-800 rounded-lg shadow-2xl p-1 animate-in fade-in zoom-in-95 duration-150 backdrop-blur-md">
          {options.length === 0 ? (
            <div className="px-3 py-2 text-xs text-zinc-500 text-center">Không có lựa chọn nào</div>
          ) : (
            options.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <div
                  key={opt.value}
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  className={`px-3 py-2 rounded-md text-xs sm:text-sm flex items-center justify-between cursor-pointer transition ${
                    isSelected 
                      ? 'bg-zinc-800/90 text-white font-semibold' 
                      : 'text-zinc-300 hover:bg-zinc-800/60 hover:text-white'
                  }`}
                >
                  <div className="truncate pr-2">
                    <div>{opt.label}</div>
                    {opt.subtext && <div className="text-[11px] text-zinc-500 font-normal truncate mt-0.5">{opt.subtext}</div>}
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
