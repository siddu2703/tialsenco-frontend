/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { request } from '$app/common/helpers/request';
import { toast } from '$app/common/helpers/toast/toast';
import {
  MailerResource,
  MailerResourceType,
} from '$app/pages/invoices/email/components/Mailer';
import { useQueryClient } from 'react-query';
import { useGenerateEInvoiceUrl } from './useGenerateEInvoiceUrl';

interface Props {
  resource: MailerResourceType;
  downloadType?:
    | 'download_e_quote'
    | 'download_e_credit'
    | 'download_e_purchase_order';
}

export function useDownloadEInvoice(props: Props) {
  const queryClient = useQueryClient();
  const url = useGenerateEInvoiceUrl({
    resourceType: props.resource,
    downloadType: props.downloadType,
  });

  return (resource: MailerResource) => {
    const downloadableUrl = url(resource);

    if (downloadableUrl) {
      toast.processing();

      queryClient.fetchQuery(downloadableUrl, () =>
        request(
          'GET',
          downloadableUrl,
          {},
          { responseType: 'arraybuffer' }
        ).then((response) => {
          const blob = new Blob([response.data], { type: 'application/xml' });
          const url = URL.createObjectURL(blob);

          const [, filename] =
            response.headers['content-disposition'].split('filename=');

          const link = document.createElement('a');

          link.download = filename;
          link.href = url;
          link.target = '_blank';

          document.body.appendChild(link);

          link.click();

          document.body.removeChild(link);

          toast.dismiss();
        })
      );
    }
  };
}
