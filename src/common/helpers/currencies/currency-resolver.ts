/**
 * Tilsenco (https://tilsenco.com).
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { useStaticsQuery } from '$app/common/queries/statics';

export function useCurrencyResolver() {
  const statics = useStaticsQuery();

  const find = (id: string) => {
    if (statics) {
      return Promise.resolve(
        statics.data?.currencies.find((currency) => currency.id === id)
      );
    }

    return Promise.resolve(undefined);
  };

  return { find };
}

export function useResolveCurrency() {
  const statics = useStaticsQuery();

  return (id: string) => {
    if (statics) {
      return statics.data?.currencies.find((currency) => currency.id === id);
    }

    return undefined;
  };
}
