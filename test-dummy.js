const {
  CURRENCY_CONFIGS,
  convertCurrency,
  formatCurrency,
  formatDualCurrency,
  getExchangeRateLabel,
} = require('./lib/currency.ts'); // Wait, Node cannot require .ts directly without ts-node or transpiling.
