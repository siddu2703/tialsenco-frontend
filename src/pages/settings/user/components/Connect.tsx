/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { endpoint, isHosted } from '$app/common/helpers';
import { request } from '$app/common/helpers/request';
import { toast } from '$app/common/helpers/toast/toast';
import { useCurrentUser } from '$app/common/hooks/useCurrentUser';
import { useTranslation } from 'react-i18next';
import { Element } from '../../../../components/cards';
import { Button } from '../../../../components/forms';
import {
  createMsal,
  SignInProviderButton,
} from '$app/pages/authentication/components/SignInProviders';
import { GoogleLogin } from '@react-oauth/google';
import classNames from 'classnames';
import { $refetch } from '$app/common/hooks/useRefetch';
import { atomWithStorage } from 'jotai/utils';
import { useSetAtom } from 'jotai';
import { SelectProviderModal } from '../common/components/SelectProviderModal';
import { freePlan } from '$app/common/guards/guards/free-plan';

export const connectMailerAtom = atomWithStorage('connectMailer', 'false');
export function Connect() {
  const [t] = useTranslation();
  const user = useCurrentUser();

  const setIsMailerConnected = useSetAtom(connectMailerAtom);

  const handleConnectMailer = (mailer: 'google' | 'microsoft') => {
    toast.processing();

    window.location.href = endpoint('/auth/:mailer?react=true', { mailer });

    setIsMailerConnected('true');
  };

  const handleDisconnectMailer = () => {
    toast.processing();

    request(
      'POST',
      endpoint('/api/v1/users/:id/disconnect_mailer', { id: user!.id }),
      {}
    )
      .then((response) => {
        $refetch(['users']);

        toast.success(response.data.message);
        window.location.reload();
      })
      .finally(() => setIsMailerConnected('false'));
  };

  const handleDisconnectOauth = () => {
    toast.processing();

    request(
      'POST',
      endpoint('/api/v1/users/:id/disconnect_oauth', { id: user!.id })
    )
      .then((response) => {
        $refetch(['users']);

        toast.success(response.data.message);
        window.location.reload();
      })
      .finally(() => setIsMailerConnected('false'));
  };

  const handleMicrosoft = (token: string) => {
    request(
      'POST',
      endpoint(
        '/api/v1/connected_account?include=company_user&provider=microsoft'
      ),
      { accessToken: token }
    )
      .then(() => {
        window.location.reload();
      })
      .finally(() => setIsMailerConnected('false'));
  };

  const handleGoogle = (token: string) => {
    request(
      'POST',
      endpoint(
        '/api/v1/connected_account?include=company_user&provider=google&id_token=:token',
        {
          token,
        }
      )
    )
      .then(() => {
        window.location.reload();
      })
      .finally(() => setIsMailerConnected('false'));
  };

  const msal = createMsal();

  if (!msal) {
    return null;
  }

  return (
    <>
      <SelectProviderModal />

      {!user?.oauth_provider_id && isHosted() && (
        <>
          <div className="grid grid-cols-3 text-sm mt-4">
            <Element leftSide="Google">
              <GoogleLogin
                onSuccess={(response) =>
                  response.credential && handleGoogle(response.credential)
                }
                onError={() => toast.error()}
              />
            </Element>
          </div>

          <div
            className={classNames('grid grid-cols-3 text-sm', {
              'mt-4': isHosted(),
            })}
          >
            <Element leftSide="Microsoft">
              <SignInProviderButton
                onClick={async () => {
                  if (!msal) return;

                  await msal.handleRedirectPromise();

                  msal
                    .loginPopup({
                      scopes: ['user.read'],
                    })
                    .then((response) => handleMicrosoft(response.accessToken));
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 23 23"
                >
                  <path fill="#f3f3f3" d="M0 0h23v23H0z"></path>
                  <path fill="#f35325" d="M1 1h10v10H1z"></path>
                  <path fill="#81bc06" d="M12 1h10v10H12z"></path>
                  <path fill="#05a6f0" d="M1 12h10v10H1z"></path>
                  <path fill="#ffba08" d="M12 12h10v10H12z"></path>
                </svg>

                <p style={{ color: '#000' }}>Log in with Microsoft</p>
              </SignInProviderButton>
            </Element>
          </div>
        </>
      )}

      {user?.oauth_provider_id === 'google' && (
        <>
          <Element leftSide="Google">
            <Button
              type="minimal"
              behavior="button"
              onClick={handleDisconnectOauth}
            >
              {t('disconnect_google')}
            </Button>
          </Element>

          {!freePlan() && (
            <Element leftSide="Gmail">
              {user?.oauth_user_token ? (
                <Button
                  type="minimal"
                  behavior="button"
                  onClick={handleDisconnectMailer}
                >
                  {t('disconnect_gmail')}
                </Button>
              ) : (
                <Button
                  type="minimal"
                  behavior="button"
                  onClick={() => handleConnectMailer('google')}
                >
                  {t('connect_gmail')}
                </Button>
              )}
            </Element>
          )}
        </>
      )}

      {user?.oauth_provider_id === 'microsoft' && (
        <>
          <Element leftSide="Microsoft">
            <Button
              type="minimal"
              behavior="button"
              onClick={handleDisconnectOauth}
            >
              {t('disconnect_microsoft')}
            </Button>
          </Element>

          {!freePlan() && (
            <Element leftSide="Email">
              {user?.oauth_user_token ? (
                <Button
                  type="minimal"
                  behavior="button"
                  onClick={handleDisconnectMailer}
                >
                  {t('disconnect_email')}
                </Button>
              ) : (
                <Button
                  type="minimal"
                  behavior="button"
                  onClick={() => handleConnectMailer('microsoft')}
                >
                  {t('connect_email')}
                </Button>
              )}
            </Element>
          )}
        </>
      )}
    </>
  );
}
