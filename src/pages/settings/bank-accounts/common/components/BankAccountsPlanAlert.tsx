/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { route } from '$app/common/helpers/route';
import { useCurrentUser } from '$app/common/hooks/useCurrentUser';
import { Alert } from '$app/components/Alert';
import { Link } from '$app/components/forms';
import { Icon } from '$app/components/icons/Icon';
import { useTranslation } from 'react-i18next';
import { MdInfoOutline } from 'react-icons/md';

export function BankAccountsPlanAlert() {
  const [t] = useTranslation();

  const user = useCurrentUser();

  return (
    <div>
      <Alert className="mb-4" type="warning" disableClosing>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon element={MdInfoOutline} size={20} />

            <span>{t('upgrade_to_connect_bank_account')}</span>
          </div>

          {user?.company_user && (
            <Link to={route('/settings/account_management')}>
              {t('plan_change')}
            </Link>
          )}
        </div>
      </Alert>
    </div>
  );
}
