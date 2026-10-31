'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useChronoBid } from '@/lib/context';
import { SupportedCurrency, CURRENCY_CONFIGS } from '@/lib/currency';
import {
  Menu,
  X,
  ChevronDown,
  User,
  Shield,
  Layers,
  LogOut,
  Sliders,
  FileText,
  Clock,
  Sparkles,
  Bell,
} from 'lucide-react';

export function Header() {
  const pathname = usePathname();
  const { user, logoutUser, currency, setCurrency, isSaleroomClosed, availableToBidUsd, formatPrice, unreadNotificationCount } = useChronoBid();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navLinks = [
    { label: 'Live Saleroom', href: '/auctions/live', badge: 'Live' },
    { label: 'Upcoming Catalog', href: '/auctions/upcoming' },
    { label: 'Past Results', href: '/auctions/past' },
    { label: 'How It Works', href: '/how-it-works' },
    { label: 'Transparency', href: '/transparency' },
    { label: 'Private Consignment', href: '/consign' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-paper/95 backdrop-blur-sm border-b border-stone-hairline">
      {/* Top Universal Sandbox Simulation Disclosure Bar */}
      <div className="bg-forest text-paper text-[10px] font-mono py-1 px-4 text-center tracking-wider flex items-center justify-center gap-2">
        <span className="bg-lime text-forest font-bold px-1.5 py-0.2">
          SANDBOX SIMULATION
        </span>
        <span className="hidden sm:inline text-paper/80">
          ChronoBid Vault Interactive Prototype — Not Real Transactions or Live Financial Settlement.
        </span>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand & Crest */}
        <Link
          href="/"
          className="flex items-center gap-3 group focus:outline-none focus:ring-1 focus:ring-forest p-1"
        >
          <div className="w-10 h-10 border border-forest bg-paper-dark flex items-center justify-center font-serif italic text-xl text-forest group-hover:bg-lime transition-colors">
            CB
          </div>
          <div>
            <span className="font-serif text-xl tracking-tight text-forest block leading-none font-bold">
              ChronoBid Vault
            </span>
            <span className="text-[10px] font-mono tracking-widest text-forest/60 uppercase block mt-0.5">
              Curated Horology Saleroom
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6" aria-label="Main Navigation">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname?.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-xs font-mono tracking-wider uppercase transition-colors flex items-center gap-1.5 py-1 border-b-2 ${
                  isActive
                    ? 'text-forest border-forest font-semibold'
                    : 'text-forest/70 border-transparent hover:text-forest'
                }`}
              >
                {link.badge && !isSaleroomClosed && (
                  <span className="w-1.5 h-1.5 rounded-full bg-lime border border-forest animate-pulse"></span>
                )}
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Utility: Vault Eligibility Chip, Currency Switcher & User Account */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Persistent Vault Eligibility Chip (FR-VLT-01, ADR-025) */}
          <Link
            href="/account/settings"
            title="Pre-Funded Vault Available Balance (Click to inspect Vault settings)"
            className="px-2.5 py-1.5 bg-paper-dark hover:bg-paper border border-stone-hairline text-xs font-mono text-forest flex items-center gap-1.5 transition-colors shadow-tactile"
          >
            <span className="w-2 h-2 rounded-full bg-lime border border-forest/40"></span>
            <span className="text-forest/70 text-[10px] uppercase font-semibold">Vault:</span>
            <span className="font-bold">{formatPrice(availableToBidUsd)}</span>
            <span className="text-[9px] text-lime-900 bg-lime/40 px-1 py-0.2 font-bold">[DEMO]</span>
          </Link>

          {/* Notification Bell Button */}
          <Link
            href="/account/notifications"
            className="relative p-2 bg-paper-dark hover:bg-paper border border-stone-hairline text-forest transition-colors flex items-center justify-center shadow-tactile"
            aria-label={`Collector Notifications (${unreadNotificationCount} unread)`}
            title="Collector Notifications"
          >
            <Bell className="w-4 h-4 text-forest" />
            {unreadNotificationCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-forest text-lime border border-lime text-[9px] font-mono font-bold flex items-center justify-center rounded-full animate-pulse">
                {unreadNotificationCount}
              </span>
            )}
          </Link>

          {/* Currency Switcher (ADR-021, ADR-026, IX-NAV-04) */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setCurrencyDropdownOpen(!currencyDropdownOpen);
                setUserDropdownOpen(false);
              }}
              aria-expanded={currencyDropdownOpen}
              aria-label={`Select display currency (current: ${currency})`}
              className="px-2.5 py-1.5 bg-paper-dark border border-stone-hairline text-xs font-mono text-forest flex items-center gap-1.5 hover:border-forest transition-colors"
            >
              <span className="font-bold">{currency}</span>
              <span className="text-forest/60 text-[10px]">({CURRENCY_CONFIGS[currency].symbol})</span>
              <ChevronDown className="w-3 h-3 text-forest/70" />
            </button>

            {currencyDropdownOpen && (
              <div
                className="absolute right-0 mt-1 w-52 bg-paper border border-stone-hairline shadow-tactile-hover z-50 py-1"
                role="menu"
              >
                <div className="px-3 py-1.5 text-[10px] font-mono text-forest/60 uppercase border-b border-stone-hairline">
                  Display Currencies (ECB/RBI 16 Oct 2026)
                </div>
                {(Object.keys(CURRENCY_CONFIGS) as SupportedCurrency[]).map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => {
                      setCurrency(c);
                      setCurrencyDropdownOpen(false);
                    }}
                    role="menuitem"
                    className={`w-full text-left px-3 py-1.5 text-xs font-mono flex items-center justify-between hover:bg-paper-dark transition-colors ${
                      currency === c ? 'bg-lime/40 font-bold text-forest' : 'text-forest/80'
                    }`}
                  >
                    <span className="font-bold">{c} <span className="font-normal text-forest/60 text-[10px]">({CURRENCY_CONFIGS[c].symbol})</span></span>
                    <span className="text-forest/60 text-[11px] truncate max-w-[100px]">{CURRENCY_CONFIGS[c].name}</span>
                  </button>
                ))}
                <div className="px-3 py-1 text-[9px] font-mono text-forest/50 border-t border-stone-hairline bg-paper-dark/50">
                  Fixed demo rates for display only
                </div>
              </div>
            )}
          </div>

          {/* User Account Dropdown */}
          {user.isLoggedIn ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setUserDropdownOpen(!userDropdownOpen);
                  setCurrencyDropdownOpen(false);
                }}
                aria-expanded={userDropdownOpen}
                aria-label="User Account Navigation"
                className="px-3 py-1.5 bg-forest text-paper border border-forest text-xs font-mono flex items-center gap-2 hover:bg-forest-hover transition-colors"
              >
                <span className="w-2 h-2 rounded-full bg-lime"></span>
                <span>Paddle #{user.paddleNumber}</span>
                <ChevronDown className="w-3 h-3 text-paper/70" />
              </button>

              {userDropdownOpen && (
                <div
                  className="absolute right-0 mt-1 w-64 bg-paper border border-stone-hairline shadow-tactile-hover z-50 py-1"
                  role="menu"
                >
                  <div className="px-3 py-2 border-b border-stone-hairline space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-serif font-bold text-forest block">
                        {user.name}
                      </span>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 bg-forest text-paper font-semibold tracking-wider">
                        Collector & Consignor
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-forest/60 block">
                      {user.email}
                    </span>
                  </div>

                  <Link
                    href="/account/notifications"
                    onClick={() => setUserDropdownOpen(false)}
                    className="px-3 py-2 text-xs font-mono text-forest hover:bg-paper-dark flex items-center justify-between"
                  >
                    <span className="flex items-center gap-2">
                      <Bell className="w-3.5 h-3.5 text-forest/70" />
                      <span>Notifications</span>
                    </span>
                    {unreadNotificationCount > 0 && (
                      <span className="px-1.5 py-0.2 bg-forest text-lime text-[9px] font-mono font-bold rounded-full">
                        {unreadNotificationCount}
                      </span>
                    )}
                  </Link>

                  <Link
                    href="/account/bids"
                    onClick={() => setUserDropdownOpen(false)}
                    className="px-3 py-2 text-xs font-mono text-forest hover:bg-paper-dark flex items-center gap-2"
                  >
                    <Clock className="w-3.5 h-3.5 text-forest/70" />
                    <span>My Bids & Watchlist</span>
                  </Link>

                  <Link
                    href="/account/consignments"
                    onClick={() => setUserDropdownOpen(false)}
                    className="px-3 py-2 text-xs font-mono text-forest hover:bg-paper-dark flex items-center gap-2"
                  >
                    <FileText className="w-3.5 h-3.5 text-forest/70" />
                    <span>Consignments & Realisations</span>
                  </Link>

                  <Link
                    href="/auctions/past"
                    onClick={() => setUserDropdownOpen(false)}
                    className="px-3 py-2 text-xs font-mono text-forest hover:bg-paper-dark flex items-center gap-2"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-forest/70" />
                    <span>Past Auction Results</span>
                  </Link>

                  <Link
                    href="/admin"
                    onClick={() => setUserDropdownOpen(false)}
                    className="px-3 py-2 text-xs font-mono text-forest hover:bg-paper-dark flex items-center justify-between"
                  >
                    <span className="flex items-center gap-2">
                      <Shield className="w-3.5 h-3.5 text-lime-700" />
                      <span>Specialist Desk</span>
                    </span>
                    <span className="text-[9px] bg-lime text-forest font-bold px-1 py-0.2">DEMO</span>
                  </Link>

                  <Link
                    href="/account/settings"
                    onClick={() => setUserDropdownOpen(false)}
                    className="px-3 py-2 text-xs font-mono text-forest hover:bg-paper-dark flex items-center gap-2"
                  >
                    <Sliders className="w-3.5 h-3.5 text-forest/70" />
                    <span>Paddle & Vault Settings</span>
                  </Link>

                  <div className="border-t border-stone-hairline my-1"></div>

                  <button
                    type="button"
                    onClick={() => {
                      logoutUser();
                      setUserDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-mono text-red-700 hover:bg-red-50 flex items-center gap-2"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out (IX-AUTH-05)</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/auth/login"
              className="px-3.5 py-1.5 bg-forest hover:bg-forest-hover text-paper text-xs font-mono uppercase tracking-wider transition-colors"
            >
              Sign In / Paddle
            </Link>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="lg:hidden flex items-center gap-2">
          {/* Mobile Currency toggle */}
          <button
            type="button"
            onClick={() => {
              const currs: SupportedCurrency[] = ['USD', 'EUR', 'GBP', 'CHF', 'JPY', 'HKD', 'SGD', 'INR'];
              const idx = currs.indexOf(currency);
              setCurrency(currs[(idx + 1) % currs.length]);
            }}
            className="px-2 py-1 bg-paper-dark border border-stone-hairline text-xs font-mono text-forest"
            aria-label="Cycle display currency"
          >
            {currency}
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
            className="p-2 border border-stone-hairline bg-paper text-forest"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-paper border-b border-stone-hairline p-4 space-y-4 shadow-lg">
          {/* Mobile Vault Balance Chip */}
          <Link
            href="/account/settings"
            onClick={() => setMobileMenuOpen(false)}
            className="p-2.5 bg-paper-dark border border-stone-hairline text-xs font-mono text-forest flex items-center justify-between"
          >
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-lime border border-forest/40"></span>
              <span className="text-forest/70 uppercase">Vault Available:</span>
              <span className="font-bold">{formatPrice(availableToBidUsd)}</span>
            </div>
            <span className="text-[10px] text-lime-900 bg-lime/40 px-1.5 py-0.2 font-bold">[DEMO]</span>
          </Link>

          <nav className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 px-3 text-xs font-mono uppercase tracking-wider text-forest hover:bg-paper-dark border-l-2 border-transparent hover:border-forest"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="pt-3 border-t border-stone-hairline space-y-2">
            {user.isLoggedIn ? (
              <>
                <div className="px-3 py-1 text-xs font-mono text-forest/70 flex items-center justify-between">
                  <span>Paddle <strong className="text-forest">#{user.paddleNumber}</strong></span>
                  <span className="px-1.5 py-0.2 bg-forest text-paper text-[10px] font-bold">
                    Collector & Consignor
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/account/notifications"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 bg-paper-dark text-xs font-mono text-center text-forest flex items-center justify-center gap-1.5"
                  >
                    <Bell className="w-3 h-3 text-forest/70" />
                    <span>Notifications</span>
                    {unreadNotificationCount > 0 && (
                      <span className="px-1 py-0.1 bg-forest text-lime text-[9px] font-bold rounded-full">
                        {unreadNotificationCount}
                      </span>
                    )}
                  </Link>
                  <Link
                    href="/account/bids"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 bg-paper-dark text-xs font-mono text-center text-forest"
                  >
                    Bids & Watchlist
                  </Link>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/account/consignments"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 bg-paper-dark text-xs font-mono text-center text-forest"
                  >
                    Consignments
                  </Link>
                  <Link
                    href="/account/settings"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 bg-paper-dark text-xs font-mono text-center text-forest"
                  >
                    Paddle Settings
                  </Link>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/auctions/past"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 bg-paper-dark text-xs font-mono text-center text-forest"
                  >
                    Past Results
                  </Link>
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 bg-paper-dark border border-lime text-xs font-mono text-center text-forest flex items-center justify-center gap-1 font-bold"
                  >
                    <span>Specialist [Demo]</span>
                  </Link>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    logoutUser();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2 text-xs font-mono text-red-700 bg-red-50 border border-red-200 text-center"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                href="/auth/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full py-2.5 bg-forest text-paper text-xs font-mono uppercase text-center"
              >
                Join / Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
