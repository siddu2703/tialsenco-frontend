/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { isDemo, isHosted } from '$app/common/helpers';
import { Tab } from '$app/components/Tabs';
import { useTranslation } from 'react-i18next';

export function useAccountManagementTabs() {
  const [t] = useTranslation();

  let tabs: Tab[] = [
    { name: t('plan'), href: '/settings/account_management' },
    { name: t('overview'), href: '/settings/account_management/overview' },
    {
      name: t('enabled_modules'),
      href: '/settings/account_management/enabled_modules',
    },
    {
      name: t('integrations'),
      href: '/settings/account_management/integrations',
    },
    {
      name: t('security_settings'),
      href: '/settings/account_management/security_settings',
    },
  ];

  tabs = isHosted()
    ? [
        ...tabs,
        {
          name: t('referral_program'),
          href: '/settings/account_management/referral_program',
        },
      ]
    : tabs;

  const updatedTabsList = !isDemo()
    ? [
        ...tabs,
        {
          name: t('danger_zone'),
          href: '/settings/account_management/danger_zone',
        },
      ]
    : tabs;

  return updatedTabsList;
}
