/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { Link } from '$app/components/forms';
import { TaskStatus } from '$app/common/interfaces/task-status';
import { DataTable, DataTableColumns } from '$app/components/DataTable';
import { useTranslation } from 'react-i18next';
import { route } from '$app/common/helpers/route';

export function TaskStatuses() {
  const [t] = useTranslation();

  const columns: DataTableColumns<TaskStatus> = [
    {
      id: 'name',
      label: t('name'),
      format: (value, taskStatus) => (
        <Link
          to={route('/settings/task_statuses/:id/edit', {
            id: taskStatus.id,
          })}
        >
          {value}
        </Link>
      ),
    },
    {
      id: 'color',
      label: t('color'),
      format: (value) => (
        <div
          className="w-10 h-4 border border-gray-300 rounded-sm"
          style={{ backgroundColor: value.toString() }}
        ></div>
      ),
    },
  ];

  return (
    <DataTable
      resource="task_status"
      columns={columns}
      endpoint="/api/v1/task_statuses?sort=id|desc"
      bulkRoute="/api/v1/task_statuses/bulk"
      linkToCreate="/settings/task_statuses/create"
      linkToEdit="/settings/task_statuses/:id/edit"
      withResourcefulActions
      enableSavingFilterPreference
    />
  );
}
