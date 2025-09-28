/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { Link } from '$app/components/forms';
import { useTitle } from '$app/common/hooks/useTitle';
import { User } from '$app/common/interfaces/user';
import { DataTable, DataTableColumns } from '$app/components/DataTable';
import { Settings } from '$app/components/layouts/Settings';
import { useTranslation } from 'react-i18next';
import { route } from '$app/common/helpers/route';
import { useCurrentUser } from '$app/common/hooks/useCurrentUser';
import { PasswordConfirmation } from '$app/components/PasswordConfirmation';
import { useState } from 'react';
import { useBulk } from '$app/common/queries/users';
import { UsersPlanAlert } from '../common/components/UsersPlanAlert';
import { enterprisePlan } from '$app/common/guards/guards/enterprise-plan';
import { isHosted } from '$app/common/helpers';

export function Users() {
  useTitle('user_management');

  const currentUser = useCurrentUser();

  const [t] = useTranslation();

  const [isPasswordConfirmModalOpen, setIsPasswordConfirmModalOpen] =
    useState<boolean>(false);
  const [action, setAction] = useState<'archive' | 'restore' | 'delete'>();
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

  const bulk = useBulk({ setIsPasswordConfirmModalOpen });

  const pages = [
    { name: t('settings'), href: '/settings' },
    { name: t('user_management'), href: '/settings/users' },
  ];

  const columns: DataTableColumns<User> = [
    {
      id: 'name',
      label: 'name',
      format: (_, resource) => (
        <Link to={route('/settings/users/:id/edit', { id: resource.id })}>
          {resource.first_name} {resource.last_name}
        </Link>
      ),
    },
    { id: 'email', label: 'email' },
  ];

  return (
    <>
      <Settings
        title={t('user_details')}
        breadcrumbs={pages}
        docsLink="/docs/advanced-settings/#user_management"
      >
        {!enterprisePlan() && isHosted() && <UsersPlanAlert />}

        <DataTable
          resource="user"
          columns={columns}
          endpoint={route(
            '/api/v1/users?hideOwnerUsers=true&without=:userId&sort=id|desc&status=active',
            {
              userId: currentUser?.id,
            }
          )}
          linkToCreate="/settings/users/create"
          bulkRoute="/api/v1/users/bulk"
          onBulkActionCall={(selectedUserIds, action) => {
            setSelectedUserIds(selectedUserIds);
            setAction(action);
            setIsPasswordConfirmModalOpen(true);
          }}
          styleOptions={{
            tdClassName: 'py-4',
            withoutTdPadding: true,
          }}
          enableSavingFilterPreference
        />
      </Settings>

      <PasswordConfirmation
        show={isPasswordConfirmModalOpen}
        onClose={setIsPasswordConfirmModalOpen}
        onSave={(password, isPasswordRequired) =>
          action && bulk(selectedUserIds, action, password, isPasswordRequired)
        }
        tableActions
      />
    </>
  );
}
