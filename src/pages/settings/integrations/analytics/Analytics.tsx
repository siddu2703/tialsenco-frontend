/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { Card, Element } from '$app/components/cards';
import { InputField, Link } from '$app/components/forms';
import { AxiosError } from 'axios';
import { endpoint } from '$app/common/helpers';
import { request } from '$app/common/helpers/request';
import { toast } from '$app/common/helpers/toast/toast';
import { useCompanyChanges } from '$app/common/hooks/useCompanyChanges';
import { useCurrentCompany } from '$app/common/hooks/useCurrentCompany';
import { useTitle } from '$app/common/hooks/useTitle';
import { ValidationBag } from '$app/common/interfaces/validation-bag';
import {
  injectInChanges,
  resetChanges,
  updateChanges,
  updateRecord,
} from '$app/common/stores/slices/company-users';
import { Settings } from '$app/components/layouts/Settings';
import { ChangeEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useColorScheme } from '$app/common/colors';

export function Analytics() {
  const [t] = useTranslation();

  const pages = [
    { name: t('settings'), href: '/settings' },
    { name: t('account_management'), href: '/settings/account_management' },
    {
      name: t('analytics'),
      href: '/settings/integrations/analytics',
    },
  ];

  useTitle('analytics');

  const dispatch = useDispatch();

  const colors = useColorScheme();
  const company = useCurrentCompany();
  const companyChanges = useCompanyChanges();

  const [errors, setErrors] = useState<ValidationBag>();
  const [isFormBusy, setIsFormBusy] = useState<boolean>(false);

  useEffect(() => {
    dispatch(injectInChanges({ object: 'company', data: company }));
  }, [company]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setErrors(undefined);

    dispatch(
      updateChanges({
        object: 'company',
        property: event.target.id,
        value: event.target.value,
      })
    );
  };

  const onSave = () => {
    if (!isFormBusy) {
      toast.processing();
      setIsFormBusy(true);
      setErrors(undefined);

      request(
        'PUT',
        endpoint('/api/v1/companies/:id', { id: companyChanges.id }),
        companyChanges
      )
        .then((response) => {
          dispatch(
            updateRecord({ object: 'company', data: response.data.data })
          );
          dispatch(resetChanges('company'));

          toast.success('updated_settings');
        })
        .catch((error: AxiosError<ValidationBag>) => {
          if (error.response?.status === 422) {
            setErrors(error.response.data);
            toast.dismiss();
          }
        })
        .finally(() => setIsFormBusy(false));
    }
  };

  return (
    <Settings
      title={t('analytics')}
      breadcrumbs={pages}
      onSaveClick={onSave}
      disableSaveButton={isFormBusy}
    >
      <Card
        title={t('analytics')}
        className="shadow-sm"
        style={{ borderColor: colors.$24 }}
        headerStyle={{ borderColor: colors.$20 }}
      >
        <Element
          leftSide={
            <div className="flex space-x-1">
              <span>{t('google_analytics_tracking_id')}</span>

              <div className="flex">
                <span>(</span>
                <Link
                  to="https://support.google.com/analytics/answer/1037249?hl=en"
                  external
                  withoutExternalIcon
                >
                  {t('learn_more')}
                </Link>
                <span>)</span>
              </div>
            </div>
          }
        >
          <InputField
            id="google_analytics_key"
            value={companyChanges?.google_analytics_key}
            onChange={handleChange}
            errorMessage={errors?.errors.google_analytics_key}
          />
        </Element>

        <Element leftSide={t('matomo_id')}>
          <InputField
            id="matomo_id"
            value={companyChanges?.matomo_id}
            onChange={handleChange}
            errorMessage={errors?.errors.matomo_id}
          />
        </Element>

        <Element leftSide={t('matomo_url')}>
          <InputField
            id="matomo_url"
            value={companyChanges?.matomo_url}
            onChange={handleChange}
            errorMessage={errors?.errors.matomo_url}
          />
        </Element>
      </Card>
    </Settings>
  );
}
