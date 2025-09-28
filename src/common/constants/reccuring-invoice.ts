/**
 * Tilsenco (https://tilsenco.com).
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { RecurringInvoiceStatus } from '$app/common/enums/recurring-invoice-status';

export default {
  [RecurringInvoiceStatus.ACTIVE]: 'active',
  [RecurringInvoiceStatus.COMPLETED]: 'completed',
  [RecurringInvoiceStatus.DRAFT]: 'draft',
  [RecurringInvoiceStatus.PAUSED]: 'paused',
  [RecurringInvoiceStatus.PENDING]: 'pending',
};
