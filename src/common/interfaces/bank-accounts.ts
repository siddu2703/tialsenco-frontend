/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

export interface BankAccount {
  id: string;
  archived_at: number;
  auto_sync: boolean;
  balance: number;
  bank_account_id: number;
  bank_account_name: string;
  bank_account_number: string;
  bank_account_status: string;
  bank_account_type: string;
  created_at: number;
  currency: string;
  disabled_upstream: boolean;
  from_date: string;
  is_deleted: boolean;
  nickname: string;
  provider_id: number;
  provider_name: string;
  updated_at: number;
  integration_type: string;
  nordigen_institution_id: string;
}
