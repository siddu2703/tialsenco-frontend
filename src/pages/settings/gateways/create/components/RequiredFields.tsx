/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { Element } from '$app/components/cards';
import { CompanyGateway } from '$app/common/interfaces/company-gateway';
import { Gateway } from '$app/common/interfaces/statics';
import { Divider } from '$app/components/cards/Divider';
import Toggle from '$app/components/forms/Toggle';
import { useTranslation } from 'react-i18next';
import { useColorScheme } from '$app/common/colors';

interface Props {
  gateway: Gateway;
  companyGateway: CompanyGateway;
  setCompanyGateway: React.Dispatch<
    React.SetStateAction<CompanyGateway | undefined>
  >;
}

export function RequiredFields(props: Props) {
  const [t] = useTranslation();

  const colors = useColorScheme();

  const handleChange = (property: keyof CompanyGateway, value: boolean) => {
    props.setCompanyGateway(
      (current) => current && { ...current, [property]: value }
    );
  };

  return (
    <>
      <Element leftSide={t('client_name')}>
        <Toggle
          checked={props.companyGateway.require_client_name}
          onChange={(value) => handleChange('require_client_name', value)}
        />
      </Element>

      <Element leftSide={t('client_phone')}>
        <Toggle
          checked={props.companyGateway.require_client_phone}
          onChange={(value) => handleChange('require_client_phone', value)}
        />
      </Element>

      <Element leftSide={t('contact_name')}>
        <Toggle
          checked={props.companyGateway.require_contact_name}
          onChange={(value) => handleChange('require_contact_name', value)}
        />
      </Element>

      <Element leftSide={t('contact_email')}>
        <Toggle
          checked={props.companyGateway.require_contact_email}
          onChange={(value) => handleChange('require_contact_email', value)}
        />
      </Element>

      <Element leftSide={t('postal_code')}>
        <Toggle
          checked={props.companyGateway.require_postal_code}
          onChange={(value) => handleChange('require_postal_code', value)}
        />
      </Element>

      <Element leftSide={t('cvv')}>
        <Toggle
          checked={props.companyGateway.require_cvv}
          onChange={(value) => handleChange('require_cvv', value)}
        />
      </Element>

      <Element leftSide={t('billing_address')}>
        <Toggle
          checked={props.companyGateway.require_billing_address}
          onChange={(value) => handleChange('require_billing_address', value)}
        />
      </Element>

      <Element leftSide={t('shipping_address')}>
        <Toggle
          checked={props.companyGateway.require_shipping_address}
          onChange={(value) => handleChange('require_shipping_address', value)}
        />
      </Element>

      <div className="px-4 sm:px-6 pt-4 pb-4">
        <Divider
          className="border-dashed"
          withoutPadding
          borderColor={colors.$20}
        />
      </div>

      <Element leftSide={t('update_address')}>
        <Toggle
          label={t('update_address_help')}
          checked={props.companyGateway.update_details}
          onChange={(value) => handleChange('update_details', value)}
        />
      </Element>

      <Element leftSide={t('always_show_required_fields')}>
        <Toggle
          label={t('always_show_required_fields_help')}
          checked={props.companyGateway.always_show_required_fields ?? true}
          onChange={(value) =>
            handleChange('always_show_required_fields', value)
          }
        />
      </Element>
    </>
  );
}
