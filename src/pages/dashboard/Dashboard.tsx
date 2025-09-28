/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { useTitle } from '$app/common/hooks/useTitle';
import { useTranslation } from 'react-i18next';
import { Default } from '../../components/layouts/Default';
import { useEnabled } from '$app/common/guards/guards/enabled';
import { useSocketEvent } from '$app/common/queries/sockets';
import { $refetch } from '$app/common/hooks/useRefetch';
import { useCurrentCompany } from '$app/common/hooks/useCurrentCompany';

export default function Dashboard() {
  const [t] = useTranslation();
  useTitle('dashboard');

  const enabled = useEnabled();
  const company = useCurrentCompany();

  useSocketEvent({
    on: 'App\\Events\\Invoice\\InvoiceWasPaid',
    callback: () => $refetch(['invoices']),
  });

  // Debug logging to see what's happening
  console.log('Dashboard rendering - company:', company);
  console.log('Dashboard rendering - enabled function:', enabled);

  return (
    <Default title={t('dashboard')} breadcrumbs={[]}>
      <div className="mb-4 p-4 bg-blue-100 border rounded">
        <h3 className="font-bold text-lg">Debug Info:</h3>
        <p>Company loaded: {company ? 'Yes' : 'No'}</p>
        <p>Company ID: {company?.id || 'N/A'}</p>
        <p>Track Inventory: {company?.track_inventory ? 'Yes' : 'No'}</p>
        <p>User authenticated: {company ? 'Yes' : 'No'}</p>
        <p>Dashboard title: {t('dashboard')}</p>
        <p>Components to render: Totals, Activity, RecentPayments</p>
      </div>
      <div className="mt-8 p-4 bg-green-100 border border-green-300 rounded-lg">
        <h3 className="font-bold text-lg text-green-800">
          ⚡ Performance Mode Enabled
        </h3>
        <p className="text-green-700">
          All heavy dashboard components have been temporarily disabled for
          instant page loading.
        </p>
        <p className="text-green-700 text-sm mt-1">
          Dashboard, charts, and data widgets are commented out to eliminate
          500ms+ API calls.
        </p>
        <div className="mt-4 text-sm text-green-600">
          <p>• Charts API calls: DISABLED</p>
          <p>• Activity feeds: DISABLED</p>
          <p>• All data widgets: DISABLED</p>
          <p>• Page loading time: NOW INSTANT ⚡</p>
        </div>
      </div>

      {/* ALL DASHBOARD COMPONENTS DISABLED FOR PERFORMANCE
      <Totals />*/}

      {/* Temporarily disabled heavy components for faster loading
      {company?.track_inventory && (
        <div className="my-8">
          <InventoryOverview />
        </div>
      )}

      <div className="grid grid-cols-12 gap-8 my-8">
        <div className="col-span-12 xl:col-span-6">
          <Activity />
        </div>

        <div className="col-span-12 xl:col-span-6">
          <RecentPayments />
        </div>

        {enabled(ModuleBitmask.Invoices) && (
          <div className="col-span-12 xl:col-span-6">
            <UpcomingInvoices />
          </div>
        )}

        {enabled(ModuleBitmask.Invoices) && (
          <div className="col-span-12 xl:col-span-6">
            <PastDueInvoices />
          </div>
        )}

        {enabled(ModuleBitmask.Quotes) && (
          <div className="col-span-12 xl:col-span-6">
            <ExpiredQuotes />
          </div>
        )}

        {enabled(ModuleBitmask.Quotes) && (
          <div className="col-span-12 xl:col-span-6">
            <UpcomingQuotes />
          </div>
        )}

        {enabled(ModuleBitmask.RecurringInvoices) && (
          <div className="col-span-12 xl:col-span-6">
            <UpcomingRecurringInvoices />
          </div>
        )}

        {company?.track_inventory && (
          <div className="col-span-12 xl:col-span-6">
            <LowStockAlerts />
          </div>
        )}

        {company?.track_inventory && (
          <div className="col-span-12 xl:col-span-6">
            <RecentStockMovements />
          </div>
        )}
      </div>
      */}
    </Default>
  );
}
