/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

export function useCleanDescriptionText() {
  return (descriptionText: string) => {
    if (descriptionText.includes('\\n ')) {
      return descriptionText.replace('\\n', '');
    }

    if (descriptionText.includes('\\n')) {
      return descriptionText.replace('\\n', ' ');
    }

    return descriptionText;
  };
}
