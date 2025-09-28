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
import { Button } from '$app/components/forms';
import { useNavigate } from 'react-router-dom';

export default function StockMovements() {
  useTitle('stock_movements');

  const [t] = useTranslation();
  const navigate = useNavigate();

  const hasPermission = useHasPermission();

  const pages: Page[] = [
    { name: t('stock_movements'), href: '/stock-movements' },
  ];

  const columns = useColumns();
  const actions = useActions();

  return (
    <Default
      title={t('stock_movements')}
      breadcrumbs={pages}
      rightSide={
        <div className="flex items-center space-x-2">
          <Button
            type="primary"
            onClick={() => navigate('/stock-movements/create')}
          >
            {t('new_movement')}
          </Button>
        </div>
      }
    >
      <DataTable
        resource="stock_movement"
        columns={columns}
        endpoint="/api/v1/stock_movements?include=product,warehouse,createdBy&sort=id|desc"
        linkToCreate="/stock-movements/create"
        linkToEdit="/stock-movements/:id/edit"
        withResourcefulActions
        customActions={actions}
        linkToCreateGuards={[permission('create_product')]}
        hideEditableOptions={!hasPermission('edit_product')}
        enableSavingFilterPreference
      />
    </Default>
  );
}
