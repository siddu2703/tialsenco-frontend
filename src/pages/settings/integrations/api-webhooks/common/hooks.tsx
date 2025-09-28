/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { ApiWebhook } from '$app/common/interfaces/api-webhook';
import { ValidationBag } from '$app/common/interfaces/validation-bag';
import { Dispatch, SetStateAction } from 'react';

interface HandleChangeWebHookParams {
  setApiWebHook: Dispatch<SetStateAction<ApiWebhook | undefined>>;
  setErrors: Dispatch<SetStateAction<ValidationBag | undefined>>;
}

export function useHandleChange(params: HandleChangeWebHookParams) {
  const { setApiWebHook, setErrors } = params;

  return <T extends keyof ApiWebhook>(
    property: T,
    value: ApiWebhook[typeof property]
  ) => {
    setErrors(undefined);

    setApiWebHook(
      (currentWebHook) =>
        currentWebHook && { ...currentWebHook, [property]: value }
    );
  };
}
