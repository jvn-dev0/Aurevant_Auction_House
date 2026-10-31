'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useChronoBid } from '@/lib/context';
import {
  KeyRound,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
  Clock,
  Sparkles,
} from 'lucide-react';

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tokenParam = searchParams?.get('token');
  const emailQuery = searchParams?.get('email') || 'collector@horologyvault.ch';

  const { addToast } = useChronoBid();

  // Mode determination: 'request' | 'active' | 'expired' | 'invalid'
  const [mode, setMode] = useState<'request' | 'active' | 'expired' | 'invalid'>('request');

  // Mode A: Request state
  const [requestEmail, setRequestEmail] = useState(emailQuery);
  const [requestSubmitted, setRequestSubmitted] = useState(false);
  const [requestError, setRequestError] = useState<string | null>(null);

  // Mode B: Active reset state
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (tokenParam === 'expired') {
      setMode('expired');
    } else if (tokenParam === 'invalid') {
      setMode('invalid');
    } else if (tokenParam) {
      setMode('active');
    } else {
      setMode('request');
    }
  }, [tokenParam]);

  // Complexity Evaluation (10 chars, uppercase, lowercase, digit per ADR-020)
  const hasMinLength = newPassword.length >= 10;
  const hasUppercase = /[A-Z]/.test(newPassword);
  const hasLowercase = /[a-z]/.test(newPassword);
  const hasDigit = /[0-9]/.test(newPassword);
  const passwordsMatch = newPassword.length > 0 && newPassword === confirmPassword;

  // Handle Mode A submission
  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(requestEmail)) {
      setRequestError('Please enter a valid email address matching RFC 5322 syntax.');
      return;
    }
    setRequestError(null);
    setRequestSubmitted(true);
    addToast('Password recovery instructions dispatched (enumeration-resistant).', 'info');
  };

  // Handle Mode B submission
  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};

    if (!hasMinLength || !hasUppercase || !hasLowercase || !hasDigit) {
      errs.complexity = 'Password must be at least 10 characters and contain uppercase, lowercase, and numbers.';
    }
    if (!passwordsMatch) {
      errs.match = 'Passwords do not match.';
    }

    if (Object.keys(errs).length > 0) {
      setPasswordErrors(errs);
      return;
    }

    setPasswordErrors({});
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      addToast('Your password has been reset successfully. Please sign in with your new credentials.', 'success');
      router.push('/auth/login?reset=success');
    }, 700);
  };

  return (
    <div className="w-full max-w-md bg-paper border border-stone-hairline p-6 sm:p-8 space-y-6 shadow-tactile">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className="w-10 h-10 mx-auto border border-forest bg-paper-dark flex items-center justify-center font-serif italic text-xl text-forest">
          CB
        </div>
        <h1 className="font-serif text-3xl font-bold text-forest">
          Account Credential Recovery
        </h1>
        <p className="text-xs font-mono text-forest/60">
          {mode === 'active'
            ? 'Enter and confirm your new secure password.'
            : mode === 'expired'
            ? 'Password recovery token has expired.'
            : mode === 'invalid'
            ? 'Invalid recovery token provided.'
            : 'Request secure password reset instructions.'}
        </p>
      </div>

      {/* ----------------- MODE C: EXPIRED TOKEN STATE ----------------- */}
      {mode === 'expired' && (
        <div
          role="alert"
          className="p-5 border border-forest space-y-4"
          style={{ backgroundColor: '#EDE7DC' }}
        >
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 text-amber-800 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-serif text-lg font-bold text-forest">
                Reset Link Expired
              </h3>
              <p className="text-xs font-mono text-forest/80 leading-relaxed mt-1">
                For your security, password reset links expire after 15 minutes (ADR-020 unapproved draft assumption). The link you followed is no longer valid.
              </p>
            </div>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <button
              type="button"
              autoFocus
              onClick={() => {
                setMode('request');
                setRequestSubmitted(false);
                router.push('/auth/reset-password');
              }}
              className="w-full py-2.5 px-4 bg-forest text-paper hover:bg-forest-hover font-mono text-xs uppercase tracking-wider font-bold transition-colors text-center"
            >
              Request New Reset Link
            </button>
            <Link
              href="/auth/login"
              className="text-center text-xs font-mono text-forest/70 hover:text-forest underline py-1"
            >
              Return to Sign In
            </Link>
          </div>
        </div>
      )}

      {/* ----------------- MODE D: INVALID TOKEN STATE ----------------- */}
      {mode === 'invalid' && (
        <div role="alert" className="p-5 bg-red-50 border border-red-300 text-red-950 space-y-4">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-serif text-lg font-bold text-red-900">
                Invalid Recovery Token
              </h3>
              <p className="text-xs font-mono text-red-800 leading-relaxed mt-1">
                This password reset link is invalid, malformed, or has already been used. Please request a fresh reset link.
              </p>
            </div>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => {
                setMode('request');
                setRequestSubmitted(false);
                router.push('/auth/reset-password');
              }}
              className="w-full py-2.5 px-4 bg-forest text-paper hover:bg-forest-hover font-mono text-xs uppercase tracking-wider font-bold transition-colors text-center"
            >
              Request New Reset Link
            </button>
            <Link
              href="/"
              className="text-center text-xs font-mono text-forest/70 hover:text-forest underline py-1"
            >
              Cancel and Return to Saleroom
            </Link>
          </div>
        </div>
      )}

      {/* ----------------- MODE A: REQUEST RESET LINK FORM ----------------- */}
      {mode === 'request' && (
        <div className="space-y-4">
          {requestSubmitted ? (
            <div className="p-4 bg-paper-dark border border-stone-hairline space-y-3">
              <div className="flex items-center gap-2 text-forest font-bold font-serif text-base">
                <CheckCircle2 className="w-5 h-5 text-lime-700" />
                <span>Instructions Dispatched</span>
              </div>
              <p className="text-xs font-mono text-forest/80 leading-relaxed">
                If an account exists for <strong>{requestEmail}</strong>, you will receive password reset instructions shortly. (Phase 1 Spec §5.5 enumeration-resistant notice).
              </p>
              <div className="pt-2 border-t border-stone-hairline flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => setMode('active')}
                  className="w-full py-2 px-3 bg-lime hover:bg-lime-hover text-forest font-mono text-xs uppercase tracking-wider font-bold transition-colors text-center"
                >
                  [Simulate Reset Link: Open with Valid Demo Token]
                </button>
                <Link
                  href="/auth/login"
                  className="text-center text-xs font-mono text-forest/70 hover:text-forest underline py-1"
                >
                  Return to Sign In
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleRequestSubmit} className="space-y-4">
              {requestError && (
                <div role="alert" className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs font-mono">
                  {requestError}
                </div>
              )}

              <div className="space-y-1.5">
                <label htmlFor="reset-email" className="text-sm font-sans font-medium text-forest block tracking-normal">
                  Registered Collector Email *
                </label>
                <div className="relative">
                  <Mail className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-forest/40" />
                  <input
                    id="reset-email"
                    type="email"
                    value={requestEmail}
                    onChange={(e) => setRequestEmail(e.target.value)}
                    placeholder="collector@horologyvault.ch"
                    required
                    className="w-full pl-11 pr-4 py-3 bg-paper-dark border border-stone-hairline text-forest font-mono text-base focus:outline-none focus:border-forest transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 bg-forest hover:bg-forest-hover text-paper font-mono text-xs uppercase tracking-wider font-bold transition-colors flex items-center justify-center gap-2 shadow-tactile"
              >
                <span>Send Reset Instructions</span>
                <ArrowRight className="w-3.5 h-3.5 text-lime" />
              </button>
            </form>
          )}

          {/* Sandbox Simulation Helper Bar */}
          <div className="p-3 bg-paper-dark border border-stone-hairline space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-forest/70 font-bold block">
              [PROTOTYPE RECOVERY SIMULATION FIXTURES]
            </span>
            <div className="grid grid-cols-3 gap-1.5 text-[10px] font-mono">
              <button
                type="button"
                onClick={() => setMode('active')}
                className="p-1.5 bg-paper hover:bg-lime border border-stone-hairline text-forest text-center"
              >
                Test Valid Token
              </button>
              <button
                type="button"
                onClick={() => setMode('expired')}
                className="p-1.5 bg-paper hover:bg-amber-100 border border-stone-hairline text-amber-900 text-center"
              >
                Test Expired Link
              </button>
              <button
                type="button"
                onClick={() => setMode('invalid')}
                className="p-1.5 bg-paper hover:bg-red-50 border border-stone-hairline text-red-900 text-center"
              >
                Test Invalid Link
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- MODE B: ACTIVE PASSWORD RESET FORM ----------------- */}
      {mode === 'active' && (
        <form onSubmit={handleResetSubmit} className="space-y-4">
          {/* Security Status Banner */}
          <div className="p-3 bg-paper-dark border border-stone-hairline text-xs font-mono text-forest/80 flex items-center justify-between">
            <span className="truncate">Resetting for: <strong>{emailQuery}</strong></span>
            <span className="text-[10px] text-lime-800 bg-lime/30 px-1.5 py-0.5 shrink-0">15m Token Active</span>
          </div>

          {passwordErrors.complexity && (
            <div role="alert" className="p-2.5 bg-red-50 border border-red-200 text-red-800 text-xs font-mono">
              {passwordErrors.complexity}
            </div>
          )}
          {passwordErrors.match && (
            <div role="alert" className="p-2.5 bg-red-50 border border-red-200 text-red-800 text-xs font-mono">
              {passwordErrors.match}
            </div>
          )}

          <div className="space-y-1.5">
            <label htmlFor="reset-new-password" className="text-sm font-sans font-medium text-forest block tracking-normal">
              New Secure Password *
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-forest/40" />
              <input
                id="reset-new-password"
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Min 10 characters"
                required
                aria-invalid={!!passwordErrors.complexity}
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
          </div>

          <div className="space-y-1.5">
            <label htmlFor="reset-confirm-password" className="text-sm font-sans font-medium text-forest block tracking-normal">
              Confirm New Password *
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-forest/40" />
              <input
                id="reset-confirm-password"
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat new password"
                required
                aria-invalid={!!passwordErrors.match}
                className="w-full pl-11 pr-4 py-3 bg-paper-dark border border-stone-hairline text-forest font-mono text-base focus:outline-none focus:border-forest transition-colors"
              />
            </div>
          </div>

          {/* Dynamic Complexity Checklist (ADR-020 Draft Assumption) */}
          <div className="p-3 bg-paper-dark border border-stone-hairline text-[11px] font-mono space-y-1.5">
            <span className="text-forest/70 font-bold block text-[10px] uppercase">
              Password Complexity Requirements:
            </span>
            <div className="grid grid-cols-2 gap-1 text-[10px]">
              <span className={hasMinLength ? 'text-lime-800 font-bold' : 'text-forest/50'}>
                {hasMinLength ? '✓' : '○'} Min 10 characters
              </span>
              <span className={hasUppercase ? 'text-lime-800 font-bold' : 'text-forest/50'}>
                {hasUppercase ? '✓' : '○'} Uppercase letter
              </span>
              <span className={hasLowercase ? 'text-lime-800 font-bold' : 'text-forest/50'}>
                {hasLowercase ? '✓' : '○'} Lowercase letter
              </span>
              <span className={hasDigit ? 'text-lime-800 font-bold' : 'text-forest/50'}>
                {hasDigit ? '✓' : '○'} Numeric digit
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !hasMinLength || !passwordsMatch}
            className="w-full py-3 px-4 bg-forest hover:bg-forest-hover text-paper font-mono text-xs uppercase tracking-wider font-bold transition-colors flex items-center justify-center gap-2 shadow-tactile disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <span>{isSubmitting ? 'Securing account credentials...' : 'Update Password & Secure Account'}</span>
            <ArrowRight className="w-3.5 h-3.5 text-lime" />
          </button>
        </form>
      )}

      {/* Footer Entry / Exit Paths */}
      <div className="pt-4 border-t border-stone-hairline flex items-center justify-between text-xs font-mono text-forest/70">
        <Link href="/auth/login" className="hover:text-forest underline">
          Return to Sign In
        </Link>
        <Link href="/" className="hover:text-forest underline">
          Saleroom Home
        </Link>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <Suspense fallback={<div className="p-8 text-center font-mono text-xs text-forest/60">Loading recovery portal...</div>}>
        <ResetPasswordContent />
      </Suspense>
    </div>
  );
}
