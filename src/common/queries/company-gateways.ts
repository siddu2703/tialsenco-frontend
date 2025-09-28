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
import { useQuery, useQueryClient } from 'react-query';
import { useAdmin } from '$app/common/hooks/permissions/useHasPermission';
import { useAtomValue } from 'jotai';
import { invalidationQueryAtom } from '../atoms/data-table';
import { toast } from '../helpers/toast/toast';
import { $refetch } from '../hooks/useRefetch';

interface CompanyGatewaysParams {
  status?: string;
  perPage?: string;
}
export function useCompanyGatewaysQuery(params?: CompanyGatewaysParams) {
  const { isAdmin } = useAdmin();

  const { status } = params || {};

  return useQuery(
    ['/api/v1/company_gateways', params],
    () =>
      request(
        'GET',
        endpoint(
          '/api/v1/company_gateways?sort=id|desc&status=:status&per_page=:perPage',
          {
            status: status || 'active',
            perPage: params?.perPage ?? '100',
          }
        )
      ),
    { staleTime: Infinity, enabled: isAdmin }
  );
}

interface Params {
  id: string | undefined;
  queryParams?: string;
  enabled?: boolean;
}

export function useCompanyGatewayQuery(params: Params) {
  const { isAdmin } = useAdmin();

  return useQuery(
    ['/api/v1/company_gateways', params.id, params.queryParams],
    () =>
      request(
        'GET',
        endpoint(`/api/v1/company_gateways/:id?${params.queryParams || ''}`, {
          id: params.id,
        })
      ),
    { staleTime: Infinity, enabled: (params.enabled ?? true) && isAdmin }
  );
}

export function useBlankCompanyGatewayQuery() {
  const { isAdmin } = useAdmin();

  return useQuery(
    ['/api/v1/company_gateways/create'],
    () => request('GET', endpoint('/api/v1/company_gateways/create')),
    { staleTime: Infinity, enabled: isAdmin }
  );
}

export function useBulk() {
  const queryClient = useQueryClient();
  const invalidateQueryValue = useAtomValue(invalidationQueryAtom);

  return async (ids: string[], action: 'archive' | 'restore' | 'delete') => {
    toast.processing();

    return request('POST', endpoint('/api/v1/company_gateways/bulk'), {
      action,
      ids,
    }).then(() => {
      toast.success(`${action}d_company_gateway`);

      $refetch(['company_gateways']);

      invalidateQueryValue &&
        queryClient.invalidateQueries([invalidateQueryValue]);
    });
  };
}
