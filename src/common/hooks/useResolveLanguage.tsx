/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { useCallback } from 'react';
import { useLanguages } from './useLanguages';

export function useResolveLanguage() {
  const langauges = useLanguages();

  return useCallback(
    (id: string | number) => {
      if (!id || !langauges || langauges.length === 0) {
        return null;
      }

      return langauges.find(
        (language) =>
          language && language.id && language.id.toString() === id.toString()
      );
    },
    [langauges]
  );
}
