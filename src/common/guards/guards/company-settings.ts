/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { SettingsLevel } from '$app/common/enums/settings';
import { Guard } from '../Guard';

export function companySettings(): Guard {
  return ({ settingsLevel }) =>
    Promise.resolve(Boolean(settingsLevel === SettingsLevel.Company));
}
