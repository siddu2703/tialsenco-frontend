/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { TaxRate } from '$app/common/interfaces/tax-rate';
import { ValidationBag } from '$app/common/interfaces/validation-bag';
import { Dispatch, SetStateAction } from 'react';

interface Params {
  setTaxRate: Dispatch<SetStateAction<TaxRate | undefined>>;
  setErrors: Dispatch<SetStateAction<ValidationBag | undefined>>;
}

export function useHandleChange(params: Params) {
  const { setTaxRate, setErrors } = params;

  return <T extends keyof TaxRate>(
    property: T,
    value: TaxRate[typeof property]
  ) => {
    setErrors(undefined);

    setTaxRate(
      (currentTaxRate) =>
        currentTaxRate && { ...currentTaxRate, [property]: value }
    );
  };
}
