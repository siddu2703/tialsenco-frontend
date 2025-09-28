/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { endpoint } from '$app/common/helpers';
import { request } from '$app/common/helpers/request';
import { useCompanyChanges } from '$app/common/hooks/useCompanyChanges';
import { useTitle } from '$app/common/hooks/useTitle';
import { Tabs } from '$app/components/Tabs';
import { Default } from '$app/components/layouts/Default';
import axios, { AxiosPromise } from 'axios';
import { useAtomValue } from 'jotai';
import { Outlet, useLocation, useParams } from 'react-router-dom';
import { updatingRecordsAtom } from './common/atoms';
import { useEffect, useState } from 'react';
import {
  isCompanySettingsFormBusy,
  useHandleCompanySave,
} from '../common/hooks/useHandleCompanySave';
import { useSaveBtn } from '$app/components/layouts/common/hooks';
import { InvoiceViewer } from '$app/pages/invoices/common/components/InvoiceViewer';
import { useTabs } from './pages/general-settings/hooks/useTabs';
import { Settings } from '$app/common/interfaces/company.interface';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { route } from '$app/common/helpers/route';
import { Page } from '$app/components/Breadcrumbs';
import { useActiveSettingsDetails } from '$app/common/hooks/useActiveSettingsDetails';
import { useCurrentSettingsLevel } from '$app/common/hooks/useCurrentSettingsLevel';
import { activeSettingsAtom } from '$app/common/atoms/settings';
import { $refetch, RefetchKey } from '$app/common/hooks/useRefetch';
import { Sparkle } from '$app/components/icons/Sparkle';

export interface GeneralSettingsPayload {
  client_id: string;
  entity_type: 'invoice';
  group_id: string;
  settings: Settings | null;
  settings_type: 'company';
}
export default function InvoiceDesign() {
  const [t] = useTranslation();
  const { documentTitle } = useTitle('invoice_design');

  const { id } = useParams();

  const tabs = useTabs();
  const location = useLocation();
  const company = useCompanyChanges();
  const activeSettings = useActiveSettingsDetails();
  const { isClientSettingsActive, isGroupSettingsActive } =
    useCurrentSettingsLevel();
  const displaySaveButtonAndPreview =
    !location.pathname.includes('custom_designs');

  const isFormBusy = useAtomValue(isCompanySettingsFormBusy);
  const activeSettingsValue = useAtomValue(activeSettingsAtom);

  const onSave = useHandleCompanySave();

  const showsMainTabs = location.pathname.includes('custom_designs')
    ? location.pathname.endsWith('/custom_designs')
    : true;

  const ProBadge = () => (
    <div className="flex space-x-0.5 items-center text-xs py-1 px-2 bg-[#2176FF26] rounded">
      <div>
        <Sparkle size="1rem" color="#2176FF" />
      </div>

      <span className="font-medium" style={{ color: '#2176FF' }}>
        {t('pro')}
      </span>
    </div>
  );

  const pages: Page[] = [
    { name: t('settings'), href: '/settings' },
    {
      name: t('invoice_design'),
      href: '/settings/invoice_design',
      afterName: <ProBadge />,
    },
  ];

  const pages2: Page[] = [
    { name: t('settings'), href: '/settings' },
    { name: t('invoice_design'), href: '/settings/invoice_design' },
    {
      name: t('custom_designs'),
      href: '/settings/invoice_design/custom_designs',
    },
    {
      name: t('design'),
      href: id
        ? route('/settings/invoice_design/custom_designs/:id/edit', { id })
        : '/settings/invoice_design/custom_designs/create',
      afterName: <ProBadge />,
    },
  ];

  const [payload, setPayload] = useState<GeneralSettingsPayload>({
    client_id: '-1',
    entity_type: 'invoice',
    group_id: '-1',
    settings: null,
    settings_type: 'company',
  });

  const updatingRecords = useAtomValue(updatingRecordsAtom);

  const handleSave = () => {
    onSave();

    const requests: AxiosPromise[] = [];

    updatingRecords.map(({ design_id, entity }) => {
      requests.push(
        request('POST', endpoint('/api/v1/designs/set/default'), {
          design_id,
          entity,
          settings_level: isGroupSettingsActive
            ? 'group_settings'
            : activeSettings.level,
          ...(isClientSettingsActive && { client_id: company?.settings?.id }),
          ...(isGroupSettingsActive && {
            group_settings_id: activeSettingsValue?.id,
          }),
        })
      );
    });

    axios.all(requests).then(() => {
      updatingRecords.forEach(({ entity }) => {
        $refetch([`${entity}s` as RefetchKey]);
      });
    });
  };

  useEffect(() => {
    if (company?.settings) {
      setPayload(
        (current) => current && { ...current, settings: company.settings }
      );
    }
  }, [company?.settings]);

  useSaveBtn(
    {
      onClick: handleSave,
      displayButton: displaySaveButtonAndPreview,
      disableSaveButton: isFormBusy,
    },
    [company, updatingRecords, location, isFormBusy]
  );

  return (
    <Default title={documentTitle} breadcrumbs={showsMainTabs ? pages : pages2}>
      <Tabs
        tabs={tabs}
        visible={showsMainTabs}
        withoutDefaultTabSpace
        fullRightPadding
        paddingTabsHeight="2.9rem"
      />

      <div
        className={classNames('flex flex-col lg:flex-row gap-4', {
          'my-4': showsMainTabs,
        })}
      >
        <div
          className={classNames('w-full overflow-y-auto', {
            'lg:w-1/2': displaySaveButtonAndPreview,
          })}
        >
          <Outlet />
        </div>

        {displaySaveButtonAndPreview && (
          <div className="w-full lg:w-1/2 max-h-[80vh] overflow-y-scroll">
            <InvoiceViewer
              link={endpoint('/api/v1/live_design')}
              resource={payload}
              method="POST"
              withToast
            />
          </div>
        )}
      </div>
    </Default>
  );
}
