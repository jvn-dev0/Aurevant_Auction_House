'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useChronoBid } from '@/lib/context';
import {
  Shield,
  Mail,
  Lock,
  User,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Compass,
  Clock,
  Sparkles,
  AlertCircle,
} from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { loginUser, addToast } = useChronoBid();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

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

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.fullName.trim()) errs.fullName = 'Full legal name or entity name is required.';
    if (!formData.email.includes('@')) errs.email = 'Valid collector email address is required.';
    if (formData.password.length < 10) {
      errs.password = 'Password must be at least 10 characters (ADR-020 draft assumption).';
    }
    if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match.';
    }
    if (!captchaVerified) {
      setCaptchaError(true);
      errs.captcha = 'Please complete the anti-bot verification checkbox before continuing.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      addToast('Registration credentials captured. Advancing to PIN verification.', 'info');
      // Advance to Step 2: Email verification subflow
      router.push(`/auth/verify-email?email=${encodeURIComponent(formData.email)}&name=${encodeURIComponent(formData.fullName)}`);
    }
  };

  // Simulated Google Sign-Up (ADR-026)
  const handleSimulatedGoogleSignUp = () => {
    const demoEmail = 'alexander.vance@geneva-horology.ch';
    const demoName = 'Alexander Vance';
    loginUser(demoEmail, '4102');
    addToast('Registered & authenticated via Simulated Google Identity. [DEMO AUTH]', 'success');
    router.push('/auctions/live');
  };

  const handleQuickDemoFill = () => {
    setFormData({
      fullName: 'Elena Rostova',
      email: 'rostova@zurich-collection.ch',
      password: 'ChronoVault2026!',
      confirmPassword: 'ChronoVault2026!',
    });
    setCaptchaVerified(true);
    setErrors({});
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
                  Saleroom Registration
                </span>
              </div>
            </div>

            <div className="space-y-3 pt-4">
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-paper leading-[1.15]">
                Create Authenticated Saleroom Account & Vault.
              </h2>
              <p className="font-sans text-sm text-paper/80 leading-relaxed">
                Register to allocate your private virtual bidding paddle, configure multi-currency preferences, and unlock pre-funded Vault liquidity controls.
              </p>
            </div>

            {/* Member Benefits Bullet Points */}
            <div className="pt-4 border-t border-forest-subtle space-y-3 font-mono text-xs">
              <div className="flex items-start gap-2.5">
                <Shield className="w-4 h-4 text-lime shrink-0 mt-0.5" />
                <span className="text-paper/80">
                  <strong className="text-paper">Pre-Funded Vault Protection:</strong> Real-time available balance gating prevents unverified over-bidding.
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
                  <strong className="text-paper">Multi-Currency Transparency:</strong> Real-time dual display across 8 world currencies including INR (₹), USD, EUR, GBP.
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
                This prototype simulates member registration and paddle allocation. Production accounts require KYC verification and institutional escrow custody agreements.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: READABLE REGISTRATION PANEL (Warm Paper Surface) */}
        <div className="lg:col-span-7 bg-paper p-8 sm:p-12 flex flex-col justify-between space-y-6">
          <div className="space-y-6">
            {/* Step Indicator */}
            <div className="flex items-center justify-between text-xs font-mono border-b border-stone-hairline pb-3.5">
              <div className="flex items-center gap-1.5 font-bold text-forest">
                <span className="w-5 h-5 bg-forest text-lime flex items-center justify-center text-[10px]">1</span>
                <span>Credentials</span>
              </div>
              <span className="text-forest/30">→</span>
              <div className="flex items-center gap-1.5 text-forest/50">
                <span className="w-5 h-5 bg-paper-dark border border-stone-hairline flex items-center justify-center text-[10px]">2</span>
                <span>PIN Verify</span>
              </div>
              <span className="text-forest/30">→</span>
              <div className="flex items-center gap-1.5 text-forest/50">
                <span className="w-5 h-5 bg-paper-dark border border-stone-hairline flex items-center justify-center text-[10px]">3</span>
                <span>Intent Routing</span>
              </div>
            </div>

            {/* Title & Subtitle */}
            <div className="space-y-1">
              <span className="text-xs font-mono uppercase tracking-widest text-forest/60 block">
                Step 1 of 3: Saleroom Intake
              </span>
              <h1 className="font-serif text-3xl font-bold text-forest">
                Register Virtual Paddle
              </h1>
              <p className="text-sm font-sans text-forest/70">
                Provide your details to initialize your collector profile and allocate a private paddle number.
              </p>
            </div>

            {/* Error Container */}
            {errors.captcha && (
              <div role="alert" className="p-3 bg-red-50 border border-red-200 text-red-900 text-xs font-mono flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{errors.captcha}</span>
              </div>
            )}

            {/* SIMULATED GOOGLE SIGN-UP BUTTON (ADR-026) */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={handleSimulatedGoogleSignUp}
                aria-label="Register with Google [Simulated prototype flow]"
                className="w-full py-3 px-4 bg-paper-dark hover:bg-stone-hairline/60 border border-stone-hairline text-forest font-sans text-sm font-semibold transition-all flex items-center justify-center gap-3 shadow-tactile"
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
                [SIMULATED AUTH PROVIDER — PROTOTYPE ONLY: Instant 1-click test registration]
              </span>
            </div>

            {/* Divider */}
            <div className="relative flex items-center py-1">
              <div className="flex-grow border-t border-stone-hairline"></div>
              <span className="flex-shrink mx-3 text-xs font-mono text-forest/50 uppercase tracking-widest">
                Or register with email
              </span>
              <div className="flex-grow border-t border-stone-hairline"></div>
            </div>

            {/* Credential Form */}
            <form onSubmit={handleStep1Submit} className="space-y-4">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label
                  htmlFor="reg-name"
                  className="text-sm font-sans font-medium text-forest block tracking-normal"
                >
                  Full Legal Name / Entity *
                </label>
                <div className="relative">
                  <User className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-forest/40" />
                  <input
                    id="reg-name"
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g., Lord Alistair Croft"
                    required
                    className="w-full pl-11 pr-4 py-3 bg-paper-dark border border-stone-hairline text-forest font-mono text-base focus:outline-none focus:border-forest transition-colors"
                  />
                </div>
                {errors.fullName && <span className="text-xs text-red-600 font-mono block">{errors.fullName}</span>}
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label
                  htmlFor="reg-email"
                  className="text-sm font-sans font-medium text-forest block tracking-normal"
                >
                  Primary Collector Email *
                </label>
                <div className="relative">
                  <Mail className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-forest/40" />
                  <input
                    id="reg-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="croft@genevacollection.ch"
                    required
                    className="w-full pl-11 pr-4 py-3 bg-paper-dark border border-stone-hairline text-forest font-mono text-base focus:outline-none focus:border-forest transition-colors"
                  />
                </div>
                {errors.email && <span className="text-xs text-red-600 font-mono block">{errors.email}</span>}
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label
                  htmlFor="reg-password"
                  className="text-sm font-sans font-medium text-forest block tracking-normal"
                >
                  Password (Min 10 characters) *
                </label>
                <div className="relative">
                  <Lock className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-forest/40" />
                  <input
                    id="reg-password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="••••••••••••"
                    required
                    className="w-full pl-11 pr-12 py-3 bg-paper-dark border border-stone-hairline text-forest font-mono text-base focus:outline-none focus:border-forest transition-colors"
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
                {errors.password && <span className="text-xs text-red-600 font-mono block">{errors.password}</span>}
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label
                  htmlFor="reg-confirm-password"
                  className="text-sm font-sans font-medium text-forest block tracking-normal"
                >
                  Confirm Password *
                </label>
                <div className="relative">
                  <Lock className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-forest/40" />
                  <input
                    id="reg-confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    placeholder="••••••••••••"
                    required
                    className="w-full pl-11 pr-12 py-3 bg-paper-dark border border-stone-hairline text-forest font-mono text-base focus:outline-none focus:border-forest transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-forest/50 hover:text-forest p-1"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.confirmPassword && <span className="text-xs text-red-600 font-mono block">{errors.confirmPassword}</span>}
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
                className="w-full py-3.5 px-6 bg-forest hover:bg-forest-hover active:scale-[0.99] text-paper font-mono text-xs uppercase tracking-wider font-bold transition-all flex items-center justify-center gap-2 shadow-tactile"
              >
                <span>Proceed to Email PIN Verification</span>
                <ArrowRight className="w-4 h-4 text-lime" />
              </button>
            </form>

            {/* Quick Demo Helper */}
            <div className="p-3.5 bg-paper-dark border border-stone-hairline space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-forest/70 font-bold block">
                [PROTOTYPE DEMO CONVENIENCES]
              </span>
              <button
                type="button"
                onClick={handleQuickDemoFill}
                className="w-full text-left p-2 bg-paper hover:bg-lime border border-stone-hairline text-xs font-mono text-forest transition-colors flex items-center justify-between"
              >
                <span>Quick-Fill Sample Collector (Elena Rostova)</span>
                <span className="text-[10px] text-forest/60">Auto-fill & Verify</span>
              </button>
            </div>
          </div>

          {/* Footer Existing Account Link */}
          <div className="pt-4 border-t border-stone-hairline text-center text-xs font-mono text-forest/70">
            <span>Already hold a registered paddle? </span>
            <Link
              href="/auth/login"
              className="text-forest font-bold underline hover:text-forest-hover"
            >
              Sign In to Saleroom
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
