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
import { Design } from '$app/common/interfaces/design';
import { GenericManyResponse } from '$app/common/interfaces/generic-many-response';
import { useQuery } from 'react-query';
import { AxiosResponse } from 'axios';
import { GenericQueryOptions } from '$app/common/queries/invoices';
import { route } from '$app/common/helpers/route';
import { GenericSingleResourceResponse } from '$app/common/interfaces/generic-api-response';
import { useFreePlanDesigns } from '../hooks/useFreePlanDesigns';
import { enterprisePlan } from '../guards/guards/enterprise-plan';
import { proPlan } from '../guards/guards/pro-plan';
import { useAdmin } from '../hooks/permissions/useHasPermission';

export function useDesignsQuery() {
  const freePlanDesigns = useFreePlanDesigns();

  return useQuery<Design[]>(
    ['/api/v1/designs'],
    () =>
      request(
        'GET',
        endpoint('/api/v1/designs?status=active&sort=name|asc&per_page=100')
      ).then((response: AxiosResponse<GenericManyResponse<Design>>) =>
        response.data.data.filter(
          (design) =>
            freePlanDesigns.includes(design.name) ||
            proPlan() ||
            enterprisePlan()
        )
      ),
    { staleTime: Infinity }
  );
}

interface DesignQueryOptions extends GenericQueryOptions {
  id: string | undefined;
}

export function useDesignQuery(params: DesignQueryOptions) {
  return useQuery<Design>(
    ['/api/v1/designs', params.id],
    () =>
      request(
        'GET',
        endpoint('/api/v1/designs/:id?include=client', { id: params.id })
      ).then(
        (response: GenericSingleResourceResponse<Design>) => response.data.data
      ),
    { staleTime: Infinity, ...params }
  );
}

export function useBlankDesignQuery(options?: GenericQueryOptions) {
  const { isAdmin } = useAdmin();

  return useQuery<Design>(
    route('/api/v1/designs/create'),
    () =>
      request('GET', endpoint('/api/v1/designs/create')).then(
        (response: GenericSingleResourceResponse<Design>) => response.data.data
      ),
    {
      ...options,
      staleTime: Infinity,
      enabled: isAdmin ? options?.enabled ?? true : false,
    }
  );
}

export function useTemplateQuery(entity: string) {
  return useQuery<Design[]>(
    ['/api/v1/designs', '?template=true&entities=', entity],
    () =>
      request(
        'GET',
        endpoint(
          '/api/v1/designs?template=true&status=active&sort=name|asc&entities=' +
            entity
        )
      ).then(
        (response: AxiosResponse<GenericManyResponse<Design>>) =>
          response.data.data
      ),
    { staleTime: Infinity }
  );
}
