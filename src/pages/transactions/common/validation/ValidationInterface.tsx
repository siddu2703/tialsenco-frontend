/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

export interface TransactionValidation {
  base_type: string;
  date: string;
  amount: string;
  currency_id: string;
  bank_integration_id: string;
  description: string;
}
