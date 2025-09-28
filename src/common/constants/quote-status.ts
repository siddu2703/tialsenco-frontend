/**
 * Tilsenco (https://tilsenco.com).
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { QuoteStatus } from '$app/common/enums/quote-status';

export default {
  [QuoteStatus.Draft]: 'draft',
  [QuoteStatus.Sent]: 'sent',
  [QuoteStatus.Approved]: 'approved',
  [QuoteStatus.Converted]: 'converted',
  [QuoteStatus.Expired]: 'expired',
};
