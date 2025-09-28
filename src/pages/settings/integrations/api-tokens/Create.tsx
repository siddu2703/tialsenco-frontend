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
import { useTranslation } from 'react-i18next';
import { Settings } from '$app/components/layouts/Settings';
import { InputField } from '$app/components/forms';
import { useEffect, useState } from 'react';
import { AxiosError } from 'axios';
import { endpoint } from '$app/common/helpers';
import { useNavigate } from 'react-router-dom';
import { PasswordConfirmation } from '$app/components/PasswordConfirmation';
import { useTitle } from '$app/common/hooks/useTitle';
import { request } from '$app/common/helpers/request';
import { route } from '$app/common/helpers/route';
import { ValidationBag } from '$app/common/interfaces/validation-bag';
import { ApiToken } from '$app/common/interfaces/api-token';
import { useBlankApiTokenQuery } from '$app/common/queries/api-tokens';
import { useHandleChange } from './common/hooks/hooks';
import { toast } from '$app/common/helpers/toast/toast';
import { GenericSingleResourceResponse } from '$app/common/interfaces/generic-api-response';
import { $refetch } from '$app/common/hooks/useRefetch';
import { useOnWrongPasswordEnter } from '$app/common/hooks/useOnWrongPasswordEnter';
import { useColorScheme } from '$app/common/colors';

export function Create() {
  const [t] = useTranslation();
  const { documentTitle } = useTitle('new_token');
  const navigate = useNavigate();

  const colors = useColorScheme();

  const pages = [
    { name: t('settings'), href: '/settings' },
    { name: t('account_management'), href: '/settings/account_management' },
    { name: t('api_tokens'), href: '/settings/integrations/api_tokens' },
    {
      name: t('new_token'),
      href: '/settings/integrations/api_tokens/create',
    },
  ];

  const { data: blankApiToken } = useBlankApiTokenQuery();

  const onWrongPasswordEnter = useOnWrongPasswordEnter();

  const [isPasswordConfirmModalOpen, setIsPasswordConfirmModalOpen] =
    useState<boolean>(false);
  const [isFormBusy, setIsFormBusy] = useState<boolean>(false);

  const [apiToken, setApiToken] = useState<ApiToken>();
  const [errors, setErrors] = useState<ValidationBag>();

  const handleChange = useHandleChange({ setApiToken, setErrors });

  const handleSave = (password: string, isPasswordRequired: boolean) => {
    if (!isFormBusy) {
      setErrors(undefined);
      toast.processing();
      setIsFormBusy(true);

      request('POST', endpoint('/api/v1/tokens'), apiToken, {
        headers: { 'X-Api-Password': password },
      })
        .then((response: GenericSingleResourceResponse<ApiToken>) => {
          toast.success('created_token');

          $refetch(['tokens']);

          navigate(
            route('/settings/integrations/api_tokens/:id/edit', {
              id: response.data.data.id,
            })
          );
        })
        .catch((error: AxiosError<ValidationBag>) => {
          if (error.response?.status === 422) {
            toast.dismiss();
            setErrors(error.response.data);
          }

          if (error.response?.status === 412) {
            onWrongPasswordEnter(isPasswordRequired);
            setIsPasswordConfirmModalOpen(true);
          }
        })
        .finally(() => setIsFormBusy(false));
    }
  };

  useEffect(() => {
    if (blankApiToken) {
      setApiToken(blankApiToken);
    }
  }, [blankApiToken]);

  return (
    <>
      <PasswordConfirmation
        show={isPasswordConfirmModalOpen}
        onClose={setIsPasswordConfirmModalOpen}
        onSave={handleSave}
      />

      <Settings
        title={documentTitle}
        breadcrumbs={pages}
        onSaveClick={() => setIsPasswordConfirmModalOpen(true)}
        disableSaveButton={!apiToken || isFormBusy}
      >
        <Card
          title={t('new_token')}
          className="shadow-sm"
          style={{ borderColor: colors.$24 }}
          headerStyle={{ borderColor: colors.$20 }}
        >
          <Element leftSide={t('name')} required>
            <InputField
              required
              onValueChange={(value) => handleChange('name', value)}
              errorMessage={errors?.errors.name}
            />
          </Element>
        </Card>
      </Settings>
    </>
  );
}
