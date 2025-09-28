/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { Spinner } from './Spinner';

export function LoadingScreen() {
  return (
    <div className="flex items-center justify-center h-screen">
      <Spinner variant="dark" />
    </div>
  );
}
