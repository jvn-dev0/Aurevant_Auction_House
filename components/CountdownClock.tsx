'use client';

import React from 'react';
import { Clock, AlertTriangle, ShieldCheck } from 'lucide-react';

interface CountdownClockProps {
  remainingSeconds: number;
  extensionCount: number;
  isSoftCloseActive?: boolean;
  className?: string;
}

export function CountdownClock({
  remainingSeconds,
  extensionCount,
  isSoftCloseActive = false,
  className = '',
}: CountdownClockProps) {
  const isUrgent = remainingSeconds < 120 && remainingSeconds > 0;
  const isBoundary = remainingSeconds === 120;
  const isCapReached = extensionCount >= 10;
  const isClosed = remainingSeconds <= 0;

  const minutes = Math.floor(Math.max(0, remainingSeconds) / 60);
  const seconds = Math.max(0, remainingSeconds) % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return (
    <div
      role="timer"
      aria-label={`Auction closing countdown: ${timeFormatted}`}
      aria-live="polite"
      className={`border p-4 transition-all duration-300 ${
        isClosed
          ? 'bg-paper-dark border-stone-hairline text-forest/70'
          : isUrgent
          ? 'bg-paper border-lime ring-2 ring-lime/40'
          : 'bg-paper border-stone-hairline'
      } ${className}`}
    >
      <div className="flex items-center justify-between gap-4 mb-2">
        <div className="flex items-center gap-2 text-xs font-mono tracking-wider uppercase text-forest/80">
          <Clock className={`w-3.5 h-3.5 ${isUrgent ? 'text-forest animate-pulse' : 'text-forest/60'}`} />
          <span>Saleroom Countdown</span>
        </div>

        {/* Extension Badge */}
        <div className="flex items-center gap-1.5">
          <span
            className={`text-[11px] font-mono px-2 py-0.5 border ${
              isCapReached
                ? 'bg-red-100 text-red-900 border-red-300 font-semibold'
                : extensionCount > 0
                ? 'bg-lime text-forest border-lime font-medium'
                : 'bg-stone-surface text-forest/70 border-stone-hairline'
            }`}
          >
            Extensions: {extensionCount}/10
          </span>
        </div>
      </div>

      {/* Synchronized Big Counter */}
      <div className="flex items-baseline justify-between">
        <span
          className={`font-mono text-3xl sm:text-4xl font-bold tracking-tight ${
            isClosed
              ? 'text-forest/50'
              : isUrgent
              ? 'text-forest'
              : 'text-forest'
          }`}
        >
          {timeFormatted}
        </span>

        {/* Live Status Label */}
        <div className="text-right">
          {isClosed ? (
            <span className="text-xs font-mono uppercase tracking-widest text-forest font-bold bg-stone-hairline px-2 py-1">
              Lot Hammered
            </span>
          ) : isUrgent ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-mono uppercase tracking-wider text-forest bg-lime px-2 py-1 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-forest animate-ping"></span>
              Soft-Close Active
            </span>
          ) : (
            <span className="text-[11px] font-mono uppercase tracking-wider text-forest/60">
              Active Saleroom
            </span>
          )}
        </div>
      </div>

      {/* Descriptive Status Banner */}
      <div className="mt-2 pt-2 border-t border-stone-hairline/60 text-[11px] font-mono leading-tight">
        {isClosed ? (
          <p className="text-forest/60">Bidding has concluded for this specimen. Invoices generated in collector dashboard.</p>
        ) : isCapReached ? (
          <p className="text-red-800 font-medium">
            Maximum 10 extensions reached. Valid pre-deadline bids accepted under normal validation, but clock does not reset.
          </p>
        ) : isUrgent ? (
          <p className="text-forest font-medium">
            &lt; 00:02:00 remaining: Any qualifying bid triggers an automatic 120-second clock reset (ADR-012).
          </p>
        ) : isBoundary ? (
          <p className="text-forest/70">
            Exactly 00:02:00: Valid bids accepted without timer reset or extension consumption.
          </p>
        ) : (
          <p className="text-forest/60">
            Standard bidding. Anti-sniping soft-close activates when timer falls below 00:02:00.
          </p>
        )}
      </div>
    </div>
  );
}
