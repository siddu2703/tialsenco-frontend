/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { date, isDemo, isHosted, isSelfHosted } from '$app/common/helpers';
import { useCurrentAccount } from '$app/common/hooks/useCurrentAccount';
import { useCurrentCompanyDateFormats } from '$app/common/hooks/useCurrentCompanyDateFormats';
import { useCurrentUser } from '$app/common/hooks/useCurrentUser';
import { useTranslation } from 'react-i18next';
import { License } from '.';
import { Element } from '../../../../components/cards';
import { Link } from '../../../../components/forms';
import dayjs from 'dayjs';
import { route } from '$app/common/helpers/route';

export function Plan() {
  const [t] = useTranslation();
  const user = useCurrentUser();
  const account = useCurrentAccount();
  const { dateFormat } = useCurrentCompanyDateFormats();

  return (
    <div className="flex flex-col pb-4">
      <Element className="mb-3" leftSide={t('plan')}>
        {isHosted() ? (
          <>
            <span>
              {account?.plan
                ? `${t(account.plan)} ${t('plan')} `
                : `${t('free')} ${t('plan')} `}
            </span>
            <span>
              / {account.num_users} {t('users')}
            </span>
          </>
        ) : (
          <span>
            {t(
              account?.plan_expires !== '' &&
                !dayjs(account.plan_expires).isBefore(dayjs())
                ? 'licensed'
                : 'plan_free_self_hosted'
            )}
          </span>
        )}
      </Element>

      {account?.plan_expires !== '' && (
        <Element leftSide={t('expires_on')}>
          {dayjs(account.plan_expires).year() > 2000
            ? date(account.plan_expires, dateFormat)
            : t('forever_free')}
        </Element>
      )}

      {isHosted() && user?.company_user?.is_owner && (
        <Element>
          <Link className="mt-4" to={route('/settings/account_management')}>
            {t('plan_change')}
          </Link>
        </Element>
      )}

      {isSelfHosted() && !isDemo() && <License />}
    </div>
  );
}
