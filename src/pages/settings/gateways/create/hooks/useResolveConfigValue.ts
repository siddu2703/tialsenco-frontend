/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { CompanyGateway } from '$app/common/interfaces/company-gateway';

export function useResolveConfigValue(companyGateway: CompanyGateway) {
  const config = JSON.parse(companyGateway.config);

  return (field: string) => {
    return config[field] || '';
  };
}
