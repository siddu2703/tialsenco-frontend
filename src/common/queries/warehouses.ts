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
import { Warehouse } from '$app/common/interfaces/warehouse';
import { GenericSingleResourceResponse } from '$app/common/interfaces/generic-api-response';
import { toast } from '$app/common/helpers/toast/toast';
import { $refetch } from '$app/common/hooks/useRefetch';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { route } from '$app/common/helpers/route';

export function useWarehouseQuery(params: { id: string | undefined }) {
  return useQuery(
    route('/api/v1/warehouses/:id', { id: params.id }),
    () =>
      request(
        'GET',
        endpoint('/api/v1/warehouses/:id', { id: params.id })
      ).then(
        (response: GenericSingleResourceResponse<Warehouse>) =>
          response.data.data
      ),
    { enabled: Boolean(params.id), staleTime: Infinity }
  );
}

export function useWarehousesQuery() {
  return useQuery(
    '/api/v1/warehouses',
    () => request('GET', endpoint('/api/v1/warehouses')),
    { staleTime: Infinity }
  );
}

export function useCreateWarehouse() {
  const queryClient = useQueryClient();

  return useMutation(
    (warehouse: Warehouse) =>
      request('POST', endpoint('/api/v1/warehouses'), warehouse),
    {
      onSuccess: () => {
        $refetch(['warehouses']);
        queryClient.invalidateQueries('/api/v1/warehouses');
      },
      onError: (error: any) => {
        toast.error();
        console.error(error);
      },
    }
  );
}

export function useUpdateWarehouse() {
  const queryClient = useQueryClient();

  return useMutation(
    (warehouse: Warehouse) =>
      request(
        'PUT',
        endpoint('/api/v1/warehouses/:id', { id: warehouse.id }),
        warehouse
      ),
    {
      onSuccess: () => {
        $refetch(['warehouses']);
        queryClient.invalidateQueries('/api/v1/warehouses');
      },
      onError: (error: any) => {
        toast.error();
        console.error(error);
      },
    }
  );
}

export function useDeleteWarehouse() {
  const queryClient = useQueryClient();

  return useMutation(
    (id: string) =>
      request('DELETE', endpoint('/api/v1/warehouses/:id', { id })),
    {
      onSuccess: () => {
        $refetch(['warehouses']);
        queryClient.invalidateQueries('/api/v1/warehouses');
      },
      onError: (error: any) => {
        toast.error();
        console.error(error);
      },
    }
  );
}

export function useArchiveWarehouse() {
  const queryClient = useQueryClient();

  return useMutation(
    (id: string) =>
      request('POST', endpoint('/api/v1/warehouses/:id', { id }), {
        is_active: false,
      }),
    {
      onSuccess: () => {
        $refetch(['warehouses']);
        queryClient.invalidateQueries('/api/v1/warehouses');
      },
      onError: (error: any) => {
        toast.error();
        console.error(error);
      },
    }
  );
}

export function useRestoreWarehouse() {
  const queryClient = useQueryClient();

  return useMutation(
    (id: string) =>
      request('POST', endpoint('/api/v1/warehouses/:id', { id }), {
        is_active: true,
      }),
    {
      onSuccess: () => {
        $refetch(['warehouses']);
        queryClient.invalidateQueries('/api/v1/warehouses');
      },
      onError: (error: any) => {
        toast.error();
        console.error(error);
      },
    }
  );
}
