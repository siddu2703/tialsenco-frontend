/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Card, Element } from '$app/components/cards';
import { useTitle } from '$app/common/hooks/useTitle';
import { Page } from '$app/components/Breadcrumbs';
import { Default } from '$app/components/layouts/Default';
import { ValidationBag } from '$app/common/interfaces/validation-bag';
import { toast } from '$app/common/helpers/toast/toast';
import { Warehouse } from '$app/common/interfaces/warehouse';
import { WarehouseForm } from '../common/components/WarehouseForm';
import {
  useWarehouseQuery,
  useUpdateWarehouse,
} from '$app/common/queries/warehouses';
import { Spinner } from '$app/components/Spinner';

export default function Edit() {
  useTitle('edit_warehouse');

  const [t] = useTranslation();
  const { id } = useParams();

  const { data: warehouseData, isLoading } = useWarehouseQuery({ id });
  const [warehouse, setWarehouse] = useState<Warehouse>();
  const [errors, setErrors] = useState<ValidationBag>();

  const updateWarehouse = useUpdateWarehouse();

  useEffect(() => {
    if (warehouseData) {
      setWarehouse(warehouseData);
    }
  }, [warehouseData]);

  const pages: Page[] = [
    { name: t('warehouses'), href: '/warehouses' },
    {
      name: t('edit_warehouse'),
      href: `/warehouses/${id}/edit`,
    },
  ];

  const handleChange = (
    property: keyof Warehouse,
    value: Warehouse[keyof Warehouse]
  ) => {
    setWarehouse(
      (warehouse) => warehouse && { ...warehouse, [property]: value }
    );
  };

  const handleSave = () => {
    if (!warehouse) return;

    updateWarehouse.mutate(warehouse, {
      onSuccess: () => {
        toast.success('updated_warehouse');
      },
      onError: (error: any) => {
        setErrors(error.response?.data);
      },
    });
  };

  if (isLoading || !warehouse) {
    return (
      <Default title={t('edit_warehouse')} breadcrumbs={pages}>
        <div className="flex justify-center">
          <Spinner />
        </div>
      </Default>
    );
  }

  return (
    <Default
      title={`${t('edit_warehouse')}: ${warehouse.name}`}
      breadcrumbs={pages}
      onSaveClick={handleSave}
      disableSaveButton={!warehouse.name || !warehouse.code}
    >
      <div className="grid grid-cols-12 gap-4">
        <Card className="col-span-12 xl:col-span-8 h-max" withContainer>
          <Element leftSide={t('details')}>
            <WarehouseForm
              type="edit"
              warehouse={warehouse}
              errors={errors}
              handleChange={handleChange}
            />
          </Element>
        </Card>
      </div>
    </Default>
  );
}
