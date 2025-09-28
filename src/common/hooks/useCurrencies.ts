/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { Currency } from '$app/common/interfaces/currency';
import { useStaticsQuery } from '$app/common/queries/statics';
import { useEffect, useState } from 'react';

export function useCurrencies(): Currency[] {
  const { data: statics } = useStaticsQuery();
  const [currencies, setCurrencies] = useState<Currency[]>([]);

  useEffect(() => {
    if (statics?.currencies) {
      setCurrencies(statics.currencies);
    }
  }, [statics]);

  return currencies;
}
