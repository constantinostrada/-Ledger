export interface IExchangeRateProvider {
  /**
   * Units of `toCurrency` per one unit of `fromCurrency`.
   * Implementations must reject currencies they have no rate for.
   */
  getRate(fromCurrency: string, toCurrency: string): Promise<number>;
}
