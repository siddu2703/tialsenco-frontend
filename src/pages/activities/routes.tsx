/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { lazy } from 'react';
import { Route } from 'react-router-dom';

const Activity = lazy(() => import('./show/Activity'));

export const activityRoutes = (
  <Route>
    <Route path="/activities/:id" element={<Activity />} />
  </Route>
);
