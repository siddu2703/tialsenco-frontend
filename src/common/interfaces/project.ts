/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { Client } from './client';
import { Expense } from './expense';
import { Invoice } from './invoice';
import { Quote } from './quote';
import { Task } from './task';

export interface Project {
  id: string;
  user_id: string;
  assigned_user_id: string;
  client_id: string;
  name: string;
  number: string;
  created_at: number;
  updated_at: number;
  archived_at: number;
  is_deleted: boolean;
  task_rate: number;
  due_date: string;
  private_notes: string;
  public_notes: string;
  budgeted_hours: number;
  custom_value1: string;
  custom_value2: string;
  custom_value3: string;
  custom_value4: string;
  color: string;
  documents: any[];
  client?: Client;
  tasks?: Task[];
  invoices?: Invoice[];
  expenses?: Expense[];
  quotes?: Quote[];
  current_hours: number;
}
