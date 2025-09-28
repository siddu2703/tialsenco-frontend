/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { useQuery } from 'react-query';
import { endpoint } from '../helpers';
import { request } from '../helpers/request';
import { GenericSingleResourceResponse } from '../interfaces/generic-api-response';
import { Location } from '../interfaces/location';

export function useBlankLocationQuery() {
  return useQuery<Location>(
    '/api/v1/locations/create',
    () =>
      request('GET', endpoint('/api/v1/locations/create')).then(
        (response: GenericSingleResourceResponse<Location>) =>
          response.data.data
      ),
    { staleTime: Infinity }
  );
}
