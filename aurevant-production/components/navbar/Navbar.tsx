'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Heart, User, ChevronDown, Menu } from 'lucide-react';
import { SearchInput } from './SearchInput';
import { MobileMenu } from './MobileMenu';
import { CuratorialModal, CuratorialModalType } from '../common/CuratorialModal';

const NAV_LINKS = [
  { label: 'Auctions', href: '#auctions' },
  { label: 'Categories', href: '#categories' },
  { label: 'Stories', href: '#stories' },
  { label: 'Sell with AUREVANT', href: '#sell' },
  { label: 'About', href: '#about' },
];

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    type: CuratorialModalType;
    eyebrow: string;
    title: string;
    subtitle?: string;
    description: string;
    note?: string;
  }>({
    isOpen: false,
    type: 'info',
    eyebrow: '',
    title: '',
    description: '',
  });

  const handleCloseMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
    toggleRef.current?.focus();
  }, []);

  const openConsignmentModal = useCallback(() => {
    setModalState({
      isOpen: true,
      type: 'consignment',
      eyebrow: 'AUREVANT PRIVATE CONSIGNMENT',
      title: 'Consign with AUREVANT',
      subtitle: 'Complimentary Valuation & Curatorial Appraisals',
      description:
        'Our department specialists provide confidential auction estimates, private valuations, and cataloguing curation for exceptional fine art, rare horology, historical books, fine jewellery, numismatics, and antiquities.',
      note: '[CONSIGNMENT ENQUIRY DESK ACTIVE]',
    });
  }, []);

  const openWatchlistModal = useCallback(() => {
    setModalState({
      isOpen: true,
      type: 'portfolio',
      eyebrow: 'AUREVANT COLLECTOR PORTFOLIO',
      title: 'Collector Watchlist',
      subtitle: 'Personal Lot Tracking & Status Alerts',
      description:
        'Save exceptional auction lots, track live countdown intervals, and receive private curatorial notifications. Watchlist synchronization is reserved for registered collectors.',
      note: '[COLLECTOR SERVICES DEMONSTRATION]',
    });
  }, []);

  const openAccountModal = useCallback(() => {
    setModalState({
      isOpen: true,
      type: 'portfolio',
      eyebrow: 'AUREVANT PRIVATE ACCESS',
      title: 'Collector Portal',
      subtitle: 'Unified Saleroom & Consignor Identity',
      description:
        'Registered collectors access live saleroom bidding paddles, verified provenance dossiers, and private consignment accounts. Registration opens with each seasonal auction catalogue release.',
      note: '[SALEROOM ACCESS DEMO]',
    });
  }, []);

  const openRegionalModal = useCallback(() => {
    setModalState({
      isOpen: true,
      type: 'info',
      eyebrow: 'AUREVANT GLOBAL SALEROOMS',
      title: 'Regional Salerooms & Currency',
      subtitle: 'London • Geneva • New York • Hong Kong',
      description:
        'AUREVANT facilitates multi-currency live bidding and insured international transit across primary saleroom jurisdictions. Currencies default to USD and GBP.',
      note: '[GLOBAL SALEROOM DISPATCH]',
    });
  }, []);

  const handleNavLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href === '#sell') {
      e.preventDefault();
      openConsignmentModal();
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#101113]/35 backdrop-blur-md border-b border-[#F4F0E8]/10 transition-all duration-300">
        <div className="max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-[6vw] flex items-center justify-between h-[66px]">
          {/* Left: Brand Wordmark & Primary Navigation */}
          <div className="flex items-center space-x-8 lg:space-x-10 xl:space-x-12">
            {/* Brand Wordmark */}
            <a
              href="/"
              className="brand-wordmark flex flex-col items-start justify-center focus:outline-none focus:ring-1 focus:ring-[#C5A059] py-0.5 transition-opacity hover:opacity-90"
              aria-label="AUREVANT AUCTION HOUSE Home"
            >
              <span className="font-serif tracking-[0.22em] text-2xl lg:text-[26px] text-[#F4F0E8] font-normal uppercase leading-none">
                AUREVANT
              </span>
              <span className="text-[8px] lg:text-[8.5px] tracking-[0.32em] text-[#C5A059] uppercase font-mono mt-1 leading-none">
                AUCTION HOUSE
              </span>
            </a>

            {/* Primary Navigation Links (Desktop & Tablet) */}
            <nav className="hidden md:flex items-center space-x-5 lg:space-x-[24px]" aria-label="Primary navigation">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleNavLinkClick(e, link.href)}
                  className="text-[11px] lg:text-[11.5px] xl:text-[12px] tracking-[0.16em] lg:tracking-[0.18em] uppercase text-[#D8D0C2] hover:text-[#E7C477] transition-colors duration-200 font-sans font-medium focus:outline-none focus:text-[#E7C477]"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Right Header Controls (Search, Regional, Action Icons) */}
          <div className="hidden md:flex items-center space-x-5 lg:space-x-6 xl:space-x-7">
            <SearchInput />

            {/* International & Language Selectors */}
            <div className="flex items-center space-x-2.5 text-xs font-mono text-[#D8D0C2]">
              <button
                type="button"
                onClick={openRegionalModal}
                className="flex items-center space-x-1 hover:text-[#E7C477] transition-colors focus:outline-none text-[11px]"
                aria-label="Region selector: INTERNATIONAL"
              >
                <span className="tracking-wider">INTERNATIONAL</span>
                <ChevronDown className="w-3 h-3 text-[#E7C477]/80" />
              </button>
              <span className="text-[#F4F0E8]/20 select-none">|</span>
              <button
                type="button"
                onClick={openRegionalModal}
                className="flex items-center space-x-1 hover:text-[#E7C477] transition-colors focus:outline-none text-[11px]"
                aria-label="Language selector: EN"
              >
                <span className="tracking-wider">EN</span>
                <ChevronDown className="w-3 h-3 text-[#E7C477]/80" />
              </button>
            </div>

            {/* Collector Action Icons */}
            <div className="flex items-center space-x-3.5 pl-3 border-l border-[#F4F0E8]/12">
              <button
                type="button"
                onClick={openWatchlistModal}
                className="p-1.5 text-[#D8D0C2] hover:text-[#E7C477] transition-colors focus:outline-none focus:ring-1 focus:ring-[#C5A059]"
                aria-label="Watchlist"
              >
                <Heart className="w-4 h-4 lg:w-[18px] lg:h-[18px] heart-icon stroke-[1.5]" />
              </button>
              <button
                type="button"
                onClick={openAccountModal}
                className="p-1.5 text-[#D8D0C2] hover:text-[#E7C477] transition-colors focus:outline-none focus:ring-1 focus:ring-[#C5A059]"
                aria-label="Account"
              >
                <User className="w-4 h-4 lg:w-[18px] lg:h-[18px] user-icon stroke-[1.5]" />
              </button>
            </div>
          </div>

          {/* Mobile Menu Trigger */}
          <div className="md:hidden flex items-center space-x-3">
            <button
              ref={toggleRef}
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              className="mobile-menu-toggle p-2 text-[#F4F0E8] hover:text-[#C5A059] focus:outline-none focus:ring-1 focus:ring-[#C5A059]"
              aria-label="Open navigation menu"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu-drawer"
            >
              <Menu className="w-6 h-6 hamburger-icon" />
            </button>
          </div>
        </div>
      </header>

      {/* Accessible Mobile Drawer */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={handleCloseMobileMenu}
        navLinks={NAV_LINKS}
        triggerRef={toggleRef}
        onOpenConsignment={openConsignmentModal}
        onOpenWatchlist={openWatchlistModal}
        onOpenAccount={openAccountModal}
        onOpenRegional={openRegionalModal}
      />

      {/* Sitewide Curatorial Modal */}
      <CuratorialModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState((prev) => ({ ...prev, isOpen: false }))}
        type={modalState.type}
        eyebrow={modalState.eyebrow}
        title={modalState.title}
        subtitle={modalState.subtitle}
        description={modalState.description}
        note={modalState.note}
      />
    </>
  );
}
