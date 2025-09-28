/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { Rule } from '$app/common/interfaces/transaction-rules';

export const defaultRule: Rule = {
  search_key: 'description',
  operator: 'contains',
  value: '',
};
