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
import { useScheduleColumns } from '../common/hooks/useScheduleColumns';

export function Schedules() {
  const { documentTitle } = useTitle('schedules');

  const [t] = useTranslation();

  const columns = useScheduleColumns();

  const pages = [
    { name: t('settings'), href: '/settings' },
    { name: t('schedules'), href: '/settings/schedules' },
  ];

  return (
    <Settings
      title={documentTitle}
      docsLink="en/advanced-settings/#schedules"
      breadcrumbs={pages}
    >
      <DataTable
        resource="schedule"
        endpoint="/api/v1/task_schedulers?sort=id|desc"
        bulkRoute="/api/v1/task_schedulers/bulk"
        columns={columns}
        linkToCreate="/settings/schedules/create"
        linkToEdit="/settings/schedules/:id/edit"
        withResourcefulActions
        enableSavingFilterPreference
      />
    </Settings>
  );
}
