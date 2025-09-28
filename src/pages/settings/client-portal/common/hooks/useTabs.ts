/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { route } from '$app/common/helpers/route';
import { useCurrentSettingsLevel } from '$app/common/hooks/useCurrentSettingsLevel';
import { Tab } from '$app/components/Tabs';
import { useTranslation } from 'react-i18next';

export function useTabs() {
  const [t] = useTranslation();

  const { isGroupSettingsActive, isClientSettingsActive } =
    useCurrentSettingsLevel();

  let tabs: Tab[] = [
    {
      name: t('settings'),
      href: route('/settings/client_portal'),
    },
    {
      name: t('authorization'),
      href: route('/settings/client_portal/authorization'),
    },
    {
      name: t('registration'),
      href: route('/settings/client_portal/registration'),
    },
    {
      name: t('messages'),
      href: route('/settings/client_portal/messages'),
    },
    {
      name: t('customize'),
      href: route('/settings/client_portal/customize'),
    },
  ];

  if (isGroupSettingsActive || isClientSettingsActive) {
    tabs = tabs.filter((tab) => tab.name !== t('registration'));
  }

  return tabs;
}
