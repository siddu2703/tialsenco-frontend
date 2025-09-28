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
import { InputField, SelectField } from '$app/components/forms';
import { Element } from '$app/components/cards';
import {
  StockMovement,
  MOVEMENT_TYPES,
} from '$app/common/interfaces/stock-movement';
import { ValidationBag } from '$app/common/interfaces/validation-bag';
import { NumberInputField } from '$app/components/forms/NumberInputField';
import { useProductsQuery } from '$app/common/queries/products';
import { useWarehousesQuery } from '$app/common/queries/warehouses';
import { useEffect } from 'react';

interface Props {
  type?: 'create' | 'edit';
  movement: StockMovement;
  errors: ValidationBag | undefined;
  handleChange: (
    property: keyof StockMovement,
    value: StockMovement[keyof StockMovement]
  ) => void;
}

export function StockMovementForm(props: Props) {
  const [t] = useTranslation();

  const { errors, handleChange, type, movement } = props;

  const { data: productsData } = useProductsQuery();
  const { data: warehousesData } = useWarehousesQuery();

  const products = productsData?.data?.data || [];
  const warehouses = warehousesData?.data?.data || [];

  // Auto-select first warehouse if only one exists
  useEffect(() => {
    if (
      type === 'create' &&
      warehouses.length === 1 &&
      !movement.warehouse_id
    ) {
      handleChange('warehouse_id', warehouses[0].id);
    }
  }, [warehouses, type, movement.warehouse_id, handleChange]);

  const isTransfer = movement.movement_type === 'TRANSFER';

  return (
    <>
      <Element leftSide={t('movement_type')} required>
        <SelectField
          required
          value={movement.movement_type}
          onValueChange={(value) =>
            handleChange(
              'movement_type',
              value as StockMovement['movement_type']
            )
          }
          errorMessage={errors?.errors.movement_type}
        >
          <option value="">{t('select_movement_type')}</option>
          {Object.entries(MOVEMENT_TYPES).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </SelectField>
      </Element>

      <Element leftSide={t('product')} required>
        <SelectField
          required
          value={movement.product_id}
          onValueChange={(value) => handleChange('product_id', value)}
          errorMessage={errors?.errors.product_id}
        >
          <option value="">{t('select_product')}</option>
          {products.map((product: any) => (
            <option key={product.id} value={product.id}>
              {product.product_key} - {product.notes}
            </option>
          ))}
        </SelectField>
      </Element>

      <Element leftSide={t('warehouse')} required>
        <SelectField
          required
          value={movement.warehouse_id}
          onValueChange={(value) => handleChange('warehouse_id', value)}
          errorMessage={errors?.errors.warehouse_id}
        >
          <option value="">{t('select_warehouse')}</option>
          {warehouses.map((warehouse: any) => (
            <option key={warehouse.id} value={warehouse.id}>
              {warehouse.name} ({warehouse.code})
            </option>
          ))}
        </SelectField>
      </Element>

      {isTransfer && (
        <Element leftSide={t('destination_warehouse')} required>
          <SelectField
            required
            value={movement.destination_warehouse_id || ''}
            onValueChange={(value) =>
              handleChange('destination_warehouse_id', value)
            }
            errorMessage={errors?.errors.destination_warehouse_id}
          >
            <option value="">{t('select_destination_warehouse')}</option>
            {warehouses
              .filter((w: any) => w.id !== movement.warehouse_id)
              .map((warehouse: any) => (
                <option key={warehouse.id} value={warehouse.id}>
                  {warehouse.name} ({warehouse.code})
                </option>
              ))}
          </SelectField>
        </Element>
      )}

      <Element leftSide={t('quantity')} required>
        <NumberInputField
          required
          value={movement.quantity || ''}
          onValueChange={(value) => handleChange('quantity', parseFloat(value))}
          errorMessage={errors?.errors.quantity}
          placeholder="0.00"
        />
      </Element>

      <Element leftSide={t('batch_number')}>
        <InputField
          value={movement.batch_number || ''}
          onValueChange={(value) => handleChange('batch_number', value)}
          errorMessage={errors?.errors.batch_number}
          placeholder="Optional batch identifier"
        />
      </Element>

      <Element leftSide={t('unit_cost')}>
        <NumberInputField
          value={movement.unit_cost || ''}
          onValueChange={(value) =>
            handleChange('unit_cost', parseFloat(value))
          }
          errorMessage={errors?.errors.unit_cost}
          placeholder="0.00"
        />
      </Element>

      <Element leftSide={t('reference_type')}>
        <SelectField
          value={movement.reference_type || ''}
          onValueChange={(value) => handleChange('reference_type', value)}
          errorMessage={errors?.errors.reference_type}
        >
          <option value="">{t('select_reference_type')}</option>
          <option value="purchase_order">Purchase Order</option>
          <option value="sale">Sale</option>
          <option value="return">Return</option>
          <option value="damage">Damage</option>
          <option value="loss">Loss</option>
          <option value="manual">Manual Adjustment</option>
        </SelectField>
      </Element>

      <Element leftSide={t('reference_id')}>
        <InputField
          value={movement.reference_id || ''}
          onValueChange={(value) => handleChange('reference_id', value)}
          errorMessage={errors?.errors.reference_id}
          placeholder="Reference document ID"
        />
      </Element>

      <Element leftSide={t('notes')}>
        <InputField
          element="textarea"
          value={movement.notes || ''}
          onValueChange={(value) => handleChange('notes', value)}
          errorMessage={errors?.errors.notes}
          placeholder="Additional notes about this movement"
        />
      </Element>
    </>
  );
}
