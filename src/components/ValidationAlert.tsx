/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */
import { useValidationMessageAlias } from '$app/common/hooks/useValidationMessageAlias';
import { ValidationBag } from '$app/common/interfaces/validation-bag';
import { ErrorMessage } from './ErrorMessage';

interface Props {
  errors: ValidationBag;
  entity?: 'client';
  withoutTopMessage?: boolean;
  withoutListBullets?: boolean;
}

export function ValidationAlert(props: Props) {
  const { entity, withoutTopMessage, withoutListBullets } = props;

  const validationMessageAlias = useValidationMessageAlias({ entity });

  return (
    <ErrorMessage className="mb-6">
      {!withoutTopMessage && <p>{props.errors.message}</p>}

      <ul>
        {Object.keys(props.errors.errors).map((key, index) => (
          <li key={index}>
            {!withoutListBullets && <>&#8211; </>}
            {validationMessageAlias(key, props.errors.errors[key])}
          </li>
        ))}
      </ul>
    </ErrorMessage>
  );
}
