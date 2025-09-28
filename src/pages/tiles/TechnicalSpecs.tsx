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
import { Card } from '$app/components/cards';
import { Button } from '$app/components/forms/Button';
import { InputField } from '$app/components/forms/InputField';
import { SelectField } from '$app/components/forms/SelectField';
import { request } from '$app/common/helpers/request';
import { endpoint } from '$app/common/helpers';
import { toast } from '$app/common/helpers/toast/toast';
import { useColorScheme } from '$app/common/colors';

interface ProductTechnicalSpecs {
  id: string;
  product_key: string;
  tile_type: string;
  tile_size: string;
  tile_color: string;
  brand: string;
  collection?: string;

  // Technical ratings
  pei_rating?: number;
  water_absorption?: number;
  slip_resistance?: string;
  frost_resistant: boolean;
  edge_finish?: string;
  surface_texture?: string;

  // Installation specs
  installation_grade?: string;
  load_capacity?: number;
  substrate_requirements?: string;
  recommended_adhesive?: string;
  recommended_grout?: string;

  // Quality and classification
  grade_classification?: string;
  warranty_years?: number;
  color_variation: boolean;
  shade_variation?: string;

  // Environmental
  environmental_rating?: string;
  recyclable: boolean;
  country_of_origin?: string;
}

interface TechnicalFilters {
  pei_rating: string;
  installation_grade: string;
  frost_resistant: string;
  grade_classification: string;
  slip_resistance: string;
  search: string;
}

