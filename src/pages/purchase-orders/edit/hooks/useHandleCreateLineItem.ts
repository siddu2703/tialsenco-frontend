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
import { blankLineItem } from '$app/common/constants/blank-line-item';
import { cloneDeep } from 'lodash';

export function useHandleCreateLineItem(
  setPurchaseOrder: (purchaseOrder: PurchaseOrder) => unknown
) {
  return async (purchaseOrder: PurchaseOrder) => {
    const po = cloneDeep(purchaseOrder) as PurchaseOrder;

    po.line_items.push({ ...blankLineItem(), quantity: 1 });

    setPurchaseOrder(po);
  };
}
