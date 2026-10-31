'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useChronoBid, ConsignmentStatus } from '@/lib/context';
import { AccountSubnav } from '@/components/AccountSubnav';
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  ExternalLink,
  ShieldAlert,
  DollarSign,
  TrendingUp,
  XCircle,
  Layers,
  Sparkles,
} from 'lucide-react';

export default function AccountConsignmentsPage() {
  const {
    consignments,
    toggleReserveAgreement,
    resetConsignments,
    consignorSalesHistory,
    user,
    formatPrice,
    unreadNotificationCount,
  } = useChronoBid();

  const [activeTab, setActiveTab] = useState<'tickets' | 'sales'>('tickets');

  const statusBadgeMap: Record<ConsignmentStatus, { label: string; className: string }> = {
    'Under Specialist Review': {
      label: 'Under Specialist Review',
      className: 'bg-amber-100 text-amber-900 border-amber-300',
    },
    'Information Requested': {
      label: 'Information Requested',
      className: 'bg-orange-100 text-orange-900 border-orange-300 font-bold',
    },
    'Valuation Issued': {
      label: 'Specialist Valuation Issued',
      className: 'bg-lime/40 text-forest border-lime font-bold',
    },
    'Reserve Approved': {
      label: 'Reserve Approved for Saleroom',
      className: 'bg-emerald-100 text-emerald-950 border-emerald-400 font-bold',
    },
    'Consignment Declined': {
      label: 'Consignment Declined',
      className: 'bg-stone-200 text-stone-800 border-stone-300',
    },
    'Inspection Scheduled': {
      label: 'Physical Inspection Scheduled',
      className: 'bg-blue-100 text-blue-950 border-blue-300',
    },
  };

  const totalRealizedHammerUsd = consignorSalesHistory
    .filter((s) => s.hammerPriceUsd !== null)
    .reduce((sum, s) => sum + (s.hammerPriceUsd || 0), 0);

  const totalNetProceedsUsd = consignorSalesHistory
    .filter((s) => s.simulatedNetProceedsUsd !== null)
    .reduce((sum, s) => sum + (s.simulatedNetProceedsUsd || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Universal Secondary Account Subnav */}
      <AccountSubnav />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-stone-hairline gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-forest/60">
            <span>Consignor Dashboard</span>
            <span>•</span>
            <span>Paddle #{user.paddleNumber}</span>
            <span className="px-1.5 py-0.2 bg-lime/40 text-forest text-[10px] font-bold">
              [Consignor Privileges Active]
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-forest mt-1">
            Private Consignments &amp; Realisations
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="py-2.5 px-4 bg-paper-dark hover:bg-forest hover:text-paper text-forest font-mono text-xs uppercase tracking-wider transition-colors border border-stone-hairline flex items-center gap-1.5"
            title="Inspect these tickets as a curator specialist in the admin console"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-lime-700" />
            <span>Specialist Desk [Demo]</span>
          </Link>
          <Link
            href="/consign"
            className="py-2.5 px-5 bg-lime hover:bg-lime-hover text-forest font-mono text-xs uppercase tracking-wider font-bold transition-all border border-forest/10 flex items-center gap-1.5 shadow-tactile"
          >
            <span>Consign New Lot</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Persistent Account Navigation Sub-Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-2 bg-paper-dark border border-stone-hairline font-mono text-xs">
        <div className="flex flex-wrap items-center gap-1">
          <Link
            href="/account/bids"
            className="px-3 py-1.5 text-forest/70 hover:text-forest hover:bg-paper transition-colors"
          >
            My Bids &amp; Watchlist
          </Link>
          <Link
            href="/account/consignments"
            className="px-3 py-1.5 bg-forest text-paper font-semibold shadow-tactile"
          >
            Consignment Tickets &amp; Sales
          </Link>
          <Link
            href="/account/notifications"
            className="px-3 py-1.5 text-forest/70 hover:text-forest hover:bg-paper transition-colors flex items-center gap-1.5"
          >
            <span>Notifications</span>
            {unreadNotificationCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-lime text-forest text-[10px] font-bold flex items-center justify-center">
                {unreadNotificationCount}
              </span>
            )}
          </Link>
          <Link
            href="/account/settings"
            className="px-3 py-1.5 text-forest/70 hover:text-forest hover:bg-paper transition-colors"
          >
            Paddle &amp; Preferences
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-2 text-forest/60 text-[11px] pr-2">
          <span>Active Consignor Portal</span>
        </div>
      </div>

      {/* Mandatory Governance Notice */}
      <div className="p-4 bg-amber-50 border border-amber-300 text-amber-950 font-mono text-xs space-y-1">
        <span className="font-bold uppercase text-[10px] block text-amber-900">
          Governance Disclosure (Phase 1 Baseline §4.3 &amp; §5.2):
        </span>
        <p className="leading-relaxed">
          The 48-hour specialist appraisal feedback timeline is classified strictly as <strong>[SIMULATED DEMO FEEDBACK — NOT A LEGAL SLA]</strong>.
          Reserve agreements and post-sale settlement proceeds below represent client-side demonstration workflows. Payouts and escrow settlements are proposed future services.
        </p>
      </div>

      {/* Primary Section Tabs: Active Intake Tickets vs Completed Sales & Realisations */}
      <div className="flex items-center justify-between border-b border-stone-hairline pb-2">
        <div className="flex gap-2" role="tablist" aria-label="Consignment Dashboard Sections">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'tickets'}
            onClick={() => setActiveTab('tickets')}
            className={`px-4 py-2 text-xs font-mono uppercase tracking-wider transition-all border flex items-center gap-2 ${
              activeTab === 'tickets'
                ? 'bg-forest text-paper border-forest font-bold shadow-tactile'
                : 'bg-paper text-forest/70 border-stone-hairline hover:border-forest hover:text-forest'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Active Intake Tickets ({consignments.length})</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'sales'}
            onClick={() => setActiveTab('sales')}
            className={`px-4 py-2 text-xs font-mono uppercase tracking-wider transition-all border flex items-center gap-2 ${
              activeTab === 'sales'
                ? 'bg-forest text-paper border-forest font-bold shadow-tactile'
                : 'bg-paper text-forest/70 border-stone-hairline hover:border-forest hover:text-forest'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Completed Sales &amp; Realisations ({consignorSalesHistory.length})</span>
          </button>
        </div>

        {activeTab === 'tickets' && (
          <button
            type="button"
            onClick={resetConsignments}
            className="text-xs font-mono text-forest/70 hover:text-forest flex items-center gap-1"
            title="Reset to 5 demo tickets"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden sm:inline">Reset Demo Tickets</span>
          </button>
        )}
      </div>

      {/* TAB 1: ACTIVE INTAKE TICKETS */}
      {activeTab === 'tickets' && (
        <>
          {consignments.length === 0 ? (
            <div className="p-12 text-center bg-paper border border-stone-hairline space-y-4 shadow-tactile">
              <div className="w-16 h-16 mx-auto rounded-full bg-paper-dark border border-stone-hairline flex items-center justify-center">
                <FileText className="w-8 h-8 text-forest/50" />
              </div>
              <div className="space-y-1 max-w-md mx-auto">
                <h3 className="font-serif text-2xl font-bold text-forest">
                  No Active Consignment Tickets on Record
                </h3>
                <p className="text-xs font-mono text-forest/70 leading-relaxed">
                  Submit a rare collectible to our senior curatorial appraisal desk to initiate physical assay, provenance research, and reserve price establishment.
                </p>
              </div>
              <div className="pt-2 flex justify-center gap-3">
                <Link
                  href="/consign"
                  className="py-2.5 px-5 bg-lime hover:bg-lime-hover text-forest font-mono text-xs uppercase tracking-wider font-bold transition-all border border-forest/10"
                >
                  Start New Consignment
                </Link>
                <button
                  type="button"
                  onClick={resetConsignments}
                  className="py-2.5 px-4 bg-paper-dark hover:bg-paper border border-stone-hairline text-forest font-mono text-xs uppercase tracking-wider"
                >
                  Restore Demonstration Tickets
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {consignments.map((ticket) => {
                const badge = statusBadgeMap[ticket.status] || {
                  label: ticket.status,
                  className: 'bg-paper-dark text-forest',
                };

                return (
                  <div
                    key={ticket.ticketId}
                    className="p-6 bg-paper border border-stone-hairline shadow-tactile space-y-4 hover:border-forest/50 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-hairline gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-forest">
                            {ticket.ticketId}
                          </span>
                          <span className="text-[10px] font-mono text-forest/60">
                            • Submitted {ticket.submittedAt}
                          </span>
                          {ticket.category && (
                            <span className="px-1.5 py-0.2 bg-paper-dark border border-stone-hairline text-[10px] font-mono text-forest/70 uppercase">
                              {ticket.category}
                            </span>
                          )}
                        </div>
                        <h3 className="font-serif text-xl sm:text-2xl font-bold text-forest mt-0.5">
                          {ticket.manufacturer} {ticket.reference}
                        </h3>
                        <span className="font-mono text-xs text-forest/70 block">
                          Period: {ticket.year} • Condition: {ticket.condition}
                        </span>
                      </div>

                      <div className="flex flex-col items-start sm:items-end gap-1.5">
                        <span
                          className={`font-mono text-xs px-3 py-1 border rounded-none ${badge.className}`}
                        >
                          {badge.label}
                        </span>
                        <span className="text-[10px] font-mono text-forest/60">
                          Target Reserve: <strong className="text-forest font-bold">${Number(ticket.reserveEstimateUsd).toLocaleString()} USD</strong>
                        </span>
                      </div>
                    </div>

                    {/* Curatorial Feedback & Valuation Section */}
                    {(ticket.status === 'Valuation Issued' ||
                      ticket.status === 'Reserve Approved' ||
                      ticket.specialistNotes) && (
                      <div className="p-4 bg-paper-dark border border-stone-hairline space-y-2">
                        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-forest font-bold">
                          <ShieldCheck className="w-4 h-4 text-lime-800" />
                          <span>Curatorial Specialist Finding &amp; Valuation</span>
                        </div>
                        {ticket.valuationEstimateLowUsd && (
                          <div className="font-mono text-xs text-forest/80">
                            <span>Specialist Valuation Range: </span>
                            <span className="font-bold text-forest">
                              ${ticket.valuationEstimateLowUsd.toLocaleString()} – ${ticket.valuationEstimateHighUsd?.toLocaleString()} USD
                            </span>
                          </div>
                        )}
                        {ticket.specialistNotes && (
                          <p className="font-sans text-xs text-forest/80 pt-1 italic">
                            Specialist Memo: &ldquo;{ticket.specialistNotes}&rdquo;
                          </p>
                        )}
                      </div>
                    )}

                    {/* Reserve Acceptance Interactive Toggle (ADR-019 / TC-R09) */}
                    <div className="p-4 bg-paper-dark border border-stone-hairline flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-0.5">
                        <span className="text-xs font-mono font-bold text-forest block">
                          Confidential Specialist Reserve Agreement:
                        </span>
                        <span className="text-[11px] font-mono text-forest/70">
                          {ticket.reserveAgreed
                            ? 'Confirmed: Lot will not be hammered below the agreed reserve threshold.'
                            : 'Awaiting consignor digital agreement to formal specialist reserve.'}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => toggleReserveAgreement(ticket.ticketId)}
                        className={`px-3 py-1.5 font-mono text-xs flex items-center gap-2 border transition-all ${
                          ticket.reserveAgreed
                            ? 'bg-forest text-paper border-forest font-semibold'
                            : 'bg-paper text-forest border-stone-hairline hover:border-forest'
                        }`}
                      >
                        {ticket.reserveAgreed ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-lime" />
                            <span>Reserve Formally Agreed</span>
                          </>
                        ) : (
                          <>
                            <Clock className="w-3.5 h-3.5 text-forest/60" />
                            <span>Click to Sign Reserve Agreement</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* TAB 2: COMPLETED CONSIGNMENT SALES & REALISATIONS (FEATURE D) */}
      {activeTab === 'sales' && (
        <div className="space-y-6">
          {/* Consignor Financial Summary Metrics Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
            <div className="p-4 bg-paper border border-stone-hairline shadow-tactile space-y-1">
              <span className="text-[10px] uppercase text-forest/60 block">Total Realised Hammer</span>
              <span className="text-2xl font-bold text-forest block">
                {formatPrice(totalRealizedHammerUsd)}
              </span>
              <span className="text-[11px] text-forest/70">Across 3 Hammered Lots</span>
            </div>

            <div className="p-4 bg-paper border border-stone-hairline shadow-tactile space-y-1">
              <span className="text-[10px] uppercase text-forest/60 block">Simulated Net Proceeds</span>
              <span className="text-2xl font-bold text-emerald-950 block">
                {formatPrice(totalNetProceedsUsd)}
              </span>
              <span className="text-[11px] text-emerald-800">After 10% Consignor Commission [DEMO]</span>
            </div>

            <div className="p-4 bg-paper border border-stone-hairline shadow-tactile space-y-1">
              <span className="text-[10px] uppercase text-forest/60 block">Settlement Status</span>
              <span className="text-2xl font-bold text-forest block">Swiss Escrow</span>
              <span className="text-[11px] text-forest/70">Segregated Bonded Custody</span>
            </div>
          </div>

          {/* Historical Realisations List */}
          <div className="space-y-4">
            {consignorSalesHistory.map((item) => (
              <div
                key={item.id}
                className="p-6 bg-paper border border-stone-hairline shadow-tactile space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-hairline gap-3">
                  <div>
                    <div className="flex items-center gap-2 text-[10px] font-mono text-forest/60">
                      <span className="font-bold text-forest">{item.ticketId}</span>
                      <span>•</span>
                      <span>{item.sessionTitle}</span>
                      <span>•</span>
                      <span>{item.saleDate}</span>
                    </div>

                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-forest mt-0.5">
                      {item.lotTitle}
                    </h3>
                    <span className="font-mono text-xs text-forest/70 block">
                      {item.category} • Reference: {item.lotReference}
                    </span>
                  </div>

                  <div className="flex flex-col items-start sm:items-end gap-1">
                    {item.saleOutcome === 'sold' ? (
                      <span className="inline-flex items-center gap-1 font-mono text-xs font-bold px-2.5 py-1 bg-emerald-100 text-emerald-950 border border-emerald-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Sold at Hammer</span>
                      </span>
                    ) : item.saleOutcome === 'bought_in' ? (
                      <span className="inline-flex items-center gap-1 font-mono text-xs font-bold px-2.5 py-1 bg-amber-100 text-amber-950 border border-amber-300">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-700" />
                        <span>Reserve Not Met (Bought In)</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 font-mono text-xs font-bold px-2.5 py-1 bg-stone-200 text-stone-800 border border-stone-300">
                        <XCircle className="w-3.5 h-3.5 text-stone-600" />
                        <span>Withdrawn Prior to Session</span>
                      </span>
                    )}

                    <span className="text-[10px] font-mono text-forest/60">
                      Agreed Reserve: <strong className="text-forest font-bold">${item.reserveUsd.toLocaleString()} USD</strong>
                    </span>
                  </div>
                </div>

                {/* Realisation & Net Proceeds Ledger */}
                <div className="p-4 bg-paper-dark border border-stone-hairline grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
                  <div>
                    <span className="text-[10px] uppercase text-forest/60 block">Hammer Realisation</span>
                    <span className="text-forest font-bold text-base block mt-0.5">
                      {item.hammerPriceUsd ? `$${item.hammerPriceUsd.toLocaleString()} USD` : '—'}
                    </span>
                    <span className="text-[10px] text-forest/60">Final Saleroom Bid</span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase text-forest/60 block">Consignor Net Proceeds</span>
                    <span className="text-emerald-950 font-bold text-base block mt-0.5">
                      {item.simulatedNetProceedsUsd ? `$${item.simulatedNetProceedsUsd.toLocaleString()} USD` : '—'}
                    </span>
                    <span className="text-[10px] text-forest/60">Less 10% Consignor Fee [DEMO]</span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase text-forest/60 block">Settlement Vault Status</span>
                    <span className="text-forest font-medium block mt-0.5">
                      {item.settlementStatus}
                    </span>
                    <span className="text-[10px] text-forest/50">Swiss Escrow Custody</span>
                  </div>
                </div>

                {/* Dossier Link */}
                {item.lotSlug && (
                  <div className="pt-1 flex justify-end font-mono text-xs">
                    <Link
                      href={`/auctions/lots/${item.lotSlug}`}
                      className="text-forest hover:text-lime-900 font-semibold inline-flex items-center gap-1.5"
                    >
                      <span>Inspect Official Catalog Dossier</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
