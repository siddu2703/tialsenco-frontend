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
import { useCurrentCompany } from '$app/common/hooks/useCurrentCompany';
import { Table as DocumentsTable, Upload } from './components';
import { $refetch } from '$app/common/hooks/useRefetch';

export function Documents() {
  const onSuccess = () => {
    $refetch(['documents']);
  };

  const company = useCurrentCompany();

  return (
    <div className="px-6 pt-3">
      {company && (
        <Upload
          endpoint={endpoint('/api/v1/companies/:id/upload', {
            id: company.id,
          })}
          onSuccess={onSuccess}
          widgetOnly
        />
      )}
      <DocumentsTable />
    </div>
  );
}
