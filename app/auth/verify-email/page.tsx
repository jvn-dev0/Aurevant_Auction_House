'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useChronoBid } from '@/lib/context';
import {
  ShieldCheck,
  Mail,
  KeyRound,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Compass,
  Radio,
  FileText,
  Sliders,
} from 'lucide-react';

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams?.get('email') || 'collector@horologyvault.ch';
  const nameParam = searchParams?.get('name') || 'Registered Collector';

  const { loginUser, addToast } = useChronoBid();

  const [pin, setPin] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  // 60-second resend cooldown timer
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    // Tested PIN rule: Arbitrary prototype fixture "123456"
    if (pin === '123456') {
      setIsVerified(true);
      setError(null);
      addToast('Email verified successfully with prototype PIN 123456.', 'success');
    } else {
      setError('Invalid verification PIN. Please re-enter or use prototype PIN 123456.');
    }
  };

  const handleResend = () => {
    if (cooldown === 0) {
      setCooldown(60);
      addToast(`A fresh verification PIN has been dispatched to ${emailParam}. (Demo fixture: 123456)`, 'info');
    }
  };

  const handleRouteByIntent = (path: string, intentLabel: string) => {
    const newPaddle = String(Math.floor(5000 + Math.random() * 4000));
    loginUser(emailParam, newPaddle);
    addToast(`Welcome! Paddle #${newPaddle} assigned. Routing to ${intentLabel}.`, 'success');
    router.push(path);
  };

  return (
    <div className="w-full max-w-md bg-paper border border-stone-hairline p-6 sm:p-8 space-y-6 shadow-tactile">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className="w-10 h-10 mx-auto border border-forest bg-paper-dark flex items-center justify-center font-serif italic text-xl text-forest">
          CB
        </div>
        <h1 className="font-serif text-3xl font-bold text-forest">
          {isVerified ? 'Select Saleroom Intent' : 'Verify Collector Email'}
        </h1>
        <p className="text-xs font-mono text-forest/60">
          {isVerified
            ? 'Step 3 of 3: Choose your initial saleroom destination.'
            : `Step 2 of 3: Enter the 6-digit security PIN sent to ${emailParam}`}
        </p>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center justify-between text-[11px] font-mono border-b border-stone-hairline pb-3">
        <span className="text-forest/60">1. Credentials ✓</span>
        <span className="text-forest/40">→</span>
        <span className={`font-bold ${!isVerified ? 'text-forest' : 'text-forest/60'}`}>
          2. PIN Verify {isVerified && '✓'}
        </span>
        <span className="text-forest/40">→</span>
        <span className={`font-bold ${isVerified ? 'text-forest' : 'text-forest/40'}`}>
          3. Intent Routing
        </span>
      </div>

      {!isVerified ? (
        /* STEP 2: PIN ENTRY FORM */
        <div className="space-y-5">
          {error && (
            <div role="alert" className="p-3 bg-red-50 border border-red-200 text-red-900 text-xs font-mono flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleVerify} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="verify-pin-input" className="text-sm font-sans font-medium text-forest block tracking-normal">
                6-Digit Security PIN *
              </label>
              <div className="relative">
                <KeyRound className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-forest/40" />
                <input
                  id="verify-pin-input"
                  type="text"
                  maxLength={6}
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="123456"
                  required
                  className="w-full pl-11 pr-4 py-3 bg-paper-dark border border-stone-hairline text-forest font-mono text-base tracking-widest text-center focus:outline-none focus:border-forest transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={pin.length < 6}
              className="w-full py-3 px-4 bg-forest hover:bg-forest-hover text-paper font-mono text-xs uppercase tracking-wider font-bold transition-colors flex items-center justify-center gap-2 shadow-tactile disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <span>Verify PIN & Activate Account</span>
              <ArrowRight className="w-3.5 h-3.5 text-lime" />
            </button>
          </form>

          {/* Quick Demo Helper & Resend Cooldown */}
          <div className="p-3 bg-paper-dark border border-stone-hairline space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-forest/60">Prototype PIN Fixture:</span>
              <button
                type="button"
                onClick={() => setPin('123456')}
                className="font-bold text-forest underline hover:text-forest-hover"
              >
                Quick-Fill [123456]
              </button>
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono pt-1 border-t border-stone-hairline/60">
              <span className="text-forest/60">Didn’t receive PIN?</span>
              <button
                type="button"
                onClick={handleResend}
                disabled={cooldown > 0}
                className="text-forest underline disabled:opacity-40 disabled:no-underline"
              >
                {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend PIN'}
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* STEP 3: INTENT SELECTION ROUTING (Phase 1 Spec §5.2) */
        <div className="space-y-4">
          <div className="p-3 bg-lime/30 border border-lime text-xs font-mono text-forest flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-lime-800 shrink-0" />
            <span>Email verified. Select where you would like to begin:</span>
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            <button
              type="button"
              onClick={() => handleRouteByIntent('/auctions/live', 'Active Saleroom')}
              className="w-full text-left p-3.5 bg-paper hover:bg-paper-dark border border-stone-hairline text-forest transition-colors flex items-center justify-between group shadow-tactile"
            >
              <div className="flex items-center gap-3">
                <Radio className="w-4 h-4 text-forest group-hover:text-lime" />
                <div>
                  <span className="font-serif font-bold text-sm block">
                    Enter Active Saleroom
                  </span>
                  <span className="text-[10px] font-mono text-forest/60">
                    Bid on Lot 01 (1968 Patek Philippe Calatrava)
                  </span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-forest/40 group-hover:text-forest" />
            </button>

            <button
              type="button"
              onClick={() => handleRouteByIntent('/consign', 'Consignment Intake')}
              className="w-full text-left p-3.5 bg-paper hover:bg-paper-dark border border-stone-hairline text-forest transition-colors flex items-center justify-between group shadow-tactile"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4 text-forest group-hover:text-lime" />
                <div>
                  <span className="font-serif font-bold text-sm block">
                    Consign a Rare Timepiece
                  </span>
                  <span className="text-[10px] font-mono text-forest/60">
                    Submit a watch for specialist 48h appraisal
                  </span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-forest/40 group-hover:text-forest" />
            </button>

            <button
              type="button"
              onClick={() => handleRouteByIntent('/auctions/upcoming', 'Upcoming Catalog')}
              className="w-full text-left p-3.5 bg-paper hover:bg-paper-dark border border-stone-hairline text-forest transition-colors flex items-center justify-between group shadow-tactile"
            >
              <div className="flex items-center gap-3">
                <Compass className="w-4 h-4 text-forest group-hover:text-lime" />
                <div>
                  <span className="font-serif font-bold text-sm block">
                    Browse Upcoming Catalog
                  </span>
                  <span className="text-[10px] font-mono text-forest/60">
                    Inspect 6 provisional debut timepieces
                  </span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-forest/40 group-hover:text-forest" />
            </button>

            <button
              type="button"
              onClick={() => handleRouteByIntent('/account/settings', 'Collector Profile')}
              className="w-full text-left p-3.5 bg-paper hover:bg-paper-dark border border-stone-hairline text-forest transition-colors flex items-center justify-between group shadow-tactile"
            >
              <div className="flex items-center gap-3">
                <Sliders className="w-4 h-4 text-forest group-hover:text-lime" />
                <div>
                  <span className="font-serif font-bold text-sm block">
                    Access Collector Dashboard
                  </span>
                  <span className="text-[10px] font-mono text-forest/60">
                    Review virtual paddle card and currency settings
                  </span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-forest/40 group-hover:text-forest" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function VerifyEmailFallback() {
  return (
    <div className="w-full max-w-md bg-paper border border-stone-hairline p-6 sm:p-8 space-y-6 shadow-tactile">
      <div className="text-center space-y-2">
        <div className="w-10 h-10 mx-auto border border-forest bg-paper-dark flex items-center justify-center font-serif italic text-xl text-forest">
          CB
        </div>
        <h1 className="font-serif text-3xl font-bold text-forest">
          Verify Collector Email
        </h1>
        <p className="text-xs font-mono text-forest/60">
          Step 2 of 3: Enter the 6-digit security PIN sent to collector@horologyvault.ch
        </p>
      </div>

      <div className="flex items-center justify-between text-[11px] font-mono border-b border-stone-hairline pb-3">
        <span className="text-forest/60">1. Credentials ✓</span>
        <span className="text-forest/40">→</span>
        <span className="font-bold text-forest">2. PIN Verify</span>
        <span className="text-forest/40">→</span>
        <span className="text-forest/40">3. Intent Routing</span>
      </div>

      <form className="space-y-4">
        <div className="space-y-1">
          <label htmlFor="verify-pin-input" className="text-xs font-mono uppercase text-forest/80 block">
            6-Digit Security PIN *
          </label>
          <input
            id="verify-pin-input"
            type="text"
            maxLength={6}
            placeholder="123456"
            required
            className="w-full px-3 py-2 bg-paper-dark border border-stone-hairline text-forest font-mono text-center text-lg tracking-widest focus:outline-none focus:border-forest"
          />
        </div>
        <button
          type="submit"
          className="w-full py-3 px-4 bg-forest text-paper font-mono text-xs uppercase tracking-wider font-bold"
        >
          Confirm Security PIN
        </button>
      </form>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <Suspense fallback={<VerifyEmailFallback />}>
        <VerifyEmailContent />
      </Suspense>
    </div>
  );
}
