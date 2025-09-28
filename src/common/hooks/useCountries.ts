/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { Country } from '$app/common/interfaces/country';
import { useStaticsQuery } from '$app/common/queries/statics';
import { useEffect, useState } from 'react';

export function useCountries(): Country[] {
  const { data: statics } = useStaticsQuery();
  const [countries, setCountries] = useState<Country[]>([]);

  useEffect(() => {
    if (statics?.countries) {
      setCountries(statics.countries);
    }
  }, [statics]);

  return countries;
}
