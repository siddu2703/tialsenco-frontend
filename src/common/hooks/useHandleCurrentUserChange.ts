/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { useDispatch } from 'react-redux';
import { updateChanges } from '$app/common/stores/slices/user';

export function useHandleCurrentUserChangeProperty() {
  const dispatch = useDispatch();

  return (property: string, value: string | number | boolean) => {
    dispatch(
      updateChanges({
        property,
        value,
      })
    );
  };
}
