/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { useReactSettings } from './useReactSettings';

export function useUserNumberPrecision() {
  const reactSettings = useReactSettings();

  return reactSettings?.number_precision &&
    reactSettings?.number_precision > 0 &&
    reactSettings?.number_precision <= 100
    ? reactSettings.number_precision
    : 2;
}
