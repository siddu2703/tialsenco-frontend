/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://opensource.org/licenses/AAL
 */

export function resolveTotalVariable(variable: string) {
  const [dollar, property] = variable.split('$');

  // This is right place to do aliasing as well.

  return { dollar, property };
}
