/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { useCurrentCompany } from '$app/common/hooks/useCurrentCompany';
import { useHandleCustomFieldChange } from '$app/common/hooks/useHandleCustomFieldChange';
import { Field } from '$app/pages/settings/custom-fields/components';
import { useTranslation } from 'react-i18next';
import { AdvancedSettingsPlanAlert } from '$app/components/AdvancedSettingsPlanAlert';

export function CustomFields() {
  const [t] = useTranslation();

  const company = useCurrentCompany();

  const handleCustomFieldChange = useHandleCustomFieldChange();

  return (
    <>
      <AdvancedSettingsPlanAlert />

      <div className="px-4 sm:px-6">
        {company &&
          ['user1', 'user2', 'user3', 'user4'].map((field) => (
            <Field
              key={field}
              initialValue={company.custom_fields[field]}
              field={field}
              placeholder={t('user_field')}
              onChange={(value) => handleCustomFieldChange(field, value)}
              withArrowAsSeparator
            />
          ))}
      </div>
    </>
  );
}
