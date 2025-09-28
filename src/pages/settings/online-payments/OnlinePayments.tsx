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

import { useInjectCompanyChanges } from '$app/common/hooks/useInjectCompanyChanges';
import { useTitle } from '$app/common/hooks/useTitle';
import Toggle from '$app/components/forms/Toggle';
import { Settings } from '$app/components/layouts/Settings';
import { useTranslation } from 'react-i18next';
import { Link, SelectField } from '../../../components/forms';
import { useDiscardChanges } from '../common/hooks/useDiscardChanges';
import {
  isCompanySettingsFormBusy,
  useHandleCompanySave,
} from '../common/hooks/useHandleCompanySave';
import { useHandleCurrentCompanyChangeProperty } from '../common/hooks/useHandleCurrentCompanyChange';
import { Gateways } from '../gateways/index/Gateways';
import { usePaymentTermsQuery } from '$app/common/queries/payment-terms';
import { PaymentTerm } from '$app/common/interfaces/payment-term';
import { useEffect, useState } from 'react';
import { updateChanges } from '$app/common/stores/slices/company-users';
import { useDispatch } from 'react-redux';
import { useAtomValue } from 'jotai';
import { companySettingsErrorsAtom } from '../common/atoms';
import { useCurrentSettingsLevel } from '$app/common/hooks/useCurrentSettingsLevel';
import { PropertyCheckbox } from '$app/components/PropertyCheckbox';
import { useDisableSettingsField } from '$app/common/hooks/useDisableSettingsField';
import { SettingsLabel } from '$app/components/SettingsLabel';
import { useStaticsQuery } from '$app/common/queries/statics';
import { NumberInputField } from '$app/components/forms/NumberInputField';
import { useColorScheme } from '$app/common/colors';

