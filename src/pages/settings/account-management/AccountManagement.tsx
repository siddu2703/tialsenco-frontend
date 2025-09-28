/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { useInjectCompanyChanges } from '$app/common/hooks/useInjectCompanyChanges';
import { useTitle } from '$app/common/hooks/useTitle';
import { Tab, Tabs } from '$app/components/Tabs';
import { useTranslation } from 'react-i18next';
import { Outlet } from 'react-router-dom';
import { Settings } from '../../../components/layouts/Settings';
import { useDiscardChanges } from '../common/hooks/useDiscardChanges';
import {
  isCompanySettingsFormBusy,
  useHandleCompanySave,
} from '../common/hooks/useHandleCompanySave';
import { useAccountManagementTabs } from './common/hooks/useAccountManagementTabs';
import { Card } from '$app/components/cards';
import { useColorScheme } from '$app/common/colors';
import { useAtomValue } from 'jotai';

export function AccountManagement() {
  const [t] = useTranslation();

  const colors = useColorScheme();

  const pages = [
    { name: t('settings'), href: '/settings' },
    { name: t('account_management'), href: '/settings/account_management' },
  ];

  useTitle('account_management');
  useInjectCompanyChanges();

  const onSave = useHandleCompanySave();
  const onCancel = useDiscardChanges();

  const isFormBusy = useAtomValue(isCompanySettingsFormBusy);

  const tabs: Tab[] = useAccountManagementTabs();

  return (
    <Settings
      onSaveClick={onSave}
      onCancelClick={onCancel}
      title={t('account_management')}
      breadcrumbs={pages}
      docsLink="en/basic-settings/#account_management"
      disableSaveButton={isFormBusy}
    >
      <Card
        title={t('account_management')}
        className="shadow-sm pb-6"
        withoutBodyPadding
        style={{ borderColor: colors.$24 }}
        headerStyle={{ borderColor: colors.$20 }}
        withoutHeaderBorder
      >
        <Tabs
          tabs={tabs}
          withHorizontalPadding
          horizontalPaddingWidth="1.5rem"
          fullRightPadding
          withHorizontalPaddingOnSmallScreen
        />

        <div className="pt-4">
          <Outlet />
        </div>
      </Card>
    </Settings>
  );
}
