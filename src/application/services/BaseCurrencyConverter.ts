import { Money } from '@domain/value-objects/Money';
import { IExchangeRateProvider } from '../ports/IExchangeRateProvider';

/**
 * Converts amounts into a user's base currency, fetching the rate through
 * the exchange-rate port. Same-currency conversions never hit the provider.
 */
export class BaseCurrencyConverter {
  constructor(private readonly exchangeRateProvider: IExchangeRateProvider) {}

  async toBase(amount: Money, baseCurrency: string): Promise<Money> {
    if (amount.getCurrency() === baseCurrency) {
      return amount;
    }
    const rate = await this.exchangeRateProvider.getRate(
      amount.getCurrency(),
      baseCurrency
    );
    return amount.convertTo(baseCurrency, rate);
  }
}
