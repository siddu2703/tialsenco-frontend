/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { Modal } from '$app/components/Modal';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, InputField } from '$app/components/forms';
import { BankAccount } from '$app/common/interfaces/bank-accounts';
import { useState } from 'react';
import { ValidationBag } from '$app/common/interfaces/validation-bag';
import { useHandleCreate } from '$app/pages/settings/bank-accounts/create/hooks/useHandleCreate';
import { useBlankBankAccountQuery } from '$app/pages/settings/bank-accounts/common/queries';
import { useColorScheme } from '$app/common/colors';

interface Props {
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  onCreatedBankAccount?: (account: BankAccount) => unknown;
}

export function CreateBankAccountModal(props: Props) {
  const [t] = useTranslation();

  const { data } = useBlankBankAccountQuery();

  const [isFormBusy, setIsFormBusy] = useState<boolean>(false);

  const [errors, setErrors] = useState<ValidationBag>();

  const [bankAccount, setBankAccount] = useState<BankAccount>();

  const handleSave = useHandleCreate(
    bankAccount,
    setErrors,
    setIsFormBusy,
    isFormBusy,
    props.setIsModalOpen,
    props.onCreatedBankAccount
  );

  const handleChange = (
    property: keyof BankAccount,
    value: BankAccount[keyof BankAccount]
  ) => {
    setBankAccount(
      (prevState) => prevState && { ...prevState, [property]: value }
    );
  };

  const handleCancel = () => {
    if (!isFormBusy) {
      props.setIsModalOpen(false);
    }
  };

  useEffect(() => {
    if (data) {
      setBankAccount(data);
    }
  }, [data]);

  const colors = useColorScheme();

  return (
    <Modal
      title={t('new_bank_account')}
      visible={props.isModalOpen}
      onClose={handleCancel}
    >
      <InputField
        style={{ color: colors.$3, colorScheme: colors.$0 }}
        label={t('name')}
        value={bankAccount?.bank_account_name}
        onValueChange={(value) => handleChange('bank_account_name', value)}
        errorMessage={errors?.errors.bank_account_name}
      />

      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          style={{ color: colors.$3, colorScheme: colors.$0 }}
        >
          {t('save')}
        </Button>
      </div>
    </Modal>
  );
}
