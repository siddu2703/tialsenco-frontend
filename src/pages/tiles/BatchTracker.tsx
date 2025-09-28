/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '$app/components/cards';
import { Button } from '$app/components/forms/Button';
import { InputField } from '$app/components/forms/InputField';
import { request } from '$app/common/helpers/request';
import { endpoint } from '$app/common/helpers';
import { toast } from '$app/common/helpers/toast/toast';
import { useColorScheme } from '$app/common/colors';

interface BatchInfo {
  batch_number: string;
  total_products: number;
  total_available_quantity: number;
  color_variations: Array<{
    color: string;
    product_count: number;
    total_quantity: number;
  }>;
  products: Array<{
    id: string;
    product_key: string;
    notes: string;
    tile_type: string;
    tile_size: string;
    tile_color: string;
    tile_finish: string;
    brand: string;
    collection: string;
    available_quantity: number;
    warehouses: Array<{
      warehouse_id: string;
      name: string;
      quantity: number;
    }>;
  }>;
}

export default function BatchTracker() {
  const [t] = useTranslation();
  const colors = useColorScheme();

  const [batchNumber, setBatchNumber] = useState('');
  const [batchInfo, setBatchInfo] = useState<BatchInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const searchBatch = async () => {
    if (!batchNumber.trim()) {
      toast.error('Please enter a batch number');
      return;
    }

    setIsLoading(true);
    try {
      const response = await request(
        'POST',
        endpoint('/api/v1/tiles/batch-availability'),
        { batch_number: batchNumber.trim() }
      );

      setBatchInfo(response.data);
      if (response.data.total_products === 0) {
        toast.warning('No products found for this batch number');
      } else {
        toast.success(
          `Found ${response.data.total_products} products in batch`
        );
      }
    } catch (error) {
      console.error('Batch search error:', error);
      toast.error('Error searching batch information');
      setBatchInfo(null);
    } finally {
      setIsLoading(false);
    }
  };

  const getColorVariationStatus = (
    colorCount: number,
    totalProducts: number
  ) => {
    if (totalProducts === 1) return { color: 'green', text: 'Single product' };
    if (colorCount === 1) return { color: 'green', text: 'Consistent color' };
    if (colorCount <= 2) return { color: 'yellow', text: 'Minor variation' };
    return { color: 'red', text: 'Multiple variations' };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          Batch Color Consistency Tracker
        </h2>
      </div>

      {/* Search Form */}
      <Card
        title="Search Batch"
        className="shadow-sm"
        style={{ borderColor: colors.$24 }}
        headerStyle={{ borderColor: colors.$20 }}
      >
        <div className="flex space-x-4">
          <div className="flex-1">
            <InputField
              placeholder="Enter batch number (e.g., BT2024-001)"
              value={batchNumber}
              onValueChange={setBatchNumber}
              onKeyPress={(e: React.KeyboardEvent) => {
                if (e.key === 'Enter') {
                  searchBatch();
                }
              }}
            />
          </div>
          <Button behavior="button" onClick={searchBatch} disabled={isLoading}>
            {isLoading ? 'Searching...' : 'Search'}
          </Button>
        </div>
      </Card>

      {/* Batch Information */}
      {batchInfo && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Batch Summary */}
          <Card
            title="Batch Summary"
            className="shadow-sm"
            style={{ borderColor: colors.$24 }}
            headerStyle={{ borderColor: colors.$20 }}
          >
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Batch Number:</span>
                <span className="font-bold">{batchInfo.batch_number}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Products:</span>
                <span className="font-medium">{batchInfo.total_products}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Available Quantity:</span>
                <span className="font-medium">
                  {batchInfo.total_available_quantity}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Color Variations:</span>
                <span
                  className={`font-medium ${
                    batchInfo.color_variations.length === 1
                      ? 'text-green-600'
                      : batchInfo.color_variations.length <= 2
                      ? 'text-yellow-600'
                      : 'text-red-600'
                  }`}
                >
                  {batchInfo.color_variations.length}
                </span>
              </div>

              {/* Color Consistency Status */}
              <div className="mt-4 p-3 rounded-lg bg-gray-50">
                {(() => {
                  const status = getColorVariationStatus(
                    batchInfo.color_variations.length,
                    batchInfo.total_products
                  );
                  return (
                    <div className={`text-center text-${status.color}-600`}>
                      <div
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                        bg-${status.color}-100 text-${status.color}-800`}
                      >
                        {status.color === 'green' && '✅'}
                        {status.color === 'yellow' && '⚠️'}
                        {status.color === 'red' && '🚨'}
                        {status.text}
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          </Card>

          {/* Color Variations */}
          <Card
            title="Color Breakdown"
            className="shadow-sm"
            style={{ borderColor: colors.$24 }}
            headerStyle={{ borderColor: colors.$20 }}
          >
            <div className="space-y-3">
              {batchInfo.color_variations.map((variation, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium text-gray-800">
                        {variation.color || 'Not specified'}
                      </div>
                      <div className="text-sm text-gray-600">
                        {variation.product_count} product
                        {variation.product_count !== 1 ? 's' : ''}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg">
                        {variation.total_quantity}
                      </div>
                      <div className="text-xs text-gray-500">available</div>
                    </div>
                  </div>

                  {/* Visual color indicator */}
                  <div className="mt-2">
                    <div
                      className="h-4 w-full rounded border"
                      style={{
                        backgroundColor: variation.color || '#e5e7eb',
                        border: '1px solid #d1d5db',
                      }}
                      title={variation.color || 'Color not specified'}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Recommendations */}
          <Card
            title="Recommendations"
            className="shadow-sm"
            style={{ borderColor: colors.$24 }}
            headerStyle={{ borderColor: colors.$20 }}
          >
            <div className="space-y-3">
              {batchInfo.color_variations.length === 1 ? (
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="flex">
                    <div className="text-green-500 mr-2">✅</div>
                    <div>
                      <div className="font-medium text-green-800">
                        Perfect for Large Projects
                      </div>
                      <div className="text-sm text-green-700">
                        All tiles in this batch have consistent color. Safe to
                        use for large installations.
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <div className="flex">
                    <div className="text-yellow-500 mr-2">⚠️</div>
                    <div>
                      <div className="font-medium text-yellow-800">
                        Color Mixing Required
                      </div>
                      <div className="text-sm text-yellow-700">
                        Multiple color variations detected. Consider mixing
                        tiles from different colors during installation.
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="flex">
                  <div className="text-blue-500 mr-2">💡</div>
                  <div>
                    <div className="font-medium text-blue-800">
                      Installation Tips
                    </div>
                    <div className="text-sm text-blue-700">
                      • Order 10-15% extra for wastage and future repairs • Keep
                      tiles from same batch for consistent color • Store tiles
                      in dry conditions
                    </div>
                  </div>
                </div>
              </div>

              {batchInfo.total_available_quantity < 100 && (
                <div className="p-3 bg-red-50 rounded-lg">
                  <div className="flex">
                    <div className="text-red-500 mr-2">🚨</div>
                    <div>
                      <div className="font-medium text-red-800">
                        Low Stock Alert
                      </div>
                      <div className="text-sm text-red-700">
                        Limited quantity available. Consider ordering additional
                        stock or check alternative batches.
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* Product Details */}
      {batchInfo && batchInfo.products.length > 0 && (
        <Card
          title="Products in Batch"
          className="shadow-sm"
          style={{ borderColor: colors.$24 }}
          headerStyle={{ borderColor: colors.$20 }}
        >
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Specifications
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Color & Finish
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Available
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Warehouses
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {batchInfo.products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="font-medium text-gray-900">
                          {product.product_key}
                        </div>
                        <div className="text-sm text-gray-600">
                          {product.brand}
                        </div>
                        {product.collection && (
                          <div className="text-xs text-gray-500">
                            {product.collection}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        <div>{product.tile_type}</div>
                        <div className="text-gray-600">{product.tile_size}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div
                          className="w-4 h-4 rounded border mr-2"
                          style={{
                            backgroundColor: product.tile_color || '#e5e7eb',
                          }}
                        />
                        <div className="text-sm">
                          <div>{product.tile_color || 'Not specified'}</div>
                          <div className="text-gray-600">
                            {product.tile_finish}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-lg font-bold text-gray-900">
                        {product.available_quantity}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm space-y-1">
                        {product.warehouses.map((warehouse, idx) => (
                          <div key={idx} className="flex justify-between">
                            <span className="text-gray-600">
                              {warehouse.name}:
                            </span>
                            <span className="font-medium">
                              {warehouse.quantity}
                            </span>
                          </div>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
