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
import { Card, Element } from '$app/components/cards';
import { Button } from '$app/components/forms/Button';
import { InputField } from '$app/components/forms/InputField';
import { SelectField } from '$app/components/forms/SelectField';
import { request } from '$app/common/helpers/request';
import { endpoint } from '$app/common/helpers';
import { toast } from '$app/common/helpers/toast/toast';
import { useColorScheme } from '$app/common/colors';

interface Room {
  id: string;
  name: string;
  length: string;
  width: string;
  wastage_factor: string;
}

interface InstallationRecommendation {
  product_info: {
    id: string;
    product_key: string;
    tile_type: string;
    tile_size: string;
    installation_grade: string;
    pei_rating: number;
    slip_resistance: string;
    frost_resistant: boolean;
  };
  technical_specs: {
    water_absorption: number;
    load_capacity: number;
    edge_finish: string;
    surface_texture: string;
  };
  installation_requirements: {
    substrate_requirements: string;
    recommended_adhesive: string;
    recommended_grout: string;
    recommended_wastage_factor: number;
  };
  analysis: {
    suitability_score: number;
    suitability_rating: string;
    recommendations: string[];
    warnings: string[];
    installation_tips: string[];
  };
  suitability: {
    suitable_for_walls: boolean;
    suitable_for_floors: boolean;
    suitable_for_commercial: boolean;
    suitable_for_outdoor: boolean;
    suitable_for_wet_areas: boolean;
  };
}

interface MultipleAreasCalculation {
  product: {
    id: string;
    product_key: string;
    notes: string;
    coverage_per_box_sqft: number;
    price: number;
  };
  rooms: Array<{
    name: string;
    dimensions: {
      length: number;
      width: number;
      unit: string;
    };
    area: number;
    area_sqft: number;
    wastage_factor: number;
    area_with_wastage: number;
    boxes_needed: number;
    cost: number;
  }>;
  totals: {
    total_area_sqft: number;
    total_boxes: number;
    total_cost: number;
    total_pieces: number;
  };
}

