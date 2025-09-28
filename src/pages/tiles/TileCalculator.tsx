/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { Default } from '$app/components/layouts/Default';
import { useTranslation } from 'react-i18next';

export default function TileCalculator() {
  const [t] = useTranslation();

  return (
    <Default
      title="Tile Calculator"
      breadcrumbs={[
        { name: 'Tile Management', href: '/tiles' },
        { name: 'Tile Calculator', href: '/tiles/calculator' },
      ]}
    >
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Tile Calculator</h1>
        <p className="text-gray-600">
          Calculate the number of tiles needed for your project.
        </p>
        <div className="mt-8 p-4 bg-gray-100 rounded-lg">
          <p className="text-center text-gray-500">
            🚧 Coming Soon - Tile calculation functionality will be implemented
            here
          </p>
        </div>
      </div>
    </Default>
  );
}
