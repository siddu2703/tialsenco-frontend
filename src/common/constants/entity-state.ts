/**
 * Tilsenco (https://tilsenco.com).
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { EntityState } from '$app/common/enums/entity-state';

export default {
  [EntityState.Active]: 'active',
  [EntityState.Archived]: 'archived',
  [EntityState.Deleted]: 'deleted',
};
