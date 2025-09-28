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
import { GenericSingleResourceResponse } from '$app/common/interfaces/generic-api-response';
import { Quote } from '$app/common/interfaces/quote';
import { GenericQueryOptions } from '$app/common/queries/invoices';
import { useQuery } from 'react-query';

export function useBlankQuoteQuery(options?: GenericQueryOptions) {
  const hasPermission = useHasPermission();

  return useQuery<Quote>(
    ['/api/v1/quotes', 'create'],
    () =>
      request('GET', endpoint('/api/v1/quotes/create')).then(
        (response: GenericSingleResourceResponse<Quote>) => response.data.data
      ),
    {
      ...options,
      staleTime: Infinity,
      enabled: hasPermission('create_quote') ? options?.enabled ?? true : false,
    }
  );
}

interface QuoteQueryParams {
  id: string;
}

export function useQuoteQuery({ id }: QuoteQueryParams) {
  return useQuery<Quote>(
    ['/api/v1/quotes', id],
    () =>
      request(
        'GET',
        endpoint('/api/v1/quotes/:id?include=client', { id })
      ).then(
        (response: GenericSingleResourceResponse<Quote>) => response.data.data
      ),
    { staleTime: Infinity }
  );
}