export function OnlinePayments() {
  useTitle('online_payments');
  const [t] = useTranslation();

  const dispatch = useDispatch();
  const disableSettingsField = useDisableSettingsField();

  const colors = useColorScheme();
  const company = useInjectCompanyChanges();
  const { data: statics } = useStaticsQuery();
  const errors = useAtomValue(companySettingsErrorsAtom);
  const { data: termsResponse } = usePaymentTermsQuery({});
  const { isCompanySettingsActive } = useCurrentSettingsLevel();
  const isFormBusy = useAtomValue(isCompanySettingsFormBusy);

  const pages = [
    { name: t('settings'), href: '/settings' },
    { name: t('online_payments'), href: '/settings/online_payments' },
  ];

  const [paymentTerms, setPaymentTerms] = useState<PaymentTerm[]>();

  const onCancel = useDiscardChanges();
  const onSave = useHandleCompanySave();
  const handleChangeProperty = useHandleCurrentCompanyChangeProperty();

  const handleToggleChange = (id: string, value: boolean) => {
    dispatch(
      updateChanges({
        object: 'company',
        property: id,
        value,
      })
    );
  };

  useEffect(() => {
    if (termsResponse) {
      setPaymentTerms(termsResponse.data.data);
    }
  }, [termsResponse]);

  return (
    <Settings
      title={t('online_payments')}
      breadcrumbs={pages}
      docsLink="en/basic-settings/#online_payments"
      onSaveClick={onSave}
      onCancelClick={onCancel}
      disableSaveButton={isFormBusy}
    >
      <Gateways />

      <Card
        title={t('settings')}
        className="shadow-sm"
        style={{ borderColor: colors.$24 }}
        headerStyle={{ borderColor: colors.$20 }}
      >
        <Element
          leftSide={
            <PropertyCheckbox
              propertyKey="auto_bill_standard_invoices"
              labelElement={
                <SettingsLabel
                  label={t('auto_bill_standard_invoices')}
                  helpLabel={t('auto_bill_standard_invoices_help')}
                />
              }
              defaultValue={false}
            />
          }
        >
          <Toggle
            checked={Boolean(company?.settings?.auto_bill_standard_invoices)}
            onChange={(value) =>
              handleChangeProperty(
                'settings.auto_bill_standard_invoices',
                value
              )
            }
            disabled={disableSettingsField('auto_bill_standard_invoices')}
          />
        </Element>

        <Element
          leftSide={
            <PropertyCheckbox
              propertyKey="auto_bill"
              labelElement={
                <SettingsLabel
                  label={`${t('auto_bill')} ${t('recurring_invoices')}`}
                />
              }
              defaultValue="off"
            />
          }
        >
          <SelectField
            value={company?.settings.auto_bill || 'off'}
            onValueChange={(value) =>
              handleChangeProperty('settings.auto_bill', value)
            }
            disabled={disableSettingsField('auto_bill')}
            errorMessage={errors?.errors['settings.auto_bill']}
            customSelector
            dismissable={false}
          >
            <option value="always">
              {t('enabled')} ({t('auto_bill_help_always')})
            </option>
            <option value="optout">
              {t('optout')} ({t('auto_bill_help_optout')})
            </option>
            <option value="optin">
              {t('optin')} ({t('auto_bill_help_optin')})
            </option>
            <option value="off">
              {t('disabled')} ({t('auto_bill_help_off')})
            </option>
          </SelectField>
        </Element>

        <Element
          leftSide={
            <PropertyCheckbox
              propertyKey="auto_bill_date"
              labelElement={
                <SettingsLabel
                  label={t('auto_bill_on')}
                  helpLabel={t('auto_bill_on_help')}
                />
              }
              defaultValue="on_send_date"
            />
          }
        >
          <SelectField
            value={company?.settings.auto_bill_date || 'on_send_date'}
            onValueChange={(value) =>
              handleChangeProperty('settings.auto_bill_date', value)
            }
            disabled={disableSettingsField('auto_bill_date')}
            errorMessage={errors?.errors['settings.auto_bill_date']}
            customSelector
            dismissable={false}
          >
            <option value="on_send_date">{t('send_date')}</option>
            <option value="on_due_date">{t('due_date')}</option>
          </SelectField>
        </Element>

        <Element
          leftSide={
            <PropertyCheckbox
              propertyKey="use_credits_payment"
              labelElement={
                <SettingsLabel
                  label={t('use_available_credits')}
                  helpLabel={t('use_available_credits_help')}
                />
              }
              defaultValue="off"
            />
          }
        >
          <SelectField
            value={company?.settings.use_credits_payment || 'off'}
            onValueChange={(value) =>
              handleChangeProperty('settings.use_credits_payment', value)
            }
            disabled={disableSettingsField('use_credits_payment')}
            errorMessage={errors?.errors['settings.use_credits_payment']}
            customSelector
            dismissable={false}
          >
            <option value="always">{t('enabled')}</option>
            <option value="option">{t('show_option')}</option>
            <option value="off">{t('off')}</option>
          </SelectField>
        </Element>

        <Element
          leftSide={
            <PropertyCheckbox
              propertyKey="use_unapplied_payment"
              labelElement={
                <SettingsLabel
                  label={t('use_unapplied_payments')}
                  helpLabel={t('use_unapplied_payments_help')}
                />
              }
              defaultValue="off"
            />
          }
        >
          <SelectField
            value={company?.settings.use_unapplied_payment || 'off'}
            onValueChange={(value) =>
              handleChangeProperty('settings.use_unapplied_payment', value)
            }
            disabled={disableSettingsField('use_unapplied_payment')}
            errorMessage={errors?.errors['settings.use_unapplied_payment']}
            customSelector
            dismissable={false}
          >
            <option value="always">{t('enabled')}</option>
            <option value="option">{t('show_option')}</option>
            <option value="off">{t('off')}</option>
          </SelectField>
        </Element>

        {paymentTerms && (
          <Element
            leftSide={
              <PropertyCheckbox
                propertyKey="payment_terms"
                labelElement={
                  <SettingsLabel
                    label={
                      <div className="flex items-center space-x-1 whitespace-nowrap">
                        <span className="text-sm" style={{ color: colors.$3 }}>
                          {t('payment_terms')}
                        </span>

                        <div className="flex">
                          <span
                            className="text-sm"
                            style={{ color: colors.$3 }}
                          >
                            (
                          </span>

                          <Link to="/settings/payment_terms">
                            {t('configure')}
                          </Link>

                          <span
                            className="text-sm"
                            style={{ color: colors.$3 }}
                          >
                            )
                          </span>
                        </div>
                      </div>
                    }
                    helpLabel={t('payment_terms_help')}
                  />
                }
              />
            }
          >
            <SelectField
              value={company?.settings?.payment_terms || ''}
              onValueChange={(value) =>
                handleChangeProperty('settings.payment_terms', value)
              }
              disabled={disableSettingsField('payment_terms')}
              errorMessage={errors?.errors['settings.payment_terms']}
              customSelector
              withBlank
            >
              {paymentTerms.map((type: PaymentTerm) => (
                <option key={type.id} value={type.num_days.toString()}>
                  {type.name}
                </option>
              ))}
            </SelectField>
          </Element>
        )}

        <Element
          leftSide={
            <PropertyCheckbox
              propertyKey="payment_type_id"
              labelElement={
                <SettingsLabel
                  label={t('payment_type')}
                  helpLabel={t('payment_type_help')}
                />
              }
            />
          }
        >
          <SelectField
            value={company?.settings?.payment_type_id || '0'}
            onValueChange={(value) =>
              handleChangeProperty('settings.payment_type_id', value)
            }
            blankOptionValue="0"
            disabled={disableSettingsField('payment_type_id')}
            withBlank
            errorMessage={errors?.errors['settings.payment_type_id']}
            customSelector
          >
            {statics?.payment_types.map(
              (type: { id: string; name: string }) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              )
            )}
          </SelectField>
        </Element>

        <Element
          leftSide={
            <PropertyCheckbox
              propertyKey="valid_until"
              labelElement={
                <SettingsLabel
                  label={t('quote_valid_until')}
                  helpLabel={t('quote_valid_until_help')}
                />
              }
            />
          }
        >
          <SelectField
            value={company?.settings?.valid_until || ''}
            onValueChange={(value) =>
              handleChangeProperty('settings.valid_until', value)
            }
            disabled={disableSettingsField('valid_until')}
            withBlank
            errorMessage={errors?.errors['settings.valid_until']}
            customSelector
          >
            {paymentTerms?.map((type: PaymentTerm) => (
              <option key={type.id} value={type.num_days.toString()}>
                {type.name}
              </option>
            ))}
          </SelectField>
        </Element>

        <Element
          leftSide={
            <PropertyCheckbox
              propertyKey="default_expense_payment_type_id"
              labelElement={
                <SettingsLabel
                  label={t('expense_payment_type')}
                  helpLabel={t('expense_payment_type_help')}
                />
              }
            />
          }
        >
          <SelectField
            value={company?.settings?.default_expense_payment_type_id || ''}
            onValueChange={(value) =>
              handleChangeProperty(
                'settings.default_expense_payment_type_id',
                value
              )
            }
            disabled={disableSettingsField('default_expense_payment_type_id')}
            blankOptionValue="0"
            withBlank
            errorMessage={
              errors?.errors['settings.default_expense_payment_type_id']
            }
            customSelector
          >
            {statics?.payment_types.map(
              (type: { id: string; name: string }) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              )
            )}
          </SelectField>
        </Element>

        <Element
          leftSideHelp={t('manual_payment_email_help')}
          leftSide={
            <PropertyCheckbox
              propertyKey="client_manual_payment_notification"
              labelElement={<SettingsLabel label={t('manual_payment_email')} />}
              defaultValue={false}
            />
          }
        >
          <Toggle
            checked={Boolean(
              company?.settings.client_manual_payment_notification
            )}
            onChange={(value: boolean) =>
              handleToggleChange(
                'settings.client_manual_payment_notification',
                value
              )
            }
            disabled={disableSettingsField(
              'client_manual_payment_notification'
            )}
          />
        </Element>

        <Element
          leftSideHelp={t('online_payment_email_help')}
          leftSide={
            <PropertyCheckbox
              propertyKey="client_online_payment_notification"
              labelElement={<SettingsLabel label={t('online_payment_email')} />}
              defaultValue={false}
            />
          }
        >
          <Toggle
            checked={Boolean(
              company?.settings.client_online_payment_notification
            )}
            onChange={(value: boolean) =>
              handleToggleChange(
                'settings.client_online_payment_notification',
                value
              )
            }
            disabled={disableSettingsField(
              'client_online_payment_notification'
            )}
          />
        </Element>

        <Element
          leftSide={
            <PropertyCheckbox
              propertyKey="send_email_on_mark_paid"
              labelElement={
                <SettingsLabel
                  label={t('mark_paid_payment_email')}
                  helpLabel={t('mark_paid_payment_email_help')}
                />
              }
              defaultValue={false}
            />
          }
        >
          <Toggle
            checked={Boolean(company?.settings.send_email_on_mark_paid)}
            onChange={(value: boolean) =>
              handleToggleChange('settings.send_email_on_mark_paid', value)
            }
            disabled={disableSettingsField('send_email_on_mark_paid')}
          />
        </Element>

        {isCompanySettingsActive && (
          <Element
            leftSide={t('enable_applying_payments')}
            leftSideHelp={t('enable_applying_payments_help')}
          >
            <Toggle
              id="allow_over_payment"
              checked={Boolean(company?.enable_applying_payments)}
              onChange={(value) =>
                handleChangeProperty('enable_applying_payments', value)
              }
            />
          </Element>
        )}

        <Element
          leftSide={
            <PropertyCheckbox
              propertyKey="client_portal_allow_over_payment"
              labelElement={<SettingsLabel label={t('allow_over_payment')} />}
              defaultValue={false}
            />
          }
          leftSideHelp={t('allow_over_payment_help')}
        >
          <Toggle
            id="allow_over_payment"
            checked={Boolean(
              company?.settings.client_portal_allow_over_payment
            )}
            onChange={(value) =>
              handleChangeProperty(
                'settings.client_portal_allow_over_payment',
                value
              )
            }
            disabled={disableSettingsField('client_portal_allow_over_payment')}
          />
        </Element>

        <Element
          leftSide={
            <PropertyCheckbox
              propertyKey="client_portal_allow_under_payment"
              labelElement={<SettingsLabel label={t('allow_under_payment')} />}
              defaultValue={false}
            />
          }
          leftSideHelp={t('allow_under_payment_help')}
        >
          <Toggle
            id="allow_under_payment"
            checked={Boolean(
              company?.settings.client_portal_allow_under_payment
            )}
            onChange={(value) =>
              handleChangeProperty(
                'settings.client_portal_allow_under_payment',
                value
              )
            }
            disabled={disableSettingsField('client_portal_allow_under_payment')}
          />
        </Element>
        {company?.settings.client_portal_allow_under_payment && (
          <Element
            leftSide={
              <PropertyCheckbox
                propertyKey="client_portal_under_payment_minimum"
                labelElement={
                  <SettingsLabel label={t('minimum_under_payment_amount')} />
                }
              />
            }
          >
            <NumberInputField
              value={
                company?.settings.client_portal_under_payment_minimum || ''
              }
              onValueChange={(value) =>
                handleChangeProperty(
                  'settings.client_portal_under_payment_minimum',
                  parseFloat(value) || 0
                )
              }
              disabled={disableSettingsField(
                'client_portal_under_payment_minimum'
              )}
              errorMessage={
                errors?.errors['settings.client_portal_under_payment_minimum']
              }
            />
          </Element>
        )}

        <Element
          leftSide={
            <PropertyCheckbox
              propertyKey="client_initiated_payments"
              labelElement={
                <SettingsLabel label={t('client_initiated_payments')} />
              }
              defaultValue={false}
            />
          }
          leftSideHelp={t('client_initiated_payments_help')}
        >
          <Toggle
            id="client_initiated_payments"
            checked={Boolean(company?.settings.client_initiated_payments)}
            onChange={(value) =>
              handleChangeProperty('settings.client_initiated_payments', value)
            }
            disabled={disableSettingsField('client_initiated_payments')}
          />
        </Element>

        {company?.settings.client_initiated_payments && (
          <Element
            leftSide={
              <PropertyCheckbox
                propertyKey="client_initiated_payments_minimum"
                labelElement={
                  <SettingsLabel label={t('minimum_payment_amount')} />
                }
              />
            }
          >
            <NumberInputField
              value={company?.settings.client_initiated_payments_minimum || ''}
              onValueChange={(value) =>
                handleChangeProperty(
                  'settings.client_initiated_payments_minimum',
                  parseFloat(value)
                )
              }
              disabled={disableSettingsField(
                'client_initiated_payments_minimum'
              )}
              errorMessage={
                errors?.errors['settings.client_initiated_payments_minimum']
              }
            />
          </Element>
        )}

        <Element
          leftSide={
            <PropertyCheckbox
              propertyKey="payment_email_all_contacts"
              labelElement={
                <SettingsLabel label={t('payment_email_all_contacts')} />
              }
              defaultValue={false}
            />
          }
          leftSideHelp={t('payment_email_all_contacts_help')}
        >
          <Toggle
            id="payment_email_all_contacts"
            checked={Boolean(company?.settings.payment_email_all_contacts)}
            onChange={(value) =>
              handleChangeProperty('settings.payment_email_all_contacts', value)
            }
            disabled={disableSettingsField('payment_email_all_contacts')}
          />
        </Element>

        <Element
          leftSide={
            <PropertyCheckbox
              propertyKey="payment_flow"
              labelElement={<SettingsLabel label={t('one_page_checkout')} />}
              defaultValue={false}
            />
          }
          leftSideHelp={t('one_page_checkout_help')}
        >
          <Toggle
            id="payment_flow"
            checked={Boolean(company?.settings.payment_flow === 'smooth')}
            onChange={(value) =>
              handleChangeProperty(
                'settings.payment_flow',
                value ? 'smooth' : 'default'
              )
            }
            disabled={disableSettingsField('payment_flow')}
          />
        </Element>

        <Element
          leftSide={
            <PropertyCheckbox
              propertyKey="unlock_invoice_documents_after_payment"
              labelElement={
                <SettingsLabel
                  label={t('unlock_invoice_documents_after_payment')}
                />
              }
              defaultValue={false}
            />
          }
          leftSideHelp={t('unlock_invoice_documents_after_payment_help')}
        >
          <Toggle
            id="unlock_invoice_documents_after_payment"
            checked={Boolean(
              company?.settings.unlock_invoice_documents_after_payment
            )}
            onChange={(value) =>
              handleChangeProperty(
                'settings.unlock_invoice_documents_after_payment',
                value
              )
            }
            disabled={disableSettingsField(
              'unlock_invoice_documents_after_payment'
            )}
          />
        </Element>
      </Card>
    </Settings>
  );
}
