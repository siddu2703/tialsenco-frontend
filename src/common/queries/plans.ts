/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2024. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { useQuery } from 'react-query';
import { request } from '../helpers/request';
import { endpoint } from '../helpers';
import { AxiosResponse } from 'axios';

interface Plans {
  features: {
    enterprise_plan: string[];
    free: string[];
    premium_business_plan: string[];
    pro_plan: string[];
  };
  plans: Record<string, number>;
}

export function usePlansQuery() {
  return useQuery({
    queryKey: ['plans'],
    queryFn: () =>
      request('GET', endpoint('/api/client/account_management/plans')).then(
        (response: AxiosResponse<Plans>) => response.data
      ),
    staleTime: Infinity,
  });
}
