/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import companySettings from '$app/common/constants/company-settings';
import { useCompanyChanges } from './useCompanyChanges';
import { useCurrentCompany } from './useCurrentCompany';
import { useTranslation } from 'react-i18next';

interface Params {
  fallbackSmallLogo?: boolean;
}

export function useLogo(props?: Params) {
  const { fallbackSmallLogo } = props || {};

  const companyChanges = useCompanyChanges();
  const currentCompany = useCurrentCompany();

  return (
    companyChanges?.settings?.company_logo ||
    currentCompany?.settings?.company_logo ||
    (fallbackSmallLogo ? companySettings.smallLogo : companySettings.logo)
  );
}

export function useCompanyName() {
  const currentCompany = useCurrentCompany();
  const [t] = useTranslation();

  return currentCompany?.settings?.name || t('untitled_company');
}
