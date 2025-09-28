/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { RecurringExpenseStatus } from '$app/common/enums/recurring-expense-status';

export default {
  [RecurringExpenseStatus.Active]: 'active',
  [RecurringExpenseStatus.Draft]: 'draft',
  [RecurringExpenseStatus.Paused]: 'paused',
  [RecurringExpenseStatus.Pending]: 'pending',
  [RecurringExpenseStatus.Completed]: 'completed',
};
