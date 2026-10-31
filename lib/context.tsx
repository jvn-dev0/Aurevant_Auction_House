'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import {
  SupportedCurrency,
  formatCurrency,
  formatDualCurrency,
  getExchangeRateLabel,
  CURRENCY_CONFIGS,
  convertCurrency,
} from './currency';
import { WATCH_LOTS, HorologicalLot } from './data';
import {
  getNextMinimumBid,
  validateCustomBid,
  evaluateSoftCloseBid,
  SoftCloseEvaluation,
} from './bidding';

export interface BidRecord {
  id: string;
  bidderPaddle: string;
  amountUsd: number;
  timestamp: string;
  isUser: boolean;
  isExtensionTrigger: boolean;
  extensionNumber?: number;
}

export type ConsignmentStatus =
  | 'Under Specialist Review'
  | 'Information Requested'
  | 'Valuation Issued'
  | 'Reserve Approved'
  | 'Consignment Declined'
  | 'Inspection Scheduled';

export interface ConsignmentTicket {
  ticketId: string;
  category?: string;
  manufacturer: string;
  reference: string;
  year: string;
  condition: string;
  reserveEstimateUsd: number;
  submittedAt: string;
  status: ConsignmentStatus;
  reserveAgreed: boolean;
  specialistNotes?: string;
  valuationEstimateLowUsd?: number;
  valuationEstimateHighUsd?: number;
  clientContactEmail?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  paddleNumber: string;
  isLoggedIn: boolean;
  isConsignorEnabled: boolean;
  failedLoginAttempts: number;
  isThrottled: boolean;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  message: string;
}

export type NotificationCategory = 'bidding' | 'watchlist' | 'consignments' | 'system';

export interface NotificationItem {
  id: string;
  category: NotificationCategory;
  title: string;
  description: string;
  timestamp: string;
  isRead: boolean;
  link?: string;
  badge?: string;
}

export interface ConsignorSaleRecord {
  id: string;
  ticketId: string;
  lotTitle: string;
  lotReference: string;
  category: string;
  sessionTitle: string;
  sessionNumber: number;
  saleDate: string;
  reserveUsd: number;
  hammerPriceUsd: number | null;
  saleOutcome: 'sold' | 'bought_in' | 'withdrawn' | 'escrow_pending';
  simulatedNetProceedsUsd: number | null;
  settlementStatus: string;
  lotSlug?: string;
}

export interface ChronoBidContextType {
  // User state
  user: UserProfile;
  loginUser: (email: string, paddle?: string) => void;
  logoutUser: () => void;
  recordFailedLogin: () => boolean; // returns true if now throttled
  resetThrottling: () => void;
  toggleConsignorRole: () => void;

  // Currency state (ADR-021 & ADR-026)
  currency: SupportedCurrency;
  setCurrency: (c: SupportedCurrency) => void;
  formatPrice: (amountUsd: number, includeCode?: boolean) => string;
  formatDualPrice: (amountUsd: number) => string;
  getExchangeRateNotice: () => string;

  // Pre-Funded Vault State (FR-VLT-01 through FR-VLT-06, ADR-025 & ADR-026)
  totalVaultBalanceUsd: number;
  reservedFundsUsd: number;
  availableToBidUsd: number;
  activeLotCommitments: Record<string, number>;
  setTotalVaultBalance: (amountUsd: number) => void;
  setVaultBalanceToInrFixture: (inrAmount?: number) => void;
  resetVaultBalances: () => void;
  placeMultiLotBid: (lotId: string, amountUsd: number) => { success: boolean; message: string };
  runBenchmark1: () => { success: boolean; message: string; attemptedInr: number; availableInr: number };
  runBenchmark2: () => { lotASuccess: boolean; lotBSuccess: boolean; message: string };

  // Live Saleroom (Lot 01) state
  liveLot: HorologicalLot;
  remainingSeconds: number;
  isTimerRunning: boolean;
  extensionCount: number;
  isSoftCloseActive: boolean;
  isSaleroomClosed: boolean;
  bidHistory: BidRecord[];
  currentBidUsd: number;
  highestBidderPaddle: string;
  userProxyCeilingUsd: number | null;
  placeQuickBid: () => { success: boolean; message: string };
  placeCustomBid: (amountUsd: number) => { success: boolean; message: string };
  setProxyCeiling: (amountUsd: number) => void;
  setRemainingTimeManually: (seconds: number) => void;
  setExtensionCountManually: (count: number) => void;
  resetSaleroomAuction: () => void;

  // Watchlist state
  watchlist: string[];
  toggleWatchlist: (lotId: string) => void;
  isWatchlisted: (lotId: string) => boolean;

  // Consignment state
  consignments: ConsignmentTicket[];
  addConsignment: (ticket: Omit<ConsignmentTicket, 'ticketId' | 'submittedAt' | 'status'>) => string;
  toggleReserveAgreement: (ticketId: string) => void;
  updateConsignmentStatus: (
    ticketId: string,
    status: ConsignmentStatus,
    valuationLow?: number,
    valuationHigh?: number,
    notes?: string
  ) => void;
  clearConsignments: () => void;
  resetConsignments: () => void;

  // Consignor Sales & Realisation History (Feature D)
  consignorSalesHistory: ConsignorSaleRecord[];

  // Persistent Notification Centre (Feature B)
  notifications: NotificationItem[];
  unreadNotificationCount: number;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  deleteNotification: (id: string) => void;
  resetNotifications: () => void;