export default function InstallationPlanner() {
  const [t] = useTranslation();
  const colors = useColorScheme();

  const [activeTab, setActiveTab] = useState<
    'recommendations' | 'multi-room' | 'timeline'
  >('recommendations');

  // Recommendations form
  const [recommendationForm, setRecommendationForm] = useState({
    product_id: '',
    installation_type: 'residential',
    area_type: 'dry',
    traffic_level: 'moderate',
    substrate_type: '',
  });

  const [recommendation, setRecommendation] =
    useState<InstallationRecommendation | null>(null);
  const [isLoadingRecommendation, setIsLoadingRecommendation] = useState(false);

  // Multi-room form
  const [multiRoomForm, setMultiRoomForm] = useState({
    product_id: '',
    unit: 'ft',
  });

  const [rooms, setRooms] = useState<Room[]>([
    {
      id: '1',
      name: 'Living Room',
      length: '',
      width: '',
      wastage_factor: '10',
    },
  ]);

  const [multiRoomCalculation, setMultiRoomCalculation] =
    useState<MultipleAreasCalculation | null>(null);
  const [isLoadingMultiRoom, setIsLoadingMultiRoom] = useState(false);

  // Timeline planning
  const [timelineForm, setTimelineForm] = useState({
    total_area: '',
    installation_method: 'professional',
    complexity: 'standard',
    drying_time_required: true,
  });

  const [timeline, setTimeline] = useState<any>(null);

  const handleRecommendationSubmit = async () => {
    if (!recommendationForm.product_id) {
      toast.error('Please enter a product ID');
      return;
    }

    setIsLoadingRecommendation(true);
    try {
      const response = await request(
        'POST',
        endpoint('/api/v1/tiles/installation-recommendations'),
        recommendationForm
      );

      setRecommendation(response.data);
      toast.success('Installation recommendations generated');
    } catch (error) {
      console.error('Error getting recommendations:', error);
      toast.error('Error getting installation recommendations');
    } finally {
      setIsLoadingRecommendation(false);
    }
  };

  const handleMultiRoomSubmit = async () => {
    if (
      !multiRoomForm.product_id ||
      rooms.some((room) => !room.length || !room.width)
    ) {
      toast.error('Please fill in all room dimensions and product ID');
      return;
    }

    setIsLoadingMultiRoom(true);
    try {
      const roomData = rooms.map((room) => ({
        name: room.name,
        length: parseFloat(room.length),
        width: parseFloat(room.width),
        wastage_factor: parseFloat(room.wastage_factor),
      }));

      const response = await request(
        'POST',
        endpoint('/api/v1/tiles/calculate-multiple-areas'),
        {
          ...multiRoomForm,
          rooms: roomData,
        }
      );

      setMultiRoomCalculation(response.data);
      toast.success('Multi-room calculation completed');
    } catch (error) {
      console.error('Error calculating multi-room:', error);
      toast.error('Error calculating multiple areas');
    } finally {
      setIsLoadingMultiRoom(false);
    }
  };

  const addRoom = () => {
    const newRoom: Room = {
      id: Date.now().toString(),
      name: `Room ${rooms.length + 1}`,
      length: '',
      width: '',
      wastage_factor: '10',
    };
    setRooms([...rooms, newRoom]);
  };

  const removeRoom = (roomId: string) => {
    setRooms(rooms.filter((room) => room.id !== roomId));
  };

  const updateRoom = (roomId: string, field: keyof Room, value: string) => {
    setRooms(
      rooms.map((room) =>
        room.id === roomId ? { ...room, [field]: value } : room
      )
    );
  };

  const generateTimeline = () => {
    const area = parseFloat(timelineForm.total_area);
    if (!area) return;

    // Basic timeline calculation
    let baseTimePerSqFt = 0.5; // hours per square foot

    if (timelineForm.installation_method === 'diy') {
      baseTimePerSqFt *= 2; // DIY takes longer
    }

    if (timelineForm.complexity === 'complex') {
      baseTimePerSqFt *= 1.5; // Complex patterns take longer
    }

    const installationHours = area * baseTimePerSqFt;
    const installationDays = Math.ceil(installationHours / 8); // 8 hours per day

    const phases = [
      {
        phase: 'Preparation',
        duration: '1 day',
        tasks: [
          'Remove existing flooring',
          'Clean and prepare substrate',
          'Check for level and moisture',
          'Install underfloor heating (if applicable)',
        ],
      },
      {
        phase: 'Planning & Layout',
        duration: '0.5 day',
        tasks: [
          'Mark center lines',
          'Plan tile layout',
          'Cut tiles as needed',
          'Check pattern alignment',
        ],
      },
      {
        phase: 'Installation',
        duration: `${installationDays} day${installationDays > 1 ? 's' : ''}`,
        tasks: [
          'Apply adhesive in sections',
          'Install tiles with spacers',
          'Check alignment regularly',
          'Remove excess adhesive',
        ],
      },
      {
        phase: 'Grouting',
        duration: '1 day',
        tasks: [
          'Wait for adhesive to cure (24-48 hours)',
          'Mix and apply grout',
          'Clean excess grout',
          'Apply grout sealant',
        ],
      },
      {
        phase: 'Finishing',
        duration: '0.5 day',
        tasks: [
          'Install transition strips',
          'Install baseboards/trim',
          'Final cleaning',
          'Quality inspection',
        ],
      },
    ];

    if (timelineForm.drying_time_required) {
      phases.push({
        phase: 'Curing & Drying',
        duration: '1-3 days',
        tasks: [
          'Allow grout to fully cure',
          'Wait before heavy traffic',
          'Apply final sealers if needed',
          'Schedule final walkthrough',
        ],
      });
    }

    const totalDays =
      installationDays + 3 + (timelineForm.drying_time_required ? 2 : 0);

    setTimeline({
      totalDays,
      installationDays,
      phases,
      estimatedCost: {
        labor: installationHours * 50, // $50/hour estimate
        materials: area * 5, // $5/sqft materials estimate
      },
    });
  };

  const getSuitabilityColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 75) return 'text-blue-600 bg-blue-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    if (score >= 40) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          Installation Planning Tools
        </h2>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('recommendations')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'recommendations'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Product Suitability
          </button>
          <button
            onClick={() => setActiveTab('multi-room')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'multi-room'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Multi-Room Planning
          </button>
          <button
            onClick={() => setActiveTab('timeline')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'timeline'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Installation Timeline
          </button>
        </nav>
      </div>

      {/* Product Suitability Tab */}
      {activeTab === 'recommendations' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card
            title="Product Suitability Analysis"
            className="shadow-sm"
            style={{ borderColor: colors.$24 }}
            headerStyle={{ borderColor: colors.$20 }}
          >
            <div className="space-y-4">
              <Element leftSide="Product ID">
                <InputField
                  placeholder="Enter product ID"
                  value={recommendationForm.product_id}
                  onValueChange={(value) =>
                    setRecommendationForm((prev) => ({
                      ...prev,
                      product_id: value,
                    }))
                  }
                />
              </Element>

              <Element leftSide="Installation Type">
                <SelectField
                  value={recommendationForm.installation_type}
                  onValueChange={(value) =>
                    setRecommendationForm((prev) => ({
                      ...prev,
                      installation_type: value,
                    }))
                  }
                  customSelector
                >
                  <option value="residential">Residential</option>
                  <option value="commercial">Commercial</option>
                  <option value="outdoor">Outdoor</option>
                </SelectField>
              </Element>

              <Element leftSide="Area Type">
                <SelectField
                  value={recommendationForm.area_type}
                  onValueChange={(value) =>
                    setRecommendationForm((prev) => ({
                      ...prev,
                      area_type: value,
                    }))
                  }
                  customSelector
                >
                  <option value="dry">Dry Areas</option>
                  <option value="wet">Wet Areas (Bathroom/Kitchen)</option>
                  <option value="outdoor">Outdoor</option>
                </SelectField>
              </Element>

              <Element leftSide="Traffic Level">
                <SelectField
                  value={recommendationForm.traffic_level}
                  onValueChange={(value) =>
                    setRecommendationForm((prev) => ({
                      ...prev,
                      traffic_level: value,
                    }))
                  }
                  customSelector
                >
                  <option value="light">Light Traffic</option>
                  <option value="moderate">Moderate Traffic</option>
                  <option value="heavy">Heavy Traffic</option>
                </SelectField>
              </Element>

              <Element leftSide="Substrate Type">
                <InputField
                  placeholder="e.g., Concrete, Plywood, Existing tile"
                  value={recommendationForm.substrate_type}
                  onValueChange={(value) =>
                    setRecommendationForm((prev) => ({
                      ...prev,
                      substrate_type: value,
                    }))
                  }
                />
              </Element>

              <Button
                behavior="button"
                onClick={handleRecommendationSubmit}
                disabled={isLoadingRecommendation}
                className="w-full bg-blue-600 text-white"
              >
                {isLoadingRecommendation
                  ? 'Analyzing...'
                  : 'Get Recommendations'}
              </Button>
            </div>
          </Card>

          {recommendation && (
            <Card
              title="Suitability Analysis Results"
              className="shadow-sm"
              style={{ borderColor: colors.$24 }}
              headerStyle={{ borderColor: colors.$20 }}
            >
              <div className="space-y-4">
                {/* Suitability Score */}
                <div className="text-center p-4 rounded-lg bg-gray-50">
                  <div className="text-3xl font-bold mb-2">
                    <span
                      className={`px-3 py-1 rounded-full ${getSuitabilityColor(
                        recommendation.analysis.suitability_score
                      )}`}
                    >
                      {recommendation.analysis.suitability_score}%
                    </span>
                  </div>
                  <div className="text-lg font-medium text-gray-700">
                    {recommendation.analysis.suitability_rating}
                  </div>
                  <div className="text-sm text-gray-600">
                    for {recommendationForm.installation_type}{' '}
                    {recommendationForm.area_type} areas
                  </div>
                </div>

                {/* Warnings */}
                {recommendation.analysis.warnings.length > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <h4 className="font-medium text-red-800 mb-2">
                      ⚠️ Warnings
                    </h4>
                    <ul className="text-sm text-red-700 space-y-1">
                      {recommendation.analysis.warnings.map(
                        (warning, index) => (
                          <li key={index}>• {warning}</li>
                        )
                      )}
                    </ul>
                  </div>
                )}

                {/* Recommendations */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <h4 className="font-medium text-green-800 mb-2">
                    ✓ Recommendations
                  </h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    {recommendation.analysis.recommendations.map(
                      (rec, index) => (
                        <li key={index}>• {rec}</li>
                      )
                    )}
                  </ul>
                </div>

                {/* Installation Tips */}
                {recommendation.analysis.installation_tips.length > 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <h4 className="font-medium text-blue-800 mb-2">
                      💡 Installation Tips
                    </h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      {recommendation.analysis.installation_tips.map(
                        (tip, index) => (
                          <li key={index}>• {tip}</li>
                        )
                      )}
                    </ul>
                  </div>
                )}

                {/* Technical Details */}
                <div className="border-t pt-3">
                  <h4 className="font-medium text-gray-800 mb-2">
                    Technical Specifications
                  </h4>
                  <div className="text-sm space-y-1">
                    <div>
                      PEI Rating:{' '}
                      {recommendation.product_info.pei_rating ||
                        'Not specified'}
                    </div>
                    <div>
                      Water Absorption:{' '}
                      {recommendation.technical_specs.water_absorption}%
                    </div>
                    <div>
                      Slip Resistance:{' '}
                      {recommendation.product_info.slip_resistance ||
                        'Not specified'}
                    </div>
                    <div>
                      Frost Resistant:{' '}
                      {recommendation.product_info.frost_resistant
                        ? 'Yes'
                        : 'No'}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Multi-Room Planning Tab */}
      {activeTab === 'multi-room' && (
        <div className="space-y-6">
          <Card
            title="Multi-Room Calculation"
            className="shadow-sm"
            style={{ borderColor: colors.$24 }}
            headerStyle={{ borderColor: colors.$20 }}
          >
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Element leftSide="Product ID">
                  <InputField
                    placeholder="Enter product ID"
                    value={multiRoomForm.product_id}
                    onValueChange={(value) =>
                      setMultiRoomForm((prev) => ({
                        ...prev,
                        product_id: value,
                      }))
                    }
                  />
                </Element>

                <Element leftSide="Measurement Unit">
                  <SelectField
                    value={multiRoomForm.unit}
                    onValueChange={(value) =>
                      setMultiRoomForm((prev) => ({ ...prev, unit: value }))
                    }
                    customSelector
                  >
                    <option value="ft">Feet</option>
                    <option value="m">Meters</option>
                  </SelectField>
                </Element>
              </div>

              <div>
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium">Room Dimensions</h4>
                  <Button
                    behavior="button"
                    onClick={addRoom}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    + Add Room
                  </Button>
                </div>

                <div className="space-y-3">
                  {rooms.map((room) => (
                    <div
                      key={room.id}
                      className="grid grid-cols-1 md:grid-cols-5 gap-2 items-end"
                    >
                      <InputField
                        placeholder="Room name"
                        value={room.name}
                        onValueChange={(value) =>
                          updateRoom(room.id, 'name', value)
                        }
                      />
                      <InputField
                        placeholder={`Length (${multiRoomForm.unit})`}
                        type="number"
                        value={room.length}
                        onValueChange={(value) =>
                          updateRoom(room.id, 'length', value)
                        }
                      />
                      <InputField
                        placeholder={`Width (${multiRoomForm.unit})`}
                        type="number"
                        value={room.width}
                        onValueChange={(value) =>
                          updateRoom(room.id, 'width', value)
                        }
                      />
                      <InputField
                        placeholder="Wastage %"
                        type="number"
                        value={room.wastage_factor}
                        onValueChange={(value) =>
                          updateRoom(room.id, 'wastage_factor', value)
                        }
                      />
                      {rooms.length > 1 && (
                        <Button
                          behavior="button"
                          onClick={() => removeRoom(room.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <Button
                behavior="button"
                onClick={handleMultiRoomSubmit}
                disabled={isLoadingMultiRoom}
                className="bg-blue-600 text-white"
              >
                {isLoadingMultiRoom ? 'Calculating...' : 'Calculate All Rooms'}
              </Button>
            </div>
          </Card>

          {multiRoomCalculation && (
            <Card
              title="Multi-Room Calculation Results"
              className="shadow-sm"
              style={{ borderColor: colors.$24 }}
              headerStyle={{ borderColor: colors.$20 }}
            >
              <div className="space-y-4">
                {/* Summary */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {multiRoomCalculation.totals.total_area_sqft}
                    </div>
                    <div className="text-sm text-gray-600">
                      Total Area (sq ft)
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {multiRoomCalculation.totals.total_boxes}
                    </div>
                    <div className="text-sm text-gray-600">Total Boxes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {multiRoomCalculation.totals.total_pieces}
                    </div>
                    <div className="text-sm text-gray-600">Total Pieces</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      ${multiRoomCalculation.totals.total_cost}
                    </div>
                    <div className="text-sm text-gray-600">Total Cost</div>
                  </div>
                </div>

                {/* Room Details */}
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Room
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Dimensions
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Area
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          With Wastage
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Boxes Needed
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Cost
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {multiRoomCalculation.rooms.map((room, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap font-medium">
                            {room.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {room.dimensions.length} × {room.dimensions.width}{' '}
                            {room.dimensions.unit}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {room.area_sqft} sq ft
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {room.area_with_wastage} sq ft
                            <div className="text-xs text-gray-500">
                              +{room.wastage_factor}%
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap font-bold">
                            {room.boxes_needed}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            ${room.cost}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Installation Timeline Tab */}
      {activeTab === 'timeline' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card
            title="Installation Timeline Planning"
            className="shadow-sm"
            style={{ borderColor: colors.$24 }}
            headerStyle={{ borderColor: colors.$20 }}
          >
            <div className="space-y-4">
              <Element leftSide="Total Area (sq ft)">
                <InputField
                  placeholder="Total installation area"
                  type="number"
                  value={timelineForm.total_area}
                  onValueChange={(value) =>
                    setTimelineForm((prev) => ({ ...prev, total_area: value }))
                  }
                />
              </Element>

              <Element leftSide="Installation Method">
                <SelectField
                  value={timelineForm.installation_method}
                  onValueChange={(value) =>
                    setTimelineForm((prev) => ({
                      ...prev,
                      installation_method: value,
                    }))
                  }
                  customSelector
                >
                  <option value="professional">
                    Professional Installation
                  </option>
                  <option value="diy">DIY Installation</option>
                </SelectField>
              </Element>

              <Element leftSide="Complexity">
                <SelectField
                  value={timelineForm.complexity}
                  onValueChange={(value) =>
                    setTimelineForm((prev) => ({ ...prev, complexity: value }))
                  }
                  customSelector
                >
                  <option value="standard">Standard Pattern</option>
                  <option value="complex">Complex Pattern/Cuts</option>
                </SelectField>
              </Element>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={timelineForm.drying_time_required}
                  onChange={(e) =>
                    setTimelineForm((prev) => ({
                      ...prev,
                      drying_time_required: e.target.checked,
                    }))
                  }
                  className="mr-2"
                />
                Include extended drying/curing time
              </label>

              <Button
                behavior="button"
                onClick={generateTimeline}
                className="w-full bg-blue-600 text-white"
              >
                Generate Timeline
              </Button>
            </div>
          </Card>

          {timeline && (
            <Card
              title="Installation Timeline"
              className="shadow-sm"
              style={{ borderColor: colors.$24 }}
              headerStyle={{ borderColor: colors.$20 }}
            >
              <div className="space-y-4">
                {/* Summary */}
                <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {timeline.totalDays}
                    </div>
                    <div className="text-sm text-gray-600">Total Days</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {timeline.installationDays}
                    </div>
                    <div className="text-sm text-gray-600">
                      Active Install Days
                    </div>
                  </div>
                </div>

                {/* Timeline Phases */}
                <div className="space-y-3">
                  {timeline.phases.map((phase: any, index: number) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-lg p-3"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium text-gray-800">
                          {phase.phase}
                        </h4>
                        <span className="text-sm text-blue-600 font-medium">
                          {phase.duration}
                        </span>
                      </div>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {phase.tasks.map((task: string, taskIndex: number) => (
                          <li key={taskIndex}>• {task}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                {/* Cost Estimates */}
                <div className="border-t pt-4">
                  <h4 className="font-medium text-gray-800 mb-2">
                    Estimated Costs
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded">
                      <div className="font-bold text-blue-600">
                        ${timeline.estimatedCost.labor}
                      </div>
                      <div className="text-sm text-gray-600">Labor</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded">
                      <div className="font-bold text-green-600">
                        ${timeline.estimatedCost.materials}
                      </div>
                      <div className="text-sm text-gray-600">Materials</div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    *Estimates are approximate and may vary based on location
                    and specific requirements
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
