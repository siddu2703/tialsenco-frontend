/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { Route } from 'react-router-dom';
import { lazy } from 'react';
import { Guard } from '$app/common/guards/Guard';
import { permission } from '$app/common/guards/guards/permission';

const Reports = lazy(() => import('$app/pages/reports/index/Reports'));

export const reportRoutes = (
  <Route
    path="/reports"
    element={
      <Guard guards={[permission('view_reports')]} component={<Reports />} />
    }
  />
);
