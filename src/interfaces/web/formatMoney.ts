/**
 * The single cents → display conversion for the UI: every money value
 * rendered anywhere must go through this helper. Amounts are integer
 * cents end to end (see Money); division by 100 happens only here.
 */
export function formatMoney(cents: number, currency: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(cents / 100);
}

/**
 * Whole-unit variant for chart axis ticks, which sit on round values
 * where fraction digits are noise ($2,000 rather than $2,000.00).
 */
export function formatMoneyWhole(cents: number, currency: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}
