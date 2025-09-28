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
import { Client } from '$app/common/interfaces/client';
import { useQueryClient } from 'react-query';

export function useClientResolver() {
  const queryClient = useQueryClient();

  const find = (id: string) => {
    return queryClient.fetchQuery<Client>({
      queryKey: ['/api/v1/clients', id],
      queryFn: () =>
        request(
          'GET',
          endpoint('/api/v1/clients/:id?include=group_settings', { id })
        ).then((response) => response.data.data),
      staleTime: Infinity,
    });
  };

  return { find };
}
