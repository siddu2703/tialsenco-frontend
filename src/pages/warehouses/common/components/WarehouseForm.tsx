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
import Toggle from '$app/components/forms/Toggle';
import { Warehouse } from '$app/common/interfaces/warehouse';
import { ValidationBag } from '$app/common/interfaces/validation-bag';
import { EntityStatus } from '$app/components/EntityStatus';
import { NumberInputField } from '$app/components/forms/NumberInputField';
import { useUsersQuery } from '$app/common/queries/users';

interface Props {
  type?: 'create' | 'edit';
  warehouse: Warehouse;
  errors: ValidationBag | undefined;
  handleChange: (
    property: keyof Warehouse,
    value: Warehouse[keyof Warehouse]
  ) => void;
}

export function WarehouseForm(props: Props) {
  const [t] = useTranslation();

  const { errors, handleChange, type, warehouse } = props;

  const { data: users } = useUsersQuery();

  return (
    <>
      {type === 'edit' && (
        <Element leftSide={t('status')}>
          <EntityStatus entity={warehouse} />
        </Element>
      )}

      <Element leftSide={t('name')} required>
        <InputField
          required
          value={warehouse.name}
          onValueChange={(value) => handleChange('name', value)}
          errorMessage={errors?.errors.name}
        />
      </Element>

      <Element leftSide={t('code')} required>
        <InputField
          required
          value={warehouse.code}
          onValueChange={(value) => handleChange('code', value)}
          errorMessage={errors?.errors.code}
          placeholder="e.g. WH001"
        />
      </Element>

      <Element leftSide={t('address')}>
        <InputField
          element="textarea"
          value={warehouse.address || ''}
          onValueChange={(value) => handleChange('address', value)}
          errorMessage={errors?.errors.address}
        />
      </Element>

      <Element leftSide={t('city')}>
        <InputField
          value={warehouse.city || ''}
          onValueChange={(value) => handleChange('city', value)}
          errorMessage={errors?.errors.city}
        />
      </Element>

      <Element leftSide={t('state')}>
        <InputField
          value={warehouse.state || ''}
          onValueChange={(value) => handleChange('state', value)}
          errorMessage={errors?.errors.state}
        />
      </Element>

      <Element leftSide={t('pincode')}>
        <InputField
          value={warehouse.pincode || ''}
          onValueChange={(value) => handleChange('pincode', value)}
          errorMessage={errors?.errors.pincode}
        />
      </Element>

      <Element leftSide={t('phone')}>
        <InputField
          value={warehouse.phone || ''}
          onValueChange={(value) => handleChange('phone', value)}
          errorMessage={errors?.errors.phone}
        />
      </Element>

      <Element leftSide={t('email')}>
        <InputField
          type="email"
          value={warehouse.email || ''}
          onValueChange={(value) => handleChange('email', value)}
          errorMessage={errors?.errors.email}
        />
      </Element>

      <Element leftSide={t('manager')}>
        <SelectField
          value={warehouse.manager_user_id || ''}
          onValueChange={(value) => handleChange('manager_user_id', value)}
          errorMessage={errors?.errors.manager_user_id}
        >
          <option value="">{t('select_manager')}</option>
          {users?.data?.data?.map((user: any) => (
            <option key={user.id} value={user.id}>
              {user.first_name} {user.last_name} ({user.email})
            </option>
          ))}
        </SelectField>
      </Element>

      <Element leftSide={t('storage_capacity')}>
        <NumberInputField
          value={warehouse.storage_capacity || ''}
          onValueChange={(value) =>
            handleChange('storage_capacity', parseFloat(value))
          }
          errorMessage={errors?.errors.storage_capacity}
          placeholder="Square feet or cubic meters"
        />
      </Element>

      <Element leftSide={t('active')}>
        <Toggle
          checked={warehouse.is_active}
          onValueChange={(value) => handleChange('is_active', value)}
        />
      </Element>

      <Element leftSide={t('notes')}>
        <InputField
          element="textarea"
          value={warehouse.notes || ''}
          onValueChange={(value) => handleChange('notes', value)}
          errorMessage={errors?.errors.notes}
        />
      </Element>
    </>
  );
}
