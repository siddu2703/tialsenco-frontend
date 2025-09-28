/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { activeSettingsAtom } from '$app/common/atoms/settings';
import { useCurrentSettingsLevel } from '$app/common/hooks/useCurrentSettingsLevel';
import {
  resetChanges,
  updateChanges,
} from '$app/common/stores/slices/company-users';
import { useAtomValue } from 'jotai';
import { useDispatch } from 'react-redux';

export function useDiscardChanges() {
  const dispatch = useDispatch();
  const {
    isCompanySettingsActive,
    isGroupSettingsActive,
    isClientSettingsActive,
  } = useCurrentSettingsLevel();

  const activeSettings = useAtomValue(activeSettingsAtom);

  return () => {
    if (isCompanySettingsActive) {
      dispatch(resetChanges('company'));
    }

    if ((isGroupSettingsActive || isClientSettingsActive) && activeSettings) {
      dispatch(
        updateChanges({
          object: 'company',
          property: 'settings',
          value: activeSettings.settings,
        })
      );
    }
  };
}
