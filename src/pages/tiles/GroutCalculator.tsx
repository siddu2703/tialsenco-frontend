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
import { toast } from '$app/common/helpers/toast/toast';
import { useColorScheme } from '$app/common/colors';

interface GroutCalculation {
  grout_required: {
    volume_cubic_feet: number;
    volume_liters: number;
    bags_needed: number;
    weight_kg: number;
    coverage_sqft: number;
  };
  materials_breakdown: {
    grout: {
      type: string;
      brand: string;
      bag_size: number;
      bags_needed: number;
      cost_per_bag: number;
      total_cost: number;
    };
    additives: Array<{
      name: string;
      quantity: number;
      unit: string;
      cost: number;
    }>;
    tools: Array<{
      name: string;
      description: string;
      cost: number;
      required: boolean;
    }>;
  };
  installation_specs: {
    mix_ratio: string;
    working_time: string;
    cure_time: string;
    joint_depth: number;
    joint_width: number;
    temperature_range: string;
    humidity_requirements: string;
  };
  cost_summary: {
    materials_cost: number;
    estimated_labor: number;
    total_cost: number;
    cost_per_sqft: number;
  };
}

interface MaterialItem {
  id: string;
  name: string;
  category: 'adhesive' | 'grout' | 'sealant' | 'tool' | 'accessory';
  brand: string;
  size: string;
  coverage: number;
  price: number;
  description: string;
  required_for: string[];
}

interface ProjectMaterials {
  project_name: string;
  total_area: number;
  tile_type: string;
  installation_method: string;
  materials: MaterialItem[];
  total_cost: number;
  estimated_labor_hours: number;
}

