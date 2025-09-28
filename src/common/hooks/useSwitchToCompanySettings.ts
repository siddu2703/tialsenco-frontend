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
import { useDispatch } from 'react-redux';
import { resetChanges } from '../stores/slices/company-users';
import { setActiveSettings } from '../stores/slices/settings';

export function useSwitchToCompanySettings() {
  const dispatch = useDispatch();

  return useCallback(() => {
    dispatch(resetChanges('company'));

    dispatch(
      setActiveSettings({
        status: {
          name: '',
          level: 'company',
        },
      })
    );
  }, [dispatch]);
}
