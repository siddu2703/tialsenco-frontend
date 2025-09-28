/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2024. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

export function wait(...selectors: string[]) {
  return new Promise((resolve) => {
    if (!selectors.length) {
      resolve([]);
      return;
    }

    const elements = selectors
      .map((selector) => document.querySelector(selector))
      .filter(Boolean);

    if (elements.length === selectors.length) {
      resolve(elements);
      return;
    }

    const observer = new MutationObserver(() => {
      const foundElements = selectors
        .map((selector) => document.querySelector(selector))
        .filter(Boolean);

      if (foundElements.length === selectors.length) {
        observer.disconnect();
        resolve(foundElements);
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  });
}
