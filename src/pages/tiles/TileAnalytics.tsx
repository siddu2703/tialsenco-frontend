/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, Element } from '$app/components/cards';
import { Button } from '$app/components/forms/Button';
import { InputField } from '$app/components/forms/InputField';
import { SelectField } from '$app/components/forms/SelectField';
import { toast } from '$app/common/helpers/toast/toast';
import { useColorScheme } from '$app/common/colors';

interface TileMetrics {
  inventory_overview: {
    total_products: number;
    total_value: number;
    low_stock_items: number;
    out_of_stock_items: number;
    average_pei_rating: number;
  };
  category_breakdown: Array<{
    tile_type: string;
    count: number;
    total_value: number;
    average_price: number;
  }>;
  pei_distribution: Array<{
    pei_rating: number;
    count: number;
    percentage: number;
  }>;
  brand_performance: Array<{
    brand: string;
    product_count: number;
    total_value: number;
    average_rating: number;
  }>;
  sample_utilization: {
    total_samples: number;
    reserved_samples: number;
    overdue_returns: number;
    samples_by_type: Array<{
      type: string;
      count: number;
    }>;
  };
  installation_insights: {
    popular_sizes: Array<{
      size: string;
      count: number;
    }>;
    color_trends: Array<{
      color: string;
      count: number;
    }>;
    finish_preferences: Array<{
      finish: string;
      count: number;
    }>;
  };
  quality_metrics: {
    frost_resistant_percentage: number;
    average_water_absorption: number;
    slip_resistance_distribution: Array<{
      rating: string;
      count: number;
    }>;
  };
}

interface DateRange {
  start_date: string;
  end_date: string;
}

