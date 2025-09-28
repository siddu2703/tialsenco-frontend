/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

export interface Params {
  perPage?: number | string;
  currentPage?: number | string;
  filter?: string;
  status?: string[];
  sort?: string;
  companyDocuments?: 'true' | 'false';
}
