/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { Project } from './project';
import { Client } from './client';
import { TaskStatus } from './task-status';
import { User } from './user';

export interface Task {
  id: string;
  user_id: string;
  assigned_user_id: string;
  client_id: string;
  invoice_id: string;
  project_id: string;
  status_id: string;
  status_sort_order: number;
  custom_value1: string;
  custom_value2: string;
  custom_value3: string;
  custom_value4: string;
  duration: number;
  description: string;
  is_running: boolean;
  time_log: string;
  number: string;
  rate: number;
  is_date_based: boolean;
  status_order: number;
  is_deleted: boolean;
  archived_at: number;
  created_at: number;
  updated_at: number;
  client?: Client;
  status?: TaskStatus;
  project?: Project;
  documents: any[];
  date: string;
  calculated_start_date: string;
  user: User;
  assigned_user: User;
}
