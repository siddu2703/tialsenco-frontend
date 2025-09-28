/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { isHosted } from '$app/common/helpers';
import { socketId } from '../sockets';

export function defaultHeaders() {
  const headers: Record<string, string | number | boolean> = {
    'X-Api-Token': localStorage.getItem('X-NINJA-TOKEN') as string,
    'X-Requested-With': 'XMLHttpRequest',
    'X-React': 'true',
  };

  if (socketId() && isHosted()) {
    headers['X-Socket-ID'] = socketId()!;
  }

  return headers;
}
