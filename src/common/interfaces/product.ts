import { Company } from './company.interface';

/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */
export interface Product {
  id: string;
  user_id: string;
  assigned_user_id: string;
  product_key: string;
  notes: string;
  cost: number;
  price: number;
  quantity: number;
  max_quantity: number;
  tax_id: string;
  product_image: string;
  tax_name1: string;
  tax_rate1: number;
  tax_name2: string;
  tax_rate2: number;
  tax_name3: string;
  tax_rate3: number;
  created_at: number;
  updated_at: number;
  archived_at: number;
  custom_value1: string;
  custom_value2: string;
  custom_value3: string;
  custom_value4: string;
  is_deleted: boolean;
  in_stock_quantity: number;
  stock_notification: boolean;
  stock_notification_threshold: number;
  documents: any[];
  company?: Company;

  // Tile-specific fields
  tile_type?: string;
  tile_size?: string;
  tile_color?: string;
  tile_finish?: string;
  tile_pattern?: string;
  batch_number?: string;
  manufacturing_date?: string;
  brand?: string;
  collection?: string;
  material?: string;
  thickness?: number;
  weight_per_piece?: number;
  pieces_per_box?: number;
  area_per_box?: number;
  hsn_code?: string;
  gst_rate?: number;
}
