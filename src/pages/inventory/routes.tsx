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

const LowStock = lazy(() => import('./low-stock/LowStock'));
const Analytics = lazy(() => import('./analytics/Analytics'));
const Forecast = lazy(() => import('./forecast/Forecast'));
const ImportExport = lazy(() => import('./import-export/ImportExport'));

export const inventoryRoutes = (
  <Route path="/inventory">
    <Route
      path="low-stock"
      element={
        <Guard guards={[permission('view_product')]} component={<LowStock />} />
      }
    />
    <Route
      path="analytics"
      element={
        <Guard
          guards={[permission('view_product')]}
          component={<Analytics />}
        />
      }
    />
    <Route
      path="forecast"
      element={
        <Guard guards={[permission('view_product')]} component={<Forecast />} />
      }
    />
    <Route
      path="import-export"
      element={
        <Guard
          guards={[permission('view_product')]}
          component={<ImportExport />}
        />
      }
    />
  </Route>
);
