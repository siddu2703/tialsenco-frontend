/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { enterprisePlan } from '$app/common/guards/guards/enterprise-plan';
import { proPlan } from '$app/common/guards/guards/pro-plan';
import { useAdmin } from '$app/common/hooks/permissions/useHasPermission';

export function useShouldDisableCustomFields() {
  const { isAdmin } = useAdmin();

  if ((proPlan() || enterprisePlan()) && isAdmin) {
    return false;
  }

  return true;
}
