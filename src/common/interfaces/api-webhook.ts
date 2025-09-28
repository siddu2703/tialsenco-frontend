/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

export interface ApiWebHookHeader {
  [key: string]: string;
}

export interface ApiWebhook {
  id: string;
  company_id: string;
  event_id: string;
  format: string;
  headers: ApiWebHookHeader;
  rest_method: string;
  target_url: string;
  user_id: string;
  created_at: number;
  is_deleted: boolean;
  updated_at: number;
  archived_at: number;
}
