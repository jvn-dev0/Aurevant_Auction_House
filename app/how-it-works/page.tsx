'use client';

import React from 'react';
import Link from 'next/link';
import {
  Compass,
  Radio,
  Lock,
  Truck,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

export default function HowItWorksPage() {
  const steps = [
    {
      number: '01',
      title: 'Forensic Intake & Timegrapher Audit',
      icon: Compass,
      description:
        'Every timepiece submitted for consignment undergoes a non-destructive physical examination. Our senior specialists audit dial authenticity under ultraviolet microscopy, measure 6-position calibre performance via acoustic Timegrapher, and request archival extracts from manufacture heritage departments.',
      operational: true,
      badge: 'Active Standard',
    },
    {
      number: '02',
      title: 'Transparent Saleroom Bidding & Soft-Close Anti-Sniping',
      icon: Radio,
      description:
        'Bidding is conducted with full transparency. To ensure human collectors are never outpaced by millisecond sniping software, any qualifying bid received with less than 120 seconds on the clock automatically resets the countdown to exactly 00:02:00 (up to a strict cap of 10 extensions per lot).',
      operational: true,
      badge: 'Active Standard (ADR-012)',
    },
    {
      number: '03',
      title: 'Bespoke Escrow Custody Settlement',
      icon: Lock,
      description:
        'Upon the drop of the hammer, buyer funds are held in a segregated Swiss escrow account. Funds are released to the consignor only after the buyer has completed their physical inspection period.',
      operational: false,
      badge: '[PROPOSED FUTURE SERVICE — NOT OPERATIONAL]',
    },
    {
      number: '04',
      title: 'Insured Armored Transit & 14-Day Vault Review',
      icon: Truck,
      description:
        'Worldwide delivery is executed exclusively through specialized armored couriers with real-time GPS telemetry and full Lloyd’s of London transit insurance. The collector receives a 14-day vault verification window to confirm amplitude and accuracy.',
      operational: false,
      badge: '[PROPOSED FUTURE SERVICE — NOT OPERATIONAL]',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Page Header */}
      <div className="border-b border-stone-hairline pb-8 space-y-3">
        <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-forest/60">
          <ShieldCheck className="w-3.5 h-3.5 text-forest/70" />
          <span>Operational Architecture & Process</span>
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-forest">
          How ChronoBid Vault Operates
        </h1>
        <p className="font-sans text-sm sm:text-base text-forest/80 max-w-3xl leading-relaxed">
          An editorial approach to rare horology transactions. We eliminate asymmetric information through forensic auditing, mathematical anti-sniping rules, and transparent custody workflows.
        </p>
      </div>

      {/* Mandatory Governance Notice Banner (TC-R05) */}
      <div className="p-4 bg-amber-50 border border-amber-300 text-amber-950 font-mono text-xs space-y-1">
        <div className="flex items-center gap-2 font-bold uppercase tracking-wider">
          <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
          <span>Mandatory Prototype Governance Disclosure (Phase 1 Baseline §4.1):</span>
        </div>
        <p className="leading-relaxed">
          Escrow custody and insured transit are classified strictly as <strong>[PROPOSED FUTURE SERVICES — NOT CURRENTLY OPERATIONAL]</strong>.
          In this interactive demonstration prototype, all payment gateways, paddle generation, and invoice settlements operate in sandbox simulation mode.
        </p>
      </div>

      {/* 4 Sequential Steps */}
      <div className="space-y-8">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <div
              key={step.number}
              className="p-6 sm:p-8 bg-paper border border-stone-hairline grid grid-cols-1 md:grid-cols-12 gap-6 items-start shadow-tactile"
            >
              <div className="md:col-span-3 space-y-2">
                <span className="font-serif italic text-4xl sm:text-5xl font-bold text-forest/30 block">
                  {step.number}
                </span>
                <span
                  className={`inline-block text-[10px] font-mono font-semibold px-2.5 py-1 uppercase tracking-wider border ${
                    step.operational
                      ? 'bg-paper-dark text-forest border-stone-hairline'
                      : 'bg-amber-100 text-amber-900 border-amber-300'
                  }`}
                >
                  {step.badge}
                </span>
              </div>

              <div className="md:col-span-9 space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-paper-dark border border-stone-hairline flex items-center justify-center text-forest shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-forest">
                    {step.title}
                  </h3>
                </div>
                <p className="font-sans text-sm text-forest/80 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* CTA Strip */}
      <div className="p-8 bg-paper-dark border border-stone-hairline flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h4 className="font-serif text-xl font-bold text-forest">
            Ready to experience the saleroom?
          </h4>
          <p className="text-xs font-mono text-forest/70 mt-1">
            Join the active auction or preview our forensic audit standards.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/auctions/live"
            className="py-3 px-5 bg-lime hover:bg-lime-hover text-forest font-mono text-xs uppercase tracking-wider font-bold transition-all border border-forest/10 shadow-tactile"
          >
            Enter Live Saleroom
          </Link>
          <Link
            href="/transparency"
            className="py-3 px-4 bg-paper hover:bg-forest hover:text-paper text-forest font-mono text-xs uppercase tracking-wider transition-colors border border-stone-hairline"
          >
            Read Audit Standards
          </Link>
        </div>
      </div>
    </div>
  );
}
