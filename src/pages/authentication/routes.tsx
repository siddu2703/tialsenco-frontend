/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { PrivateRoute } from '$app/components/PrivateRoute';
import { PublicRoute } from '$app/components/PublicRoute';
import { Route } from 'react-router-dom';
import { Demo } from './Demo';
import { SimpleLogin as Login } from './SimpleLogin';
import { SimpleRegister as Register } from './SimpleRegister';
import { Logout } from './Logout';
import { RecoverPassword } from './RecoverPassword';

export const authenticationRoutes = (
  <>
    <Route element={<PublicRoute />}>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/recover_password" element={<RecoverPassword />} />
      <Route path="/demo" element={<Demo />} />
    </Route>

    <Route element={<PrivateRoute />}>
      <Route path="/logout" element={<Logout />} />
    </Route>
  </>
);
