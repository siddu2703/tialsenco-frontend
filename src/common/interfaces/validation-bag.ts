/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

export interface ValidationBag {
  message: string;
  errors: Record<string, string[]>;
}

export interface GenericValidationBag<T> {
  message: string;
  errors?: T;
}
