/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

export interface ApiToken {
  id: string;
  name: string;
  token: string;
  user_id: string;
  is_system: boolean;
  archived_at: number;
  created_at: number;
  is_deleted: boolean;
  updated_at: number;
}
