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
import { Expense } from '$app/common/interfaces/expense';
import { useQuery, useQueryClient } from 'react-query';
import { route } from '$app/common/helpers/route';
import { GenericSingleResourceResponse } from '$app/common/interfaces/generic-api-response';
import { Params } from './common/params.interface';
import { useHasPermission } from '$app/common/hooks/permissions/useHasPermission';
import { useAtomValue } from 'jotai';
import { invalidationQueryAtom } from '$app/common/atoms/data-table';
import { toast } from '$app/common/helpers/toast/toast';
import { $refetch } from '../hooks/useRefetch';

interface BlankQueryParams {
  enabled?: boolean;
}

export function useBlankExpenseQuery(params: BlankQueryParams) {
  const hasPermission = useHasPermission();

  return useQuery<Expense>(
    route('/api/v1/expenses/create'),
    () =>
      request('GET', endpoint('/api/v1/expenses/create')).then(
        (response) => response.data.data
      ),
    {
      enabled: hasPermission('create_expense') ? params.enabled ?? true : false,
      staleTime: Infinity,
    }
  );
}

interface ExpenseParams {
  id: string | undefined;
  enabled?: boolean;
}

export function useExpenseQuery(params: ExpenseParams) {
  return useQuery<Expense>(
    ['/api/v1/expenses', params.id],
    () =>
      request(
        'GET',
        endpoint('/api/v1/expenses/:id?include=category', { id: params.id })
      ).then((response) => response.data.data),
    { enabled: params.enabled ?? true, staleTime: Infinity }
  );
}

interface ExpensesParams extends Params {
  enabled?: boolean;
  matchTransactions?: boolean;
  include?: string;
}

export function useExpensesQuery(params: ExpensesParams) {
  return useQuery<Expense[]>(
    ['/api/v1/expenses', params],
    () =>
      request(
        'GET',
        endpoint(
          '/api/v1/expenses?filter=:filter&per_page=:per_page&status=:status&page=:page&match_transactions=:match_transactions&include=:include',
          {
            per_page: params.perPage ?? '100',
            page: params.currentPage ?? '1',
            status: params.status ?? 'active',
            filter: params.filter ?? '',
            match_transactions: params.matchTransactions ?? false,
            includes: 'category',
            include: params.include || '',
          }
        )
      ).then(
        (response: GenericSingleResourceResponse<Expense[]>) =>
          response.data.data
      ),
    { enabled: params.enabled ?? true, staleTime: Infinity }
  );
}

const successMessages = {
  bulk_update: 'updated_records',
};

export function useBulk() {
  const queryClient = useQueryClient();
  const invalidateQueryValue = useAtomValue(invalidationQueryAtom);

  return (
    ids: string[],
    action:
      | 'archive'
      | 'restore'
      | 'delete'
      | 'bulk_categorize'
      | 'bulk_update',
    rest?: Record<string, unknown>
  ) => {
    toast.processing();

    return request('POST', endpoint('/api/v1/expenses/bulk'), {
      action,
      ids,
      ...rest,
    }).then(() => {
      const message =
        successMessages[action as keyof typeof successMessages] ||
        `${action}d_expense`;

      toast.success(message);

      invalidateQueryValue &&
        queryClient.invalidateQueries([invalidateQueryValue]);

      $refetch(['expenses']);
    });
  };
}
