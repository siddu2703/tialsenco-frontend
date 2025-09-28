/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { Credit } from '$app/common/interfaces/credit';
import { v4 } from 'uuid';
import { PaymentOnCreation } from '../Create';

interface Props {
  payment: PaymentOnCreation | undefined;
  setPayment: React.Dispatch<
    React.SetStateAction<PaymentOnCreation | undefined>
  >;
}

export function useHandleCredit(props: Props) {
  const { payment, setPayment } = props;

  return {
    handleCreditChange: (credit: Credit) => {
      setPayment(
        (current) =>
          current && {
            ...current,
            credits: [
              ...current.credits,
              {
                _id: v4(),
                amount: credit.balance > 0 ? credit.balance : credit.amount,
                credit_id: credit.id,
              },
            ],
          }
      );
    },
    handleExistingCreditChange: (credit: Credit, index: number) => {
      const cloned = { ...payment } as PaymentOnCreation;

      cloned.credits[index] = {
        _id: v4(),
        amount: credit.balance > 0 ? credit.balance : credit.amount,
        credit_id: credit.id,
      };

      setPayment({
        ...cloned,
      });
    },
    handleCreditInputChange: (index: number, amount: number) => {
      const cloned = { ...payment } as PaymentOnCreation;

      cloned.credits[index].amount = amount;

      setPayment({
        ...cloned,
      });
    },
    handleDeletingCredit: (id: string) => {
      setPayment(
        (current) =>
          current && {
            ...current,
            credits: current.credits.filter((credit) => credit._id !== id),
          }
      );
    },
  };
}
