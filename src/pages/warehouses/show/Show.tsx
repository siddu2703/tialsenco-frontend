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
import { useParams } from 'react-router-dom';
import { Card, Element } from '$app/components/cards';
import { useTitle } from '$app/common/hooks/useTitle';
import { Page } from '$app/components/Breadcrumbs';
import { Default } from '$app/components/layouts/Default';
import { useWarehouseQuery } from '$app/common/queries/warehouses';
import { Spinner } from '$app/components/Spinner';
import { DataTable } from '$app/components/DataTable';

export default function Show() {
  useTitle('warehouse_details');

  const [t] = useTranslation();
  const { id } = useParams();

  const { data: warehouse, isLoading } = useWarehouseQuery({ id });

  const pages: Page[] = [
    { name: t('warehouses'), href: '/warehouses' },
    {
      name: warehouse?.name || t('warehouse_details'),
      href: `/warehouses/${id}`,
    },
  ];

  const stockColumns = [
    {
      id: 'product',
      label: t('product'),
      format: (value: any, stock: any) => (
        <div className="flex flex-col">
          <span className="font-medium">{stock.product?.product_key}</span>
          <span className="text-sm text-gray-500">{stock.product?.notes}</span>
        </div>
      ),
    },
    {
      id: 'batch_number',
      label: t('batch_number'),
    },
    {
      id: 'current_quantity',
      label: t('current_quantity'),
      format: (value: number) => value?.toFixed(2) || '0.00',
    },
    {
      id: 'available_quantity',
      label: t('available_quantity'),
      format: (value: number) => value?.toFixed(2) || '0.00',
    },
    {
      id: 'reserved_quantity',
      label: t('reserved_quantity'),
      format: (value: number) => value?.toFixed(2) || '0.00',
    },
    {
      id: 'unit_cost',
      label: t('unit_cost'),
      format: (value: number) => value?.toFixed(2) || '0.00',
    },
  ];

  if (isLoading || !warehouse) {
    return (
      <Default title={t('warehouse_details')} breadcrumbs={pages}>
        <div className="flex justify-center">
          <Spinner />
        </div>
      </Default>
    );
  }

  return (
    <Default title={`${t('warehouse')}: ${warehouse.name}`} breadcrumbs={pages}>
      <div className="grid grid-cols-12 gap-4">
        <Card className="col-span-12 xl:col-span-6 h-max" withContainer>
          <Element leftSide={t('details')}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  {t('name')}
                </label>
                <p className="mt-1">{warehouse.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  {t('code')}
                </label>
                <p className="mt-1">{warehouse.code}</p>
              </div>
              <div className="col-span-2">
                <label className="text-sm font-medium text-gray-500">
                  {t('address')}
                </label>
                <p className="mt-1">
                  {warehouse.address && (
                    <>
                      {warehouse.address}
                      <br />
                    </>
                  )}
                  {[warehouse.city, warehouse.state, warehouse.pincode]
                    .filter(Boolean)
                    .join(', ')}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  {t('phone')}
                </label>
                <p className="mt-1">{warehouse.phone || '-'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  {t('email')}
                </label>
                <p className="mt-1">{warehouse.email || '-'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  {t('manager')}
                </label>
                <p className="mt-1">
                  {warehouse.manager
                    ? `${warehouse.manager.first_name} ${warehouse.manager.last_name}`
                    : '-'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  {t('status')}
                </label>
                <p className="mt-1">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      warehouse.is_active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {warehouse.is_active ? t('active') : t('inactive')}
                  </span>
                </p>
              </div>
            </div>
          </Element>
        </Card>

        <Card className="col-span-12 xl:col-span-6 h-max" withContainer>
          <Element leftSide={t('stock_summary')}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  {t('total_products')}
                </label>
                <p className="mt-1 text-2xl font-bold">
                  {warehouse.stock_summary?.total_products || 0}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  {t('total_quantity')}
                </label>
                <p className="mt-1 text-2xl font-bold">
                  {warehouse.stock_summary?.total_quantity?.toFixed(2) ||
                    '0.00'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  {t('available_quantity')}
                </label>
                <p className="mt-1 text-2xl font-bold text-green-600">
                  {warehouse.stock_summary?.available_quantity?.toFixed(2) ||
                    '0.00'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  {t('reserved_quantity')}
                </label>
                <p className="mt-1 text-2xl font-bold text-orange-600">
                  {warehouse.stock_summary?.reserved_quantity?.toFixed(2) ||
                    '0.00'}
                </p>
              </div>
            </div>
          </Element>
        </Card>

        <Card className="col-span-12" withContainer>
          <Element leftSide={t('stock_items')}>
            <DataTable
              resource="warehouse_stock"
              columns={stockColumns}
              endpoint={`/api/v1/warehouses/${id}/stock`}
              withoutActions
              withoutPagination
            />
          </Element>
        </Card>
      </div>
    </Default>
  );
}
