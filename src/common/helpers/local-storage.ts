/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

export function clearLocalStorage() {
  const displayChromeExtensionBanner = localStorage.getItem(
    'displayChromeExtensionBanner'
  );

  localStorage.clear();

  if (displayChromeExtensionBanner) {
    localStorage.setItem(
      'displayChromeExtensionBanner',
      displayChromeExtensionBanner
    );
  }
}
