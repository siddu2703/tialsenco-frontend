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
import { ExpenseCategory } from '$app/common/interfaces/expense-category';
import { DataTable, DataTableColumns } from '$app/components/DataTable';
import { route } from '$app/common/helpers/route';

export function ExpenseCategories() {
  const columns: DataTableColumns<ExpenseCategory> = [
    {
      id: 'category',
      label: 'name',
      format: (value, expenseCategory) => (
        <Link
          to={route('/settings/expense_categories/:id/edit', {
            id: expenseCategory.id,
          })}
        >
          {expenseCategory.name}
        </Link>
      ),
    },
    {
      id: 'color',
      label: 'color',
      format: (value) => (
        <div
          style={{ backgroundColor: value as string }}
          className="p-1 h-4 w-10"
        ></div>
      ),
    },
  ];

  return (
    <DataTable
      endpoint="/api/v1/expense_categories?sort=id|desc"
      bulkRoute="/api/v1/expense_categories/bulk"
      resource="expense_category"
      columns={columns}
      linkToCreate="/settings/expense_categories/create"
      linkToEdit="/settings/expense_categories/:id/edit"
      withResourcefulActions
      enableSavingFilterPreference
    />
  );
}
