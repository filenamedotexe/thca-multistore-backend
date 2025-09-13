'use client'

// Cannabis Dashboard Component - Official Recharts Pattern
// Reference: https://recharts.org/en-US/guide/getting-started

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { 
  TrendingUp, 
  Users, 
  ShoppingCart, 
  DollarSign,
  Package,
  AlertTriangle,
  CheckCircle,
  Leaf
} from 'lucide-react'

interface CannabisOrderData {
  month: string
  retail: number
  luxury: number
  wholesale: number
}

interface ComplianceMetric {
  name: string
  value: number
  status: 'pass' | 'warning' | 'fail'
  color: string
}

interface CannabisStoreMetrics {
  totalOrders: number
  totalRevenue: number
  activeCustomers: number
  inventoryItems: number
  complianceScore: number
}

interface CannabisMetrics extends CannabisStoreMetrics {
  storeType: 'retail' | 'luxury' | 'wholesale'
  storeName: string
}

interface CannabisAnalyticsProps {
  metrics: CannabisMetrics
  orderData: CannabisOrderData[]
  complianceData: ComplianceMetric[]
}

const CHART_COLORS = {
  retail: '#10b981',
  luxury: '#8b5cf6', 
  wholesale: '#3b82f6',
  pass: '#22c55e',
  warning: '#f59e0b',
  fail: '#ef4444'
}

export default function CannabisAnalytics({ 
  metrics, 
  orderData, 
  complianceData 
}: CannabisAnalyticsProps) {
  
  const getStoreTheme = (storeType: string) => {
    switch (storeType) {
      case 'retail': return 'border-green-200 bg-green-50'
      case 'luxury': return 'border-purple-200 bg-purple-50'
      case 'wholesale': return 'border-blue-200 bg-blue-50'
      default: return 'border-gray-200 bg-gray-50'
    }
  }

  const MetricCard = ({ 
    title, 
    value, 
    icon: Icon, 
    trend, 
    color 
  }: { 
    title: string
    value: string | number
    icon: any
    trend?: string
    color: string
  }) => (
    <Card className={`${getStoreTheme(metrics.storeType)}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${color}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend && (
          <p className="text-xs text-muted-foreground">
            {trend}
          </p>
        )}
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Cannabis Analytics</h2>
          <p className="text-muted-foreground">
            {metrics.storeName} - {metrics.storeType.toUpperCase()} Dashboard
          </p>
        </div>
        <Badge variant="outline" className="flex items-center gap-2">
          <Leaf className="h-4 w-4" />
          Cannabis Compliant
        </Badge>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Orders"
          value={metrics.totalOrders.toLocaleString()}
          icon={ShoppingCart}
          trend="+12% from last month"
          color="text-green-600"
        />
        <MetricCard
          title="Revenue"
          value={`$${metrics.totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          trend="+8% from last month"
          color="text-green-600"
        />
        <MetricCard
          title="Active Customers"
          value={metrics.activeCustomers.toLocaleString()}
          icon={Users}
          trend="+15% from last month"
          color="text-blue-600"
        />
        <MetricCard
          title="Inventory Items"
          value={metrics.inventoryItems}
          icon={Package}
          trend="18 low stock items"
          color="text-orange-600"
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Orders Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Orders by Store Type</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={orderData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="retail" fill={CHART_COLORS.retail} name="Retail" />
                <Bar dataKey="luxury" fill={CHART_COLORS.luxury} name="Luxury" />
                <Bar dataKey="wholesale" fill={CHART_COLORS.wholesale} name="Wholesale" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Compliance Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Cannabis Compliance Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={complianceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  dataKey="value"
                  nameKey="name"
                >
                  {complianceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Compliance Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Cannabis Compliance Score: {metrics.complianceScore}%
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Progress value={metrics.complianceScore} className="w-full" />
            <div className="grid gap-4 md:grid-cols-3">
              {complianceData.map((metric) => (
                <div key={metric.name} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-2">
                    {metric.status === 'pass' && <CheckCircle className="h-4 w-4 text-green-600" />}
                    {metric.status === 'warning' && <AlertTriangle className="h-4 w-4 text-orange-600" />}
                    {metric.status === 'fail' && <AlertTriangle className="h-4 w-4 text-red-600" />}
                    <span className="text-sm font-medium">{metric.name}</span>
                  </div>
                  <Badge 
                    variant={metric.status === 'pass' ? 'default' : 'secondary'}
                    className={metric.status === 'pass' ? 'bg-green-100 text-green-800' : ''}
                  >
                    {metric.value}%
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Default props for demo purposes
export const defaultCannabisMetrics: CannabisMetrics = {
  storeType: 'retail',
  storeName: 'Cannabis Store',
  totalOrders: 1234,
  totalRevenue: 45678,
  activeCustomers: 892,
  inventoryItems: 156,
  complianceScore: 98
}

export const defaultOrderData: CannabisOrderData[] = [
  { month: 'Jan', retail: 120, luxury: 80, wholesale: 200 },
  { month: 'Feb', retail: 150, luxury: 90, wholesale: 220 },
  { month: 'Mar', retail: 180, luxury: 110, wholesale: 250 },
  { month: 'Apr', retail: 200, luxury: 130, wholesale: 280 },
  { month: 'May', retail: 220, luxury: 150, wholesale: 300 },
  { month: 'Jun', retail: 250, luxury: 170, wholesale: 320 }
]

export const defaultComplianceData: ComplianceMetric[] = [
  { name: 'Age Verification', value: 100, status: 'pass', color: CHART_COLORS.pass },
  { name: 'Lab Testing', value: 98, status: 'pass', color: CHART_COLORS.pass },
  { name: 'Packaging Compliance', value: 95, status: 'warning', color: CHART_COLORS.warning },
  { name: 'Tracking & Reporting', value: 99, status: 'pass', color: CHART_COLORS.pass }
]