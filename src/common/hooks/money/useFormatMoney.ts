/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { Number as NumberHelper } from '$app/common/helpers/number';
import { useCurrentCompany } from '../useCurrentCompany';
import { useResolveCountry } from '../useResolveCountry';
import { useResolveCurrency } from '../useResolveCurrency';

export function useFormatMoney() {
  const resolveCountry = useResolveCountry();
  const resolveCurrency = useResolveCurrency();
  const company = useCurrentCompany();

  return (
    value: string | number,
    countryId: string | undefined,
    currencyId: string | undefined,
    fractionDigits?: number,
    showCurrencyCode?: boolean
  ) => {
    const currentCountryId = countryId || company?.settings.country_id;
    const currentCurrencyId =
      currencyId && currencyId !== '999'
        ? currencyId
        : company?.settings.currency_id;

    const country = resolveCountry(currentCountryId);
    const currency = resolveCurrency(currentCurrencyId);

    if (country && currency) {
      return NumberHelper.formatMoney(
        isNaN(Number(value)) ? 0 : value,
        currency,
        country,
        {
          showCurrencyCode:
            showCurrencyCode ?? company.settings.show_currency_code,
        }
      );
    }

    if (fractionDigits) {
      return Number(value).toFixed(fractionDigits);
    }

    return value;
  };
}
