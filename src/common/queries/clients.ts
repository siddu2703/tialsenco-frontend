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
import { useHasPermission } from '$app/common/hooks/permissions/useHasPermission';
import { GenericQueryOptions } from './invoices';
import { Client } from '../interfaces/client';
import { GenericSingleResourceResponse } from '../interfaces/generic-api-response';
import { useAtomValue } from 'jotai';
import { invalidationQueryAtom } from '../atoms/data-table';
import { toast } from '../helpers/toast/toast';
import { $refetch } from '../hooks/useRefetch';

interface BlankQueryParams {
  refetchOnWindowFocus?: boolean;
}

export function useBlankClientQuery(params: BlankQueryParams) {
  const hasPermission = useHasPermission();

  return useQuery(
    '/api/v1/clients/create',
    () =>
      request('GET', endpoint('/api/v1/clients/create')).then(
        (response) => response.data.data
      ),
    {
      refetchOnWindowFocus: Boolean(params.refetchOnWindowFocus),
      staleTime: Infinity,
      enabled: hasPermission('create_client'),
    }
  );
}

interface Props {
  enabled?: boolean;
  status?: string[];
}

export function useClientsQuery(props: Props) {
  return useQuery(
    ['/api/v1/clients', 'per_page=500', props],
    () =>
      request(
        'GET',
        endpoint('/api/v1/clients?per_page=500&status=:status', {
          status: props.status?.join(',') ?? 'all',
        })
      ).then(
        (response: GenericSingleResourceResponse<Client[]>) =>
          response.data.data
      ),
    { enabled: props.enabled ?? true, staleTime: Infinity }
  );
}

export function useClientQuery({ id, enabled }: GenericQueryOptions) {
  return useQuery(
    ['/api/v1/clients', id],
    () =>
      request(
        'GET',
        endpoint(
          '/api/v1/clients/:id?include=group_settings,activities.history',
          { id }
        )
      ).then(
        (response: GenericSingleResourceResponse<Client>) => response.data.data
      ),
    {
      enabled,
      staleTime: Infinity,
    }
  );
}

const successMessages = {
  assign_group: 'updated_group',
  bulk_update: 'updated_records',
};

interface Details {
  groupSettingsId?: string;
  column?: string;
  newValue?: string | number | boolean;
}

export function useBulk() {
  const queryClient = useQueryClient();
  const invalidateQueryValue = useAtomValue(invalidationQueryAtom);

  return async (
    ids: string[],
    action: 'archive' | 'restore' | 'delete' | 'assign_group' | 'bulk_update',
    details?: Details
  ) => {
    const { groupSettingsId, column, newValue } = details || {};

    toast.processing();

    return request('POST', endpoint('/api/v1/clients/bulk'), {
      action,
      ids,
      ...(groupSettingsId && { group_settings_id: groupSettingsId }),
      ...(column && { column }),
      ...(action === 'bulk_update' && { new_value: newValue }),
    }).then(() => {
      const message =
        successMessages[action as keyof typeof successMessages] ||
        `${action}d_client`;

      toast.success(message);

      invalidateQueryValue &&
        queryClient.invalidateQueries([invalidateQueryValue]);

      $refetch(['clients']);

      if (action === 'delete') {
        $refetch(['projects']);
      }
    });
  };
}
