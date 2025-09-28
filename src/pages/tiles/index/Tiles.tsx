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
import { Card, CardContainer } from '$app/components/cards';
import { Link } from '$app/components/forms';
import { useTitle } from '$app/common/hooks/useTitle';

export default function Tiles() {
  const [t] = useTranslation();
  const { documentTitle } = useTitle('tile_management');

  const tileTools = [
    {
      name: 'Tile Calculator',
      description: 'Calculate tiles needed for any area',
      href: '/tiles/calculator',
      icon: '📐',
    },
    {
      name: 'Grout Calculator',
      description: 'Calculate grout requirements',
      href: '/tiles/grout-calculator',
      icon: '🧮',
    },
    {
      name: 'AR Visualization',
      description: 'Visualize tiles in augmented reality',
      href: '/tiles/ar-visualization',
      icon: '📱',
    },
    {
      name: 'Color Matching',
      description: 'Match and coordinate tile colors',
      href: '/tiles/color-matching',
      icon: '🎨',
    },
    {
      name: 'Technical Specs',
      description: 'View detailed tile specifications',
      href: '/tiles/technical-specs',
      icon: '📋',
    },
    {
      name: 'Sample Manager',
      description: 'Manage tile samples and orders',
      href: '/tiles/sample-manager',
      icon: '📦',
    },
    {
      name: 'Installation Planner',
      description: 'Plan tile installation projects',
      href: '/tiles/installation-planner',
      icon: '🔧',
    },
    {
      name: 'Batch Tracker',
      description: 'Track tile batches and inventory',
      href: '/tiles/batch-tracker',
      icon: '📊',
    },
    {
      name: 'Customer Portal',
      description: 'Customer-facing tile portal',
      href: '/tiles/customer-portal',
      icon: '👥',
    },
    {
      name: 'Analytics',
      description: 'Tile sales and usage analytics',
      href: '/tiles/analytics',
      icon: '📈',
    },
  ];

  return (
    <Default
      title="Tile Management"
      breadcrumbs={[{ name: t('tile_management'), href: '/tiles' }]}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tileTools.map((tool) => (
          <CardContainer
            key={tool.name}
            className="hover:shadow-lg transition-shadow"
          >
            <Card className="h-full">
              <Link to={tool.href} className="block p-6 text-center">
                <div className="text-4xl mb-4">{tool.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{tool.name}</h3>
                <p className="text-gray-600 text-sm">{tool.description}</p>
              </Link>
            </Card>
          </CardContainer>
        ))}
      </div>
    </Default>
  );
}
