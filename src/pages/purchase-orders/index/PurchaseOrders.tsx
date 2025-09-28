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
import { DataTableColumnsPicker } from '$app/components/DataTableColumnsPicker';
import { Default } from '$app/components/layouts/Default';
import { useTranslation } from 'react-i18next';
import {
  defaultColumns,
  useActions,
  useAllPurchaseOrderColumns,
  usePurchaseOrderColumns,
  usePurchaseOrderFilters,
} from '../common/hooks';
import { permission } from '$app/common/guards/guards/permission';
import { useCustomBulkActions } from '../common/hooks/useCustomBulkActions';
import { useHasPermission } from '$app/common/hooks/permissions/useHasPermission';
import {
  ChangeTemplateModal,
  useChangeTemplate,
} from '$app/pages/settings/invoice-design/pages/custom-designs/components/ChangeTemplate';
import { PurchaseOrder } from '$app/common/interfaces/purchase-order';
import { useDateRangeColumns } from '../common/hooks/useDateRangeColumns';
import { InputLabel } from '$app/components/forms';

export default function PurchaseOrders() {
  const { documentTitle } = useTitle('purchase_orders');

  const [t] = useTranslation();

  const hasPermission = useHasPermission();

  const pages: Page[] = [
    { name: t('purchase_orders'), href: '/purchase_orders' },
  ];

  const actions = useActions();
  const filters = usePurchaseOrderFilters();
  const columns = usePurchaseOrderColumns();
  const dateRangeColumns = useDateRangeColumns();
  const customBulkActions = useCustomBulkActions();
  const purchaseOrderColumns = useAllPurchaseOrderColumns();

  const {
    changeTemplateVisible,
    setChangeTemplateVisible,
    changeTemplateResources,
  } = useChangeTemplate();

  return (
    <Default title={documentTitle} breadcrumbs={pages}>
      <DataTable
        resource="purchase_order"
        endpoint="/api/v1/purchase_orders?include=vendor,expense&without_deleted_vendors=true&sort=id|desc"
        bulkRoute="/api/v1/purchase_orders/bulk"
        linkToCreate="/purchase_orders/create"
        linkToEdit="/purchase_orders/:id/edit"
        columns={columns}
        customActions={actions}
        customBulkActions={customBulkActions}
        customFilters={filters}
        customFilterPlaceholder="status"
        withResourcefulActions
        rightSide={
          <DataTableColumnsPicker
            columns={purchaseOrderColumns as unknown as string[]}
            defaultColumns={defaultColumns}
            table="purchaseOrder"
          />
        }
        dateRangeColumns={dateRangeColumns}
        linkToCreateGuards={[permission('create_purchase_order')]}
        hideEditableOptions={!hasPermission('edit_purchase_order')}
        enableSavingFilterPreference
      />

      <ChangeTemplateModal<PurchaseOrder>
        entity="purchase_order"
        entities={changeTemplateResources as PurchaseOrder[]}
        visible={changeTemplateVisible}
        setVisible={setChangeTemplateVisible}
        labelFn={(purchase_order) => (
          <div className="flex flex-col space-y-1">
            <InputLabel>{t('number')}</InputLabel>

            <span>{purchase_order.number}</span>
          </div>
        )}
        bulkLabelFn={(purchase_order) => (
          <div className="flex space-x-2">
            <InputLabel>{t('number')}:</InputLabel>

            <span>{purchase_order.number}</span>
          </div>
        )}
        bulkUrl="/api/v1/purchase_orders/bulk"
      />
    </Default>
  );
}
