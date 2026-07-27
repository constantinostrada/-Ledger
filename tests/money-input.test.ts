import { describe, it, expect } from 'vitest';
import {
  centsToAmountInput,
  parseAmountToCents,
} from '@interfaces/web/moneyInput';

describe('parseAmountToCents', () => {
  it('converts a whole amount', () => {
    expect(parseAmountToCents('12')).toBe(1200);
  });

  it('converts a two-decimal amount', () => {
    expect(parseAmountToCents('12.34')).toBe(1234);
  });

  it('converts a one-decimal amount', () => {
    expect(parseAmountToCents('12.3')).toBe(1230);
  });

  it('avoids binary floating-point drift', () => {
    // 0.29 * 100 === 28.999999999999996; string parsing must not care.
    expect(parseAmountToCents('0.29')).toBe(29);
    expect(parseAmountToCents('4.56')).toBe(456);
  });

  it('trims surrounding whitespace', () => {
    expect(parseAmountToCents(' 7.50 ')).toBe(750);
  });

  it('rejects zero, since transactions must be positive', () => {
    expect(parseAmountToCents('0')).toBeNull();
    expect(parseAmountToCents('0.00')).toBeNull();
  });

  it('rejects more than two decimals', () => {
    expect(parseAmountToCents('1.234')).toBeNull();
  });

  it('rejects negatives, signs, and non-numeric input', () => {
    expect(parseAmountToCents('-5')).toBeNull();
    expect(parseAmountToCents('+5')).toBeNull();
    expect(parseAmountToCents('abc')).toBeNull();
    expect(parseAmountToCents('1,000.00')).toBeNull();
    expect(parseAmountToCents('')).toBeNull();
    expect(parseAmountToCents('.')).toBeNull();
    expect(parseAmountToCents('5.')).toBeNull();
  });
});

describe('centsToAmountInput', () => {
  it('renders integer cents as a plain decimal string', () => {
    expect(centsToAmountInput(1234)).toBe('12.34');
  });

  it('always keeps two decimals', () => {
    expect(centsToAmountInput(1200)).toBe('12.00');
    expect(centsToAmountInput(5)).toBe('0.05');
  });

  it('round-trips with parseAmountToCents', () => {
    for (const cents of [1, 29, 456, 999999]) {
      expect(parseAmountToCents(centsToAmountInput(cents))).toBe(cents);
    }
  });
});
