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

const Tiles = lazy(() => import('$app/pages/tiles/index/Tiles'));
const ARVisualization = lazy(() => import('$app/pages/tiles/ARVisualization'));
const BatchTracker = lazy(() => import('$app/pages/tiles/BatchTracker'));
const ColorMatchingTool = lazy(
  () => import('$app/pages/tiles/ColorMatchingTool')
);
const CustomerPortal = lazy(() => import('$app/pages/tiles/CustomerPortal'));
const GroutCalculator = lazy(() => import('$app/pages/tiles/GroutCalculator'));
const InstallationPlanner = lazy(
  () => import('$app/pages/tiles/InstallationPlanner')
);
const SampleManager = lazy(() => import('$app/pages/tiles/SampleManager'));
const TechnicalSpecs = lazy(() => import('$app/pages/tiles/TechnicalSpecs'));
const TileAnalytics = lazy(() => import('$app/pages/tiles/TileAnalytics'));
const TileCalculator = lazy(() => import('$app/pages/tiles/TileCalculator'));

export const tileRoutes = (
  <>
    <Route
      path="/tiles"
      element={
        <Guard guards={[permission('view_product')]} component={<Tiles />} />
      }
    />
    <Route
      path="/tiles/ar-visualization"
      element={
        <Guard
          guards={[permission('view_product')]}
          component={<ARVisualization />}
        />
      }
    />
    <Route
      path="/tiles/batch-tracker"
      element={
        <Guard
          guards={[permission('view_product')]}
          component={<BatchTracker />}
        />
      }
    />
    <Route
      path="/tiles/color-matching"
      element={
        <Guard
          guards={[permission('view_product')]}
          component={<ColorMatchingTool />}
        />
      }
    />
    <Route
      path="/tiles/customer-portal"
      element={
        <Guard
          guards={[permission('view_client')]}
          component={<CustomerPortal />}
        />
      }
    />
    <Route
      path="/tiles/grout-calculator"
      element={
        <Guard
          guards={[permission('view_product')]}
          component={<GroutCalculator />}
        />
      }
    />
    <Route
      path="/tiles/installation-planner"
      element={
        <Guard
          guards={[permission('view_product')]}
          component={<InstallationPlanner />}
        />
      }
    />
    <Route
      path="/tiles/sample-manager"
      element={
        <Guard
          guards={[permission('view_product')]}
          component={<SampleManager />}
        />
      }
    />
    <Route
      path="/tiles/technical-specs"
      element={
        <Guard
          guards={[permission('view_product')]}
          component={<TechnicalSpecs />}
        />
      }
    />
    <Route
      path="/tiles/analytics"
      element={
        <Guard
          guards={[permission('view_reports')]}
          component={<TileAnalytics />}
        />
      }
    />
    <Route
      path="/tiles/calculator"
      element={
        <Guard
          guards={[permission('view_product')]}
          component={<TileCalculator />}
        />
      }
    />
  </>
);
