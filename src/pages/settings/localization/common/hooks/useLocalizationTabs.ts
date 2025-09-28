/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { useCurrentSettingsLevel } from '$app/common/hooks/useCurrentSettingsLevel';
import { Tab } from '$app/components/Tabs';
import { useTranslation } from 'react-i18next';

export function useLocalizationTabs() {
  const [t] = useTranslation();

  const { isGroupSettingsActive, isClientSettingsActive } =
    useCurrentSettingsLevel();

  let tabs: Tab[] = [
    { name: t('settings'), href: '/settings/localization' },
    {
      name: t('custom_labels'),
      href: '/settings/localization/custom_labels',
    },
  ];

  if (isGroupSettingsActive || isClientSettingsActive) {
    tabs = tabs.filter((tab) => t(tab.name) !== t('custom_labels'));
  }

  return tabs;
}
