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
import { Warehouse } from '$app/common/interfaces/warehouse';
import { WarehouseForm } from '../common/components/WarehouseForm';
import { useCreateWarehouse } from '$app/common/queries/warehouses';

export default function Create() {
  useTitle('new_warehouse');

  const [t] = useTranslation();
  const navigate = useNavigate();

  const [warehouse, setWarehouse] = useState<Warehouse>({
    name: '',
    code: '',
    is_active: true,
  });

  const [errors, setErrors] = useState<ValidationBag>();

  const pages: Page[] = [
    { name: t('warehouses'), href: '/warehouses' },
    { name: t('new_warehouse'), href: '/warehouses/create' },
  ];

  const createWarehouse = useCreateWarehouse();

  const handleChange = (
    property: keyof Warehouse,
    value: Warehouse[keyof Warehouse]
  ) => {
    setWarehouse((warehouse) => ({ ...warehouse, [property]: value }));
  };

  const handleSave = () => {
    createWarehouse.mutate(warehouse, {
      onSuccess: (response) => {
        toast.success('created_warehouse');
        navigate(`/warehouses/${response.data.data.id}/edit`);
      },
      onError: (error: any) => {
        setErrors(error.response?.data);
      },
    });
  };

  return (
    <Default
      title={t('new_warehouse')}
      breadcrumbs={pages}
      onSaveClick={handleSave}
      disableSaveButton={!warehouse.name || !warehouse.code}
    >
      <div className="grid grid-cols-12 gap-4">
        <Card className="col-span-12 xl:col-span-8 h-max" withContainer>
          <Element leftSide={t('details')}>
            <WarehouseForm
              type="create"
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
