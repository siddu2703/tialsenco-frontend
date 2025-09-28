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
import { assigned } from '$app/common/guards/guards/assigned';
import { enabled } from '$app/common/guards/guards/enabled';
import { or } from '$app/common/guards/guards/or';
import { permission } from '$app/common/guards/guards/permission';
import { ModuleBitmask } from '$app/pages/settings/account-management/component';
import { Outlet, Route } from 'react-router-dom';
import { lazy } from 'react';

const PurchaseOrders = lazy(() => import('./index/PurchaseOrders'));
const Edit = lazy(() => import('./edit/Edit'));
const Email = lazy(() => import('./email/Email'));
const Pdf = lazy(() => import('./pdf/Pdf'));
const Create = lazy(() => import('./create/Create'));
const PurchaseOrder = lazy(
  () => import('$app/pages/purchase-orders/PurchaseOrder')
);
const CreatePage = lazy(
  () => import('$app/pages/purchase-orders/create/components/CreatePage')
);
const Documents = lazy(
  () => import('$app/pages/purchase-orders/edit/components/Documents')
);
const Settings = lazy(
  () => import('$app/pages/purchase-orders/edit/components/Settings')
);
const Activities = lazy(
  () => import('$app/pages/purchase-orders/edit/components/Activities')
);
const History = lazy(
  () => import('$app/pages/purchase-orders/edit/components/History')
);
const EmailHistory = lazy(
  () => import('$app/pages/purchase-orders/edit/components/EmailHistory')
);

export const purchaseOrderRoutes = (
  <Route path="/purchase_orders">
    <Route
      path=""
      element={
        <Guard
          guards={[
            enabled(ModuleBitmask.PurchaseOrders),
            or(
              permission('view_purchase_order'),
              permission('create_purchase_order'),
              permission('edit_purchase_order')
            ),
          ]}
          component={<PurchaseOrders />}
        />
      }
    />

    <Route
      path=":id"
      element={
        <Guard
          guards={[
            enabled(ModuleBitmask.PurchaseOrders),
            or(
              permission('view_purchase_order'),
              permission('edit_purchase_order'),
              assigned('/api/v1/purchase_orders/:id')
            ),
          ]}
          component={<PurchaseOrder />}
        />
      }
    >
      <Route path="edit" element={<Edit />} />
      <Route path="documents" element={<Documents />} />
      <Route path="settings" element={<Settings />} />
      <Route path="activity" element={<Activities />} />
      <Route path="history" element={<History />} />
      <Route path="email_history" element={<EmailHistory />} />
    </Route>

    <Route
      path=":id"
      element={
        <Guard
          guards={[
            enabled(ModuleBitmask.PurchaseOrders),
            or(
              permission('edit_purchase_order'),
              assigned('/api/v1/purchase_orders/:id')
            ),
          ]}
          component={<Outlet />}
        />
      }
    >
      <Route path="email" element={<Email />} />
      <Route path="pdf" element={<Pdf />} />
    </Route>

    <Route
      path="create"
      element={
        <Guard
          guards={[
            enabled(ModuleBitmask.PurchaseOrders),
            permission('create_purchase_order'),
          ]}
          component={<Create />}
        />
      }
    >
      <Route path="" element={<CreatePage />} />
      <Route path="documents" element={<Documents />} />
      <Route path="settings" element={<Settings />} />
    </Route>
  </Route>
);
