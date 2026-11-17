'use client';

import React, { useEffect, useRef } from 'react';
import { X, Heart, User, ChevronDown } from 'lucide-react';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navLinks: Array<{ label: string; href: string }>;
  triggerRef?: React.RefObject<HTMLButtonElement | HTMLElement | null>;
  onOpenConsignment?: () => void;
  onOpenWatchlist?: () => void;
  onOpenAccount?: () => void;
  onOpenRegional?: () => void;
}

export function MobileMenu({
  isOpen,
  onClose,
  navLinks,
  triggerRef,
  onOpenConsignment,
  onOpenWatchlist,
  onOpenAccount,
  onOpenRegional,
}: MobileMenuProps) {
  const drawerRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);
  const wasOpenRef = useRef(false);

  // Focus restoration helper — stable ref to avoid stale closures in effects
  const restoreFocusRef = useRef(() => {
    const target =
      triggerRef?.current ||
      previousActiveElement.current ||
      (typeof document !== 'undefined' ? document.querySelector<HTMLElement>('.mobile-menu-toggle') : null);
    if (target && typeof target.focus === 'function') {
      target.focus();
    }
  });
  // Keep the ref up-to-date without causing re-renders
  restoreFocusRef.current = () => {
    const target =
      triggerRef?.current ||
      previousActiveElement.current ||
      (typeof document !== 'undefined' ? document.querySelector<HTMLElement>('.mobile-menu-toggle') : null);
    if (target && typeof target.focus === 'function') {
      target.focus();
    }
  };
  const restoreFocus = () => restoreFocusRef.current();

  const handleClose = () => {
    onClose();
    restoreFocus();
  };

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href === '#sell' && onOpenConsignment) {
      e.preventDefault();
      handleClose();
      setTimeout(onOpenConsignment, 150);
      return;
    }
    handleClose();
  };

  // Handle ESC key, focus trapping, and focus restoration lifecycle
  useEffect(() => {
    if (isOpen) {
      wasOpenRef.current = true;
      previousActiveElement.current =
        triggerRef?.current ||
        (typeof document !== 'undefined' ? (document.activeElement as HTMLElement) : null);

      // Lock background scroll
      document.body.style.overflow = 'hidden';

      // Focus close button on mount
      const timeout = setTimeout(() => {
        closeBtnRef.current?.focus();
      }, 50);

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          onClose();
          restoreFocus();
          return;
        }

        if (e.key === 'Tab') {
          const focusable = drawerRef.current?.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
          );
          if (!focusable || focusable.length === 0) return;

          const first = focusable[0];
          const last = focusable[focusable.length - 1];

          if (e.shiftKey) {
            if (document.activeElement === first) {
              e.preventDefault();
              last.focus();
            }
          } else {
            if (document.activeElement === last) {
              e.preventDefault();
              first.focus();
            }
          }
        }
      };

      window.addEventListener('keydown', handleKeyDown);

      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
        clearTimeout(timeout);
      };
    } else if (wasOpenRef.current) {
      // Transition from open to closed
      wasOpenRef.current = false;
      document.body.style.overflow = '';
      restoreFocus();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, onClose, triggerRef]);

  return (
    <div className={`fixed inset-0 z-50 md:hidden ${isOpen ? '' : 'hidden'}`}>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#0B0D0C]/80 backdrop-blur-sm transition-opacity duration-300"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        id="mobile-menu-drawer"
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile Navigation"
        className="mobile-drawer fixed inset-y-0 right-0 w-80 max-w-[85vw] bg-[#101113] border-l border-[#D8D0C2]/20 p-6 flex flex-col justify-between shadow-2xl z-50 transform transition-transform duration-300 ease-out"
      >
        <div>
          {/* Drawer Header */}
          <div className="flex items-center justify-between pb-4 border-b border-[#D8D0C2]/15">
            <div className="flex flex-col">
              <span className="font-serif text-lg tracking-widest text-[#F4F0E8]">AUREVANT</span>
              <span className="font-mono text-[9px] tracking-[0.25em] text-[#C5A059] uppercase">
                AUCTION HOUSE
              </span>
            </div>
            <button
              ref={closeBtnRef}
              onClick={handleClose}
              className="close-drawer-btn p-2 text-[#D8D0C2] hover:text-[#C5A059] focus:outline-none focus:ring-1 focus:ring-[#C5A059]"
              aria-label="Close navigation menu"
            >
              <X className="w-5 h-5 close-icon" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col space-y-3 my-6" aria-label="Mobile primary navigation">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className="text-sm uppercase tracking-wider text-[#F4F0E8] hover:text-[#C5A059] py-2 border-b border-[#D8D0C2]/10 transition-colors focus:outline-none focus:text-[#C5A059]"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        {/* Drawer Footer Controls */}
        <div className="pt-4 border-t border-[#D8D0C2]/15 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs font-mono text-[#D8D0C2]">
            <button
              type="button"
              onClick={() => {
                handleClose();
                setTimeout(() => onOpenRegional?.(), 150);
              }}
              className="flex items-center space-x-1 hover:text-[#C5A059] focus:outline-none"
              aria-label="Mobile region: INTERNATIONAL"
            >
              <span>INTERNATIONAL</span>
              <ChevronDown className="w-3 h-3 text-[#C5A059]" />
            </button>
            <span className="text-[#D8D0C2]/40">/</span>
            <button
              type="button"
              onClick={() => {
                handleClose();
                setTimeout(() => onOpenRegional?.(), 150);
              }}
              className="flex items-center space-x-1 hover:text-[#C5A059] focus:outline-none"
              aria-label="Mobile language: EN"
            >
              <span>EN</span>
              <ChevronDown className="w-3 h-3 text-[#C5A059]" />
            </button>
          </div>

          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() => {
                handleClose();
                setTimeout(() => onOpenWatchlist?.(), 150);
              }}
              className="p-2 text-[#D8D0C2] hover:text-[#C5A059] focus:outline-none focus:ring-1 focus:ring-[#C5A059]"
              aria-label="Mobile watchlist"
            >
              <Heart className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => {
                handleClose();
                setTimeout(() => onOpenAccount?.(), 150);
              }}
              className="p-2 text-[#D8D0C2] hover:text-[#C5A059] focus:outline-none focus:ring-1 focus:ring-[#C5A059]"
              aria-label="Mobile account"
            >
              <User className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
