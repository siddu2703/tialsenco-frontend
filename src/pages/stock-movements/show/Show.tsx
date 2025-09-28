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
import { useStockMovementQuery } from '$app/common/queries/stock-movements';
import { Spinner } from '$app/components/Spinner';
import { MOVEMENT_TYPES } from '$app/common/interfaces/stock-movement';
import { formatDateFromString } from '$app/common/helpers/dates';

export default function Show() {
  useTitle('stock_movement_details');

  const [t] = useTranslation();
  const { id } = useParams();

  const { data: movement, isLoading } = useStockMovementQuery({ id });

  const pages: Page[] = [
    { name: t('stock_movements'), href: '/stock-movements' },
    {
      name: t('movement_details'),
      href: `/stock-movements/${id}`,
    },
  ];

  if (isLoading || !movement) {
    return (
      <Default title={t('stock_movement_details')} breadcrumbs={pages}>
        <div className="flex justify-center">
          <Spinner />
        </div>
      </Default>
    );
  }

  return (
    <Default
      title={`${t('stock_movement')}: ${
        MOVEMENT_TYPES[movement.movement_type]
      }`}
      breadcrumbs={pages}
    >
      <div className="grid grid-cols-12 gap-4">
        <Card className="col-span-12 xl:col-span-6 h-max" withContainer>
          <Element leftSide={t('movement_details')}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  {t('type')}
                </label>
                <p className="mt-1">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      movement.movement_type === 'IN'
                        ? 'bg-green-100 text-green-800'
                        : movement.movement_type === 'OUT'
                        ? 'bg-red-100 text-red-800'
                        : movement.movement_type === 'TRANSFER'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {MOVEMENT_TYPES[movement.movement_type]}
                  </span>
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">
                  {t('quantity')}
                </label>
                <p className="mt-1 text-2xl font-bold">
                  {movement.movement_type === 'OUT' ? '-' : '+'}
                  {movement.quantity}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">
                  {t('batch_number')}
                </label>
                <p className="mt-1">{movement.batch_number || '-'}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">
                  {t('unit_cost')}
                </label>
                <p className="mt-1">{movement.unit_cost?.toFixed(2) || '-'}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">
                  {t('reference_type')}
                </label>
                <p className="mt-1">{movement.reference_type || '-'}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">
                  {t('reference_id')}
                </label>
                <p className="mt-1">{movement.reference_id || '-'}</p>
              </div>

              <div className="col-span-2">
                <label className="text-sm font-medium text-gray-500">
                  {t('notes')}
                </label>
                <p className="mt-1">{movement.notes || '-'}</p>
              </div>
            </div>
          </Element>
        </Card>

        <Card className="col-span-12 xl:col-span-6 h-max" withContainer>
          <Element leftSide={t('product_warehouse_info')}>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  {t('product')}
                </label>
                <div className="mt-1">
                  <p className="font-medium">{movement.product?.product_key}</p>
                  <p className="text-sm text-gray-600">
                    {movement.product?.notes}
                  </p>
                  {movement.product?.tile_type && (
                    <div className="text-sm text-gray-500 mt-1">
                      {[
                        movement.product.tile_type,
                        movement.product.tile_size,
                        movement.product.tile_color,
                      ]
                        .filter(Boolean)
                        .join(' • ')}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">
                  {t('warehouse')}
                </label>
                <div className="mt-1">
                  <p className="font-medium">{movement.warehouse?.name}</p>
                  <p className="text-sm text-gray-600">
                    {movement.warehouse?.code}
                  </p>
                </div>
              </div>

              {movement.movement_type === 'TRANSFER' &&
                movement.destination_warehouse_id && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      {t('destination_warehouse')}
                    </label>
                    <div className="mt-1">
                      <p className="font-medium">Transfer Destination</p>
                      <p className="text-sm text-gray-600">
                        ID: {movement.destination_warehouse_id}
                      </p>
                    </div>
                  </div>
                )}

              <div>
                <label className="text-sm font-medium text-gray-500">
                  {t('created_by')}
                </label>
                <p className="mt-1">
                  {movement.createdBy
                    ? `${movement.createdBy.first_name} ${movement.createdBy.last_name}`
                    : '-'}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">
                  {t('created_date')}
                </label>
                <p className="mt-1">
                  {formatDateFromString(movement.created_at || '')}
                </p>
              </div>
            </div>
          </Element>
        </Card>

        {movement.unit_cost && (
          <Card className="col-span-12" withContainer>
            <Element leftSide={t('financial_summary')}>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {movement.unit_cost.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-500">{t('unit_cost')}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {movement.quantity}
                  </div>
                  <div className="text-sm text-gray-500">{t('quantity')}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {(movement.quantity * movement.unit_cost).toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {t('total_value')}
                  </div>
                </div>
              </div>
            </Element>
          </Card>
        )}
      </div>
    </Default>
  );
}
