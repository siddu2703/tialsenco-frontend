/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { AxiosError } from 'axios';
import { endpoint } from '$app/common/helpers';
import { request } from '$app/common/helpers/request';
import { Payment } from '$app/common/interfaces/payment';
import { ValidationBag } from '$app/common/interfaces/validation-bag';
import { toast } from '$app/common/helpers/toast/toast';
import { useHandleCompanySave } from '$app/pages/settings/common/hooks/useHandleCompanySave';
import { $refetch } from '$app/common/hooks/useRefetch';
import { Dispatch, SetStateAction } from 'react';

interface Params {
  setErrors: Dispatch<SetStateAction<ValidationBag | undefined>>;
  isFormBusy: boolean;
  setIsFormBusy: Dispatch<SetStateAction<boolean>>;
}
export function useSave({ setErrors, isFormBusy, setIsFormBusy }: Params) {
  const saveCompany = useHandleCompanySave();

  return async (payment: Payment) => {
    if (isFormBusy) {
      return;
    }

    toast.processing();
    setIsFormBusy(true);
    setErrors(undefined);

    await saveCompany({ excludeToasters: true });

    const adjustedPaymentPayload = { ...payment };

    delete adjustedPaymentPayload.invoices;
    delete adjustedPaymentPayload.credits;

    await saveCompany({ excludeToasters: true });

    request(
      'PUT',
      endpoint('/api/v1/payments/:id', { id: payment.id }),
      adjustedPaymentPayload
    )
      .then(() => {
        toast.success('updated_payment');
      })
      .catch((error: AxiosError<ValidationBag>) => {
        if (error.response?.status === 422) {
          toast.dismiss();
          setErrors(error.response.data);
        }
      })
      .finally(() => {
        $refetch(['payments']);
        setIsFormBusy(false);
      });
  };
}
