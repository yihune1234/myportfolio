/**
 * Currency formatting helpers — ETB and others.
 * Always use these utilities instead of raw number.toFixed(2) in JSX.
 */

/**
 * Format a number as currency
 * @param {number} amount - The amount to format
 * @param {string} currency - Currency code (default: 'ETB')
 * @returns {string} Formatted currency string
 */
export function formatCurrency(amount, currency = 'ETB') {
  if (amount === null || amount === undefined || isNaN(amount)) return `${currency} 0.00`;
  return `${currency} ${Number(amount).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/**
 * Parse a currency string back to a number
 * @param {string} currencyString - e.g., "ETB 1,500.00"
 * @returns {number} Parsed number
 */
export function parseCurrency(currencyString) {
  if (!currencyString) return 0;
  const cleaned = currencyString.replace(/[^0-9.-]/g, '');
  return parseFloat(cleaned) || 0;
}