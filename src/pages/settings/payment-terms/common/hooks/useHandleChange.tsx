/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { PaymentTerm } from '$app/common/interfaces/payment-term';
import { ValidationBag } from '$app/common/interfaces/validation-bag';
import { Dispatch, SetStateAction } from 'react';

interface Params {
  setPaymentTerm: Dispatch<SetStateAction<PaymentTerm | undefined>>;
  setErrors: Dispatch<SetStateAction<ValidationBag | undefined>>;
}

export function useHandleChange(params: Params) {
  const { setPaymentTerm, setErrors } = params;

  return <T extends keyof PaymentTerm>(
    property: T,
    value: PaymentTerm[typeof property]
  ) => {
    setErrors(undefined);

    setPaymentTerm(
      (currentPaymentTerm) =>
        currentPaymentTerm && { ...currentPaymentTerm, [property]: value }
    );
  };
}
