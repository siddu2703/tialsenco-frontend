/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { Button, InputField, Link } from '$app/components/forms';
import { endpoint, isHosted } from '$app/common/helpers';
import { request } from '$app/common/helpers/request';
import { toast } from '$app/common/helpers/toast/toast';
import { useCurrentUser } from '$app/common/hooks/useCurrentUser';
import { resetChanges, updateUser } from '$app/common/stores/slices/user';
import { Modal } from '$app/components/Modal';
import { merge } from 'lodash';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import QRCode from 'react-qr-code';
import { useDispatch } from 'react-redux';
import { SmsVerificationModal } from '../../components/SmsVerificationModal';
import { useColorScheme } from '$app/common/colors';
import { ValidationBag } from '$app/common/interfaces/validation-bag';
import { AxiosError } from 'axios';

interface Props {
  checkVerification: boolean;
  setCheckVerification: Dispatch<SetStateAction<boolean>>;
  isDisableModalOpen?: boolean;
  setIsDisableModalOpen?: Dispatch<SetStateAction<boolean>>;
  checkOnlyPhoneNumberVerification?: boolean;
}
export function TwoFactorAuthenticationModals(props: Props) {
  const [t] = useTranslation();

  const user = useCurrentUser();
  const dispatch = useDispatch();

  const {
    checkVerification,
    setCheckVerification,
    isDisableModalOpen,
    setIsDisableModalOpen,
    checkOnlyPhoneNumberVerification,
  } = props;

  const [isEnableModalOpen, setIsEnableModalOpen] = useState<boolean>(false);
  const [isSmsModalOpen, setIsSmsModalOpen] = useState<boolean>(false);

  const [qrCode, setQrCode] = useState<string>('');
  const [qrCodeSecret, setQrCodeSecret] = useState<string>('');

  const [oneTimePassword, setOneTimePassword] = useState<string>('');
  const [isSubmitDisabled, setIsSubmitDisabled] = useState<boolean>(false);
  const [errors, setErrors] = useState<ValidationBag>();

  const requestQrCode = () => {
    toast.processing();

    request('GET', endpoint('/api/v1/settings/enable_two_factor')).then(
      (response) => {
        toast.dismiss();

        setQrCode(response.data.data.qrCode);

        setQrCodeSecret(response.data.data.secret);

        setIsEnableModalOpen(true);
      }
    );
  };

  const enableTwoFactor = () => {
    toast.processing();
    setErrors(undefined);

    request('POST', endpoint('/api/v1/settings/enable_two_factor'), {
      secret: qrCodeSecret,
      one_time_password: oneTimePassword,
    })
      .then((response) => {
        toast.success(response.data.message);

        dispatch(updateUser(merge({}, user, { google_2fa_secret: true })));
        dispatch(resetChanges());
        setIsEnableModalOpen(false);
      })
      .catch((error: AxiosError<ValidationBag>) => {
        if (error.response?.status === 422) {
          setErrors(error.response.data);
          toast.dismiss();
        }
      })
      .finally(() => setIsSubmitDisabled(false));
  };

  const disableTwoFactor = () => {
    toast.processing();

    request('POST', endpoint('/api/v1/settings/disable_two_factor')).then(
      () => {
        toast.success('disabled_two_factor');

        dispatch(updateUser(merge({}, user, { google_2fa_secret: false })));
        dispatch(resetChanges());

        setIsDisableModalOpen?.(false);
      }
    );
  };

  const resetSmsCode = () => {
    toast.processing();

    request('POST', endpoint('/api/v1/sms_reset'), {
      email: user!.email,
    }).then(() => {
      toast.success('code_was_sent');
    });
  };

  const verifyPhoneNumber = (code: string) => {
    toast.processing();

    request('POST', endpoint('/api/v1/sms_reset/confirm?validate_only=true'), {
      code,
      email: user!.email,
    }).then(() => {
      toast.success('verified_phone_number');

      dispatch(updateUser(merge({}, user, { verified_phone_number: true })));
      dispatch(resetChanges());

      setIsSmsModalOpen(false);

      if (!checkOnlyPhoneNumberVerification) {
        requestQrCode();

        setIsEnableModalOpen(true);
      }
    });
  };

  const checkPhoneNumberVerification = () => {
    if (isHosted()) {
      if (!user?.phone) {
        toast.error('enter_phone_number');
      } else if (!user?.verified_phone_number) {
        setIsSmsModalOpen(true);
        resetSmsCode();
      } else {
        requestQrCode();
        setIsEnableModalOpen(true);
      }
    } else {
      requestQrCode();
      setIsEnableModalOpen(true);
    }
  };

  useEffect(() => {
    if (checkVerification) {
      checkPhoneNumberVerification();
    }
  }, [checkVerification]);

  useEffect(() => {
    if (!isSmsModalOpen || !isEnableModalOpen) {
      setCheckVerification(false);
    }
  }, [isSmsModalOpen, isEnableModalOpen]);

  const colors = useColorScheme();

  return (
    <>
      <SmsVerificationModal
        visible={isSmsModalOpen}
        setVisible={setIsSmsModalOpen}
        resendSmsCode={resetSmsCode}
        verifyPhoneNumber={verifyPhoneNumber}
      />

      <Modal
        title={t('enable_two_factor')}
        visible={isEnableModalOpen}
        onClose={setIsEnableModalOpen}
      >
        <div className="flex flex-col items-center pb-8 space-y-4">
          <QRCode size={156} value={qrCode} />
          <p
            className="font-semibold"
            style={{
              backgroundColor: colors.$2,
              color: colors.$3,
              colorScheme: colors.$0,
            }}
          >
            {qrCodeSecret}
          </p>
        </div>

        <InputField
          id="one_time_password"
          type="text"
          label={t('one_time_password')}
          onValueChange={(value) => setOneTimePassword(value)}
          errorMessage={errors?.errors.one_time_password}
        />

        <Button
          behavior="button"
          disabled={isSubmitDisabled}
          onClick={enableTwoFactor}
        >
          {t('continue')}
        </Button>

        <Link
          external
          to="https://github.com/antonioribeiro/google2fa#google-authenticator-apps"
        >
          {t('learn_more')}
        </Link>
      </Modal>

      {setIsDisableModalOpen && typeof isDisableModalOpen === 'boolean' && (
        <Modal
          title={t('disable_two_factor')}
          visible={isDisableModalOpen}
          onClose={setIsDisableModalOpen}
        >
          <Button
            behavior="button"
            disabled={isSubmitDisabled}
            onClick={disableTwoFactor}
          >
            {t('confirm')}
          </Button>
        </Modal>
      )}
    </>
  );
}
