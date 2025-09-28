/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { useCurrentSettingsLevel } from '$app/common/hooks/useCurrentSettingsLevel';
import { GatewaysTable } from '../common/components/GatewaysTable';

export const STRIPE_CONNECT = 'd14dd26a47cecc30fdd65700bfb67b34';
export function Gateways() {
  const { isGroupSettingsActive, isClientSettingsActive } =
    useCurrentSettingsLevel();

  return (
    <GatewaysTable
      includeRemoveAction={isGroupSettingsActive || isClientSettingsActive}
      includeResetAction={isGroupSettingsActive || isClientSettingsActive}
    />
  );
}
