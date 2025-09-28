/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { ChangeEvent } from 'react';

export function isNonNumericValue(event: ChangeEvent<HTMLInputElement>) {
  if (isNaN(Number(event.target.value)) || event.target.value == '') {
    event.target.value = '0';

    return true;
  }

  return false;
}
