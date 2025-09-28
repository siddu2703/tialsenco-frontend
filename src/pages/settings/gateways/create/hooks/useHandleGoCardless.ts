/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { request } from '$app/common/helpers/request';
import { endpoint } from '$app/common/helpers';
import { route } from '$app/common/helpers/route';

export function useHandleGoCardless() {
  return () =>
    request('POST', endpoint('/api/v1/one_time_token'), {
      context: 'gocardless_oauth2',
    }).then((response) =>
      window
        .open(
          route('https://invoicing.co/gocardless/oauth/connect/:token', {
            token: response.data.hash,
          }),
          '_blank'
        )
        ?.focus()
    );
}
