/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

export function route(
  path: string,
  parts: Record<string, unknown> = {}
): string {
  let url = path;

  for (const part in parts) {
    url = url.replace(`:${part}`, parts[part] as string);
  }

  return url;
}
