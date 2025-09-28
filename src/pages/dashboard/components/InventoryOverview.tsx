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
import { Card, Element } from '$app/components/cards';
import { useNavigate } from 'react-router-dom';
import { Button } from '$app/components/forms';
import { useCurrentCompany } from '$app/common/hooks/useCurrentCompany';
import { useWarehousesQuery } from '$app/common/queries/warehouses';

export function InventoryOverview() {
  const [t] = useTranslation();
  const navigate = useNavigate();
  const company = useCurrentCompany();

  const { data: warehousesData } = useWarehousesQuery();

  const warehouses = warehousesData?.data?.data || [];

  if (!company?.track_inventory) {
    return null;
  }

  const totalWarehouses = warehouses.length;
  const activeWarehouses = warehouses.filter((w: any) => w.is_active).length;
  const totalProducts = warehouses.reduce(
    (sum: number, w: any) => sum + (w.stock_summary?.total_products || 0),
    0
  );
  const totalQuantity = warehouses.reduce(
    (sum: number, w: any) => sum + (w.stock_summary?.total_quantity || 0),
    0
  );

  return (
    <Card title={t('inventory_overview')} withContainer>
      <Element>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {totalWarehouses}
            </div>
            <div className="text-sm text-gray-500">{t('total_warehouses')}</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {activeWarehouses}
            </div>
            <div className="text-sm text-gray-500">
              {t('active_warehouses')}
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {totalProducts}
            </div>
            <div className="text-sm text-gray-500">{t('unique_products')}</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {totalQuantity.toFixed(0)}
            </div>
            <div className="text-sm text-gray-500">{t('total_stock')}</div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-6">
          <Button
            size="sm"
            type="primary"
            onClick={() => navigate('/warehouses')}
          >
            {t('view_warehouses')}
          </Button>
          <Button
            size="sm"
            type="secondary"
            onClick={() => navigate('/warehouses/create')}
          >
            {t('new_warehouse')}
          </Button>
          <Button
            size="sm"
            type="secondary"
            onClick={() => navigate('/products')}
          >
            {t('manage_products')}
          </Button>
        </div>
      </Element>
    </Card>
  );
}
