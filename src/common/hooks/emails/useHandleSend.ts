/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { endpoint } from '$app/common/helpers';
import { request } from '$app/common/helpers/request';
import { toast } from '$app/common/helpers/toast/toast';
import { ValidationBag } from '$app/common/interfaces/validation-bag';
import { AxiosError } from 'axios';
import { Dispatch, SetStateAction } from 'react';
import { useNavigate } from 'react-router-dom';
import { $refetch, keys } from '../useRefetch';

interface Params {
  setErrors: Dispatch<SetStateAction<ValidationBag | undefined>>;
}

export function useHandleSend({ setErrors }: Params) {
  const navigate = useNavigate();

  return (
    body: string,
    entity: string,
    entityId: string,
    subject: string,
    template: string,
    redirectUrl: string,
    ccEmail: string
  ) => {
    toast.processing();
    setErrors(undefined);

    request('POST', endpoint('/api/v1/emails'), {
      body,
      entity,
      entity_id: entityId,
      subject,
      template,
      cc_email: ccEmail,
    })
      .then(() => {
        $refetch([`${entity}s` as keyof typeof keys]);

        toast.success('email_queued');
        navigate(redirectUrl);
      })
      .catch((error: AxiosError<ValidationBag>) => {
        if (error.response?.status === 422) {
          setErrors(error.response.data);
          toast.dismiss();
        }
      });
  };
}
