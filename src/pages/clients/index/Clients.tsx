/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { useTitle } from '$app/common/hooks/useTitle';
import { Page } from '$app/components/Breadcrumbs';
import { DataTable } from '$app/components/DataTable';
import { Default } from '$app/components/layouts/Default';
import { useTranslation } from 'react-i18next';
import {
  defaultColumns,
  useAllClientColumns,
  useClientColumns,
} from '../common/hooks/useClientColumns';
import { DataTableColumnsPicker } from '$app/components/DataTableColumnsPicker';
import { ImportButton } from '$app/components/import/ImportButton';
import { useActions } from '../common/hooks/useActions';
import { Guard } from '$app/common/guards/Guard';
import { or } from '$app/common/guards/guards/or';
import { permission } from '$app/common/guards/guards/permission';
import { useCustomBulkActions } from '../common/hooks/useCustomBulkActions';
import { useHasPermission } from '$app/common/hooks/permissions/useHasPermission';
import {
  ChangeTemplateModal,
  useChangeTemplate,
} from '$app/pages/settings/invoice-design/pages/custom-designs/components/ChangeTemplate';
import { Client } from '$app/common/interfaces/client';
import { InputLabel } from '$app/components/forms';

export default function Clients() {
  useTitle('clients');

  const [t] = useTranslation();
  const hasPermission = useHasPermission();

  const pages: Page[] = [{ name: t('clients'), href: '/clients' }];

  const actions = useActions();
  const columns = useClientColumns();
  const clientColumns = useAllClientColumns();
  const customBulkActions = useCustomBulkActions();

  const {
    changeTemplateVisible,
    setChangeTemplateVisible,
    changeTemplateResources,
  } = useChangeTemplate();

  return (
    <Default breadcrumbs={pages} title={t('clients')} docsLink="en/clients">
      <DataTable
        resource="client"
        endpoint="/api/v1/clients?include=group_settings&sort=id|desc"
        bulkRoute="/api/v1/clients/bulk"
        columns={columns}
        linkToCreate="/clients/create"
        linkToEdit="/clients/:id/edit"
        withResourcefulActions
        customActions={actions}
        bottomActionsKeys={['purge']}
        customBulkActions={customBulkActions}
        rightSide={
          <div className="flex items-center space-x-2">
            <DataTableColumnsPicker
              table="client"
              columns={clientColumns as unknown as string[]}
              defaultColumns={defaultColumns}
            />

            <Guard
              type="component"
              guards={[
                or(permission('create_client'), permission('edit_client')),
              ]}
              component={<ImportButton route="/clients/import" />}
            />
          </div>
        }
        linkToCreateGuards={[permission('create_client')]}
        hideEditableOptions={!hasPermission('edit_client')}
        enableSavingFilterPreference
      />

      <ChangeTemplateModal<Client>
        entity="client"
        entities={changeTemplateResources as Client[]}
        visible={changeTemplateVisible}
        setVisible={setChangeTemplateVisible}
        labelFn={(client) => (
          <div className="flex flex-col space-y-1">
            <InputLabel>{t('number')}</InputLabel>

            <span>{client.number}</span>
          </div>
        )}
        bulkLabelFn={(client) => (
          <div className="flex space-x-2">
            <InputLabel>{t('number')}:</InputLabel>

            <span>{client.number}</span>
          </div>
        )}
        bulkUrl="/api/v1/clients/bulk"
      />
    </Default>
  );
}
