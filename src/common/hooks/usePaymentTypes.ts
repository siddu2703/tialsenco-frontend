/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { useTranslation } from 'react-i18next';
import paymentType from '$app/common/constants/payment-type';

export function usePaymentTypes() {
  const [t] = useTranslation();

  let translatedPaymentTypeList: Record<string, string> = {};

  translatedPaymentTypeList = Object.entries(paymentType).reduce(
    (translatedTypes, [key, value]) => {
      translatedTypes[key as keyof typeof translatedTypes] = t(value);
      return translatedTypes;
    },
    {}
  );

  const paymentTypeKeyValueArray = Object.entries(translatedPaymentTypeList);

  return paymentTypeKeyValueArray.sort((a, b) => a[1].localeCompare(b[1]));
}
