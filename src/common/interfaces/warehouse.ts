/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

export interface Warehouse {
  id?: string;
  company_id?: string;
  name: string;
  code: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  phone?: string;
  email?: string;
  manager_user_id?: string;
  is_active: boolean;
  storage_capacity?: number;
  notes?: string;
  manager?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  stock_summary?: {
    total_products: number;
    total_quantity: number;
    available_quantity: number;
    reserved_quantity: number;
  };
  created_at?: string;
  updated_at?: string;
}
