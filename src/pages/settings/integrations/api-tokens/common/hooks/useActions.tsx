/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { ApiToken } from '$app/common/interfaces/api-token';
import { useBulkAction } from '$app/common/queries/api-tokens';
import { DropdownElement } from '$app/components/dropdown/DropdownElement';
import { Icon } from '$app/components/icons/Icon';
import { Action } from '$app/components/ResourceActions';
import { useTranslation } from 'react-i18next';
import { MdArchive, MdDelete, MdRestore } from 'react-icons/md';

export function useActions() {
  const [t] = useTranslation();

  const bulk = useBulkAction();

  const actions: Action<ApiToken>[] = [
    (apiToken) =>
      apiToken.archived_at === 0 && (
        <DropdownElement
          onClick={() => bulk(apiToken.id, 'archive')}
          icon={<Icon element={MdArchive} />}
        >
          {t('archive')}
        </DropdownElement>
      ),
    (apiToken) =>
      apiToken.archived_at > 0 && (
        <DropdownElement
          onClick={() => bulk(apiToken.id, 'restore')}
          icon={<Icon element={MdRestore} />}
        >
          {t('restore')}
        </DropdownElement>
      ),
    (apiToken) =>
      !apiToken.is_deleted && (
        <DropdownElement
          onClick={() => bulk(apiToken.id, 'delete')}
          icon={<Icon element={MdDelete} />}
        >
          {t('delete')}
        </DropdownElement>
      ),
  ];

  return actions;
}
