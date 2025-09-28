/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { useAtomValue } from 'jotai';
import { useUserChanges } from './useInjectUserChanges';
import { TableFiltersPreference } from './useReactSettings';
import { dataTableFiltersAtom } from './useStoreSessionTableFilters';

interface Params {
  tableKey: string | undefined;
}
export function useDataTablePreference(params: Params) {
  const user = useUserChanges();

  const { tableKey } = params;

  const storeSessionTableFilters = useAtomValue(dataTableFiltersAtom);

  return (filterKey: keyof TableFiltersPreference) => {
    if (!tableKey) {
      return '';
    }

    if (filterKey === 'filter' || filterKey === 'currentPage') {
      return storeSessionTableFilters?.[tableKey]?.[filterKey]
        ? storeSessionTableFilters[tableKey][filterKey]
        : '';
    }

    const tableFilters = user?.company_user?.react_settings.table_filters;

    return tableFilters?.[tableKey]?.[filterKey]
      ? tableFilters[tableKey][filterKey]
      : '';
  };
}
