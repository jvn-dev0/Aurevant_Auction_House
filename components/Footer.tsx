'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useChronoBid } from '@/lib/context';
import { ShieldCheck, ArrowRight, Lock, Check } from 'lucide-react';

export function Footer() {
  const { addToast } = useChronoBid();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      setSubscribed(true);
      addToast('Subscribed to ChronoBid Vault private gazette.', 'success');
      setEmail('');
    }
  };

  return (
    <footer className="bg-forest text-paper border-t border-forest-subtle">
      {/* Simulation & Governance Persistent Warning Box */}
      <div className="bg-paper-dark border-b border-stone-hairline py-4 px-4 sm:px-8 text-forest text-xs font-mono">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-bold text-forest uppercase tracking-wider">
            <span className="w-2.5 h-2.5 bg-lime inline-block"></span>
            <span>Prototype Governance Disclosure:</span>
          </div>
          <div className="text-[11px] text-forest/80 leading-relaxed max-w-4xl">
            This interactive prototype is a demonstration interface built strictly under Phase 2 Owner Authorization.
            Escrow custody and insured transit are classified strictly as <strong>[PROPOSED FUTURE SERVICES — NOT CURRENTLY OPERATIONAL]</strong>.
            The 48-hour appraisal ticket is classified as <strong>[SIMULATED DEMO FEEDBACK — NOT A LEGAL SLA]</strong>.
            Bidding, paddle registration, and invoices operate with demo fixtures.
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-12">
        {/* Main Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Colophon */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 border border-paper/40 flex items-center justify-center font-serif italic text-lg text-paper">
                CB
              </span>
              <span className="font-serif text-2xl font-bold tracking-tight text-paper">
                ChronoBid Vault
              </span>
            </div>
            <p className="font-serif italic text-paper/80 text-sm max-w-md leading-relaxed">
              Curated Fine Horology & Rare Timepiece Saleroom. Preserving mechanical watchmaking heritage through forensic authentication, transparent auction mechanics, and provenance integrity.
            </p>
            <div className="text-[11px] font-mono text-paper/60 space-y-1">
              <p>Geneva Saleroom • Quai du Mont-Blanc 14, 1201 Genève</p>
              <p>Specialist Concierge: concierge@chronobidvault.ch</p>
            </div>
          </div>

          {/* Saleroom & Catalog Navigation */}
          <div className="space-y-3">
            <h4 className="font-mono text-xs uppercase tracking-widest text-lime font-bold">
              Saleroom
            </h4>
            <ul className="space-y-2 text-xs font-mono text-paper/70">
              <li>
                <Link href="/" className="hover:text-paper hover:underline">
                  Editorial Home (Route 01)
                </Link>
              </li>
              <li>
                <Link href="/auctions/live" className="hover:text-paper hover:underline flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-lime"></span>
                  <span>Live Saleroom (Route 02)</span>
                </Link>
              </li>
              <li>
                <Link href="/auctions/upcoming" className="hover:text-paper hover:underline">
                  Upcoming Catalog (Route 03)
                </Link>
              </li>
              <li>
                <Link href="/auctions/lots/patek-philippe-calatrava-3520d" className="hover:text-paper hover:underline">
                  Specimen Dossier (Route 04)
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform & Governance */}
          <div className="space-y-3">
            <h4 className="font-mono text-xs uppercase tracking-widest text-lime font-bold">
              Governance & Intake
            </h4>
            <ul className="space-y-2 text-xs font-mono text-paper/70">
              <li>
                <Link href="/how-it-works" className="hover:text-paper hover:underline">
                  How It Works (Route 05)
                </Link>
              </li>
              <li>
                <Link href="/transparency" className="hover:text-paper hover:underline">
                  Audit & Transparency (Route 06)
                </Link>
              </li>
              <li>
                <Link href="/consign" className="hover:text-paper hover:underline">
                  Consign a Timepiece (Route 07)
                </Link>
              </li>
              <li>
                <Link href="/account/consignments" className="hover:text-paper hover:underline">
                  Consignor Portal (Route 09)
                </Link>
              </li>
            </ul>
          </div>

          {/* Account & Authentication Directory */}
          <div className="space-y-3">
            <h4 className="font-mono text-xs uppercase tracking-widest text-lime font-bold">
              Collector Portal
            </h4>
            <ul className="space-y-2 text-xs font-mono text-paper/70">
              <li>
                <Link href="/account/bids" className="hover:text-paper hover:underline">
                  Bids & Invoices (Route 08)
                </Link>
              </li>
              <li>
                <Link href="/account/settings" className="hover:text-paper hover:underline">
                  Paddle Settings (Route 10)
                </Link>
              </li>
              <li>
                <Link href="/auth/login" className="hover:text-paper hover:underline">
                  Collector Login (Route 11)
                </Link>
              </li>
              <li>
                <Link href="/auth/register" className="hover:text-paper hover:underline">
                  Paddle Registration (Route 12)
                </Link>
              </li>
              <li>
                <Link href="/auth/verify-email" className="hover:text-paper hover:underline">
                  Email PIN Verification (Route 13)
                </Link>
              </li>
              <li>
                <Link href="/auth/reset-password" className="hover:text-paper hover:underline">
                  Password Recovery (Route 14)
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter Gazette Form */}
        <div className="pt-8 border-t border-forest-subtle flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h4 className="font-serif text-lg text-paper">
              The ChronoBid Gazette
            </h4>
            <p className="text-xs font-sans text-paper/60">
              Private dispatches on rare horological discoveries, auction calendars, and Timegrapher audits.
            </p>
          </div>

          <form onSubmit={handleSubscribe} className="flex w-full md:w-auto gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter collector email"
              required
              aria-label="Collector email for newsletter"
              className="px-3 py-2 bg-forest-subtle border border-paper/20 text-paper text-xs font-mono placeholder:text-paper/40 focus:outline-none focus:border-lime"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-lime text-forest font-mono text-xs uppercase tracking-wider font-bold hover:bg-lime-hover transition-colors flex items-center gap-1 shrink-0"
            >
              {subscribed ? <Check className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              <span>{subscribed ? 'Joined' : 'Subscribe'}</span>
            </button>
          </form>
        </div>

        {/* Bottom Colophon Bar */}
        <div className="pt-6 border-t border-forest-subtle/60 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-paper/50 gap-2">
          <p>© 2026 ChronoBid Vault SA. All rights reserved. Geneva, Switzerland.</p>
          <div className="flex items-center gap-4">
            <span>Display Currencies: ECB Ref 16 Oct 2026</span>
            <span>•</span>
            <span>Phase 1 Baseline v2.2</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
