/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import DOMPurify from 'dompurify';

export function extractTextFromHTML(html: string) {
  return (
    new DOMParser().parseFromString(html, 'text/html').documentElement
      .textContent || ''
  );
}

export function sanitizeHTML(html: string) {
  return DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },
  });
}
