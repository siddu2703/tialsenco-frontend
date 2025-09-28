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
import { MdDelete, MdEdit, MdVisibility } from 'react-icons/md';
import {
  StockMovement,
  MOVEMENT_TYPES,
} from '$app/common/interfaces/stock-movement';
import { DataTableColumnsExtended } from '$app/pages/invoices/common/hooks/useInvoiceColumns';
import { route } from '$app/common/helpers/route';
import { useNavigate } from 'react-router-dom';
import { toast } from '$app/common/helpers/toast/toast';
import { useDeleteStockMovement } from '$app/common/queries/stock-movements';
import { formatDateFromString } from '$app/common/helpers/dates';

export function useColumns() {
  const { t } = useTranslation();

  const columns: DataTableColumnsExtended<StockMovement> = [
    {
      id: 'movement_type',
      label: t('type'),
      format: (value, movement) => (
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${
            movement.movement_type === 'IN'
              ? 'bg-green-100 text-green-800'
              : movement.movement_type === 'OUT'
              ? 'bg-red-100 text-red-800'
              : movement.movement_type === 'TRANSFER'
              ? 'bg-blue-100 text-blue-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}
        >
          {MOVEMENT_TYPES[movement.movement_type] || movement.movement_type}
        </span>
      ),
    },
    {
      id: 'product',
      label: t('product'),
      format: (value, movement) => (
        <div className="flex flex-col">
          <span className="font-medium">{movement.product?.product_key}</span>
          <span className="text-sm text-gray-500">
            {[
              movement.product?.tile_type,
              movement.product?.tile_size,
              movement.product?.tile_color,
            ]
              .filter(Boolean)
              .join(' • ')}
          </span>
        </div>
      ),
    },
    {
      id: 'warehouse',
      label: t('warehouse'),
      format: (value, movement) => (
        <div className="flex flex-col">
          <span className="font-medium">{movement.warehouse?.name}</span>
          <span className="text-sm text-gray-500">
            {movement.warehouse?.code}
          </span>
        </div>
      ),
    },
    {
      id: 'quantity',
      label: t('quantity'),
      format: (value, movement) => (
        <span
          className={`font-medium ${
            movement.movement_type === 'OUT' ? 'text-red-600' : 'text-green-600'
          }`}
        >
          {movement.movement_type === 'OUT' ? '-' : '+'}
          {movement.quantity}
        </span>
      ),
    },
    {
      id: 'batch_number',
      label: t('batch'),
      format: (value, movement) => movement.batch_number || '-',
    },
    {
      id: 'unit_cost',
      label: t('unit_cost'),
      format: (value, movement) => movement.unit_cost?.toFixed(2) || '-',
    },
    {
      id: 'created_by',
      label: t('created_by'),
      format: (value, movement) =>
        movement.createdBy
          ? `${movement.createdBy.first_name} ${movement.createdBy.last_name}`
          : '-',
    },
    {
      id: 'created_at',
      label: t('date'),
      format: (value, movement) =>
        formatDateFromString(movement.created_at || ''),
    },
  ];

  return columns;
}

export function useActions() {
  const [t] = useTranslation();
  const navigate = useNavigate();

  const deleteStockMovement = useDeleteStockMovement();

  return [
    (movement: StockMovement) => (
      <DropdownElement
        onClick={() =>
          navigate(route('/stock-movements/:id', { id: movement.id }))
        }
        icon={<Icon element={MdVisibility} />}
      >
        {t('view')}
      </DropdownElement>
    ),
    (movement: StockMovement) => (
      <DropdownElement
        onClick={() =>
          navigate(route('/stock-movements/:id/edit', { id: movement.id }))
        }
        icon={<Icon element={MdEdit} />}
      >
        {t('edit')}
      </DropdownElement>
    ),
    (movement: StockMovement) => (
      <DropdownElement
        onClick={() => {
          if (window.confirm(t('are_you_sure'))) {
            deleteStockMovement.mutate(movement.id!, {
              onSuccess: () => toast.success(t('deleted_stock_movement')),
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
