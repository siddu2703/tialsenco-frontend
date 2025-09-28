/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

export interface StockMovement {
  id?: string;
  company_id?: string;
  product_id: string;
  warehouse_id: string;
  movement_type: 'IN' | 'OUT' | 'TRANSFER' | 'ADJUSTMENT';
  quantity: number;
  reference_type?: string;
  reference_id?: string;
  batch_number?: string;
  unit_cost?: number;
  notes?: string;
  created_by?: string;
  destination_warehouse_id?: string; // For transfers
  product?: {
    id: string;
    product_key: string;
    notes: string;
    tile_type?: string;
    tile_size?: string;
    tile_color?: string;
  };
  warehouse?: {
    id: string;
    name: string;
    code: string;
  };
  createdBy?: {
    id: string;
    first_name: string;
    last_name: string;
  };
  created_at?: string;
  updated_at?: string;
}

export const MOVEMENT_TYPES = {
  IN: 'Stock In',
  OUT: 'Stock Out',
  TRANSFER: 'Transfer',
  ADJUSTMENT: 'Adjustment',
} as const;
