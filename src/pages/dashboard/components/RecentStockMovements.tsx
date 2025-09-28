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
import { formatDateFromString } from '$app/common/helpers/dates';

export function RecentStockMovements() {
  const [t] = useTranslation();
  const navigate = useNavigate();
  const company = useCurrentCompany();

  const { data: movementsData } = useQuery(
    '/api/v1/stock_movements/recent',
    () =>
      request(
        'GET',
        endpoint('/api/v1/stock_movements?per_page=10&sort=created_at|desc')
      ),
    { enabled: Boolean(company?.track_inventory) }
  );

  const movements = movementsData?.data?.data || [];

  if (!company?.track_inventory) {
    return null;
  }

  const getMovementTypeColor = (type: string) => {
    switch (type) {
      case 'IN':
        return 'text-green-600 bg-green-100';
      case 'OUT':
        return 'text-red-600 bg-red-100';
      case 'TRANSFER':
        return 'text-blue-600 bg-blue-100';
      case 'ADJUSTMENT':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getMovementTypeLabel = (type: string) => {
    switch (type) {
      case 'IN':
        return t('stock_in');
      case 'OUT':
        return t('stock_out');
      case 'TRANSFER':
        return t('transfer');
      case 'ADJUSTMENT':
        return t('adjustment');
      default:
        return type;
    }
  };

  return (
    <Card title={t('recent_stock_movements')} withContainer>
      <Element>
        {movements.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-500 font-medium">
              {t('no_recent_movements')}
            </div>
            <div className="text-sm text-gray-400 mt-1">
              {t('stock_movements_appear_here')}
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {movements.map((movement: any, index: number) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${getMovementTypeColor(
                          movement.movement_type
                        )}`}
                      >
                        {getMovementTypeLabel(movement.movement_type)}
                      </span>
                      <span className="font-medium">
                        {movement.product?.product_key}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      {movement.warehouse?.name}
                      {movement.batch_number &&
                        ` • Batch: ${movement.batch_number}`}
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatDateFromString(movement.created_at)}
                      {movement.created_by?.first_name && (
                        <span>
                          {' '}
                          • by {movement.created_by.first_name}{' '}
                          {movement.created_by.last_name}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className={`text-lg font-bold ${
                        movement.movement_type === 'IN'
                          ? 'text-green-600'
                          : movement.movement_type === 'OUT'
                          ? 'text-red-600'
                          : 'text-blue-600'
                      }`}
                    >
                      {movement.movement_type === 'OUT' ? '-' : '+'}
                      {movement.quantity}
                    </div>
                    {movement.unit_cost && (
                      <div className="text-xs text-gray-500">
                        @{movement.unit_cost}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2 mt-4">
              <Button
                size="sm"
                type="primary"
                onClick={() => navigate('/stock-movements')}
              >
                {t('view_all_movements')}
              </Button>
              <Button
                size="sm"
                type="secondary"
                onClick={() => navigate('/stock-movements/create')}
              >
                {t('new_movement')}
              </Button>
            </div>
          </>
        )}
      </Element>
    </Card>
  );
}
