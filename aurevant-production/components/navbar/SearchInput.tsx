'use client';

import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import { CuratorialModal } from '../common/CuratorialModal';

interface SearchInputProps {
  className?: string;
}

export function SearchInput({ className = '' }: SearchInputProps) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchedQuery, setSearchedQuery] = useState('');

  const handleClear = () => {
    setQuery('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    setSearchedQuery(trimmed);
    setIsModalOpen(true);
  };

  return (
    <>
      <form
        role="search"
        onSubmit={handleSubmit}
        className={`relative flex items-center search-container ${className}`}
        aria-label="Sitewide auction catalogue search"
      >
        <div
          className={`relative flex items-center h-[36px] bg-[#101113]/70 border transition-all duration-200 rounded-none w-56 lg:w-[240px] xl:w-[260px] px-3 ${
            isFocused
              ? 'border-[#E7C477] ring-1 ring-[#E7C477]/40'
              : 'border-[#F4F0E8]/15 hover:border-[#F4F0E8]/30'
          }`}
        >
          <button
            type="submit"
            className="p-0 mr-2 flex-shrink-0 text-[#C5A059] hover:text-[#E7C477] transition-colors focus:outline-none focus:ring-1 focus:ring-[#C5A059]"
            aria-label="Submit search query"
          >
            <Search className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
          <input
            type="search"
            value={query}
            maxLength={100}
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
      </form>

      {/* Curatorial Search Modal */}
      <CuratorialModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        type="search"
        eyebrow="AUREVANT CATALOGUE INDEX"
        title="Curatorial Search Query"
        subtitle={searchedQuery ? `Catalogue query: “${searchedQuery}”` : undefined}
        description="The curatorial search engine is currently indexing verified provenance records and cataloguing notes across all six departments. Full keyword search indexing will activate with the upcoming seasonal saleroom release."
        note="[CATALOGUE INDEXING IN PROGRESS]"
      />
    </>
  );
}
