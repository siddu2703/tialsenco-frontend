/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { Link } from '../../../components/forms/Link';

export function Header() {
  return (
    <>
      <div className="flex justify-center py-8">
        <Link to="/">
          <h1 className="text-2xl font-bold">Tilsenco</h1>
        </Link>
      </div>
    </>
  );
}
