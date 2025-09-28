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
import { request } from '$app/common/helpers/request';
import { endpoint } from '$app/common/helpers';
import { toast } from '$app/common/helpers/toast/toast';
import { useColorScheme } from '$app/common/colors';
import { formatDateFromString } from '$app/common/helpers/dates';

interface TileSample {
  id: string;
  product_id: string;
  sample_code: string;
  sample_type: 'display' | 'customer' | 'trade_show' | 'quality_control';
  size_type: 'standard' | 'large_format' | 'mini' | 'custom';
  sample_length_mm?: number;
  sample_width_mm?: number;
  quantity_available: number;
  quantity_reserved: number;
  condition: 'new' | 'good' | 'fair' | 'damaged' | 'retired';
  location?: string;
  display_board_reference?: string;
  customer_requests?: Array<{
    date: string;
    quantity: number;
    customer_info: {
      name: string;
      email?: string;
      phone?: string;
    };
    expected_return_date?: string;
    notes?: string;
    status: string;
  }>;
  last_quality_check?: string;
  notes?: string;
  is_active: boolean;
  requires_return: boolean;
  expected_return_date?: string;
  product: {
    id: string;
    product_key: string;
    tile_type: string;
    tile_size: string;
    tile_color: string;
    brand: string;
    collection?: string;
  };
}

interface SampleFormData {
  product_id: string;
  sample_code: string;
  sample_type: 'display' | 'customer' | 'trade_show' | 'quality_control';
  size_type: 'standard' | 'large_format' | 'mini' | 'custom';
  sample_length_mm: string;
  sample_width_mm: string;
  quantity_available: string;
  condition: 'new' | 'good' | 'fair' | 'damaged' | 'retired';
  location: string;
  display_board_reference: string;
  notes: string;
}

