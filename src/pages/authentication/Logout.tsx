/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { clearLocalStorage } from '$app/common/helpers/local-storage';
import { useEffect } from 'react';
import { useQueryClient } from 'react-query';

export function Logout() {
  const queryClient = useQueryClient();

  // const { signOut } = useGoogleLogout({
  //   clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
  // });

  useEffect(() => {
    // if (isHosted() && user?.oauth_provider_id === 'microsoft' && msal) {
    //   msal.logoutPopup();
    // }

    // if (isHosted() && user?.oauth_provider_id === 'google') {
    //   // signOut();
    // }

    clearLocalStorage();
    sessionStorage.clear();

    queryClient.invalidateQueries();
    queryClient.removeQueries();

    window.location.href = '/';
  }, []);

  return <></>;
}
