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
import {
  MailerResource,
  MailerResourceType,
} from '$app/pages/invoices/email/components/Mailer';

interface Props {
  resourceType: MailerResourceType;
}

export function useGeneratePdfUrl(props: Props) {
  return (resource: MailerResource, deliveryNote?: boolean) => {
    if (resource.invitations.length === 0) {
      return;
    }

    if (deliveryNote) {
      return endpoint('/api/v1/:resource/:id/delivery_note', {
        resource: `${props.resourceType}s`,
        id: resource.id,
      });
    }

    if (
      resource.invitations.length > 0 &&
      props.resourceType === 'purchase_order'
    ) {
      return endpoint('/vendor/purchase_order/:invitation/download', {
        resource: props.resourceType,
        invitation: resource.invitations[0].key,
      });
    }

    if (resource.invitations.length > 0) {
      return endpoint('/client/:resource/:invitation/download_pdf', {
        resource: props.resourceType,
        invitation: resource.invitations[0].key,
      });
    }
  };
}
