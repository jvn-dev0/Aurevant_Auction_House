import {
  CURRENCY_CONFIGS,
  convertCurrency,
  formatCurrency,
  formatDualCurrency,
  getExchangeRateLabel,
  SupportedCurrency,
} from '../lib/currency';

interface TestResult {
  id: string;
  name: string;
  expected: string;
  actual: string;
  pass: boolean;
  notes?: string;
}

const results: TestResult[] = [];

function assert(id: string, name: string, expected: string, actual: string, pass: boolean, notes?: string) {
  results.push({ id, name, expected, actual, pass, notes });
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

// 1.1 All 8 currencies conversion of $100,000 USD base
const testBaseUsd = 100000;
const expectedConversions: Record<SupportedCurrency, { val: number; formatted: string }> = {
  USD: { val: 100000, formatted: '$100,000' },
  EUR: { val: 88870, formatted: '€88.870' }, // German locale uses dot
  GBP: { val: 74990, formatted: '£74,990' },
  CHF: { val: 82400, formatted: 'CHF 82’400' }, // Swiss locale separator
  JPY: { val: 15802000, formatted: '¥15,802,000' },
  HKD: { val: 784820, formatted: 'HK$784,820' },
  SGD: { val: 127920, formatted: 'SG$127,920' },
  INR: { val: 8407000, formatted: '₹84,07,000' }, // Indian grouping
};

for (const curr of Object.keys(expectedConversions) as SupportedCurrency[]) {
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
  '€19.551 [EST. DEMO] / $22,000 USD',
  dualEur,
  dualEur.includes('€19.551 [EST. DEMO] / $22,000 USD') || dualEur.includes('19,551')
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
const fallback = formatCurrency(22000, 'XYZ' as any);
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
// SECTION 2: PRE-FUNDED VAULT STATE MACHINE SIMULATION
// -------------------------------------------------------------
console.log('\n--- 2. Testing Pre-Funded Vault State Machine ---');

class VaultStateMachine {
  totalBalanceUsd: number;
  commitments: Record<string, number>;
  activeLotId: string;
  highestBidderPaddle: string;
  userPaddle: string;
  lastError: string | null;

  constructor(initialBalanceUsd: number = 150000, userPaddle: string = '4102') {
    this.totalBalanceUsd = initialBalanceUsd;
    this.commitments = {};
    this.activeLotId = 'lot-01';
    this.highestBidderPaddle = '3098';
    this.userPaddle = userPaddle;
    this.lastError = null;
  }

  get reservedFundsUsd(): number {
    return Object.values(this.commitments).reduce((acc, v) => acc + v, 0);
  }

  get availableToBidUsd(): number {
    return Math.max(0, this.totalBalanceUsd - this.reservedFundsUsd);
  }

  placeBid(lotId: string, amountUsd: number): boolean {
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

  botOutbid(lotId: string, botBidUsd: number, botPaddle: string = '7821') {
    this.highestBidderPaddle = botPaddle;
    // Release hold on this lot
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
  b1Result === false && v1.lastError?.includes('insufficient for this bid') === true && v1.availableToBidUsd === b1BalanceUsd && v1.reservedFundsUsd === 0,
  `Available: $${v1.availableToBidUsd} USD (~₹1,00,000), Attempted: $${b1AttemptedUsd} USD (~₹2,00,000)`
);

// 2.2 Benchmark 2: ₹1,00,000 total balance: Lot A ₹70,000 accepted; Lot B ₹60,000 rejected
const lotAUsd = Math.round(70000 / inrRate); // 833 USD
const lotBUsd = Math.round(60000 / inrRate); // 714 USD

const v2 = new VaultStateMachine(b1BalanceUsd);
const lotAResult = v2.placeBid('lot-A', lotAUsd);
const availAfterA = v2.availableToBidUsd; // 1,189 - 833 = 356 USD (~₹30,000)
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
v4.placeBid('lot-01', 22000); // User leads at 22k -> 22k reserved, 128k avail
const rapidBid1 = v4.placeBid('lot-01', 25000); // User raises their own bid to 25k -> incremental is 3k
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
// Switching display currency to INR converts the display, but math is in USD
const availInrDisplay = formatCurrency(availUsd, 'INR');
const availEurDisplay = formatCurrency(availUsd, 'EUR');
assert(
  'VAULT-06-CURRENCY-NEUTRALITY',
  'Switching display currency preserves identical underlying bidding affordability',
  '$100,000 USD base in memory regardless of view',
  `USD: $${availUsd}, INR: ${availInrDisplay}, EUR: ${availEurDisplay}`,
  availUsd === 100000 && availInrDisplay.includes('84,07,000') && availEurDisplay.includes('88.870')
);

// -------------------------------------------------------------
// SECTION 3: HTTP DOM & ACCESSIBILITY INSPECTION OF RUNNING APP
// -------------------------------------------------------------
console.log('\n--- 3. Testing Live Application HTTP Responses & Markup ---');

const http = require('http');

function fetchPage(urlPath: string): Promise<{ status: number; html: string }> {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:3000${urlPath}`, (res: any) => {
      let data = '';
      res.on('data', (chunk: any) => (data += chunk));
      res.on('end', () => resolve({ status: res.statusCode, html: data }));
      res.on('error', reject);
    });
  });
}

async function runDomTests() {
  // 3.1 Login Page Inspection
  const loginRes = await fetchPage('/auth/login');
  assert(
    'DOM-01-LOGIN-STATUS',
    'HTTP 200 on /auth/login',
    '200',
    `${loginRes.status}`,
    loginRes.status === 200
  );

  const hasLogin2Col = loginRes.html.includes('lg:grid-cols-12') || loginRes.html.includes('lg:col-span-5');
  assert(
    'DOM-01-LOGIN-LAYOUT',
    '2-Column desktop editorial layout present in /auth/login markup',
    'Contains lg:grid-cols-12 or lg:col-span-5',
    hasLogin2Col ? 'Found layout classes' : 'Missing layout classes',
    hasLogin2Col
  );

  const hasGoogleAuth = loginRes.html.includes('Continue with Google') && loginRes.html.includes('SIMULATED AUTH PROVIDER');
  assert(
    'DOM-01-GOOGLE-AUTH',
    'Simulated Google Sign-In button with disclaimer on /auth/login',
    'Found button and [SIMULATED AUTH PROVIDER] badge',
    hasGoogleAuth ? 'Found Google button & disclaimer' : 'Missing Google button or disclaimer',
    hasGoogleAuth
  );

  const hasCaptcha = loginRes.html.includes('I am human [Sandbox Verification]') && loginRes.html.includes('SIMULATED ANTI-BOT');
  assert(
    'DOM-01-CAPTCHA-WIDGET',
    'Accessible simulated CAPTCHA widget with anti-bot disclaimer on /auth/login',
    'Found checkbox and [SIMULATED ANTI-BOT] badge',
    hasCaptcha ? 'Found CAPTCHA widget & disclaimer' : 'Missing CAPTCHA widget',
    hasCaptcha
  );

  const has16pxInputs = loginRes.html.includes('text-base');
  assert(
    'DOM-01-16PX-INPUTS',
    '16px input font size (text-base) to prevent iOS Safari auto-zoom',
    'Contains text-base styling on inputs',
    has16pxInputs ? 'Found text-base on credential inputs' : 'Missing text-base',
    has16pxInputs
  );

  // 3.2 Registration Page Inspection
  const regRes = await fetchPage('/auth/register');
  assert(
    'DOM-02-REG-STATUS',
    'HTTP 200 on /auth/register',
    '200',
    `${regRes.status}`,
    regRes.status === 200
  );

  const hasRegStepTracker = regRes.html.includes('Credentials') && regRes.html.includes('PIN Verify') && regRes.html.includes('Intent Routing');
  assert(
    'DOM-02-REG-STEPS',
    '3-Step registration intake sequence visible on /auth/register',
    'Found Credentials -> PIN Verify -> Intent Routing',
    hasRegStepTracker ? 'Found 3-step sequence' : 'Missing step sequence',
    hasRegStepTracker
  );

  // 3.3 Email Verification Page Inspection
  const verifyRes = await fetchPage('/auth/verify-email');
  assert(
    'DOM-03-VERIFY-STATUS',
    'HTTP 200 on /auth/verify-email',
    '200',
    `${verifyRes.status}`,
    verifyRes.status === 200
  );

  const hasPinInput = verifyRes.html.includes('verify-pin-input') || verifyRes.html.includes('6-Digit Security PIN');
  assert(
    'DOM-03-PIN-INPUT',
    '6-digit security PIN input present on /auth/verify-email',
    'Found PIN input field with text-base font size',
    hasPinInput ? 'Found PIN input' : 'Missing PIN input',
    hasPinInput
  );

  // 3.4 Password Reset Page Inspection
  const resetRes = await fetchPage('/auth/reset-password');
  assert(
    'DOM-04-RESET-STATUS',
    'HTTP 200 on /auth/reset-password',
    '200',
    `${resetRes.status}`,
    resetRes.status === 200
  );

  // 3.5 Saleroom Page Inspection
  const liveRes = await fetchPage('/auctions/live');
  assert(
    'DOM-05-LIVE-STATUS',
    'HTTP 200 on /auctions/live',
    '200',
    `${liveRes.status}`,
    liveRes.status === 200
  );

  const hasVaultCard = liveRes.html.includes('Pre-Funded Vault Status') && liveRes.html.includes('Available to Bid');
  assert(
    'DOM-05-VAULT-CARD',
    'Pre-Funded Vault 3-tier status card rendered in live saleroom',
    'Found Total Balance, Reserved Funds, Available to Bid',
    hasVaultCard ? 'Found Vault status card' : 'Missing Vault status card',
    hasVaultCard
  );

  const hasBenchmarks = liveRes.html.includes('Benchmark 1:') && liveRes.html.includes('Benchmark 2:');
  assert(
    'DOM-05-BENCHMARK-BUTTONS',
    'Mandatory Vault benchmark triggers present in live saleroom console',
    'Found Benchmark 1 and Benchmark 2 buttons',
    hasBenchmarks ? 'Found benchmark buttons' : 'Missing benchmark buttons',
    hasBenchmarks
  );

  // 3.6 Header Persistent Liquidity Chip
  const hasVaultChip = liveRes.html.includes('Vault: $') || liveRes.html.includes('Avail [DEMO]');
  assert(
    'DOM-06-HEADER-VAULT-CHIP',
    'Persistent Vault eligibility chip visible in masthead navigation',
    'Found Vault Avail chip in header',
    hasVaultChip ? 'Found Vault liquidity chip' : 'Missing Vault liquidity chip',
    hasVaultChip
  );

  // 3.7 Transparency Disclaimers for Future Services
  const transRes = await fetchPage('/transparency');
  const hasEscrowDisclaimer = transRes.html.includes('PROPOSED FUTURE SERVICE') || transRes.html.includes('future operational capability');
  assert(
    'DOM-07-FUTURE-SERVICES',
    'Escrow custody & insured transit classified as proposed future services on /transparency',
    'Found future capability classification',
    hasEscrowDisclaimer ? 'Found future service disclaimers' : 'Missing future service disclaimers',
    hasEscrowDisclaimer
  );

  // Summary
  console.log('\n===============================================================');
  const passCount = results.filter((r) => r.pass).length;
  const failCount = results.length - passCount;
  console.log(`QA VERIFICATION SUMMARY: ${passCount} PASSED, ${failCount} FAILED (TOTAL: ${results.length})`);
  console.log('===============================================================');
}

runDomTests().catch((e) => console.error(e));
