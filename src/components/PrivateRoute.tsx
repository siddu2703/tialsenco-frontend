/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthenticated } from '../common/hooks/useAuthenticated';
import { RootState } from '../common/stores/store';
import { LoadingScreen } from './LoadingScreen';
import { Fallback } from '$app/components/Fallback';

export function PrivateRoute() {
  const authenticated = useAuthenticated();
  const user = useSelector((state: RootState) => state.user);

  return authenticated ? (
    user.user.id ? (
      <Fallback>
        <Outlet />
      </Fallback>
    ) : (
      <LoadingScreen />
    )
  ) : (
    <Navigate to="/login" />
  );
}
