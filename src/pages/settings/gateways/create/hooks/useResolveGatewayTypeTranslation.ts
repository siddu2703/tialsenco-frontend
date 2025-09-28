/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import gatewayType from '$app/common/constants/gateway-type';

export function useResolveGatewayTypeTranslation() {
  return (id: string) => {
    return gatewayType[id as keyof typeof gatewayType] || 'other';
  };
}
