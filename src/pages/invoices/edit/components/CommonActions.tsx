/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { Invoice } from '$app/common/interfaces/invoice';
import {
  CommonActionsPreferenceModal,
  Entity as EntityType,
} from '$app/components/CommonActionsPreferenceModal';
import { useEffect, useState } from 'react';
import { useActions as useInvoiceActions } from './Actions';
import { ResourceAction } from '$app/components/DataTable';
import { useCurrentUser } from '$app/common/hooks/useCurrentUser';
import { useTranslation } from 'react-i18next';
import { Tooltip } from '$app/components/Tooltip';
import { Credit } from '$app/common/interfaces/credit';
import { useActions as useCreditActions } from '$app/pages/credits/common/hooks';
import { useActions as useQuoteActions } from '$app/pages/quotes/common/hooks';
import { Quote } from '$app/common/interfaces/quote';
import { useActions as useRecurringInvoiceActions } from '$app/pages/recurring-invoices/common/hooks';
import { useActions as usePurchaseOrderActions } from '$app/pages/purchase-orders/common/hooks';
import { RecurringInvoice } from '$app/common/interfaces/recurring-invoice';
import { PurchaseOrder } from '$app/common/interfaces/purchase-order';
import { Gear } from '$app/components/icons/Gear';
import { useColorScheme } from '$app/common/colors';

type Resource = Invoice | Credit | Quote | RecurringInvoice | PurchaseOrder;

interface Props {
  entity: EntityType;
  resource: Resource;
}
export function CommonActions(props: Props) {
  const [t] = useTranslation();

  const { resource, entity } = props;

  const user = useCurrentUser();
  const colors = useColorScheme();

  const quoteActions = useQuoteActions({ dropdown: false });
  const creditActions = useCreditActions({ dropdown: false });
  const invoiceActions = useInvoiceActions({ dropdown: false });
  const purchaseOrderActions = usePurchaseOrderActions({ dropdown: false });
  const recurringInvoiceActions = useRecurringInvoiceActions({
    dropdown: false,
  });

  const [isPreferenceModalOpen, setIsPreferenceModalOpen] =
    useState<boolean>(false);
  const [selectedActions, setSelectedActions] =
    useState<ResourceAction<Resource>[]>();

  const actions = (): ResourceAction<Resource>[] => {
    if (entity === 'invoice') {
      return invoiceActions.filter(
        (action) => typeof action === 'function'
      ) as ResourceAction<Resource>[];
    }

    if (entity === 'credit') {
      return creditActions.filter(
        (action) => typeof action === 'function'
      ) as ResourceAction<Resource>[];
    }

    if (entity === 'quote') {
      return quoteActions.filter(
        (action) => typeof action === 'function'
      ) as ResourceAction<Resource>[];
    }

    if (entity === 'recurring_invoice') {
      return recurringInvoiceActions.filter(
        (action) => typeof action === 'function'
      ) as ResourceAction<Resource>[];
    }

    if (entity === 'purchase_order') {
      return purchaseOrderActions.filter(
        (action) => typeof action === 'function'
      ) as ResourceAction<Resource>[];
    }

    return [];
  };

  useEffect(() => {
    const currentActions =
      user?.company_user?.react_settings?.common_actions?.[entity];

    if (currentActions) {
      const selected = actions()
        .filter((action) =>
          currentActions.includes(action(resource)?.key as string)
        )
        .sort((a, b) => {
          return (
            currentActions.indexOf(
              String((a as ResourceAction<Resource>)(resource)?.key) ?? ''
            ) -
            currentActions.indexOf(
              String((b as ResourceAction<Resource>)(resource)?.key) ?? ''
            )
          );
        });

      setSelectedActions(selected as ResourceAction<Resource>[]);
    }
  }, [user, resource]);

  return (
    <>
      <div className="flex items-center space-x-4">
        {selectedActions?.map((action, index) => (
          <div key={index}>{action(resource)}</div>
        ))}

        <Tooltip
          width="auto"
          message={t('quick_actions') as string}
          placement="bottom"
          withoutArrow
        >
          <div
            className="cursor-pointer"
            onClick={() => setIsPreferenceModalOpen(true)}
          >
            <Gear size="1.4rem" color={colors.$3} />
          </div>
        </Tooltip>
      </div>

      <CommonActionsPreferenceModal
        entity={entity}
        visible={isPreferenceModalOpen}
        setVisible={setIsPreferenceModalOpen}
      />
    </>
  );
}
