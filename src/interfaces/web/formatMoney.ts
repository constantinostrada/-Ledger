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
