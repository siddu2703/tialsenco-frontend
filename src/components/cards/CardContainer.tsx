/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

export function CardContainer(props: { children: React.ReactNode }) {
  return <div className="px-4 sm:px-6 py-4 space-y-6">{props.children}</div>;
}
