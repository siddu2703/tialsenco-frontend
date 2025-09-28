/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { endpoint, isHosted, isSelfHosted } from '$app/common/helpers';
import { useCompanyChanges } from '$app/common/hooks/useCompanyChanges';
import { Divider } from '$app/components/cards/Divider';
import { CopyToClipboard } from '$app/components/CopyToClipboard';
import { useHandleCurrentCompanyChangeProperty } from '$app/pages/settings/common/hooks/useHandleCurrentCompanyChange';
import { useTranslation } from 'react-i18next';
import { Element } from '../../../../components/cards';
import { InputField, Link, SelectField } from '../../../../components/forms';
import Toggle from '../../../../components/forms/Toggle';
import { useAtom } from 'jotai';
import { companySettingsErrorsAtom } from '../../common/atoms';
import { request } from '$app/common/helpers/request';
import { useState } from 'react';
import { useInjectCompanyChanges } from '$app/common/hooks/useInjectCompanyChanges';
import { useCurrentSettingsLevel } from '$app/common/hooks/useCurrentSettingsLevel';
import classNames from 'classnames';
import { PropertyCheckbox } from '$app/components/PropertyCheckbox';
import { useDisableSettingsField } from '$app/common/hooks/useDisableSettingsField';
import { SettingsLabel } from '$app/components/SettingsLabel';
import { enterprisePlan } from '$app/common/guards/guards/enterprise-plan';
import { freePlan } from '$app/common/guards/guards/free-plan';
import { useColorScheme } from '$app/common/colors';

