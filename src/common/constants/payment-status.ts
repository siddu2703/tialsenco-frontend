/**
 * Tilsenco (https://tilsenco.com).
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { PaymentStatus } from '$app/common/enums/payment-status';

export default {
  [PaymentStatus.PartiallyUnapplied]: 'partially_unapplied',
  [PaymentStatus.Unapplied]: 'unapplied',
  [PaymentStatus.Pending]: 'pending',
  [PaymentStatus.Cancelled]: 'cancelled',
  [PaymentStatus.Failed]: 'failed',
  [PaymentStatus.Completed]: 'completed',
  [PaymentStatus.PartiallyRefunded]: 'partially_refunded',
  [PaymentStatus.Refunded]: 'refunded',
};
