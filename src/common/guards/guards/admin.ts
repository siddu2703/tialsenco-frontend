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

export function admin(): Guard {
  return ({ companyUser }) => Promise.resolve(Boolean(companyUser?.is_admin));
}

export function owner(): Guard {
  return ({ companyUser }) => Promise.resolve(Boolean(companyUser?.is_owner));
}
