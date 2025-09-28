/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { useCountries } from './useCountries';

export function useResolveCountry() {
  const countries = useCountries();

  return (id: number | string) => {
    return countries.find((country) => country.id == id);
  };
}
