/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { VendorContact } from './vendor-contact';

export interface Vendor {
  id: string;
  user_id: string;
  assigned_user_id: string;
  name: string;
  website: string;
  private_notes: string;
  public_notes: string;
  last_login: number;
  address1: string;
  address2: string;
  phone: string;
  city: string;
  state: string;
  postal_code: string;
  country_id: string;
  currency_id: string;
  custom_value1: string;
  custom_value2: string;
  custom_value3: string;
  custom_value4: string;
  is_deleted: boolean;
  gst_number: string;
  id_number: string;
  updated_at: number;
  archived_at: number;
  created_at: number;
  number: string;
  contacts: VendorContact[];
  documents: any[];
  language_id: string;
  classification: string;
  routing_id: string;
  is_tax_exempt: boolean;
}
