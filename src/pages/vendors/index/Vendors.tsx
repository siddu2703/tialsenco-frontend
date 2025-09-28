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
  useAllVendorColumns,
  useVendorColumns,
} from '../common/hooks';
import { DataTableColumnsPicker } from '$app/components/DataTableColumnsPicker';
import { ImportButton } from '$app/components/import/ImportButton';
import { permission } from '$app/common/guards/guards/permission';
import { useCustomBulkActions } from '../common/hooks/useCustomBulkActions';
import { useHasPermission } from '$app/common/hooks/permissions/useHasPermission';
import { or } from '$app/common/guards/guards/or';
import { Guard } from '$app/common/guards/Guard';
import { useActions } from '../common/hooks/useActions';

export default function Vendors() {
  const { documentTitle } = useTitle('vendors');

  const [t] = useTranslation();

  const hasPermission = useHasPermission();

  const pages: Page[] = [{ name: t('vendors'), href: '/vendors' }];

  const actions = useActions();
  const columns = useVendorColumns();
  const vendorColumns = useAllVendorColumns();
  const customBulkActions = useCustomBulkActions();

  return (
    <Default title={documentTitle} breadcrumbs={pages}>
      <DataTable
        resource="vendor"
        columns={columns}
        endpoint="/api/v1/vendors?sort=id|desc"
        bulkRoute="/api/v1/vendors/bulk"
        linkToCreate="/vendors/create"
        linkToEdit="/vendors/:id/edit"
        withResourcefulActions
        customActions={actions}
        customBulkActions={customBulkActions}
        rightSide={
          <div className="flex items-center space-x-2">
            <DataTableColumnsPicker
              columns={vendorColumns as unknown as string[]}
              defaultColumns={defaultColumns}
              table="vendor"
            />

            <Guard
              type="component"
              guards={[
                or(permission('create_vendor'), permission('edit_vendor')),
              ]}
              component={<ImportButton route="/vendors/import" />}
            />
          </div>
        }
        linkToCreateGuards={[permission('create_vendor')]}
        hideEditableOptions={!hasPermission('edit_vendor')}
        enableSavingFilterPreference
      />
    </Default>
  );
}
