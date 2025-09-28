/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { SelectField } from '$app/components/forms';
import { useStaticsQuery } from '$app/common/queries/statics';
import { GenericSelectorProps } from '$app/components/CountrySelector';

export function PaymentTypeSelector(props: GenericSelectorProps) {
  const statics = useStaticsQuery();

  return (
    <SelectField
      value={props.value}
      onValueChange={props.onChange}
      withBlank
      errorMessage={props.errorMessage}
      customSelector
    >
      {statics.data?.payment_types
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((type, index) => (
          <option key={index} value={type.id}>
            {type.name}
          </option>
        ))}
    </SelectField>
  );
}
