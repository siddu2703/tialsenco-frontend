/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { Card, Element } from '$app/components/cards';
import { InputField } from '$app/components/forms';
import { useTranslation } from 'react-i18next';
import { RecurringInvoiceContext } from '../../create/Create';
import { useOutletContext } from 'react-router-dom';
import { cloneDeep, get, set } from 'lodash';
import { RecurringInvoice } from '$app/common/interfaces/recurring-invoice';
import { useColorScheme } from '$app/common/colors';

export default function EInvoice() {
  const [t] = useTranslation();

  const colors = useColorScheme();

  const context: RecurringInvoiceContext = useOutletContext();
  const { recurringInvoice, errors, setRecurringInvoice } = context;

  const handleChange = (property: string, value: string | number | boolean) => {
    const updatedInvoice = cloneDeep(recurringInvoice) as RecurringInvoice;

    set(updatedInvoice, property, value);

    setRecurringInvoice(updatedInvoice);
  };

  const getDateValue = (date: 'start' | 'end') => {
    return (
      (
        get(
          recurringInvoice,
          'e_invoice.Invoice.InvoicePeriod.0.Description'
        ) as unknown as string
      )?.split('|')?.[date === 'start' ? 0 : 1] || ''
    );
  };

  return (
    <Card
      title={t('date_range')}
      className="shadow-sm"
      style={{ borderColor: colors.$24 }}
      headerStyle={{ borderColor: colors.$20 }}
    >
      <Element leftSide={t('start_date')}>
        <InputField
          element="textarea"
          value={getDateValue('start')}
          onValueChange={(value) =>
            handleChange(
              'e_invoice.Invoice.InvoicePeriod.0.Description',
              `${value}|${getDateValue('end')}`
            )
          }
          errorMessage={
            errors?.errors?.['e_invoice.InvoicePeriod.Description.0.StartDate']
          }
        />
      </Element>

      <Element leftSide={t('end_date')}>
        <InputField
          element="textarea"
          value={getDateValue('end')}
          onValueChange={(value) =>
            handleChange(
              'e_invoice.Invoice.InvoicePeriod.0.Description',
              `${getDateValue('start')}|${value}`
            )
          }
          errorMessage={
            errors?.errors?.['e_invoice.InvoicePeriod.Description.0.EndDate']
          }
        />
      </Element>
    </Card>
  );
}
