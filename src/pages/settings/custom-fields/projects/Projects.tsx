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
import { useTitle } from '$app/common/hooks/useTitle';
import { Field } from '../components/Field';
import { useHandleCustomFieldChange } from '$app/common/hooks/useHandleCustomFieldChange';
import { useCompanyChanges } from '$app/common/hooks/useCompanyChanges';

export function Projects() {
  useTitle('custom_fields');

  const [t] = useTranslation();

  const company = useCompanyChanges();
  const handleChange = useHandleCustomFieldChange();

  if (!company) {
    return null;
  }

  return (
    <div className="px-4 sm:px-6">
      {['project1', 'project2', 'project3', 'project4'].map((field) => (
        <Field
          key={field}
          field={field}
          placeholder={t('project_field')}
          onChange={(value) => handleChange(field, value)}
          initialValue={company.custom_fields[field]}
          withArrowAsSeparator
        />
      ))}
    </div>
  );
}
