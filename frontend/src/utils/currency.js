/**
 * currency.js
 * Currency & Salary utility functions calibrated to Indian Tech Market standards (LPA / Lakhs Per Annum).
 *
 * Calibration:
 * Baseline value (e.g. 101,750 for Entry-Level Data Scientist) maps directly to 10.18 LPA (~10 LPA).
 * Conversion factor: 1 raw unit = 0.0001 LPA (raw / 10,000 = LPA).
 * Annual equivalent in INR: raw * 10 = Annual INR (e.g. 101,750 -> ₹10,17,500/year).
 */

export function toLPA(val) {
  if (val === null || val === undefined || isNaN(val)) return 0;
  return Number(val) / 10000;
}

/**
 * Format salary in LPA (Lakhs Per Annum)
 * Examples:
 *   formatLPA(101750, { decimals: 1 }) => "₹10.2 LPA"
 *   formatLPA(101750, { decimals: 2 }) => "₹10.18 LPA"
 *   formatLPA(140340, { decimals: 1 }) => "₹14.0 LPA"
 *   formatLPA(217850, { decimals: 1 }) => "₹21.8 LPA"
 *
 * @param {number|string} val 
 * @param {object} [options] 
 * @param {number} [options.decimals=1] - Number of decimal places
 * @param {boolean} [options.showSymbol=true] - Whether to prepend ₹
 * @param {boolean} [options.showUnit=true] - Whether to append " LPA"
 * @returns {string}
 */
export function formatLPA(val, { decimals = 1, showSymbol = true, showUnit = true } = {}) {
  if (val === null || val === undefined || isNaN(val)) {
    const sym = showSymbol ? '₹' : '';
    const unit = showUnit ? ' LPA' : '';
    return `${sym}0${unit}`;
  }
  const lpa = toLPA(val);
  const formatted = lpa.toFixed(decimals);
  const sym = showSymbol ? '₹' : '';
  const unit = showUnit ? ' LPA' : '';
  return `${sym}${formatted}${unit}`;
}

/**
 * General salary formatter in Indian Rupees LPA
 * @param {number|string} val 
 * @param {object} [options] 
 * @returns {string}
 */
export function formatRupees(val, { decimals = 1 } = {}) {
  return formatLPA(val, { decimals, showSymbol: true, showUnit: true });
}

/**
 * Compact salary formatter for badges and tight spaces
 * @param {number|string} val 
 * @returns {string}
 */
export function formatRupeesCompact(val) {
  return formatLPA(val, { decimals: 1, showSymbol: true, showUnit: true });
}
