'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { ChevronDown, ArrowRight } from 'lucide-react';
import { CuratorialModal, CuratorialModalType } from '../common/CuratorialModal';

/**
 * AUREVANT AUCTION HOUSE — Reference-Accurate Footer
 *
 * Specifications:
 * - Full-width near-black background (#080D0C)
 * - Brand wordmark (Instrument Serif + IBM Plex Mono) with tagline:
 *   "THE ART OF EXCEPTIONAL OWNERSHIP."
 * - Real contact information:
 *   - Phone: +91 93429 77191 (tel:+919342977191)
 *   - Email: kbjeevanbabu803@gmail.com (mailto:kbjeevanbabu803@gmail.com)
 *   - WhatsApp: https://wa.me/919342977191
 * - Strict local SVG icons from /icons/:
 *   - /icons/instagram.svg
 *   - /icons/x.svg
 *   - /icons/facebook.svg
 *   - /icons/whatsapp.svg
 * - Navigation columns: AUCTIONS, CATEGORIES, ABOUT, SUPPORT
 * - Newsletter subscription with email validation, loading, error & curatorial feedback states
 * - Dynamic copyright year, legal notices, international region and language selectors
 * - Subtle upward editorial scroll reveal respecting prefers-reduced-motion
 */

interface ModalState {
  isOpen: boolean;
  type: CuratorialModalType;
  eyebrow: string;
  title: string;
  subtitle?: string;
  description: string;
  note?: string;
}

