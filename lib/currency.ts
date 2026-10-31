// ChronoBid Vault — Currency Calculation & Formatting (ADR-021 & ADR-026)
// Base auction currency: USD. Fixed prototype demonstration multipliers derived from ECB/RBI reference rates dated 16 October 2026.
// Prototype conversions execute directly against the documented rounded multipliers.

export type SupportedCurrency = 'USD' | 'EUR' | 'GBP' | 'CHF' | 'JPY' | 'HKD' | 'SGD' | 'INR';

export interface CurrencyConfig {
  code: SupportedCurrency;
  name: string;
  symbol: string;
  multiplier: number; // Documented demonstration multiplier
  precision: number;  // 0 for JPY/INR, 0 or 2 for others
  locale: string;
}

export const CURRENCY_CONFIGS: Record<SupportedCurrency, CurrencyConfig> = {
  USD: {
    code: 'USD',
    name: 'US Dollar',
    symbol: '$',
    multiplier: 1.0000,
    precision: 0,
    locale: 'en-US',
  },
  EUR: {
    code: 'EUR',
    name: 'Euro',
    symbol: '€',
    multiplier: 0.8887,
    precision: 0,
    locale: 'de-DE',
  },
  GBP: {
    code: 'GBP',
    name: 'British Pound',
    symbol: '£',
    multiplier: 0.7499,
    precision: 0,
    locale: 'en-GB',
  },
  CHF: {
    code: 'CHF',
    name: 'Swiss Franc',
    symbol: 'CHF ',
    multiplier: 0.8240,
    precision: 0,
    locale: 'de-CH',
  },
  JPY: {
    code: 'JPY',
    name: 'Japanese Yen',
    symbol: '¥',
    multiplier: 158.02,
    precision: 0,
    locale: 'ja-JP',
  },
  HKD: {
    code: 'HKD',
    name: 'Hong Kong Dollar',
    symbol: 'HK$',
    multiplier: 7.8482,
    precision: 0,
    locale: 'zh-HK',
  },
  SGD: {
    code: 'SGD',
    name: 'Singapore Dollar',
    symbol: 'SG$',
    multiplier: 1.2792,
    precision: 0,
    locale: 'en-SG',
  },
  INR: {
    code: 'INR',
    name: 'Indian Rupee',
    symbol: '₹',
    multiplier: 84.07,
    precision: 0,
    locale: 'en-IN',
  },
};

/**
 * Converts a base USD amount to the requested display currency using the fixed demonstration multiplier.
 * e.g., $100,000 * 0.8887 = €88,870; $100,000 * 84.07 = ₹84,07,000.
 */
export function convertCurrency(amountUsd: number, targetCurrency: SupportedCurrency): number {
  const config = CURRENCY_CONFIGS[targetCurrency];
  if (!config) {
    return amountUsd;
  }
  const converted = amountUsd * config.multiplier;
  return Math.round(converted);
}

/**
 * Formats a converted amount with appropriate symbol and thousands separators.
 */
export function formatCurrency(
  amountUsd: number,
  currency: SupportedCurrency = 'USD',
  includeCode: boolean = false
): string {
  const config = CURRENCY_CONFIGS[currency];
  if (!config) {
    return `$${amountUsd.toLocaleString('en-US')} [CONVERSION UNAVAILABLE]`;
  }

  const convertedValue = convertCurrency(amountUsd, currency);
  const formattedNumber = convertedValue.toLocaleString(config.locale);

  if (currency === 'CHF') {
    return `${config.symbol}${formattedNumber}${includeCode ? ' CHF' : ''}`;
  }
  return `${config.symbol}${formattedNumber}${includeCode ? ` ${currency}` : ''}`;
}

/**
 * Formats an amount with dual-currency transparency (ADR-026):
 * Converted display estimate is rendered alongside the official base auction currency (USD),
 * ensuring the original auction price remains visible and preventing converted estimates
 * from being mistaken for guaranteed settlement values.
 * e.g., for $22,000 USD:
 * - When Display is USD: "$22,000 USD"
 * - When Display is EUR: "€19,551 [EST. DEMO] / $22,000 USD"
 * - When Display is INR: "₹18,49,540 [EST. DEMO] / $22,000 USD"
 */
export function formatDualCurrency(
  amountUsd: number,
  displayCurrency: SupportedCurrency = 'USD'
): string {
  const baseUsdFormatted = `$${amountUsd.toLocaleString('en-US')} USD`;
  if (displayCurrency === 'USD') {
    return baseUsdFormatted;
  }
  const converted = formatCurrency(amountUsd, displayCurrency);
  return `${converted} [EST. DEMO] / ${baseUsdFormatted}`;
}

/**
 * Returns the formal source designation, reference date, and demonstration status for the exchange rate.
 */
export function getExchangeRateLabel(currency: SupportedCurrency): string {
  if (currency === 'USD') {
    return 'Official Base Saleroom Auction Currency (USD)';
  }
  if (currency === 'INR') {
    return 'RBI Reference 16 Oct 2026 (1 USD = ₹84.07) [Fixed Demo Rate]';
  }
  const config = CURRENCY_CONFIGS[currency];
  return `ECB Reference 16 Oct 2026 (1 USD = ${config.multiplier} ${currency}) [Fixed Demo Rate]`;
}

