/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { GenericSelectorProps } from './CountrySelector';
import { ukRegions } from '$app/common/constants/uk-regions';
import { SelectField } from './forms';

export function UKRegionSelector(props: GenericSelectorProps) {
  return (
    <SelectField
      value={props.value}
      label={props.label}
      disabled={props.disabled}
      onValueChange={props.onChange}
      errorMessage={props.errorMessage}
      dismissable
      customSelector
    >
      {Object.entries(ukRegions).map((state, index) => (
        <option key={index} value={state[0]}>
          {state[1]}
        </option>
      ))}
    </SelectField>
  );
}
