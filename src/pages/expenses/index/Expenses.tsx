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
import { Default } from '$app/components/layouts/Default';
import { useTranslation } from 'react-i18next';
import {
  defaultColumns,
  useActions,
  useAllExpenseColumns,
  useExpenseColumns,
  useExpenseFilters,
} from '../common/hooks';
import { DataTableColumnsPicker } from '$app/components/DataTableColumnsPicker';
import { ImportButton } from '$app/components/import/ImportButton';
import { permission } from '$app/common/guards/guards/permission';
import { useCustomBulkActions } from '../common/hooks/useCustomBulkActions';
import { useHasPermission } from '$app/common/hooks/permissions/useHasPermission';
import { Guard } from '$app/common/guards/Guard';
import { or } from '$app/common/guards/guards/or';

export default function Expenses() {
  useTitle('expenses');

  const [t] = useTranslation();
  const hasPermission = useHasPermission();

  const pages = [{ name: t('expenses'), href: '/expenses' }];

  const columns = useExpenseColumns();

  const actions = useActions();

  const filters = useExpenseFilters();

  const expenseColumns = useAllExpenseColumns();

  const customBulkActions = useCustomBulkActions();

  return (
    <Default title={t('expenses')} breadcrumbs={pages} docsLink="en/expenses">
      <DataTable
        resource="expense"
        endpoint="/api/v1/expenses?include=client,vendor,category,project&without_deleted_clients=true&without_deleted_vendors=true&sort=id|desc"
        columns={columns}
        bulkRoute="/api/v1/expenses/bulk"
        linkToCreate="/expenses/create"
        linkToEdit="/expenses/:id/edit"
        customActions={actions}
        customFilters={filters}
        customBulkActions={customBulkActions}
        customFilterPlaceholder="status"
        withResourcefulActions
        rightSide={
          <div className="flex items-center space-x-2">
            <DataTableColumnsPicker
              columns={expenseColumns as unknown as string[]}
              defaultColumns={defaultColumns}
              table="expense"
            />

            <Guard
              type="component"
              guards={[
                or(permission('create_expense'), permission('edit_expense')),
              ]}
              component={<ImportButton route="/expenses/import" />}
            />
          </div>
        }
        linkToCreateGuards={[permission('create_expense')]}
        hideEditableOptions={!hasPermission('edit_expense')}
        enableSavingFilterPreference
      />
    </Default>
  );
}
