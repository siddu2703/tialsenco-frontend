/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { EntityState } from '$app/common/enums/entity-state';
import { getEntityState } from '$app/common/helpers';
import { Badge } from '$app/components/Badge';
import { useTranslation } from 'react-i18next';

interface Props {
  entity: unknown;
}

export function EntityStatus(props: Props) {
  const [t] = useTranslation();

  const state = getEntityState(props.entity);

  if (state === EntityState.Active) {
    return <Badge variant="primary">{t('active')}</Badge>;
  }

  if (state === EntityState.Archived) {
    return <Badge variant="yellow">{t('archived')}</Badge>;
  }

  if (state === EntityState.Deleted) {
    return <Badge variant="red">{t('deleted')}</Badge>;
  }

  return <></>;
}
