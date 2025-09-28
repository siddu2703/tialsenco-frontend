/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { isHosted } from '$app/common/helpers';
import { ReactNode, Suspense, lazy } from 'react';

const GoogleOAuthProvider = lazy(() =>
  import('@react-oauth/google').then((module) => ({
    default: module.GoogleOAuthProvider,
  }))
);

export function GoogleOAuth({ children }: { children: ReactNode }) {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  if (!isHosted()) {
    return <>{children}</>;
  }

  return (
    <Suspense>
      <GoogleOAuthProvider clientId={googleClientId}>
        {children}
      </GoogleOAuthProvider>
    </Suspense>
  );
}
