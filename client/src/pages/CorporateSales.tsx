import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DollarSign, TrendingUp, Users, Package, Building2, Calendar, Target, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatPrice } from '@/lib/utils';

interface CorporateOrder {
  id: string;
  companyName: string;
  contactEmail: string;
  orderDate: string;
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }>;
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  bulkDiscount: number;
}

// Sample corporate sales data
const sampleCorporateOrders: CorporateOrder[] = [
  {
    id: 'corp-order-001',
    companyName: 'TechFlow Solutions',
    contactEmail: 'hr@techflow.com',
    orderDate: '2024-12-28',
    items: [
      { productId: 'corp-1', productName: 'Premium Coffee Mug', quantity: 50, unitPrice: 24.99, totalPrice: 1249.50 },
      { productId: 'corp-2', productName: 'Corporate T-Shirt', quantity: 50, unitPrice: 19.99, totalPrice: 999.50 }
    ],
    totalAmount: 2249.00,
    status: 'delivered',
    bulkDiscount: 15
  },
  {
    id: 'corp-order-002',
    companyName: 'Creative Agency LLC',
    contactEmail: 'admin@creativeagency.com',
    orderDate: '2024-12-29',
    items: [
      { productId: 'corp-3', productName: 'Branded Notebook', quantity: 100, unitPrice: 12.99, totalPrice: 1299.00 }
    ],
    totalAmount: 1299.00,
    status: 'processing',
    bulkDiscount: 20
  },
  {
    id: 'corp-order-003',
    companyName: 'Global Enterprises',
    contactEmail: 'procurement@globalent.com',
    orderDate: '2024-12-30',
    items: [
      { productId: 'corp-1', productName: 'Premium Coffee Mug', quantity: 200, unitPrice: 24.99, totalPrice: 4998.00 },
      { productId: 'corp-4', productName: 'Water Bottle', quantity: 200, unitPrice: 18.99, totalPrice: 3798.00 }
    ],
    totalAmount: 8796.00,
    status: 'shipped',
    bulkDiscount: 25
  }
];

export default function CorporateSales() {
  const [timeRange, setTimeRange] = useState('30');

  // Calculate metrics
  const totalRevenue = sampleCorporateOrders.reduce((sum, order) => sum + order.totalAmount, 0);
  const totalOrders = sampleCorporateOrders.length;
  const uniqueCompanies = new Set(sampleCorporateOrders.map(order => order.companyName)).size;
  const averageOrderValue = totalRevenue / totalOrders;
  const totalItemsSold = sampleCorporateOrders.reduce((sum, order) => 
    sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0);

  // Status distribution
  const statusCounts = sampleCorporateOrders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-serif font-bold text-charcoal mb-2">Corporate Sales Overview</h1>
            <p className="text-sophisticated-gray">Track corporate gift orders, revenue, and client relationships</p>
          </div>
          <div className="flex items-center space-x-4">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
                <SelectItem value="365">Last year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold text-green-600">{formatPrice(totalRevenue)}</p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              <span className="text-green-600">+12.5%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Corporate Orders</p>
                <p className="text-2xl font-bold text-blue-600">{totalOrders}</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              <span className="text-blue-600">+8.3%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Clients</p>
                <p className="text-2xl font-bold text-purple-600">{uniqueCompanies}</p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Building2 className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              <span className="text-purple-600">+2</span> new this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Order Value</p>
                <p className="text-2xl font-bold text-orange-600">{formatPrice(averageOrderValue)}</p>
              </div>
              <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              <span className="text-orange-600">+15.2%</span> from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders and Order Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Recent Corporate Orders */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="mr-2" size={20} />
              Recent Corporate Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sampleCorporateOrders.map((order) => (
                <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-charcoal">{order.companyName}</h4>
                      <p className="text-sm text-muted-foreground">{order.contactEmail}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">{formatPrice(order.totalAmount)}</p>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p>Order Date: {new Date(order.orderDate).toLocaleDateString()}</p>
                    <p>Items: {order.items.length} products, {order.items.reduce((sum, item) => sum + item.quantity, 0)} total units</p>
                    <p>Bulk Discount: {order.bulkDiscount}%</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Order Status Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="mr-2" size={20} />
              Order Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(statusCounts).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${
                      status === 'delivered' ? 'bg-green-500' :
                      status === 'shipped' ? 'bg-blue-500' :
                      status === 'processing' ? 'bg-yellow-500' : 'bg-gray-500'
                    }`}></div>
                    <span className="text-sm capitalize">{status}</span>
                  </div>
                  <span className="font-semibold">{count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Products and Performance Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Corporate Products */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="mr-2" size={20} />
              Top Corporate Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">Premium Coffee Mug</p>
                  <p className="text-sm text-muted-foreground">250 units sold</p>
                </div>
                <p className="font-semibold text-green-600">{formatPrice(6247.50)}</p>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">Water Bottle</p>
                  <p className="text-sm text-muted-foreground">200 units sold</p>
                </div>
                <p className="font-semibold text-green-600">{formatPrice(3798.00)}</p>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">Branded Notebook</p>
                  <p className="text-sm text-muted-foreground">100 units sold</p>
                </div>
                <p className="font-semibold text-green-600">{formatPrice(1299.00)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2" size={20} />
              Performance Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">Peak Season Performance</h4>
                <p className="text-sm text-blue-700">December orders up 45% - holiday corporate gifting surge</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-800 mb-2">Bulk Order Success</h4>
                <p className="text-sm text-green-700">Average bulk discount: 20% driving larger order volumes</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <h4 className="font-medium text-purple-800 mb-2">Client Retention</h4>
                <p className="text-sm text-purple-700">67% repeat customer rate in corporate segment</p>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg">
                <h4 className="font-medium text-orange-800 mb-2">Growth Opportunity</h4>
                <p className="text-sm text-orange-700">Tech companies show highest order values - expand outreach</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}