// ChronoBid Vault — Horological Auction Bidding Engine (ADR-012 & ADR-019)
// Prototype simulation rules: 5-tier bid increment ladder & Option B Destination-Tier Ladder Model

export interface BidTier {
  tier: number;
  min: number;
  max: number; // Infinity for top tier
  increment: number;
}

export const BID_TIERS: BidTier[] = [
  { tier: 1, min: 1, max: 9999, increment: 250 },
  { tier: 2, min: 10000, max: 49999, increment: 1000 },
  { tier: 3, min: 50000, max: 99999, increment: 2500 },
  { tier: 4, min: 100000, max: 249999, increment: 5000 },
  { tier: 5, min: 250000, max: Infinity, increment: 10000 },
];

/**
 * Returns the tier configuration for a given amount.
 */
export function getTierForAmount(amount: number): BidTier {
  for (const tier of BID_TIERS) {
    if (amount >= tier.min && amount <= tier.max) {
      return tier;
    }
  }
  return BID_TIERS[BID_TIERS.length - 1];
}

/**
 * Calculates the next minimum required bid based on the current high bid.
 */
export function getNextMinimumBid(currentBid: number): number {
  if (currentBid <= 0) return 1000;
  const currentTier = getTierForAmount(currentBid);
  return currentBid + currentTier.increment;
}

export interface ValidationResult {
  valid: boolean;
  message?: string;
  nearestValidBelow?: number;
  nearestValidAbove?: number;
}

/**
 * Validates a custom jump-bid against Option B Destination-Tier Ladder Model (ADR-019).
 * Rule: Bid must be >= next ask, and must align with (Bid - Tier.LowerBoundary) % Tier.Increment === 0.
 */
export function validateCustomBid(bidAmount: number, currentBid: number): ValidationResult {
  const nextMin = getNextMinimumBid(currentBid);

  if (!Number.isFinite(bidAmount) || bidAmount <= 0) {
    return { valid: false, message: 'Please enter a valid positive numeric bid.' };
  }

  if (bidAmount < nextMin) {
    return {
      valid: false,
      message: `Minimum required bid is $${nextMin.toLocaleString()} (Current bid $${currentBid.toLocaleString()} + increment).`,
      nearestValidAbove: nextMin,
    };
  }

  const destTier = getTierForAmount(bidAmount);
  const offset = bidAmount - destTier.min;
  const remainder = offset % destTier.increment;

  if (remainder !== 0) {
    const lowerAligned = bidAmount - remainder;
    const higherAligned = lowerAligned + destTier.increment;

    return {
      valid: false,
      message: `In tier $${destTier.min.toLocaleString()}–${destTier.max === Infinity ? 'above' : '$' + destTier.max.toLocaleString()}, bids must align to $${destTier.increment.toLocaleString()} increments.`,
      nearestValidBelow: lowerAligned >= nextMin ? lowerAligned : undefined,
      nearestValidAbove: higherAligned,
    };
  }

  return { valid: true };
}

export interface SoftCloseEvaluation {
  bidAccepted: boolean;
  timerReset: boolean;
  newTimeSeconds?: number;
  consumedExtension: boolean;
  newExtensionCount: number;
  statusMessage: string;
}

/**
 * Evaluates a bid against the auction soft-close clock and 10-extension cap (ADR-012).
 *
 * Rules:
 * 1. Bids submitted before deadline (remainingSeconds > 0) are evaluated under normal bid validation.
 * 2. If valid:
 *    - If remainingSeconds < 120 (00:01:59 to 00:00:01) AND currentExtensions < 10:
 *      Clock resets to exactly 120s (00:02:00) and extension count increments.
 *    - If remainingSeconds === 120: Accepted, but NO timer reset, NO extension consumed.
 *    - If currentExtensions >= 10: Pre-deadline bid accepted under normal validation, NO timer reset (closes at 00:00:00).
 * 3. Bids submitted at or after 00:00:00 are rejected.
 */
export function evaluateSoftCloseBid(
  remainingSeconds: number,
  currentExtensions: number,
  maxExtensions: number = 10
): SoftCloseEvaluation {
  // Check if auction already closed
  if (remainingSeconds <= 0) {
    return {
      bidAccepted: false,
      timerReset: false,
      consumedExtension: false,
      newExtensionCount: currentExtensions,
      statusMessage: 'Auction saleroom has closed for this lot. Bids are no longer accepted.',
    };
  }

  // Pre-deadline bid is valid
  // Check soft-close reset condition
  if (remainingSeconds < 120 && currentExtensions < maxExtensions) {
    const nextExtensionCount = currentExtensions + 1;
    return {
      bidAccepted: true,
      timerReset: true,
      newTimeSeconds: 120, // Exactly 00:02:00
      consumedExtension: true,
      newExtensionCount: nextExtensionCount,
      statusMessage: `Bid accepted. Anti-sniping active: Clock extended to 00:02:00 (Extension ${nextExtensionCount}/${maxExtensions}).`,
    };
  }

  if (remainingSeconds === 120) {
    return {
      bidAccepted: true,
      timerReset: false,
      consumedExtension: false,
      newExtensionCount: currentExtensions,
      statusMessage: 'Bid accepted at exactly 00:02:00. Timer reset threshold not triggered.',
    };
  }

  if (currentExtensions >= maxExtensions) {
    return {
      bidAccepted: true,
      timerReset: false,
      consumedExtension: false,
      newExtensionCount: currentExtensions,
      statusMessage: `Bid accepted. Maximum soft-close extensions (${maxExtensions}/${maxExtensions}) reached. Clock will expire at 00:00:00 without reset.`,
    };
  }

  // Normal bid with more than 120 seconds left
  return {
    bidAccepted: true,
    timerReset: false,
    consumedExtension: false,
    newExtensionCount: currentExtensions,
    statusMessage: 'Bid placed successfully in active saleroom.',
  };
}
