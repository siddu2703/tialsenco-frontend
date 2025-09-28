/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */
export interface ClientContact {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  created_at: number;
  updated_at: number;
  archived_at: number;
  is_primary: boolean;
  is_locked: boolean;
  phone: string;
  custom_value1: string;
  custom_value2: string;
  custom_value3: string;
  custom_value4: string;
  contact_key: string;
  send_email: boolean;
  last_login: number;
  password: string;
  link: string;
}
