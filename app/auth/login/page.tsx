'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useChronoBid } from '@/lib/context';
import {
  Lock,
  Mail,
  AlertCircle,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Shield,
  Clock,
  Compass,
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { loginUser, recordFailedLogin, resetThrottling, user, addToast } = useChronoBid();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Simulated CAPTCHA state (ADR-026)
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [captchaLoading, setCaptchaLoading] = useState(false);
  const [captchaError, setCaptchaError] = useState(false);

  const handleCaptchaClick = () => {
    if (captchaVerified || captchaLoading) return;
    setCaptchaLoading(true);
    setCaptchaError(false);
    setTimeout(() => {
      setCaptchaLoading(false);
      setCaptchaVerified(true);
      addToast('Simulated anti-bot human verification completed. [SANDBOX CAPTCHA]', 'info');
    }, 450);
  };

  const handleCaptchaKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      handleCaptchaClick();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (user.isThrottled) {
      setErrorMessage('Account locked due to 5 consecutive failed attempts. Please reset password or wait 15 minutes (ADR-020 draft assumption).');
      return;
    }

    if (!captchaVerified) {
      setCaptchaError(true);
      setErrorMessage('Please complete the anti-bot verification checkbox before signing in.');
      return;
    }

    // Demo password validation: "Chrono1968" or any password >= 8 chars except bad test
    if (email === 'vance@horologyvault.ch' && (password === 'Chrono1968' || password.length >= 8)) {
      loginUser(email, '4102');
      router.push('/auctions/live');
    } else {
      const isNowThrottled = recordFailedLogin();
      if (isNowThrottled) {
        setErrorMessage('Too many failed login attempts (5/5). Account locked for 15 minutes per ADR-020 draft assumption.');
      } else {
        setErrorMessage(`Invalid collector credentials. Attempt ${user.failedLoginAttempts + 1} of 5.`);
      }
    }
  };

  // Simulated Google Sign-In (ADR-026)
  const handleSimulatedGoogleSignIn = () => {
    if (user.isThrottled) {
      setErrorMessage('Account locked due to 5 consecutive failed attempts. Wait 15 minutes or reset password.');
      return;
    }
    loginUser('vance@horologyvault.ch', '4102');
    addToast('Signed in via Simulated Google Identity as Alexander Vance (Paddle #4102). [DEMO AUTH]', 'success');
    router.push('/auctions/live');
  };

  const handleQuickDemoFill = () => {
    setEmail('vance@horologyvault.ch');
    setPassword('Chrono1968');
    setCaptchaVerified(true);
    setErrorMessage(null);
  };

  const handleSimulateFailedAttempt = () => {
    setEmail('test@intruder.ch');
    setPassword('wrongpass');
    setCaptchaVerified(true);
    const isNowThrottled = recordFailedLogin();
    if (isNowThrottled) {
      setErrorMessage('Too many failed login attempts (5/5). Account locked for 15 minutes per ADR-020 draft assumption.');
    } else {
      setErrorMessage(`Invalid collector credentials. Attempt ${user.failedLoginAttempts + 1} of 5.`);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      <div className="w-full max-w-5xl bg-paper border border-stone-hairline shadow-tactile-hover grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* LEFT COLUMN: BRAND & EDITORIAL ESSAY PANEL (Deep Forest Surface) */}
        <div className="lg:col-span-5 bg-forest text-paper p-8 sm:p-10 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-forest-subtle relative overflow-hidden">
          {/* Subtle Monogram Watermark */}
          <div className="absolute -right-8 -bottom-8 pointer-events-none opacity-5 font-serif italic text-9xl text-paper select-none">
            CBV
          </div>

          <div className="space-y-6 z-10">
            {/* Header Badge */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 border border-lime bg-forest-subtle flex items-center justify-center font-serif italic text-lg text-lime font-bold">
                CB
              </div>
              <div>
                <span className="font-serif text-lg font-bold tracking-tight text-paper block leading-none">
                  ChronoBid Vault
                </span>
                <span className="text-[10px] font-mono tracking-widest text-paper/60 uppercase block mt-0.5">
                  Private Member Access
                </span>
              </div>
            </div>

            <div className="space-y-3 pt-4">
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-paper leading-[1.15]">
                Curated Horology Saleroom & Pre-Funded Vault.
              </h2>
              <p className="font-sans text-sm text-paper/80 leading-relaxed">
                Connect your authenticated virtual paddle to participate in live Geneva sessions, track private consignments, and inspect acoustic Timegrapher diagnostics.
              </p>
            </div>

            {/* Member Benefits Bullet Points */}
            <div className="pt-4 border-t border-forest-subtle space-y-3 font-mono text-xs">
              <div className="flex items-start gap-2.5">
                <Shield className="w-4 h-4 text-lime shrink-0 mt-0.5" />
                <span className="text-paper/80">
                  <strong className="text-paper">Pre-Funded Vault:</strong> Real-time available balance gating prevents unverified over-bidding.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-lime shrink-0 mt-0.5" />
                <span className="text-paper/80">
                  <strong className="text-paper">Anti-Sniping Soft-Close:</strong> 120-second dynamic clock extension rewards genuine scholarship.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <Compass className="w-4 h-4 text-lime shrink-0 mt-0.5" />
                <span className="text-paper/80">
                  <strong className="text-paper">Forensic Inspection:</strong> Non-destructive 6-position timing tests and museum archive cross-checks.
                </span>
              </div>
            </div>
          </div>

          {/* Sandbox Disclosure Footer */}
          <div className="pt-8 z-10">
            <div className="p-3 bg-forest-subtle border border-paper/10 text-[11px] font-mono space-y-1">
              <span className="text-lime uppercase font-bold block text-[10px] tracking-wider">
                [SANDBOX SIMULATION — NOT REAL CREDENTIALS]
              </span>
              <p className="text-paper/60 leading-snug">
                This prototype simulates saleroom access. Production authentication will integrate audited OAuth and hardware WebAuthn credentials.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: READABLE AUTHENTICATION PANEL (Warm Paper Surface) */}
        <div className="lg:col-span-7 bg-paper p-8 sm:p-12 flex flex-col justify-between space-y-6">
          <div className="space-y-6">
            {/* Form Title & Subtitle */}
            <div className="space-y-1">
              <span className="text-xs font-mono uppercase tracking-widest text-forest/60 block">
                Saleroom Credential Verification
              </span>
              <h1 className="font-serif text-3xl font-bold text-forest">
                Sign In to Collector Saleroom
              </h1>
              <p className="text-sm font-sans text-forest/70">
                Enter your registered email and password to access active bidding salerooms.
              </p>
            </div>

            {/* Throttling Alert Banner (ADR-020 Draft Assumption) */}
            {user.isThrottled && (
              <div role="alert" className="p-4 bg-red-50 border border-red-300 text-red-950 text-xs font-mono space-y-2">
                <div className="flex items-start gap-2 font-bold text-sm">
                  <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <span>Security Throttling Active (5 Failed Attempts)</span>
                </div>
                <p className="leading-relaxed">
                  Too many consecutive failed login attempts recorded. Account access is temporarily locked for 15 minutes per ADR-020 draft assumption.
                </p>
                <div className="pt-1 flex items-center gap-3">
                  <Link
                    href="/auth/reset-password"
                    className="underline font-bold text-red-900 hover:text-forest"
                  >
                    Reset Password with Token →
                  </Link>
                  <button
                    type="button"
                    onClick={resetThrottling}
                    className="text-[11px] uppercase underline text-red-800"
                  >
                    [Reset Demo Lock]
                  </button>
                </div>
              </div>
            )}

            {/* Regular Error Container */}
            {errorMessage && !user.isThrottled && (
              <div role="alert" className="p-3.5 bg-red-50 border border-red-200 text-red-900 text-xs font-mono flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* SIMULATED GOOGLE SIGN-IN BUTTON (ADR-026) */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={handleSimulatedGoogleSignIn}
                disabled={user.isThrottled}
                aria-label="Continue with Google [Simulated prototype flow]"
                className="w-full py-3 px-4 bg-paper-dark hover:bg-stone-hairline/60 border border-stone-hairline text-forest font-sans text-sm font-semibold transition-all flex items-center justify-center gap-3 shadow-tactile disabled:opacity-40"
              >
                {/* Official Google Color SVG */}
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                <span>Continue with Google</span>
                <span className="text-[10px] font-mono text-forest/60 bg-paper px-1.5 py-0.5 border border-stone-hairline">
                  [PROTOTYPE]
                </span>
              </button>
              <span className="text-[10px] font-mono text-forest/50 text-center block">
                [SIMULATED AUTH PROVIDER — PROTOTYPE ONLY: Instant 1-click test sign in]
              </span>
            </div>

            {/* Divider */}
            <div className="relative flex items-center py-1">
              <div className="flex-grow border-t border-stone-hairline"></div>
              <span className="flex-shrink mx-3 text-xs font-mono text-forest/50 uppercase tracking-widest">
                Or sign in with email
              </span>
              <div className="flex-grow border-t border-stone-hairline"></div>
            </div>

            {/* Credential Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Input (14-16px label, 16px input to prevent iOS zoom) */}
              <div className="space-y-1.5">
                <label
                  htmlFor="login-email"
                  className="text-sm font-sans font-medium text-forest block tracking-normal"
                >
                  Collector Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-forest/40" />
                  <input
                    id="login-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="vance@horologyvault.ch"
                    required
                    disabled={user.isThrottled}
                    className="w-full pl-11 pr-4 py-3 bg-paper-dark border border-stone-hairline text-forest font-mono text-base focus:outline-none focus:border-forest transition-colors disabled:opacity-40"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label
                    htmlFor="login-password"
                    className="text-sm font-sans font-medium text-forest block tracking-normal"
                  >
                    Password *
                  </label>
                  <Link
                    href="/auth/reset-password"
                    className="text-xs font-mono text-forest/70 hover:text-forest underline"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-forest/40" />
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    required
                    disabled={user.isThrottled}
                    className="w-full pl-11 pr-12 py-3 bg-paper-dark border border-stone-hairline text-forest font-mono text-base focus:outline-none focus:border-forest transition-colors disabled:opacity-40"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-forest/50 hover:text-forest p-1"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* ACCESSIBLE SIMULATED CAPTCHA WIDGET (ADR-026) */}
              <div
                role="checkbox"
                aria-checked={captchaVerified}
                tabIndex={0}
                onClick={handleCaptchaClick}
                onKeyDown={handleCaptchaKeyDown}
                className={`p-3.5 border transition-all cursor-pointer flex items-center justify-between select-none ${
                  captchaVerified
                    ? 'bg-lime/20 border-lime'
                    : captchaError
                    ? 'bg-red-50 border-red-300'
                    : 'bg-paper-dark hover:bg-stone-hairline/30 border-stone-hairline'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 border flex items-center justify-center transition-colors ${
                      captchaVerified
                        ? 'bg-forest border-forest text-lime'
                        : 'bg-paper border-stone-hairline text-transparent'
                    }`}
                  >
                    {captchaLoading ? (
                      <div className="w-3.5 h-3.5 border-2 border-forest border-t-transparent rounded-full animate-spin"></div>
                    ) : captchaVerified ? (
                      <CheckCircle2 className="w-4 h-4 fill-lime text-forest" />
                    ) : null}
                  </div>
                  <div>
                    <span className="font-sans text-sm font-semibold text-forest block">
                      {captchaVerified ? 'Identity Confirmed (Human)' : 'I am human [Sandbox Verification]'}
                    </span>
                    <span className="text-[10px] font-mono text-forest/60 block">
                      Simulated anti-bot test fixture • Press Space or Click to verify
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[9px] font-mono text-forest/50 uppercase block">
                    [SIMULATED ANTI-BOT]
                  </span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={user.isThrottled}
                className="w-full py-3.5 px-6 bg-forest hover:bg-forest-hover active:scale-[0.99] text-paper font-mono text-xs uppercase tracking-wider font-bold transition-all flex items-center justify-center gap-2 shadow-tactile disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span>Sign In to Saleroom</span>
                <ArrowRight className="w-4 h-4 text-lime" />
              </button>
            </form>

            {/* Quick Demo Helpers */}
            <div className="p-3.5 bg-paper-dark border border-stone-hairline space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-forest/70 font-bold block">
                [PROTOTYPE DEMO CONVENIENCES & THROTTLING TESTS]
              </span>
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  type="button"
                  onClick={handleQuickDemoFill}
                  className="flex-1 text-left p-2 bg-paper hover:bg-lime border border-stone-hairline text-xs font-mono text-forest transition-colors flex items-center justify-between"
                >
                  <span>Quick-Fill: Vance (Paddle #4102)</span>
                  <span className="text-[10px] text-forest/60">Auto-fill</span>
                </button>
                <button
                  type="button"
                  onClick={handleSimulateFailedAttempt}
                  className="flex-1 text-left p-2 bg-paper hover:bg-red-50 border border-stone-hairline text-xs font-mono text-red-900 transition-colors flex items-center justify-between"
                >
                  <span>Simulate Failed Login</span>
                  <span className="text-[10px] text-red-600">Test Throttling</span>
                </button>
              </div>
            </div>
          </div>

          {/* Footer Registration Link */}
          <div className="pt-4 border-t border-stone-hairline text-center text-xs font-mono text-forest/70">
            <span>New to ChronoBid Vault? </span>
            <Link
              href="/auth/register"
              className="text-forest font-bold underline hover:text-forest-hover"
            >
              Register Virtual Paddle (3-Step Intake)
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
