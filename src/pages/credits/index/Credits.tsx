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
import { DataTable } from '$app/components/DataTable';
import { DataTableColumnsPicker } from '$app/components/DataTableColumnsPicker';
import { Default } from '$app/components/layouts/Default';
import { useTranslation } from 'react-i18next';
import {
  defaultColumns,
  useActions,
  useAllCreditColumns,
  useCreditColumns,
} from '../common/hooks';
import { permission } from '$app/common/guards/guards/permission';
import { useCustomBulkActions } from '../common/hooks/useCustomBulkActions';
import { useCreditsFilters } from '../common/hooks/useCreditsFilters';
import { useHasPermission } from '$app/common/hooks/permissions/useHasPermission';
import {
  ChangeTemplateModal,
  useChangeTemplate,
} from '$app/pages/settings/invoice-design/pages/custom-designs/components/ChangeTemplate';
import { Credit } from '$app/common/interfaces/credit';
import { useDateRangeColumns } from '../common/hooks/useDateRangeColumns';
import { useSocketEvent } from '$app/common/queries/sockets';
import { $refetch } from '$app/common/hooks/useRefetch';
import { InputLabel } from '$app/components/forms';

export default function Credits() {
  useTitle('credits');

  const [t] = useTranslation();
  const hasPermission = useHasPermission();

  const pages = [{ name: t('credits'), href: '/credits' }];

  const actions = useActions();
  const columns = useCreditColumns();
  const filters = useCreditsFilters();
  const creditColumns = useAllCreditColumns();
  const dateRangeColumns = useDateRangeColumns();
  const customBulkActions = useCustomBulkActions();

  const {
    changeTemplateVisible,
    setChangeTemplateVisible,
    changeTemplateResources,
  } = useChangeTemplate();

  useSocketEvent({
    on: [
      'App\\Events\\Credit\\CreditWasCreated',
      'App\\Events\\Credit\\CreditWasUpdated',
    ],
    callback: () => $refetch(['credits']),
  });

  return (
    <Default title={t('credits')} breadcrumbs={pages} docsLink="en/credits/">
      <DataTable
        resource="credit"
        endpoint="/api/v1/credits?include=client&without_deleted_clients=true&sort=id|desc"
        bulkRoute="/api/v1/credits/bulk"
        columns={columns}
        linkToCreate="/credits/create"
        linkToEdit="/credits/:id/edit"
        customActions={actions}
        customBulkActions={customBulkActions}
        customFilters={filters}
        customFilterPlaceholder="status"
        withResourcefulActions
        rightSide={
          <DataTableColumnsPicker
            columns={creditColumns as unknown as string[]}
            defaultColumns={defaultColumns}
            table="credit"
          />
        }
        dateRangeColumns={dateRangeColumns}
        linkToCreateGuards={[permission('create_credit')]}
        hideEditableOptions={!hasPermission('edit_credit')}
        enableSavingFilterPreference
      />

      <ChangeTemplateModal<Credit>
        entity="credit"
        entities={changeTemplateResources as Credit[]}
        visible={changeTemplateVisible}
        setVisible={setChangeTemplateVisible}
        labelFn={(credit) => (
          <div className="flex flex-col space-y-1">
            <InputLabel>{t('number')}</InputLabel>

            <span>{credit.number}</span>
          </div>
        )}
        bulkLabelFn={(credit) => (
          <div className="flex space-x-2">
            <InputLabel>{t('number')}:</InputLabel>

            <span>{credit.number}</span>
          </div>
        )}
        bulkUrl="/api/v1/credits/bulk"
      />
    </Default>
  );
}
