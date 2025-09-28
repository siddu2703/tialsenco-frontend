/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { Company } from '$app/common/interfaces/company.interface';
import { injectInChanges } from '$app/common/stores/slices/company-users';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useCompanyChanges } from './useCompanyChanges';
import { useCurrentCompany } from './useCurrentCompany';
import { useCurrentSettingsLevel } from './useCurrentSettingsLevel';

interface Options {
  overwrite?: boolean;
}

export function useInjectCompanyChanges(
  options?: Options
): Company | undefined {
  const company = useCurrentCompany();
  const companyChanges = useCompanyChanges();
  const dispatch = useDispatch();
  const { isCompanySettingsActive } = useCurrentSettingsLevel();

  useEffect(() => {
    if (companyChanges && options?.overwrite === false) {
      // We don't want to overwrite existing changes,
      // so let's just not inject anything if we already have a value,
      // and relative argument.

      return;
    }

    if (isCompanySettingsActive) {
      dispatch(injectInChanges({ object: 'company', data: company }));
    }
  }, [company]);

  return companyChanges;
}
