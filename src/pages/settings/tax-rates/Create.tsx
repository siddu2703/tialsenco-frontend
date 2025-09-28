/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { ButtonOption, Card, CardContainer } from '$app/components/cards';
import { InputField } from '$app/components/forms';
import { AxiosError } from 'axios';
import { endpoint } from '$app/common/helpers';
import { request } from '$app/common/helpers/request';
import { route } from '$app/common/helpers/route';
import { toast } from '$app/common/helpers/toast/toast';
import { useTitle } from '$app/common/hooks/useTitle';
import { TaxRate } from '$app/common/interfaces/tax-rate';
import { ValidationBag } from '$app/common/interfaces/validation-bag';
import { useBlankTaxRateQuery } from '$app/common/queries/tax-rates';
import { Icon } from '$app/components/icons/Icon';
import { Settings } from '$app/components/layouts/Settings';
import { FormEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BiPlusCircle } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';
import { useHandleChange } from './common/hooks/useHandleChange';
import { $refetch } from '$app/common/hooks/useRefetch';
import { NumberInputField } from '$app/components/forms/NumberInputField';
import { useColorScheme } from '$app/common/colors';

export function Create() {
  const { documentTitle } = useTitle('create_tax_rate');

  const [t] = useTranslation();
  const navigate = useNavigate();

  const colors = useColorScheme();
  const { data: blankTaxRate } = useBlankTaxRateQuery();

  const pages = [
    { name: t('settings'), href: '/settings' },
    { name: t('tax_settings'), href: '/settings/tax_settings' },
    { name: t('create_tax_rate'), href: '/settings/tax_rates/create' },
  ];

  const [errors, setErrors] = useState<ValidationBag>();
  const [taxRate, setTaxRate] = useState<TaxRate>();
  const [isFormBusy, setIsFormBusy] = useState<boolean>(false);

  const handleChange = useHandleChange({ setErrors, setTaxRate });

  const handleSave = (
    event: FormEvent<HTMLFormElement>,
    actionType: string
  ) => {
    event.preventDefault();

    if (!isFormBusy) {
      toast.processing();
      setIsFormBusy(true);

      request('POST', endpoint('/api/v1/tax_rates'), taxRate)
        .then((response) => {
          toast.success('created_tax_rate');

          $refetch(['tax_rates']);

          if (actionType === 'save') {
            navigate(
              route('/settings/tax_rates/:id/edit', {
                id: response.data.data.id,
              })
            );
          } else {
            if (blankTaxRate) {
              setTaxRate(blankTaxRate);
            }
          }
        })
        .catch((error: AxiosError<ValidationBag>) => {
          if (error.response?.status === 422) {
            toast.dismiss();
            setErrors(error.response.data);
          }
        })
        .finally(() => setIsFormBusy(false));
    }
  };

  const saveOptions: ButtonOption[] = [
    {
      onClick: (event: FormEvent<HTMLFormElement>) =>
        handleSave(event, 'create'),
      text: `${t('save')} / ${t('create')}`,
      icon: <Icon element={BiPlusCircle} />,
    },
  ];

  useEffect(() => {
    if (blankTaxRate) {
      setTaxRate(blankTaxRate);
    }
  }, [blankTaxRate]);

  return (
    <Settings
      title={t('tax_rates')}
      breadcrumbs={pages}
      disableSaveButton={isFormBusy}
    >
      <div className="max-w-3xl">
        <Card
          title={documentTitle}
          className="shadow-sm"
          style={{ borderColor: colors.$24 }}
          headerStyle={{ borderColor: colors.$20 }}
          disableSubmitButton={isFormBusy}
          onFormSubmit={(event) => handleSave(event, 'save')}
          onSaveClick={(event) => handleSave(event, 'save')}
          additionalSaveOptions={saveOptions}
          withSaveButton
        >
          <CardContainer>
            <InputField
              required
              type="text"
              label={t('name')}
              value={taxRate?.name}
              onValueChange={(value) => handleChange('name', value)}
              errorMessage={errors?.errors.name}
            />

            <NumberInputField
              required
              label={t('tax_rate')}
              value={taxRate?.rate || ''}
              onValueChange={(value) => handleChange('rate', Number(value))}
              errorMessage={errors?.errors.rate}
            />
          </CardContainer>
        </Card>
      </div>
    </Settings>
  );
}
