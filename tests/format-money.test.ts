import { describe, it, expect } from 'vitest';
import { formatMoney } from '@interfaces/web/formatMoney';

describe('formatMoney', () => {
  it('renders integer cents as a currency string', () => {
    expect(formatMoney(123456, 'USD')).toBe('$1,234.56');
  });

  it('renders zero', () => {
    expect(formatMoney(0, 'USD')).toBe('$0.00');
  });

  it('renders negative balances', () => {
    expect(formatMoney(-9950, 'USD')).toBe('-$99.50');
  });

  it('respects the currency argument', () => {
    expect(formatMoney(500000, 'EUR')).toBe('€5,000.00');
  });

  it('keeps sub-dollar amounts as cents', () => {
    expect(formatMoney(7, 'USD')).toBe('$0.07');
  });
});