export function Settings() {
  const [t] = useTranslation();

  useInjectCompanyChanges();

  const { isCompanySettingsActive } = useCurrentSettingsLevel();

  const colors = useColorScheme();
  const company = useCompanyChanges();

  const disableSettingsField = useDisableSettingsField();

  const handleChange = useHandleCurrentCompanyChangeProperty();

  const [errors, setErrors] = useAtom(companySettingsErrorsAtom);
  const [subdomainValidation, setSubdomainValidation] = useState('');

  const checkSubdomain = (value: string) => {
    handleChange('subdomain', value);

    setErrors(undefined);
    request('POST', endpoint('/api/v1/check_subdomain'), {
      subdomain: value,
    })
      .then(() => {
        setSubdomainValidation('');
      })
      .catch(() => {
        setSubdomainValidation(t('subdomain_is_not_available') ?? '');
      });
  };

  return (
    <>
      {isHosted() && isCompanySettingsActive && (
        <>
          <Element
            leftSide={t('portal_mode')}
            leftSideHelp={t('subdomain_guide')}
          >
            <div className="flex flex-col space-y-2">
              <SelectField
                disabled={!enterprisePlan()}
                id="portal_mode"
                value={company?.portal_mode || 'subdomain'}
                onValueChange={(value) => handleChange('portal_mode', value)}
                errorMessage={errors?.errors.portal_mode}
              >
                <option value="subdomain" key="subdomain">
                  {t('subdomain')}
                </option>
                <option value="domain" key="domain">
                  {t('domain')}
                </option>
              </SelectField>

              {!enterprisePlan() && (
                <span className="text-xs font-medium">
                  * {t('requires_an_enterprise_plan')}
                </span>
              )}
            </div>
          </Element>

          {company?.portal_mode === 'subdomain' && (
            <Element leftSide={t('subdomain')}>
              <InputField
                value={company?.subdomain || ''}
                disabled={freePlan()}
                onValueChange={(value) => checkSubdomain(value)}
                errorMessage={errors?.errors.subdomain ?? subdomainValidation}
              />
            </Element>
          )}

          {company?.portal_mode === 'domain' && (
            <Element
              leftSide={t('domain_url')}
              leftSideHelp="custom domain info"
            >
              <InputField
                value={company?.portal_domain || ''}
                onValueChange={(value) => handleChange('portal_domain', value)}
                errorMessage={errors?.errors.portal_domain}
              />
            </Element>
          )}
        </>
      )}

      {isSelfHosted() && isCompanySettingsActive && (
        <Element leftSide={t('domain_url')}>
          <InputField
            value={company?.portal_domain || ''}
            onValueChange={(value) => handleChange('portal_domain', value)}
            errorMessage={errors?.errors.portal_domain}
          />
        </Element>
      )}

      {isCompanySettingsActive && (
        <Element
          leftSide={
            <div className="flex items-center space-x-1">
              <span>
                {t('login')} {t('url')}
              </span>

              {Boolean(isHosted() && company.portal_mode === 'domain') && (
                <div className="flex items-center space-x-0.5">
                  <span>(</span>

                  <Link
                    to="https://tilsenco.github.io/en/hosted-custom-domain/#custom-domain-configuration"
                    external
                    withoutExternalIcon
                  >
                    {t('app_help_link')}
                  </Link>

                  <span>)</span>
                </div>
              )}
            </div>
          }
        >
          <div className="flex flex-col space-y-1">
            {isSelfHosted() && (
              <CopyToClipboard
                className="break-all"
                text={`${company?.portal_domain}/client/login/${company?.company_key}`}
              />
            )}

            {Boolean(isHosted() && company.portal_mode === 'domain') && (
              <CopyToClipboard
                className="break-all"
                text={`${company?.portal_domain}/client/login`}
              />
            )}

            {Boolean(isHosted() && company.portal_mode === 'subdomain') && (
              <CopyToClipboard
                className="break-all"
                text={`${company?.subdomain}.invoicing.co/client/login`}
              />
            )}
          </div>
        </Element>
      )}

      {isCompanySettingsActive && (
        <div className="px-4 sm:px-6 pt-5">
          <Divider
            className="border-dashed"
            borderColor={colors.$20}
            withoutPadding
          />
        </div>
      )}

      <Element
        className={classNames({ 'mt-4': isCompanySettingsActive })}
        leftSide={
          <PropertyCheckbox
            propertyKey="enable_client_portal"
            labelElement={<SettingsLabel label={t('client_portal')} />}
            defaultValue={false}
          />
        }
      >
        <Toggle
          checked={Boolean(company?.settings.enable_client_portal)}
          onValueChange={(value) =>
            handleChange('settings.enable_client_portal', value)
          }
          disabled={disableSettingsField('enable_client_portal')}
        />
      </Element>

      <Element
        leftSide={
          <PropertyCheckbox
            propertyKey="client_portal_enable_uploads"
            labelElement={
              <SettingsLabel
                label={t('client_document_upload')}
                helpLabel={t('document_upload_help')}
              />
            }
            defaultValue={false}
          />
        }
      >
        <Toggle
          checked={Boolean(company?.settings.client_portal_enable_uploads)}
          onValueChange={(value) =>
            handleChange('settings.client_portal_enable_uploads', value)
          }
          disabled={disableSettingsField('client_portal_enable_uploads')}
        />
      </Element>

      <Element
        leftSide={
          <PropertyCheckbox
            propertyKey="vendor_portal_enable_uploads"
            labelElement={
              <SettingsLabel
                label={t('vendor_document_upload')}
                helpLabel={t('vendor_document_upload_help')}
              />
            }
            defaultValue={false}
          />
        }
      >
        <Toggle
          checked={Boolean(company?.settings.vendor_portal_enable_uploads)}
          onValueChange={(value) =>
            handleChange('settings.vendor_portal_enable_uploads', value)
          }
          disabled={disableSettingsField('vendor_portal_enable_uploads')}
        />
      </Element>

      <Element
        leftSide={
          <PropertyCheckbox
            propertyKey="accept_client_input_quote_approval"
            labelElement={
              <SettingsLabel
                label={t('accept_purchase_order_number')}
                helpLabel={t('accept_purchase_order_number_help')}
              />
            }
            defaultValue={false}
          />
        }
      >
        <Toggle
          checked={Boolean(
            company?.settings.accept_client_input_quote_approval
          )}
          onValueChange={(value) =>
            handleChange('settings.accept_client_input_quote_approval', value)
          }
          disabled={disableSettingsField('accept_client_input_quote_approval')}
        />
      </Element>

      <Element
        leftSide={t('show_pdfhtml_on_mobile')}
        leftSideHelp={t('show_pdfhtml_on_mobile_help')}
      >
        <Toggle
          checked={Boolean(company?.settings?.show_pdfhtml_on_mobile)}
          onValueChange={(value) =>
            handleChange('settings.show_pdfhtml_on_mobile', value)
          }
          disabled={disableSettingsField('show_pdfhtml_on_mobile')}
        />
      </Element>

      {company?.settings?.show_pdfhtml_on_mobile && (
        <Element
          leftSide={t('preference_product_notes_for_html_view')}
          leftSideHelp={t('preference_product_notes_for_html_view_help')}
        >
          <Toggle
            checked={Boolean(
              company?.settings?.preference_product_notes_for_html_view
            )}
            onValueChange={(value) =>
              handleChange(
                'settings.preference_product_notes_for_html_view',
                value
              )
            }
          />
        </Element>
      )}

      <Element
        leftSide={t('enable_client_portal_dashboard')}
        leftSideHelp={t('enable_client_portal_dashboard_help')}
      >
        <Toggle
          checked={Boolean(company?.settings?.enable_client_portal_dashboard)}
          onValueChange={(value) =>
            handleChange('settings.enable_client_portal_dashboard', value)
          }
        />
      </Element>

      <Element
        leftSide={t('enable_client_profile_update')}
        leftSideHelp={t('enable_client_profile_update_help')}
      >
        <Toggle
          checked={Boolean(company?.settings?.enable_client_profile_update)}
          onValueChange={(value) =>
            handleChange('settings.enable_client_profile_update', value)
          }
        />
      </Element>

      {/* <Element leftSide={t('storefront')} leftSideHelp={t('storefront_help')}>
        <Toggle />
      </Element> */}

      <div className="px-4 sm:px-6 pt-4 pb-2">
        <Divider
          className="border-dashed"
          borderColor={colors.$20}
          withoutPadding
        />
      </div>

      <Element
        className="mt-4"
        leftSide={
          <PropertyCheckbox
            propertyKey="client_portal_terms"
            labelElement={<SettingsLabel label={t('terms_of_service')} />}
          />
        }
      >
        <InputField
          element="textarea"
          onValueChange={(value) =>
            handleChange('settings.client_portal_terms', value)
          }
          value={company?.settings.client_portal_terms || ''}
          disabled={disableSettingsField('client_portal_terms')}
          errorMessage={errors?.errors['settings.client_portal_terms']}
        />
      </Element>

      <Element
        leftSide={
          <PropertyCheckbox
            propertyKey="client_portal_privacy_policy"
            labelElement={<SettingsLabel label={t('privacy_policy')} />}
          />
        }
      >
        <InputField
          element="textarea"
          onValueChange={(value) =>
            handleChange('settings.client_portal_privacy_policy', value)
          }
          value={company?.settings.client_portal_privacy_policy || ''}
          disabled={disableSettingsField('client_portal_privacy_policy')}
          errorMessage={errors?.errors['settings.client_portal_privacy_policy']}
        />
      </Element>
    </>
  );
}
