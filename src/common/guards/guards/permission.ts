/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { Permissions } from '$app/common/hooks/permissions/useHasPermission';
import { Guard } from '../Guard';

export function permission(permission: Permissions): Guard {
  const [action] = permission.split('_');

  return ({ companyUser }) => {
    const permissions = companyUser?.permissions ?? '';

    const value = Boolean(
      companyUser?.is_admin ||
        companyUser?.is_owner ||
        permissions.includes(permission) ||
        (permissions.includes(`${action}_all`) &&
          permission !== 'view_reports' &&
          permission !== 'view_dashboard')
    );

    return Promise.resolve(value);
  };
}
