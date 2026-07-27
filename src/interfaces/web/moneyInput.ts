/**
 * The single display → cents conversion for the UI: what the user types in
 * an amount field becomes integer cents here, before it reaches the API.
 * Parsing works on the string (never `value * 100`) so decimal inputs like
 * "0.29" can't drift through binary floating point.
 *
 * Returns null for anything that isn't a plain positive decimal with at
 * most two fraction digits.
 */
export function parseAmountToCents(input: string): number | null {
  const match = /^(\d+)(?:\.(\d{1,2}))?$/.exec(input.trim());
  if (!match) {
    return null;
  }
  const [, whole, fraction = ''] = match;
  const cents = Number(whole) * 100 + Number(fraction.padEnd(2, '0') || '0');
  if (!Number.isSafeInteger(cents) || cents === 0) {
    return null;
  }
  return cents;
}

/**
 * The inverse, for pre-filling an amount input when editing: integer cents
 * to a plain "12.34" string (no currency symbol or grouping — that's what
 * <input type="number"> accepts; formatted display goes through formatMoney).
 */
export function centsToAmountInput(cents: number): string {
  return (cents / 100).toFixed(2);
}
