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

export function useCountryResolver() {
  const statics = useStaticsQuery();

  const find = (id: string) => {
    if (statics) {
      return Promise.resolve(
        statics.data?.countries.find((country) => country.id === id)
      );
    }

    return Promise.resolve(undefined);
  };

  return { find };
}
