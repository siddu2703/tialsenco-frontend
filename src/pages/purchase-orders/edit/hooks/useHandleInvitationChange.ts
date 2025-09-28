/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import {
  Invitation,
  PurchaseOrder,
} from '$app/common/interfaces/purchase-order';

type Handler = <T extends keyof PurchaseOrder>(
  property: T,
  value: PurchaseOrder[T]
) => void;

export function useHandleInvitationChange(handleChange: Handler) {
  return (purchaseOrder: PurchaseOrder, id: string, checked: boolean) => {
    let invitations = [...purchaseOrder!.invitations];

    const potential =
      invitations?.find((invitation) => invitation.vendor_contact_id === id) ||
      -1;

    if (potential !== -1 && checked === false) {
      invitations = invitations.filter((i) => i.vendor_contact_id !== id);
    }

    if (potential === -1) {
      const invitation: Partial<Invitation> = {
        vendor_contact_id: '',
        client_contact_id: '',
      };

      invitation.vendor_contact_id = id;

      invitations.push(invitation as Invitation);
    }

    handleChange('invitations', invitations);
  };
}
