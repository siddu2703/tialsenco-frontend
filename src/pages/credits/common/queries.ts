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
import { useHasPermission } from '$app/common/hooks/permissions/useHasPermission';
import { Credit } from '$app/common/interfaces/credit';
import { GenericSingleResourceResponse } from '$app/common/interfaces/generic-api-response';
import { GenericQueryOptions } from '$app/common/queries/invoices';
import { useQuery } from 'react-query';

export function useBlankCreditQuery(options?: GenericQueryOptions) {
  const hasPermission = useHasPermission();

  return useQuery<Credit>(
    ['/api/v1/credits', 'create'],
    () =>
      request('GET', endpoint('/api/v1/credits/create')).then(
        (response: GenericSingleResourceResponse<Credit>) => response.data.data
      ),
    {
      ...options,
      staleTime: Infinity,
      enabled: hasPermission('create_credit')
        ? options?.enabled ?? true
        : false,
    }
  );
}

interface CreditQueryProps {
  id: string;
}

export function useCreditQuery({ id }: CreditQueryProps) {
  return useQuery<Credit>(
    ['/api/v1/credits', id],
    () =>
      request(
        'GET',
        endpoint('/api/v1/credits/:id?include=client', { id })
      ).then(
        (response: GenericSingleResourceResponse<Credit>) => response.data.data
      ),
    { staleTime: Infinity }
  );
}
