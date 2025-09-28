/**
 * Tilsenco (https://tilsenco.com).
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

export const enum PaymentStatus {
  PartiallyUnapplied = '-2',
  Unapplied = '-1',
  Pending = '1',
  Cancelled = '2',
  Failed = '3',
  Completed = '4',
  PartiallyRefunded = '5',
  Refunded = '6',
}
