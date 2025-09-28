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
import { toast } from '$app/common/helpers/toast/toast';
import { PurchaseOrder } from '$app/common/interfaces/purchase-order';
import { ValidationBag } from '$app/common/interfaces/validation-bag';
import { useSetAtom } from 'jotai';
import { isDeleteActionTriggeredAtom } from '$app/pages/invoices/common/components/ProductsTable';
import { $refetch } from '$app/common/hooks/useRefetch';
import { Dispatch, SetStateAction } from 'react';
import { useRefreshCompanyUsers } from '$app/common/hooks/useRefreshCompanyUsers';

interface Props {
  isDefaultTerms: boolean;
  isDefaultFooter: boolean;
  setErrors: Dispatch<SetStateAction<ValidationBag | undefined>>;
  isFormBusy: boolean;
  setIsFormBusy: Dispatch<SetStateAction<boolean>>;
}
export function useSave(props: Props) {
  const {
    setErrors,
    isDefaultFooter,
    isDefaultTerms,
    isFormBusy,
    setIsFormBusy,
  } = props;

  const refreshCompanyUsers = useRefreshCompanyUsers();
  const setIsDeleteActionTriggered = useSetAtom(isDeleteActionTriggeredAtom);

  return (purchaseOrder: PurchaseOrder) => {
    if (isFormBusy) {
      return;
    }

    setIsFormBusy(true);
    setErrors(undefined);
    toast.processing();

    let apiEndpoint = '/api/v1/purchase_orders/:id?';

    if (isDefaultTerms) {
      apiEndpoint += 'save_default_terms=true';
      if (isDefaultFooter) {
        apiEndpoint += '&save_default_footer=true';
      }
    } else if (isDefaultFooter) {
      apiEndpoint += 'save_default_footer=true';
    }

    request(
      'PUT',
      endpoint(apiEndpoint, { id: purchaseOrder.id }),
      purchaseOrder
    )
      .then(async () => {
        if (isDefaultTerms || isDefaultFooter) {
          await refreshCompanyUsers();
        }

        toast.success('updated_purchase_order');
      })
      .catch((error: AxiosError<ValidationBag>) => {
        if (error.response?.status === 422) {
          const errorMessages = error.response.data;

          if (errorMessages.errors.amount) {
            toast.error(errorMessages.errors.amount[0]);
          } else {
            toast.dismiss();
          }

          setErrors(errorMessages);
        }
      })
      .finally(() => {
        setIsDeleteActionTriggered(undefined);

        $refetch(['purchase_orders']);

        setIsFormBusy(false);
      });
  };
}
