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
import { StockMovement } from '$app/common/interfaces/stock-movement';
import { GenericSingleResourceResponse } from '$app/common/interfaces/generic-api-response';
import { toast } from '$app/common/helpers/toast/toast';
import { $refetch } from '$app/common/hooks/useRefetch';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { route } from '$app/common/helpers/route';

export function useStockMovementQuery(params: { id: string | undefined }) {
  return useQuery(
    route('/api/v1/stock_movements/:id', { id: params.id }),
    () =>
      request(
        'GET',
        endpoint('/api/v1/stock_movements/:id', { id: params.id })
      ).then(
        (response: GenericSingleResourceResponse<StockMovement>) =>
          response.data.data
      ),
    { enabled: Boolean(params.id), staleTime: Infinity }
  );
}

export function useStockMovementsQuery() {
  return useQuery(
    '/api/v1/stock_movements',
    () => request('GET', endpoint('/api/v1/stock_movements')),
    { staleTime: Infinity }
  );
}

export function useStockMovementsSummaryQuery() {
  return useQuery(
    '/api/v1/stock_movements/summary',
    () => request('GET', endpoint('/api/v1/stock_movements/summary')),
    { staleTime: 300000 } // 5 minutes
  );
}

export function useCreateStockMovement() {
  const queryClient = useQueryClient();

  return useMutation(
    (movement: StockMovement) =>
      request('POST', endpoint('/api/v1/stock_movements'), movement),
    {
      onSuccess: () => {
        $refetch(['stock_movements', 'warehouses', 'products']);
        queryClient.invalidateQueries('/api/v1/stock_movements');
        queryClient.invalidateQueries('/api/v1/warehouses');
      },
      onError: (error: any) => {
        toast.error();
        console.error(error);
      },
    }
  );
}

export function useUpdateStockMovement() {
  const queryClient = useQueryClient();

  return useMutation(
    (movement: StockMovement) =>
      request(
        'PUT',
        endpoint('/api/v1/stock_movements/:id', { id: movement.id }),
        movement
      ),
    {
      onSuccess: () => {
        $refetch(['stock_movements', 'warehouses', 'products']);
        queryClient.invalidateQueries('/api/v1/stock_movements');
        queryClient.invalidateQueries('/api/v1/warehouses');
      },
      onError: (error: any) => {
        toast.error();
        console.error(error);
      },
    }
  );
}

export function useDeleteStockMovement() {
  const queryClient = useQueryClient();

  return useMutation(
    (id: string) =>
      request('DELETE', endpoint('/api/v1/stock_movements/:id', { id })),
    {
      onSuccess: () => {
        $refetch(['stock_movements', 'warehouses', 'products']);
        queryClient.invalidateQueries('/api/v1/stock_movements');
        queryClient.invalidateQueries('/api/v1/warehouses');
      },
      onError: (error: any) => {
        toast.error();
        console.error(error);
      },
    }
  );
}
