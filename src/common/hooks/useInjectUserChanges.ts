/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { injectInChanges } from '../stores/slices/user';
import { useCurrentUser } from './useCurrentUser';
import { RootState } from '../stores/store';
import { User } from '../interfaces/user';

export function useUserChanges() {
  return useSelector((state: RootState) => state.user.changes) as
    | User
    | undefined;
}

interface Options {
  overwrite?: boolean;
}

export function useInjectUserChanges(options?: Options) {
  const user = useCurrentUser();
  const dispatch = useDispatch();
  const changes = useUserChanges();

  useEffect(() => {
    if (Object.keys(changes || {}).length && !options?.overwrite) {
      // We don't want to overwrite existing changes,
      // so let's just not inject anything if we already have a value,
      // and relative argument.

      return;
    }

    dispatch(injectInChanges());
  }, [user]);

  return changes;
}
