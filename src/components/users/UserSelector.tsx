/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { GenericSelectorProps } from '$app/common/interfaces/generic-selector-props';
import { User } from '$app/common/interfaces/user';

import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ComboboxAsync } from '../forms/Combobox';
import { endpoint } from '$app/common/helpers';
import { useAdmin } from '$app/common/hooks/permissions/useHasPermission';
import { usePreventNavigation } from '$app/common/hooks/usePreventNavigation';

interface UserSelectorProps extends GenericSelectorProps<User> {
  endpoint?: string;
  staleTime?: number;
  withoutAction?: boolean;
}

export function UserSelector(props: UserSelectorProps) {
  const [t] = useTranslation();
  const navigate = useNavigate();

  const preventNavigation = usePreventNavigation();

  const { isAdmin, isOwner } = useAdmin();

  return (
    <ComboboxAsync<User>
      inputOptions={{
        label: props.inputLabel?.toString(),
        value: props.value ?? null,
      }}
      endpoint={endpoint(props.endpoint || '/api/v1/users?status=active')}
      entryOptions={{
        id: 'id',
        value: 'id',
        label: 'first_name',
        inputLabelFn: (resource) =>
          resource ? `${resource.first_name} ${resource.last_name}` : '',
        dropdownLabelFn: (resource) =>
          `${resource.first_name} ${resource.last_name}`,
      }}
      readonly={props.readonly}
      onDismiss={props.onClearButtonClick}
      action={{
        label: t('new_user'),
        onClick: () =>
          preventNavigation({
            fn: () => navigate('/settings/users'),
          }),
        visible: (isAdmin || isOwner) && !props.withoutAction,
      }}
      onChange={(entry) =>
        entry.resource ? props.onChange(entry.resource) : null
      }
      staleTime={props.staleTime || Infinity}
    />
  );
}
