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
import { enabled } from '$app/common/guards/guards/enabled';
import { ModuleBitmask } from '$app/pages/settings/account-management/component';
import { or } from '$app/common/guards/guards/or';
import { assigned } from '$app/common/guards/guards/assigned';
import { lazy, Suspense } from 'react';
import { TabLoader } from '$app/components/TabLoader';

const Vendors = lazy(() => import('$app/pages/vendors/index/Vendors'));
const Import = lazy(() => import('$app/pages/vendors/import/Import'));
const Vendor = lazy(() => import('$app/pages/vendors/Vendor'));
const PurchaseOrders = lazy(
  () => import('$app/pages/vendors/show/pages/PurchaseOrders')
);
const Expenses = lazy(() => import('$app/pages/vendors/show/pages/Expenses'));
const RecurringExpenses = lazy(
  () => import('$app/pages/vendors/show/pages/RecurringExpenses')
);
const Documents = lazy(() => import('$app/pages/vendors/show/pages/Documents'));
const Edit = lazy(() => import('$app/pages/vendors/edit/Edit'));
const Create = lazy(() => import('$app/pages/vendors/create/Create'));
const Activities = lazy(
  () => import('$app/pages/vendors/show/pages/Activities')
);

export const vendorRoutes = (
  <Route path="vendors">
    <Route
      path=""
      element={
        <Guard
          guards={[
            enabled(ModuleBitmask.Vendors),
            or(
              permission('view_vendor'),
              permission('create_vendor'),
              permission('edit_vendor')
            ),
          ]}
          component={<Vendors />}
        />
      }
    />
    <Route
      path="import"
      element={
        <Guard
          guards={[
            enabled(ModuleBitmask.Vendors),
            or(permission('create_vendor'), permission('edit_vendor')),
          ]}
          component={<Import />}
        />
      }
    />
    <Route
      path=":id"
      element={
        <Guard
          guards={[
            enabled(ModuleBitmask.Vendors),
            or(
              permission('view_vendor'),
              permission('edit_vendor'),
              assigned('/api/v1/vendors/:id')
            ),
          ]}
          component={<Vendor />}
        />
      }
    >
      <Route
        path=""
        element={
          <Suspense fallback={<TabLoader />}>
            <PurchaseOrders />
          </Suspense>
        }
      />
      <Route
        path="purchase_orders"
        element={
          <Suspense fallback={<TabLoader />}>
            <PurchaseOrders />
          </Suspense>
        }
      />
      <Route
        path="expenses"
        element={
          <Suspense fallback={<TabLoader />}>
            <Expenses />
          </Suspense>
        }
      />
      <Route
        path="recurring_expenses"
        element={
          <Suspense fallback={<TabLoader />}>
            <RecurringExpenses />
          </Suspense>
        }
      />
      <Route
        path="activities"
        element={
          <Suspense fallback={<TabLoader />}>
            <Activities />
          </Suspense>
        }
      />
      <Route
        path="documents"
        element={
          <Suspense fallback={<TabLoader />}>
            <Documents />
          </Suspense>
        }
      />
    </Route>
    <Route
      path=":id/edit"
      element={
        <Guard
          guards={[
            enabled(ModuleBitmask.Vendors),
            or(permission('edit_vendor'), assigned('/api/v1/vendors/:id')),
          ]}
          component={<Edit />}
        />
      }
    />
    <Route
      path="create"
      element={
        <Guard
          guards={[enabled(ModuleBitmask.Vendors), permission('create_vendor')]}
          component={<Create />}
        />
      }
    />
  </Route>
);
