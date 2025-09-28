/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { useTranslation } from 'react-i18next';
import { Link } from '$app/components/forms';
import { route } from '$app/common/helpers/route';
import reactStringReplace from 'react-string-replace';
import { PaymentActivity } from '$app/common/interfaces/payment-activity';
import { trans } from '$app/common/helpers';

export function useGenerateActivityElement() {
  const [t] = useTranslation();

  return (activity: PaymentActivity) => {
    let text = trans(`activity_${activity.activity_type_id}`, {});

    const replacements = {
      client: (
        <Link to={route('/clients/:id', { id: activity.client?.hashed_id })}>
          {activity.client?.label}
        </Link>
      ),
      user: activity.user?.label ?? t('system'),
      payment_amount: activity?.payment_amount?.label,
      adjustment: activity?.adjustment?.label,
      invoice: (
        <Link
          to={route('/invoices/:id/edit', {
            id: activity.invoice?.hashed_id,
          })}
        >
          {activity?.invoice?.label}
        </Link>
      ),
      payment: (
        <Link
          to={route('/payments/:id/edit', {
            id: activity.payment?.hashed_id,
          })}
        >
          {activity?.payment?.label}
        </Link>
      ),
      contact: (
        <Link
          to={route('/clients/:id/edit', {
            id: activity?.contact?.hashed_id,
          })}
        >
          {activity?.contact?.label}
        </Link>
      ),
    };
    for (const [variable, value] of Object.entries(replacements)) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      text = reactStringReplace(text, `:${variable}`, () => value);
    }

    return text;
  };
}