export default function SampleManager() {
  const [t] = useTranslation();
  const colors = useColorScheme();

  const [samples, setSamples] = useState<TileSample[]>([]);
  const [overdueReturns, setOverdueReturns] = useState<TileSample[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedSample, setSelectedSample] = useState<TileSample | null>(null);
  const [showReserveModal, setShowReserveModal] = useState(false);

  const [filters, setFilters] = useState({
    sample_type: '',
    location: '',
    condition: '',
    available_only: false,
  });

  const [formData, setFormData] = useState<SampleFormData>({
    product_id: '',
    sample_code: '',
    sample_type: 'display',
    size_type: 'standard',
    sample_length_mm: '',
    sample_width_mm: '',
    quantity_available: '1',
    condition: 'new',
    location: '',
    display_board_reference: '',
    notes: '',
  });

  const [reserveData, setReserveData] = useState({
    quantity: '1',
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    expected_return_date: '',
    notes: '',
  });

  useEffect(() => {
    fetchSamples();
    fetchOverdueReturns();
  }, [filters]);

  const fetchSamples = async () => {
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value.toString());
      });

      const response = await request(
        'GET',
        endpoint(`/api/v1/tiles/samples?${queryParams}`)
      );
      setSamples(response.data.data || []);
    } catch (error) {
      console.error('Error fetching samples:', error);
      toast.error('Error fetching samples');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchOverdueReturns = async () => {
    try {
      const response = await request(
        'GET',
        endpoint('/api/v1/tiles/samples/overdue-returns')
      );
      setOverdueReturns(response.data || []);
    } catch (error) {
      console.error('Error fetching overdue returns:', error);
    }
  };

  const handleInputChange = (field: keyof SampleFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFilterChange = (field: string, value: string | boolean) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddSample = async () => {
    if (!formData.product_id || !formData.sample_code) {
      toast.error('Please fill in required fields');
      return;
    }

    try {
      await request('POST', endpoint('/api/v1/tiles/samples'), formData);
      toast.success('Sample added successfully');
      setShowAddForm(false);
      setFormData({
        product_id: '',
        sample_code: '',
        sample_type: 'display',
        size_type: 'standard',
        sample_length_mm: '',
        sample_width_mm: '',
        quantity_available: '1',
        condition: 'new',
        location: '',
        display_board_reference: '',
        notes: '',
      });
      fetchSamples();
    } catch (error) {
      console.error('Error adding sample:', error);
      toast.error('Error adding sample');
    }
  };

  const handleReserveSample = async () => {
    if (!selectedSample || !reserveData.customer_name) {
      toast.error('Please fill in required fields');
      return;
    }

    try {
      await request(
        'POST',
        endpoint(`/api/v1/tiles/samples/${selectedSample.id}/reserve`),
        {
          quantity: parseInt(reserveData.quantity),
          customer_info: {
            name: reserveData.customer_name,
            email: reserveData.customer_email,
            phone: reserveData.customer_phone,
          },
          expected_return_date: reserveData.expected_return_date || null,
          notes: reserveData.notes,
        }
      );

      toast.success('Sample reserved successfully');
      setShowReserveModal(false);
      setSelectedSample(null);
      setReserveData({
        quantity: '1',
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        expected_return_date: '',
        notes: '',
      });
      fetchSamples();
      fetchOverdueReturns();
    } catch (error) {
      console.error('Error reserving sample:', error);
      toast.error('Error reserving sample');
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'new':
        return 'text-green-600 bg-green-100';
      case 'good':
        return 'text-blue-600 bg-blue-100';
      case 'fair':
        return 'text-yellow-600 bg-yellow-100';
      case 'damaged':
        return 'text-red-600 bg-red-100';
      case 'retired':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'display':
        return 'text-purple-600 bg-purple-100';
      case 'customer':
        return 'text-blue-600 bg-blue-100';
      case 'trade_show':
        return 'text-orange-600 bg-orange-100';
      case 'quality_control':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          Tile Sample Management
        </h2>
        <Button
          behavior="button"
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 text-white"
        >
          Add New Sample
        </Button>
      </div>

      {/* Filters */}
      <Card
        title="Filters"
        className="shadow-sm"
        style={{ borderColor: colors.$24 }}
        headerStyle={{ borderColor: colors.$20 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <SelectField
            value={filters.sample_type}
            onValueChange={(value) => handleFilterChange('sample_type', value)}
            customSelector
          >
            <option value="">All Types</option>
            <option value="display">Display</option>
            <option value="customer">Customer</option>
            <option value="trade_show">Trade Show</option>
            <option value="quality_control">Quality Control</option>
          </SelectField>

          <InputField
            placeholder="Location"
            value={filters.location}
            onValueChange={(value) => handleFilterChange('location', value)}
          />

          <SelectField
            value={filters.condition}
            onValueChange={(value) => handleFilterChange('condition', value)}
            customSelector
          >
            <option value="">All Conditions</option>
            <option value="new">New</option>
            <option value="good">Good</option>
            <option value="fair">Fair</option>
            <option value="damaged">Damaged</option>
            <option value="retired">Retired</option>
          </SelectField>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={filters.available_only}
              onChange={(e) =>
                handleFilterChange('available_only', e.target.checked)
              }
              className="mr-2"
            />
            Available Only
          </label>
        </div>
      </Card>

      {/* Overdue Returns Alert */}
      {overdueReturns.length > 0 && (
        <Card
          title={`Overdue Returns (${overdueReturns.length})`}
          className="shadow-sm border-red-200"
          style={{ borderColor: '#fecaca' }}
          headerStyle={{ borderColor: '#fca5a5', backgroundColor: '#fef2f2' }}
        >
          <div className="space-y-2">
            {overdueReturns.map((sample) => (
              <div
                key={sample.id}
                className="flex justify-between items-center p-3 bg-red-50 rounded-lg"
              >
                <div>
                  <div className="font-medium">{sample.sample_code}</div>
                  <div className="text-sm text-gray-600">
                    {sample.product.product_key}
                  </div>
                  <div className="text-sm text-red-600">
                    Due:{' '}
                    {sample.expected_return_date &&
                      formatDateFromString(
                        sample.expected_return_date,
                        'MMM dd, yyyy'
                      )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-red-600">
                    {sample.quantity_reserved} reserved
                  </div>
                  <div className="text-sm">{sample.location}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Samples List */}
      <Card
        title="Sample Inventory"
        className="shadow-sm"
        style={{ borderColor: colors.$24 }}
        headerStyle={{ borderColor: colors.$20 }}
      >
        {isLoading ? (
          <div className="text-center py-8">Loading samples...</div>
        ) : samples.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No samples found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sample Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Condition
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {samples.map((sample) => (
                  <tr key={sample.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">
                        {sample.sample_code}
                      </div>
                      {sample.display_board_reference && (
                        <div className="text-sm text-gray-500">
                          Board: {sample.display_board_reference}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium">
                        {sample.product.product_key}
                      </div>
                      <div className="text-sm text-gray-600">
                        {sample.product.tile_type}
                      </div>
                      <div className="text-sm text-gray-500">
                        {sample.product.brand} - {sample.product.tile_size}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(
                          sample.sample_type
                        )}`}
                      >
                        {sample.sample_type.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getConditionColor(
                          sample.condition
                        )}`}
                      >
                        {sample.condition}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        <div className="font-medium">
                          Available:{' '}
                          {sample.quantity_available - sample.quantity_reserved}
                        </div>
                        {sample.quantity_reserved > 0 && (
                          <div className="text-orange-600">
                            Reserved: {sample.quantity_reserved}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {sample.location || 'Not specified'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {sample.quantity_available - sample.quantity_reserved >
                        0 && (
                        <Button
                          behavior="button"
                          onClick={() => {
                            setSelectedSample(sample);
                            setShowReserveModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-900 mr-2"
                        >
                          Reserve
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Add Sample Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <h3 className="text-lg font-medium mb-4">Add New Sample</h3>
            <div className="space-y-4">
              <Element leftSide="Product ID">
                <InputField
                  placeholder="Enter product ID"
                  value={formData.product_id}
                  onValueChange={(value) =>
                    handleInputChange('product_id', value)
                  }
                />
              </Element>

              <Element leftSide="Sample Code">
                <InputField
                  placeholder="Unique sample code"
                  value={formData.sample_code}
                  onValueChange={(value) =>
                    handleInputChange('sample_code', value)
                  }
                />
              </Element>

              <div className="grid grid-cols-2 gap-4">
                <Element leftSide="Sample Type">
                  <SelectField
                    value={formData.sample_type}
                    onValueChange={(value) =>
                      handleInputChange('sample_type', value as any)
                    }
                    customSelector
                  >
                    <option value="display">Display</option>
                    <option value="customer">Customer</option>
                    <option value="trade_show">Trade Show</option>
                    <option value="quality_control">Quality Control</option>
                  </SelectField>
                </Element>

                <Element leftSide="Size Type">
                  <SelectField
                    value={formData.size_type}
                    onValueChange={(value) =>
                      handleInputChange('size_type', value as any)
                    }
                    customSelector
                  >
                    <option value="standard">Standard</option>
                    <option value="large_format">Large Format</option>
                    <option value="mini">Mini</option>
                    <option value="custom">Custom</option>
                  </SelectField>
                </Element>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Element leftSide="Quantity Available">
                  <InputField
                    type="number"
                    placeholder="1"
                    value={formData.quantity_available}
                    onValueChange={(value) =>
                      handleInputChange('quantity_available', value)
                    }
                  />
                </Element>

                <Element leftSide="Condition">
                  <SelectField
                    value={formData.condition}
                    onValueChange={(value) =>
                      handleInputChange('condition', value as any)
                    }
                    customSelector
                  >
                    <option value="new">New</option>
                    <option value="good">Good</option>
                    <option value="fair">Fair</option>
                    <option value="damaged">Damaged</option>
                  </SelectField>
                </Element>
              </div>

              <Element leftSide="Location">
                <InputField
                  placeholder="Storage/display location"
                  value={formData.location}
                  onValueChange={(value) =>
                    handleInputChange('location', value)
                  }
                />
              </Element>

              <Element leftSide="Display Board Reference">
                <InputField
                  placeholder="Board reference (optional)"
                  value={formData.display_board_reference}
                  onValueChange={(value) =>
                    handleInputChange('display_board_reference', value)
                  }
                />
              </Element>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <Button
                behavior="button"
                onClick={() => setShowAddForm(false)}
                className="text-gray-600"
              >
                Cancel
              </Button>
              <Button
                behavior="button"
                onClick={handleAddSample}
                className="bg-blue-600 text-white"
              >
                Add Sample
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Reserve Sample Modal */}
      {showReserveModal && selectedSample && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <h3 className="text-lg font-medium mb-4">
              Reserve Sample: {selectedSample.sample_code}
            </h3>
            <div className="space-y-4">
              <Element leftSide="Quantity">
                <InputField
                  type="number"
                  placeholder="1"
                  value={reserveData.quantity}
                  onValueChange={(value) =>
                    setReserveData((prev) => ({ ...prev, quantity: value }))
                  }
                />
              </Element>

              <Element leftSide="Customer Name">
                <InputField
                  placeholder="Customer name"
                  value={reserveData.customer_name}
                  onValueChange={(value) =>
                    setReserveData((prev) => ({
                      ...prev,
                      customer_name: value,
                    }))
                  }
                />
              </Element>

              <Element leftSide="Customer Email">
                <InputField
                  type="email"
                  placeholder="customer@email.com"
                  value={reserveData.customer_email}
                  onValueChange={(value) =>
                    setReserveData((prev) => ({
                      ...prev,
                      customer_email: value,
                    }))
                  }
                />
              </Element>

              <Element leftSide="Customer Phone">
                <InputField
                  placeholder="Phone number"
                  value={reserveData.customer_phone}
                  onValueChange={(value) =>
                    setReserveData((prev) => ({
                      ...prev,
                      customer_phone: value,
                    }))
                  }
                />
              </Element>

              <Element leftSide="Expected Return Date">
                <InputField
                  type="date"
                  value={reserveData.expected_return_date}
                  onValueChange={(value) =>
                    setReserveData((prev) => ({
                      ...prev,
                      expected_return_date: value,
                    }))
                  }
                />
              </Element>

              <Element leftSide="Notes">
                <InputField
                  placeholder="Additional notes"
                  value={reserveData.notes}
                  onValueChange={(value) =>
                    setReserveData((prev) => ({ ...prev, notes: value }))
                  }
                />
              </Element>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <Button
                behavior="button"
                onClick={() => setShowReserveModal(false)}
                className="text-gray-600"
              >
                Cancel
              </Button>
              <Button
                behavior="button"
                onClick={handleReserveSample}
                className="bg-blue-600 text-white"
              >
                Reserve Sample
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
