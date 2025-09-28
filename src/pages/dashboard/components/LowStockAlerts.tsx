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
import { useQuery } from 'react-query';
import { endpoint } from '$app/common/helpers';
import { request } from '$app/common/helpers/request';

export function LowStockAlerts() {
  const [t] = useTranslation();
  const navigate = useNavigate();
  const company = useCurrentCompany();

  const { data: lowStockData } = useQuery(
    '/api/v1/inventory/low-stock',
    () => request('GET', endpoint('/api/v1/inventory/low-stock')),
    { enabled: Boolean(company?.track_inventory) }
  );

  const lowStockItems = lowStockData?.data?.data || [];

  if (!company?.track_inventory) {
    return null;
  }

  return (
    <Card title={t('low_stock_alerts')} withContainer>
      <Element>
        {lowStockItems.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-green-600 font-medium">
              {t('no_low_stock_alerts')}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              {t('all_products_above_threshold')}
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {lowStockItems.slice(0, 10).map((item: any, index: number) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200"
                >
                  <div className="flex-1">
                    <div className="font-medium text-red-800">
                      {item.product?.product_key}
                    </div>
                    <div className="text-sm text-red-600">
                      {item.warehouse?.name} - {item.batch_number || 'No Batch'}
                    </div>
                    <div className="text-sm text-red-500">
                      Available: {item.available_quantity} | Threshold:{' '}
                      {item.product?.stock_notification_threshold}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-red-700">
                      {item.available_quantity}
                    </div>
                    <div className="text-xs text-red-500">{t('remaining')}</div>
                  </div>
                </div>
              ))}
            </div>

            {lowStockItems.length > 10 && (
              <div className="text-center mt-4 text-sm text-gray-500">
                {t('showing_first_10_of')} {lowStockItems.length} {t('alerts')}
              </div>
            )}

            <div className="flex gap-2 mt-4">
              <Button
                size="sm"
                type="primary"
                onClick={() => navigate('/inventory/low-stock')}
              >
                {t('view_all_alerts')}
              </Button>
              <Button
                size="sm"
                type="secondary"
                onClick={() => navigate('/products/create')}
              >
                {t('add_stock')}
              </Button>
            </div>
          </>
        )}
      </Element>
    </Card>
  );
}
