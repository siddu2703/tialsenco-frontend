/**
 * Tilsenco (https://tilsenco.com).
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { Country } from '$app/common/interfaces/country';
import { Currency } from '$app/common/interfaces/currency';
import { numberFormat } from './number-format';

interface FormatMoneyOptions {
  showCurrencyCode?: boolean;
}
export class Number {
  public static formatValue(value: string | number, currency: Currency) {
    const thousand = currency.thousand_separator;
    const decimal = currency.decimal_separator;
    const precision = currency.precision;

    return numberFormat(value, precision, decimal, thousand);
  }

  public static formatMoney(
    value: string | number,
    currency: Currency,
    country: Country,
    options?: FormatMoneyOptions
  ): string {
    let thousand = currency.thousand_separator;
    let decimal = currency.decimal_separator;
    let swapSymbol = currency.swap_currency_symbol;
    const precision = currency.precision;
    const code = currency.code;

    if (country.thousand_separator?.length >= 1) {
      thousand = country.thousand_separator;
    }

    if (country.decimal_separator?.length >= 1) {
      decimal = country.decimal_separator;
    }

    if (country.swap_currency_symbol) {
      swapSymbol = country.swap_currency_symbol;
    }

    const formatted = numberFormat(value, precision, decimal, thousand);
    const symbol = currency.symbol;

    if (options?.showCurrencyCode && currency.code === 'CHF') {
      return `${code} ${formatted}`;
    } else if (options?.showCurrencyCode) {
      return `${formatted} ${code}`;
    } else if (swapSymbol) {
      return `${formatted} ${symbol.trim()}`;
    } else if (!options?.showCurrencyCode) {
      return `${symbol} ${formatted}`;
    }

    return this.formatValue(formatted, currency);
  }
}
