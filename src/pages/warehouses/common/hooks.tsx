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
import { DropdownElement } from '$app/components/dropdown/DropdownElement';
import { Icon } from '$app/components/icons/Icon';
import {
  MdArchive,
  MdDelete,
  MdEdit,
  MdRestore,
  MdWarehouse,
} from 'react-icons/md';
import { Warehouse } from '$app/common/interfaces/warehouse';
import { DataTableColumnsExtended } from '$app/pages/invoices/common/hooks/useInvoiceColumns';
import { useEntityCustomFields } from '$app/common/hooks/useEntityCustomFields';
import { EntityStatus } from '$app/components/EntityStatus';
import { route } from '$app/common/helpers/route';
import { useNavigate } from 'react-router-dom';
import { toast } from '$app/common/helpers/toast/toast';
import {
  useDeleteWarehouse,
  useRestoreWarehouse,
  useArchiveWarehouse,
} from '$app/common/queries/warehouses';

export function useColumns() {
  const { t } = useTranslation();
  const { dateFormat } = useEntityCustomFields();

  const columns: DataTableColumnsExtended<Warehouse> = [
    {
      id: 'name',
      label: t('name'),
      format: (value, warehouse) => (
        <div className="flex flex-col">
          <span className="font-medium">{warehouse.name}</span>
          <span className="text-sm text-gray-500">{warehouse.code}</span>
        </div>
      ),
    },
    {
      id: 'address',
      label: t('address'),
      format: (value, warehouse) => (
        <div className="flex flex-col">
          <span>{warehouse.address}</span>
          <span className="text-sm text-gray-500">
            {[warehouse.city, warehouse.state, warehouse.pincode]
              .filter(Boolean)
              .join(', ')}
          </span>
        </div>
      ),
    },
    {
      id: 'manager',
      label: t('manager'),
      format: (value, warehouse) =>
        warehouse.manager
          ? `${warehouse.manager.first_name} ${warehouse.manager.last_name}`
          : '',
    },
    {
      id: 'stock_summary',
      label: t('stock_summary'),
      format: (value, warehouse) => (
        <div className="flex flex-col">
          <span className="text-sm">
            {t('products')}: {warehouse.stock_summary?.total_products || 0}
          </span>
          <span className="text-sm">
            {t('available')}: {warehouse.stock_summary?.available_quantity || 0}
          </span>
        </div>
      ),
    },
    {
      id: 'is_active',
      label: t('status'),
      format: (value, warehouse) => <EntityStatus entity={warehouse} />,
    },
  ];

  return columns;
}

export function useActions() {
  const [t] = useTranslation();
  const navigate = useNavigate();

  const deleteWarehouse = useDeleteWarehouse();
  const restoreWarehouse = useRestoreWarehouse();
  const archiveWarehouse = useArchiveWarehouse();

  return [
    (warehouse: Warehouse) => (
      <DropdownElement
        onClick={() =>
          navigate(route('/warehouses/:id/edit', { id: warehouse.id }))
        }
        icon={<Icon element={MdEdit} />}
      >
        {t('edit')}
      </DropdownElement>
    ),
    (warehouse: Warehouse) => (
      <DropdownElement
        onClick={() =>
          navigate(route('/warehouses/:id/stock', { id: warehouse.id }))
        }
        icon={<Icon element={MdWarehouse} />}
      >
        {t('view_stock')}
      </DropdownElement>
    ),
    (warehouse: Warehouse) =>
      !warehouse.archived_at && (
        <DropdownElement
          onClick={() => {
            if (window.confirm(t('are_you_sure'))) {
              archiveWarehouse.mutate(warehouse.id!, {
                onSuccess: () => toast.success(t('archived_warehouse')),
              });
            }
          }}
          icon={<Icon element={MdArchive} />}
        >
          {t('archive')}
        </DropdownElement>
      ),
    (warehouse: Warehouse) =>
      warehouse.archived_at && (
        <DropdownElement
          onClick={() => {
            restoreWarehouse.mutate(warehouse.id!, {
              onSuccess: () => toast.success(t('restored_warehouse')),
            });
          }}
          icon={<Icon element={MdRestore} />}
        >
          {t('restore')}
        </DropdownElement>
      ),
    (warehouse: Warehouse) => (
      <DropdownElement
        onClick={() => {
          if (window.confirm(t('are_you_sure'))) {
            deleteWarehouse.mutate(warehouse.id!, {
              onSuccess: () => toast.success(t('deleted_warehouse')),
            });
          }
        }}
        icon={<Icon element={MdDelete} />}
      >
        {t('delete')}
      </DropdownElement>
    ),
  ];
}
