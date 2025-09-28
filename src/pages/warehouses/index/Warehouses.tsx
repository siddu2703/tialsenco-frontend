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
import { useTitle } from '$app/common/hooks/useTitle';
import { Page } from '$app/components/Breadcrumbs';
import { DataTable } from '$app/components/DataTable';
import { Default } from '$app/components/layouts/Default';
import { useActions, useColumns } from '../common/hooks';
import { permission } from '$app/common/guards/guards/permission';
import { useHasPermission } from '$app/common/hooks/permissions/useHasPermission';

export default function Warehouses() {
  useTitle('warehouses');

  const [t] = useTranslation();

  const hasPermission = useHasPermission();

  const pages: Page[] = [{ name: t('warehouses'), href: '/warehouses' }];

  const columns = useColumns();

  const actions = useActions();

  return (
    <Default title={t('warehouses')} breadcrumbs={pages}>
      <DataTable
        resource="warehouse"
        columns={columns}
        endpoint="/api/v1/warehouses?sort=id|desc"
        linkToCreate="/warehouses/create"
        linkToEdit="/warehouses/:id/edit"
        withResourcefulActions
        customActions={actions}
        linkToCreateGuards={[permission('create_product')]}
        hideEditableOptions={!hasPermission('edit_product')}
      />
    </Default>
  );
}
