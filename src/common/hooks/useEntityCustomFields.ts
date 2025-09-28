/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { customField } from '$app/components/CustomField';
import { useTranslation } from 'react-i18next';
import { useCurrentCompany } from './useCurrentCompany';

export type Entity =
  | 'company'
  | 'client'
  | 'contact'
  | 'product'
  | 'invoice'
  | 'payment'
  | 'project'
  | 'task'
  | 'vendor'
  | 'expense';

interface Params {
  entity: Entity;
}

export function useEntityCustomFields(params: Params) {
  const [t] = useTranslation();
  const company = useCurrentCompany();
  const customFields = company?.custom_fields;

  const { entity } = params;

  const fields: string[] = [];

  if (customFields) {
    for (let i = 1; i < 5; i++) {
      const currentField = customFields[entity + i.toString()]
        ? customField(customFields[entity + i.toString()]).label()
        : t(`custom${i.toString()}`);

      fields.push(currentField);
    }
  }

  return fields;
}
