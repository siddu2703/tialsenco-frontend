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
import { Invoice } from '$app/common/interfaces/invoice';
import { useQueryClient } from 'react-query';

export function useInvoiceResolver() {
  const queryClient = useQueryClient();

  const find = (id: string) => {
    return queryClient.fetchQuery<Invoice>(
      ['/api/v1/invoices', id],
      () =>
        request(
          'GET',
          endpoint(
            '/api/v1/invoices/:id?include=client.group_settings&sort=id|asc',
            { id }
          )
        ).then((response) => response.data.data),
      { staleTime: Infinity }
    );
  };

  return { find };
}
