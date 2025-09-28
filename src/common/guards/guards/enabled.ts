/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { useCurrentCompany } from '$app/common/hooks/useCurrentCompany';
import { store } from '$app/common/stores/store';
import { ModuleBitmask } from '$app/pages/settings/account-management/component';
import { Guard } from '../Guard';

export function enabled(module: ModuleBitmask): Guard {
  return () => {
    const value = Boolean(
      store.getState().companyUsers.api?.[
        store.getState().companyUsers.currentIndex
      ]?.company?.enabled_modules & module
    );

    return new Promise((resolve) => resolve(value));
  };
}

export function useEnabled() {
  const company = useCurrentCompany();

  return (module: ModuleBitmask) => Boolean(company?.enabled_modules & module);
}
