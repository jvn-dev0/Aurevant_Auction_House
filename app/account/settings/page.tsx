'use client';

import React, { useState } from 'react';
import { useChronoBid } from '@/lib/context';
import { SupportedCurrency, CURRENCY_CONFIGS } from '@/lib/currency';
import { AccountSubnav } from '@/components/AccountSubnav';
import {
  Sliders,
  User,
  Shield,
  CreditCard,
  CheckCircle2,
  Lock,
  Layers,
  Sparkles,
  Wallet,
  RefreshCw,
  PlusCircle,
  HelpCircle,
} from 'lucide-react';

export default function AccountSettingsPage() {
  const {
    user,
    currency,
    setCurrency,
    toggleConsignorRole,
    addToast,
    formatPrice,
    totalVaultBalanceUsd,
    reservedFundsUsd,
    availableToBidUsd,
    activeLotCommitments,
    setTotalVaultBalance,
    setVaultBalanceToInrFixture,
    resetVaultBalances,
  } = useChronoBid();

  const [collectorName, setCollectorName] = useState(user.name);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    addToast('Collector preferences successfully saved to local profile.', 'success');
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const activeCommitmentEntries = Object.entries(activeLotCommitments);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Universal Secondary Account Subnav */}
      <AccountSubnav />

      {/* Header */}
      <div className="border-b border-stone-hairline pb-6 space-y-2">
        <div className="text-xs font-mono uppercase tracking-widest text-forest/60">
          Collector Profile & Preferences
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-forest">
          Account Settings & Pre-Funded Vault
        </h1>
      </div>

      {/* Virtual Saleroom Paddle Card (TC-R10) */}
      <div className="p-8 bg-forest text-paper border border-forest-subtle shadow-tactile-hover flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative overflow-hidden">
        {/* Decorative Watermark */}
        <div className="absolute right-0 bottom-0 pointer-events-none opacity-10 font-serif italic text-9xl text-paper">
          CBV
        </div>

        <div className="space-y-3 z-10">
          <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-lime uppercase">
            <Shield className="w-3.5 h-3.5" />
            <span>Geneva Saleroom Virtual Credential</span>
          </div>
          <div>
            <span className="text-[11px] font-mono uppercase text-paper/60 block">
              Registered Collector Paddle
            </span>
            <span className="font-serif text-4xl sm:text-5xl font-bold text-paper tracking-tight">
              #{user.paddleNumber}
            </span>
          </div>
          <div className="text-xs font-mono text-paper/80">
            Assigned to: <strong className="text-paper">{user.name}</strong> • Status: <span className="text-lime font-bold">Verified Collector</span>
          </div>
        </div>

        <div className="z-10 bg-forest-subtle p-4 border border-paper/10 text-xs font-mono space-y-1 text-right sm:text-right">
          <span className="text-paper/60 block text-[10px] uppercase">Credit Authorization</span>
          <span className="font-bold text-paper text-sm">{formatPrice(totalVaultBalanceUsd)}</span>
          <span className="text-[10px] text-lime block">[SIMULATED PADDLE]</span>
        </div>
      </div>

      {/* PRE-FUNDED VAULT THREE-TIER BALANCE DASHBOARD (FR-VLT-01 through FR-VLT-06) */}
      <div className="bg-paper border border-stone-hairline p-6 sm:p-8 space-y-6 shadow-tactile">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-hairline gap-2">
          <div className="flex items-center gap-2.5">
            <Wallet className="w-5 h-5 text-forest" />
            <div>
              <h3 className="font-serif text-xl font-bold text-forest">
                Pre-Funded Vault Bidding Eligibility
              </h3>
              <p className="text-xs font-mono text-forest/70">
                Formula: Available to Bid = Total Vault Balance − Reserved Funds − Other Applicable Holds
              </p>
            </div>
          </div>
          <span className="text-xs font-mono bg-lime/40 text-forest font-bold px-2 py-0.5 border border-lime self-start sm:self-auto">
            [SANDBOX SIMULATION — NOT REAL FUNDS]
          </span>
        </div>

        {/* 3 Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono">
          <div className="p-4 bg-paper-dark border border-stone-hairline space-y-1">
            <span className="text-[11px] text-forest/60 uppercase block">1. Total Vault Balance</span>
            <span className="text-2xl font-bold text-forest block">{formatPrice(totalVaultBalanceUsd)}</span>
            <span className="text-[10px] text-forest/50 block">Recorded eligible collector funds</span>
          </div>

          <div className="p-4 bg-paper-dark border border-stone-hairline space-y-1">
            <span className="text-[11px] text-forest/60 uppercase block">2. Reserved Funds</span>
            <span className="text-2xl font-bold text-forest block">{formatPrice(reservedFundsUsd)}</span>
            <span className="text-[10px] text-forest/50 block">Committed to active leading bids</span>
          </div>

          <div className="p-4 bg-lime/20 border border-lime space-y-1">
            <span className="text-[11px] text-forest/70 uppercase block font-semibold">3. Available to Bid</span>
            <span className="text-2xl font-bold text-forest block">{formatPrice(availableToBidUsd)}</span>
            <span className="text-[10px] text-forest/70 block font-semibold">Net funds eligible for new bids</span>
          </div>
        </div>

        {/* Active Lot Commitments Table */}
        <div className="pt-2 border-t border-stone-hairline space-y-2">
          <span className="text-xs font-mono uppercase tracking-wider text-forest font-bold block">
            Active Leading Commitments ({activeCommitmentEntries.length})
          </span>
          {activeCommitmentEntries.length === 0 ? (
            <p className="text-xs font-mono text-forest/60 py-2">
              No funds currently reserved. Place a leading bid in the saleroom to allocate Vault reserves.
            </p>
          ) : (
            <div className="divide-y divide-stone-hairline border border-stone-hairline text-xs font-mono">
              {activeCommitmentEntries.map(([lotId, amount]) => (
                <div key={lotId} className="p-3 bg-paper-dark/60 flex items-center justify-between">
                  <span>Leading Lot: <strong>{lotId}</strong></span>
                  <span className="font-bold text-forest">Reserved: {formatPrice(amount)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Vault Simulation Controls */}
        <div className="p-4 bg-paper-dark border border-stone-hairline space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-widest text-forest/70 font-bold block">
            [VAULT SIMULATION & BENCHMARK TESTING FIXTURES]
          </span>
          <div className="flex flex-wrap gap-2 text-xs font-mono">
            <button
              type="button"
              onClick={() => setTotalVaultBalance(totalVaultBalanceUsd + 50000)}
              className="py-1.5 px-3 bg-paper hover:bg-lime border border-stone-hairline text-forest transition-colors flex items-center gap-1.5"
            >
              <PlusCircle className="w-3.5 h-3.5 text-forest" />
              <span>Add +$50,000 USD</span>
            </button>
            <button
              type="button"
              onClick={() => setVaultBalanceToInrFixture(100000)}
              className="py-1.5 px-3 bg-paper hover:bg-lime border border-stone-hairline text-forest transition-colors"
            >
              Load ₹1,00,000 Fixture (Test Benchmarks)
            </button>
            <button
              type="button"
              onClick={resetVaultBalances}
              className="py-1.5 px-3 bg-paper hover:bg-paper-dark border border-stone-hairline text-forest transition-colors flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3 text-forest/60" />
              <span>Reset to $150,000 Base</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="bg-paper border border-stone-hairline p-6 sm:p-8 space-y-8 shadow-tactile">
        {/* Profile Information */}
        <div className="space-y-4">
          <h3 className="font-serif text-xl font-bold text-forest border-b border-stone-hairline pb-2">
            Collector Identification
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label htmlFor="settings-name" className="text-xs font-mono uppercase text-forest/80 block">
                Full Legal Name / Entity
              </label>
              <input
                id="settings-name"
                type="text"
                value={collectorName}
                onChange={(e) => setCollectorName(e.target.value)}
                className="w-full px-3 py-2 bg-paper-dark border border-stone-hairline text-forest font-mono text-sm focus:outline-none focus:border-forest"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="settings-email" className="text-xs font-mono uppercase text-forest/80 block">
                Primary Notification Email
              </label>
              <input
                id="settings-email"
                type="email"
                value={user.email}
                disabled
                className="w-full px-3 py-2 bg-paper-dark/60 border border-stone-hairline text-forest/60 font-mono text-sm cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Currency Preference (ADR-021 & ADR-026: 8 Display Currencies) */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-stone-hairline pb-2 gap-1">
            <h3 className="font-serif text-xl font-bold text-forest">
              Display Currency Preference
            </h3>
            <span className="text-[10px] font-mono text-forest/60">
              ECB / RBI Reference Rates dated 16 Oct 2026 (Fixed Demo Multipliers)
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {(Object.keys(CURRENCY_CONFIGS) as SupportedCurrency[]).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCurrency(c)}
                className={`p-3 text-left border font-mono text-xs transition-all ${
                  currency === c
                    ? 'bg-lime text-forest border-lime font-bold shadow-tactile'
                    : 'bg-paper-dark text-forest/80 border-stone-hairline hover:border-forest'
                }`}
              >
                <div className="text-sm font-bold flex items-center justify-between">
                  <span>{c}</span>
                  <span className="text-forest/60">{CURRENCY_CONFIGS[c].symbol}</span>
                </div>
                <div className="text-[10px] text-forest/60 truncate mt-0.5">{CURRENCY_CONFIGS[c].name}</div>
                <div className="text-[10px] text-forest/70 mt-1">Rate: {CURRENCY_CONFIGS[c].multiplier}</div>
              </button>
            ))}
          </div>
          <p className="text-[11px] font-mono text-forest/60">
            *Note: Converted display figures are non-binding estimates. The base auction currency for all saleroom contracts remains USD.
          </p>
        </div>

        {/* Unified Account & Consignor Feature Capability (Section 3.1) */}
        <div className="space-y-4">
          <h3 className="font-serif text-xl font-bold text-forest border-b border-stone-hairline pb-2">
            Unified Account Capabilities
          </h3>
          <div className="p-4 bg-paper-dark border border-stone-hairline flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="font-serif text-base font-bold text-forest block">
                Consignor Privileges (Lot Intake & Appraisal Desk)
              </span>
              <p className="text-xs font-sans text-forest/70 leading-relaxed max-w-lg">
                Per Section 3.1 of project governance, buyers and consignors share a single unified profile.
                Enabling consignor features unlocks reserve price agreements and the private appraisal dashboard.
              </p>
            </div>

            <button
              type="button"
              onClick={toggleConsignorRole}
              className={`px-4 py-2 text-xs font-mono uppercase tracking-wider font-bold transition-all border ${
                user.isConsignorEnabled
                  ? 'bg-forest text-paper border-forest'
                  : 'bg-paper text-forest border-stone-hairline'
              }`}
            >
              {user.isConsignorEnabled ? 'Consignor Features Active' : 'Enable Consignor Mode'}
            </button>
          </div>
        </div>

        {/* Save CTA */}
        <div className="pt-4 border-t border-stone-hairline flex items-center justify-between">
          {savedSuccess && (
            <span className="text-xs font-mono text-lime-800 flex items-center gap-1 font-bold">
              <CheckCircle2 className="w-4 h-4 text-lime-700" />
              <span>Preferences saved.</span>
            </span>
          )}
          <button
            type="submit"
            className="ml-auto py-2.5 px-6 bg-forest hover:bg-forest-hover text-paper font-mono text-xs uppercase tracking-wider font-bold transition-colors shadow-tactile"
          >
            Save Preferences
          </button>
        </div>
      </form>
    </div>
  );
}
