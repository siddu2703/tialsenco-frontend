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

const StockMovements = lazy(() => import('./index/StockMovements'));
const Create = lazy(() => import('./create/Create'));
const Transfer = lazy(() => import('./transfer/Transfer'));
const Show = lazy(() => import('./show/Show'));

export const stockMovementRoutes = (
  <Route path="/stock-movements">
    <Route
      index
      element={
        <Guard
          guards={[permission('view_product')]}
          component={<StockMovements />}
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
      path="transfer"
      element={
        <Guard
          guards={[permission('create_product')]}
          component={<Transfer />}
        />
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
