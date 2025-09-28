/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { useCurrentCompany } from '$app/common/hooks/useCurrentCompany';
import { updateChanges } from '$app/common/stores/slices/company-users';
import { useDispatch } from 'react-redux';

export function useSetSurchageTaxValue() {
  const dispatch = useDispatch();
  const company = useCurrentCompany();

  return (index: number) => {
    switch (index) {
      case 0:
        dispatch(
          updateChanges({
            object: 'company',
            property: 'custom_surcharge_taxes1',
            value: !company?.custom_surcharge_taxes1,
          })
        );
        break;
      case 1:
        dispatch(
          updateChanges({
            object: 'company',
            property: 'custom_surcharge_taxes2',
            value: !company?.custom_surcharge_taxes2,
          })
        );
        break;
      case 2:
        dispatch(
          updateChanges({
            object: 'company',
            property: 'custom_surcharge_taxes3',
            value: !company?.custom_surcharge_taxes3,
          })
        );
        break;
      case 3:
        dispatch(
          updateChanges({
            object: 'company',
            property: 'custom_surcharge_taxes4',
            value: !company?.custom_surcharge_taxes4,
          })
        );
        break;
    }
  };
}
