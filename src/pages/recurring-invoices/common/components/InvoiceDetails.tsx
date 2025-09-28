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
import { InputField, SelectField } from '$app/components/forms';
import { useCurrentCompany } from '$app/common/hooks/useCurrentCompany';
import { CustomField } from '$app/components/CustomField';
import { useTranslation } from 'react-i18next';
import frequencies from '$app/common/constants/frequency';
import { ChangeHandler } from '../hooks';
import { useAtom } from 'jotai';
import { recurringInvoiceAtom } from '../atoms';
import dayjs from 'dayjs';
import { ValidationBag } from '$app/common/interfaces/validation-bag';
import { NumberInputField } from '$app/components/forms/NumberInputField';
import { useColorScheme } from '$app/common/colors';

interface Props {
  handleChange: ChangeHandler;
  errors: ValidationBag | undefined;
}

export function InvoiceDetails(props: Props) {
  const [t] = useTranslation();

  const { handleChange } = props;

  const colors = useColorScheme();
  const company = useCurrentCompany();

  const [recurringInvoice] = useAtom(recurringInvoiceAtom);

  return (
    <>
      <Card
        className="col-span-12 lg:col-span-6 xl:col-span-4 h-max shadow-sm"
        style={{ borderColor: colors.$24 }}
      >
        <Element leftSide={t('frequency')}>
          <SelectField
            value={recurringInvoice?.frequency_id}
            onValueChange={(value) => handleChange('frequency_id', value)}
            errorMessage={props.errors?.errors.frequency_id}
            customSelector
            dismissable={false}
          >
            {Object.keys(frequencies).map((frequency, index) => (
              <option key={index} value={frequency}>
                {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                {/* @ts-ignore */}
                {t(frequencies[frequency])}
              </option>
            ))}
          </SelectField>
        </Element>

        <Element leftSide={t('start_date')}>
          <InputField
            type="date"
            onValueChange={(value) => handleChange('next_send_date', value)}
            value={dayjs(recurringInvoice?.next_send_date).format('YYYY-MM-DD')}
            min={dayjs().format('YYYY-MM-DD')}
            errorMessage={props.errors?.errors.next_send_date}
          />
        </Element>

        <Element leftSide={t('remaining_cycles')}>
          <SelectField
            value={recurringInvoice?.remaining_cycles?.toString()}
            onValueChange={(value) =>
              handleChange('remaining_cycles', parseInt(value))
            }
            errorMessage={props.errors?.errors.remaining_cycles}
            customSelector
            dismissable={false}
          >
            <option value="-1">{t('endless')}</option>
            {[...Array(37).keys()].map((number, index) => (
              <option value={number.toString()} key={index}>
                {number}
              </option>
            ))}
          </SelectField>
        </Element>

        <Element leftSide={t('due_date')}>
          <SelectField
            value={recurringInvoice?.due_date_days?.toString()}
            onValueChange={(value) => handleChange('due_date_days', value)}
            errorMessage={props.errors?.errors.due_date_days}
            customSelector
            dismissable={false}
          >
            <option value="terms">{t('use_payment_terms')}</option>
            {[...Array(31).keys()].map((number, index) => (
              <option value={(number + 1).toString()} key={index}>
                {t('day')} {number + 1}
              </option>
            ))}
          </SelectField>
        </Element>

        {recurringInvoice && company?.custom_fields?.invoice1 && (
          <CustomField
            field="invoice1"
            defaultValue={recurringInvoice?.custom_value1 || ''}
            value={company.custom_fields.invoice1}
            onValueChange={(value) =>
              handleChange('custom_value1', String(value))
            }
          />
        )}

        {recurringInvoice && company?.custom_fields?.invoice2 && (
          <CustomField
            field="invoice2"
            defaultValue={recurringInvoice?.custom_value2 || ''}
            value={company.custom_fields.invoice2}
            onValueChange={(value) =>
              handleChange('custom_value2', String(value))
            }
          />
        )}
      </Card>

      <Card
        className="col-span-12 lg:col-span-6 xl:col-span-4 h-max shadow-sm"
        style={{ borderColor: colors.$24 }}
      >
        <Element leftSide={t('invoice_number_short')}>
          <InputField
            id="number"
            onValueChange={(value) => handleChange('number', value)}
            value={recurringInvoice?.number || ''}
            errorMessage={props.errors?.errors.number}
          />
        </Element>

        <Element leftSide={t('po_number_short')}>
          <InputField
            id="po_number"
            onValueChange={(value) => handleChange('po_number', value)}
            value={recurringInvoice?.po_number || ''}
            errorMessage={props.errors?.errors.po_number}
          />
        </Element>

        <Element leftSide={t('discount')}>
          <div className="flex space-x-2">
            <div className="w-full lg:w-1/2">
              <SelectField
                onValueChange={(value) =>
                  handleChange('is_amount_discount', JSON.parse(value))
                }
                value={recurringInvoice?.is_amount_discount.toString()}
                errorMessage={props.errors?.errors.is_amount_discount}
                customSelector
                dismissable={false}
              >
                <option value="false">{t('percent')}</option>
                <option value="true">{t('amount')}</option>
              </SelectField>
            </div>

            <div className="w-full lg:w-1/2">
              <NumberInputField
                value={recurringInvoice?.discount || ''}
                onValueChange={(value) =>
                  handleChange('discount', parseFloat(value))
                }
                errorMessage={props.errors?.errors.discount}
              />
            </div>
          </div>
        </Element>

        <Element leftSide={t('auto_bill')}>
          <SelectField
            value={recurringInvoice?.auto_bill || 'always'}
            onValueChange={(value) => handleChange('auto_bill', value)}
            errorMessage={props.errors?.errors.auto_bill}
            customSelector
            dismissable={false}
          >
            <option value="always">{t('enabled')}</option>
            <option value="optout">{t('optout')}</option>
            <option value="optin">{t('optin')}</option>
            <option value="off">{t('disabled')}</option>
          </SelectField>
        </Element>

        {recurringInvoice && company?.custom_fields?.invoice3 && (
          <CustomField
            field="invoice3"
            defaultValue={recurringInvoice?.custom_value3 || ''}
            value={company.custom_fields.invoice3}
            onValueChange={(value) =>
              handleChange('custom_value3', String(value))
            }
          />
        )}

        {recurringInvoice && company?.custom_fields?.invoice4 && (
          <CustomField
            field="invoice4"
            defaultValue={recurringInvoice?.custom_value4 || ''}
            value={company.custom_fields.invoice4}
            onValueChange={(value) =>
              handleChange('custom_value4', String(value))
            }
          />
        )}
      </Card>
    </>
  );
}
