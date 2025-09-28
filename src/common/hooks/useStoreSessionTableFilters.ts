/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { useSetAtom } from 'jotai';
import { atomWithStorage, createJSONStorage } from 'jotai/utils';
import { AsyncStorage } from 'jotai/vanilla/utils/atomWithStorage';

type SessionDataTableFilters = Record<string, Record<string, string | number>>;
const storage = createJSONStorage(() => sessionStorage);
export const dataTableFiltersAtom = atomWithStorage<SessionDataTableFilters>(
  'dataTableFilters',
  {},
  storage as AsyncStorage<SessionDataTableFilters>
);

interface Params {
  tableKey: string | undefined;
}
export function useStoreSessionTableFilters(params: Params) {
  const { tableKey } = params;

  const setDataTableFilters = useSetAtom(dataTableFiltersAtom);

  return (filter: string, currentPage: number) => {
    if (!tableKey) {
      return;
    }

    setDataTableFilters((current) => ({
      ...current,
      [tableKey]: {
        filter,
        currentPage,
      },
    }));
  };
}
