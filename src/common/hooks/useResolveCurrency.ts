/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { useCurrencies } from './useCurrencies';

interface Params {
  resolveBy?: 'code';
}
export function useResolveCurrency(params?: Params) {
  const currencies = useCurrencies();

  const { resolveBy } = params || {};

  if (resolveBy === 'code') {
    return (code: string | number) => {
      return currencies.find((currency) => currency.code === code);
    };
  }

  return (id: string | number) =>
    currencies.find((currency) => currency.id == id);
}
