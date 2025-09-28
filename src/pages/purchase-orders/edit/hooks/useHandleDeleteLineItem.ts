/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { PurchaseOrder } from '$app/common/interfaces/purchase-order';
import { cloneDeep } from 'lodash';

export function useHandleDeleteLineItem(
  setPurchaseOrder: (po: PurchaseOrder) => unknown
) {
  return async (purchaseOrder: PurchaseOrder, index: number) => {
    const po = cloneDeep(purchaseOrder);

    po.line_items.splice(index, 1);

    setPurchaseOrder(po);
  };
}
