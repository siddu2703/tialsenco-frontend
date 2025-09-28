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
import { toast } from '$app/common/helpers/toast/toast';
import { useColorScheme } from '$app/common/colors';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  loyalty_points: number;
  membership_tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  projects: Project[];
  orders: Order[];
}

interface Project {
  id: string;
  name: string;
  description: string;
  status: 'planning' | 'in_progress' | 'completed' | 'on_hold';
  total_area: number;
  estimated_cost: number;
  created_date: string;
  completion_date?: string;
  tiles: ProjectTile[];
}

interface ProjectTile {
  product_id: string;
  product_key: string;
  tile_color: string;
  brand: string;
  quantity: number;
  price_per_unit: number;
  total_cost: number;
}

interface Order {
  id: string;
  order_number: string;
  status:
    | 'pending'
    | 'confirmed'
    | 'in_production'
    | 'shipped'
    | 'delivered'
    | 'cancelled';
  order_date: string;
  expected_delivery: string;
  total_amount: number;
  items: OrderItem[];
  shipping_address: string;
  tracking_number?: string;
}

interface OrderItem {
  product_id: string;
  product_key: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

interface SampleRequest {
  id: string;
  product_id: string;
  product_key: string;
  tile_color: string;
  brand: string;
  request_date: string;
  status: 'requested' | 'approved' | 'shipped' | 'received' | 'returned';
  expected_return_date?: string;
  notes: string;
}

export default function CustomerPortal() {
  const [t] = useTranslation();
  const colors = useColorScheme();

  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'projects' | 'orders' | 'samples' | 'profile'
  >('dashboard');
  const [isLoading, setIsLoading] = useState(false);

  // Mock customer data
  const [customer, setCustomer] = useState<Customer>({
    id: 'CUST001',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    phone: '(555) 123-4567',
    address: '123 Main St, Anytown, ST 12345',
    loyalty_points: 2450,
    membership_tier: 'Gold',
    projects: [
      {
        id: 'PROJ001',
        name: 'Kitchen Renovation',
        description: 'Complete kitchen backsplash and floor renovation',
        status: 'in_progress',
        total_area: 250,
        estimated_cost: 3500,
        created_date: '2024-09-01',
        tiles: [
          {
            product_id: 'TILE001',
            product_key: 'MAR-WHT-12X12',
            tile_color: 'Marble White',
            brand: 'TilePro',
            quantity: 150,
            price_per_unit: 8.99,
            total_cost: 1348.5,
          },
          {
            product_id: 'TILE002',
            product_key: 'SUB-GRY-3X6',
            tile_color: 'Gray Subway',
            brand: 'CeramicCraft',
            quantity: 100,
            price_per_unit: 5.49,
            total_cost: 549.0,
          },
        ],
      },
      {
        id: 'PROJ002',
        name: 'Bathroom Remodel',
        description: 'Master bathroom shower and floor',
        status: 'planning',
        total_area: 80,
        estimated_cost: 1200,
        created_date: '2024-09-15',
        tiles: [],
      },
    ],
    orders: [
      {
        id: 'ORD001',
        order_number: 'TIL-2024-001',
        status: 'shipped',
        order_date: '2024-09-10',
        expected_delivery: '2024-09-25',
        total_amount: 1897.5,
        items: [
          {
            product_id: 'TILE001',
            product_key: 'MAR-WHT-12X12',
            quantity: 150,
            unit_price: 8.99,
            total_price: 1348.5,
          },
          {
            product_id: 'TILE002',
            product_key: 'SUB-GRY-3X6',
            quantity: 100,
            unit_price: 5.49,
            total_price: 549.0,
          },
        ],
        shipping_address: '123 Main St, Anytown, ST 12345',
        tracking_number: 'TRK123456789',
      },
    ],
  });

  const [sampleRequests, setSampleRequests] = useState<SampleRequest[]>([
    {
      id: 'SAMP001',
      product_id: 'TILE003',
      product_key: 'POR-BEI-24X24',
      tile_color: 'Beige Porcelain',
      brand: 'StoneWorks',
      request_date: '2024-09-20',
      status: 'shipped',
      expected_return_date: '2024-10-05',
      notes: 'For bathroom project evaluation',
    },
    {
      id: 'SAMP002',
      product_id: 'TILE004',
      product_key: 'NAT-TRA-18X18',
      tile_color: 'Natural Travertine',
      brand: 'NatureStone',
      request_date: '2024-09-22',
      status: 'requested',
      notes: 'Outdoor patio consideration',
    },
  ]);

  const [newSampleRequest, setNewSampleRequest] = useState({
    product_key: '',
    notes: '',
  });

  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    total_area: '',
  });

  const getStatusColor = (
    status: string,
    type: 'project' | 'order' | 'sample'
  ): string => {
    const statusColors = {
      project: {
        planning: 'text-blue-600 bg-blue-100',
        in_progress: 'text-yellow-600 bg-yellow-100',
        completed: 'text-green-600 bg-green-100',
        on_hold: 'text-red-600 bg-red-100',
      },
      order: {
        pending: 'text-gray-600 bg-gray-100',
        confirmed: 'text-blue-600 bg-blue-100',
        in_production: 'text-yellow-600 bg-yellow-100',
        shipped: 'text-purple-600 bg-purple-100',
        delivered: 'text-green-600 bg-green-100',
        cancelled: 'text-red-600 bg-red-100',
      },
      sample: {
        requested: 'text-blue-600 bg-blue-100',
        approved: 'text-green-600 bg-green-100',
        shipped: 'text-purple-600 bg-purple-100',
        received: 'text-yellow-600 bg-yellow-100',
        returned: 'text-gray-600 bg-gray-100',
      },
    };

    return statusColors[type][status] || 'text-gray-600 bg-gray-100';
  };

  const getTierColor = (tier: string): string => {
    switch (tier) {
      case 'Bronze':
        return 'text-orange-600 bg-orange-100';
      case 'Silver':
        return 'text-gray-600 bg-gray-100';
      case 'Gold':
        return 'text-yellow-600 bg-yellow-100';
      case 'Platinum':
        return 'text-purple-600 bg-purple-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleSampleRequest = async () => {
    if (!newSampleRequest.product_key) {
      toast.error('Please enter a product key');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newRequest: SampleRequest = {
        id: `SAMP${Date.now()}`,
        product_id: `TILE${Date.now()}`,
        product_key: newSampleRequest.product_key,
        tile_color: 'Color TBD',
        brand: 'Brand TBD',
        request_date: new Date().toISOString().split('T')[0],
        status: 'requested',
        notes: newSampleRequest.notes,
      };

      setSampleRequests((prev) => [newRequest, ...prev]);
      setNewSampleRequest({ product_key: '', notes: '' });
      toast.success('Sample request submitted successfully!');
    } catch (error) {
      toast.error('Error submitting sample request');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateProject = async () => {
    if (!newProject.name || !newProject.total_area) {
      toast.error('Please fill in required fields');
      return;
    }

    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const project: Project = {
        id: `PROJ${Date.now()}`,
        name: newProject.name,
        description: newProject.description,
        status: 'planning',
        total_area: parseFloat(newProject.total_area),
        estimated_cost: 0,
        created_date: new Date().toISOString().split('T')[0],
        tiles: [],
      };

      setCustomer((prev) => ({
        ...prev,
        projects: [project, ...prev.projects],
      }));

      setNewProject({ name: '', description: '', total_area: '' });
      toast.success('Project created successfully!');
    } catch (error) {
      toast.error('Error creating project');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Customer Portal</h2>
          <div className="text-sm text-gray-500">
            Welcome back, {customer.name}!
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className="text-sm text-gray-600">Loyalty Points</div>
            <div className="font-bold text-blue-600">
              {customer.loyalty_points.toLocaleString()}
            </div>
          </div>
          <span
            className={`px-3 py-1 text-sm font-semibold rounded-full ${getTierColor(
              customer.membership_tier
            )}`}
          >
            {customer.membership_tier} Member
          </span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { key: 'dashboard', label: '📊 Dashboard', icon: '📊' },
            { key: 'projects', label: '🏗️ My Projects', icon: '🏗️' },
            { key: 'orders', label: '📦 Orders', icon: '📦' },
            { key: 'samples', label: '🎨 Samples', icon: '🎨' },
            { key: 'profile', label: '👤 Profile', icon: '👤' },
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

      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card
              className="text-center p-4"
              style={{ borderColor: colors.$24 }}
            >
              <div className="text-2xl font-bold text-blue-600">
                {customer.projects.length}
              </div>
              <div className="text-sm text-gray-600">Active Projects</div>
            </Card>
            <Card
              className="text-center p-4"
              style={{ borderColor: colors.$24 }}
            >
              <div className="text-2xl font-bold text-green-600">
                {customer.orders.length}
              </div>
              <div className="text-sm text-gray-600">Total Orders</div>
            </Card>
            <Card
              className="text-center p-4"
              style={{ borderColor: colors.$24 }}
            >
              <div className="text-2xl font-bold text-purple-600">
                {sampleRequests.length}
              </div>
              <div className="text-sm text-gray-600">Sample Requests</div>
            </Card>
            <Card
              className="text-center p-4"
              style={{ borderColor: colors.$24 }}
            >
              <div className="text-2xl font-bold text-orange-600">
                {customer.loyalty_points}
              </div>
              <div className="text-sm text-gray-600">Loyalty Points</div>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card
              title="Recent Projects"
              className="shadow-sm"
              style={{ borderColor: colors.$24 }}
              headerStyle={{ borderColor: colors.$20 }}
            >
              <div className="space-y-3">
                {customer.projects.slice(0, 3).map((project) => (
                  <div
                    key={project.id}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="font-medium">{project.name}</div>
                      <div className="text-sm text-gray-600">
                        {project.total_area} sq ft
                      </div>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                        project.status,
                        'project'
                      )}`}
                    >
                      {project.status.replace('_', ' ')}
                    </span>
                  </div>
                ))}
                <Button
                  behavior="button"
                  onClick={() => setActiveTab('projects')}
                  className="w-full text-sm text-blue-600 border border-blue-600"
                >
                  View All Projects
                </Button>
              </div>
            </Card>

            <Card
              title="Recent Orders"
              className="shadow-sm"
              style={{ borderColor: colors.$24 }}
              headerStyle={{ borderColor: colors.$20 }}
            >
              <div className="space-y-3">
                {customer.orders.slice(0, 3).map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="font-medium">{order.order_number}</div>
                      <div className="text-sm text-gray-600">
                        {formatCurrency(order.total_amount)}
                      </div>
                    </div>
                    <div className="text-right">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                          order.status,
                          'order'
                        )}`}
                      >
                        {order.status}
                      </span>
                      <div className="text-xs text-gray-500 mt-1">
                        {formatDate(order.order_date)}
                      </div>
                    </div>
                  </div>
                ))}
                <Button
                  behavior="button"
                  onClick={() => setActiveTab('orders')}
                  className="w-full text-sm text-blue-600 border border-blue-600"
                >
                  View All Orders
                </Button>
              </div>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card
            title="Quick Actions"
            className="shadow-sm"
            style={{ borderColor: colors.$24 }}
            headerStyle={{ borderColor: colors.$20 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                behavior="button"
                onClick={() => setActiveTab('projects')}
                className="flex items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors"
              >
                <div className="text-center">
                  <div className="text-3xl mb-2">🏗️</div>
                  <div className="font-medium">Create New Project</div>
                  <div className="text-sm text-gray-600">
                    Start planning your next tile project
                  </div>
                </div>
              </Button>

              <Button
                behavior="button"
                onClick={() => setActiveTab('samples')}
                className="flex items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors"
              >
                <div className="text-center">
                  <div className="text-3xl mb-2">🎨</div>
                  <div className="font-medium">Request Samples</div>
                  <div className="text-sm text-gray-600">
                    Order samples for your projects
                  </div>
                </div>
              </Button>

              <Button
                behavior="button"
                onClick={() => toast.info('Calculator opened')}
                className="flex items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors"
              >
                <div className="text-center">
                  <div className="text-3xl mb-2">📐</div>
                  <div className="font-medium">Calculate Materials</div>
                  <div className="text-sm text-gray-600">
                    Use our tile calculator tools
                  </div>
                </div>
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Projects Tab */}
      {activeTab === 'projects' && (
        <div className="space-y-6">
          <Card
            title="Create New Project"
            className="shadow-sm"
            style={{ borderColor: colors.$24 }}
            headerStyle={{ borderColor: colors.$20 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Element leftSide="Project Name">
                <InputField
                  placeholder="e.g., Kitchen Backsplash"
                  value={newProject.name}
                  onValueChange={(value) =>
                    setNewProject((prev) => ({ ...prev, name: value }))
                  }
                />
              </Element>
              <Element leftSide="Total Area (sq ft)">
                <InputField
                  type="number"
                  placeholder="100"
                  value={newProject.total_area}
                  onValueChange={(value) =>
                    setNewProject((prev) => ({ ...prev, total_area: value }))
                  }
                />
              </Element>
              <div className="flex items-end">
                <Button
                  behavior="button"
                  onClick={handleCreateProject}
                  disabled={isLoading}
                  className="w-full bg-blue-600 text-white"
                >
                  {isLoading ? 'Creating...' : 'Create Project'}
                </Button>
              </div>
            </div>
            <Element leftSide="Description">
              <InputField
                placeholder="Describe your project..."
                value={newProject.description}
                onValueChange={(value) =>
                  setNewProject((prev) => ({ ...prev, description: value }))
                }
              />
            </Element>
          </Card>

          <Card
            title="My Projects"
            className="shadow-sm"
            style={{ borderColor: colors.$24 }}
            headerStyle={{ borderColor: colors.$20 }}
          >
            <div className="space-y-4">
              {customer.projects.map((project) => (
                <div
                  key={project.id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-medium">{project.name}</h3>
                      <p className="text-sm text-gray-600">
                        {project.description}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(
                        project.status,
                        'project'
                      )}`}
                    >
                      {project.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="text-gray-600">Total Area:</div>
                      <div className="font-medium">
                        {project.total_area} sq ft
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-600">Estimated Cost:</div>
                      <div className="font-medium">
                        {formatCurrency(project.estimated_cost)}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-600">Created:</div>
                      <div className="font-medium">
                        {formatDate(project.created_date)}
                      </div>
                    </div>
                  </div>

                  {project.tiles.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-medium mb-2">Selected Tiles</h4>
                      <div className="space-y-2">
                        {project.tiles.map((tile, index) => (
                          <div
                            key={index}
                            className="flex justify-between items-center bg-gray-50 p-2 rounded"
                          >
                            <div>
                              <div className="font-medium">
                                {tile.product_key}
                              </div>
                              <div className="text-sm text-gray-600">
                                {tile.brand} - {tile.tile_color}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-medium">
                                {tile.quantity} units
                              </div>
                              <div className="text-sm text-gray-600">
                                {formatCurrency(tile.total_cost)}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-4 flex space-x-2">
                    <Button
                      behavior="button"
                      onClick={() => toast.info('Project editor opened')}
                      className="text-sm bg-blue-600 text-white"
                    >
                      Edit Project
                    </Button>
                    <Button
                      behavior="button"
                      onClick={() => toast.info('Quote generated')}
                      className="text-sm border border-gray-300 text-gray-700"
                    >
                      Get Quote
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <Card
          title="Order History"
          className="shadow-sm"
          style={{ borderColor: colors.$24 }}
          headerStyle={{ borderColor: colors.$20 }}
        >
          <div className="space-y-4">
            {customer.orders.map((order) => (
              <div
                key={order.id}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-medium">
                      {order.order_number}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Ordered on {formatDate(order.order_date)}
                    </p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(
                        order.status,
                        'order'
                      )}`}
                    >
                      {order.status}
                    </span>
                    <div className="text-lg font-bold mt-1">
                      {formatCurrency(order.total_amount)}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
                  <div>
                    <div className="text-gray-600">Expected Delivery:</div>
                    <div className="font-medium">
                      {formatDate(order.expected_delivery)}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-600">Tracking Number:</div>
                    <div className="font-medium">
                      {order.tracking_number || 'Not available'}
                    </div>
                  </div>
                </div>

                <div className="border-t pt-3">
                  <h4 className="font-medium mb-2">Order Items</h4>
                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center"
                      >
                        <div>
                          <div className="font-medium">{item.product_key}</div>
                          <div className="text-sm text-gray-600">
                            {item.quantity} units ×{' '}
                            {formatCurrency(item.unit_price)}
                          </div>
                        </div>
                        <div className="font-medium">
                          {formatCurrency(item.total_price)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {order.tracking_number && (
                  <div className="mt-4">
                    <Button
                      behavior="button"
                      onClick={() => toast.info('Tracking details opened')}
                      className="text-sm bg-blue-600 text-white"
                    >
                      Track Package
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Samples Tab */}
      {activeTab === 'samples' && (
        <div className="space-y-6">
          <Card
            title="Request New Sample"
            className="shadow-sm"
            style={{ borderColor: colors.$24 }}
            headerStyle={{ borderColor: colors.$20 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Element leftSide="Product Key">
                <InputField
                  placeholder="e.g., MAR-WHT-12X12"
                  value={newSampleRequest.product_key}
                  onValueChange={(value) =>
                    setNewSampleRequest((prev) => ({
                      ...prev,
                      product_key: value,
                    }))
                  }
                />
              </Element>
              <div className="flex items-end">
                <Button
                  behavior="button"
                  onClick={handleSampleRequest}
                  disabled={isLoading}
                  className="w-full bg-blue-600 text-white"
                >
                  {isLoading ? 'Requesting...' : 'Request Sample'}
                </Button>
              </div>
            </div>
            <Element leftSide="Notes">
              <InputField
                placeholder="Notes about your sample request..."
                value={newSampleRequest.notes}
                onValueChange={(value) =>
                  setNewSampleRequest((prev) => ({ ...prev, notes: value }))
                }
              />
            </Element>
          </Card>

          <Card
            title="My Sample Requests"
            className="shadow-sm"
            style={{ borderColor: colors.$24 }}
            headerStyle={{ borderColor: colors.$20 }}
          >
            <div className="space-y-4">
              {sampleRequests.map((request) => (
                <div
                  key={request.id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-medium">
                        {request.product_key}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {request.brand} - {request.tile_color}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(
                        request.status,
                        'sample'
                      )}`}
                    >
                      {request.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-gray-600">Request Date:</div>
                      <div className="font-medium">
                        {formatDate(request.request_date)}
                      </div>
                    </div>
                    {request.expected_return_date && (
                      <div>
                        <div className="text-gray-600">Expected Return:</div>
                        <div className="font-medium">
                          {formatDate(request.expected_return_date)}
                        </div>
                      </div>
                    )}
                  </div>

                  {request.notes && (
                    <div className="mt-3">
                      <div className="text-gray-600 text-sm">Notes:</div>
                      <div className="text-sm">{request.notes}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card
            title="Customer Information"
            className="shadow-sm"
            style={{ borderColor: colors.$24 }}
            headerStyle={{ borderColor: colors.$20 }}
          >
            <div className="space-y-4">
              <Element leftSide="Full Name">
                <InputField value={customer.name} onValueChange={() => {}} />
              </Element>
              <Element leftSide="Email">
                <InputField value={customer.email} onValueChange={() => {}} />
              </Element>
              <Element leftSide="Phone">
                <InputField value={customer.phone} onValueChange={() => {}} />
              </Element>
              <Element leftSide="Address">
                <InputField value={customer.address} onValueChange={() => {}} />
              </Element>
              <Button
                behavior="button"
                onClick={() => toast.success('Profile updated!')}
                className="bg-blue-600 text-white"
              >
                Update Profile
              </Button>
            </div>
          </Card>

          <Card
            title="Loyalty Program"
            className="shadow-sm"
            style={{ borderColor: colors.$24 }}
            headerStyle={{ borderColor: colors.$20 }}
          >
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {customer.loyalty_points.toLocaleString()}
                </div>
                <div className="text-gray-600">Available Points</div>
                <span
                  className={`inline-block px-4 py-2 text-sm font-semibold rounded-full mt-2 ${getTierColor(
                    customer.membership_tier
                  )}`}
                >
                  {customer.membership_tier} Member
                </span>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Tier Benefits</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Free samples (up to 3 per month)</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Priority customer support</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Exclusive member pricing</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Early access to new products</span>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Points Progress</h4>
                <div className="text-sm text-gray-600 mb-2">
                  550 more points to reach Platinum tier
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: '82%' }}
                  />
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
