/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { Card, Element } from '$app/components/cards';
import { InputField } from '$app/components/forms';
import { enterprisePlan } from '$app/common/guards/guards/enterprise-plan';
import { isHosted } from '$app/common/helpers';
import { useTitle } from '$app/common/hooks/useTitle';
import { BankAccount } from '$app/common/interfaces/bank-accounts';
import { ValidationBag } from '$app/common/interfaces/validation-bag';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Settings } from '../../../../components/layouts/Settings';
import { useBlankBankAccountQuery } from '../common/queries';
import { useHandleCreate } from './hooks/useHandleCreate';
import { BankAccountsPlanAlert } from '../common/components/BankAccountsPlanAlert';
import { useColorScheme } from '$app/common/colors';

export function Create() {
  const [t] = useTranslation();

  useTitle('new_bank_account');

  const colors = useColorScheme();

  const { data } = useBlankBankAccountQuery();

  const pages = [
    { name: t('settings'), href: '/settings' },
    { name: t('bank_accounts'), href: '/settings/bank_accounts' },
    { name: t('new_bank_account'), href: '/settings/bank_accounts/create' },
  ];

  const [isFormBusy, setIsFormBusy] = useState<boolean>(false);

  const [errors, setErrors] = useState<ValidationBag>();

  const [bankAccount, setBankAccount] = useState<BankAccount>();

  const handleSave = useHandleCreate(
    bankAccount,
    setErrors,
    setIsFormBusy,
    isFormBusy
  );

  const handleChange = (
    property: keyof BankAccount,
    value: BankAccount[keyof BankAccount]
  ) => {
    setBankAccount(
      (prevState) => prevState && { ...prevState, [property]: value }
    );
  };

  useEffect(() => {
    if (data) {
      setBankAccount(data);
    }
  }, [data]);

  return (
    <Settings
      title={t('new_bank_account')}
      breadcrumbs={pages}
      docsLink="en/basic-settings/#create_bank_account"
      disableSaveButton={(!enterprisePlan() && isHosted()) || isFormBusy}
      onSaveClick={handleSave}
    >
      {!enterprisePlan() && isHosted() && <BankAccountsPlanAlert />}

      <Card
        onFormSubmit={handleSave}
        title={t('new_bank_account')}
        className="shadow-sm"
        style={{ borderColor: colors.$24 }}
        headerStyle={{ borderColor: colors.$20 }}
      >
        <Element leftSide={t('account_name')}>
          <InputField
            value={bankAccount?.bank_account_name}
            onValueChange={(value) => handleChange('bank_account_name', value)}
            errorMessage={errors?.errors.bank_account_name}
          />
        </Element>
      </Card>
    </Settings>
  );
}
