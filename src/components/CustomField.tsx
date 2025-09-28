/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { useEffect, useState } from 'react';
import { Element } from './cards';
import {
  InputCustomField,
  Props as InputCustomFieldProps,
} from './forms/InputCustomField';
import { useCurrentCompany } from '$app/common/hooks/useCurrentCompany';
import { Entity } from '$app/common/hooks/useEntityCustomFields';

interface Props extends InputCustomFieldProps {
  fieldOnly?: boolean;
  noExternalPadding?: boolean;
  selectMenuPosition?: 'fixed';
}

export function customField(value: string) {
  const [field, type] = value.includes('|') ? value.split('|') : [value, ''];

  return {
    label: () => field,
    type: () => type,
  };
}

export type CustomFields =
  | `${Entity}1`
  | `${Entity}2`
  | `${Entity}3`
  | `${Entity}4`
  | 'surcharge1'
  | 'surcharge2'
  | 'surcharge3'
  | 'surcharge4';

export function useCustomField() {
  const company = useCurrentCompany();

  return (field: CustomFields) => {
    if (company && company.custom_fields[field]) {
      return customField(company.custom_fields[field]);
    }

    return customField('');
  };
}

export function CustomField(props: Props) {
  const [label, setLabel] = useState('');

  useEffect(() => {
    const [fieldLabel] = props.value.includes('|')
      ? props.value.split('|')
      : [props.value, ''];
    setLabel(fieldLabel || '');
  }, []);

  if (props.fieldOnly) {
    return <InputCustomField {...props} />;
  }

  return (
    <Element leftSide={label} noExternalPadding={props.noExternalPadding}>
      <InputCustomField {...props} />
    </Element>
  );
}