export default function GroutCalculator() {
  const [t] = useTranslation();
  const colors = useColorScheme();

  const [activeTab, setActiveTab] = useState<
    'grout-calc' | 'material-planner' | 'cost-estimator'
  >('grout-calc');

  // Grout Calculator State
  const [groutForm, setGroutForm] = useState({
    tile_length: '',
    tile_width: '',
    tile_thickness: '',
    joint_width: '',
    joint_depth: '',
    total_area: '',
    grout_type: 'sanded',
    tile_type: 'ceramic',
    installation_location: 'indoor',
  });

  const [groutCalculation, setGroutCalculation] =
    useState<GroutCalculation | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Material Planner State
  const [projectForm, setProjectForm] = useState({
    project_name: '',
    total_area: '',
    tile_type: 'ceramic',
    tile_size: '12x12',
    installation_method: 'standard',
    location_type: 'indoor',
    substrate_type: 'concrete',
  });

  const [projectMaterials, setProjectMaterials] =
    useState<ProjectMaterials | null>(null);
  const [isPlanning, setIsPlanning] = useState(false);

  // Available Materials Data
  const availableMaterials: MaterialItem[] = [
    {
      id: 'ADH001',
      name: 'Premium Tile Adhesive',
      category: 'adhesive',
      brand: 'TileBond Pro',
      size: '50 lbs',
      coverage: 75,
      price: 24.99,
      description: 'High-performance adhesive for ceramic and porcelain tiles',
      required_for: ['ceramic', 'porcelain'],
    },
    {
      id: 'GRT001',
      name: 'Sanded Grout',
      category: 'grout',
      brand: 'GroutMaster',
      size: '25 lbs',
      coverage: 35,
      price: 18.5,
      description: 'Premium sanded grout for joints 1/8" and wider',
      required_for: ['wide_joints'],
    },
    {
      id: 'GRT002',
      name: 'Unsanded Grout',
      category: 'grout',
      brand: 'GroutMaster',
      size: '25 lbs',
      coverage: 45,
      price: 19.99,
      description: 'Smooth grout for narrow joints up to 1/8"',
      required_for: ['narrow_joints'],
    },
    {
      id: 'SEL001',
      name: 'Grout Sealer',
      category: 'sealant',
      brand: 'SealPro',
      size: '1 quart',
      coverage: 500,
      price: 15.99,
      description: 'Penetrating sealer for grout protection',
      required_for: ['all'],
    },
    {
      id: 'TL001',
      name: 'Tile Spacers (1/8")',
      category: 'accessory',
      brand: 'TileTools',
      size: '500 pieces',
      coverage: 200,
      price: 8.99,
      description: 'Plastic tile spacers for consistent joints',
      required_for: ['all'],
    },
    {
      id: 'TL002',
      name: 'Grout Float',
      category: 'tool',
      brand: 'TileTools Pro',
      size: '9" x 4"',
      coverage: 1000,
      price: 22.99,
      description: 'Professional rubber grout float',
      required_for: ['all'],
    },
  ];

  const groutTypes = [
    {
      value: 'sanded',
      label: 'Sanded Grout',
      description: 'For joints 1/8" and wider',
    },
    {
      value: 'unsanded',
      label: 'Unsanded Grout',
      description: 'For joints up to 1/8"',
    },
    {
      value: 'epoxy',
      label: 'Epoxy Grout',
      description: 'Chemical resistant, premium option',
    },
    {
      value: 'urethane',
      label: 'Urethane Grout',
      description: 'Flexible, stain resistant',
    },
  ];

  const handleGroutCalculation = async () => {
    if (
      !groutForm.tile_length ||
      !groutForm.tile_width ||
      !groutForm.total_area ||
      !groutForm.joint_width
    ) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsCalculating(true);
    try {
      // Simulate API call for grout calculation
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const tileLength = parseFloat(groutForm.tile_length);
      const tileWidth = parseFloat(groutForm.tile_width);
      const tileThickness = parseFloat(groutForm.tile_thickness) || 0.25;
      const jointWidth = parseFloat(groutForm.joint_width);
      const jointDepth = parseFloat(groutForm.joint_depth) || tileThickness;
      const totalArea = parseFloat(groutForm.total_area);

      // Calculate grout volume
      const tileArea = tileLength * tileWidth;
      const tilesPerSqFt = 144 / tileArea; // 144 sq inches per sq ft
      const linearFeetOfJoints = tilesPerSqFt * ((tileLength + tileWidth) * 2);
      const groutVolumeCubicInches =
        linearFeetOfJoints * (jointWidth / 16) * (jointDepth / 16) * totalArea;
      const groutVolumeCubicFeet = groutVolumeCubicInches / 1728;
      const groutVolumeLiters = groutVolumeCubicFeet * 28.3168;

      // Calculate bags needed (accounting for waste)
      const coveragePerBag = groutForm.grout_type === 'sanded' ? 35 : 45;
      const bagsNeeded = Math.ceil(
        ((groutVolumeCubicFeet * 120) / coveragePerBag) * 1.1
      ); // 10% waste factor

      const mockCalculation: GroutCalculation = {
        grout_required: {
          volume_cubic_feet: groutVolumeCubicFeet,
          volume_liters: groutVolumeLiters,
          bags_needed: bagsNeeded,
          weight_kg: bagsNeeded * 11.34, // 25 lbs per bag
          coverage_sqft: totalArea,
        },
        materials_breakdown: {
          grout: {
            type: groutForm.grout_type,
            brand: 'GroutMaster Premium',
            bag_size: 25,
            bags_needed: bagsNeeded,
            cost_per_bag: groutForm.grout_type === 'epoxy' ? 45.99 : 18.5,
            total_cost:
              bagsNeeded * (groutForm.grout_type === 'epoxy' ? 45.99 : 18.5),
          },
          additives: [
            {
              name: 'Grout Sealer',
              quantity: Math.ceil(totalArea / 500),
              unit: 'quarts',
              cost: Math.ceil(totalArea / 500) * 15.99,
            },
            {
              name: 'Grout Enhancer',
              quantity: bagsNeeded,
              unit: 'packets',
              cost: bagsNeeded * 3.99,
            },
          ],
          tools: [
            {
              name: 'Grout Float',
              description: '9" rubber float',
              cost: 22.99,
              required: true,
            },
            {
              name: 'Grout Sponge',
              description: 'Large grouting sponge',
              cost: 4.99,
              required: true,
            },
            {
              name: 'Bucket',
              description: 'Mixing bucket',
              cost: 12.99,
              required: true,
            },
            {
              name: 'Margin Trowel',
              description: 'For mixing small batches',
              cost: 8.99,
              required: false,
            },
          ],
        },
        installation_specs: {
          mix_ratio:
            groutForm.grout_type === 'epoxy'
              ? '1:1 resin to hardener'
              : '1 bag to 2.5-3 quarts water',
          working_time:
            groutForm.grout_type === 'epoxy' ? '45 minutes' : '30 minutes',
          cure_time:
            groutForm.grout_type === 'epoxy' ? '24 hours' : '24-48 hours',
          joint_depth: jointDepth,
          joint_width: jointWidth,
          temperature_range: '65-85°F (18-29°C)',
          humidity_requirements: 'Low to moderate humidity',
        },
        cost_summary: {
          materials_cost:
            bagsNeeded * (groutForm.grout_type === 'epoxy' ? 45.99 : 18.5) +
            Math.ceil(totalArea / 500) * 15.99 +
            bagsNeeded * 3.99,
          estimated_labor: totalArea * 1.5, // $1.50 per sq ft for grouting
          total_cost: 0, // Will be calculated
          cost_per_sqft: 0, // Will be calculated
        },
      };

      mockCalculation.cost_summary.total_cost =
        mockCalculation.cost_summary.materials_cost +
        mockCalculation.cost_summary.estimated_labor;
      mockCalculation.cost_summary.cost_per_sqft =
        mockCalculation.cost_summary.total_cost / totalArea;

      setGroutCalculation(mockCalculation);
      toast.success('Grout calculation completed!');
    } catch (error) {
      toast.error('Error calculating grout requirements');
    } finally {
      setIsCalculating(false);
    }
  };

  const handleMaterialPlanning = async () => {
    if (!projectForm.project_name || !projectForm.total_area) {
      toast.error('Please fill in project name and area');
      return;
    }

    setIsPlanning(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const totalArea = parseFloat(projectForm.total_area);

      // Filter materials based on project requirements
      const requiredMaterials = availableMaterials.filter((material) => {
        if (material.required_for.includes('all')) return true;
        if (material.required_for.includes(projectForm.tile_type)) return true;
        if (material.category === 'grout') {
          return material.required_for.includes(
            parseFloat(projectForm.tile_size.split('x')[0]) >= 12
              ? 'wide_joints'
              : 'narrow_joints'
          );
        }
        return false;
      });

      // Calculate quantities and costs
      const materialsWithQuantities = requiredMaterials.map((material) => {
        let quantity = 1;

        if (material.category === 'adhesive') {
          quantity = Math.ceil(totalArea / material.coverage);
        } else if (material.category === 'grout') {
          quantity = Math.ceil(totalArea / material.coverage);
        } else if (material.category === 'sealant') {
          quantity = Math.ceil(totalArea / material.coverage);
        } else if (
          material.category === 'accessory' &&
          material.name.includes('Spacers')
        ) {
          quantity = Math.ceil(totalArea / material.coverage);
        }

        return {
          ...material,
          quantity,
          total_cost: quantity * material.price,
        };
      });

      const totalMaterialsCost = materialsWithQuantities.reduce(
        (sum, item) => sum + item.total_cost,
        0
      );
      const laborHours = totalArea * 0.5; // 0.5 hours per sq ft

      const mockProject: ProjectMaterials = {
        project_name: projectForm.project_name,
        total_area: totalArea,
        tile_type: projectForm.tile_type,
        installation_method: projectForm.installation_method,
        materials: materialsWithQuantities,
        total_cost: totalMaterialsCost,
        estimated_labor_hours: laborHours,
      };

      setProjectMaterials(mockProject);
      toast.success('Material planning completed!');
    } catch (error) {
      toast.error('Error planning materials');
    } finally {
      setIsPlanning(false);
    }
  };

  const handleFormChange = (tab: string, field: string, value: string) => {
    if (tab === 'grout') {
      setGroutForm((prev) => ({ ...prev, [field]: value }));
    } else if (tab === 'project') {
      setProjectForm((prev) => ({ ...prev, [field]: value }));
    }
  };

  const getCategoryIcon = (category: string): string => {
    switch (category) {
      case 'adhesive':
        return '🧱';
      case 'grout':
        return '🔘';
      case 'sealant':
        return '🛡️';
      case 'tool':
        return '🔧';
      case 'accessory':
        return '📐';
      default:
        return '📦';
    }
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          Grout Calculator & Material Planner
        </h2>
        <div className="text-sm text-gray-500">
          Complete material planning for tile installations
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('grout-calc')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'grout-calc'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            🔘 Grout Calculator
          </button>
          <button
            onClick={() => setActiveTab('material-planner')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'material-planner'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            📋 Material Planner
          </button>
          <button
            onClick={() => setActiveTab('cost-estimator')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'cost-estimator'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            💰 Cost Estimator
          </button>
        </nav>
      </div>

      {/* Grout Calculator Tab */}
      {activeTab === 'grout-calc' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card
              title="Tile & Joint Specifications"
              className="shadow-sm"
              style={{ borderColor: colors.$24 }}
              headerStyle={{ borderColor: colors.$20 }}
            >
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Element leftSide="Tile Length (inches)">
                    <InputField
                      type="number"
                      placeholder="12"
                      value={groutForm.tile_length}
                      onValueChange={(value) =>
                        handleFormChange('grout', 'tile_length', value)
                      }
                    />
                  </Element>
                  <Element leftSide="Tile Width (inches)">
                    <InputField
                      type="number"
                      placeholder="12"
                      value={groutForm.tile_width}
                      onValueChange={(value) =>
                        handleFormChange('grout', 'tile_width', value)
                      }
                    />
                  </Element>
                </div>

                <Element leftSide="Tile Thickness (inches)">
                  <InputField
                    type="number"
                    placeholder="0.25"
                    step="0.01"
                    value={groutForm.tile_thickness}
                    onValueChange={(value) =>
                      handleFormChange('grout', 'tile_thickness', value)
                    }
                  />
                </Element>

                <div className="grid grid-cols-2 gap-4">
                  <Element leftSide="Joint Width (inches)">
                    <InputField
                      type="number"
                      placeholder="0.125"
                      step="0.001"
                      value={groutForm.joint_width}
                      onValueChange={(value) =>
                        handleFormChange('grout', 'joint_width', value)
                      }
                    />
                  </Element>
                  <Element leftSide="Joint Depth (inches)">
                    <InputField
                      type="number"
                      placeholder="0.25"
                      step="0.01"
                      value={groutForm.joint_depth}
                      onValueChange={(value) =>
                        handleFormChange('grout', 'joint_depth', value)
                      }
                    />
                  </Element>
                </div>

                <Element leftSide="Total Area (sq ft)">
                  <InputField
                    type="number"
                    placeholder="100"
                    value={groutForm.total_area}
                    onValueChange={(value) =>
                      handleFormChange('grout', 'total_area', value)
                    }
                  />
                </Element>

                <Element leftSide="Grout Type">
                  <SelectField
                    value={groutForm.grout_type}
                    onValueChange={(value) =>
                      handleFormChange('grout', 'grout_type', value)
                    }
                    customSelector
                  >
                    {groutTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </SelectField>
                </Element>

                <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                  <div className="font-medium mb-1">Quick Reference:</div>
                  <div>
                    • 1/16" = 0.0625" • 1/8" = 0.125" • 3/16" = 0.1875" • 1/4" =
                    0.25"
                  </div>
                </div>

                <Button
                  behavior="button"
                  onClick={handleGroutCalculation}
                  disabled={isCalculating}
                  className="w-full bg-blue-600 text-white"
                >
                  {isCalculating
                    ? 'Calculating...'
                    : 'Calculate Grout Requirements'}
                </Button>
              </div>
            </Card>

            {groutCalculation && (
              <Card
                title="Grout Requirements"
                className="shadow-sm"
                style={{ borderColor: colors.$24 }}
                headerStyle={{ borderColor: colors.$20 }}
              >
                <div className="space-y-4">
                  {/* Volume Requirements */}
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-800 mb-3">
                      Volume Requirements
                    </h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-gray-600">Cubic Feet:</div>
                        <div className="font-bold text-lg">
                          {groutCalculation.grout_required.volume_cubic_feet.toFixed(
                            2
                          )}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-600">Liters:</div>
                        <div className="font-bold text-lg">
                          {groutCalculation.grout_required.volume_liters.toFixed(
                            1
                          )}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-600">Bags Needed:</div>
                        <div className="font-bold text-lg text-green-600">
                          {groutCalculation.grout_required.bags_needed}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-600">Total Weight:</div>
                        <div className="font-bold text-lg">
                          {groutCalculation.grout_required.weight_kg.toFixed(1)}{' '}
                          kg
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Grout Specs */}
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-medium text-green-800 mb-3">
                      Installation Specifications
                    </h4>
                    <div className="text-sm space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Mix Ratio:</span>
                        <span className="font-medium">
                          {groutCalculation.installation_specs.mix_ratio}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Working Time:</span>
                        <span className="font-medium">
                          {groutCalculation.installation_specs.working_time}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Cure Time:</span>
                        <span className="font-medium">
                          {groutCalculation.installation_specs.cure_time}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Temperature:</span>
                        <span className="font-medium">
                          {
                            groutCalculation.installation_specs
                              .temperature_range
                          }
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Cost Summary */}
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h4 className="font-medium text-yellow-800 mb-3">
                      Cost Summary
                    </h4>
                    <div className="text-sm space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Materials:</span>
                        <span className="font-medium">
                          {formatCurrency(
                            groutCalculation.cost_summary.materials_cost
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Labor:</span>
                        <span className="font-medium">
                          {formatCurrency(
                            groutCalculation.cost_summary.estimated_labor
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between border-t pt-2">
                        <span className="font-medium">Total:</span>
                        <span className="font-bold text-lg">
                          {formatCurrency(
                            groutCalculation.cost_summary.total_cost
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Per Sq Ft:</span>
                        <span className="font-medium">
                          {formatCurrency(
                            groutCalculation.cost_summary.cost_per_sqft
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Tools and Materials */}
          {groutCalculation && (
            <Card
              title="Required Tools & Materials"
              className="shadow-sm"
              style={{ borderColor: colors.$24 }}
              headerStyle={{ borderColor: colors.$20 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Grout */}
                <div>
                  <h4 className="font-medium text-gray-800 mb-3">🔘 Grout</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <div className="font-medium">
                        {groutCalculation.materials_breakdown.grout.brand}
                      </div>
                      <div className="text-gray-600">
                        {groutCalculation.materials_breakdown.grout.type} grout
                      </div>
                      <div className="text-gray-600">
                        {groutCalculation.materials_breakdown.grout.bags_needed}{' '}
                        bags ×{' '}
                        {formatCurrency(
                          groutCalculation.materials_breakdown.grout
                            .cost_per_bag
                        )}
                      </div>
                      <div className="font-medium text-green-600">
                        {formatCurrency(
                          groutCalculation.materials_breakdown.grout.total_cost
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additives */}
                <div>
                  <h4 className="font-medium text-gray-800 mb-3">
                    🧪 Additives
                  </h4>
                  <div className="space-y-2 text-sm">
                    {groutCalculation.materials_breakdown.additives.map(
                      (additive, index) => (
                        <div key={index}>
                          <div className="font-medium">{additive.name}</div>
                          <div className="text-gray-600">
                            {additive.quantity} {additive.unit}
                          </div>
                          <div className="font-medium text-green-600">
                            {formatCurrency(additive.cost)}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* Tools */}
                <div>
                  <h4 className="font-medium text-gray-800 mb-3">🔧 Tools</h4>
                  <div className="space-y-2 text-sm">
                    {groutCalculation.materials_breakdown.tools.map(
                      (tool, index) => (
                        <div
                          key={index}
                          className={tool.required ? '' : 'opacity-75'}
                        >
                          <div className="flex items-center">
                            <div className="font-medium">{tool.name}</div>
                            {tool.required && (
                              <span className="ml-1 text-red-500">*</span>
                            )}
                          </div>
                          <div className="text-gray-600">
                            {tool.description}
                          </div>
                          <div className="font-medium text-green-600">
                            {formatCurrency(tool.cost)}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Material Planner Tab */}
      {activeTab === 'material-planner' && (
        <div className="space-y-6">
          <Card
            title="Project Information"
            className="shadow-sm"
            style={{ borderColor: colors.$24 }}
            headerStyle={{ borderColor: colors.$20 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Element leftSide="Project Name">
                <InputField
                  placeholder="e.g., Kitchen Backsplash"
                  value={projectForm.project_name}
                  onValueChange={(value) =>
                    handleFormChange('project', 'project_name', value)
                  }
                />
              </Element>

              <Element leftSide="Total Area (sq ft)">
                <InputField
                  type="number"
                  placeholder="100"
                  value={projectForm.total_area}
                  onValueChange={(value) =>
                    handleFormChange('project', 'total_area', value)
                  }
                />
              </Element>

              <Element leftSide="Tile Type">
                <SelectField
                  value={projectForm.tile_type}
                  onValueChange={(value) =>
                    handleFormChange('project', 'tile_type', value)
                  }
                  customSelector
                >
                  <option value="ceramic">Ceramic</option>
                  <option value="porcelain">Porcelain</option>
                  <option value="natural_stone">Natural Stone</option>
                  <option value="glass">Glass</option>
                </SelectField>
              </Element>

              <Element leftSide="Tile Size">
                <SelectField
                  value={projectForm.tile_size}
                  onValueChange={(value) =>
                    handleFormChange('project', 'tile_size', value)
                  }
                  customSelector
                >
                  <option value="6x6">6" × 6"</option>
                  <option value="12x12">12" × 12"</option>
                  <option value="18x18">18" × 18"</option>
                  <option value="24x24">24" × 24"</option>
                  <option value="12x24">12" × 24"</option>
                </SelectField>
              </Element>

              <Element leftSide="Installation Method">
                <SelectField
                  value={projectForm.installation_method}
                  onValueChange={(value) =>
                    handleFormChange('project', 'installation_method', value)
                  }
                  customSelector
                >
                  <option value="standard">Standard</option>
                  <option value="wet_area">Wet Area</option>
                  <option value="outdoor">Outdoor</option>
                  <option value="heated_floor">Heated Floor</option>
                </SelectField>
              </Element>

              <Element leftSide="Substrate">
                <SelectField
                  value={projectForm.substrate_type}
                  onValueChange={(value) =>
                    handleFormChange('project', 'substrate_type', value)
                  }
                  customSelector
                >
                  <option value="concrete">Concrete</option>
                  <option value="plywood">Plywood</option>
                  <option value="existing_tile">Existing Tile</option>
                  <option value="drywall">Drywall</option>
                </SelectField>
              </Element>
            </div>

            <div className="mt-6">
              <Button
                behavior="button"
                onClick={handleMaterialPlanning}
                disabled={isPlanning}
                className="bg-green-600 text-white"
              >
                {isPlanning
                  ? 'Planning Materials...'
                  : 'Generate Material List'}
              </Button>
            </div>
          </Card>

          {projectMaterials && (
            <Card
              title={`Material List: ${projectMaterials.project_name}`}
              className="shadow-sm"
              style={{ borderColor: colors.$24 }}
              headerStyle={{ borderColor: colors.$20 }}
            >
              <div className="space-y-6">
                {/* Project Summary */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {projectMaterials.total_area}
                    </div>
                    <div className="text-sm text-gray-600">
                      Total Area (sq ft)
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {formatCurrency(projectMaterials.total_cost)}
                    </div>
                    <div className="text-sm text-gray-600">Materials Cost</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {projectMaterials.estimated_labor_hours.toFixed(1)}
                    </div>
                    <div className="text-sm text-gray-600">Labor Hours</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {projectMaterials.materials.length}
                    </div>
                    <div className="text-sm text-gray-600">Material Items</div>
                  </div>
                </div>

                {/* Materials List */}
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Item
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Category
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Quantity
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Unit Price
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {projectMaterials.materials.map((material, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <span className="text-lg mr-2">
                                {getCategoryIcon(material.category)}
                              </span>
                              <div>
                                <div className="font-medium text-gray-900">
                                  {material.name}
                                </div>
                                <div className="text-sm text-gray-600">
                                  {material.brand} - {material.size}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {material.description}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="capitalize text-sm text-gray-600">
                              {material.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm font-medium">
                              {material.quantity || 1}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-gray-900">
                              {formatCurrency(material.price)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm font-medium text-green-600">
                              {formatCurrency(
                                material.total_cost || material.price
                              )}
                            </span>
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

      {/* Cost Estimator Tab */}
      {activeTab === 'cost-estimator' && (
        <Card
          title="Complete Project Cost Estimator"
          className="shadow-sm"
          style={{ borderColor: colors.$24 }}
          headerStyle={{ borderColor: colors.$20 }}
        >
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🚧</div>
            <div className="text-xl font-medium text-gray-600 mb-2">
              Cost Estimator Coming Soon
            </div>
            <div className="text-gray-500">
              Comprehensive project cost estimation with labor, materials, and
              timeline
            </div>
            <div className="mt-4">
              <Button
                behavior="button"
                onClick={() => setActiveTab('material-planner')}
                className="bg-blue-600 text-white"
              >
                Use Material Planner Instead
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