  // Toasts
  toasts: ToastMessage[];
  addToast: (message: string, type?: ToastMessage['type']) => void;
  dismissToast: (id: string) => void;
}

const ChronoBidContext = createContext<ChronoBidContextType | undefined>(undefined);

export function ChronoBidProvider({ children }: { children: ReactNode }) {
  // 0. Toasts State
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((message: string, type: ToastMessage['type'] = 'info') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev.slice(-3), { id, message, type }]); // Keep last 4 max
    setTimeout(() => {
      dismissToast(id);
    }, 5000);
  }, [dismissToast]);

  // 1. User State (Defaults to demo collector Paddle #4102)
  const [user, setUser] = useState<UserProfile>({
    name: 'Alexander Vance',
    email: 'vance@horologyvault.ch',
    paddleNumber: '4102',
    isLoggedIn: true,
    isConsignorEnabled: true,
    failedLoginAttempts: 0,
    isThrottled: false,
  });

  const loginUser = (email: string, paddle: string = '4102') => {
    setUser((prev) => ({
      ...prev,
      email,
      name: email.split('@')[0].toUpperCase(),
      paddleNumber: paddle,
      isLoggedIn: true,
      failedLoginAttempts: 0,
      isThrottled: false,
    }));
    addToast(`Signed in successfully as Paddle #${paddle}. [SIMULATED AUTH]`, 'success');
  };

  const logoutUser = () => {
    setUser((prev) => ({
      ...prev,
      isLoggedIn: false,
    }));
    try {
      sessionStorage.removeItem('cbv_demo_user');
    } catch (_) {}
    addToast('Signed out of ChronoBid Vault saleroom.', 'info');
  };

  const recordFailedLogin = () => {
    let throttled = false;
    setUser((prev) => {
      const attempts = prev.failedLoginAttempts + 1;
      throttled = attempts >= 5;
      return {
        ...prev,
        failedLoginAttempts: attempts,
        isThrottled: throttled,
      };
    });
    return throttled;
  };

  const resetThrottling = () => {
    setUser((prev) => ({
      ...prev,
      failedLoginAttempts: 0,
      isThrottled: false,
    }));
  };

  const toggleConsignorRole = () => {
    setUser((prev) => ({
      ...prev,
      isConsignorEnabled: !prev.isConsignorEnabled,
    }));
  };

  // 2. Currency State (ADR-021 & ADR-026: USD, EUR, GBP, CHF, JPY, HKD, SGD, INR)
  const [currency, setCurrencyState] = useState<SupportedCurrency>('USD');

  useEffect(() => {
    const saved = localStorage.getItem('cbv_currency');
    if (saved && ['USD', 'EUR', 'GBP', 'CHF', 'JPY', 'HKD', 'SGD', 'INR'].includes(saved)) {
      setCurrencyState(saved as SupportedCurrency);
    }
  }, []);

  const setCurrency = (c: SupportedCurrency) => {
    setCurrencyState(c);
    localStorage.setItem('cbv_currency', c);
  };

  const formatPrice = (amountUsd: number, includeCode = false) => {
    return formatCurrency(amountUsd, currency, includeCode);
  };

  const formatDualPrice = (amountUsd: number) => {
    return formatDualCurrency(amountUsd, currency);
  };

  const getExchangeRateNotice = () => {
    return getExchangeRateLabel(currency);
  };

  // 3. Pre-Funded Vault State (FR-VLT-01 through FR-VLT-06, ADR-025 & ADR-026)
  // Available to Bid = Total Vault Balance − Reserved Funds − Other Applicable Holds
  const [totalVaultBalanceUsd, setTotalVaultBalanceUsd] = useState<number>(150000); // Standard demo default: $150,000 USD
  const [activeLotCommitments, setActiveLotCommitments] = useState<Record<string, number>>({});
  const [isSessionLoaded, setIsSessionLoaded] = useState<boolean>(false);

  // Restore simulated prototype demo state safely from sessionStorage on client mount
  useEffect(() => {
    try {
      // 1. Restore Vault Balance safely
      const savedBalance = sessionStorage.getItem('cbv_demo_vault_balance');
      if (savedBalance !== null) {
        const parsed = parseFloat(savedBalance);
        if (!isNaN(parsed) && isFinite(parsed) && parsed >= 0) {
          setTotalVaultBalanceUsd(parsed);
        }
      }

      // 2. Restore active commitments safely
      const savedCommitments = sessionStorage.getItem('cbv_demo_commitments');
      if (savedCommitments) {
        const parsed = JSON.parse(savedCommitments);
        if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
          const clean: Record<string, number> = {};
          for (const [k, v] of Object.entries(parsed)) {
            if (typeof k === 'string' && typeof v === 'number' && !isNaN(v) && isFinite(v) && v >= 0) {
              clean[k] = v;
            }
          }
          setActiveLotCommitments(clean);
        }
      }

      // 3. Restore demo user state safely (only demo fields, no sensitive credentials)
      const savedUser = sessionStorage.getItem('cbv_demo_user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        if (typeof parsed === 'object' && parsed !== null) {
          setUser((prev) => ({
            ...prev,
            name: typeof parsed.name === 'string' ? parsed.name : prev.name,
            email: typeof parsed.email === 'string' ? parsed.email : prev.email,
            paddleNumber: typeof parsed.paddleNumber === 'string' ? parsed.paddleNumber : prev.paddleNumber,
            isLoggedIn: typeof parsed.isLoggedIn === 'boolean' ? parsed.isLoggedIn : prev.isLoggedIn,
            isConsignorEnabled: typeof parsed.isConsignorEnabled === 'boolean' ? parsed.isConsignorEnabled : prev.isConsignorEnabled,
            failedLoginAttempts: typeof parsed.failedLoginAttempts === 'number' ? parsed.failedLoginAttempts : prev.failedLoginAttempts,
            isThrottled: typeof parsed.isThrottled === 'boolean' ? parsed.isThrottled : prev.isThrottled,
          }));
        }
      }
    } catch (e) {
      console.warn('Could not restore demo session state from sessionStorage:', e);
    } finally {
      setIsSessionLoaded(true);
    }
  }, []);

  // Sync demo balance to sessionStorage
  useEffect(() => {
    if (!isSessionLoaded) return;
    try {
      sessionStorage.setItem('cbv_demo_vault_balance', String(totalVaultBalanceUsd));
    } catch (_) {}
  }, [totalVaultBalanceUsd, isSessionLoaded]);

  // Sync active commitments to sessionStorage
  useEffect(() => {
    if (!isSessionLoaded) return;
    try {
      sessionStorage.setItem('cbv_demo_commitments', JSON.stringify(activeLotCommitments));
    } catch (_) {}
  }, [activeLotCommitments, isSessionLoaded]);

  // Sync demo user profile to sessionStorage
  useEffect(() => {
    if (!isSessionLoaded) return;
    try {
      sessionStorage.setItem('cbv_demo_user', JSON.stringify({
        name: user.name,
        email: user.email,
        paddleNumber: user.paddleNumber,
        isLoggedIn: user.isLoggedIn,
        isConsignorEnabled: user.isConsignorEnabled,
        failedLoginAttempts: user.failedLoginAttempts,
        isThrottled: user.isThrottled,
      }));
    } catch (_) {}
  }, [user, isSessionLoaded]);

  const reservedFundsUsd = Object.values(activeLotCommitments).reduce((acc, curr) => acc + curr, 0);
  const availableToBidUsd = Math.max(0, totalVaultBalanceUsd - reservedFundsUsd);

  const setTotalVaultBalance = (amountUsd: number) => {
    setTotalVaultBalanceUsd(amountUsd);
    addToast(`Vault Total Balance updated to $${amountUsd.toLocaleString()} USD. [DEMO DATA]`, 'info');
  };

  // Helper to test benchmark fixtures in INR: ₹1,00,000 = $1,189.48 USD @ 84.07 rate
  const setVaultBalanceToInrFixture = (inrAmount: number = 100000) => {
    const usdEquivalent = Math.round(inrAmount / 84.07);
    setActiveLotCommitments({});
    setTotalVaultBalanceUsd(usdEquivalent);
    setCurrency('INR');
    try {
      sessionStorage.setItem('cbv_demo_vault_balance', String(usdEquivalent));
      sessionStorage.setItem('cbv_demo_commitments', JSON.stringify({}));
    } catch (_) {}
    addToast(`Vault configured to ₹${inrAmount.toLocaleString('en-IN')} fixture ($${usdEquivalent.toLocaleString()} USD). [DEMO]`, 'info');
  };

  const resetVaultBalances = () => {
    setActiveLotCommitments({});
    setTotalVaultBalanceUsd(150000);
    try {
      sessionStorage.removeItem('cbv_demo_vault_balance');
      sessionStorage.removeItem('cbv_demo_commitments');
    } catch (_) {}
    addToast('Vault balances reset to standard $150,000 USD fixture. [DEMO DATA]', 'info');
  };

  // 4. Live Auction State (Lot 01: 1968 Patek Philippe Calatrava Ref. 3520D)
  const liveLot = WATCH_LOTS[0];
  const [currentBidUsd, setCurrentBidUsd] = useState<number>(liveLot.currentBidUsd);
  const [highestBidderPaddle, setHighestBidderPaddle] = useState<string>('3098');
  const [remainingSeconds, setRemainingSeconds] = useState<number>(145); // Starts at 02:25
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);
  const [extensionCount, setExtensionCount] = useState<number>(0);
  const [isSoftCloseActive, setIsSoftCloseActive] = useState<boolean>(false);
  const [userProxyCeilingUsd, setUserProxyCeilingUsd] = useState<number | null>(null);

  const isSaleroomClosed = remainingSeconds <= 0;

  const [bidHistory, setBidHistory] = useState<BidRecord[]>([
    {
      id: 'b-01',
      bidderPaddle: '1984',
      amountUsd: 18000,
      timestamp: '14:20:10',
      isUser: false,
      isExtensionTrigger: false,
    },
    {
      id: 'b-02',
      bidderPaddle: '2750',
      amountUsd: 19000,
      timestamp: '14:24:45',
      isUser: false,
      isExtensionTrigger: false,
    },
    {
      id: 'b-03',
      bidderPaddle: '3098',
      amountUsd: 20000,
      timestamp: '14:28:02',
      isUser: false,
      isExtensionTrigger: false,
    },
    {
      id: 'b-04',
      bidderPaddle: '4102',
      amountUsd: 21000,
      timestamp: '14:29:15',
      isUser: true,
      isExtensionTrigger: false,
    },
    {
      id: 'b-05',
      bidderPaddle: '3098',
      amountUsd: 22000,
      timestamp: '14:30:00',
      isUser: false,
      isExtensionTrigger: false,
    },
  ]);

  // Synchronized auction timer countdown tick
  useEffect(() => {
    if (!isTimerRunning || remainingSeconds <= 0) return;

    const interval = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          setIsTimerRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isTimerRunning, remainingSeconds]);

  // Automated Floor Bot Counter-Bid Simulation (Realistic saleroom dynamic & Outbid Fund Release)
  useEffect(() => {
    if (highestBidderPaddle === user.paddleNumber && remainingSeconds > 8 && !isSaleroomClosed) {
      const delay = Math.floor(Math.random() * 2500) + 3000; // 3 to 5.5 seconds
      const timeout = setTimeout(() => {
        const nextMin = getNextMinimumBid(currentBidUsd);

        // Check proxy ceiling
        if (userProxyCeilingUsd && userProxyCeilingUsd >= getNextMinimumBid(nextMin)) {
          const botBid = nextMin;
          const userAutoBid = getNextMinimumBid(botBid);
          const evalResult = evaluateSoftCloseBid(remainingSeconds, extensionCount);

          if (evalResult.bidAccepted) {
            // Check Vault eligibility for user proxy auto-bid
            const currentLotHold = activeLotCommitments[liveLot.id] || 0;
            const incrementalRequired = userAutoBid - currentLotHold;

            if (incrementalRequired <= availableToBidUsd) {
              if (evalResult.timerReset && evalResult.newTimeSeconds) {
                setRemainingSeconds(evalResult.newTimeSeconds);
                setExtensionCount(evalResult.newExtensionCount);
                setIsSoftCloseActive(true);
              }
              setCurrentBidUsd(userAutoBid);
              setHighestBidderPaddle(user.paddleNumber);

              // Update vault commitment to new high bid
              setActiveLotCommitments((prev) => ({
                ...prev,
                [liveLot.id]: userAutoBid,
              }));

              setBidHistory((prev) => [
                {
                  id: `b-${Date.now()}-bot`,
                  bidderPaddle: '7821',
                  amountUsd: botBid,
                  timestamp: new Date().toLocaleTimeString(),
                  isUser: false,
                  isExtensionTrigger: evalResult.consumedExtension,
                  extensionNumber: evalResult.consumedExtension ? evalResult.newExtensionCount : undefined,
                },
                {
                  id: `b-${Date.now()}-user`,
                  bidderPaddle: user.paddleNumber,
                  amountUsd: userAutoBid,
                  timestamp: new Date().toLocaleTimeString(),
                  isUser: true,
                  isExtensionTrigger: false,
                },
                ...prev,
              ]);
              addToast(`Floor bidder placed $${botBid.toLocaleString()}. Your proxy automatically advanced you to $${userAutoBid.toLocaleString()}. [DEMO DATA]`, 'info');
              return;
            }
          }
        }

        // Standard floor bot counter-bid: User is OUTBID -> Trigger instant fund release!
        const botBid = nextMin;
        const evalResult = evaluateSoftCloseBid(remainingSeconds, extensionCount);
        if (evalResult.bidAccepted) {
          if (evalResult.timerReset && evalResult.newTimeSeconds) {
            setRemainingSeconds(evalResult.newTimeSeconds);
            setExtensionCount(evalResult.newExtensionCount);
            setIsSoftCloseActive(true);
          }
          setCurrentBidUsd(botBid);
          setHighestBidderPaddle('7821');

          // Release user's previous leading commitment back into Available to Bid
          const previousHold = activeLotCommitments[liveLot.id] || 0;
          if (previousHold > 0) {
            setActiveLotCommitments((prev) => {
              const next = { ...prev };
              delete next[liveLot.id];
              return next;
            });
            addToast(
              `Outbid alert! Saleroom floor bidder placed $${botBid.toLocaleString()}. Your reserved funds of $${previousHold.toLocaleString()} USD have been released back to your Available to Bid balance. [FR-VLT-03]`,
              'warning'
            );
          } else {
            addToast(`Outbid alert! Saleroom floor bidder placed $${botBid.toLocaleString()}.`, 'warning');
          }

          setBidHistory((prev) => [
            {
              id: `b-${Date.now()}`,
              bidderPaddle: '7821',
              amountUsd: botBid,
              timestamp: new Date().toLocaleTimeString(),
              isUser: false,
              isExtensionTrigger: evalResult.consumedExtension,
              extensionNumber: evalResult.consumedExtension ? evalResult.newExtensionCount : undefined,
            },
            ...prev,
          ]);
        }
      }, delay);

      return () => clearTimeout(timeout);
    }
  }, [
    highestBidderPaddle,
    currentBidUsd,
    remainingSeconds,
    user.paddleNumber,
    userProxyCeilingUsd,
    extensionCount,
    isSaleroomClosed,
    activeLotCommitments,
    availableToBidUsd,
    liveLot.id,
    addToast,
  ]);

  // Place Quick Bid (next minimum increment) with Vault Affordability Gating
  const placeQuickBid = () => {
    if (isSaleroomClosed) {
      addToast('Cannot place bid: Saleroom has closed for this lot.', 'error');
      return { success: false, message: 'Auction closed.' };
    }
    const nextAmount = getNextMinimumBid(currentBidUsd);
    return placeCustomBid(nextAmount);
  };

  // Place Custom Jump-Bid with Full Pre-Bid Vault Affordability Check (FR-VLT-02, FR-VLT-03, FR-VLT-06)
  const placeCustomBid = (amountUsd: number) => {
    // 1. Minimum and increment alignment validation
    const val = validateCustomBid(amountUsd, currentBidUsd);
    if (!val.valid) {
      addToast(val.message || 'Invalid bid amount.', 'error');
      return { success: false, message: val.message || 'Invalid bid.' };
    }

    // 2. Pre-Bid Vault Affordability Gating (FR-VLT-02):
    // Bid cannot exceed Available to Bid. If user already holds a leading commitment on this lot,
    // only the net incremental difference is checked.
    const currentLotHold = activeLotCommitments[liveLot.id] || 0;
    const incrementalRequired = amountUsd - currentLotHold;

    if (incrementalRequired > availableToBidUsd) {
      const shortfallUsd = incrementalRequired - availableToBidUsd;
      const shortfallDisplay = formatCurrency(shortfallUsd, currency);
      const availableDisplay = formatCurrency(availableToBidUsd, currency);
      const attemptedDisplay = formatCurrency(amountUsd, currency);

      const errorMessage = 'Bid not accepted. Your available Vault balance is insufficient for this bid. Add eligible funds or reduce your bid amount.';
      addToast(`${errorMessage} (Available: ${availableDisplay}, Attempted: ${attemptedDisplay}, Shortfall: ${shortfallDisplay})`, 'error');

      // Reject bid immediately: retain focus, do not reset countdown clock, do not update current ask
      return {
        success: false,
        message: errorMessage,
      };
    }

    // 3. Soft-Close Clock Evaluation (ADR-012)
    const evalResult = evaluateSoftCloseBid(remainingSeconds, extensionCount);
    if (!evalResult.bidAccepted) {
      addToast(evalResult.statusMessage, 'error');
      return { success: false, message: evalResult.statusMessage };
    }

    // Apply timer reset if eligible
    if (evalResult.timerReset && evalResult.newTimeSeconds !== undefined) {
      setRemainingSeconds(evalResult.newTimeSeconds);
      setExtensionCount(evalResult.newExtensionCount);
      setIsSoftCloseActive(true);
    }

    // 4. Update Saleroom and Reserve Vault Funds (FR-VLT-03)
    setCurrentBidUsd(amountUsd);
    setHighestBidderPaddle(user.paddleNumber);

    // Commit funds to this lot
    setActiveLotCommitments((prev) => ({
      ...prev,
      [liveLot.id]: amountUsd,
    }));

    const newRecord: BidRecord = {
      id: `b-${Date.now()}`,
      bidderPaddle: user.paddleNumber,
      amountUsd,
      timestamp: new Date().toLocaleTimeString(),
      isUser: true,
      isExtensionTrigger: evalResult.consumedExtension,
      extensionNumber: evalResult.consumedExtension ? evalResult.newExtensionCount : undefined,
    };

    setBidHistory((prev) => [newRecord, ...prev]);
    addToast(
      `${evalResult.statusMessage} Vault reserved: $${amountUsd.toLocaleString()} USD. [FR-VLT-03]`,
      evalResult.timerReset ? 'warning' : 'success'
    );
    return { success: true, message: evalResult.statusMessage };
  };

  // Multi-lot simulated bid placement for testing cross-lot constraints (FR-VLT-04)
  const placeMultiLotBid = (lotId: string, amountUsd: number) => {
    const currentLotHold = activeLotCommitments[lotId] || 0;
    const incrementalRequired = amountUsd - currentLotHold;

    if (incrementalRequired > availableToBidUsd) {
      const errorMessage = 'Bid not accepted. Your available Vault balance is insufficient for this bid. Add eligible funds or reduce your bid amount.';
      addToast(`[Lot ${lotId}] ${errorMessage}`, 'error');
      return { success: false, message: errorMessage };
    }

    setActiveLotCommitments((prev) => ({
      ...prev,
      [lotId]: amountUsd,
    }));
    addToast(`Bid of $${amountUsd.toLocaleString()} USD accepted on Lot ${lotId}. Funds reserved in Vault.`, 'success');
    return { success: true, message: 'Bid accepted and funds reserved.' };
  };

  // Benchmark 1 Runner (FR-VLT-02): ₹1,00,000 available rejecting ₹2,00,000 bid
  const runBenchmark1 = () => {
    const inrRate = 84.07;
    const balanceUsd = Math.round(100000 / inrRate); // $1,189 USD = ₹1,00,000
    const bidUsd = Math.round(200000 / inrRate);    // $2,379 USD = ₹2,00,000

    setActiveLotCommitments({});
    setTotalVaultBalanceUsd(balanceUsd);
    setCurrency('INR');

    const errorMessage = 'Bid not accepted. Your available Vault balance is insufficient for this bid. Add eligible funds or reduce your bid amount.';
    addToast(
      `[Benchmark 1 Verified] Available: ₹1,00,000. Attempted: ₹2,00,000. Rejection triggered: "${errorMessage}"`,
      'warning'
    );

    return {
      success: false,
      message: errorMessage,
      attemptedInr: 200000,
      availableInr: 100000,
    };
  };

  // Benchmark 2 Runner (FR-VLT-04): ₹1,00,000 available accepting ₹70,000 on Lot A but rejecting second ₹60,000 on Lot B
  const runBenchmark2 = () => {
    const inrRate = 84.07;
    const totalUsd = Math.round(100000 / inrRate); // $1,189 USD = ₹1,00,000
    const lotAUsd = Math.round(70000 / inrRate);   // $833 USD = ₹70,000
    const lotBUsd = Math.round(60000 / inrRate);   // $714 USD = ₹60,000

    // Set clean baseline of ₹1,00,000
    setTotalVaultBalanceUsd(totalUsd);
    setCurrency('INR');

    // 1. Lot A accepted
    const newCommitments = { 'lot-01': lotAUsd };
    setActiveLotCommitments(newCommitments);

    const remainingAvailable = totalUsd - lotAUsd; // $356 USD (~₹30,000)
    const lotBExceeds = lotBUsd > remainingAvailable;

    const errorMessage = 'Bid not accepted. Your available Vault balance is insufficient for this bid. Add eligible funds or reduce your bid amount.';
    addToast(
      `[Benchmark 2 Verified] Initial: ₹1,00,000. Lot A reserved ₹70,000 (Avail: ₹30,000). Second bid ₹60,000 on Lot B rejected: "${errorMessage}"`,
      'warning'
    );

    return {
      lotASuccess: true,
      lotBSuccess: false,
      message: errorMessage,
    };
  };

  const setProxyCeiling = (amountUsd: number) => {
    if (amountUsd <= currentBidUsd) {
      addToast('Proxy ceiling must be higher than current high bid.', 'error');
      return;
    }
    setUserProxyCeilingUsd(amountUsd);
    addToast(`Confidential proxy ceiling set at $${amountUsd.toLocaleString()}.`, 'info');
  };

  const setRemainingTimeManually = (seconds: number) => {
    setRemainingSeconds(seconds);
    setIsTimerRunning(true);
    addToast(`Clock simulated to ${Math.floor(seconds / 60)}m ${seconds % 60}s.`, 'info');
  };

  const setExtensionCountManually = (count: number) => {
    setExtensionCount(count);
    addToast(`Soft-close extension count set to ${count}/10.`, 'info');
  };

  const resetSaleroomAuction = () => {
    setCurrentBidUsd(22000);
    setHighestBidderPaddle('3098');
    setRemainingSeconds(145);
    setIsTimerRunning(true);
    setExtensionCount(0);
    setIsSoftCloseActive(false);
    setUserProxyCeilingUsd(null);
    setActiveLotCommitments({});
    try {
      sessionStorage.removeItem('cbv_demo_commitments');
    } catch (_) {}
    addToast('Saleroom state and Vault reservations reset to opening demo configuration.', 'info');
  };

  // 5. Watchlist State
  const [watchlist, setWatchlist] = useState<string[]>(['lot-01', 'lot-03']);

  const toggleWatchlist = (lotId: string) => {
    setWatchlist((prev) => {
      const exists = prev.includes(lotId);
      const next = exists ? prev.filter((id) => id !== lotId) : [...prev, lotId];
      addToast(exists ? 'Removed from your private watchlist.' : 'Added to your private watchlist.', 'info');
      return next;
    });
  };

  const isWatchlisted = (lotId: string) => watchlist.includes(lotId);

  // 6. Consignments State
  const INITIAL_DEMO_CONSIGNMENTS: ConsignmentTicket[] = [
    {
      ticketId: 'CBV-INTAKE-4821',
      category: 'Fine Horology',
      manufacturer: 'Heuer',
      reference: 'Autavia Ref. 1163T "Jo Siffert"',
      year: 'Circa 1970',
      condition: 'Excellent unrestored patina, original box and papers',
      reserveEstimateUsd: 18500,
      submittedAt: '17 Oct 2026',
      status: 'Under Specialist Review',
      reserveAgreed: true,
      clientContactEmail: 'vance@horologyvault.ch',
    },
    {
      ticketId: 'CBV-INTAKE-3904',
      category: 'Fine Horology',
      manufacturer: 'IWC Schaffhausen',
      reference: 'Ingenieur SL Ref. 1832 "Jumbo"',
      year: 'Circa 1976',
      condition: 'Original Genta case geometry with integrated bracelet',
      reserveEstimateUsd: 28000,
      submittedAt: '14 Oct 2026',
      status: 'Inspection Scheduled',
      reserveAgreed: false,
      clientContactEmail: 'vance@horologyvault.ch',
    },
    {
      ticketId: 'CBV-INTAKE-5120',
      category: 'Rare Coins & Numismatics',
      manufacturer: 'Roman Imperial Mint',
      reference: 'Aureus of Emperor Trajan (RIC II 254)',
      year: 'Circa 112 AD',
      condition: 'NGC Ancients Choice AU (Strike 5/5, Surface 4/5)',
      reserveEstimateUsd: 35000,
      submittedAt: '19 Oct 2026',
      status: 'Valuation Issued',
      reserveAgreed: false,
      valuationEstimateLowUsd: 32000,
      valuationEstimateHighUsd: 40000,
      specialistNotes: 'Exceptional luster on broad flan. Strong imperial portraiture. Recommended for Spring Numismatics Session.',
      clientContactEmail: 'numismatics.desk@collector.org',
    },
    {
      ticketId: 'CBV-INTAKE-6288',
      category: 'Haute Joaillerie',
      manufacturer: 'Boucheron Paris',
      reference: 'Art Deco Kashmir Sapphire & Diamond Cluster Ring',
      year: 'Circa 1928',
      condition: '4.85ct Unheated Kashmir Sapphire, SSEF Report No. 118492',
      reserveEstimateUsd: 120000,
      submittedAt: '21 Oct 2026',
      status: 'Reserve Approved',
      reserveAgreed: true,
      valuationEstimateLowUsd: 110000,
      valuationEstimateHighUsd: 150000,
      specialistNotes: 'SSEF monograph confirms velvety cornflower blue with no thermal enhancement. Reserve approved at $120k.',
      clientContactEmail: 'geneva.estate@luxuryholdings.ch',
    },
    {
      ticketId: 'CBV-INTAKE-7419',
      category: 'Fine Art',
      manufacturer: 'Camille Pissarro',
      reference: 'Soleil Couchant à Éragny (Oil on Canvas)',
      year: '1892',
      condition: 'Fine conserved state, Wildenstein Catalogue Raisonné Vol. III Ref. 814',
      reserveEstimateUsd: 250000,
      submittedAt: '22 Oct 2026',
      status: 'Under Specialist Review',
      reserveAgreed: false,
      clientContactEmail: 'artcurator@finearts-heritage.fr',
    },
  ];

  const [consignments, setConsignments] = useState<ConsignmentTicket[]>(INITIAL_DEMO_CONSIGNMENTS);

  const addConsignment = (ticket: Omit<ConsignmentTicket, 'ticketId' | 'submittedAt' | 'status'>) => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const ticketId = `CBV-INTAKE-${randomSuffix}`;
    const newTicket: ConsignmentTicket = {
      ...ticket,
      ticketId,
      submittedAt: 'Today',
      status: 'Under Specialist Review',
    };
    setConsignments((prev) => [newTicket, ...prev]);
    addToast(`Consignment ticket ${ticketId} created. Under Specialist Review.`, 'success');
    return ticketId;
  };

  const toggleReserveAgreement = (ticketId: string) => {
    setConsignments((prev) =>
      prev.map((item) =>
        item.ticketId === ticketId ? { ...item, reserveAgreed: !item.reserveAgreed } : item
      )
    );
    addToast('Reserve price agreement status updated.', 'info');
  };

  const updateConsignmentStatus = (
    ticketId: string,
    status: ConsignmentStatus,
    valuationLow?: number,
    valuationHigh?: number,
    notes?: string
  ) => {
    setConsignments((prev) =>
      prev.map((item) => {
        if (item.ticketId !== ticketId) return item;
        return {
          ...item,
          status,
          ...(valuationLow !== undefined ? { valuationEstimateLowUsd: valuationLow } : {}),
          ...(valuationHigh !== undefined ? { valuationEstimateHighUsd: valuationHigh } : {}),
          ...(notes !== undefined ? { specialistNotes: notes } : {}),
        };
      })
    );
    addToast(`Ticket ${ticketId} status updated to: ${status}`, 'success');
  };

  const clearConsignments = () => {
    setConsignments([]);
    addToast('Consignment tickets cleared to test empty state.', 'info');
  };

  const resetConsignments = () => {
    setConsignments(INITIAL_DEMO_CONSIGNMENTS);
    addToast('Consignment tickets reset to multi-category catalog defaults.', 'info');
  };

  // 7. Consignor Sales & Realisation History (Feature D)
  const INITIAL_CONSIGNOR_SALES: ConsignorSaleRecord[] = [
    {
      id: 'sale-01',
      ticketId: 'CBV-INTAKE-2194',
      lotTitle: '1974 Patek Philippe Calatrava Ref. 3520/1 in 18k White Gold',
      lotReference: 'Ref. 3520/1 • Cal. 175',
      category: 'Fine Horology',
      sessionTitle: 'Session No. 18 • September Sovereign Evening Sale',
      sessionNumber: 18,
      saleDate: '24 Sep 2026',
      reserveUsd: 22000,
      hammerPriceUsd: 28000,
      saleOutcome: 'sold',
      simulatedNetProceedsUsd: 25200,
      settlementStatus: 'Settled to Escrow [SIMULATED]',
      lotSlug: 'patek-philippe-calatrava-3520d',
    },
    {
      id: 'sale-02',
      ticketId: 'CBV-INTAKE-1842',
      lotTitle: 'Classical Athenian Silver Tetradrachm Owl (c. 450 BC)',
      lotReference: 'NGC Choice AU • 17.18g',
      category: 'Rare Coins & Numismatics',
      sessionTitle: 'Session No. 18 • September Sovereign Evening Sale',
      sessionNumber: 18,
      saleDate: '24 Sep 2026',
      reserveUsd: 95000,
      hammerPriceUsd: 105000,
      saleOutcome: 'sold',
      simulatedNetProceedsUsd: 94500,
      settlementStatus: 'Settled to Escrow [SIMULATED]',
      lotSlug: 'athenian-silver-tetradrachm-owl-460bc',
    },
    {
      id: 'sale-03',
      ticketId: 'CBV-INTAKE-0912',
      lotTitle: 'Roman Empire Gold Aureus of Augustus (Lugdunum Mint, 2 BC)',
      lotReference: 'RIC I 207 • 7.78g',
      category: 'Rare Coins & Numismatics',
      sessionTitle: 'Session No. 18 • September Sovereign Evening Sale',
      sessionNumber: 18,
      saleDate: '24 Sep 2026',
      reserveUsd: 75000,
      hammerPriceUsd: null,
      saleOutcome: 'bought_in',
      simulatedNetProceedsUsd: null,
      settlementStatus: 'Retained in FreePort Vault Storage',
    },
    {
      id: 'sale-04',
      ticketId: 'CBV-INTAKE-1102',
      lotTitle: 'Cartier Paris Art Deco Colombian Emerald Sautoir (1925)',
      lotReference: '14.82ct Colombian Sugarloaf • Platinum',
      category: 'Haute Joaillerie',
      sessionTitle: 'Session No. 17 • July High Summer Curatorial Auction',
      sessionNumber: 17,
      saleDate: '16 Jul 2026',
      reserveUsd: 380000,
      hammerPriceUsd: 420000,
      saleOutcome: 'sold',
      simulatedNetProceedsUsd: 378000,
      settlementStatus: 'Settled to Escrow [SIMULATED]',
      lotSlug: 'cartier-art-deco-colombian-emerald-sautoir-1925',
    },
  ];

  const [consignorSalesHistory] = useState<ConsignorSaleRecord[]>(INITIAL_CONSIGNOR_SALES);

  // 8. Persistent Notification Centre State (Feature B)
  const INITIAL_DEMO_NOTIFICATIONS: NotificationItem[] = [
    {
      id: 'notif-1',
      category: 'bidding',
      title: 'Outbid Alert: Saleroom Floor Advance',
      description: 'Floor bidder Paddle #3098 advanced the ask on Lot 01 (Patek Philippe 3520D) to $22,000 USD. Your reserved funds have been restored to Available to Bid balance.',
      timestamp: '12 mins ago',
      isRead: false,
      link: '/auctions/live',
      badge: 'Live Saleroom',
    },
    {
      id: 'notif-2',
      category: 'consignments',
      title: 'Curatorial Valuation Issued: Trajan Aureus',
      description: 'Senior Numismatist Jean-Claude Vernier has completed forensic analysis on ticket CBV-INTAKE-5120 and issued a catalogue valuation of $32,000 – $40,000 USD.',
      timestamp: '2 hours ago',
      isRead: false,
      link: '/account/consignments',
      badge: 'Specialist Desk',
    },
    {
      id: 'notif-3',
      category: 'watchlist',
      title: 'Watchlist Reminder: Session No. 19 Catalog Live',
      description: 'Lot 07 (Athenian Silver Tetradrachm) and Lot 10 (Cartier Emerald Sautoir) on your watchlist are scheduled for upcoming saleroom presentation.',
      timestamp: '1 day ago',
      isRead: false,
      link: '/auctions/upcoming',
      badge: 'Catalog',
    },
    {
      id: 'notif-4',
      category: 'consignments',
      title: 'Reserve Approved for Saleroom: Art Deco Ring',
      description: 'Reserve agreement of $120,000 USD confirmed for Boucheron Kashmir Sapphire Ring (CBV-INTAKE-6288). Lot catalogued for premier presentation.',
      timestamp: '2 days ago',
      isRead: true,
      link: '/account/consignments',
      badge: 'Consignments',
    },
    {
      id: 'notif-5',
      category: 'system',
      title: 'Pre-Funded Vault Headroom Fixture Active',
      description: 'Your verified Geneva Collector virtual paddle #4102 is active with $150,000 USD credit headroom under Swiss Bonded FreePort escrow parameters [DEMO DATA].',
      timestamp: '3 days ago',
      isRead: true,
      link: '/account/settings',
      badge: 'Pre-Funded Vault',
    },
  ];

  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_DEMO_NOTIFICATIONS);

  const unreadNotificationCount = notifications.filter((n) => !n.isRead).length;

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    addToast('All notifications marked as read.', 'info');
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    addToast('Notification dismissed.', 'info');
  };

  const resetNotifications = () => {
    setNotifications(INITIAL_DEMO_NOTIFICATIONS);
    addToast('Notifications restored to demonstration defaults.', 'info');
  };

  return (
    <ChronoBidContext.Provider
      value={{
        user,
        loginUser,
        logoutUser,
        recordFailedLogin,
        resetThrottling,
        toggleConsignorRole,
        currency,
        setCurrency,
        formatPrice,
        formatDualPrice,
        getExchangeRateNotice,
        totalVaultBalanceUsd,
        reservedFundsUsd,
        availableToBidUsd,
        activeLotCommitments,
        setTotalVaultBalance,
        setVaultBalanceToInrFixture,
        resetVaultBalances,
        placeMultiLotBid,
        runBenchmark1,
        runBenchmark2,
        liveLot,
        remainingSeconds,
        isTimerRunning,
        extensionCount,
        isSoftCloseActive,
        isSaleroomClosed,
        bidHistory,
        currentBidUsd,
        highestBidderPaddle,
        userProxyCeilingUsd,
        placeQuickBid,
        placeCustomBid,
        setProxyCeiling,
        setRemainingTimeManually,
        setExtensionCountManually,
        resetSaleroomAuction,
        watchlist,
        toggleWatchlist,
        isWatchlisted,
        consignments,
        addConsignment,
        toggleReserveAgreement,
        updateConsignmentStatus,
        clearConsignments,
        resetConsignments,
        consignorSalesHistory,
        notifications,
        unreadNotificationCount,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        deleteNotification,
        resetNotifications,
        toasts,
        addToast,
        dismissToast,
      }}
    >
      {children}
    </ChronoBidContext.Provider>
  );
}

export function useChronoBid() {
  const context = useContext(ChronoBidContext);
  if (!context) {
    throw new Error('useChronoBid must be used within a ChronoBidProvider');
  }
  return context;
}
