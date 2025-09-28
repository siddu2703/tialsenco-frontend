/**
 * Tilsenco (https://tilsenco.com).
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import colors from '$app/common/constants/colors';
import { RootState } from '$app/common/stores/store';
import { useSelector } from 'react-redux';
import { useCurrentUser } from './useCurrentUser';

export function useAccentColor() {
  const user = useCurrentUser();
  const userState = useSelector((state: RootState) => state.user);

  return (
    userState.changes?.company_user?.settings?.accent_color ||
    user?.company_user?.settings?.accent_color ||
    colors.accent
  );
}
