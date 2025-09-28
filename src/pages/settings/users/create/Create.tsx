/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { enterprisePlan } from '$app/common/guards/guards/enterprise-plan';
import { endpoint, isHosted } from '$app/common/helpers';
import { request } from '$app/common/helpers/request';
import { route } from '$app/common/helpers/route';
import { toast } from '$app/common/helpers/toast/toast';
import { useTitle } from '$app/common/hooks/useTitle';
import { User } from '$app/common/interfaces/user';
import { ValidationBag } from '$app/common/interfaces/validation-bag';
import { defaultHeaders } from '$app/common/queries/common/headers';
import { useBlankUserQuery } from '$app/common/queries/users';
import { Settings } from '$app/components/layouts/Settings';
import { PasswordConfirmation } from '$app/components/PasswordConfirmation';
import { TabGroup } from '$app/components/TabGroup';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Details } from '../edit/components/Details';
import { Notifications } from '../edit/components/Notifications';
import { Permissions } from '../edit/components/Permissions';
import { $refetch } from '$app/common/hooks/useRefetch';
import { useOnWrongPasswordEnter } from '$app/common/hooks/useOnWrongPasswordEnter';
import { UsersPlanAlert } from '../common/components/UsersPlanAlert';
import { Card } from '$app/components/cards';
import { useColorScheme } from '$app/common/colors';

export function Create() {
  useTitle('new_user');

  const [t] = useTranslation();

  const colors = useColorScheme();

  const pages = [
    { name: t('settings'), href: '/settings' },
    { name: t('user_management'), href: '/settings/users' },
    { name: t('new_user'), href: '/settings/users/create' },
  ];

  const tabs: string[] = [t('details'), t('notifications'), t('permissions')];

  const onWrongPasswordEnter = useOnWrongPasswordEnter();

  const { data: response } = useBlankUserQuery();
  const [user, setUser] = useState<User>();
  const [errors, setErrors] = useState<ValidationBag>();
  const [isFormBusy, setIsFormBusy] = useState<boolean>(false);
  const [isPasswordConfirmModalOpen, setIsPasswordConfirmModalOpen] =
    useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setUser({
      ...response?.data.data,
      company_user: {
        permissions: '',
        notifications: {
          email: [],
        },
        settings: {
          table_columns: [],
          report_settings: [],
          number_years_active: 1,
          include_deleted_clients: false,
          accent_color: '#2F7DC3',
        },
        is_owner: false,
        is_admin: false,
        is_locked: false,
        updated_at: +new Date(),
        archived_at: +new Date(),
        created_at: +new Date(),
        permissions_updated_at: +new Date(),
        ninja_portal_url: '',
      },
    });
  }, [response?.data.data]);

  const onSave = (password: string, isPasswordRequired: boolean) => {
    if (isFormBusy) {
      return;
    }

    setIsFormBusy(true);

    toast.processing();

    setIsPasswordConfirmModalOpen(false);

    request('POST', endpoint('/api/v1/users?include=company_user'), user, {
      headers: { 'X-Api-Password': password, ...defaultHeaders() },
    })
      .then((response) => {
        toast.success('created_user');

        $refetch(['users']);

        navigate(
          route('/settings/users/:id/edit', {
            id: response.data.data.id,
          })
        );
      })
      .catch((error) => {
        if (error.response?.status === 412) {
          onWrongPasswordEnter(isPasswordRequired);
          setIsPasswordConfirmModalOpen(true);
        } else if (error.response?.status === 422) {
          const errorMessages = error.response.data;

          if (errorMessages.errors.id) {
            toast.error(errorMessages.errors.id);
          } else {
            toast.dismiss();
          }

          setErrors(errorMessages);
        }
      })
      .finally(() => setIsFormBusy(false));
  };

  return (
    <Settings
      title={t('new_user')}
      breadcrumbs={pages}
      onSaveClick={() => setIsPasswordConfirmModalOpen(true)}
      disableSaveButton={(!enterprisePlan() && isHosted()) || isFormBusy}
    >
      {!enterprisePlan() && isHosted() && <UsersPlanAlert />}

      <PasswordConfirmation
        show={isPasswordConfirmModalOpen}
        onSave={onSave}
        onClose={setIsPasswordConfirmModalOpen}
      />

      <Card
        title={t('new_user')}
        className="shadow-sm pb-6"
        style={{ borderColor: colors.$24 }}
        headerStyle={{ borderColor: colors.$20 }}
        withoutBodyPadding
        withoutHeaderBorder
      >
        <TabGroup
          tabs={tabs}
          horizontalPaddingWidth="1.5rem"
          withHorizontalPadding
          fullRightPadding
          withoutVerticalMargin
        >
          <div className="pt-4">
            {user && <Details user={user} setUser={setUser} errors={errors} />}
          </div>
          <div className="pt-4">
            {user && <Notifications user={user} setUser={setUser} />}
          </div>
          <div className="pt-4">
            {user && <Permissions user={user} setUser={setUser} />}
          </div>
        </TabGroup>
      </Card>
    </Settings>
  );
}
