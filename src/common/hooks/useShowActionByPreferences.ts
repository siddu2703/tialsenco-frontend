/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { Entity } from '$app/components/CommonActionsPreferenceModal';
import { useEntityPageIdentifier } from './useEntityPageIdentifier';
import { useCurrentUser } from './useCurrentUser';

interface Params {
  commonActionsSection: boolean;
  entity: Entity;
}
export function useShowActionByPreferences(params: Params) {
  const user = useCurrentUser();

  const { commonActionsSection, entity } = params;

  const { isEditPage } = useEntityPageIdentifier({ entity });

  return (actionKey: string) => {
    if (!isEditPage) {
      return true;
    }

    const commonActionsPreferences =
      user?.company_user?.react_settings.common_actions;

    if (!commonActionsSection && !commonActionsPreferences?.[entity]) {
      return true;
    }

    if (
      !commonActionsSection &&
      commonActionsPreferences?.[entity] &&
      !commonActionsPreferences[entity]?.includes(actionKey)
    ) {
      return true;
    }

    if (commonActionsPreferences?.[entity] && commonActionsSection) {
      return commonActionsPreferences[entity]?.includes(actionKey);
    }

    return false;
  };
}
