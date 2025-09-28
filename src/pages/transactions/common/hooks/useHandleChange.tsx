/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { DecimalInputSeparators } from '$app/common/interfaces/decimal-number-input-separators';
import { Transaction } from '$app/common/interfaces/transactions';
import { ValidationBag } from '$app/common/interfaces/validation-bag';
import { Dispatch, SetStateAction } from 'react';
import { useResolveCurrencySeparator } from './useResolveCurrencySeparator';

interface Params {
  setErrors: Dispatch<SetStateAction<ValidationBag | undefined>>;
  setTransaction: Dispatch<SetStateAction<Transaction | undefined>>;
  setCurrencySeparators: Dispatch<
    SetStateAction<DecimalInputSeparators | undefined>
  >;
}

export function useHandleChange(params: Params) {
  const resolveCurrencySeparator = useResolveCurrencySeparator();

  const { setErrors, setCurrencySeparators, setTransaction } = params;

  return (
    property: keyof Transaction,
    value: Transaction[keyof Transaction]
  ) => {
    setErrors(undefined);

    if (property === 'currency_id') {
      const resolvedCurrencySeparator = resolveCurrencySeparator(
        value.toString()
      );

      if (resolvedCurrencySeparator) {
        setCurrencySeparators(resolvedCurrencySeparator);
      }
    }

    setTransaction(
      (transaction) => transaction && { ...transaction, [property]: value }
    );
  };
}
