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
import { useNavigate } from 'react-router-dom';
import { Card, Element } from '$app/components/cards';
import { useTitle } from '$app/common/hooks/useTitle';
import { Page } from '$app/components/Breadcrumbs';
import { Default } from '$app/components/layouts/Default';
import { ValidationBag } from '$app/common/interfaces/validation-bag';
import { toast } from '$app/common/helpers/toast/toast';
import { StockMovement } from '$app/common/interfaces/stock-movement';
import { StockMovementForm } from '../common/components/StockMovementForm';
import { useCreateStockMovement } from '$app/common/queries/stock-movements';

export default function Create() {
  useTitle('new_stock_movement');

  const [t] = useTranslation();
  const navigate = useNavigate();

  const [movement, setMovement] = useState<StockMovement>({
    product_id: '',
    warehouse_id: '',
    movement_type: 'IN',
    quantity: 0,
  });

  const [errors, setErrors] = useState<ValidationBag>();

  const pages: Page[] = [
    { name: t('stock_movements'), href: '/stock-movements' },
    { name: t('new_stock_movement'), href: '/stock-movements/create' },
  ];

  const createStockMovement = useCreateStockMovement();

  const handleChange = (
    property: keyof StockMovement,
    value: StockMovement[keyof StockMovement]
  ) => {
    setMovement((movement) => ({ ...movement, [property]: value }));
  };

  const handleSave = () => {
    createStockMovement.mutate(movement, {
      onSuccess: (response) => {
        toast.success('created_stock_movement');
        navigate(`/stock-movements/${response.data.data.id}`);
      },
      onError: (error: any) => {
        setErrors(error.response?.data);
      },
    });
  };

  const isFormValid =
    movement.product_id &&
    movement.warehouse_id &&
    movement.movement_type &&
    movement.quantity > 0 &&
    (movement.movement_type !== 'TRANSFER' ||
      movement.destination_warehouse_id);

  return (
    <Default
      title={t('new_stock_movement')}
      breadcrumbs={pages}
      onSaveClick={handleSave}
      disableSaveButton={!isFormValid}
    >
      <div className="grid grid-cols-12 gap-4">
        <Card className="col-span-12 xl:col-span-8 h-max" withContainer>
          <Element leftSide={t('details')}>
            <StockMovementForm
              type="create"
              movement={movement}
              errors={errors}
              handleChange={handleChange}
            />
          </Element>
        </Card>

        <Card className="col-span-12 xl:col-span-4 h-max" withContainer>
          <Element leftSide={t('movement_summary')}>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  {t('type')}
                </label>
                <p className="mt-1">
                  {movement.movement_type ? (
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
                      {movement.movement_type}
                    </span>
                  ) : (
                    '-'
                  )}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">
                  {t('quantity')}
                </label>
                <p className="mt-1 text-lg font-bold">
                  {movement.movement_type === 'OUT' ? '-' : '+'}
                  {movement.quantity || 0}
                </p>
              </div>

              {movement.unit_cost && (
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    {t('total_value')}
                  </label>
                  <p className="mt-1 text-lg font-bold">
                    {((movement.quantity || 0) * movement.unit_cost).toFixed(2)}
                  </p>
                </div>
              )}
            </div>
          </Element>
        </Card>
      </div>
    </Default>
  );
}
