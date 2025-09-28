/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { Guard } from '../Guard';

export type Plan = 'pro' | 'enterprise' | 'white_label';

export function plan(p: Plan): Guard {
  return ({ companyUser }) =>
    new Promise((resolve) => {
      return resolve(true);
    });
}
