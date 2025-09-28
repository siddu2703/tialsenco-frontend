/**
 * Tilsenco (https://tilsenco.com).
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { CreditStatus } from '$app/common/enums/credit-status';

export default {
  [CreditStatus.Draft]: 'draft',
  [CreditStatus.Sent]: 'sent',
  [CreditStatus.Partial]: 'partial',
  [CreditStatus.Applied]: 'applied',
};
