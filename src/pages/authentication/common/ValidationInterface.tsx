/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

export interface LoginValidation {
  email?: string[];
  password?: string[];
  one_time_password?: string[];
}

export interface RegisterValidation {
  email?: string[];
  password?: string[];
  password_confirmation?: string[];
}

export interface ForgotPasswordValidation {
  errors?: {
    email: string[];
  };
}
