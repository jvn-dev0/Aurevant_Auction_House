'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import { X, Lock } from 'lucide-react';

interface GuestAccessNoticeProps {
  isOpen: boolean;
  onClose: () => void;
  collectionTitle?: string;
}

export function GuestAccessNotice({ isOpen, onClose, collectionTitle }: GuestAccessNoticeProps) {
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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="access-notice-title"
      aria-describedby="access-notice-description"
      id="guest-access-notice"
    >
      {/* Restrained Dark Scrim Backdrop */}
      <div
        className="fixed inset-0 bg-[#14080B]/80 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Compact Curatorial Notice Plaque */}
      <div
        ref={dialogRef}
        className="relative w-full max-w-[420px] bg-[#241014] border border-[#C5A059]/40 p-6 sm:p-8 shadow-[0_20px_50px_rgba(20,8,11,0.85)] text-center transition-all duration-300 transform scale-100"
        style={{
          boxShadow: '0 25px 50px -12px rgba(20, 8, 11, 0.85), 0 0 0 1px rgba(197, 160, 89, 0.25)',
        }}
      >
        {/* Top Accent Gold Strip */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#C5A059] to-transparent" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3.5 right-3.5 p-1.5 text-[#D8C7B5]/70 hover:text-[#C5A059] transition-colors focus:outline-none focus:ring-1 focus:ring-[#C5A059]"
          aria-label="Close notice"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Lock Icon Emblem */}
        <div className="w-10 h-10 mx-auto mb-4 rounded-full bg-[#351018] border border-[#C5A059]/35 flex items-center justify-center">
          <Lock className="w-4 h-4 text-[#C5A059]" />
        </div>

        {/* Eyebrow */}
        <p
          id="access-notice-title"
          className="text-[10px] sm:text-[10.5px] uppercase tracking-[0.26em] text-[#C5A059] font-mono font-medium mb-2"
        >
          AUREVANT PRIVATE ACCESS
        </p>

        {/* Optional Active Department Identifier */}
        {collectionTitle && (
          <p className="font-serif text-lg text-[#F4F0E8] font-normal italic mb-3">
            {collectionTitle}
          </p>
        )}

        {/* Informational Message */}
        <p
          id="access-notice-description"
          className="font-sans text-[13px] sm:text-[13.5px] text-[#D8C7B5] leading-relaxed mb-6"
        >
          This collection requires an AUREVANT account. Please create an account to continue exploring.
        </p>

        {/* Fine Antique-Gold Divider */}
        <div className="w-16 h-px mx-auto bg-[#C5A059]/40 mb-5" />

        {/* Dismiss Button (Simple Informational Action Only) */}
        <button
          ref={dismissButtonRef}
          type="button"
          onClick={onClose}
          className="px-6 py-2 bg-[#351018] hover:bg-[#581C2B] text-[#F4F0E8] border border-[#C5A059]/40 text-xs font-mono tracking-[0.16em] transition-colors focus:outline-none focus:ring-1 focus:ring-[#C5A059]"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}