export default function TechnicalSpecs() {
  const [t] = useTranslation();
  const colors = useColorScheme();

  const [products, setProducts] = useState<ProductTechnicalSpecs[]>([]);
  const [selectedProduct, setSelectedProduct] =
    useState<ProductTechnicalSpecs | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const [filters, setFilters] = useState<TechnicalFilters>({
    pei_rating: '',
    installation_grade: '',
    frost_resistant: '',
    grade_classification: '',
    slip_resistance: '',
    search: '',
  });

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value.toString());
      });

      const response = await request(
        'GET',
        endpoint(`/api/v1/products?${queryParams}`)
      );
      setProducts(response.data.data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Error fetching product specifications');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (field: keyof TechnicalFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const getPEIRatingDescription = (rating?: number) => {
    if (!rating) return 'Not specified';
    switch (rating) {
      case 1:
        return 'PEI 1 - Light residential (no foot traffic)';
      case 2:
        return 'PEI 2 - Light residential (light foot traffic)';
      case 3:
        return 'PEI 3 - Moderate residential/light commercial';
      case 4:
        return 'PEI 4 - Heavy residential/moderate commercial';
      case 5:
        return 'PEI 5 - Heavy commercial/industrial';
      default:
        return `PEI ${rating}`;
    }
  };

  const getPEIRatingColor = (rating?: number) => {
    if (!rating) return 'text-gray-600 bg-gray-100';
    if (rating <= 2) return 'text-green-600 bg-green-100';
    if (rating <= 3) return 'text-blue-600 bg-blue-100';
    if (rating <= 4) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const getWaterAbsorptionCategory = (absorption?: number) => {
    if (!absorption) return 'Not specified';
    if (absorption < 0.5) return 'Impervious (< 0.5%)';
    if (absorption < 3) return 'Vitreous (0.5% - 3%)';
    if (absorption < 7) return 'Semi-vitreous (3% - 7%)';
    if (absorption < 20) return 'Semi-porous (7% - 20%)';
    return 'Porous (> 20%)';
  };

  const getSlipResistanceDescription = (rating?: string) => {
    if (!rating) return 'Not specified';
    switch (rating) {
      case 'R9':
        return 'R9 - Normal slip resistance';
      case 'R10':
        return 'R10 - Increased slip resistance';
      case 'R11':
        return 'R11 - High slip resistance';
      case 'R12':
        return 'R12 - Very high slip resistance';
      case 'R13':
        return 'R13 - Maximum slip resistance';
      default:
        return rating;
    }
  };

  const getInstallationGradeColor = (grade?: string) => {
    switch (grade) {
      case 'wall':
        return 'text-blue-600 bg-blue-100';
      case 'floor':
        return 'text-green-600 bg-green-100';
      case 'commercial':
        return 'text-purple-600 bg-purple-100';
      case 'outdoor':
        return 'text-orange-600 bg-orange-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getSuitabilityRecommendations = (product: ProductTechnicalSpecs) => {
    const recommendations = [];

    if (product.pei_rating) {
      if (product.pei_rating <= 2) {
        recommendations.push('Suitable for light residential use');
      } else if (product.pei_rating <= 3) {
        recommendations.push(
          'Suitable for moderate residential and light commercial use'
        );
      } else if (product.pei_rating >= 4) {
        recommendations.push(
          'Suitable for heavy commercial and industrial use'
        );
      }
    }

    if (product.water_absorption !== undefined) {
      if (product.water_absorption < 3) {
        recommendations.push('Suitable for wet areas (low water absorption)');
      } else {
        recommendations.push('Best for dry areas (higher water absorption)');
      }
    }

    if (product.frost_resistant) {
      recommendations.push('Suitable for outdoor and freeze-thaw environments');
    }

    if (
      product.slip_resistance &&
      ['R11', 'R12', 'R13'].includes(product.slip_resistance)
    ) {
      recommendations.push('High slip resistance - ideal for wet areas');
    }

    return recommendations;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          Technical Specifications & PEI Ratings
        </h2>
      </div>

      {/* Filters */}
      <Card
        title="Filter Products"
        className="shadow-sm"
        style={{ borderColor: colors.$24 }}
        headerStyle={{ borderColor: colors.$20 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <InputField
            placeholder="Search products..."
            value={filters.search}
            onValueChange={(value) => handleFilterChange('search', value)}
          />

          <SelectField
            value={filters.pei_rating}
            onValueChange={(value) => handleFilterChange('pei_rating', value)}
            customSelector
          >
            <option value="">All PEI Ratings</option>
            <option value="1">PEI 1</option>
            <option value="2">PEI 2</option>
            <option value="3">PEI 3</option>
            <option value="4">PEI 4</option>
            <option value="5">PEI 5</option>
          </SelectField>

          <SelectField
            value={filters.installation_grade}
            onValueChange={(value) =>
              handleFilterChange('installation_grade', value)
            }
            customSelector
          >
            <option value="">All Installation Types</option>
            <option value="wall">Wall Only</option>
            <option value="floor">Floor</option>
            <option value="commercial">Commercial</option>
            <option value="outdoor">Outdoor</option>
          </SelectField>

          <SelectField
            value={filters.frost_resistant}
            onValueChange={(value) =>
              handleFilterChange('frost_resistant', value)
            }
            customSelector
          >
            <option value="">All</option>
            <option value="true">Frost Resistant</option>
            <option value="false">Indoor Only</option>
          </SelectField>

          <SelectField
            value={filters.slip_resistance}
            onValueChange={(value) =>
              handleFilterChange('slip_resistance', value)
            }
            customSelector
          >
            <option value="">All Slip Ratings</option>
            <option value="R9">R9</option>
            <option value="R10">R10</option>
            <option value="R11">R11</option>
            <option value="R12">R12</option>
            <option value="R13">R13</option>
          </SelectField>

          <SelectField
            value={filters.grade_classification}
            onValueChange={(value) =>
              handleFilterChange('grade_classification', value)
            }
            customSelector
          >
            <option value="">All Grades</option>
            <option value="First">First Quality</option>
            <option value="Commercial">Commercial</option>
            <option value="Seconds">Seconds</option>
          </SelectField>
        </div>
      </Card>

      {/* Products List */}
      <Card
        title="Products with Technical Specifications"
        className="shadow-sm"
        style={{ borderColor: colors.$24 }}
        headerStyle={{ borderColor: colors.$20 }}
      >
        {isLoading ? (
          <div className="text-center py-8">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No products found matching criteria
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    PEI Rating
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Water Absorption
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Slip Resistance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Installation Grade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Properties
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">
                          {product.product_key}
                        </div>
                        <div className="text-sm text-gray-600">
                          {product.tile_type}
                        </div>
                        <div className="text-sm text-gray-500">
                          {product.brand} - {product.tile_size}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {product.pei_rating ? (
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPEIRatingColor(
                            product.pei_rating
                          )}`}
                        >
                          PEI {product.pei_rating}
                        </span>
                      ) : (
                        <span className="text-gray-400">Not specified</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        {product.water_absorption ? (
                          <>
                            <div className="font-medium">
                              {product.water_absorption}%
                            </div>
                            <div className="text-gray-600 text-xs">
                              {getWaterAbsorptionCategory(
                                product.water_absorption
                              )}
                            </div>
                          </>
                        ) : (
                          <span className="text-gray-400">Not specified</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {product.slip_resistance ? (
                        <span className="text-sm font-medium">
                          {product.slip_resistance}
                        </span>
                      ) : (
                        <span className="text-gray-400">Not specified</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {product.installation_grade ? (
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getInstallationGradeColor(
                            product.installation_grade
                          )}`}
                        >
                          {product.installation_grade}
                        </span>
                      ) : (
                        <span className="text-gray-400">Not specified</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {product.frost_resistant && (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full text-blue-600 bg-blue-100">
                            Frost Resistant
                          </span>
                        )}
                        {product.color_variation && (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full text-purple-600 bg-purple-100">
                            Color Variation
                          </span>
                        )}
                        {product.recyclable && (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full text-green-600 bg-green-100">
                            Recyclable
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Button
                        behavior="button"
                        onClick={() => {
                          setSelectedProduct(product);
                          setShowDetailsModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Product Details Modal */}
      {showDetailsModal && selectedProduct && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium">
                Technical Specifications: {selectedProduct.product_key}
              </h3>
              <Button
                behavior="button"
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Basic Information */}
              <Card
                title="Product Information"
                className="shadow-sm"
                style={{ borderColor: colors.$24 }}
                headerStyle={{ borderColor: colors.$20 }}
              >
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Product Key:</span>
                    <span className="font-medium">
                      {selectedProduct.product_key}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type:</span>
                    <span className="font-medium">
                      {selectedProduct.tile_type}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Size:</span>
                    <span className="font-medium">
                      {selectedProduct.tile_size}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Brand:</span>
                    <span className="font-medium">{selectedProduct.brand}</span>
                  </div>
                  {selectedProduct.collection && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Collection:</span>
                      <span className="font-medium">
                        {selectedProduct.collection}
                      </span>
                    </div>
                  )}
                </div>
              </Card>

              {/* Technical Ratings */}
              <Card
                title="Technical Ratings"
                className="shadow-sm"
                style={{ borderColor: colors.$24 }}
                headerStyle={{ borderColor: colors.$20 }}
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">PEI Rating:</span>
                    <div className="text-right">
                      {selectedProduct.pei_rating ? (
                        <>
                          <div className="font-medium">
                            PEI {selectedProduct.pei_rating}
                          </div>
                          <div className="text-xs text-gray-500">
                            {getPEIRatingDescription(
                              selectedProduct.pei_rating
                            )}
                          </div>
                        </>
                      ) : (
                        <span className="text-gray-400">Not specified</span>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Water Absorption:</span>
                    <div className="text-right">
                      {selectedProduct.water_absorption ? (
                        <>
                          <div className="font-medium">
                            {selectedProduct.water_absorption}%
                          </div>
                          <div className="text-xs text-gray-500">
                            {getWaterAbsorptionCategory(
                              selectedProduct.water_absorption
                            )}
                          </div>
                        </>
                      ) : (
                        <span className="text-gray-400">Not specified</span>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Slip Resistance:</span>
                    <div className="text-right">
                      {selectedProduct.slip_resistance ? (
                        <>
                          <div className="font-medium">
                            {selectedProduct.slip_resistance}
                          </div>
                          <div className="text-xs text-gray-500">
                            {getSlipResistanceDescription(
                              selectedProduct.slip_resistance
                            )}
                          </div>
                        </>
                      ) : (
                        <span className="text-gray-400">Not specified</span>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Frost Resistant:</span>
                    <span
                      className={`font-medium ${
                        selectedProduct.frost_resistant
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}
                    >
                      {selectedProduct.frost_resistant ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>
              </Card>

              {/* Installation Specifications */}
              <Card
                title="Installation Specifications"
                className="shadow-sm"
                style={{ borderColor: colors.$24 }}
                headerStyle={{ borderColor: colors.$20 }}
              >
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Installation Grade:</span>
                    <span className="font-medium">
                      {selectedProduct.installation_grade || 'Not specified'}
                    </span>
                  </div>

                  {selectedProduct.load_capacity && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Load Capacity:</span>
                      <span className="font-medium">
                        {selectedProduct.load_capacity} kg/m²
                      </span>
                    </div>
                  )}

                  {selectedProduct.edge_finish && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Edge Finish:</span>
                      <span className="font-medium">
                        {selectedProduct.edge_finish}
                      </span>
                    </div>
                  )}

                  {selectedProduct.surface_texture && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Surface Texture:</span>
                      <span className="font-medium">
                        {selectedProduct.surface_texture}
                      </span>
                    </div>
                  )}
                </div>
              </Card>

              {/* Quality & Environmental */}
              <Card
                title="Quality & Environmental"
                className="shadow-sm"
                style={{ borderColor: colors.$24 }}
                headerStyle={{ borderColor: colors.$20 }}
              >
                <div className="space-y-3">
                  {selectedProduct.grade_classification && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Grade:</span>
                      <span className="font-medium">
                        {selectedProduct.grade_classification}
                      </span>
                    </div>
                  )}

                  {selectedProduct.warranty_years && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Warranty:</span>
                      <span className="font-medium">
                        {selectedProduct.warranty_years} years
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span className="text-gray-600">Color Variation:</span>
                    <span
                      className={`font-medium ${
                        selectedProduct.color_variation
                          ? 'text-orange-600'
                          : 'text-green-600'
                      }`}
                    >
                      {selectedProduct.color_variation ? 'Yes' : 'Consistent'}
                    </span>
                  </div>

                  {selectedProduct.shade_variation && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shade Variation:</span>
                      <span className="font-medium">
                        {selectedProduct.shade_variation}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span className="text-gray-600">Recyclable:</span>
                    <span
                      className={`font-medium ${
                        selectedProduct.recyclable
                          ? 'text-green-600'
                          : 'text-gray-600'
                      }`}
                    >
                      {selectedProduct.recyclable ? 'Yes' : 'No'}
                    </span>
                  </div>

                  {selectedProduct.country_of_origin && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Country of Origin:</span>
                      <span className="font-medium">
                        {selectedProduct.country_of_origin}
                      </span>
                    </div>
                  )}
                </div>
              </Card>
            </div>

            {/* Suitability Recommendations */}
            <Card
              title="Suitability Recommendations"
              className="shadow-sm mt-6"
              style={{ borderColor: colors.$24 }}
              headerStyle={{ borderColor: colors.$20 }}
            >
              <div className="space-y-2">
                {getSuitabilityRecommendations(selectedProduct).map(
                  (recommendation, index) => (
                    <div key={index} className="flex items-center">
                      <div className="text-green-500 mr-2">✓</div>
                      <div className="text-sm">{recommendation}</div>
                    </div>
                  )
                )}
                {getSuitabilityRecommendations(selectedProduct).length ===
                  0 && (
                  <div className="text-gray-500 text-sm">
                    No specific recommendations available based on current
                    specifications.
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
