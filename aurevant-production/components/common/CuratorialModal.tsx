'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import { X, Sparkles, ShieldCheck, Search, FileText } from 'lucide-react';

export type CuratorialModalType = 'consignment' | 'portfolio' | 'search' | 'info';

interface CuratorialModalProps {
  isOpen: boolean;
  onClose: () => void;
  type?: CuratorialModalType;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  description: string;
  note?: string;
}

export function CuratorialModal({
  isOpen,
  onClose,
  type = 'info',
  eyebrow = 'AUREVANT AUCTION HOUSE',
  title,
  subtitle,
  description,
  note,
}: CuratorialModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const dismissButtonRef = useRef<HTMLButtonElement>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    },
    [isOpen, onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
      const timer = setTimeout(() => {
        dismissButtonRef.current?.focus();
      }, 50);

      return () => {
        clearTimeout(timer);
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  const renderIcon = () => {
    switch (type) {
      case 'consignment':
        return <FileText className="w-4 h-4 text-[#C5A059]" />;
      case 'portfolio':
        return <ShieldCheck className="w-4 h-4 text-[#C5A059]" />;
      case 'search':
        return <Search className="w-4 h-4 text-[#C5A059]" />;
      default:
        return <Sparkles className="w-4 h-4 text-[#C5A059]" />;
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="curatorial-modal-title"
      aria-describedby="curatorial-modal-desc"
    >
      {/* Restrained Backdrop Scrim */}
      <div
        className="fixed inset-0 bg-[#0B0D0C]/85 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Museum Plaque Modal Container */}
      <div
        ref={dialogRef}
        className="relative w-full max-w-[460px] bg-[#101113] border border-[#C5A059]/40 p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.9)] text-center transition-all duration-300 transform scale-100"
        style={{
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.95), 0 0 0 1px rgba(197, 160, 89, 0.3)',
        }}
      >
        {/* Top Accent Gold Strip */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#C5A059] to-transparent" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3.5 right-3.5 p-1.5 text-[#D8D0C2]/70 hover:text-[#C5A059] transition-colors focus:outline-none focus:ring-1 focus:ring-[#C5A059]"
          aria-label="Close dialogue"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Curatorial Emblem */}
        <div className="w-10 h-10 mx-auto mb-4 rounded-full bg-[#182720] border border-[#C5A059]/40 flex items-center justify-center shadow-inner">
          {renderIcon()}
        </div>

        {/* Eyebrow */}
        <p
          id="curatorial-modal-title"
          className="text-[10px] sm:text-[10.5px] uppercase tracking-[0.26em] text-[#C5A059] font-mono font-medium mb-1.5"
        >
          {eyebrow}
        </p>

        {/* Headline */}
        <h3 className="font-serif text-xl sm:text-2xl text-[#F4F0E8] font-normal tracking-wide mb-2">
          {title}
        </h3>

        {/* Subtitle if available */}
        {subtitle && (
          <p className="font-serif italic text-sm text-[#D8D0C2] mb-3">
            {subtitle}
          </p>
        )}

        {/* Description Body */}
        <p
          id="curatorial-modal-desc"
          className="text-xs sm:text-[13px] text-[#D8D0C2]/90 leading-relaxed font-sans mb-5 max-w-sm mx-auto"
        >
          {description}
        </p>

        {/* Curatorial Note / Demo Disclosure Badge */}
        {note && (
          <div className="mb-6 px-3 py-1.5 bg-[#182720]/60 border border-[#C5A059]/20 inline-block">
            <p className="font-mono text-[9.5px] uppercase tracking-wider text-[#C5A059]/90">
              {note}
            </p>
          </div>
        )}

        {/* Dismiss Action */}
        <div>
          <button
            ref={dismissButtonRef}
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-8 py-2.5 bg-[#C5A059] hover:bg-[#E7C477] text-[#101113] font-mono text-[11px] sm:text-xs uppercase tracking-[0.2em] font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#F4F0E8] focus:ring-offset-2 focus:ring-offset-[#101113]"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
}
