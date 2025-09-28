/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { CompanyUser } from '$app/common/interfaces/company-user';
import { RootState } from '$app/common/stores/store';
import { useSelector } from 'react-redux';

export function useCurrentCompanyUser(): CompanyUser | undefined {
  return useSelector(
    (state: RootState) =>
      state.companyUsers.api[state.companyUsers.currentIndex]
  );
}
