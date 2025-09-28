/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { ActivityRecordBase } from './activity-record';

export interface InvoiceActivity {
  user: Client;
  invoice: Client;
  contact: Client;
  client: Client;
  activity_type_id: number;
  id: string;
  hashed_id: string;
  notes: string;
  created_at: number;
  ip: string;
  recurring_invoice?: Client;
  payment?: Client;
  credit?: Client;
  payment_amount?: ActivityRecordBase;
}

export interface Client {
  label: string;
  hashed_id: string;
}
