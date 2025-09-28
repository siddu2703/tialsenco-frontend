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
import { useQuery } from 'react-query';
import { TransactionRule } from '$app/common/interfaces/transaction-rules';
import { GenericSingleResourceResponse } from '$app/common/interfaces/generic-api-response';
import { useAdmin } from '../hooks/permissions/useHasPermission';

export function useBlankTransactionRuleQuery() {
  const { isAdmin } = useAdmin();

  return useQuery<TransactionRule>(
    ['/api/v1/bank_transaction_rules', 'create'],
    () =>
      request('GET', endpoint('/api/v1/bank_transaction_rules/create')).then(
        (response: GenericSingleResourceResponse<TransactionRule>) =>
          response.data.data
      ),
    { staleTime: Infinity, enabled: isAdmin }
  );
}

interface Params {
  id: string | undefined;
  enabled?: boolean;
}

export function useTransactionRuleQuery(params: Params) {
  return useQuery<TransactionRule>(
    ['/api/v1/bank_transaction_rules', params.id],
    () =>
      request(
        'GET',
        endpoint('/api/v1/bank_transaction_rules/:id', { id: params.id })
      ).then(
        (response: GenericSingleResourceResponse<TransactionRule>) =>
          response.data.data
      ),
    { enabled: params.enabled ?? true, staleTime: Infinity }
  );
}
