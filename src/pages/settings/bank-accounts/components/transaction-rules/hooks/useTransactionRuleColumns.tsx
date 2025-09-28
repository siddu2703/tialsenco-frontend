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
import { route } from '$app/common/helpers/route';
import { TransactionRule } from '$app/common/interfaces/transaction-rules';
import { DataTableColumns } from '$app/components/DataTable';
import { useTranslation } from 'react-i18next';

export function useTransactionRuleColumns() {
  const [t] = useTranslation();

  const columns: DataTableColumns<TransactionRule> = [
    {
      id: 'name',
      label: t('name'),
      format: (field, transactionRule) => (
        <Link
          to={route('/settings/bank_accounts/transaction_rules/:id/edit', {
            id: transactionRule.id,
          })}
        >
          {transactionRule.name}
        </Link>
      ),
    },
    {
      id: 'vendor_id',
      label: t('vendor'),
      format: (field, transactionRule) => (
        <Link
          to={route('/vendors/:id/edit', {
            id: transactionRule.vendor_id,
          })}
        >
          {transactionRule.vendor?.name}
        </Link>
      ),
    },
    {
      id: 'category_id',
      label: t('category'),
      format: (field, transactionRule) => (
        <Link
          to={route('/settings/expense_categories/:id/edit', {
            id: transactionRule.category_id,
          })}
        >
          {transactionRule.expense_category?.name}
        </Link>
      ),
    },
    {
      id: 'applies_to',
      label: t('applies_to'),
    },
  ];

  return columns;
}
