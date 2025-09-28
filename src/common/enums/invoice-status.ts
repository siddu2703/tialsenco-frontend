/**
 * Tilsenco (https://tilsenco.com).
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

export const enum InvoiceStatus {
  Viewed = '-3',
  Unpaid = '-2',
  PastDue = '-1',
  Draft = '1',
  Sent = '2',
  Partial = '3',
  Paid = '4',
  Cancelled = '5',
  Reversed = '6',
}
