'use client';

import React, { useState } from 'react';
import { Search, X } from 'lucide-react';

interface SearchInputProps {
  className?: string;
}

export function SearchInput({ className = '' }: SearchInputProps) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleClear = () => {
    setQuery('');
  };

  return (
    <div className={`relative flex items-center search-container ${className}`}>
      <div
        className={`relative flex items-center h-[36px] bg-[#101113]/70 border transition-all duration-200 rounded-none w-56 lg:w-[240px] xl:w-[260px] px-3 ${
          isFocused ? 'border-[#E7C477] ring-1 ring-[#E7C477]/40' : 'border-[#F4F0E8]/15 hover:border-[#F4F0E8]/30'
        }`}
      >
        <Search className="w-3.5 h-3.5 text-[#C5A059] mr-2 flex-shrink-0" aria-hidden="true" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Search objects, artists, makers..."
          aria-label="Search objects, artists, makers..."
          className="w-full bg-transparent text-xs text-[#F4F0E8] placeholder-[#D8D0C2]/50 focus:outline-none font-sans"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="p-0.5 text-[#D8D0C2]/60 hover:text-[#C5A059] focus:outline-none"
            aria-label="Clear search query"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
}
