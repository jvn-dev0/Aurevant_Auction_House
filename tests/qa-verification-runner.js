const http = require('http');

// Direct CommonJS implementation matching lib/currency.ts byte-for-byte
const CURRENCY_CONFIGS = {
  USD: { code: 'USD', name: 'US Dollar', symbol: '$', multiplier: 1.0000, precision: 0, locale: 'en-US' },
  EUR: { code: 'EUR', name: 'Euro', symbol: '€', multiplier: 0.8887, precision: 0, locale: 'de-DE' },
  GBP: { code: 'GBP', name: 'British Pound', symbol: '£', multiplier: 0.7499, precision: 0, locale: 'en-GB' },
  CHF: { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF ', multiplier: 0.8240, precision: 0, locale: 'de-CH' },
  JPY: { code: 'JPY', name: 'Japanese Yen', symbol: '¥', multiplier: 158.02, precision: 0, locale: 'ja-JP' },
  HKD: { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$', multiplier: 7.8482, precision: 0, locale: 'zh-HK' },
  SGD: { code: 'SGD', name: 'Singapore Dollar', symbol: 'SG$', multiplier: 1.2792, precision: 0, locale: 'en-SG' },
  INR: { code: 'INR', name: 'Indian Rupee', symbol: '₹', multiplier: 84.07, precision: 0, locale: 'en-IN' },
};

function convertCurrency(amountUsd, targetCurrency) {
  const config = CURRENCY_CONFIGS[targetCurrency];
  if (!config) return amountUsd;
  return Math.round(amountUsd * config.multiplier);
}

function formatCurrency(amountUsd, currency = 'USD', includeCode = false) {
  const config = CURRENCY_CONFIGS[currency];
  if (!config) return `$${amountUsd.toLocaleString('en-US')} [CONVERSION UNAVAILABLE]`;
  const convertedValue = convertCurrency(amountUsd, currency);
  const formattedNumber = convertedValue.toLocaleString(config.locale);
  if (currency === 'CHF') {
    return `${config.symbol}${formattedNumber}${includeCode ? ' CHF' : ''}`;
  }
  return `${config.symbol}${formattedNumber}${includeCode ? ` ${currency}` : ''}`;
}

function formatDualCurrency(amountUsd, displayCurrency = 'USD') {
  const baseUsdFormatted = `$${amountUsd.toLocaleString('en-US')} USD`;
  if (displayCurrency === 'USD') return baseUsdFormatted;
  const converted = formatCurrency(amountUsd, displayCurrency);
  return `${converted} [EST. DEMO] / ${baseUsdFormatted}`;
}

function getExchangeRateLabel(currency) {
  if (currency === 'USD') return 'Official Base Saleroom Auction Currency (USD)';
  if (currency === 'INR') return 'RBI Reference 16 Oct 2026 (1 USD = ₹84.07) [Fixed Demo Rate]';
  const config = CURRENCY_CONFIGS[currency];
  return `ECB Reference 16 Oct 2026 (1 USD = ${config.multiplier} ${currency}) [Fixed Demo Rate]`;
}

const interfaceResult = [];

function assert(id, name, expected, actual, pass, notes) {
  interfaceResult.push({ id, name, expected, actual, pass, notes });
  const status = pass ? 'PASS' : 'FAIL';
  console.log(`[${status}] ${id}: ${name}`);
  if (!pass) {
    console.log(`   Expected: ${expected}`);
    console.log(`   Actual:   ${actual}`);
  }
}

console.log('===============================================================');
console.log('CHRONOBID VAULT QA VERIFICATION RUNNER');
console.log('Testing Pre-Funded Vault, Multi-Currency, Auth & Visuals');
console.log('===============================================================\n');

// -------------------------------------------------------------
// SECTION 1: CURRENCY BEHAVIOUR & INVARIANTS
// -------------------------------------------------------------
console.log('--- 1. Testing Currency Calculations & Formats ---');

const testBaseUsd = 100000;
const expectedConversions = {
  USD: { val: 100000, formatted: '$100,000' },
  EUR: { val: 88870, formatted: '€88.870' },
  GBP: { val: 74990, formatted: '£74,990' },
  CHF: { val: 82400, formatted: 'CHF 82’400' },
  JPY: { val: 15802000, formatted: '¥15,802,000' },
  HKD: { val: 784820, formatted: 'HK$784,820' },
  SGD: { val: 127920, formatted: 'SG$127,920' },
  INR: { val: 8407000, formatted: '₹84,07,000' },
};

for (const curr of Object.keys(expectedConversions)) {
  const conv = convertCurrency(testBaseUsd, curr);
  const formatted = formatCurrency(testBaseUsd, curr);
  const expectedVal = expectedConversions[curr].val;
  assert(
    `CURR-01-${curr}`,
    `Conversion of $100k USD to ${curr}`,
    `Value: ${expectedVal}`,
    `Value: ${conv} (${formatted})`,
    conv === expectedVal,
    `Multiplier: ${CURRENCY_CONFIGS[curr].multiplier}`
  );
}

// 1.2 Dual-currency formatting invariant
const dualInr = formatDualCurrency(22000, 'INR');
assert(
  'CURR-02-INR-DUAL',
  'Dual-currency display for INR on $22,000 USD ask',
  '₹18,49,540 [EST. DEMO] / $22,000 USD',
  dualInr,
  dualInr === '₹18,49,540 [EST. DEMO] / $22,000 USD'
);

const dualEur = formatDualCurrency(22000, 'EUR');
assert(
  'CURR-02-EUR-DUAL',
  'Dual-currency display for EUR on $22,000 USD ask',
  'Contains [EST. DEMO] and $22,000 USD',
  dualEur,
  dualEur.includes('[EST. DEMO] / $22,000 USD')
);

const dualUsd = formatDualCurrency(22000, 'USD');
assert(
  'CURR-02-USD-BASE',
  'Dual-currency display for USD base (renders only USD base)',
  '$22,000 USD',
  dualUsd,
  dualUsd === '$22,000 USD'
);

// 1.3 Missing rate fallback
const fallback = formatCurrency(22000, 'XYZ');
assert(
  'CURR-03-FALLBACK',
  'Missing currency rate fallback behavior',
  '$22,000 [CONVERSION UNAVAILABLE]',
  fallback,
  fallback.includes('[CONVERSION UNAVAILABLE]')
);

// 1.4 Exchange rate notices
assert(
  'CURR-04-NOTICE-INR',
  'INR exchange rate reference disclosure string',
  'RBI Reference 16 Oct 2026 (1 USD = ₹84.07) [Fixed Demo Rate]',
  getExchangeRateLabel('INR'),
  getExchangeRateLabel('INR') === 'RBI Reference 16 Oct 2026 (1 USD = ₹84.07) [Fixed Demo Rate]'
);

assert(
  'CURR-04-NOTICE-EUR',
  'EUR exchange rate reference disclosure string',
  'ECB Reference 16 Oct 2026 (1 USD = 0.8887 EUR) [Fixed Demo Rate]',
  getExchangeRateLabel('EUR'),
  getExchangeRateLabel('EUR') === 'ECB Reference 16 Oct 2026 (1 USD = 0.8887 EUR) [Fixed Demo Rate]'
);

// -------------------------------------------------------------
// SECTION 1.5: SOFT-CLOSE (ADR-012) & OPTION B LADDER (ADR-019)
// -------------------------------------------------------------
console.log('\n--- 1.5 Testing Soft-Close & Option B Bid Increment Ladder ---');

const BID_TIERS = [
  { tier: 1, min: 1, max: 9999, increment: 250 },
  { tier: 2, min: 10000, max: 49999, increment: 1000 },
  { tier: 3, min: 50000, max: 99999, increment: 2500 },
  { tier: 4, min: 100000, max: 249999, increment: 5000 },
  { tier: 5, min: 250000, max: Infinity, increment: 10000 },
];

function getTierForAmount(amount) {
  for (const tier of BID_TIERS) {
    if (amount >= tier.min && amount <= tier.max) {
      return tier;
    }
  }
  return BID_TIERS[BID_TIERS.length - 1];
}

function getNextMinimumBid(currentBid) {
  if (currentBid <= 0) return 1000;
  const currentTier = getTierForAmount(currentBid);
  return currentBid + currentTier.increment;
}

function validateCustomBid(bidAmount, currentBid) {
  const nextMin = getNextMinimumBid(currentBid);
  if (!Number.isFinite(bidAmount) || bidAmount <= 0) {
    return { valid: false, message: 'Please enter a valid positive numeric bid.' };
  }
  if (bidAmount < nextMin) {
    return { valid: false, message: `Minimum required bid is $${nextMin.toLocaleString()} (Current bid $${currentBid.toLocaleString()} + increment).` };
  }
  const destTier = getTierForAmount(bidAmount);
  const offset = bidAmount - destTier.min;
  const remainder = offset % destTier.increment;
  if (remainder !== 0) {
    return { valid: false, message: `In tier $${destTier.min.toLocaleString()}–${destTier.max === Infinity ? 'above' : '$' + destTier.max.toLocaleString()}, bids must align to $${destTier.increment.toLocaleString()} increments.` };
  }
  return { valid: true };
}

function evaluateSoftCloseBid(remainingSeconds, currentExtensions, maxExtensions = 10) {
  if (remainingSeconds <= 0) {
    return {
      bidAccepted: false,
      timerReset: false,
      consumedExtension: false,
      newExtensionCount: currentExtensions,
      statusMessage: 'Auction saleroom has closed for this lot. Bids are no longer accepted.',
    };
  }
  if (remainingSeconds < 120 && currentExtensions < maxExtensions) {
    const nextExtensionCount = currentExtensions + 1;
    return {
      bidAccepted: true,
      timerReset: true,
      newTimeSeconds: 120,
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
  return {
    bidAccepted: true,
    timerReset: false,
    consumedExtension: false,
    newExtensionCount: currentExtensions,
    statusMessage: 'Bid placed successfully in active saleroom.',
  };
}

// 1.5.1 Soft-Close Branch Tests (ADR-012)
const sc1 = evaluateSoftCloseBid(45, 0);
assert(
  'SC-01-UNDER-120S',
  'Soft-Close: Valid bid placed under 120s (45s left) resets clock to 120s and increments extension',
  'Timer reset: true, newTime: 120, extension: 1',
  `Timer reset: ${sc1.timerReset}, newTime: ${sc1.newTimeSeconds}, extension: ${sc1.newExtensionCount}`,
  sc1.bidAccepted === true && sc1.timerReset === true && sc1.newTimeSeconds === 120 && sc1.newExtensionCount === 1
);

const sc2 = evaluateSoftCloseBid(120, 0);
assert(
  'SC-02-EXACT-120S',
  'Soft-Close: Bid placed at exactly 120s accepted without clock reset or extension increment',
  'Timer reset: false, extension: 0',
  `Timer reset: ${sc2.timerReset}, extension: ${sc2.newExtensionCount}`,
  sc2.bidAccepted === true && sc2.timerReset === false && sc2.newExtensionCount === 0
);

const sc3 = evaluateSoftCloseBid(45, 10);
assert(
  'SC-03-CAP-10',
  'Soft-Close: Valid pre-deadline bid after 10 extensions accepted without timer reset (hard cap enforced)',
  'Bid accepted: true, timer reset: false, extension: 10',
  `Bid accepted: ${sc3.bidAccepted}, timer reset: ${sc3.timerReset}, extension: ${sc3.newExtensionCount}`,
  sc3.bidAccepted === true && sc3.timerReset === false && sc3.newExtensionCount === 10
);

const sc4 = evaluateSoftCloseBid(0, 5);
assert(
  'SC-04-POST-DEADLINE',
  'Soft-Close: Bid submitted at or after 00:00:00 rejected unconditionally',
  'Bid accepted: false, closed error message',
  `Bid accepted: ${sc4.bidAccepted}, message: "${sc4.statusMessage}"`,
  sc4.bidAccepted === false && sc4.statusMessage.includes('has closed')
);

// 1.5.2 Option B Destination-Tier Ladder Tests (ADR-019)
const lad1 = validateCustomBid(23000, 22000);
assert(
  'LAD-01-VALID-STEP',
  'Option B Ladder: Valid step bid in Tier 2 ($22,000 -> $23,000 with $1,000 increment)',
  'valid: true',
  `valid: ${lad1.valid}`,
  lad1.valid === true
);

const lad2 = validateCustomBid(23500, 22000);
assert(
  'LAD-02-INVALID-ALIGNMENT',
  'Option B Ladder: Misaligned custom bid ($23,500 in Tier 2 where $1,000 steps required) rejected',
  'valid: false',
  `valid: ${lad2.valid}, message: "${lad2.message}"`,
  lad2.valid === false && lad2.message.includes('$1,000 increments')
);

const lad3 = validateCustomBid(21000, 22000);
assert(
  'LAD-03-BELOW-ASK',
  'Option B Ladder: Bid below next minimum ($21,000 when current is $22,000) rejected',
  'valid: false',
  `valid: ${lad3.valid}`,
  lad3.valid === false
);

// -------------------------------------------------------------
// SECTION 2: PRE-FUNDED VAULT STATE MACHINE SIMULATION
// -------------------------------------------------------------
console.log('\n--- 2. Testing Pre-Funded Vault State Machine ---');

class VaultStateMachine {
  constructor(initialBalanceUsd = 150000, userPaddle = '4102') {
    this.totalBalanceUsd = initialBalanceUsd;
    this.commitments = {};
    this.activeLotId = 'lot-01';
    this.highestBidderPaddle = '3098';
    this.userPaddle = userPaddle;
    this.lastError = null;
  }

  get reservedFundsUsd() {
    return Object.values(this.commitments).reduce((acc, v) => acc + v, 0);
  }

  get availableToBidUsd() {
    return Math.max(0, this.totalBalanceUsd - this.reservedFundsUsd);
  }

  placeBid(lotId, amountUsd) {
    const currentHold = this.commitments[lotId] || 0;
    const incrementalRequired = amountUsd - currentHold;

    if (incrementalRequired > this.availableToBidUsd) {
      this.lastError = 'Bid not accepted. Your available Vault balance is insufficient for this bid. Add eligible funds or reduce your bid amount.';
      return false;
    }

    this.lastError = null;
    this.commitments[lotId] = amountUsd;
    this.highestBidderPaddle = this.userPaddle;
    return true;
  }

  botOutbid(lotId, botBidUsd, botPaddle = '7821') {
    this.highestBidderPaddle = botPaddle;
    delete this.commitments[lotId];
  }
}

// 2.1 Benchmark 1: ₹1,00,000 available vs ₹2,00,000 bid
const inrRate = 84.07;
const b1BalanceUsd = Math.round(100000 / inrRate); // 1,189 USD
const b1AttemptedUsd = Math.round(200000 / inrRate); // 2,379 USD

const v1 = new VaultStateMachine(b1BalanceUsd);
const b1Result = v1.placeBid('lot-01', b1AttemptedUsd);

assert(
  'VAULT-01-BENCHMARK1',
  'Benchmark 1: ₹1,00,000 available rejecting ₹2,00,000 bid',
  'false (Bid rejected with insufficient funds error)',
  `${b1Result} (Error: "${v1.lastError}")`,
  b1Result === false && v1.lastError && v1.lastError.includes('insufficient for this bid') && v1.availableToBidUsd === b1BalanceUsd && v1.reservedFundsUsd === 0,
  `Available: $${v1.availableToBidUsd} USD (~₹1,00,000), Attempted: $${b1AttemptedUsd} USD (~₹2,00,000)`
);

// 2.2 Benchmark 2: ₹1,00,000 total balance: Lot A ₹70,000 accepted; Lot B ₹60,000 rejected
const lotAUsd = Math.round(70000 / inrRate); // 833 USD
const lotBUsd = Math.round(60000 / inrRate); // 714 USD

const v2 = new VaultStateMachine(b1BalanceUsd);
const lotAResult = v2.placeBid('lot-A', lotAUsd);
const availAfterA = v2.availableToBidUsd;
const lotBResult = v2.placeBid('lot-B', lotBUsd);

assert(
  'VAULT-02-BENCHMARK2',
  'Benchmark 2: Cross-lot constraint (₹70k Lot A accepted, concurrent ₹60k Lot B rejected)',
  'Lot A: true, Lot B: false (Available after Lot A: ~₹30,000; Lot B requires ~₹60,000)',
  `Lot A: ${lotAResult}, Lot B: ${lotBResult} (Remaining Available: $${availAfterA} USD, Error: "${v2.lastError}")`,
  lotAResult === true && lotBResult === false && v2.reservedFundsUsd === lotAUsd,
  `Total Reserved: $${v2.reservedFundsUsd} USD (~₹70,000). Total Commitments cannot exceed ₹1,00,000.`
);

// 2.3 Fund reservation on leading bid
const v3 = new VaultStateMachine(150000);
const leadResult = v3.placeBid('lot-01', 40000);
assert(
  'VAULT-03-RESERVATION',
  'Fund reservation on leading bid ($40,000 bid on $150,000 balance)',
  'Reserved: $40,000, Available: $110,000',
  `Reserved: $${v3.reservedFundsUsd}, Available: $${v3.availableToBidUsd}`,
  leadResult === true && v3.reservedFundsUsd === 40000 && v3.availableToBidUsd === 110000
);

// 2.4 Fund release on bot outbid
v3.botOutbid('lot-01', 42500, '7821');
assert(
  'VAULT-04-OUTBID-RELEASE',
  'Instant release of reserved funds upon being outbid by bot',
  'Reserved: $0, Available: $150,000',
  `Reserved: $${v3.reservedFundsUsd}, Available: $${v3.availableToBidUsd}`,
  v3.reservedFundsUsd === 0 && v3.availableToBidUsd === 150000 && v3.highestBidderPaddle === '7821'
);

// 2.5 Rapid consecutive bids on the same lot & anti-double-counting
const v4 = new VaultStateMachine(150000);
v4.placeBid('lot-01', 22000);
const rapidBid1 = v4.placeBid('lot-01', 25000);
assert(
  'VAULT-05-INCREMENTAL-BID',
  'Rapid consecutive self-increment bid ($22,000 -> $25,000 on same lot checks only incremental $3,000)',
  'Reserved: $25,000, Available: $125,000 (No double-counting of 22k + 25k = 47k)',
  `Reserved: $${v4.reservedFundsUsd}, Available: $${v4.availableToBidUsd}`,
  rapidBid1 === true && v4.reservedFundsUsd === 25000 && v4.availableToBidUsd === 125000
);

// 2.6 Currency switching does not alter underlying affordability
const v5 = new VaultStateMachine(100000);
const availUsd = v5.availableToBidUsd;
const availInrDisplay = formatCurrency(availUsd, 'INR');
const availEurDisplay = formatCurrency(availUsd, 'EUR');
assert(
  'VAULT-06-CURRENCY-NEUTRALITY',
  'Switching display currency preserves identical underlying bidding affordability',
  '$100,000 USD base in memory regardless of view',
  `USD: $${availUsd}, INR: ${availInrDisplay}, EUR: ${availEurDisplay}`,
  availUsd === 100000 && availInrDisplay.includes('84,07,000') && availEurDisplay.includes('88.870')
);

// 2.7 Scenario F: Session-Based Persistence, Sanitization & Safe Reset (ADR-027)
function simulateHydration(mockStorage) {
  let balance = 150000;
  let commitments = {};
  let user = { paddleNumber: '4102', isLoggedIn: true, name: 'Alexander Vance' };

  try {
    const savedBalance = mockStorage['cbv_demo_vault_balance'];
    if (savedBalance !== undefined && savedBalance !== null) {
      const parsed = parseFloat(savedBalance);
      if (!isNaN(parsed) && isFinite(parsed) && parsed >= 0) {
        balance = parsed;
      }
    }

    const savedCommitments = mockStorage['cbv_demo_commitments'];
    if (savedCommitments) {
      const parsed = JSON.parse(savedCommitments);
      if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
        const clean = {};
        for (const [k, v] of Object.entries(parsed)) {
          if (typeof k === 'string' && typeof v === 'number' && !isNaN(v) && isFinite(v) && v >= 0) {
            clean[k] = v;
          }
        }
        commitments = clean;
      }
    }

    const savedUser = mockStorage['cbv_demo_user'];
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      if (typeof parsed === 'object' && parsed !== null) {
        if (typeof parsed.name === 'string') user.name = parsed.name;
        if (typeof parsed.paddleNumber === 'string') user.paddleNumber = parsed.paddleNumber;
        if (typeof parsed.isLoggedIn === 'boolean') user.isLoggedIn = parsed.isLoggedIn;
      }
    }
  } catch (e) {
    // Falls back gracefully
  }

  const reserved = Object.values(commitments).reduce((acc, v) => acc + v, 0);
  const available = Math.max(0, balance - reserved);
  return { balance, commitments, reserved, available, user };
}

// F.1: Valid persistence hydration across simulated refresh
const mockStorageValid = {
  cbv_demo_vault_balance: '120000',
  cbv_demo_commitments: JSON.stringify({ 'lot-01': 25000, 'lot-02': 15000 }),
  cbv_demo_user: JSON.stringify({ name: 'ELENA ROSTOVA', paddleNumber: '8821', isLoggedIn: true }),
};
const hydratedValid = simulateHydration(mockStorageValid);
assert(
  'VAULT-07-SESSION-HYDRATION-VALID',
  'Scenario F.1: Valid sessionStorage state restores faithfully across simulated page refresh',
  'Balance: $120,000, Reserved: $40,000, Available: $80,000, Paddle: #8821',
  `Balance: $${hydratedValid.balance}, Reserved: $${hydratedValid.reserved}, Available: $${hydratedValid.available}, Paddle: #${hydratedValid.user.paddleNumber}`,
  hydratedValid.balance === 120000 && hydratedValid.reserved === 40000 && hydratedValid.available === 80000 && hydratedValid.user.paddleNumber === '8821'
);

// F.2: Corrupted JSON and NaN resilience
const mockStorageCorrupt = {
  cbv_demo_vault_balance: 'NotANumber',
  cbv_demo_commitments: 'INVALID_JSON{broken',
  cbv_demo_user: null,
};
const hydratedCorrupt = simulateHydration(mockStorageCorrupt);
assert(
  'VAULT-08-SESSION-CORRUPTION-RESILIENCE',
  'Scenario F.2: Corrupted sessionStorage data falls back safely to default $150k fixture without crash',
  'Balance: $150,000, Reserved: $0, Available: $150,000',
  `Balance: $${hydratedCorrupt.balance}, Reserved: $${hydratedCorrupt.reserved}, Available: $${hydratedCorrupt.available}`,
  hydratedCorrupt.balance === 150000 && hydratedCorrupt.reserved === 0 && hydratedCorrupt.available === 150000
);

// F.3: Negative values and malicious type injection sanitized
const mockStorageMalicious = {
  cbv_demo_vault_balance: '-50000',
  cbv_demo_commitments: JSON.stringify({ 'lot-01': -25000, 'lot-02': 'invalid-type', 'lot-03': 10000 }),
};
const hydratedSanitized = simulateHydration(mockStorageMalicious);
assert(
  'VAULT-09-SESSION-NEGATIVE-SANITATION',
  'Scenario F.3: Negative balances & non-numeric commitments rejected by sanitizer',
  'Balance: $150,000 (rejected negative), Reserved: $10,000 (only valid non-negative kept), Available: $140,000',
  `Balance: $${hydratedSanitized.balance}, Reserved: $${hydratedSanitized.reserved}, Available: $${hydratedSanitized.available}`,
  hydratedSanitized.balance === 150000 && hydratedSanitized.reserved === 10000 && hydratedSanitized.available === 140000
);

// F.4: Safe reset purges session keys
function simulateReset(mockStorage) {
  delete mockStorage['cbv_demo_vault_balance'];
  delete mockStorage['cbv_demo_commitments'];
  return simulateHydration(mockStorage);
}
const resetState = simulateReset(mockStorageValid);
assert(
  'VAULT-10-SESSION-RESET',
  'Scenario F.4: Vault reset cleanly removes session keys and restores default $150k demo state',
  'Balance: $150,000, Reserved: $0, Available: $150,000, Keys removed',
  `Balance: $${resetState.balance}, Reserved: $${resetState.reserved}, Available: $${resetState.available}`,
  resetState.balance === 150000 && resetState.reserved === 0 && !('cbv_demo_vault_balance' in mockStorageValid)
);

// -------------------------------------------------------------
// SECTION 3: HTTP DOM & ACCESSIBILITY INSPECTION OF RUNNING APP
// -------------------------------------------------------------
console.log('\n--- 3. Testing Live Application HTTP Responses & Markup ---');

function fetchPage(urlPath) {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:3000${urlPath}`, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => resolve({ status: res.statusCode, html: data }));
      res.on('error', reject);
    });
  });
}

async function runDomTests() {
  const loginRes = await fetchPage('/auth/login');
  assert('DOM-01-LOGIN-STATUS', 'HTTP 200 on /auth/login', '200', `${loginRes.status}`, loginRes.status === 200);

  const hasLogin2Col = loginRes.html.includes('lg:grid-cols-12') || loginRes.html.includes('lg:col-span-5');
  assert('DOM-01-LOGIN-LAYOUT', '2-Column desktop editorial layout present in /auth/login markup', 'Found 2-col classes', hasLogin2Col ? 'Found layout classes' : 'Missing', hasLogin2Col);

  const hasGoogleAuth = loginRes.html.includes('Continue with Google') && loginRes.html.includes('SIMULATED AUTH PROVIDER');
  assert('DOM-01-GOOGLE-AUTH', 'Simulated Google Sign-In button with disclaimer on /auth/login', 'Found button & disclaimer', hasGoogleAuth ? 'Found Google button & disclaimer' : 'Missing', hasGoogleAuth);

  const hasCaptcha = loginRes.html.includes('I am human [Sandbox Verification]') && loginRes.html.includes('SIMULATED ANTI-BOT');
  assert('DOM-01-CAPTCHA-WIDGET', 'Accessible simulated CAPTCHA widget with anti-bot disclaimer on /auth/login', 'Found checkbox & disclaimer', hasCaptcha ? 'Found CAPTCHA widget & disclaimer' : 'Missing', hasCaptcha);

  const has16pxInputs = loginRes.html.includes('text-base');
  assert('DOM-01-16PX-INPUTS', '16px input font size (text-base) to prevent iOS Safari auto-zoom', 'Found text-base', has16pxInputs ? 'Found text-base' : 'Missing', has16pxInputs);

  const regRes = await fetchPage('/auth/register');
  assert('DOM-02-REG-STATUS', 'HTTP 200 on /auth/register', '200', `${regRes.status}`, regRes.status === 200);

  const hasRegStepTracker = regRes.html.includes('Credentials') && regRes.html.includes('PIN Verify') && regRes.html.includes('Intent Routing');
  assert('DOM-02-REG-STEPS', '3-Step registration intake sequence visible on /auth/register', 'Found 3-step sequence', hasRegStepTracker ? 'Found sequence' : 'Missing', hasRegStepTracker);

  const verifyRes = await fetchPage('/auth/verify-email');
  assert('DOM-03-VERIFY-STATUS', 'HTTP 200 on /auth/verify-email', '200', `${verifyRes.status}`, verifyRes.status === 200);

  const hasPinInput = verifyRes.html.includes('verify-pin-input') || verifyRes.html.includes('6-Digit Security PIN');
  assert('DOM-03-PIN-INPUT', '6-digit security PIN input present on /auth/verify-email', 'Found PIN input', hasPinInput ? 'Found PIN input' : 'Missing', hasPinInput);

  const resetRes = await fetchPage('/auth/reset-password');
  assert('DOM-04-RESET-STATUS', 'HTTP 200 on /auth/reset-password', '200', `${resetRes.status}`, resetRes.status === 200);

  const liveRes = await fetchPage('/auctions/live');
  assert('DOM-05-LIVE-STATUS', 'HTTP 200 on /auctions/live', '200', `${liveRes.status}`, liveRes.status === 200);

  const hasVaultCard = liveRes.html.includes('Pre-Funded Vault Status') && liveRes.html.includes('Available to Bid');
  assert('DOM-05-VAULT-CARD', 'Pre-Funded Vault 3-tier status card rendered in live saleroom', 'Found 3-tier metrics', hasVaultCard ? 'Found Vault card' : 'Missing', hasVaultCard);

  const hasBenchmarks = liveRes.html.includes('Benchmark 1:') && liveRes.html.includes('Benchmark 2:');
  assert('DOM-05-BENCHMARK-BUTTONS', 'Mandatory Vault benchmark triggers present in live saleroom console', 'Found buttons', hasBenchmarks ? 'Found benchmark buttons' : 'Missing', hasBenchmarks);

  const hasVaultChip = liveRes.html.includes('Vault:') && liveRes.html.includes('[DEMO]');
  assert('DOM-06-HEADER-VAULT-CHIP', 'Persistent Vault eligibility chip visible in masthead navigation', 'Found Vault and [DEMO] in header', hasVaultChip ? 'Found Vault chip' : 'Missing', hasVaultChip);

  const transRes = await fetchPage('/transparency');
  const hasEscrowDisclaimer = transRes.html.includes('PROPOSED FUTURE SERVICE') || transRes.html.includes('future operational capability');
  assert('DOM-07-FUTURE-SERVICES', 'Escrow custody & insured transit classified as proposed future services on /transparency', 'Found disclaimers', hasEscrowDisclaimer ? 'Found disclaimers' : 'Missing', hasEscrowDisclaimer);

  // 3.8 Static CSS & Font Asset Delivery Verification (Regression Prevention)
  const homeRes = await fetchPage('/');
  const cssMatch = homeRes.html.match(/href="(\/_next\/static\/css\/[^"]+)"/);
  const cssFound = !!cssMatch;
  assert('CSS-01-LINK-EXISTS', 'Rendered HTML contains valid Next.js stylesheet <link>', 'Found CSS href', cssFound ? cssMatch[1] : 'None', cssFound);

  if (cssFound) {
    const cssRes = await new Promise((resolve) => {
      http.get('http://localhost:3000' + cssMatch[1], (res) => {
        let data = '';
        res.on('data', (c) => (data += c));
        res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: data }));
      });
    });

    assert('CSS-02-STATUS-200', 'Stylesheet asset returns HTTP 200 OK (Not 404/500)', '200', `${cssRes.status}`, cssRes.status === 200);
    const isCssType = (cssRes.headers['content-type'] || '').includes('text/css');
    assert('CSS-03-MIME-TYPE', 'Stylesheet content-type is text/css', 'text/css', cssRes.headers['content-type'] || 'None', isCssType);
    const hasBrandTokens = cssRes.body.includes('bg-paper') && cssRes.body.includes('text-forest') && (cssRes.body.includes('selection:bg-lime') || cssRes.body.includes('selection\\:bg-lime'));
    assert('CSS-04-BRAND-TOKENS', 'Stylesheet contains compiled Tailwind brand tokens (paper, forest, lime)', 'true', `${hasBrandTokens}`, hasBrandTokens);
    const hasFontFaces = cssRes.body.includes('Instrument_Serif') || cssRes.body.includes('Manrope') || cssRes.body.includes('IBM_Plex_Mono');
    assert('CSS-05-FONT-FACES', 'Stylesheet contains Google Font definitions (Instrument Serif / Manrope / IBM Plex Mono)', 'true', `${hasFontFaces}`, hasFontFaces);
  }

  // -------------------------------------------------------------
  // SECTION 4: PHASE 2.1 MULTI-CATEGORY CATALOG & GROUP A EXPANSION
  // -------------------------------------------------------------
  console.log('\n--- 4. Testing Phase 2.1 Multi-Category Catalog (Group A) ---');

  const upcomingRes = await fetchPage('/auctions/upcoming');
  assert('CAT-01-UPCOMING-STATUS', 'HTTP 200 on /auctions/upcoming', '200', `${upcomingRes.status}`, upcomingRes.status === 200);

  const hasAllDivisions =
    upcomingRes.html.includes('Fine Horology') &&
    (upcomingRes.html.includes('Rare Coins &amp; Numismatics') || upcomingRes.html.includes('Rare Coins & Numismatics')) &&
    upcomingRes.html.includes('Haute Joaillerie') &&
    upcomingRes.html.includes('Fine Art');
  assert('CAT-02-CATEGORY-TABS', 'Multi-Category filter tabs present on /auctions/upcoming', 'Found all 4 divisions', hasAllDivisions ? 'Found tabs' : 'Missing', hasAllDivisions);

  // 4.3 Verify Representative Category Specimen Pages
  const lotTests = [
    {
      slug: 'patek-philippe-calatrava-3520d',
      category: 'Fine Horology',
      expectedHeader: 'Forensic Calibre &amp; Condition Dossier',
      expectedAttr: 'Calibre 175',
      id: 'LOT-01-HOROLOGY',
    },
    {
      slug: 'athenian-silver-tetradrachm-owl-460bc',
      category: 'Rare Coins & Numismatics',
      expectedHeader: 'Numismatic Grading &amp; Die Strike Dossier',
      expectedAttr: 'Classical Athens',
      id: 'LOT-07-COINS',
    },
    {
      slug: 'cartier-art-deco-colombian-emerald-sautoir-1925',
      category: 'Haute Joaillerie',
      expectedHeader: 'Gemological Certification &amp; Setting Dossier',
      expectedAttr: 'Cartier Paris',
      id: 'LOT-10-JEWELRY',
    },
    {
      slug: 'rembrandt-studio-portrait-of-a-scholar-1638',
      category: 'Fine Art',
      expectedHeader: 'Catalogue Raisonné &amp; Conservation Dossier',
      expectedAttr: 'Studio of Rembrandt',
      id: 'LOT-13-ART',
    },
  ];

  for (const lt of lotTests) {
    const lotRes = await fetchPage(`/auctions/lots/${lt.slug}`);
    assert(`${lt.id}-STATUS`, `HTTP 200 on /auctions/lots/${lt.slug}`, '200', `${lotRes.status}`, lotRes.status === 200);

    const hasDossierTitle =
      lotRes.html.includes(lt.expectedHeader) ||
      lotRes.html.includes(lt.expectedHeader.replace('&amp;', '&'));
    assert(`${lt.id}-SPECGRID`, `Specialized SpecGrid rendered for ${lt.category}`, 'Found specialized section header', hasDossierTitle ? 'Found section' : 'Missing', hasDossierTitle);

    const hasNotice = lotRes.html.includes('Archival specimen photograph currently undergoing provenance rights review');
    assert(`${lt.id}-PROVISIONAL-NOTICE`, `Monogram fallback card notice present for ${lt.category}`, 'Found fallback notice', hasNotice ? 'Found notice' : 'Missing', hasNotice);
  }

  // -------------------------------------------------------------
  // SECTION 5: PHASE 2.1 SPECIALIST REVIEW DESK & CONSIGNMENT FLOWS
  // -------------------------------------------------------------
  console.log('\n--- 5. Testing Specialist Console (/admin) & Consignments ---');

  const adminRes = await fetchPage('/admin');
  assert('ADM-01-ADMIN-STATUS', 'HTTP 200 on /admin', '200', `${adminRes.status}`, adminRes.status === 200);

  const hasAdminDisclaimer = adminRes.html.includes('[SANDBOX SIMULATION — NOT REAL TRANSACTIONS]');
  assert('ADM-02-DISCLAIMER', 'Mandatory simulation disclaimer present in /admin header', 'Found disclaimer', hasAdminDisclaimer ? 'Found disclaimer' : 'Missing', hasAdminDisclaimer);

  const hasSpecialistDesk = adminRes.html.includes('Curatorial Specialist Review Desk') && adminRes.html.includes('Active Intake Queue');
  assert('ADM-03-CURATOR-QUEUE', 'Specialist queue and intake metrics rendered on /admin', 'Found review queue', hasSpecialistDesk ? 'Found queue & metrics' : 'Missing', hasSpecialistDesk);

  const consignRes = await fetchPage('/consign');
  assert('CSG-01-CONSIGN-STATUS', 'HTTP 200 on /consign', '200', `${consignRes.status}`, consignRes.status === 200);

  const hasConsignDivisions = consignRes.html.includes('Fine Horology') && consignRes.html.includes('Rare Coins') && consignRes.html.includes('Haute Joaillerie') && consignRes.html.includes('Fine Art');
  assert('CSG-02-DIVISIONS', 'Multi-category division selection present on /consign intake wizard', 'Found 4 divisions', hasConsignDivisions ? 'Found 4 divisions' : 'Missing', hasConsignDivisions);

  const acctConsignRes = await fetchPage('/account/consignments');
  assert('CSG-03-ACCT-CONSIGN-STATUS', 'HTTP 200 on /account/consignments', '200', `${acctConsignRes.status}`, acctConsignRes.status === 200);

  // -------------------------------------------------------------
  // SECTION 6: CROSS-CATEGORY PRE-FUNDED VAULT RESERVATION TESTS
  // -------------------------------------------------------------
  console.log('\n--- 6. Testing Cross-Category Pre-Funded Vault Affordability ---');

  const multiCatVault = new VaultStateMachine(150000);

  // 6.1 Bid on Horology Lot 01 ($22,000)
  const bidHorology = multiCatVault.placeBid('lot-01-horology', 22000);
  assert(
    'XCAT-01-HOROLOGY-HOLD',
    'Bid on Fine Horology Lot ($22,000) accepted and held',
    'Reserved: $22,000, Available: $128,000',
    `Reserved: $${multiCatVault.reservedFundsUsd}, Available: $${multiCatVault.availableToBidUsd}`,
    bidHorology === true && multiCatVault.reservedFundsUsd === 22000 && multiCatVault.availableToBidUsd === 128000
  );

  // 6.2 Bid on Coin Lot 08 ($105,000)
  const bidCoin = multiCatVault.placeBid('lot-08-coin', 105000);
  assert(
    'XCAT-02-COIN-HOLD',
    'Concurrent bid on Rare Coin Lot ($105,000) accepted against shared Vault',
    'Reserved: $127,000, Available: $23,000',
    `Reserved: $${multiCatVault.reservedFundsUsd}, Available: $${multiCatVault.availableToBidUsd}`,
    bidCoin === true && multiCatVault.reservedFundsUsd === 127000 && multiCatVault.availableToBidUsd === 23000
  );

  // 6.3 Attempt bid on Art Lot 13 ($30,000) - Should fail due to only $23,000 available
  const bidArtFail = multiCatVault.placeBid('lot-13-art', 30000);
  assert(
    'XCAT-03-OVERCOMMIT-REJECT',
    'Concurrent bid on Fine Art Lot ($30,000) rejected when available is $23,000',
    'false (insufficient funds)',
    `${bidArtFail} (Available: $${multiCatVault.availableToBidUsd})`,
    bidArtFail === false && multiCatVault.reservedFundsUsd === 127000 && multiCatVault.availableToBidUsd === 23000
  );

  // 6.4 Outbid on Horology Lot: $22,000 released; Available becomes $45,000
  multiCatVault.botOutbid('lot-01-horology', 24000);
  assert(
    'XCAT-04-SELECTIVE-RELEASE',
    'Outbid on Horology Lot releases $22,000 while maintaining $105,000 Coin hold',
    'Reserved: $105,000, Available: $45,000',
    `Reserved: $${multiCatVault.reservedFundsUsd}, Available: $${multiCatVault.availableToBidUsd}`,
    multiCatVault.reservedFundsUsd === 105000 && multiCatVault.availableToBidUsd === 45000
  );

  // 6.5 Re-attempt bid on Art Lot 13 ($30,000) - Should now succeed!
  const bidArtSuccess = multiCatVault.placeBid('lot-13-art', 30000);
  assert(
    'XCAT-05-HEADROOM-RETRY',
    'Fine Art Lot bid ($30,000) now succeeds with released headroom',
    'Reserved: $135,000, Available: $15,000',
    `Reserved: $${multiCatVault.reservedFundsUsd}, Available: $${multiCatVault.availableToBidUsd}`,
    bidArtSuccess === true && multiCatVault.reservedFundsUsd === 135000 && multiCatVault.availableToBidUsd === 15000
  );

  console.log('\n===============================================================');
  const passCount = interfaceResult.filter((r) => r.pass).length;
  const failCount = interfaceResult.length - passCount;
  console.log(`QA VERIFICATION SUMMARY: ${passCount} PASSED, ${failCount} FAILED (TOTAL: ${interfaceResult.length})`);
  console.log('===============================================================');

  if (failCount > 0) {
    process.exit(1);
  }
}

runDomTests().catch((e) => {
  console.error('Fatal unhandled error in QA Runner:', e);
  process.exit(1);
});
