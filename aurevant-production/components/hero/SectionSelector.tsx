'use client';

import React, { useState } from 'react';

const SECTIONS = ['01', '02', '03', '04'];

export function SectionSelector() {
  const [activeSection, setActiveSection] = useState('01');

  return (
    <div
      className="absolute right-6 sm:right-10 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-end space-y-4 z-20 section-selector pointer-events-auto"
      aria-label="Section selector"
    >
      {SECTIONS.map((sec) => {
        const isActive = activeSection === sec;
        return (
          <button
            key={sec}
            type="button"
            onClick={() => setActiveSection(sec)}
            className={`section-indicator flex items-center space-x-2 text-xs font-mono transition-all duration-200 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C5A059] ${
              isActive
                ? 'text-[#C5A059] font-bold'
                : 'text-[#D8D0C2]/60 hover:text-[#D8D0C2]'
            }`}
            data-section={sec}
            aria-current={isActive ? 'true' : undefined}
            aria-label={`Navigate to section ${sec}`}
          >
            {isActive && <span className="w-[2px] h-3.5 bg-[#C5A059] inline-block mr-1.5" />}
            <span>{sec}</span>
          </button>
        );
      })}
    </div>
  );
}
