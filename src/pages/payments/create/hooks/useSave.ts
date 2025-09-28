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
import { route } from '$app/common/helpers/route';
import { Payment } from '$app/common/interfaces/payment';
import { ValidationBag } from '$app/common/interfaces/validation-bag';
import { useNavigate } from 'react-router-dom';
import { toast } from '$app/common/helpers/toast/toast';
import { $refetch } from '$app/common/hooks/useRefetch';
import { generate64CharHash } from '$app/common/hooks/useGenerateHash';
import { Dispatch, SetStateAction } from 'react';

interface Params {
  setErrors: Dispatch<SetStateAction<ValidationBag | undefined>>;
  setIsFormBusy: Dispatch<SetStateAction<boolean>>;
  isFormBusy: boolean;
}
export function useSave(params: Params) {
  const { setErrors, setIsFormBusy, isFormBusy } = params;

  const navigate = useNavigate();

  return (payment: Payment, sendEmail: boolean) => {
    if (!isFormBusy) {
      toast.processing();

      setErrors(undefined);
      setIsFormBusy(true);

      const idempotencyKey = generate64CharHash();

      request(
        'POST',
        endpoint('/api/v1/payments?email_receipt=:email', {
          email: sendEmail,
        }),
        { ...payment, idempotency_key: idempotencyKey }
      )
        .then((data) => {
          toast.success('created_payment');
          navigate(route('/payments/:id/edit', { id: data.data.data.id }));
        })
        .catch((error: AxiosError<ValidationBag>) => {
          if (error.response?.status === 422) {
            toast.dismiss();
            setErrors(error.response.data);
          }
        })
        .finally(() => {
          setIsFormBusy(false);
          $refetch(['payments', 'credits', 'invoices', 'clients']);
        });
    }
  };
}
