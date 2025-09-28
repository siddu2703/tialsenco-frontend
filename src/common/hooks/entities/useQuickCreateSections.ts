/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { isHosted } from '$app/common/helpers';
import { Income } from '$app/components/icons/Income';
import { OpenWallet } from '$app/components/icons/OpenWallet';
import { Settings } from '$app/components/icons/Settings';

interface EntitySection {
  name: string;
  icon: React.ElementType;
  visible: boolean;
  iconColor?: string;
}

export function useQuickCreateSections() {
  const sections: EntitySection[] = [
    {
      name: 'income',
      icon: Income,
      visible: true,
      iconColor: '#22C55E',
    },
    {
      name: 'expense',
      icon: OpenWallet,
      visible: true,
      iconColor: '#EF4444',
    },
    {
      name: 'settings',
      icon: Settings,
      visible: isHosted(),
      iconColor: '#A1A1AA',
    },
  ];

  return sections;
}
