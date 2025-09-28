/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { Guard } from '$app/common/guards/Guard';
import { permission } from '$app/common/guards/guards/permission';
import { Route } from 'react-router-dom';
import { lazy } from 'react';

const Warehouses = lazy(() => import('./index/Warehouses'));
const Create = lazy(() => import('./create/Create'));
const Edit = lazy(() => import('./edit/Edit'));
const Show = lazy(() => import('./show/Show'));

export const warehouseRoutes = (
  <Route path="/warehouses">
    <Route
      index
      element={
        <Guard
          guards={[permission('view_product')]}
          component={<Warehouses />}
        />
      }
    />
    <Route
      path="create"
      element={
        <Guard guards={[permission('create_product')]} component={<Create />} />
      }
    />
    <Route
      path=":id/edit"
      element={
        <Guard guards={[permission('edit_product')]} component={<Edit />} />
      }
    />
    <Route
      path=":id"
      element={
        <Guard guards={[permission('view_product')]} component={<Show />} />
      }
    />
  </Route>
);
