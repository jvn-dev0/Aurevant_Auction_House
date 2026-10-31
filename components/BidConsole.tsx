'use client';

import React, { useState } from 'react';
import { useChronoBid } from '@/lib/context';
import { getNextMinimumBid, getTierForAmount, validateCustomBid } from '@/lib/bidding';
import {
  ArrowUpRight,
  Shield,
  Zap,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Wallet,
  AlertTriangle,
  Info,
} from 'lucide-react';

export function BidConsole() {
  const {
    currentBidUsd,
    highestBidderPaddle,
    remainingSeconds,
    extensionCount,
    isSaleroomClosed,
    user,
    currency,
    formatPrice,
    formatDualPrice,
    getExchangeRateNotice,
    totalVaultBalanceUsd,
    reservedFundsUsd,
    availableToBidUsd,
    activeLotCommitments,
    placeQuickBid,
    placeCustomBid,
    setProxyCeiling,
    userProxyCeilingUsd,
    setRemainingTimeManually,
    setExtensionCountManually,
    resetSaleroomAuction,
    runBenchmark1,
    runBenchmark2,
    setVaultBalanceToInrFixture,
    resetVaultBalances,
  } = useChronoBid();

  const nextAskUsd = getNextMinimumBid(currentBidUsd);
  const currentTier = getTierForAmount(currentBidUsd);

  const [customBidInput, setCustomBidInput] = useState<string>('');
  const [proxyInput, setProxyInput] = useState<string>('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [vaultShortfallError, setVaultShortfallError] = useState<string | null>(null);
  const [suggestedBids, setSuggestedBids] = useState<{ below?: number; above?: number } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Check if next ask is affordable under current availableToBidUsd
  const isNextAskAffordable = nextAskUsd <= availableToBidUsd;
  const nextAskShortfallUsd = nextAskUsd > availableToBidUsd ? nextAskUsd - availableToBidUsd : 0;

  const handleCustomBidChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    setCustomBidInput(val);
    if (!val) {
      setValidationError(null);
      setVaultShortfallError(null);
      setSuggestedBids(null);
      return;
    }
    const num = parseInt(val, 10);

    // 1. Validate against increment ladder (ADR-019 Option B)
    const check = validateCustomBid(num, currentBidUsd);
    if (!check.valid) {
      setValidationError(check.message || 'Invalid increment alignment.');
      setSuggestedBids({
        below: check.nearestValidBelow,
        above: check.nearestValidAbove,
      });
    } else {
      setValidationError(null);
      setSuggestedBids(null);
    }

    // 2. Validate against available Vault balance (FR-VLT-02)
    if (num > availableToBidUsd) {
      const shortfall = num - availableToBidUsd;
      setVaultShortfallError(
        `Bid not accepted. Your available Vault balance is insufficient for this bid. Add eligible funds or reduce your bid amount. (Shortfall: ${formatPrice(shortfall)})`
      );
    } else {
      setVaultShortfallError(null);
    }
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customBidInput) return;
    const amount = parseInt(customBidInput, 10);
    setIsSubmitting(true);
    setTimeout(() => {
      const res = placeCustomBid(amount);
      if (res.success) {
        setCustomBidInput('');
        setValidationError(null);
        setVaultShortfallError(null);
        setSuggestedBids(null);
      }
      setIsSubmitting(false);
    }, 200);
  };

  const handleQuickBid = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      placeQuickBid();
      setIsSubmitting(false);
    }, 200);
  };

  const handleProxySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!proxyInput) return;
    const amount = parseInt(proxyInput, 10);
    setProxyCeiling(amount);
    setProxyInput('');
  };

  const isUserWinning = highestBidderPaddle === user.paddleNumber;

  return (
    <div className="bg-paper border border-stone-hairline p-5 space-y-5">
      {/* Saleroom Header & High Bid Info with Dual-Currency Display (ADR-026) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-hairline gap-3">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-forest/70 block">
            Current High Bid
          </span>
          <div className="space-y-0.5">
            <span className="font-mono text-3xl font-bold text-forest block">
              {formatPrice(currentBidUsd)}
            </span>
            {currency !== 'USD' && (
              <span className="text-xs font-mono text-forest/60 block">
                Official Base: ${currentBidUsd.toLocaleString()} USD
              </span>
            )}
          </div>
          <div className="mt-1">
            <span className="text-[10px] font-mono text-forest/50">
              {getExchangeRateNotice()}
            </span>
          </div>
        </div>

        {/* Highest Bidder Paddle */}
        <div className="text-left sm:text-right">
          <span className="text-[11px] font-mono uppercase tracking-widest text-forest/70 block">
            Active Bidder
          </span>
          <span
            className={`inline-block font-mono text-sm px-2.5 py-1 border font-semibold ${
              isUserWinning
                ? 'bg-lime text-forest border-lime'
                : 'bg-paper-dark text-forest border-stone-hairline'
            }`}
          >
            {isUserWinning ? `Your Paddle #${user.paddleNumber} (Winning)` : `Paddle #${highestBidderPaddle}`}
          </span>
        </div>
      </div>

      {/* PRE-FUNDED VAULT ELIGIBILITY STATUS CARD (FR-VLT-01 through FR-VLT-06) */}
      <div className="p-3.5 bg-paper-dark border border-stone-hairline space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono uppercase tracking-wider text-forest font-bold flex items-center gap-1.5">
            <Wallet className="w-3.5 h-3.5 text-forest/80" />
            <span>Pre-Funded Vault Status</span>
          </span>
          <span className="text-[10px] font-mono bg-lime/40 text-forest font-bold px-1.5 py-0.2 border border-lime">
            [DEMO DATA]
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 font-mono text-xs pt-1 border-t border-stone-hairline/60">
          <div>
            <span className="text-[10px] text-forest/60 uppercase block">Total Balance</span>
            <span className="font-bold text-forest">{formatPrice(totalVaultBalanceUsd)}</span>
          </div>
          <div>
            <span className="text-[10px] text-forest/60 uppercase block">Reserved Funds</span>
            <span className="font-bold text-forest">{formatPrice(reservedFundsUsd)}</span>
          </div>
          <div>
            <span className="text-[10px] text-forest/60 uppercase block">Available to Bid</span>
            <span className={`font-bold ${availableToBidUsd > 0 ? 'text-forest' : 'text-red-700'}`}>
              {formatPrice(availableToBidUsd)}
            </span>
          </div>
        </div>

        {/* Live Affordability Notice */}
        {!isNextAskAffordable && (
          <div role="alert" className="p-2 bg-amber-50 border border-amber-300 text-amber-900 text-xs font-mono flex items-start gap-1.5 mt-2">
            <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0 text-amber-700" />
            <span>
              Next ask ({formatPrice(nextAskUsd)}) exceeds your Available Vault Balance. Shortfall: {formatPrice(nextAskShortfallUsd)}. Add funds to qualify.
            </span>
          </div>
        )}
      </div>

      {/* Quick Bid Button */}
      <div>
        <div className="flex justify-between items-center text-xs font-mono text-forest/80 mb-2">
          <span>Next Minimum Ask:</span>
          <span className="font-semibold text-forest">
            {formatPrice(nextAskUsd)} (+${currentTier.increment.toLocaleString()} increment)
          </span>
        </div>

        <button
          onClick={handleQuickBid}
          disabled={isSaleroomClosed || isSubmitting || !isNextAskAffordable}
          aria-label={`Place next bid of ${formatPrice(nextAskUsd)}`}
          className="w-full py-3.5 px-4 bg-lime hover:bg-lime-hover active:scale-[0.99] text-forest font-mono font-bold text-sm tracking-wide transition-all border border-forest/10 flex items-center justify-center gap-2 shadow-tactile disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Zap className="w-4 h-4 fill-forest" />
          <span>
            {isSaleroomClosed
              ? 'Auction Saleroom Closed'
              : !isNextAskAffordable
              ? `Insufficient Funds: Need ${formatPrice(nextAskUsd)}`
              : `Quick Bid Next Ask: ${formatPrice(nextAskUsd)}`}
          </span>
        </button>
      </div>

      {/* Custom Jump-Bid Form (ADR-019 Option B Destination-Tier Ladder & FR-VLT-02) */}
      <form onSubmit={handleCustomSubmit} className="space-y-2 pt-2 border-t border-stone-hairline">
        <label htmlFor="custom-bid-input" className="block text-xs font-mono uppercase tracking-wider text-forest/80">
          Place Custom Jump-Bid (Option B Ladder Model)
        </label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-sm text-forest/60">
              $
            </span>
            <input
              id="custom-bid-input"
              type="text"
              value={customBidInput}
              onChange={handleCustomBidChange}
              placeholder={`Min ${nextAskUsd.toLocaleString()}`}
              disabled={isSaleroomClosed || isSubmitting}
              className="w-full pl-7 pr-3 py-2 bg-paper-dark border border-stone-hairline text-forest font-mono text-sm focus:outline-none focus:border-forest transition-colors disabled:opacity-40"
            />
          </div>
          <button
            type="submit"
            disabled={isSaleroomClosed || isSubmitting || !customBidInput || !!validationError || !!vaultShortfallError}
            className="px-5 py-2 bg-forest text-paper hover:bg-forest-hover font-mono text-xs uppercase tracking-wider transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Submit Bid
          </button>
        </div>

        {/* Option B Increment Validation Error */}
        {validationError && (
          <div role="alert" className="p-2.5 bg-red-50 border border-red-200 text-red-900 text-xs font-mono space-y-1">
            <div className="flex items-start gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0 text-red-600" />
              <span>{validationError}</span>
            </div>
            {suggestedBids && (
              <div className="flex items-center gap-2 pt-1">
                <span className="text-[11px] text-red-700">Valid increments:</span>
                {suggestedBids.below && (
                  <button
                    type="button"
                    onClick={() => {
                      setCustomBidInput(String(suggestedBids.below));
                      setValidationError(null);
                      setSuggestedBids(null);
                    }}
                    className="underline text-forest hover:text-forest-hover"
                  >
                    ${suggestedBids.below.toLocaleString()}
                  </button>
                )}
                {suggestedBids.above && (
                  <button
                    type="button"
                    onClick={() => {
                      setCustomBidInput(String(suggestedBids.above));
                      setValidationError(null);
                      setSuggestedBids(null);
                    }}
                    className="underline text-forest hover:text-forest-hover"
                  >
                    ${suggestedBids.above.toLocaleString()}
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* FR-VLT-02 / FR-VLT-06 Vault Insufficient Funds Error */}
        {vaultShortfallError && (
          <div role="alert" className="p-2.5 bg-red-50 border border-red-300 text-red-950 text-xs font-mono flex items-start gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0 text-red-700" />
            <span>{vaultShortfallError}</span>
          </div>
        )}
      </form>

      {/* Proxy Bidding Ceiling */}
      <form onSubmit={handleProxySubmit} className="space-y-2 pt-2 border-t border-stone-hairline">
        <div className="flex items-center justify-between">
          <label htmlFor="proxy-bid-input" className="text-xs font-mono uppercase tracking-wider text-forest/80 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-forest/70" />
            <span>Confidential Proxy Ceiling</span>
          </label>
          {userProxyCeilingUsd && (
            <span className="text-[11px] font-mono text-forest bg-lime/40 px-2 py-0.5 border border-lime">
              Active: ${userProxyCeilingUsd.toLocaleString()}
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-sm text-forest/60">
              $
            </span>
            <input
              id="proxy-bid-input"
              type="text"
              value={proxyInput}
              onChange={(e) => setProxyInput(e.target.value.replace(/[^0-9]/g, ''))}
              placeholder="Enter maximum ceiling"
              disabled={isSaleroomClosed}
              className="w-full pl-7 pr-3 py-2 bg-paper-dark border border-stone-hairline text-forest font-mono text-sm focus:outline-none focus:border-forest transition-colors disabled:opacity-40"
            />
          </div>
          <button
            type="submit"
            disabled={isSaleroomClosed || !proxyInput}
            className="px-4 py-2 border border-forest text-forest hover:bg-forest hover:text-paper font-mono text-xs uppercase tracking-wider transition-colors disabled:opacity-40"
          >
            Set Proxy
          </button>
        </div>
      </form>

      {/* Interactive Prototype Simulation Controls (Soft-close, Caps, & Vault Benchmarks) */}
      <div className="p-3 bg-paper-dark/70 border border-stone-hairline/80 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono uppercase tracking-widest text-forest/70 font-semibold block">
            [SANDBOX SIMULATION CONTROLS — ADR-012 & VAULT BENCHMARKS]
          </span>
        </div>

        {/* Soft Close Simulation Controls */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-[10px] font-mono">
          <button
            type="button"
            onClick={() => setRemainingTimeManually(45)}
            className="p-1.5 bg-paper hover:bg-lime border border-stone-hairline text-forest transition-colors text-left"
          >
            Set &lt;120s (45s)
          </button>
          <button
            type="button"
            onClick={() => setRemainingTimeManually(120)}
            className="p-1.5 bg-paper hover:bg-lime border border-stone-hairline text-forest transition-colors text-left"
          >
            Set 02:00 Boundary
          </button>
          <button
            type="button"
            onClick={() => setExtensionCountManually(10)}
            className="p-1.5 bg-paper hover:bg-lime border border-stone-hairline text-forest transition-colors text-left"
          >
            Set Cap (10/10)
          </button>
          <button
            type="button"
            onClick={() => setRemainingTimeManually(0)}
            className="p-1.5 bg-paper hover:bg-lime border border-stone-hairline text-forest transition-colors text-left"
          >
            Simulate Closed
          </button>
        </div>

        {/* Vault Affordability Benchmark Controls */}
        <div className="pt-2 border-t border-stone-hairline/60 space-y-1.5">
          <span className="text-[10px] font-mono uppercase text-forest/60 font-semibold block">
            Mandatory Vault Benchmarks (ADR-025 & ADR-026):
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[10px] font-mono">
            <button
              type="button"
              onClick={runBenchmark1}
              className="p-1.5 bg-paper hover:bg-lime border border-stone-hairline text-forest transition-colors text-left"
              title="A bidder with ₹1,00,000 available attempting ₹2,00,000 bid must be rejected"
            >
              <strong>Benchmark 1:</strong> ₹1L Avail vs ₹2L Bid Reject
            </button>
            <button
              type="button"
              onClick={runBenchmark2}
              className="p-1.5 bg-paper hover:bg-lime border border-stone-hairline text-forest transition-colors text-left"
              title="₹1,00,000 available: Lot A ₹70,000 accepted; Lot B ₹60,000 rejected"
            >
              <strong>Benchmark 2:</strong> Cross-Lot Multi-Bid Reject
            </button>
          </div>
          <div className="grid grid-cols-2 gap-1.5 text-[10px] font-mono pt-1">
            <button
              type="button"
              onClick={() => setVaultBalanceToInrFixture(100000)}
              className="p-1.5 bg-paper hover:bg-paper-dark border border-stone-hairline text-forest text-left"
            >
              Set Vault to ₹1,00,000 Fixture
            </button>
            <button
              type="button"
              onClick={resetVaultBalances}
              className="p-1.5 bg-paper hover:bg-paper-dark border border-stone-hairline text-forest text-left"
            >
              Reset Vault ($150,000)
            </button>
          </div>
        </div>

        <div className="pt-1 flex items-center justify-end">
          <button
            type="button"
            onClick={resetSaleroomAuction}
            className="text-[10px] font-mono p-1 text-forest/70 hover:text-forest flex items-center gap-1 underline"
          >
            <RefreshCw className="w-2.5 h-2.5" />
            <span>Reset Saleroom Demo State</span>
          </button>
        </div>
      </div>
    </div>
  );
}
