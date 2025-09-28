/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

export interface GroupSettings {
  id: string;
  name: string;
  settings: Record<string, any>;
  created_at: number;
  updated_at: number;
  archived_at: number;
  is_deleted: boolean;
  documents: any[];
}