export default function TileAnalytics() {
  const [t] = useTranslation();
  const colors = useColorScheme();

  const [metrics, setMetrics] = useState<TileMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<
    'overview' | 'quality' | 'samples' | 'trends'
  >('overview');

  const [dateRange, setDateRange] = useState<DateRange>({
    start_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0], // 30 days ago
    end_date: new Date().toISOString().split('T')[0], // today
  });

  const [filters, setFilters] = useState({
    brand: '',
    tile_type: '',
    installation_grade: '',
  });

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange, filters]);

  const fetchAnalytics = async () => {
    setIsLoading(true);
    try {
      // Since we don't have a specific analytics endpoint yet, we'll simulate the data
      // In a real implementation, this would call an actual analytics API

      // For now, let's create mock data that represents what the analytics would look like
      const mockMetrics: TileMetrics = {
        inventory_overview: {
          total_products: 150,
          total_value: 125000,
          low_stock_items: 8,
          out_of_stock_items: 3,
          average_pei_rating: 3.4,
        },
        category_breakdown: [
          {
            tile_type: 'Ceramic',
            count: 45,
            total_value: 35000,
            average_price: 12.5,
          },
          {
            tile_type: 'Porcelain',
            count: 65,
            total_value: 75000,
            average_price: 18.75,
          },
          {
            tile_type: 'Natural Stone',
            count: 25,
            total_value: 45000,
            average_price: 28.0,
          },
          {
            tile_type: 'Mosaic',
            count: 15,
            total_value: 15000,
            average_price: 22.0,
          },
        ],
        pei_distribution: [
          { pei_rating: 1, count: 10, percentage: 6.7 },
          { pei_rating: 2, count: 25, percentage: 16.7 },
          { pei_rating: 3, count: 45, percentage: 30.0 },
          { pei_rating: 4, count: 50, percentage: 33.3 },
          { pei_rating: 5, count: 20, percentage: 13.3 },
        ],
        brand_performance: [
          {
            brand: 'TilePro',
            product_count: 35,
            total_value: 42000,
            average_rating: 4.2,
          },
          {
            brand: 'CeramicCraft',
            product_count: 28,
            total_value: 38000,
            average_rating: 4.0,
          },
          {
            brand: 'StoneWorks',
            product_count: 22,
            total_value: 35000,
            average_rating: 4.5,
          },
          {
            brand: 'ModernTile',
            product_count: 30,
            total_value: 25000,
            average_rating: 3.8,
          },
        ],
        sample_utilization: {
          total_samples: 85,
          reserved_samples: 12,
          overdue_returns: 3,
          samples_by_type: [
            { type: 'display', count: 45 },
            { type: 'customer', count: 25 },
            { type: 'trade_show', count: 10 },
            { type: 'quality_control', count: 5 },
          ],
        },
        installation_insights: {
          popular_sizes: [
            { size: '12x12', count: 35 },
            { size: '24x24', count: 28 },
            { size: '18x18', count: 22 },
            { size: '6x6', count: 18 },
            { size: '12x24', count: 15 },
          ],
          color_trends: [
            { color: 'White', count: 32 },
            { color: 'Gray', count: 28 },
            { color: 'Beige', count: 25 },
            { color: 'Brown', count: 20 },
            { color: 'Black', count: 15 },
          ],
          finish_preferences: [
            { finish: 'Matte', count: 45 },
            { finish: 'Polished', count: 38 },
            { finish: 'Textured', count: 35 },
            { finish: 'Brushed', count: 22 },
          ],
        },
        quality_metrics: {
          frost_resistant_percentage: 65.5,
          average_water_absorption: 2.8,
          slip_resistance_distribution: [
            { rating: 'R9', count: 25 },
            { rating: 'R10', count: 45 },
            { rating: 'R11', count: 35 },
            { rating: 'R12', count: 20 },
            { rating: 'R13', count: 10 },
          ],
        },
      };

      setMetrics(mockMetrics);
      toast.success('Analytics data loaded');
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Error loading analytics data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateRangeChange = (field: keyof DateRange, value: string) => {
    setDateRange((prev) => ({ ...prev, [field]: value }));
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const getProgressBarColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 60) return 'bg-yellow-500';
    if (percentage >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Tile Analytics Dashboard
        </h2>
        <div className="text-center py-12">Loading analytics data...</div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Tile Analytics Dashboard
        </h2>
        <div className="text-center py-12 text-gray-500">
          No analytics data available
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          Tile Analytics Dashboard
        </h2>
        <Button
          behavior="button"
          onClick={fetchAnalytics}
          className="bg-blue-600 text-white"
        >
          Refresh Data
        </Button>
      </div>

      {/* Date Range and Filters */}
      <Card
        title="Filters & Date Range"
        className="shadow-sm"
        style={{ borderColor: colors.$24 }}
        headerStyle={{ borderColor: colors.$20 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Element leftSide="Start Date">
            <InputField
              type="date"
              value={dateRange.start_date}
              onValueChange={(value) =>
                handleDateRangeChange('start_date', value)
              }
            />
          </Element>

          <Element leftSide="End Date">
            <InputField
              type="date"
              value={dateRange.end_date}
              onValueChange={(value) =>
                handleDateRangeChange('end_date', value)
              }
            />
          </Element>

          <Element leftSide="Brand">
            <SelectField
              value={filters.brand}
              onValueChange={(value) => handleFilterChange('brand', value)}
              customSelector
            >
              <option value="">All Brands</option>
              <option value="TilePro">TilePro</option>
              <option value="CeramicCraft">CeramicCraft</option>
              <option value="StoneWorks">StoneWorks</option>
            </SelectField>
          </Element>

          <Element leftSide="Tile Type">
            <SelectField
              value={filters.tile_type}
              onValueChange={(value) => handleFilterChange('tile_type', value)}
              customSelector
            >
              <option value="">All Types</option>
              <option value="Ceramic">Ceramic</option>
              <option value="Porcelain">Porcelain</option>
              <option value="Natural Stone">Natural Stone</option>
            </SelectField>
          </Element>

          <Element leftSide="Installation Grade">
            <SelectField
              value={filters.installation_grade}
              onValueChange={(value) =>
                handleFilterChange('installation_grade', value)
              }
              customSelector
            >
              <option value="">All Grades</option>
              <option value="residential">Residential</option>
              <option value="commercial">Commercial</option>
              <option value="outdoor">Outdoor</option>
            </SelectField>
          </Element>
        </div>
      </Card>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { key: 'overview', label: 'Inventory Overview' },
            { key: 'quality', label: 'Quality Metrics' },
            { key: 'samples', label: 'Sample Analytics' },
            { key: 'trends', label: 'Market Trends' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.key
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Card
              className="text-center p-4"
              style={{ borderColor: colors.$24 }}
            >
              <div className="text-2xl font-bold text-blue-600">
                {metrics.inventory_overview.total_products}
              </div>
              <div className="text-sm text-gray-600">Total Products</div>
            </Card>
            <Card
              className="text-center p-4"
              style={{ borderColor: colors.$24 }}
            >
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(metrics.inventory_overview.total_value)}
              </div>
              <div className="text-sm text-gray-600">Total Inventory Value</div>
            </Card>
            <Card
              className="text-center p-4"
              style={{ borderColor: colors.$24 }}
            >
              <div className="text-2xl font-bold text-orange-600">
                {metrics.inventory_overview.low_stock_items}
              </div>
              <div className="text-sm text-gray-600">Low Stock Items</div>
            </Card>
            <Card
              className="text-center p-4"
              style={{ borderColor: colors.$24 }}
            >
              <div className="text-2xl font-bold text-red-600">
                {metrics.inventory_overview.out_of_stock_items}
              </div>
              <div className="text-sm text-gray-600">Out of Stock</div>
            </Card>
            <Card
              className="text-center p-4"
              style={{ borderColor: colors.$24 }}
            >
              <div className="text-2xl font-bold text-purple-600">
                {metrics.inventory_overview.average_pei_rating.toFixed(1)}
              </div>
              <div className="text-sm text-gray-600">Avg PEI Rating</div>
            </Card>
          </div>

          {/* Category Breakdown */}
          <Card
            title="Category Performance"
            className="shadow-sm"
            style={{ borderColor: colors.$24 }}
            headerStyle={{ borderColor: colors.$20 }}
          >
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Products
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Total Value
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Avg Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Performance
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {metrics.category_breakdown.map((category, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap font-medium">
                        {category.tile_type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {category.count}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {formatCurrency(category.total_value)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {formatCurrency(category.average_price)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${getProgressBarColor(
                              (category.total_value /
                                metrics.inventory_overview.total_value) *
                                100
                            )}`}
                            style={{
                              width: `${
                                (category.total_value /
                                  metrics.inventory_overview.total_value) *
                                100
                              }%`,
                            }}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Brand Performance */}
          <Card
            title="Brand Performance"
            className="shadow-sm"
            style={{ borderColor: colors.$24 }}
            headerStyle={{ borderColor: colors.$20 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {metrics.brand_performance.map((brand, index) => (
                <div
                  key={index}
                  className="p-4 border border-gray-200 rounded-lg"
                >
                  <div className="font-medium text-gray-800 mb-2">
                    {brand.brand}
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Products:</span>
                      <span className="font-medium">{brand.product_count}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Value:</span>
                      <span className="font-medium">
                        {formatCurrency(brand.total_value)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Rating:</span>
                      <span className="font-medium">
                        {brand.average_rating.toFixed(1)}/5
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Quality Metrics Tab */}
      {activeTab === 'quality' && (
        <div className="space-y-6">
          {/* PEI Distribution */}
          <Card
            title="PEI Rating Distribution"
            className="shadow-sm"
            style={{ borderColor: colors.$24 }}
            headerStyle={{ borderColor: colors.$20 }}
          >
            <div className="space-y-3">
              {metrics.pei_distribution.map((pei, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-16 text-sm font-medium">
                    PEI {pei.pei_rating}
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="w-full bg-gray-200 rounded-full h-4">
                      <div
                        className="bg-blue-500 h-4 rounded-full"
                        style={{ width: `${pei.percentage}%` }}
                      />
                    </div>
                  </div>
                  <div className="w-12 text-sm text-gray-600">{pei.count}</div>
                  <div className="w-16 text-sm text-gray-600">
                    {formatPercentage(pei.percentage)}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Quality Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card
              title="Frost Resistance"
              className="shadow-sm text-center"
              style={{ borderColor: colors.$24 }}
              headerStyle={{ borderColor: colors.$20 }}
            >
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {formatPercentage(
                  metrics.quality_metrics.frost_resistant_percentage
                )}
              </div>
              <div className="text-sm text-gray-600">
                of products are frost resistant
              </div>
            </Card>

            <Card
              title="Water Absorption"
              className="shadow-sm text-center"
              style={{ borderColor: colors.$24 }}
              headerStyle={{ borderColor: colors.$20 }}
            >
              <div className="text-3xl font-bold text-green-600 mb-2">
                {metrics.quality_metrics.average_water_absorption.toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600">
                average water absorption
              </div>
            </Card>

            <Card
              title="Slip Resistance"
              className="shadow-sm"
              style={{ borderColor: colors.$24 }}
              headerStyle={{ borderColor: colors.$20 }}
            >
              <div className="space-y-2">
                {metrics.quality_metrics.slip_resistance_distribution.map(
                  (slip, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center"
                    >
                      <span className="text-sm font-medium">{slip.rating}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${(slip.count / 135) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600 w-8">
                          {slip.count}
                        </span>
                      </div>
                    </div>
                  )
                )}
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Sample Analytics Tab */}
      {activeTab === 'samples' && (
        <div className="space-y-6">
          {/* Sample Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card
              className="text-center p-4"
              style={{ borderColor: colors.$24 }}
            >
              <div className="text-2xl font-bold text-blue-600">
                {metrics.sample_utilization.total_samples}
              </div>
              <div className="text-sm text-gray-600">Total Samples</div>
            </Card>
            <Card
              className="text-center p-4"
              style={{ borderColor: colors.$24 }}
            >
              <div className="text-2xl font-bold text-orange-600">
                {metrics.sample_utilization.reserved_samples}
              </div>
              <div className="text-sm text-gray-600">Reserved</div>
            </Card>
            <Card
              className="text-center p-4"
              style={{ borderColor: colors.$24 }}
            >
              <div className="text-2xl font-bold text-red-600">
                {metrics.sample_utilization.overdue_returns}
              </div>
              <div className="text-sm text-gray-600">Overdue Returns</div>
            </Card>
            <Card
              className="text-center p-4"
              style={{ borderColor: colors.$24 }}
            >
              <div className="text-2xl font-bold text-green-600">
                {formatPercentage(
                  (metrics.sample_utilization.reserved_samples /
                    metrics.sample_utilization.total_samples) *
                    100
                )}
              </div>
              <div className="text-sm text-gray-600">Utilization Rate</div>
            </Card>
          </div>

          {/* Sample Distribution */}
          <Card
            title="Sample Distribution by Type"
            className="shadow-sm"
            style={{ borderColor: colors.$24 }}
            headerStyle={{ borderColor: colors.$20 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {metrics.sample_utilization.samples_by_type.map(
                (sample, index) => (
                  <div
                    key={index}
                    className="text-center p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="text-2xl font-bold text-purple-600 mb-2">
                      {sample.count}
                    </div>
                    <div className="text-sm text-gray-600 capitalize">
                      {sample.type.replace('_', ' ')}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {formatPercentage(
                        (sample.count /
                          metrics.sample_utilization.total_samples) *
                          100
                      )}
                    </div>
                  </div>
                )
              )}
            </div>
          </Card>
        </div>
      )}

      {/* Market Trends Tab */}
      {activeTab === 'trends' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Popular Sizes */}
            <Card
              title="Popular Tile Sizes"
              className="shadow-sm"
              style={{ borderColor: colors.$24 }}
              headerStyle={{ borderColor: colors.$20 }}
            >
              <div className="space-y-3">
                {metrics.installation_insights.popular_sizes.map(
                  (size, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm font-medium">{size.size}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${(size.count / 35) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600 w-8">
                          {size.count}
                        </span>
                      </div>
                    </div>
                  )
                )}
              </div>
            </Card>

            {/* Color Trends */}
            <Card
              title="Color Trends"
              className="shadow-sm"
              style={{ borderColor: colors.$24 }}
              headerStyle={{ borderColor: colors.$20 }}
            >
              <div className="space-y-3">
                {metrics.installation_insights.color_trends.map(
                  (color, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm font-medium">{color.color}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${(color.count / 32) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600 w-8">
                          {color.count}
                        </span>
                      </div>
                    </div>
                  )
                )}
              </div>
            </Card>

            {/* Finish Preferences */}
            <Card
              title="Finish Preferences"
              className="shadow-sm"
              style={{ borderColor: colors.$24 }}
              headerStyle={{ borderColor: colors.$20 }}
            >
              <div className="space-y-3">
                {metrics.installation_insights.finish_preferences.map(
                  (finish, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm font-medium">
                        {finish.finish}
                      </span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-purple-500 h-2 rounded-full"
                            style={{ width: `${(finish.count / 45) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600 w-8">
                          {finish.count}
                        </span>
                      </div>
                    </div>
                  )
                )}
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
