/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { isHosted } from '$app/common/helpers';
import { Tab } from '$app/components/Tabs';
import { useTranslation } from 'react-i18next';

export function useUserDetailsTabs() {
  const { t } = useTranslation();

  const tabs: Tab[] = [
    { name: t('details'), href: '/settings/user_details' },
    {
      name: t('password'),
      href: '/settings/user_details/password',
    },
    {
      name: t('oauth_mail'),
      href: '/settings/user_details/connect',
      enabled: isHosted(),
    },
    {
      name: t('enable_two_factor'),
      href: '/settings/user_details/enable_two_factor',
    },
    {
      name: t('accent_color'),
      href: '/settings/user_details/accent_color',
    },
    {
      name: t('notifications'),
      href: '/settings/user_details/notifications',
    },
    {
      name: t('custom_fields'),
      href: '/settings/user_details/custom_fields',
    },
    {
      name: t('preferences'),
      href: '/settings/user_details/preferences',
    },
  ];

  return tabs;
}
