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
import { useTitle } from '$app/common/hooks/useTitle';
import { BankAccount as BankAccountEntity } from '$app/common/interfaces/bank-accounts';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Settings } from '../../../../components/layouts/Settings';
import { useBankAccountQuery } from '../common/queries';
import { Details } from '../components/Details';

export function BankAccount() {
  useTitle('bank_account');

  const { id } = useParams();

  const [t] = useTranslation();

  const pages = [
    { name: t('settings'), href: '/settings' },
    { name: t('bank_accounts'), href: '/settings/bank_accounts' },
    {
      name: t('bank_account'),
      href: route('/settings/bank_accounts/:id/details', { id }),
    },
  ];

  const { data: response } = useBankAccountQuery({ id });

  const [accountDetails, setAccountDetails] = useState<BankAccountEntity>();

  useEffect(() => {
    setAccountDetails(response);
  }, [response]);

  return (
    <Settings
      title={t('bank_account')}
      breadcrumbs={pages}
      docsLink="en/basic-settings/#bank_account_details"
    >
      <Details accountDetails={accountDetails} />
    </Settings>
  );
}
