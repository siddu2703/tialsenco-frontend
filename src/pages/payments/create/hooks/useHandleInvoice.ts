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
import { v4 } from 'uuid';
import { PaymentOnCreation } from '../Create';

interface Props {
  payment: PaymentOnCreation | undefined;
  setPayment: React.Dispatch<
    React.SetStateAction<PaymentOnCreation | undefined>
  >;
}

export function useHandleInvoice(props: Props) {
  const { payment, setPayment } = props;

  return {
    handleInvoiceChange: (invoice: Invoice) => {
      setPayment(
        (current) =>
          current && {
            ...current,
            invoices: [
              ...current.invoices,
              {
                _id: v4(),
                amount: invoice.balance > 0 ? invoice.balance : invoice.amount,
                invoice_id: invoice.id,
              },
            ],
          }
      );
    },
    handleExistingInvoiceChange: (invoice: Invoice, index: number) => {
      const cloned = { ...payment } as PaymentOnCreation;

      cloned.invoices[index] = {
        _id: v4(),
        amount: invoice.balance > 0 ? invoice.balance : invoice.amount,
        invoice_id: invoice.id,
      };

      setPayment({
        ...cloned,
        // amount: collect(cloned.invoices).sum('amount') as number,
      });
    },
    handleInvoiceInputChange: (index: number, amount: number) => {
      const cloned = { ...payment } as PaymentOnCreation;

      cloned.invoices[index].amount = amount;

      setPayment({
        ...cloned,
        // amount: collect(cloned.invoices).sum('amount') as number,
      });
    },
    handleDeletingInvoice: (id: string) => {
      setPayment(
        (current) =>
          current && {
            ...current,
            invoices: current.invoices.filter((invoice) => invoice._id !== id),
          }
      );
    },
  };
}
