/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { endpoint } from '$app/common/helpers';
import { DocumentsTable } from '$app/components/DocumentsTable';
import { Upload } from '$app/pages/settings/company/documents/components';
import { useOutletContext } from 'react-router-dom';
import { Context } from '../edit/Edit';
import { $refetch } from '$app/common/hooks/useRefetch';
import { useHasPermission } from '$app/common/hooks/permissions/useHasPermission';
import { useEntityAssigned } from '$app/common/hooks/useEntityAssigned';
import { Card } from '$app/components/cards';
import { useTranslation } from 'react-i18next';

export default function Documents() {
  const [t] = useTranslation();

  const context: Context = useOutletContext();
  const { task } = context;

  const hasPermission = useHasPermission();
  const entityAssigned = useEntityAssigned();

  const invalidateCache = () => {
    $refetch(['tasks']);
  };

  return (
    <Card title={t('documents')}>
      <div className="flex flex-col items-center w-full px-6 py-2">
        <div className="w-full lg:w-2/3">
          <Upload
            widgetOnly
            endpoint={endpoint('/api/v1/tasks/:id/upload', { id: task?.id })}
            onSuccess={invalidateCache}
            disableUpload={!hasPermission('edit_task') && !entityAssigned(task)}
          />
        </div>

        <div className="w-full lg:w-2/3">
          <DocumentsTable
            documents={task?.documents || []}
            onDocumentDelete={invalidateCache}
            disableEditableOptions={
              !entityAssigned(task, true) && !hasPermission('edit_task')
            }
          />
        </div>
      </div>
    </Card>
  );
}
