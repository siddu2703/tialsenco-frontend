/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { User } from '$app/common/interfaces/user';
import { RootState } from '$app/common/stores/store';
import { useSelector } from 'react-redux';

export function useCurrentUser() {
  return useSelector((state: RootState) => state.user.user) as User | undefined;
}
