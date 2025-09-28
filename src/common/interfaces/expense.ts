/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { EInvoiceType } from '$app/pages/settings';
import { Client } from './client';
import { ExpenseCategory } from './expense-category';
import { Invoice } from './invoice';
import { Project } from './project';
import { Vendor } from './vendor';

export interface Expense {
  id: string;
  user_id: string;
  assigned_user_id: string;
  vendor_id: string;
  invoice_id: string;
  client_id: string;
  bank_id: string;
  invoice_currency_id: string;
  expense_currency_id: string;
  currency_id: string;
  category_id: string;
  payment_type_id: string;
  recurring_expense_id: string;
  is_deleted: boolean;
  should_be_invoiced: boolean;
  invoice_documents: boolean;
  amount: number;
  foreign_amount: number;
  exchange_rate: number;
  tax_name1: string;
  tax_rate1: number;
  tax_name2: string;
  tax_rate2: number;
  tax_name3: string;
  tax_rate3: number;
  private_notes: string;
  public_notes: string;
  transaction_reference: string;
  transaction_id: string;
  date: string;
  number: string;
  payment_date: string;
  custom_value1: string;
  custom_value2: string;
  custom_value3: string;
  custom_value4: string;
  updated_at: number;
  archived_at: number;
  created_at: number;
  project_id: string;
  tax_amount1: number;
  tax_amount2: number;
  tax_amount3: number;
  uses_inclusive_taxes: boolean;
  calculate_tax_by_amount: boolean;
  entity_type: string;
  documents: any[];
  client?: Client;
  vendor?: Vendor;
  category?: ExpenseCategory;
  invoice?: Invoice;
  e_invoice?: EInvoiceType;
  project?: Project;
}
