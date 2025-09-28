/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { useReactSettings } from './hooks/useReactSettings';

// export const $1 = {
//   name: 'invoiceninja.dark',
//   $0: 'dark',
//   $1: '#182433',
//   $2: '#151f2c',
//   $3: '#ffffff',
//   $4: '#1f2e41',
//   $5: '#1f2e41',
//   $6: '#151f2c',
//   $7: '#151f2c',
//   $8: '#1f2e41',
//   $9: '#ffffff',
// };

export const darkColorScheme = {
  name: 'invoiceninja.dark',
  $0: 'dark',
  $1: '#121212',
  $2: '#121212',
  $3: 'rgba(255, 255, 255, 0.87)',
  $4: '#1f2e41',
  $5: '#1f2e41',
  $6: '#121212',
  $7: '#151f2c',
  $8: '#1f2e41',
  $9: '#ffffff',
  $10: 0.87, // High emphasis text
  $11: 0.6, // Medium emphasis text
  $12: 0.38, // Disabled text
  $13: '#E5E7EB', // Navbar right icon hover
  $14: '#121212', // Navigation bar background color
  $15: '#323236', // Light gray background
  $16: '#A1A1AA', // Dark gray icon
  $17: '#9D9DA8', // Placeholder text, table header text color
  $18: '#F97316', // Button background color
  $19: '#323236', // Light border color
  $20: '#323236', // Dropdown element hover background color
  $21: '#1f2e41', // Divider color
  $22: '#a1a1aa', // Label color
  $23: '#121212', // Content background color
  $24: '#323236', // Border color
  $25: '#1f2e41', // Hover element background color
};

export const lightColorScheme = {
  name: 'invoiceninja.light',
  $0: 'light',
  $1: '#ffffff', // Primary background
  $2: '#f7f7f7', // Secondary background
  $3: '#2a303d', // Primary text
  $4: '#f7f7f7', // Primary border
  $5: '#d1d5db', // Secondary border (sidebar)
  $6: '#242930', // Secondary background
  $7: '#f7f7f7', // Primary hover
  $8: '#363D47', // Secondary hover
  $9: '#ffffff', // Accent color text
  $10: 1, // High emphasis text
  $11: 0.8, // Secondary text opacity
  $12: 0.5, // Disabled text opacity
  $13: '#E5E7EB', // Navbar right icon hover
  $14: '#27272A', // Navigation bar background color
  $15: '#E4E4E7', // Light gray background
  $16: '#717179', // Dark gray icon
  $17: '#A1A1AA', // Placeholder text, table header text color
  $18: '#F97316', // Button background color
  $19: '#09090B12', // Light border color
  $20: '#09090B13', // Dropdown element hover background color
  $21: '#09090B1A', // Divider color
  $22: '#717179', // Label color
  $23: '#F4F4F5', // Content background color
  $24: '#09090B26', // Border color
  $25: '#09090B0D', // Hover element background color
};

export function useColorScheme() {
  const reactSettings = useReactSettings({ overwrite: false });

  return reactSettings.dark_mode ? darkColorScheme : lightColorScheme;
}
