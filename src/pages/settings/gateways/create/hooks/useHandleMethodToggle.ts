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

export const blankFeesAndLimitsRecord = {
  adjust_fee_percent: false,
  fee_amount: 0,
  fee_cap: 0,
  fee_percent: 0,
  fee_tax_name1: '',
  fee_tax_name2: '',
  fee_tax_name3: '',
  fee_tax_rate1: 0,
  fee_tax_rate2: 0,
  fee_tax_rate3: 0,
  is_enabled: true,
  max_limit: -1,
  min_limit: -1,
};

export function useHandleMethodToggle(
  companyGateway: CompanyGateway,
  setCompanyGateway: React.Dispatch<
    React.SetStateAction<CompanyGateway | undefined>
  >
) {
  return (gatewayTypeId: string, value: boolean) => {
    if ((<any>Object).hasOwn(companyGateway.fees_and_limits, gatewayTypeId)) {
      return setCompanyGateway(
        (current) =>
          current && {
            ...current,
            fees_and_limits: {
              ...current.fees_and_limits,
              [gatewayTypeId]: {
                ...current.fees_and_limits[gatewayTypeId],
                is_enabled: value,
              },
            },
          }
      );
    }

    setCompanyGateway(
      (current) =>
        current && {
          ...current,
          fees_and_limits: {
            ...current.fees_and_limits,
            [gatewayTypeId]: blankFeesAndLimitsRecord,
          },
        }
    );
  };
}
