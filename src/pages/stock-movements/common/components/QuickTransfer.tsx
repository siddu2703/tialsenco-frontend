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
import { Card, Element } from '$app/components/cards';
import { Button, InputField, SelectField } from '$app/components/forms';
import { NumberInputField } from '$app/components/forms/NumberInputField';
import { useProductsQuery } from '$app/common/queries/products';
import { useWarehousesQuery } from '$app/common/queries/warehouses';
import { useCreateStockMovement } from '$app/common/queries/stock-movements';
import { toast } from '$app/common/helpers/toast/toast';
import { ValidationBag } from '$app/common/interfaces/validation-bag';

interface TransferData {
  product_id: string;
  source_warehouse_id: string;
  destination_warehouse_id: string;
  quantity: number;
  batch_number?: string;
  notes?: string;
}

export function QuickTransfer() {
  const [t] = useTranslation();

  const [transfer, setTransfer] = useState<TransferData>({
    product_id: '',
    source_warehouse_id: '',
    destination_warehouse_id: '',
    quantity: 0,
  });

  const [errors, setErrors] = useState<ValidationBag>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: productsData } = useProductsQuery();
  const { data: warehousesData } = useWarehousesQuery();
  const createStockMovement = useCreateStockMovement();

  const products = productsData?.data?.data || [];
  const warehouses = warehousesData?.data?.data || [];

  const handleChange = (property: keyof TransferData, value: any) => {
    setTransfer((prev) => ({ ...prev, [property]: value }));
  };

  const handleTransfer = async () => {
    if (
      !transfer.product_id ||
      !transfer.source_warehouse_id ||
      !transfer.destination_warehouse_id ||
      transfer.quantity <= 0
    ) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (transfer.source_warehouse_id === transfer.destination_warehouse_id) {
      toast.error('Source and destination warehouses must be different');
      return;
    }

    setIsSubmitting(true);
    setErrors(undefined);

    try {
      await createStockMovement.mutateAsync({
        product_id: transfer.product_id,
        warehouse_id: transfer.source_warehouse_id,
        destination_warehouse_id: transfer.destination_warehouse_id,
        movement_type: 'TRANSFER',
        quantity: transfer.quantity,
        batch_number: transfer.batch_number,
        reference_type: 'transfer',
        notes:
          transfer.notes ||
          `Transfer from ${
            warehouses.find((w) => w.id === transfer.source_warehouse_id)?.name
          } to ${
            warehouses.find((w) => w.id === transfer.destination_warehouse_id)
              ?.name
          }`,
      });

      toast.success('Transfer completed successfully');

      // Reset form
      setTransfer({
        product_id: '',
        source_warehouse_id: '',
        destination_warehouse_id: '',
        quantity: 0,
        batch_number: '',
        notes: '',
      });
    } catch (error: any) {
      setErrors(error.response?.data);
      toast.error('Transfer failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedProduct = products.find((p) => p.id === transfer.product_id);

  return (
    <Card title={t('quick_transfer')} withContainer>
      <div className="space-y-4">
        <Element leftSide={t('product')} required>
          <SelectField
            required
            value={transfer.product_id}
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

        {selectedProduct && (
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600">
              <strong>{t('product_details')}:</strong>
              <br />
              {[
                selectedProduct.tile_type,
                selectedProduct.tile_size,
                selectedProduct.tile_color,
              ]
                .filter(Boolean)
                .join(' • ')}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <Element leftSide={t('from_warehouse')} required>
            <SelectField
              required
              value={transfer.source_warehouse_id}
              onValueChange={(value) =>
                handleChange('source_warehouse_id', value)
              }
              errorMessage={errors?.errors.warehouse_id}
            >
              <option value="">{t('select_source_warehouse')}</option>
              {warehouses.map((warehouse: any) => (
                <option key={warehouse.id} value={warehouse.id}>
                  {warehouse.name} ({warehouse.code})
                </option>
              ))}
            </SelectField>
          </Element>

          <Element leftSide={t('to_warehouse')} required>
            <SelectField
              required
              value={transfer.destination_warehouse_id}
              onValueChange={(value) =>
                handleChange('destination_warehouse_id', value)
              }
              errorMessage={errors?.errors.destination_warehouse_id}
            >
              <option value="">{t('select_destination_warehouse')}</option>
              {warehouses
                .filter((w: any) => w.id !== transfer.source_warehouse_id)
                .map((warehouse: any) => (
                  <option key={warehouse.id} value={warehouse.id}>
                    {warehouse.name} ({warehouse.code})
                  </option>
                ))}
            </SelectField>
          </Element>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Element leftSide={t('quantity')} required>
            <NumberInputField
              required
              value={transfer.quantity || ''}
              onValueChange={(value) =>
                handleChange('quantity', parseFloat(value))
              }
              errorMessage={errors?.errors.quantity}
              placeholder="0.00"
            />
          </Element>

          <Element leftSide={t('batch_number')}>
            <InputField
              value={transfer.batch_number || ''}
              onValueChange={(value) => handleChange('batch_number', value)}
              errorMessage={errors?.errors.batch_number}
              placeholder="Optional batch identifier"
            />
          </Element>
        </div>

        <Element leftSide={t('transfer_notes')}>
          <InputField
            element="textarea"
            value={transfer.notes || ''}
            onValueChange={(value) => handleChange('notes', value)}
            errorMessage={errors?.errors.notes}
            placeholder="Optional transfer notes"
          />
        </Element>

        <div className="flex justify-end pt-4">
          <Button
            type="primary"
            onClick={handleTransfer}
            disabled={
              isSubmitting ||
              !transfer.product_id ||
              !transfer.source_warehouse_id ||
              !transfer.destination_warehouse_id ||
              transfer.quantity <= 0
            }
          >
            {isSubmitting ? t('processing') : t('execute_transfer')}
          </Button>
        </div>
      </div>
    </Card>
  );
}
