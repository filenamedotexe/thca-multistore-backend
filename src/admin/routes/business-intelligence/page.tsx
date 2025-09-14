// Multi-Store Business Intelligence - Official Medusa v2 UI Route Pattern
// Provides operational insights across 3 stores that native Medusa admin cannot
// Reference: https://docs.medusajs.com/learn/customization/customize-admin

import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Button, Badge, Text, Label } from "@medusajs/ui"
import React, { useState, useEffect } from "react"

// Real Store Performance Data Interface
interface StorePerformance {
  storeId: string
  storeName: string
  storeType: string
  domain: string
  totalRevenue: number
  totalOrders: number
  averageOrderValue: number
  totalCustomers: number
  conversionRate: number
  topProducts: Array<{
    id: string
    title: string
    revenue: number
    quantity: number
  }>
  recentOrders: Array<{
    id: string
    display_id: number
    total: number
    created_at: string
    customer_email: string
  }>
}

interface BusinessMetrics {
  totalRevenue: number
  totalOrders: number
  totalCustomers: number
  averageOrderValue: number
  conversionRate: number
  growthRate: number
  storeComparison: StorePerformance[]
}

const BusinessIntelligencePage = () => {
  const [metrics, setMetrics] = useState<BusinessMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [timeframe, setTimeframe] = useState<string>('today')
  const [currentTime, setCurrentTime] = useState<string>('')

  // Update Chicago time every second for real-time display
  useEffect(() => {
    const updateChicagoTime = () => {
      const now = new Date()
      const chicagoTime = new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/Chicago',
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      }).format(now)
      setCurrentTime(chicagoTime)
    }

    updateChicagoTime()
    const interval = setInterval(updateChicagoTime, 1000)
    return () => clearInterval(interval)
  }, [])

  // Fetch real business intelligence data across all stores
  useEffect(() => {
    const fetchBusinessIntelligence = async () => {
      try {
        setLoading(true)
        setError(null)

        // ✅ Fetch store configurations for comparison
        const storesResponse = await fetch('/admin/business/stores', {
          credentials: 'include'
        })

        if (!storesResponse.ok) {
          throw new Error(`Stores API failed: ${storesResponse.status}`)
        }

        const storesData = await storesResponse.json()
        console.log('Real stores data for business intelligence:', storesData)

        // ✅ Fetch unified business metrics across all stores
        const metricsResponse = await fetch(`/admin/business/intelligence?timeframe=${timeframe}`, {
          credentials: 'include'
        })

        if (!metricsResponse.ok) {
          throw new Error(`Business metrics API failed: ${metricsResponse.status}`)
        }

        const metricsData = await metricsResponse.json()
        console.log('Real business metrics:', metricsData)

        setMetrics(metricsData)
        console.log('✅ Business intelligence data loaded from database')

      } catch (error) {
        console.error('Failed to fetch business intelligence data:', error)
        setError(error instanceof Error ? error.message : 'Failed to load business data')
      } finally {
        setLoading(false)
      }
    }

    fetchBusinessIntelligence()
  }, [timeframe])

  // Calculate store performance rankings
  const getStoreRanking = (stores: StorePerformance[]) => {
    return stores.sort((a, b) => b.totalRevenue - a.totalRevenue)
  }

  const getPerformanceBadge = (store: StorePerformance, allStores: StorePerformance[]) => {
    const ranking = getStoreRanking(allStores)
    const position = ranking.findIndex(s => s.storeId === store.storeId) + 1

    switch (position) {
      case 1:
        return <Badge color="green">🥇 Top Performer</Badge>
      case 2:
        return <Badge color="blue">🥈 Strong Performance</Badge>
      case 3:
        return <Badge color="orange">🥉 Growth Opportunity</Badge>
      default:
        return <Badge color="grey">📊 Tracking</Badge>
    }
  }

  // Error state
  if (error) {
    return (
      <Container className="divide-y p-0">
        <div className="flex items-center justify-between px-6 py-4">
          <Heading level="h1">Business Intelligence - Error</Heading>
          <Badge color="red">❌ Data Error</Badge>
        </div>
        <div className="px-6 py-6">
          <Text className="text-red-600">Failed to load business data: {error}</Text>
          <Text size="small" className="text-gray-600 mt-2">
            Please check backend connection and data availability.
          </Text>
        </div>
      </Container>
    )
  }

  // Loading state
  if (loading || !metrics) {
    return (
      <Container className="divide-y p-0">
        <div className="flex items-center justify-between px-6 py-4">
          <Heading level="h1">Loading Business Intelligence...</Heading>
        </div>
        <div className="px-6 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          </div>
        </div>
      </Container>
    )
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <Heading level="h1">Multi-Store Business Intelligence</Heading>
          <Badge color="green">Live Data</Badge>
        </div>

        <div className="flex items-center gap-4">
          {/* Terminal-Style Clock */}
          <div className="bg-black rounded-md px-3 py-2 font-mono text-sm">
            <span className="text-green-400">
              {currentTime ? currentTime.split(' at ')[1] : 'Loading...'} CT
            </span>
          </div>

          {/* Visible Time Period Selector */}
          <div className="flex items-center gap-2">
            <Text size="small" className="text-gray-700 font-medium">Period:</Text>
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="bg-white border-2 border-gray-300 rounded-md px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:border-blue-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
            >
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="7d">Last 7 Days</option>
              <option value="14d">Last 14 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
              <option value="1y">Last Year</option>
            </select>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-8">
        {/* Unified Business KPIs */}
        <div>
          <Heading level="h2">Business Overview (All Stores)</Heading>
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 border rounded-lg text-center">
              <Text size="small" weight="plus">Total Revenue</Text>
              <div className="text-2xl font-bold text-green-600">
                ${metrics.totalRevenue.toLocaleString()}
              </div>
              <Text size="small" className="text-gray-600">
                Across all stores
              </Text>
            </div>
            <div className="p-4 border rounded-lg text-center">
              <Text size="small" weight="plus">Total Orders</Text>
              <div className="text-2xl font-bold text-blue-600">
                {metrics.totalOrders.toLocaleString()}
              </div>
              <Text size="small" className="text-gray-600">
                Combined orders
              </Text>
            </div>
            <div className="p-4 border rounded-lg text-center">
              <Text size="small" weight="plus">Average Order Value</Text>
              <div className="text-2xl font-bold text-purple-600">
                ${metrics.averageOrderValue.toFixed(2)}
              </div>
              <Text size="small" className="text-gray-600">
                Weighted average
              </Text>
            </div>
            <div className="p-4 border rounded-lg text-center">
              <Text size="small" weight="plus">Growth Rate</Text>
              <div className={`text-2xl font-bold ${metrics.growthRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {metrics.growthRate >= 0 ? '+' : ''}{metrics.growthRate.toFixed(1)}%
              </div>
              <Text size="small" className="text-gray-600">
                vs previous period
              </Text>
            </div>
          </div>
        </div>

        {/* Store Performance Comparison */}
        <div>
          <Heading level="h2">Store Performance Comparison</Heading>
          <div className="mt-4 space-y-4">
            {getStoreRanking(metrics.storeComparison).map((store, index) => (
              <div key={store.storeId} className="border rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Heading level="h3">{store.storeName}</Heading>
                    <Badge color={
                      store.storeType === 'retail' ? 'green' :
                      store.storeType === 'luxury' ? 'purple' : 'blue'
                    }>
                      {store.storeType.charAt(0).toUpperCase() + store.storeType.slice(1)}
                    </Badge>
                    {getPerformanceBadge(store, metrics.storeComparison)}
                  </div>
                  <Text size="small" className="text-gray-600">{store.domain}</Text>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="text-center">
                    <Text size="small" weight="plus">Revenue</Text>
                    <div className="text-lg font-semibold">${store.totalRevenue.toLocaleString()}</div>
                    <Text size="small" className="text-gray-600">
                      {((store.totalRevenue / metrics.totalRevenue) * 100).toFixed(1)}% of total
                    </Text>
                  </div>
                  <div className="text-center">
                    <Text size="small" weight="plus">Orders</Text>
                    <div className="text-lg font-semibold">{store.totalOrders}</div>
                    <Text size="small" className="text-gray-600">
                      {((store.totalOrders / metrics.totalOrders) * 100).toFixed(1)}% of total
                    </Text>
                  </div>
                  <div className="text-center">
                    <Text size="small" weight="plus">AOV</Text>
                    <div className="text-lg font-semibold">${store.averageOrderValue.toFixed(2)}</div>
                    <Text size="small" className="text-gray-600">
                      {store.averageOrderValue > metrics.averageOrderValue ? '↗️ Above avg' : '↙️ Below avg'}
                    </Text>
                  </div>
                  <div className="text-center">
                    <Text size="small" weight="plus">Customers</Text>
                    <div className="text-lg font-semibold">{store.totalCustomers}</div>
                    <Text size="small" className="text-gray-600">
                      {((store.totalCustomers / metrics.totalCustomers) * 100).toFixed(1)}% of total
                    </Text>
                  </div>
                  <div className="text-center">
                    <Text size="small" weight="plus">Conversion</Text>
                    <div className="text-lg font-semibold">{store.conversionRate.toFixed(1)}%</div>
                    <Text size="small" className="text-gray-600">
                      {store.conversionRate > metrics.conversionRate ? '↗️ Strong' : '↙️ Optimize'}
                    </Text>
                  </div>
                </div>

                {/* Top Products for this store */}
                {store.topProducts.length > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <Text size="small" weight="plus">Top Products ({timeframe})</Text>
                    <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-2">
                      {store.topProducts.slice(0, 3).map((product) => (
                        <div key={product.id} className="flex justify-between p-2 bg-gray-50 rounded">
                          <Text size="small">{product.title}</Text>
                          <Text size="small" weight="plus">${product.revenue.toLocaleString()}</Text>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Business Insights */}
        <div>
          <Heading level="h2">Business Insights & Recommendations</Heading>
          <div className="mt-4 space-y-3">
            {/* Revenue Leader Insight */}
            {metrics.storeComparison.length > 0 && (
              <div className="p-4 bg-green-50 border border-green-200 rounded">
                <Text weight="plus" className="text-green-800">
                  💰 Revenue Leader: {getStoreRanking(metrics.storeComparison)[0].storeName}
                </Text>
                <Text size="small" className="text-green-700">
                  Generating ${getStoreRanking(metrics.storeComparison)[0].totalRevenue.toLocaleString()}
                  ({((getStoreRanking(metrics.storeComparison)[0].totalRevenue / metrics.totalRevenue) * 100).toFixed(1)}% of total revenue)
                </Text>
              </div>
            )}

            {/* Growth Opportunity */}
            {metrics.growthRate < 10 && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
                <Text weight="plus" className="text-yellow-800">
                  📈 Growth Opportunity: {metrics.growthRate.toFixed(1)}% growth rate
                </Text>
                <Text size="small" className="text-yellow-700">
                  Consider marketing campaigns or product optimization to accelerate growth
                </Text>
              </div>
            )}

            {/* Conversion Optimization */}
            {metrics.conversionRate < 3 && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded">
                <Text weight="plus" className="text-blue-800">
                  🎯 Conversion Optimization: {metrics.conversionRate.toFixed(1)}% overall conversion
                </Text>
                <Text size="small" className="text-blue-700">
                  Focus on improving checkout experience and product discovery
                </Text>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="pt-4 border-t">
          <div className="flex gap-3">
            <Button variant="primary" size="small">
              📊 View Detailed Reports
            </Button>
            <Button variant="secondary" size="small">
              📈 Export Business Data
            </Button>
            <Button variant="secondary" size="small">
              ⚙️ Manage Stores in Medusa
            </Button>
          </div>
          <Text size="small" className="text-gray-600 mt-2">
            💡 For detailed product, order, and customer management, use the native Medusa admin pages.
            This dashboard focuses on high-level business intelligence across all stores.
          </Text>
        </div>
      </div>
    </Container>
  )
}

// ✅ Official Medusa v2 Route Configuration
export const config = defineRouteConfig({
  label: "📊 Business Intelligence",
})

export default BusinessIntelligencePage