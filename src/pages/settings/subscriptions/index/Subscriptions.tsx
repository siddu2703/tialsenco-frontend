/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { useTitle } from '$app/common/hooks/useTitle';
import { DataTable } from '$app/components/DataTable';
import { Settings } from '$app/components/layouts/Settings';
import { useTranslation } from 'react-i18next';
import { useSubscriptionColumns } from '../common/hooks/useSubscriptionColumns';
import { AdvancedSettingsPlanAlert } from '$app/components/AdvancedSettingsPlanAlert';

export function Subscriptions() {
  const { documentTitle } = useTitle('payment_links');

  const [t] = useTranslation();

  const columns = useSubscriptionColumns();

  const pages = [
    { name: t('settings'), href: '/settings' },
    { name: t('payment_links'), href: '/settings/subscriptions' },
  ];

  return (
    <Settings
      title={documentTitle}
      docsLink="en/advanced-settings/#subscriptions"
      breadcrumbs={pages}
    >
      <AdvancedSettingsPlanAlert />

      <DataTable
        resource="payment_link"
        endpoint="/api/v1/subscriptions?sort=id|desc"
        bulkRoute="/api/v1/subscriptions/bulk"
        columns={columns}
        linkToCreate="/settings/subscriptions/create"
        linkToEdit="/settings/subscriptions/:id/edit"
        withResourcefulActions
        enableSavingFilterPreference
      />
    </Settings>
  );
}
