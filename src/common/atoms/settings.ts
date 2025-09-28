/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { atom } from 'jotai';
import { GroupSettings } from '../interfaces/group-settings';
import { Client } from '../interfaces/client';

export const activeSettingsAtom = atom<GroupSettings | Client | undefined>(
  undefined
);
