/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

export interface TaxRate {
  id: string;
  name: string;
  rate: number;
  is_deleted: boolean;
  archived_at: number;
  created_at: number;
  updated_at: number;
}
