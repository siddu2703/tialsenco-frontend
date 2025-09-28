/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

export interface Document {
  id: string;
  archived_at: number;
  assigned_user_id: string;
  created_at: number;
  disk: string;
  hash: string;
  height: number;
  width: number;
  is_default: boolean;
  is_deleted: boolean;
  is_public: boolean;
  name: string;
  preview: string;
  project_id: string;
  size: number;
  type: string;
  updated_at: number;
  url: string;
  user_id: string;
  vendor_id: string;
}
