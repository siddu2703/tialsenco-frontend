/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTitle } from '$app/common/hooks/useTitle';
import { Page } from '$app/components/Breadcrumbs';
import { Default } from '$app/components/layouts/Default';
import { Card, Element } from '$app/components/cards';
import { useCurrentCompany } from '$app/common/hooks/useCurrentCompany';
import { useQuery } from 'react-query';
import { endpoint } from '$app/common/helpers';
import { request } from '$app/common/helpers/request';
import { InputField } from '$app/components/forms';
import { Spinner } from '$app/components/Spinner';

export default function Analytics() {
  useTitle('inventory_analytics');

  const [t] = useTranslation();
  const company = useCurrentCompany();

  const [dateRange, setDateRange] = useState({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0],
    to: new Date().toISOString().split('T')[0],
  });

  const pages: Page[] = [
    { name: t('inventory'), href: '/inventory' },
    { name: t('analytics'), href: '/inventory/analytics' },
  ];

  const { data: overviewData, isLoading: overviewLoading } = useQuery(
    ['/api/v1/inventory/analytics/overview', dateRange],
    () =>
      request(
        'GET',
        endpoint('/api/v1/inventory/analytics/overview', {
          from: dateRange.from,
          to: dateRange.to,
        })
      ),
    { enabled: Boolean(company?.track_inventory) }
  );

  const { data: tileData, isLoading: tileLoading } = useQuery(
    '/api/v1/inventory/analytics/tiles',
    () => request('GET', endpoint('/api/v1/inventory/analytics/tiles')),
    { enabled: Boolean(company?.track_inventory) }
  );

  const { data: valuationData, isLoading: valuationLoading } = useQuery(
    '/api/v1/inventory/analytics/valuation',
    () => request('GET', endpoint('/api/v1/inventory/analytics/valuation')),
    { enabled: Boolean(company?.track_inventory) }
  );

  const overview = overviewData?.data?.data || {};
  const tiles = tileData?.data?.data || {};
  const valuation = valuationData?.data?.data || {};

  if (!company?.track_inventory) {
    return (
      <Default title={t('inventory_analytics')} breadcrumbs={pages}>
        <Card withContainer>
          <Element>
            <div className="text-center py-8">
              <div className="text-gray-500 font-medium">
                {t('inventory_tracking_disabled')}
              </div>
              <div className="text-sm text-gray-400 mt-1">
                {t('enable_inventory_tracking_to_view_analytics')}
              </div>
            </div>
          </Element>
        </Card>
      </Default>
    );
  }

  const isLoading = overviewLoading || tileLoading || valuationLoading;

  return (
    <Default title={t('inventory_analytics')} breadcrumbs={pages}>
      {/* Date Range Filter */}
      <Card title={t('analysis_period')} withContainer className="mb-6">
        <div className="grid grid-cols-2 gap-4">
          <Element leftSide={t('from_date')}>
            <InputField
              type="date"
              value={dateRange.from}
              onValueChange={(value) =>
                setDateRange((prev) => ({ ...prev, from: value }))
              }
            />
          </Element>
          <Element leftSide={t('to_date')}>
            <InputField
              type="date"
              value={dateRange.to}
              onValueChange={(value) =>
                setDateRange((prev) => ({ ...prev, to: value }))
              }
            />
          </Element>
        </div>
      </Card>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Spinner />
        </div>
      ) : (
        <>
          {/* Stock Summary Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card withContainer>
              <Element>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {overview.stock_summary?.total_products || 0}
                  </div>
                  <div className="text-sm text-gray-500">
                    {t('unique_products')}
                  </div>
                </div>
              </Element>
            </Card>

            <Card withContainer>
              <Element>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {overview.stock_summary?.total_quantity?.toFixed(0) || 0}
                  </div>
                  <div className="text-sm text-gray-500">
                    {t('total_quantity')}
                  </div>
                </div>
              </Element>
            </Card>

            <Card withContainer>
              <Element>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {overview.stock_summary?.available_quantity?.toFixed(0) ||
                      0}
                  </div>
                  <div className="text-sm text-gray-500">
                    {t('available_quantity')}
                  </div>
                </div>
              </Element>
            </Card>

            <Card withContainer>
              <Element>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    ₹{overview.stock_summary?.total_value?.toFixed(0) || 0}
                  </div>
                  <div className="text-sm text-gray-500">
                    {t('total_value')}
                  </div>
                </div>
              </Element>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Warehouse Distribution */}
            <Card title={t('warehouse_distribution')} withContainer>
              <Element>
                <div className="space-y-3">
                  {overview.warehouse_distribution?.map(
                    (warehouse: any, index: number) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <div className="font-medium">{warehouse.name}</div>
                          <div className="text-sm text-gray-500">
                            {warehouse.unique_products} products •{' '}
                            {warehouse.total_quantity} qty
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">
                            ₹{warehouse.total_value?.toFixed(0)}
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </Element>
            </Card>

            {/* Top Products */}
            <Card title={t('most_active_products')} withContainer>
              <Element>
                <div className="space-y-3">
                  {overview.top_products
                    ?.slice(0, 5)
                    .map((product: any, index: number) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <div className="font-medium">
                            {product.product_key}
                          </div>
                          <div className="text-sm text-gray-500">
                            {[
                              product.tile_type,
                              product.tile_size,
                              product.tile_color,
                            ]
                              .filter(Boolean)
                              .join(' • ')}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">
                            {product.total_quantity}
                          </div>
                          <div className="text-xs text-gray-500">
                            {product.movement_count} movements
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </Element>
            </Card>
          </div>

          {/* Tile-Specific Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <Card title={t('tile_type_distribution')} withContainer>
              <Element>
                <div className="space-y-2">
                  {tiles.tile_type_distribution?.map(
                    (type: any, index: number) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 border-b border-gray-100"
                      >
                        <span className="font-medium">{type.tile_type}</span>
                        <div className="text-right">
                          <div className="text-sm font-bold">
                            {type.total_quantity}
                          </div>
                          <div className="text-xs text-gray-500">
                            {type.product_count} products
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </Element>
            </Card>

            <Card title={t('tile_size_distribution')} withContainer>
              <Element>
                <div className="space-y-2">
                  {tiles.tile_size_distribution?.map(
                    (size: any, index: number) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 border-b border-gray-100"
                      >
                        <span className="font-medium">{size.tile_size}</span>
                        <div className="text-right">
                          <div className="text-sm font-bold">
                            {size.total_quantity}
                          </div>
                          <div className="text-xs text-gray-500">
                            {size.product_count} products
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </Element>
            </Card>

            <Card title={t('tile_material_distribution')} withContainer>
              <Element>
                <div className="space-y-2">
                  {tiles.tile_material_distribution?.map(
                    (material: any, index: number) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 border-b border-gray-100"
                      >
                        <span className="font-medium">
                          {material.tile_material}
                        </span>
                        <div className="text-right">
                          <div className="text-sm font-bold">
                            {material.total_quantity}
                          </div>
                          <div className="text-xs text-gray-500">
                            ₹{material.avg_unit_cost?.toFixed(0)}/unit
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </Element>
            </Card>
          </div>

          {/* Inventory Valuation */}
          <Card title={t('inventory_valuation')} withContainer>
            <Element>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">
                    {t('warehouse_valuation')}
                  </h4>
                  <div className="space-y-2">
                    {valuation.warehouse_valuation?.map(
                      (warehouse: any, index: number) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded"
                        >
                          <div>
                            <div className="font-medium">
                              {warehouse.warehouse_name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {warehouse.unique_products} products •{' '}
                              {warehouse.total_quantity} qty
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold">
                              ₹{warehouse.total_value?.toFixed(0)}
                            </div>
                            <div className="text-xs text-gray-500">
                              ₹{warehouse.avg_unit_cost?.toFixed(0)}/avg
                            </div>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">
                    {t('category_valuation')}
                  </h4>
                  <div className="space-y-2">
                    {valuation.category_valuation?.map(
                      (category: any, index: number) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded"
                        >
                          <div>
                            <div className="font-medium">
                              {category.category}
                            </div>
                            <div className="text-sm text-gray-500">
                              {category.product_count} products •{' '}
                              {category.total_quantity} qty
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold">
                              ₹{category.total_value?.toFixed(0)}
                            </div>
                            <div className="text-xs text-gray-500">
                              ₹{category.min_cost?.toFixed(0)}-₹
                              {category.max_cost?.toFixed(0)}
                            </div>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            </Element>
          </Card>
        </>
      )}
    </Default>
  );
}
