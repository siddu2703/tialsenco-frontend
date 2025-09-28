/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { Navigate, Outlet } from 'react-router';
import { useAuthenticated } from '../common/hooks/useAuthenticated';

export function PublicRoute() {
  const authenticated = useAuthenticated();

  return authenticated ? <Navigate to="/dashboard" /> : <Outlet />;
}
