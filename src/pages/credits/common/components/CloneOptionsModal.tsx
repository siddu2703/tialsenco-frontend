/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { useHasPermission } from '$app/common/hooks/permissions/useHasPermission';
import { useCompanyChanges } from '$app/common/hooks/useCompanyChanges';
import { Credit } from '$app/common/interfaces/credit';
import { PurchaseOrder } from '$app/common/interfaces/purchase-order';
import { Quote } from '$app/common/interfaces/quote';
import { RecurringInvoice } from '$app/common/interfaces/recurring-invoice';
import { CloneOption } from '$app/components/CloneOption';
import { EntityActionElement } from '$app/components/EntityActionElement';
import { Modal } from '$app/components/Modal';
import { invoiceAtom } from '$app/pages/invoices/common/atoms';
import { purchaseOrderAtom } from '$app/pages/purchase-orders/common/atoms';
import { quoteAtom } from '$app/pages/quotes/common/atoms';
import { recurringInvoiceAtom } from '$app/pages/recurring-invoices/common/atoms';
import dayjs from 'dayjs';
import { useSetAtom } from 'jotai';
import { useState } from 'react';
import { File, FileText, Repeat } from 'react-feather';
import { useTranslation } from 'react-i18next';
import { BiFile } from 'react-icons/bi';
import { MdControlPointDuplicate } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

interface Props {
  credit: Credit;
  dropdown?: boolean;
}

export function CloneOptionsModal(props: Props) {
  const [t] = useTranslation();
  const navigate = useNavigate();

  const { credit, dropdown } = props;

  const hasPermission = useHasPermission();

  const setInvoice = useSetAtom(invoiceAtom);
  const setQuote = useSetAtom(quoteAtom);
  const setRecurringInvoice = useSetAtom(recurringInvoiceAtom);
  const setPurchaseOrder = useSetAtom(purchaseOrderAtom);
  const company = useCompanyChanges();

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const cloneToInvoice = () => {
    setInvoice({
      ...credit,
      id: '',
      number: '',
      documents: [],
      due_date: '',
      partial_due_date: '',
      date: dayjs().format('YYYY-MM-DD'),
      total_taxes: 0,
      exchange_rate: 1,
      last_sent_date: '',
      project_id: '',
      subscription_id: '',
      status_id: '',
      vendor_id: '',
      paid_to_date: 0,
      po_number: '',
      design_id: company.settings.invoice_design_id,
    });

    navigate('/invoices/create?action=clone');
  };

  const cloneToQuote = () => {
    setQuote({
      ...(credit as Quote),
      id: '',
      number: '',
      documents: [],
      date: dayjs().format('YYYY-MM-DD'),
      due_date: '',
      partial_due_date: '',
      total_taxes: 0,
      exchange_rate: 1,
      last_sent_date: '',
      project_id: '',
      subscription_id: '',
      status_id: '',
      vendor_id: '',
      paid_to_date: 0,
      po_number: '',
      design_id: company.settings.quote_design_id,
    });

    navigate('/quotes/create?action=clone');
  };

  const cloneToRecurringInvoice = () => {
    setRecurringInvoice({
      ...(credit as unknown as RecurringInvoice),
      id: '',
      number: '',
      documents: [],
      frequency_id: '5',
      paid_to_date: 0,
      total_taxes: 0,
      exchange_rate: 1,
      last_sent_date: '',
      project_id: '',
      subscription_id: '',
      status_id: '',
      vendor_id: '',
      po_number: '',
      due_date: '',
      partial_due_date: '',
      design_id: company.settings.invoice_design_id,
    });

    navigate('/recurring_invoices/create?action=clone');
  };

  const cloneToPurchaseOrder = () => {
    setPurchaseOrder({
      ...(credit as unknown as PurchaseOrder),
      id: '',
      number: '',
      documents: [],
      date: dayjs().format('YYYY-MM-DD'),
      total_taxes: 0,
      exchange_rate: 1,
      last_sent_date: '',
      project_id: '',
      subscription_id: '',
      status_id: '1',
      vendor_id: '',
      po_number: '',
      due_date: '',
      partial_due_date: '',
      design_id: company.settings.purchase_order_design_id,
    });

    navigate('/purchase_orders/create?action=clone');
  };

  return (
    <>
      {(hasPermission('create_invoice') ||
        hasPermission('create_quote') ||
        hasPermission('create_recurring_invoice') ||
        hasPermission('create_purchase_order')) && (
        <EntityActionElement
          entity="credit"
          actionKey="clone_to_other"
          isCommonActionSection={!dropdown}
          tooltipText={t('clone_to_other')}
          onClick={() => setIsModalVisible(true)}
          icon={MdControlPointDuplicate}
        >
          {t('clone_to_other')}
        </EntityActionElement>
      )}

      <Modal
        title={t('clone_to')}
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        closeButtonCypressRef="cloneOptionsModalXButton"
      >
        <div className="flex justify-center">
          <div className="flex flex-1 flex-col items-center space-y-3">
            {hasPermission('create_invoice') && (
              <CloneOption
                label={t('invoice')}
                icon={FileText}
                onClick={cloneToInvoice}
              />
            )}

            {hasPermission('create_quote') && (
              <CloneOption
                label={t('quote')}
                icon={File}
                onClick={cloneToQuote}
              />
            )}

            {hasPermission('create_recurring_invoice') && (
              <CloneOption
                label={t('recurring_invoice')}
                icon={Repeat}
                onClick={cloneToRecurringInvoice}
              />
            )}

            {hasPermission('create_purchase_order') && (
              <CloneOption
                label={t('purchase_order')}
                icon={BiFile}
                onClick={cloneToPurchaseOrder}
              />
            )}
          </div>
        </div>
      </Modal>
    </>
  );
}
