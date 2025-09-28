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
import { InputField, InputLabel } from '$app/components/forms';
import { AxiosError } from 'axios';
import { endpoint } from '$app/common/helpers';
import { request } from '$app/common/helpers/request';
import { route } from '$app/common/helpers/route';
import { toast } from '$app/common/helpers/toast/toast';
import { useAccentColor } from '$app/common/hooks/useAccentColor';
import { useTitle } from '$app/common/hooks/useTitle';
import { TaskStatus } from '$app/common/interfaces/task-status';
import { ValidationBag } from '$app/common/interfaces/validation-bag';
import { useBlankTaskStatusQuery } from '$app/common/queries/task-statuses';
import { ColorPicker } from '$app/components/forms/ColorPicker';
import { Icon } from '$app/components/icons/Icon';
import { Settings } from '$app/components/layouts/Settings';
import { FormEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BiPlusCircle } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';
import { useHandleChange } from './common/hooks';
import { $refetch } from '$app/common/hooks/useRefetch';
import { useColorScheme } from '$app/common/colors';

export function Create() {
  const { documentTitle } = useTitle('new_task_status');

  const [t] = useTranslation();

  const navigate = useNavigate();

  const colors = useColorScheme();
  const accentColor = useAccentColor();

  const pages = [
    { name: t('settings'), href: '/settings' },
    { name: t('task_settings'), href: '/settings/task_settings' },
    { name: t('new_task_status'), href: '/settings/task_statuses/create' },
  ];

  const { data: blankTaskStatus } = useBlankTaskStatusQuery();

  const [errors, setErrors] = useState<ValidationBag>();

  const [isFormBusy, setIsFormBusy] = useState<boolean>(false);

  const [taskStatus, setTaskStatus] = useState<TaskStatus>();

  const handleChange = useHandleChange({
    setErrors,
    setTaskStatus,
  });

  const handleSave = (
    event: FormEvent<HTMLFormElement>,
    actionType: string
  ) => {
    event.preventDefault();

    if (!isFormBusy) {
      toast.processing();

      setErrors(undefined);

      setIsFormBusy(true);

      request('POST', endpoint('/api/v1/task_statuses'), taskStatus)
        .then((response) => {
          toast.success('created_task_status');

          $refetch(['task_statuses']);

          if (actionType === 'save') {
            navigate(
              route('/settings/task_statuses/:id/edit', {
                id: response.data.data.id,
              })
            );
          } else {
            setTaskStatus(blankTaskStatus);
          }
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

  useEffect(() => {
    if (blankTaskStatus) {
      setTaskStatus(blankTaskStatus);
    }
  }, [blankTaskStatus]);

  const saveOptions: ButtonOption[] = [
    {
      onClick: (event: FormEvent<HTMLFormElement>) =>
        handleSave(event, 'create'),
      text: `${t('save')} / ${t('create')}`,
      icon: <Icon element={BiPlusCircle} />,
    },
  ];

  return (
    <Settings title={t('task_statuses')} breadcrumbs={pages}>
      <Card
        title={documentTitle}
        className="shadow-sm"
        childrenClassName="pt-4"
        style={{ borderColor: colors.$24 }}
        headerStyle={{ borderColor: colors.$20 }}
        withoutBodyPadding
        withSaveButton
        disableSubmitButton={isFormBusy}
        onSaveClick={(event) => handleSave(event, 'save')}
        additionalSaveOptions={saveOptions}
      >
        <CardContainer>
          <InputField
            required
            label={t('name')}
            value={taskStatus?.name}
            onValueChange={(value) => handleChange('name', value)}
            errorMessage={errors?.errors.name}
          />

          <div>
            <InputLabel className="mb-1">{t('color')}</InputLabel>

            <ColorPicker
              value={taskStatus?.color || accentColor}
              onValueChange={(color) => handleChange('color', color)}
            />
          </div>
        </CardContainer>
      </Card>
    </Settings>
  );
}
