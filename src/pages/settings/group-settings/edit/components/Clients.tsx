/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { route } from '$app/common/helpers/route';
import { DataTable } from '$app/components/DataTable';
import { useActions } from '$app/pages/clients/common/hooks/useActions';
import { useClientColumns } from '$app/pages/clients/common/hooks/useClientColumns';
import { useCustomBulkActions } from '$app/pages/clients/common/hooks/useCustomBulkActions';
import { useParams } from 'react-router-dom';

export function Clients() {
  const { id } = useParams();

  const actions = useActions();
  const columns = useClientColumns();
  const customBulkActions = useCustomBulkActions();

  return (
    <div className="px-4 sm:px-6 pt-3">
      <DataTable
        resource="client"
        endpoint={route(
          '/api/v1/clients?include=group_settings&group=:groupId&sort=id|desc',
          {
            groupId: id,
          }
        )}
        bulkRoute="/api/v1/clients/bulk"
        linkToEdit="/clients/:id/edit"
        columns={columns}
        customActions={actions}
        bottomActionsKeys={['purge']}
        customBulkActions={customBulkActions}
        withResourcefulActions
        linkToCreate={route('/clients/create?group=:groupId', {
          groupId: id,
        })}
      />
    </div>
  );
}
