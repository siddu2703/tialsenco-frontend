/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { InvoiceSum } from '$app/common/helpers/invoices/invoice-sum';
import { InvoiceSumInclusive } from '$app/common/helpers/invoices/invoice-sum-inclusive';
import { PurchaseOrder } from '$app/common/interfaces/purchase-order';
import { useResolveCurrency } from './useResolveCurrency';

export function useCalculateInvoiceSum(
  setInvoiceSum: (invoiceSum: InvoiceSum | InvoiceSumInclusive) => unknown
) {
  const resolveCurrency = useResolveCurrency();

  return async (purchaseOrder: PurchaseOrder) => {
    const currency = await resolveCurrency(purchaseOrder.vendor_id);

    const invoiceSum = purchaseOrder.uses_inclusive_taxes
      ? new InvoiceSumInclusive(purchaseOrder, currency!).build()
      : new InvoiceSum(purchaseOrder, currency!).build();

    setInvoiceSum(invoiceSum);

    return invoiceSum.invoice as PurchaseOrder;
  };
}
