/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { useResolveCurrency } from '$app/common/hooks/useResolveCurrency';

export function useResolveCurrencySeparator() {
  const resolveCurrency = useResolveCurrency();

  return (currencyId: string) => {
    const currency = resolveCurrency(currencyId);

    if (currency) {
      return {
        decimalSeparator: currency.decimal_separator,
        precision: currency.precision,
        thousandSeparator: currency.thousand_separator,
      };
    }

    return null;
  };
}
