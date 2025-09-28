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
import { useHasPermission } from '$app/common/hooks/permissions/useHasPermission';
import { useOutletContext, useParams } from 'react-router-dom';
import {
  defaultColumns,
  useAllDocumentColumns,
  useDocumentColumns,
} from '../hooks/useDocumentColumns';
import { DataTable } from '$app/components/DataTable';
import { useDocumentFilters } from '../hooks/useDocumentFilters';
import { useDocumentActions } from '../hooks/useDocumentActions';
import { DataTableColumnsPicker } from '$app/components/DataTableColumnsPicker';
import { useDocumentCustomBulkActions } from '../hooks/useDocumentCustomBulkActions';

export interface Document {
  archived_at: number;
  assigned_user_id: string;
  created_at: number;
  disk: string;
  hash: string;
  height: number;
  id: string;
  is_default: boolean;
  is_deleted: boolean;
  is_public: boolean;
  name: string;
  preview: string;
  project_id: string;
  size: number;
  type: string;
  updated_at: number;
  url: string;
  user_id: string;
  vendor_id: string;
  width: number;
  link: string;
}

export interface Context {
  isPurgeOrMergeActionCalled: boolean;
  displayName: string;
}
export default function Documents() {
  const { id } = useParams();

  const context: Context = useOutletContext();

  const { isPurgeOrMergeActionCalled } = context;

  const hasPermission = useHasPermission();

  const filters = useDocumentFilters();
  const columns = useDocumentColumns();
  const actions = useDocumentActions();
  const documentColumns = useAllDocumentColumns();
  const customBulkActions = useDocumentCustomBulkActions();

  return (
    <>
      <DataTable
        resource="document"
        methodType="POST"
        queryIdentificator="/api/v1/documents"
        endpoint={route('/api/v1/clients/:id/documents', { id })}
        columns={columns}
        customFilters={filters}
        customActions={actions}
        customBulkActions={customBulkActions}
        customFilterPlaceholder="type"
        withResourcefulActions
        rightSide={
          <DataTableColumnsPicker
            table="clientDocument"
            columns={documentColumns as unknown as string[]}
            defaultColumns={defaultColumns}
          />
        }
        showEdit={() => false}
        showRestore={() => false}
        showArchive={() => false}
        showDelete={() => false}
        disableQuery={isPurgeOrMergeActionCalled}
        withoutDefaultBulkActions
        withoutStatusFilter
        hideEditableOptions={!hasPermission('edit_expense')}
      />
    </>
  );
}
