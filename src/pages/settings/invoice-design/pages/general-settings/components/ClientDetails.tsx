/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { Card } from '$app/components/cards';
import { useTranslation } from 'react-i18next';
import { SortableVariableList } from './SortableVariableList';
import { useCustomField } from '$app/components/CustomField';
import { proPlan } from '$app/common/guards/guards/pro-plan';
import { enterprisePlan } from '$app/common/guards/guards/enterprise-plan';
import { AdvancedSettingsPlanAlert } from '$app/components/AdvancedSettingsPlanAlert';
import { useColorScheme } from '$app/common/colors';
import { MsgBubbleUser } from '$app/components/icons/MsgBubbleUser';

export default function ClientDetails() {
  const [t] = useTranslation();

  const colors = useColorScheme();

  const customField = useCustomField();

  const defaultVariables = [
    { value: '$client.name', label: t('client_name') },
    { value: '$client.number', label: t('client_number') },
    { value: '$client.id_number', label: t('id_number') },
    { value: '$client.vat_number', label: t('vat_number') },
    { value: '$client.website', label: t('website') },
    { value: '$client.phone', label: t('phone') },
    { value: '$client.address1', label: t('address1') },
    { value: '$client.address2', label: t('address2') },
    { value: '$client.city_state_postal', label: t('city_state_postal') },
    { value: '$client.postal_city_state', label: t('postal_city_state') },
    { value: '$client.country', label: t('country') },
    {
      value: '$client.custom1',
      label: customField('client1').label() || t('custom1'),
    },
    {
      value: '$client.custom2',
      label: customField('client2').label() || t('custom2'),
    },
    {
      value: '$client.custom3',
      label: customField('client3').label() || t('custom3'),
    },
    {
      value: '$client.custom4',
      label: customField('client4').label() || t('custom4'),
    },
    { value: '$contact.full_name', label: t('contact_full_name') },
    { value: '$contact.email', label: t('contact_email') },
    { value: '$contact.phone', label: t('contact_phone') },
    {
      value: '$contact.custom1',
      label: customField('contact1').label() || t('contact_custom_value1'),
    },
    {
      value: '$contact.custom2',
      label: customField('contact2').label() || t('contact_custom_value2'),
    },
    {
      value: '$contact.custom3',
      label: customField('contact3').label() || t('contact_custom_value3'),
    },
    {
      value: '$contact.custom4',
      label: customField('contact4').label() || t('contact_custom_value4'),
    },
  ];

  return (
    <>
      <AdvancedSettingsPlanAlert />

      <Card
        title={
          <div className="flex items-center space-x-2">
            <div>
              <MsgBubbleUser color="#2176FF" size="1.3rem" fill="#2176FF" />
            </div>

            <span>{t('client_details')}</span>
          </div>
        }
        className="shadow-sm"
        padding="small"
        style={{ borderColor: colors.$24 }}
        headerStyle={{ borderColor: colors.$20 }}
      >
        <SortableVariableList
          for="client_details"
          defaultVariables={defaultVariables}
          disabled={!proPlan() && !enterprisePlan()}
        />
      </Card>
    </>
  );
}
