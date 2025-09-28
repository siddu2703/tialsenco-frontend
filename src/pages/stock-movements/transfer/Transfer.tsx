/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { useTranslation } from 'react-i18next';
import { useTitle } from '$app/common/hooks/useTitle';
import { Page } from '$app/components/Breadcrumbs';
import { Default } from '$app/components/layouts/Default';
import { QuickTransfer } from '../common/components/QuickTransfer';
import { Card, Element } from '$app/components/cards';
import { DataTable } from '$app/components/DataTable';
import { useCurrentCompany } from '$app/common/hooks/useCurrentCompany';

export default function Transfer() {
  useTitle('inventory_transfer');

  const [t] = useTranslation();
  const company = useCurrentCompany();

  const pages: Page[] = [
    { name: t('stock_movements'), href: '/stock-movements' },
    { name: t('inventory_transfer'), href: '/stock-movements/transfer' },
  ];

  const transferColumns = [
    {
      id: 'product',
      label: t('product'),
      format: (value: any, movement: any) => (
        <div className="flex flex-col">
          <span className="font-medium">{movement.product?.product_key}</span>
          <span className="text-sm text-gray-500">
            {[
              movement.product?.tile_type,
              movement.product?.tile_size,
              movement.product?.tile_color,
            ]
              .filter(Boolean)
              .join(' • ')}
          </span>
        </div>
      ),
    },
    {
      id: 'warehouse',
      label: t('from_warehouse'),
      format: (value: any, movement: any) => movement.warehouse?.name,
    },
    {
      id: 'destination',
      label: t('to_warehouse'),
      format: (value: any, movement: any) =>
        movement.destination_warehouse?.name || 'N/A',
    },
    {
      id: 'quantity',
      label: t('quantity'),
      format: (value: any, movement: any) => movement.quantity,
    },
    {
      id: 'created_at',
      label: t('date'),
      format: (value: any, movement: any) =>
        new Date(movement.created_at).toLocaleDateString(),
    },
  ];

  if (!company?.track_inventory) {
    return (
      <Default title={t('inventory_transfer')} breadcrumbs={pages}>
        <Card withContainer>
          <Element>
            <div className="text-center py-8">
              <div className="text-gray-500 font-medium">
                {t('inventory_tracking_disabled')}
              </div>
              <div className="text-sm text-gray-400 mt-1">
                {t('enable_inventory_tracking_to_use_transfers')}
              </div>
            </div>
          </Element>
        </Card>
      </Default>
    );
  }

  return (
    <Default title={t('inventory_transfer')} breadcrumbs={pages}>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 xl:col-span-6">
          <QuickTransfer />
        </div>

        <div className="col-span-12 xl:col-span-6">
          <Card title={t('transfer_tips')} withContainer>
            <Element>
              <div className="space-y-3 text-sm">
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <strong>{t('quick_transfer')}:</strong> Use the form on the
                    left for simple warehouse-to-warehouse transfers.
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <strong>{t('batch_tracking')}:</strong> Specify batch
                    numbers to maintain proper inventory traceability.
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <strong>{t('stock_levels')}:</strong> Ensure sufficient
                    stock is available in the source warehouse before
                    transferring.
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <strong>{t('audit_trail')}:</strong> All transfers are
                    automatically logged for full audit compliance.
                  </div>
                </div>
              </div>
            </Element>
          </Card>
        </div>

        <div className="col-span-12">
          <Card title={t('recent_transfers')} withContainer>
            <Element>
              <DataTable
                resource="transfer"
                columns={transferColumns}
                endpoint="/api/v1/stock_movements?filter=movement_type:TRANSFER&include=product,warehouse&sort=created_at|desc&per_page=10"
                withoutActions
                withoutPagination
              />
            </Element>
          </Card>
        </div>
      </div>
    </Default>
  );
}
