/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { Language } from '$app/common/interfaces/language';

export function useLanguages(): Language[] {
  return [
    {
      id: '1',
      locale: 'en',
      name: 'English',
    },
  ];
}
