import React from 'react';

export default function Accordion({ num, title, isOpen, onToggle, children }) {
  return (
    <div className={`border rounded-xl overflow-hidden mb-6 bg-white scroll-mt-32 transition-all duration-300 ${isOpen ? 'shadow-sm border-primary ring-1 ring-primary/20' : 'border-outline-variant hover:border-primary/50'}`} id={`step-${num}`}>
      <button 
        type="button" 
        onClick={onToggle}
        className={`w-full p-5 flex items-center justify-between transition-colors ${isOpen ? 'bg-primary/5' : 'bg-white hover:bg-surface-container-lowest'}`}
      >
        <div className="flex items-center gap-4">
          <div className={`w-8 h-8 rounded-full flex flex-shrink-0 items-center justify-center font-bold text-sm ${isOpen ? 'bg-primary text-on-primary' : 'bg-surface-container-high'}`}>
            {num}
          </div>
          <h3 className={`font-bold text-lg ${isOpen ? 'text-primary' : 'text-on-surface'}`}>{title}</h3>
        </div>
        <span className={`material-symbols-outlined transition-transform duration-300 ${isOpen ? 'rotate-180 text-primary' : 'text-on-surface-variant'}`}>expand_more</span>
      </button>
      
      <div className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
        <div className="p-6 md:p-8 border-t border-outline-variant/50">
          {children}
        </div>
      </div>
    </div>
  );
}
