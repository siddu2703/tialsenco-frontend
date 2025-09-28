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
import { Invoice } from '$app/common/interfaces/invoice';
import { ValidationBag } from '$app/common/interfaces/validation-bag';
import { CustomField } from '$app/components/CustomField';
import { ChangeHandler } from '$app/pages/invoices/create/Create';
import { useTranslation } from 'react-i18next';
import { NumberInputField } from '$app/components/forms/NumberInputField';
import { useColorScheme } from '$app/common/colors';

interface Props {
  invoice?: Invoice;
  handleChange: ChangeHandler;
  errors: ValidationBag | undefined;
}

export function InvoiceDetails(props: Props) {
  const [t] = useTranslation();

  const { invoice, handleChange } = props;

  const colors = useColorScheme();
  const company = useCurrentCompany();

  return (
    <>
      <Card
        className="col-span-12 lg:col-span-6 xl:col-span-4 shadow-sm h-max"
        style={{ borderColor: colors.$24 }}
      >
        <Element leftSide={t('invoice_date')}>
          <InputField
            type="date"
            onValueChange={(value) => handleChange('date', value)}
            value={invoice?.date || ''}
            errorMessage={props.errors?.errors.date}
          />
        </Element>

        <Element leftSide={t('due_date')}>
          <InputField
            type="date"
            onValueChange={(value) => handleChange('due_date', value)}
            value={invoice?.due_date || ''}
            errorMessage={props.errors?.errors.due_date}
          />
        </Element>

        <Element leftSide={t('partial')}>
          <NumberInputField
            value={invoice?.partial || ''}
            onValueChange={(value) =>
              handleChange('partial', parseFloat(value) || 0)
            }
            changeOverride
            errorMessage={props.errors?.errors.partial}
          />
        </Element>

        {invoice && invoice.partial > 0 && (
          <Element leftSide={t('partial_due_date')}>
            <InputField
              type="date"
              onValueChange={(value) => handleChange('partial_due_date', value)}
              value={invoice?.partial_due_date || ''}
              errorMessage={props.errors?.errors.partial_due_date}
            />
          </Element>
        )}

        {invoice && company?.custom_fields?.invoice1 && (
          <CustomField
            field="invoice1"
            defaultValue={invoice?.custom_value1 || ''}
            value={company.custom_fields.invoice1}
            onValueChange={(value) =>
              handleChange('custom_value1', value.toString())
            }
          />
        )}

        {invoice && company?.custom_fields?.invoice2 && (
          <CustomField
            field="invoice2"
            defaultValue={invoice?.custom_value2 || ''}
            value={company.custom_fields.invoice2}
            onValueChange={(value) =>
              handleChange('custom_value2', value.toString())
            }
          />
        )}
      </Card>

      <Card
        className="col-span-12 lg:col-span-6 xl:col-span-4 shadow-sm h-max"
        style={{ borderColor: colors.$24 }}
      >
        <Element leftSide={t('invoice_number_short')}>
          <InputField
            id="number"
            onValueChange={(value) => handleChange('number', value)}
            value={invoice?.number || ''}
            errorMessage={props.errors?.errors.number}
          />
        </Element>

        <Element leftSide={t('po_number_short')}>
          <InputField
            id="po_number"
            onValueChange={(value) => handleChange('po_number', value)}
            value={invoice?.po_number || ''}
            errorMessage={props.errors?.errors.po_number}
          />
        </Element>

        <Element leftSide={t('discount')}>
          <div className="flex space-x-2">
            <div className="w-full lg:w-1/2">
              <SelectField
                className="shadow-sm"
                onValueChange={(value) =>
                  handleChange('is_amount_discount', JSON.parse(value))
                }
                value={invoice?.is_amount_discount.toString()}
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
                onValueChange={(value) =>
                  handleChange('discount', parseFloat(value) || 0)
                }
                value={invoice?.discount || ''}
                errorMessage={props.errors?.errors.discount}
              />
            </div>
          </div>
        </Element>

        {invoice && company?.custom_fields?.invoice3 && (
          <CustomField
            field="invoice3"
            defaultValue={invoice?.custom_value3 || ''}
            value={company.custom_fields.invoice3}
            onValueChange={(value) =>
              handleChange('custom_value3', value.toString())
            }
          />
        )}

        {invoice && company?.custom_fields?.invoice4 && (
          <CustomField
            field="invoice4"
            defaultValue={invoice?.custom_value4 || ''}
            value={company.custom_fields.invoice4}
            onValueChange={(value) =>
              handleChange('custom_value4', value.toString())
            }
          />
        )}
      </Card>
    </>
  );
}
