/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

export const defaultColumns: string[] = [
  'status',
  'deposit',
  'withdrawal',
  'date',
  'description',
  'invoices',
  'expense',
];

export function useAllTransactionColumns() {
  const transactionColumns = [
    'status',
    'deposit',
    'withdrawal',
    'date',
    'description',
    'invoices',
    'expense',
    'participant_name',
    'archived_at',
    'is_deleted',
    'created_at',
    'updated_at',
  ] as const;

  return transactionColumns;
}