export function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Newsletter state
  const [email, setEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'loading' | 'error' | 'success'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Curatorial modal state
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    type: 'info',
    eyebrow: 'AUREVANT AUCTION HOUSE',
    title: '',
    description: '',
  });

  const currentYear = new Date().getFullYear();

  // Reduced motion check
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Visibility check on scroll
  useEffect(() => {
    const checkVisibility = () => {
      if (!footerRef.current) return;
      const rect = footerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;
      if (rect.top <= windowHeight * 0.95) {
        setIsVisible(true);
      }
    };

    window.addEventListener('scroll', checkVisibility, { passive: true });
    window.addEventListener('resize', checkVisibility, { passive: true });
    checkVisibility();

    let observer: IntersectionObserver | null = null;
    if (typeof IntersectionObserver !== 'undefined' && footerRef.current) {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting) {
            setIsVisible(true);
            if (observer) observer.disconnect();
          }
        },
        { threshold: 0.05 }
      );
      observer.observe(footerRef.current);
    }

    return () => {
      window.removeEventListener('scroll', checkVisibility);
      window.removeEventListener('resize', checkVisibility);
      if (observer) observer.disconnect();
    };
  }, []);

  // Modal helpers
  const openModal = useCallback((state: Omit<ModalState, 'isOpen'>) => {
    setModalState({ ...state, isOpen: true });
  }, []);

  const closeModal = useCallback(() => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  // Newsletter submission
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const trimmed = email.trim();

    if (!trimmed) {
      setNewsletterStatus('error');
      setErrorMessage('Please enter your email address.');
      return;
    }

    if (!emailRegex.test(trimmed)) {
      setNewsletterStatus('error');
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setNewsletterStatus('loading');

    setTimeout(() => {
      setNewsletterStatus('success');
      openModal({
        type: 'info',
        eyebrow: 'AUREVANT DISPATCHES',
        title: 'Stay Informed',
        subtitle: `Registered: ${trimmed}`,
        description:
          'Thank you for subscribing to curatorial highlights, forthcoming auction catalogues, and private department stories. The live newsletter dispatch service will activate with the upcoming seasonal sale.',
        note: '[NEWSLETTER REGISTRY — DEMONSTRATION NOTICE]',
      });
      setEmail('');
      setNewsletterStatus('idle');
    }, 600);
  };

  // Social account click handler
  const handleSocialClick = (platform: string) => {
    openModal({
      type: 'info',
      eyebrow: 'AUREVANT CHANNELS',
      title: `${platform} Official Channel`,
      subtitle: 'Verified Curatorial Presence',
      description:
        `AUREVANT official communications on ${platform} are managed exclusively through authenticated institutional handles. For direct enquiries, please connect via our verified WhatsApp or specialist email desk.`,
      note: '[OFFICIAL SOCIAL CHANNEL NOTICE]',
    });
  };

  // Legal modal helper
  const openLegalModal = (title: string, description: string) => {
    openModal({
      type: 'info',
      eyebrow: 'AUREVANT GOVERNANCE',
      title,
      description,
      note: '[CURATORIAL POLICY DEMONSTRATION]',
    });
  };

  const motion = !prefersReducedMotion;
  const revealClass = motion
    ? isVisible
      ? 'opacity-100 translate-y-0'
      : 'opacity-0 translate-y-6'
    : 'opacity-100 translate-y-0';

  return (
    <>
      <footer
        ref={footerRef}
        id="footer"
        className="relative w-full bg-[#080D0C] text-[#F4F0E8] overflow-hidden border-t border-[#C5A059]/20"
        aria-label="AUREVANT Auction House footer"
      >
        {/* Subtle decorative gold top highlight */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C5A059]/35 to-transparent" />

        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 pt-16 sm:pt-20 pb-12">
          {/* ── MAIN GRID: Brand | Nav Columns | Newsletter ─────────── */}
          <div
            className={`grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 transition-all duration-700 ease-out ${revealClass}`}
          >
            {/* ── COL 1: Brand Wordmark, Tagline, Contact & Socials ─── */}
            <div className="lg:col-span-4 flex flex-col justify-between space-y-6">
              <div>
                {/* Brand Wordmark */}
                <a
                  href="/"
                  className="brand-wordmark inline-flex flex-col items-start focus:outline-none focus:ring-1 focus:ring-[#C5A059] py-0.5 group"
                  aria-label="AUREVANT AUCTION HOUSE Home"
                >
                  <span className="font-serif tracking-[0.22em] text-2xl sm:text-[26px] text-[#F4F0E8] font-normal uppercase leading-none transition-colors group-hover:text-[#FAF8F5]">
                    AUREVANT
                  </span>
                  <span className="text-[8.5px] tracking-[0.32em] text-[#C5A059] uppercase font-mono mt-1.5 leading-none">
                    AUCTION HOUSE
                  </span>
                </a>

                {/* Tagline */}
                <p className="font-mono text-[10.5px] sm:text-[11px] tracking-[0.22em] text-[#A7A39A] uppercase mt-3.5 leading-relaxed">
                  The Art of Exceptional Ownership.
                </p>
              </div>

              {/* Real Contact Information */}
              <div className="space-y-2 pt-1 border-t border-[#C5A059]/15">
                <p className="font-mono text-[9.5px] tracking-[0.26em] text-[#C5A059] uppercase">
                  Specialist Enquiries
                </p>
                <div className="flex flex-col space-y-1.5 text-[12.5px]">
                  {/* Phone */}
                  <a
                    href="tel:+919342977191"
                    className="font-mono text-[#D8D0C2] hover:text-[#C5A059] transition-colors duration-200 inline-flex items-center gap-2 focus:outline-none focus:text-[#C5A059]"
                    aria-label="Telephone: +91 93429 77191"
                  >
                    <span>+91 93429 77191</span>
                  </a>

                  {/* Email */}
                  <a
                    href="mailto:kbjeevanbabu803@gmail.com"
                    className="font-sans text-[#D8D0C2] hover:text-[#C5A059] transition-colors duration-200 inline-flex items-center gap-2 focus:outline-none focus:text-[#C5A059]"
                    aria-label="Email: kbjeevanbabu803@gmail.com"
                  >
                    <span>kbjeevanbabu803@gmail.com</span>
                  </a>
                </div>
              </div>

              {/* Social Media Icons (Strict Local Assets from public/icons/) */}
              <div className="pt-2">
                <p className="font-mono text-[9.5px] tracking-[0.26em] text-[#A7A39A] uppercase mb-3">
                  Connect
                </p>
                <div className="flex items-center gap-3.5">
                  {/* Instagram */}
                  <button
                    type="button"
                    onClick={() => handleSocialClick('Instagram')}
                    className="group relative flex items-center justify-center w-8 h-8 rounded-full border border-[#C5A059]/25 hover:border-[#C5A059] bg-[#101513] transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-[#C5A059]"
                    aria-label="AUREVANT on Instagram"
                  >
                    <span
                      className="inline-block w-[18px] h-[18px] bg-[#F4F0E8] group-hover:bg-[#C5A059] transition-colors duration-200"
                      style={{
                        maskImage: 'url(/icons/instagram.svg)',
                        WebkitMaskImage: 'url(/icons/instagram.svg)',
                        maskRepeat: 'no-repeat',
                        WebkitMaskRepeat: 'no-repeat',
                        maskPosition: 'center',
                        WebkitMaskPosition: 'center',
                        maskSize: 'contain',
                        WebkitMaskSize: 'contain',
                      }}
                      aria-hidden="true"
                    />
                  </button>

                  {/* X (formerly Twitter) */}
                  <button
                    type="button"
                    onClick={() => handleSocialClick('X')}
                    className="group relative flex items-center justify-center w-8 h-8 rounded-full border border-[#C5A059]/25 hover:border-[#C5A059] bg-[#101513] transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-[#C5A059]"
                    aria-label="AUREVANT on X"
                  >
                    <span
                      className="inline-block w-[17px] h-[17px] bg-[#F4F0E8] group-hover:bg-[#C5A059] transition-colors duration-200"
                      style={{
                        maskImage: 'url(/icons/x.svg)',
                        WebkitMaskImage: 'url(/icons/x.svg)',
                        maskRepeat: 'no-repeat',
                        WebkitMaskRepeat: 'no-repeat',
                        maskPosition: 'center',
                        WebkitMaskPosition: 'center',
                        maskSize: 'contain',
                        WebkitMaskSize: 'contain',
                      }}
                      aria-hidden="true"
                    />
                  </button>

                  {/* Facebook */}
                  <button
                    type="button"
                    onClick={() => handleSocialClick('Facebook')}
                    className="group relative flex items-center justify-center w-8 h-8 rounded-full border border-[#C5A059]/25 hover:border-[#C5A059] bg-[#101513] transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-[#C5A059]"
                    aria-label="AUREVANT on Facebook"
                  >
                    <span
                      className="inline-block w-[18px] h-[18px] bg-[#F4F0E8] group-hover:bg-[#C5A059] transition-colors duration-200"
                      style={{
                        maskImage: 'url(/icons/facebook.svg)',
                        WebkitMaskImage: 'url(/icons/facebook.svg)',
                        maskRepeat: 'no-repeat',
                        WebkitMaskRepeat: 'no-repeat',
                        maskPosition: 'center',
                        WebkitMaskPosition: 'center',
                        maskSize: 'contain',
                        WebkitMaskSize: 'contain',
                      }}
                      aria-hidden="true"
                    />
                  </button>

                  {/* WhatsApp (Real Link to +91 93429 77191) */}
                  <a
                    href="https://wa.me/919342977191"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative flex items-center justify-center w-8 h-8 rounded-full border border-[#C5A059]/25 hover:border-[#C5A059] bg-[#101513] transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-[#C5A059]"
                    aria-label="Chat with AUREVANT Specialist on WhatsApp (+91 93429 77191)"
                  >
                    <span
                      className="inline-block w-[18px] h-[18px] bg-[#F4F0E8] group-hover:bg-[#C5A059] transition-colors duration-200"
                      style={{
                        maskImage: 'url(/icons/whatsapp.svg)',
                        WebkitMaskImage: 'url(/icons/whatsapp.svg)',
                        maskRepeat: 'no-repeat',
                        WebkitMaskRepeat: 'no-repeat',
                        maskPosition: 'center',
                        WebkitMaskPosition: 'center',
                        maskSize: 'contain',
                        WebkitMaskSize: 'contain',
                      }}
                      aria-hidden="true"
                    />
                  </a>
                </div>
              </div>
            </div>

            {/* ── COLS 2-4: Center Navigation Columns ───────────────── */}
            <div className="lg:col-span-5 grid grid-cols-2 sm:grid-cols-4 gap-8">
              {/* Column 1: AUCTIONS */}
              <div className="space-y-3.5">
                <h4 className="font-mono text-[10.5px] uppercase tracking-[0.24em] text-[#C5A059] font-medium">
                  Auctions
                </h4>
                <ul className="space-y-2 text-[12.5px] font-sans text-[#D8D0C2]">
                  <li>
                    <a
                      href="#auctions"
                      className="hover:text-[#E7C477] transition-colors duration-200 block py-0.5"
                    >
                      Upcoming Auctions
                    </a>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() =>
                        openModal({
                          type: 'info',
                          eyebrow: 'AUREVANT ARCHIVES',
                          title: 'Past Auction Records',
                          description:
                            'Explore historical saleroom prices realized, provenance documentation, and published catalogues across past international seasons.',
                          note: '[ARCHIVES INDEXING IN PROGRESS]',
                        })
                      }
                      className="hover:text-[#E7C477] transition-colors duration-200 block py-0.5 text-left"
                    >
                      Past Auctions
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() =>
                        openModal({
                          type: 'consignment',
                          eyebrow: 'AUREVANT PRIVATE SALES',
                          title: 'Private Treaty Sales',
                          description:
                            'Discreet acquisitions and confidential consignments orchestrated outside public auction schedules by our senior specialist directors.',
                          note: '[PRIVATE TREATY DESK]',
                        })
                      }
                      className="hover:text-[#E7C477] transition-colors duration-200 block py-0.5 text-left"
                    >
                      Private Sales
                    </button>
                  </li>
                </ul>
              </div>

              {/* Column 2: CATEGORIES */}
              <div className="space-y-3.5">
                <h4 className="font-mono text-[10.5px] uppercase tracking-[0.24em] text-[#C5A059] font-medium">
                  Categories
                </h4>
                <ul className="space-y-2 text-[12.5px] font-sans text-[#D8D0C2]">
                  <li>
                    <a
                      href="#categories"
                      className="hover:text-[#E7C477] transition-colors duration-200 block py-0.5"
                    >
                      Fine Art
                    </a>
                  </li>
                  <li>
                    <a
                      href="#categories"
                      className="hover:text-[#E7C477] transition-colors duration-200 block py-0.5"
                    >
                      Horology
                    </a>
                  </li>
                  <li>
                    <a
                      href="#categories"
                      className="hover:text-[#E7C477] transition-colors duration-200 block py-0.5"
                    >
                      Numismatics
                    </a>
                  </li>
                  <li>
                    <a
                      href="#categories"
                      className="hover:text-[#E7C477] transition-colors duration-200 block py-0.5"
                    >
                      Rare Books
                    </a>
                  </li>
                  <li>
                    <a
                      href="#categories"
                      className="hover:text-[#E7C477] transition-colors duration-200 block py-0.5"
                    >
                      Jewellery
                    </a>
                  </li>
                  <li>
                    <a
                      href="#categories"
                      className="hover:text-[#E7C477] transition-colors duration-200 block py-0.5"
                    >
                      Antiquities
                    </a>
                  </li>
                </ul>
              </div>

              {/* Column 3: ABOUT */}
              <div className="space-y-3.5">
                <h4 className="font-mono text-[10.5px] uppercase tracking-[0.24em] text-[#C5A059] font-medium">
                  About
                </h4>
                <ul className="space-y-2 text-[12.5px] font-sans text-[#D8D0C2]">
                  <li>
                    <a
                      href="#about"
                      className="hover:text-[#E7C477] transition-colors duration-200 block py-0.5"
                    >
                      Our Expertise
                    </a>
                  </li>
                  <li>
                    <a
                      href="#stories"
                      className="hover:text-[#E7C477] transition-colors duration-200 block py-0.5"
                    >
                      Our Story
                    </a>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() =>
                        openModal({
                          type: 'info',
                          eyebrow: 'AUREVANT PRESS & MEDIA',
                          title: 'Curatorial Press Room',
                          description:
                            'Official media releases, auction highlights, saleroom results, and high-resolution curatorial imagery for accredited journalists.',
                          note: '[MEDIA ENQUIRIES DESK]',
                        })
                      }
                      className="hover:text-[#E7C477] transition-colors duration-200 block py-0.5 text-left"
                    >
                      Press
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() =>
                        openModal({
                          type: 'info',
                          eyebrow: 'AUREVANT TALENT',
                          title: 'Careers at AUREVANT',
                          description:
                            'Explore specialist cataloguing, fine art conservation, numismatic research, and international saleroom operations roles.',
                          note: '[INSTITUTIONAL APPOINTMENTS]',
                        })
                      }
                      className="hover:text-[#E7C477] transition-colors duration-200 block py-0.5 text-left"
                    >
                      Careers
                    </button>
                  </li>
                </ul>
              </div>

              {/* Column 4: SUPPORT */}
              <div className="space-y-3.5">
                <h4 className="font-mono text-[10.5px] uppercase tracking-[0.24em] text-[#C5A059] font-medium">
                  Support
                </h4>
                <ul className="space-y-2 text-[12.5px] font-sans text-[#D8D0C2]">
                  <li>
                    <button
                      type="button"
                      onClick={() =>
                        openModal({
                          type: 'info',
                          eyebrow: 'COLLECTOR DESK',
                          title: 'Help Center',
                          description:
                            'Frequently asked questions regarding client registration, live paddle verification, condition reporting, and billing procedures.',
                          note: '[CLIENT SUPPORT DIRECTORY]',
                        })
                      }
                      className="hover:text-[#E7C477] transition-colors duration-200 block py-0.5 text-left"
                    >
                      Help Center
                    </button>
                  </li>
                  <li>
                    <a
                      href="mailto:kbjeevanbabu803@gmail.com"
                      className="hover:text-[#E7C477] transition-colors duration-200 block py-0.5"
                    >
                      Contact Us
                    </a>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() =>
                        openModal({
                          type: 'info',
                          eyebrow: 'GLOBAL SALEROOMS',
                          title: 'Saleroom Locations',
                          subtitle: 'London • Geneva • New York • Hong Kong',
                          description:
                            'Representative exhibition galleries and valuation salerooms across premier international cultural capitals.',
                          note: '[SALEROOM DIRECTORY]',
                        })
                      }
                      className="hover:text-[#E7C477] transition-colors duration-200 block py-0.5 text-left"
                    >
                      Locations
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() =>
                        openModal({
                          type: 'info',
                          eyebrow: 'LOGISTICS & CUSTODY',
                          title: 'Shipping & Global Services',
                          description:
                            'Insured door-to-door art transit, customs declaration compliance, climate-controlled vault storage, and secure handover protocols.',
                          note: '[FINE ART LOGISTICS PROTOCOL]',
                        })
                      }
                      className="hover:text-[#E7C477] transition-colors duration-200 block py-0.5 text-left"
                    >
                      Shipping & Global
                    </button>
                  </li>
                </ul>
              </div>
            </div>

            {/* ── COL 5: Newsletter Subscription Area ───────────────── */}
            <div className="lg:col-span-3 flex flex-col justify-between">
              <div>
                <h4 className="font-serif text-xl sm:text-2xl text-[#F4F0E8] font-normal tracking-wide mb-2.5">
                  Stay informed
                </h4>
                <p className="font-sans text-[12.5px] text-[#A7A39A] leading-relaxed mb-4">
                  Sign up for auction highlights, stories and upcoming sales.
                </p>

                {/* Subscription Form */}
                <form onSubmit={handleNewsletterSubmit} className="space-y-2">
                  <div className="relative flex items-center bg-[#101513] border border-[#C5A059]/30 focus-within:border-[#C5A059] transition-colors duration-200">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errorMessage) setErrorMessage('');
                      }}
                      placeholder="Enter your email address"
                      aria-label="Email address for auction newsletter"
                      disabled={newsletterStatus === 'loading'}
                      className="flex-1 bg-transparent text-[#F4F0E8] placeholder-[#A7A39A]/50 text-[12.5px] font-sans px-3.5 py-2.5 focus:outline-none"
                    />
                    <button
                      type="submit"
                      disabled={newsletterStatus === 'loading'}
                      aria-label="Subscribe to newsletter"
                      className="px-3.5 py-2.5 text-[#C5A059] hover:text-[#E7C477] transition-colors duration-200 focus:outline-none focus:text-[#E7C477] disabled:opacity-40"
                    >
                      {newsletterStatus === 'loading' ? (
                        <span className="w-4 h-4 border-2 border-[#C5A059]/30 border-t-[#C5A059] rounded-full animate-spin inline-block" />
                      ) : (
                        <ArrowRight className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {errorMessage && (
                    <p className="font-sans text-[11px] text-[#F16B59] mt-1">
                      {errorMessage}
                    </p>
                  )}
                </form>
              </div>

              {/* Newsletter Curatorial Note */}
              <p className="font-mono text-[9.5px] text-[#A7A39A]/60 uppercase tracking-widest mt-6">
                Curated Dispatches · Unsubscribe Anytime
              </p>
            </div>
          </div>

          {/* ── HORIZONTAL DIVIDER ──────────────────────────────────── */}
          <div className="my-10 sm:my-12 h-px bg-gradient-to-r from-transparent via-[#C5A059]/25 to-transparent" />

          {/* ── BOTTOM ROW: Copyright, Legal, Regional Selectors ────── */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-[11px] font-sans text-[#A7A39A]">
            {/* Left: Copyright */}
            <div className="font-mono tracking-wider text-center md:text-left text-[#A7A39A]/90">
              © {currentYear} AUREVANT Auction House. All rights reserved.
            </div>

            {/* Centre: Legal Links */}
            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
              <button
                type="button"
                onClick={() =>
                  openLegalModal(
                    'Privacy Policy',
                    'AUREVANT complies with international data privacy standards including GDPR and UK-GDPR. Client identity and provenance dossiers remain strictly confidential.'
                  )
                }
                className="hover:text-[#C5A059] transition-colors focus:outline-none"
              >
                Privacy Policy
              </button>
              <span className="text-[#C5A059]/30" aria-hidden="true">
                •
              </span>
              <button
                type="button"
                onClick={() =>
                  openLegalModal(
                    'Terms & Conditions',
                    'Saleroom participation, buyer premium terms, simulated bidding paddle agreements, and catalogue warranties subject to formal auction agreements.'
                  )
                }
                className="hover:text-[#C5A059] transition-colors focus:outline-none"
              >
                Terms & Conditions
              </button>
              <span className="text-[#C5A059]/30" aria-hidden="true">
                •
              </span>
              <button
                type="button"
                onClick={() =>
                  openLegalModal(
                    'Cookie Policy',
                    'Essential session tokens and curatorial preference cookies are utilized to preserve viewport state, lot watchlist counters, and saleroom currency preferences.'
                  )
                }
                className="hover:text-[#C5A059] transition-colors focus:outline-none"
              >
                Cookie Policy
              </button>
              <span className="text-[#C5A059]/30" aria-hidden="true">
                •
              </span>
              <button
                type="button"
                onClick={() =>
                  openLegalModal(
                    'Modern Slavery Statement',
                    'AUREVANT upholds stringent international human rights commitments across its worldwide supply chain, transit networks, and specialist partnerships.'
                  )
                }
                className="hover:text-[#C5A059] transition-colors focus:outline-none"
              >
                Modern Slavery Statement
              </button>
            </div>

            {/* Right: Region & Language Controls */}
            <div className="flex items-center space-x-4 font-mono text-[10.5px]">
              <button
                type="button"
                onClick={() =>
                  openModal({
                    type: 'info',
                    eyebrow: 'REGIONAL JURISDICTION',
                    title: 'International Saleroom Selection',
                    subtitle: 'Primary Hubs: London · Geneva · New York',
                    description:
                      'Select your preferred regional saleroom for currency settlement, local catalogue preview schedules, and domestic tax evaluations.',
                    note: '[MULTI-CURRENCY SETTLEMENT]',
                  })
                }
                className="flex items-center space-x-1 hover:text-[#C5A059] transition-colors focus:outline-none"
                aria-label="Select international region"
              >
                <span className="tracking-wider">INTERNATIONAL</span>
                <ChevronDown className="w-3 h-3 text-[#C5A059]" />
              </button>

              <span className="text-[#C5A059]/30" aria-hidden="true">
                |
              </span>

              <button
                type="button"
                onClick={() =>
                  openModal({
                    type: 'info',
                    eyebrow: 'LANGUAGE SELECTION',
                    title: 'Catalogue Language',
                    subtitle: 'Active: English (UK / US)',
                    description:
                      'Official auction catalogues and condition reports are published in English, French, and Traditional Chinese for major global sales.',
                    note: '[LOCALIZATION NOTICE]',
                  })
                }
                className="hover:text-[#C5A059] transition-colors focus:outline-none tracking-wider"
                aria-label="Language selector: English"
              >
                ENGLISH
              </button>
            </div>
          </div>

          {/* Sandbox Disclosure as required by AGENTS.md */}
          <div className="text-center pt-8">
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#F4F0E8]/20">
              [DEMO DATA — SANDBOX SIMULATION · AUREVANT PROTOTYPE]
            </p>
          </div>
        </div>
      </footer>

      {/* ── Curatorial Modal System ────────────────────────────────── */}
      <CuratorialModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
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
