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
import { request } from '$app/common/helpers/request';
import { toast } from '$app/common/helpers/toast/toast';
import { useQueryClient } from 'react-query';

interface Props {
  entity: 'invoice' | 'quote' | 'credit' | 'purchase_order';
}

export function useDownloadPdfs({ entity }: Props) {
  const queryClient = useQueryClient();

  return (resourceIds: string[]) => {
    if (!resourceIds.length) {
      return;
    }

    toast.processing();

    queryClient.fetchQuery([`/api/v1/${entity}s/bulk`], () =>
      request('POST', endpoint(`/api/v1/${entity}s/bulk`), {
        action: 'bulk_download',
        ids: resourceIds,
      }).then(() => toast.success('downloaded_entities'))
    );
  };
}
