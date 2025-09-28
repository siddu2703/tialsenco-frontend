/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

export interface GenericSelectorProps<T> {
  inputLabel?: string | null;
  value?: string | undefined;
  defaultValue?: string | undefined;
  readonly?: boolean;
  clearButton?: boolean;
  onChange: (resource: T) => unknown;
  onClearButtonClick?: () => unknown;
  errorMessage?: string | string[];
}
