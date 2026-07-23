import { IExchangeRateProvider } from '@application/ports/IExchangeRateProvider';

/**
 * Static rate table (USD per one unit of each currency); cross rates are
 * derived through the USD pivot. A live-rate API client would implement the
 * same port without touching any use case.
 */
const USD_PER_UNIT: Record<string, number> = {
  USD: 1,
  EUR: 1.08,
  GBP: 1.27,
  CHF: 1.1,
  CAD: 0.73,
  AUD: 0.66,
  JPY: 0.0067,
  BRL: 0.18,
  MXN: 0.054,
  ARS: 0.00085,
};

export class FixedExchangeRateProvider implements IExchangeRateProvider {
  async getRate(fromCurrency: string, toCurrency: string): Promise<number> {
    const from = fromCurrency.toUpperCase();
    const to = toCurrency.toUpperCase();
    if (from === to) {
      return 1;
    }

    const fromUsd = USD_PER_UNIT[from];
    const toUsd = USD_PER_UNIT[to];
    if (!fromUsd) {
      throw new Error(`No exchange rate available for ${from}`);
    }
    if (!toUsd) {
      throw new Error(`No exchange rate available for ${to}`);
    }

    return fromUsd / toUsd;
  }
}
