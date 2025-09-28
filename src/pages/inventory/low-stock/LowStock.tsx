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
import { Card, Element } from '$app/components/cards';
import { DataTable } from '$app/components/DataTable';
import { useCurrentCompany } from '$app/common/hooks/useCurrentCompany';
import { useQuery } from 'react-query';
import { endpoint } from '$app/common/helpers';
import { request } from '$app/common/helpers/request';
import { Button } from '$app/components/forms';
import { useNavigate } from 'react-router-dom';
import { Icon } from '$app/components/icons/Icon';
import { MdAdd, MdWarning, MdError } from 'react-icons/md';

export default function LowStock() {
  useTitle('low_stock_notifications');

  const [t] = useTranslation();
  const navigate = useNavigate();
  const company = useCurrentCompany();

  const pages: Page[] = [
    { name: t('inventory'), href: '/inventory' },
    { name: t('low_stock_notifications'), href: '/inventory/low-stock' },
  ];

  const { data: lowStockData, isLoading } = useQuery(
    '/api/v1/inventory/low-stock',
    () => request('GET', endpoint('/api/v1/inventory/low-stock')),
    { enabled: Boolean(company?.track_inventory) }
  );

  const lowStockItems = lowStockData?.data?.data || [];
  const meta = lowStockData?.data?.meta || {};

  const columns = [
    {
      id: 'alert_level',
      label: t('alert_level'),
      format: (value: any, item: any) => {
        const isOutOfStock = item.available_quantity <= 0;
        const isCritical =
          item.available_quantity <=
          item.product?.stock_notification_threshold * 0.3;

        return (
          <div className="flex items-center space-x-2">
            <Icon
              element={
                isOutOfStock ? MdError : isCritical ? MdWarning : MdWarning
              }
              className={`w-5 h-5 ${
                isOutOfStock
                  ? 'text-red-600'
                  : isCritical
                  ? 'text-orange-600'
                  : 'text-yellow-600'
              }`}
            />
            <span
              className={`px-2 py-1 text-xs font-medium rounded-full ${
                isOutOfStock
                  ? 'bg-red-100 text-red-800'
                  : isCritical
                  ? 'bg-orange-100 text-orange-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}
            >
              {isOutOfStock
                ? t('out_of_stock')
                : isCritical
                ? t('critical')
                : t('low')}
            </span>
          </div>
        );
      },
    },
    {
      id: 'product',
      label: t('product'),
      format: (value: any, item: any) => (
        <div className="flex flex-col">
          <span className="font-medium">{item.product?.product_key}</span>
          <span className="text-sm text-gray-500">{item.product?.notes}</span>
          {item.product?.tile_type && (
            <span className="text-xs text-gray-400">
              {[
                item.product.tile_type,
                item.product.tile_size,
                item.product.tile_color,
              ]
                .filter(Boolean)
                .join(' • ')}
            </span>
          )}
        </div>
      ),
    },
    {
      id: 'warehouse',
      label: t('warehouse'),
      format: (value: any, item: any) => (
        <div className="flex flex-col">
          <span className="font-medium">{item.warehouse?.name}</span>
          <span className="text-sm text-gray-500">{item.warehouse?.code}</span>
        </div>
      ),
    },
    {
      id: 'available_quantity',
      label: t('available_quantity'),
      format: (value: any, item: any) => (
        <div className="text-right">
          <div
            className={`text-lg font-bold ${
              item.available_quantity <= 0
                ? 'text-red-600'
                : item.available_quantity <=
                  item.product?.stock_notification_threshold * 0.3
                ? 'text-orange-600'
                : 'text-yellow-600'
            }`}
          >
            {item.available_quantity}
          </div>
        </div>
      ),
    },
    {
      id: 'threshold',
      label: t('threshold'),
      format: (value: any, item: any) => (
        <div className="text-right">
          <div className="text-sm text-gray-600">
            {item.product?.stock_notification_threshold || 0}
          </div>
        </div>
      ),
    },
    {
      id: 'batch_number',
      label: t('batch'),
      format: (value: any, item: any) => item.batch_number || '-',
    },
  ];

  const actions = [
    (item: any) => ({
      label: t('add_stock'),
      onClick: () =>
        navigate(
          `/stock-movements/create?product_id=${item.product_id}&warehouse_id=${item.warehouse_id}&type=IN`
        ),
      icon: <Icon element={MdAdd} />,
    }),
  ];

  if (!company?.track_inventory) {
    return (
      <Default title={t('low_stock_notifications')} breadcrumbs={pages}>
        <Card withContainer>
          <Element>
            <div className="text-center py-8">
              <div className="text-gray-500 font-medium">
                {t('inventory_tracking_disabled')}
              </div>
              <div className="text-sm text-gray-400 mt-1">
                {t('enable_inventory_tracking_to_view_notifications')}
              </div>
            </div>
          </Element>
        </Card>
      </Default>
    );
  }

  return (
    <Default
      title={t('low_stock_notifications')}
      breadcrumbs={pages}
      rightSide={
        <div className="flex items-center space-x-2">
          <Button type="secondary" onClick={() => navigate('/products')}>
            {t('manage_thresholds')}
          </Button>
          <Button
            type="primary"
            onClick={() => navigate('/stock-movements/create')}
          >
            {t('add_stock')}
          </Button>
        </div>
      }
    >
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card withContainer>
          <Element>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {meta.critical_items || 0}
              </div>
              <div className="text-sm text-gray-500">{t('critical_items')}</div>
            </div>
          </Element>
        </Card>

        <Card withContainer>
          <Element>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {meta.total_low_stock_items || 0}
              </div>
              <div className="text-sm text-gray-500">
                {t('total_low_stock_items')}
              </div>
            </div>
          </Element>
        </Card>

        <Card withContainer>
          <Element>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {Math.round(
                  ((meta.critical_items || 0) /
                    Math.max(meta.total_low_stock_items || 1, 1)) *
                    100
                )}
                %
              </div>
              <div className="text-sm text-gray-500">
                {t('critical_percentage')}
              </div>
            </div>
          </Element>
        </Card>
      </div>

      {/* Low Stock Items Table */}
      <Card withContainer>
        <Element leftSide={t('low_stock_items')}>
          {lowStockItems.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-green-600 font-medium">
                {t('no_low_stock_items')}
              </div>
              <div className="text-sm text-gray-500 mt-1">
                {t('all_products_above_threshold')}
              </div>
            </div>
          ) : (
            <DataTable
              resource="low_stock_item"
              columns={columns}
              data={lowStockItems}
              withoutPagination
              customActions={actions}
            />
          )}
        </Element>
      </Card>
    </Default>
  );
}
