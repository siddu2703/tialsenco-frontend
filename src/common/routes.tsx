/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { Route, Routes } from 'react-router';
import { PrivateRoute } from '../components/PrivateRoute';
import { invoiceRoutes } from '$app/pages/invoices/routes';
import { clientRoutes } from '$app/pages/clients/routes';
import { productRoutes } from '$app/pages/products/routes';
import { warehouseRoutes } from '$app/pages/warehouses/routes';
import { stockMovementRoutes } from '$app/pages/stock-movements/routes';
import { inventoryRoutes } from '$app/pages/inventory/routes';
import { recurringInvoiceRoutes } from '$app/pages/recurring-invoices/routes';
import { paymentRoutes } from '$app/pages/payments/routes';
import { settingsRoutes } from '$app/pages/settings/routes';
import { authenticationRoutes } from '$app/pages/authentication/routes';
import { quoteRoutes } from '$app/pages/quotes/routes';
import { creditRoutes } from '$app/pages/credits/routes';
import { projectRoutes } from '$app/pages/projects/routes';
import { taskRoutes } from '$app/pages/tasks/routes';
import { vendorRoutes } from '$app/pages/vendors/routes';
import { expenseRoutes } from '$app/pages/expenses/routes';
import { purchaseOrderRoutes } from '$app/pages/purchase-orders/routes';
import { reportRoutes } from '$app/pages/reports/routes';
import { transactionRoutes } from '$app/pages/transactions/routes';
import { recurringExpenseRoutes } from '$app/pages/recurring-expenses/routes';
import { lazy } from 'react';
import { Index } from '$app/pages/Index';
import { activityRoutes } from '$app/pages/activities/routes';
import { tileRoutes } from '$app/pages/tiles/routes';
import { Guard } from './guards/Guard';
import { permission } from './guards/guards/permission';

const Dashboard = lazy(() => import('$app/pages/dashboard/Dashboard'));
const NotFound = lazy(() => import('$app/components/NotFound'));

export const routes = (
  <Routes>
    <Route path="/" element={<Index />} />
    {authenticationRoutes}
    <Route element={<PrivateRoute />}>
      <Route
        path="/dashboard"
        element={
          <Guard
            guards={[permission('view_dashboard')]}
            component={<Dashboard />}
          />
        }
      />
      {invoiceRoutes}
      {clientRoutes}
      {productRoutes}
      {warehouseRoutes}
      {stockMovementRoutes}
      {inventoryRoutes}
      {recurringInvoiceRoutes}
      {paymentRoutes}
      {quoteRoutes}
      {creditRoutes}
      {projectRoutes}
      {taskRoutes}
      {vendorRoutes}
      {purchaseOrderRoutes}
      {expenseRoutes}
      {recurringExpenseRoutes}
      {reportRoutes}
      {transactionRoutes}
      {tileRoutes}
      {settingsRoutes}
      {activityRoutes}
    </Route>
    <Route path="*" element={<NotFound />} />
  </Routes>
);
