/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import collect from 'collect.js';
import { Invoice } from '../interfaces/invoice';
import { useFormatMoney } from './money/useFormatMoney';
import { Client } from '../interfaces/client';
import { RecurringInvoice } from '../interfaces/recurring-invoice';
import { Payment } from '../interfaces/payment';
import { PurchaseOrder } from '../interfaces/purchase-order';
import { Expense } from '../interfaces/expense';
import { RecurringExpense } from '../interfaces/recurring-expense';
import { Transaction } from '../interfaces/transactions';
import { useReactSettings } from './useReactSettings';

type Resource =
  | Invoice
  | Client
  | RecurringInvoice
  | Payment
  | PurchaseOrder
  | Expense
  | RecurringExpense
  | Transaction;

interface Params {
  currencyPath?: string;
  countryPath?: string;
}
export function useSumTableColumn(params?: Params) {
  const formatMoney = useFormatMoney();

  const reactSettings = useReactSettings();

  const { currencyPath, countryPath } = params || {};

  return (values: number[] | undefined, resources: Resource[] | undefined) => {
    if (values && resources) {
      const result = values.reduce(
        (total, currentValue) => (total = total + currentValue),
        0
      );

      const countryIds = collect(resources)
        .pluck(countryPath || 'client.country_id')
        .unique()
        .toArray() as string[];

      const currencyIds = collect(resources)
        .pluck(currencyPath || 'client.settings.currency_id')
        .unique()
        .toArray() as string[];

      if (countryIds.length > 1 || currencyIds.length > 1) {
        return result;
      }

      return formatMoney(
        result,
        typeof countryIds[0] === 'string' ? countryIds[0] : undefined,
        typeof currencyIds[0] === 'string' ? currencyIds[0] : undefined,
        reactSettings?.number_precision || 2
      );
    }

    return '-/-';
  };
}
