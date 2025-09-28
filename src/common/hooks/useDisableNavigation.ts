/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { Client } from '../interfaces/client';
import { Credit } from '../interfaces/credit';
import { Expense } from '../interfaces/expense';
import { Invoice } from '../interfaces/invoice';
import { Payment } from '../interfaces/payment';
import { Product } from '../interfaces/product';
import { Project } from '../interfaces/project';
import { PurchaseOrder } from '../interfaces/purchase-order';
import { Quote } from '../interfaces/quote';
import { RecurringExpense } from '../interfaces/recurring-expense';
import { RecurringInvoice } from '../interfaces/recurring-invoice';
import { Task } from '../interfaces/task';
import { Transaction } from '../interfaces/transactions';
import { Vendor } from '../interfaces/vendor';
import { useHasPermission } from './permissions/useHasPermission';
import { useEntityAssigned } from './useEntityAssigned';

type Entity =
  | 'client'
  | 'recurring_invoice'
  | 'payment'
  | 'invoice'
  | 'quote'
  | 'product'
  | 'credit'
  | 'project'
  | 'task'
  | 'expense'
  | 'vendor'
  | 'recurring_expense'
  | 'bank_transaction'
  | 'purchase_order';

type Resource =
  | Client
  | RecurringInvoice
  | Payment
  | Invoice
  | Quote
  | Product
  | Credit
  | Project
  | Task
  | Expense
  | Vendor
  | RecurringExpense
  | Transaction
  | PurchaseOrder;

export function useDisableNavigation() {
  const hasPermission = useHasPermission();
  const entityAssigned = useEntityAssigned();

  return (entity: Entity, resource: Resource | undefined | null) => {
    return (
      !hasPermission(`view_${entity}`) &&
      !hasPermission(`edit_${entity}`) &&
      !entityAssigned(resource)
    );
  };
}
