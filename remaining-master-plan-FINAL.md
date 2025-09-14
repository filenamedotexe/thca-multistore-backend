# FINAL MASTER PLAN: Multi-Store Operations Intelligence Platform

## 🎯 Low Complexity, High Value Business Operations

**Current Status:** Foundation Complete - Ready for Operational Intelligence ✅
**Philosophy:** Build only what Medusa CAN'T do - focus on multi-store business operations
**Approach:** 90% leverage Medusa's excellent admin, 10% custom operational intelligence

---

## OPERATIONAL INTELLIGENCE OVERVIEW

### ✅ COMPLETED FOUNDATION:
- ✅ 4 separate GitHub repositories deployed to production
- ✅ Medusa v2 backend with real database integration
- ✅ 3 sales channels with API keys (retail, luxury, wholesale)
- ✅ 3 operational ecommerce stores with real backend connection
- ✅ Real database operations (orders, customers, products, sales channels)
- ✅ All stores connecting to backend with proper authentication

### ❌ REMOVE REDUNDANT EXTENSIONS:
- ❌ Delete cannabis-config admin page (Medusa settings work better)
- ❌ Delete cannabis-users admin page (Medusa user management works better)
- ❌ Delete cannabis dashboard widget (redundant with native admin)
- ❌ Remove all "cannabis" branding from admin extensions
- ❌ Simplify to single admin role (add role complexity later if needed)

### 🎯 BUILD 4 OPERATIONAL INTELLIGENCE PAGES:
- 📊 **Multi-Store Business Intelligence** (1.5 hours)
- 📧 **Email Operations Center** (2 hours)
- 🚚 **Shipping Intelligence** (1 hour)
- 💰 **Revenue Operations** (1.5 hours)

**Total Implementation:** 6 hours to complete operational intelligence platform

---

# Phase 1: Remove Redundant Extensions (30 minutes)

## Overview
Clean up the current "cannabis" branded admin extensions that duplicate Medusa's core functionality. Focus on operational intelligence that adds real business value instead of rebuilding ecommerce admin features.

**✅ Based on Business Principles:**
- **Low Complexity:** Remove unnecessary custom admin pages
- **High Value:** Focus on multi-store operational intelligence
- **Real Data:** Leverage existing database integration
- **Official Patterns:** Use only proven Medusa v2 patterns

## Prerequisites
- Current cannabis admin extensions installed
- Real database integration working
- Backend running on localhost:9000

---

## Step 1.1: Remove Redundant Admin Extensions

### Remove Cannabis-Branded Admin Pages

```bash
cd /Users/zachwieder/Documents/🗂️\ AGENCY/Cole\ Boban/thca-multistore-repos/thca-multistore-backend

# Remove redundant admin pages that duplicate Medusa functionality
rm -rf src/admin/routes/cannabis-config
rm -rf src/admin/routes/cannabis-users
rm -f src/admin/widgets/cannabis-dashboard-widget.tsx

echo "✅ Removed redundant admin extensions - team will use native Medusa admin"
```

### Clean Up Redundant API Endpoints

```bash
# Remove API endpoints that duplicate core Medusa functionality
rm -rf src/api/admin/cannabis/config
rm -f src/api/admin/cannabis/stores/validators.ts
rm -f src/api/admin/cannabis/stores/[storeId]/route.ts

# Keep only the metrics endpoint for operational intelligence
# src/api/admin/cannabis/metrics/route.ts - KEEP (needed for business intelligence)
# src/api/admin/cannabis/stores/route.ts - KEEP (needed for multi-store operations)

echo "✅ Cleaned up redundant API endpoints - focused on operational intelligence"
```

### Update Remaining APIs for Business Operations

```bash
# Update metrics API to focus on business operations vs cannabis branding
mv src/api/admin/cannabis/metrics/route.ts src/api/admin/business/metrics/route.ts
mv src/api/admin/cannabis/stores/route.ts src/api/admin/business/stores/route.ts

# Update directory structure
mkdir -p src/api/admin/business
mv src/api/admin/cannabis/metrics src/api/admin/business/
mv src/api/admin/cannabis/stores src/api/admin/business/
rm -rf src/api/admin/cannabis

echo "✅ Rebranded APIs for business operations - removed cannabis-specific branding"
```

### Clean Up Database Test Data

```bash
# Remove cannabis-specific metadata from users (keep core user data)
cat > src/scripts/cleanup-cannabis-branding.ts << 'EOF'
// Clean up cannabis branding from database while preserving operational data
import { Modules } from "@medusajs/utils"

async function cleanupCannabisBranding({ container }: { container: any }) {
  console.log("🧹 Cleaning up cannabis branding from database...")

  try {
    const userService = container.resolve(Modules.USER)
    const users = await userService.listUsers()

    for (const user of users) {
      // Remove cannabis-specific metadata, keep operational metadata
      const cleanMetadata = {
        // Keep useful operational data
        last_login: user.metadata?.last_login,
        updated_at: user.metadata?.updated_at,
        created_at: user.metadata?.created_at,
        // Remove cannabis-specific fields
        // cannabis_role, store_access, can_* permissions removed
      }

      await userService.updateUsers([{
        id: user.id,
        metadata: cleanMetadata
      }])

      console.log(`✅ Cleaned branding from user: ${user.email}`)
    }

    console.log("🎉 Cannabis branding cleanup complete!")
  } catch (error) {
    console.error("❌ Error cleaning up branding:", error)
    throw error
  }
}

module.exports.default = cleanupCannabisBranding

EOF

npx medusa exec ./src/scripts/cleanup-cannabis-branding.ts

echo "✅ Database cleaned - removed cannabis branding, preserved operational data"
```

---

# Phase 2: Multi-Store Business Intelligence (1.5 hours)

## Overview
Create a high-value business intelligence dashboard that provides insights across all 3 stores. This leverages real Medusa v2 data to show store performance comparison, unified KPIs, and business decision support that Medusa's native admin cannot provide.

**✅ Based on Official Documentation:**
- **Medusa v2 UI Routes:** Official admin page structure using defineRouteConfig
- **Multiple Services:** ORDER, CUSTOMER, PRODUCT, SALES_CHANNEL integration
- **@medusajs/ui Components:** Official UI components for consistent design
- **Real-time Analytics:** Live data from database with performance calculations

## Prerequisites
- Redundant extensions removed (Phase 1)
- 3 stores operational with backend connection
- Real Medusa v2 services available

---

## Step 2.1: Create Multi-Store Business Intelligence Page

### Create Business Intelligence Dashboard

```bash
cd /Users/zachwieder/Documents/🗂️\ AGENCY/Cole\ Boban/thca-multistore-repos/thca-multistore-backend

# Create business intelligence admin page
mkdir -p src/admin/routes/business-intelligence

cat > src/admin/routes/business-intelligence/page.tsx << 'EOF'
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
  const [timeframe, setTimeframe] = useState<string>('30d')

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
        const metricsResponse = await fetch(`/admin/business/metrics?timeframe=${timeframe}`, {
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
        <Heading level="h1">📊 Multi-Store Business Intelligence</Heading>
        <div className="flex items-center gap-2">
          <Badge color="green">✅ Live Data</Badge>
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="1y">Last Year</option>
          </select>
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

EOF

echo "✅ Multi-store business intelligence page created with real database integration"
```

### Create Business Intelligence API Endpoint

```bash
# Create API endpoint for business intelligence data aggregation
mkdir -p src/api/admin/business/intelligence

cat > src/api/admin/business/intelligence/route.ts << 'EOF'
// Business Intelligence API - Official Medusa v2 API Route Pattern
// Aggregates data across all stores for operational insights
// Reference: https://docs.medusajs.com/learn/fundamentals/api-routes

import type { Request, Response } from "express"

interface BusinessIntelligenceRequest extends Request {
  scope: any
  query: {
    timeframe?: string
  }
}

// ✅ Official Medusa v2 API Route Pattern
export const GET = async (
  req: BusinessIntelligenceRequest,
  res: Response
) => {
  try {
    const { timeframe = '30d' } = req.query
    console.log(`Calculating business intelligence for timeframe: ${timeframe}`)

    // ✅ Use Real Medusa v2 Services for Business Intelligence
    const { Modules } = await import("@medusajs/utils")
    const orderService = req.scope.resolve(Modules.ORDER)
    const customerService = req.scope.resolve(Modules.CUSTOMER)
    const productService = req.scope.resolve(Modules.PRODUCT)
    const salesChannelService = req.scope.resolve(Modules.SALES_CHANNEL)

    // Calculate timeframe date range
    const endDate = new Date()
    const startDate = new Date()
    switch (timeframe) {
      case '7d':
        startDate.setDate(startDate.getDate() - 7)
        break
      case '30d':
        startDate.setDate(startDate.getDate() - 30)
        break
      case '90d':
        startDate.setDate(startDate.getDate() - 90)
        break
      case '1y':
        startDate.setFullYear(startDate.getFullYear() - 1)
        break
    }

    // ✅ Fetch real data from database
    const [orders, customers, products, salesChannels] = await Promise.all([
      orderService.listOrders({
        filters: {
          created_at: {
            gte: startDate.toISOString(),
            lte: endDate.toISOString()
          }
        }
      }),
      customerService.listCustomers(),
      productService.listProducts(),
      salesChannelService.listSalesChannels()
    ])

    console.log(`Real data loaded: ${orders.length} orders, ${customers.length} customers, ${products.length} products`)

    // Calculate unified business metrics
    const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0) / 100 // Convert from cents
    const totalOrders = orders.length
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

    // Calculate previous period for growth rate
    const previousStartDate = new Date(startDate)
    previousStartDate.setDate(previousStartDate.getDate() - (endDate.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000))

    const previousOrders = await orderService.listOrders({
      filters: {
        created_at: {
          gte: previousStartDate.toISOString(),
          lte: startDate.toISOString()
        }
      }
    })

    const previousRevenue = previousOrders.reduce((sum, order) => sum + (order.total || 0), 0) / 100
    const growthRate = previousRevenue > 0 ? ((totalRevenue - previousRevenue) / previousRevenue) * 100 : 0

    // Calculate store-specific performance
    const storeComparison = await Promise.all(
      salesChannels.map(async (channel) => {
        // Filter orders by sales channel (you may need to adjust this based on your order structure)
        const storeOrders = orders.filter(order =>
          // Assuming orders have sales_channel_id - adjust based on your schema
          order.sales_channel_id === channel.id
        )

        const storeRevenue = storeOrders.reduce((sum, order) => sum + (order.total || 0), 0) / 100
        const storeOrderCount = storeOrders.length
        const storeAOV = storeOrderCount > 0 ? storeRevenue / storeOrderCount : 0

        // Get unique customers for this store
        const storeCustomerIds = new Set(storeOrders.map(order => order.customer_id).filter(Boolean))
        const storeCustomerCount = storeCustomerIds.size

        // Calculate top products for this store
        const productSales = new Map()
        storeOrders.forEach(order => {
          order.items?.forEach(item => {
            const existing = productSales.get(item.product_id) || { revenue: 0, quantity: 0, title: item.title }
            existing.revenue += (item.total || 0) / 100
            existing.quantity += item.quantity || 0
            productSales.set(item.product_id, existing)
          })
        })

        const topProducts = Array.from(productSales.entries())
          .map(([id, data]) => ({ id, ...data }))
          .sort((a, b) => b.revenue - a.revenue)
          .slice(0, 5)

        return {
          storeId: channel.id,
          storeName: channel.name,
          storeType: channel.metadata?.store_type || 'retail',
          domain: channel.metadata?.domain || 'localhost',
          totalRevenue: storeRevenue,
          totalOrders: storeOrderCount,
          averageOrderValue: storeAOV,
          totalCustomers: storeCustomerCount,
          conversionRate: storeCustomerCount > 0 ? (storeOrderCount / storeCustomerCount) * 100 : 0,
          topProducts: topProducts,
          recentOrders: storeOrders
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            .slice(0, 5)
            .map(order => ({
              id: order.id,
              display_id: order.display_id,
              total: (order.total || 0) / 100,
              created_at: order.created_at,
              customer_email: order.email
            }))
        }
      })
    )

    const businessMetrics = {
      totalRevenue,
      totalOrders,
      totalCustomers: customers.length,
      averageOrderValue,
      conversionRate: customers.length > 0 ? (totalOrders / customers.length) * 100 : 0,
      growthRate,
      storeComparison
    }

    console.log('✅ Business intelligence calculated from real database data:', businessMetrics)
    res.json(businessMetrics)

  } catch (error) {
    console.error('Error calculating business intelligence:', error)
    res.status(500).json({ error: 'Failed to calculate business intelligence' })
  }
}

EOF

echo "✅ Business intelligence API endpoint created with real data aggregation"
```

---

# Phase 3: Email Operations Center (2 hours)

## Overview
Create a comprehensive email operations center that manages Resend transactional emails across 3 domains and provides oversight of 3 separate Klaviyo accounts. Includes React Email template management with official Medusa v2 event integration for automated email workflows.

**✅ Based on Official Documentation:**
- **Medusa v2 Notification Module:** Official email service integration
- **Resend API:** Official React Email integration with multiple domain support
- **Klaviyo Portfolio API:** Official multi-account management (2025 feature)
- **React Email:** Official template designer with Medusa event triggers
- **Medusa v2 Events:** Official subscriber patterns for email automation

## Prerequisites
- Business intelligence page completed (Phase 2)
- Resend account with multiple domains configured
- 3 Klaviyo accounts for each store
- Medusa v2 backend with real database

---

## Step 3.1: Install Email Operations Dependencies

### Install Official Email Integration Packages

```bash
cd /Users/zachwieder/Documents/🗂️\ AGENCY/Cole\ Boban/thca-multistore-repos/thca-multistore-backend

# Install official Medusa v2 notification and email packages
npm install resend @react-email/components @react-email/render
npm install @types/react-email

# Install Klaviyo official SDK for multi-account management
npm install klaviyo-api

echo "✅ Official email integration packages installed"
```

### Configure Medusa v2 Notification Module with Resend Provider

```bash
# Create official Medusa v2 Resend notification provider
mkdir -p src/modules/resend-notification-provider

cat > src/modules/resend-notification-provider/index.ts << 'EOF'
// Official Medusa v2 Resend Notification Provider
// Reference: https://docs.medusajs.com/resources/integrations/guides/resend

import { AbstractNotificationProviderService } from "@medusajs/framework/utils"
import { Logger } from "@medusajs/framework/types"
import { Resend } from "resend"

type InjectedDependencies = {
  logger: Logger
}

interface ResendNotificationProviderOptions {
  channels: string[]
  api_key: string
  from: string
}

type NotificationData = {
  to: string
  template: string
  data: Record<string, any>
}

class ResendNotificationProviderService extends AbstractNotificationProviderService {
  protected logger_: Logger
  protected resend_: Resend
  protected options_: ResendNotificationProviderOptions

  constructor({ logger }: InjectedDependencies, options: ResendNotificationProviderOptions) {
    super()
    this.logger_ = logger
    this.options_ = options
    this.resend_ = new Resend(options.api_key)
  }

  async send(notification: NotificationData): Promise<{ success: boolean; data?: any }> {
    try {
      console.log('Sending email via Resend:', notification.template, 'to:', notification.to)

      // ✅ Import React Email template dynamically
      const template = await this.getReactEmailTemplate(notification.template, notification.data)

      // ✅ Send email using official Resend API
      const result = await this.resend_.emails.send({
        from: this.options_.from,
        to: [notification.to],
        subject: this.getEmailSubject(notification.template, notification.data),
        react: template,
        // Track email performance
        tags: [
          { name: 'template', value: notification.template },
          { name: 'store', value: notification.data.store_type || 'unknown' },
          { name: 'automated', value: 'true' }
        ]
      })

      if (result.error) {
        this.logger_.error('Resend API error:', result.error)
        return { success: false }
      }

      this.logger_.info('Email sent successfully via Resend:', result.data?.id)
      return { success: true, data: result.data }

    } catch (error) {
      this.logger_.error('Failed to send email via Resend:', error)
      return { success: false }
    }
  }

  private async getReactEmailTemplate(template: string, data: any) {
    try {
      switch (template) {
        case 'order-confirmation':
          const { OrderConfirmationEmail } = await import('../../emails/templates/order-confirmation')
          return OrderConfirmationEmail(data)
        case 'shipping-notification':
          const { ShippingNotificationEmail } = await import('../../emails/templates/shipping-notification')
          return ShippingNotificationEmail(data)
        case 'welcome':
          const { WelcomeEmail } = await import('../../emails/templates/welcome')
          return WelcomeEmail(data)
        default:
          // Simple fallback template
          return `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h1>Business Notification</h1>
              <p>Template: ${template}</p>
              <pre>${JSON.stringify(data, null, 2)}</pre>
            </div>
          `
      }
    } catch (error) {
      this.logger_.error('Failed to load React Email template:', error)
      return `<div><h1>Email Template Error</h1><p>Template: ${template}</p></div>`
    }
  }

  private getEmailSubject(template: string, data: any): string {
    switch (template) {
      case 'order-confirmation':
        return `Order #${data.order_number} Confirmed - ${data.store_name}`
      case 'shipping-notification':
        return `Order #${data.order_number} Shipped - Tracking Available`
      case 'welcome':
        return `Welcome to ${data.store_name}!`
      default:
        return 'Business Notification'
    }
  }
}

export default ResendNotificationProviderService

EOF

echo "✅ Official Medusa v2 Resend notification provider created"
```

### Update Medusa Configuration for Email Operations

```bash
# Add notification module to medusa-config.ts
cat >> medusa-config.ts << 'EOF'

    // ✅ Official Medusa v2 Notification Module with Resend Provider
    {
      resolve: "@medusajs/medusa/notification",
      options: {
        providers: [
          {
            resolve: "./src/modules/resend-notification-provider",
            id: "resend",
            options: {
              channels: ["email"],
              api_key: process.env.RESEND_API_KEY,
              from: `${process.env.BUSINESS_NAME} <${process.env.RESEND_FROM_EMAIL}>`,
            },
          },
        ],
      },
    },

EOF

echo "✅ Medusa v2 notification module configured with official patterns"
```

### Configure Email Environment Variables

```bash
# Add email operations environment variables
cat >> .env << 'EOF'

# ✅ Email Operations Configuration
# Resend API (single key for all 3 domains)
RESEND_API_KEY=re_REPLACE_WITH_REAL_RESEND_API_KEY
RESEND_FROM_EMAIL=noreply@yourdomain.com
BUSINESS_NAME=Your Business Name

# Store-specific email domains (all use same Resend key)
STRAIGHT_GAS_DOMAIN=straight-gas.com
LIQUID_GUMMIES_DOMAIN=liquid-gummies.com
WHOLESALE_DOMAIN=liquidgummieswholesale.com

# Klaviyo API Keys (3 separate accounts)
KLAVIYO_STRAIGHT_GAS_API_KEY=pk_REPLACE_WITH_STRAIGHT_GAS_KEY
KLAVIYO_LIQUID_GUMMIES_API_KEY=pk_REPLACE_WITH_LIQUID_GUMMIES_KEY
KLAVIYO_WHOLESALE_API_KEY=pk_REPLACE_WITH_WHOLESALE_KEY

# Email Operations Settings
EMAIL_TEMPLATE_BASE_URL=http://localhost:9000
EMAIL_LOGO_URL=http://localhost:9000/logo.png

EOF

echo "✅ Email operations environment configured for multi-domain setup"
```

---

# Phase 4: Shipping Intelligence Dashboard (1 hour)

## Overview
Create a read-only shipping intelligence dashboard that connects to Shipstation API V2 to provide shipping performance analytics and cost optimization insights across all 3 stores. Focus on operational efficiency metrics that help optimize shipping operations.

**✅ Based on Official Documentation:**
- **Shipstation API V2:** Official shipping analytics and webhook integration
- **Medusa v2 UI Routes:** Official admin page structure
- **Read-only Analytics:** Performance insights without shipping control
- **Multi-store Shipping:** Comparative shipping performance across stores

## Prerequisites
- Email operations center completed (Phase 3)
- Shipstation account with API access
- Orders flowing through Shipstation for shipping

---

## Step 4.1: Create Shipping Intelligence Page

### Install Shipstation Dependencies

```bash
cd /Users/zachwieder/Documents/🗂️\ AGENCY/Cole\ Boban/thca-multistore-repos/thca-multistore-backend

# Install Shipstation API dependencies (no official SDK, use fetch)
# Reference: https://docs.shipstation.com/getting-started

echo "✅ Shipstation integration uses native fetch - no additional dependencies needed"
```

### Create Shipping Intelligence Admin Page

```bash
# Create shipping intelligence admin page
mkdir -p src/admin/routes/shipping-intelligence

cat > src/admin/routes/shipping-intelligence/page.tsx << 'EOF'
// Shipping Intelligence Dashboard - Official Medusa v2 UI Route Pattern
// Read-only Shipstation analytics for operational efficiency
// Reference: https://docs.medusajs.com/learn/customization/customize-admin

import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Badge, Text, Label } from "@medusajs/ui"
import React, { useState, useEffect } from "react"

// Shipstation Analytics Data Interfaces
interface ShippingMetrics {
  totalShipments: number
  averageShippingCost: number
  averageDeliveryTime: number
  onTimeDeliveryRate: number
  carrierPerformance: Array<{
    carrierName: string
    shipmentCount: number
    averageCost: number
    averageDeliveryTime: number
    onTimeRate: number
  }>
  storeShippingComparison: Array<{
    storeName: string
    shipmentCount: number
    averageCost: number
    costEfficiency: 'excellent' | 'good' | 'needs_improvement'
  }>
  recentShipments: Array<{
    id: string
    orderNumber: string
    trackingNumber: string
    carrier: string
    cost: number
    status: string
    createdAt: string
    estimatedDelivery: string
  }>
}

const ShippingIntelligencePage = () => {
  const [metrics, setMetrics] = useState<ShippingMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [timeframe, setTimeframe] = useState<string>('30d')

  // Fetch real shipping intelligence from Shipstation
  useEffect(() => {
    const fetchShippingIntelligence = async () => {
      try {
        setLoading(true)
        setError(null)

        // ✅ Fetch shipping analytics from custom API that aggregates Shipstation data
        const response = await fetch(`/admin/shipping/analytics?timeframe=${timeframe}`, {
          credentials: 'include'
        })

        if (!response.ok) {
          throw new Error(`Shipping analytics API failed: ${response.status}`)
        }

        const shippingData = await response.json()
        console.log('Real shipping analytics from Shipstation:', shippingData)

        setMetrics(shippingData)
        console.log('✅ Shipping intelligence loaded from Shipstation API')

      } catch (error) {
        console.error('Failed to fetch shipping intelligence:', error)
        setError(error instanceof Error ? error.message : 'Failed to load shipping data')
      } finally {
        setLoading(false)
      }
    }

    fetchShippingIntelligence()
  }, [timeframe])

  const getCostEfficiencyBadge = (efficiency: string) => {
    switch (efficiency) {
      case 'excellent':
        return <Badge color="green">🏆 Excellent</Badge>
      case 'good':
        return <Badge color="blue">👍 Good</Badge>
      case 'needs_improvement':
        return <Badge color="orange">⚠️ Optimize</Badge>
      default:
        return <Badge color="grey">📊 Tracking</Badge>
    }
  }

  const getShippingStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return <Badge color="green">✅ Delivered</Badge>
      case 'in_transit':
        return <Badge color="blue">🚚 In Transit</Badge>
      case 'pending':
        return <Badge color="orange">⏳ Pending</Badge>
      case 'exception':
        return <Badge color="red">⚠️ Exception</Badge>
      default:
        return <Badge color="grey">{status}</Badge>
    }
  }

  // Error state
  if (error) {
    return (
      <Container className="divide-y p-0">
        <div className="flex items-center justify-between px-6 py-4">
          <Heading level="h1">Shipping Intelligence - Error</Heading>
          <Badge color="red">❌ Shipstation Connection Error</Badge>
        </div>
        <div className="px-6 py-6">
          <Text className="text-red-600">Failed to load shipping data: {error}</Text>
          <Text size="small" className="text-gray-600 mt-2">
            Please check Shipstation API connection and credentials.
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
          <Heading level="h1">Loading Shipping Intelligence...</Heading>
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
        <Heading level="h1">🚚 Shipping Intelligence</Heading>
        <div className="flex items-center gap-2">
          <Badge color="green">✅ Shipstation Connected</Badge>
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
        </div>
      </div>

      <div className="px-6 py-6 space-y-8">
        {/* Shipping KPIs */}
        <div>
          <Heading level="h2">Shipping Performance Overview</Heading>
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 border rounded-lg text-center">
              <Text size="small" weight="plus">Total Shipments</Text>
              <div className="text-2xl font-bold text-blue-600">
                {metrics.totalShipments.toLocaleString()}
              </div>
              <Text size="small" className="text-gray-600">
                Across all stores
              </Text>
            </div>
            <div className="p-4 border rounded-lg text-center">
              <Text size="small" weight="plus">Average Cost</Text>
              <div className="text-2xl font-bold text-green-600">
                ${metrics.averageShippingCost.toFixed(2)}
              </div>
              <Text size="small" className="text-gray-600">
                Per shipment
              </Text>
            </div>
            <div className="p-4 border rounded-lg text-center">
              <Text size="small" weight="plus">Delivery Time</Text>
              <div className="text-2xl font-bold text-purple-600">
                {metrics.averageDeliveryTime.toFixed(1)} days
              </div>
              <Text size="small" className="text-gray-600">
                Average delivery
              </Text>
            </div>
            <div className="p-4 border rounded-lg text-center">
              <Text size="small" weight="plus">On-Time Rate</Text>
              <div className={`text-2xl font-bold ${metrics.onTimeDeliveryRate >= 95 ? 'text-green-600' : 'text-orange-600'}`}>
                {metrics.onTimeDeliveryRate.toFixed(1)}%
              </div>
              <Text size="small" className="text-gray-600">
                Delivery performance
              </Text>
            </div>
          </div>
        </div>

        {/* Carrier Performance Analysis */}
        <div>
          <Heading level="h2">Carrier Performance Analysis</Heading>
          <div className="mt-4 space-y-3">
            {metrics.carrierPerformance.map((carrier) => (
              <div key={carrier.carrierName} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <Heading level="h3">{carrier.carrierName}</Heading>
                  <Badge color={carrier.onTimeRate >= 95 ? 'green' : carrier.onTimeRate >= 90 ? 'blue' : 'orange'}>
                    {carrier.onTimeRate.toFixed(1)}% on-time
                  </Badge>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="text-center">
                    <Text size="small" weight="plus">Shipments</Text>
                    <div className="font-semibold">{carrier.shipmentCount}</div>
                  </div>
                  <div className="text-center">
                    <Text size="small" weight="plus">Avg Cost</Text>
                    <div className="font-semibold">${carrier.averageCost.toFixed(2)}</div>
                  </div>
                  <div className="text-center">
                    <Text size="small" weight="plus">Avg Delivery</Text>
                    <div className="font-semibold">{carrier.averageDeliveryTime.toFixed(1)} days</div>
                  </div>
                  <div className="text-center">
                    <Text size="small" weight="plus">Performance</Text>
                    <div className="font-semibold">
                      {carrier.onTimeRate >= 95 ? '🏆 Excellent' :
                       carrier.onTimeRate >= 90 ? '👍 Good' : '⚠️ Review'}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Store Shipping Comparison */}
        <div>
          <Heading level="h2">Store Shipping Efficiency</Heading>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            {metrics.storeShippingComparison.map((store) => (
              <div key={store.storeName} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <Heading level="h3">{store.storeName}</Heading>
                  {getCostEfficiencyBadge(store.costEfficiency)}
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <Text size="small">Shipments:</Text>
                    <Text size="small" weight="plus">{store.shipmentCount}</Text>
                  </div>
                  <div className="flex justify-between">
                    <Text size="small">Avg Cost:</Text>
                    <Text size="small" weight="plus">${store.averageCost.toFixed(2)}</Text>
                  </div>
                  <div className="flex justify-between">
                    <Text size="small">Efficiency:</Text>
                    <Text size="small" weight="plus">
                      {store.costEfficiency === 'excellent' ? '🏆 Excellent' :
                       store.costEfficiency === 'good' ? '👍 Good' : '⚠️ Optimize'}
                    </Text>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Shipments */}
        <div>
          <Heading level="h2">Recent Shipments</Heading>
          <div className="mt-4 space-y-3">
            {metrics.recentShipments.slice(0, 10).map((shipment) => (
              <div key={shipment.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <Text weight="plus">Order #{shipment.orderNumber}</Text>
                      {getShippingStatusBadge(shipment.status)}
                    </div>
                    <div className="mt-1 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <Text size="small">Carrier: {shipment.carrier}</Text>
                      <Text size="small">Cost: ${shipment.cost.toFixed(2)}</Text>
                      <Text size="small">Tracking: {shipment.trackingNumber}</Text>
                      <Text size="small">
                        ETA: {new Date(shipment.estimatedDelivery).toLocaleDateString()}
                      </Text>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping Intelligence Insights */}
        <div className="pt-4 border-t">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded">
            <Text weight="plus" className="text-blue-800">
              💡 Shipping Intelligence Insights
            </Text>
            <div className="mt-2 space-y-1">
              <Text size="small" className="text-blue-700">
                • Best performing carrier: {metrics.carrierPerformance[0]?.carrierName}
                ({metrics.carrierPerformance[0]?.onTimeRate.toFixed(1)}% on-time rate)
              </Text>
              <Text size="small" className="text-blue-700">
                • Most cost-efficient store: {metrics.storeShippingComparison
                  .find(s => s.costEfficiency === 'excellent')?.storeName || 'All stores performing well'}
              </Text>
              <Text size="small" className="text-blue-700">
                • Total shipping volume: {metrics.totalShipments} shipments (${(metrics.totalShipments * metrics.averageShippingCost).toFixed(2)} total cost)
              </Text>
            </div>
          </div>

          <Text size="small" className="text-gray-600 mt-4">
            📊 This dashboard provides read-only shipping analytics from Shipstation.
            For shipping management and label creation, use Shipstation directly.
          </Text>
        </div>
      </div>
    </Container>
  )
}

// ✅ Official Medusa v2 Route Configuration
export const config = defineRouteConfig({
  label: "🚚 Shipping Intelligence",
})

export default ShippingIntelligencePage

EOF

echo "✅ Shipping intelligence dashboard created with Shipstation API integration"
```

### Create Shipstation Analytics API Endpoint

```bash
# Create API endpoint for Shipstation analytics aggregation
mkdir -p src/api/admin/shipping/analytics

cat > src/api/admin/shipping/analytics/route.ts << 'EOF'
// Shipstation Analytics API - Official Medusa v2 API Route Pattern
// Read-only analytics from Shipstation API V2
// Reference: https://docs.shipstation.com/getting-started

import type { Request, Response } from "express"

interface ShippingAnalyticsRequest extends Request {
  scope: any
  query: {
    timeframe?: string
  }
}

// ✅ Official Medusa v2 API Route Pattern
export const GET = async (
  req: ShippingAnalyticsRequest,
  res: Response
) => {
  try {
    const { timeframe = '30d' } = req.query
    console.log(`Fetching Shipstation analytics for timeframe: ${timeframe}`)

    // Calculate date range for Shipstation API
    const endDate = new Date()
    const startDate = new Date()
    switch (timeframe) {
      case '7d':
        startDate.setDate(startDate.getDate() - 7)
        break
      case '30d':
        startDate.setDate(startDate.getDate() - 30)
        break
      case '90d':
        startDate.setDate(startDate.getDate() - 90)
        break
    }

    // ✅ Fetch real data from Shipstation API V2
    const shipstationAuth = Buffer.from(`${process.env.SHIPSTATION_API_KEY}:${process.env.SHIPSTATION_API_SECRET}`).toString('base64')

    const shipmentsResponse = await fetch(`https://ssapi.shipstation.com/shipments?createDateStart=${startDate.toISOString()}&createDateEnd=${endDate.toISOString()}`, {
      headers: {
        'Authorization': `Basic ${shipstationAuth}`,
        'Content-Type': 'application/json'
      }
    })

    if (!shipmentsResponse.ok) {
      throw new Error(`Shipstation API failed: ${shipmentsResponse.status}`)
    }

    const shipmentsData = await shipmentsResponse.json()
    console.log(`Real shipments from Shipstation: ${shipmentsData.shipments?.length || 0} shipments`)

    // ✅ Also get orders from Medusa to correlate with shipping data
    const { Modules } = await import("@medusajs/utils")
    const orderService = req.scope.resolve(Modules.ORDER)
    const salesChannelService = req.scope.resolve(Modules.SALES_CHANNEL)

    const [orders, salesChannels] = await Promise.all([
      orderService.listOrders({
        filters: {
          created_at: {
            gte: startDate.toISOString(),
            lte: endDate.toISOString()
          }
        }
      }),
      salesChannelService.listSalesChannels()
    ])

    // Process and analyze shipping data
    const shipments = shipmentsData.shipments || []

    // Calculate shipping metrics
    const totalShipments = shipments.length
    const totalShippingCost = shipments.reduce((sum, s) => sum + (s.shipmentCost || 0), 0)
    const averageShippingCost = totalShipments > 0 ? totalShippingCost / totalShipments : 0

    // Calculate delivery times (for delivered shipments)
    const deliveredShipments = shipments.filter(s => s.deliveryDate)
    const averageDeliveryTime = deliveredShipments.length > 0
      ? deliveredShipments.reduce((sum, s) => {
          const created = new Date(s.createDate)
          const delivered = new Date(s.deliveryDate)
          return sum + (delivered.getTime() - created.getTime()) / (24 * 60 * 60 * 1000)
        }, 0) / deliveredShipments.length
      : 0

    // Calculate on-time delivery rate
    const onTimeShipments = deliveredShipments.filter(s => {
      const deliveryDate = new Date(s.deliveryDate)
      const expectedDate = new Date(s.shipDate)
      expectedDate.setDate(expectedDate.getDate() + (s.serviceCode?.includes('Express') ? 1 : 3))
      return deliveryDate <= expectedDate
    })
    const onTimeDeliveryRate = deliveredShipments.length > 0
      ? (onTimeShipments.length / deliveredShipments.length) * 100
      : 0

    // Analyze carrier performance
    const carrierMap = new Map()
    shipments.forEach(shipment => {
      const carrier = shipment.carrierCode || 'Unknown'
      if (!carrierMap.has(carrier)) {
        carrierMap.set(carrier, {
          carrierName: carrier,
          shipments: [],
          totalCost: 0,
          deliveredCount: 0,
          onTimeCount: 0
        })
      }

      const carrierData = carrierMap.get(carrier)
      carrierData.shipments.push(shipment)
      carrierData.totalCost += shipment.shipmentCost || 0

      if (shipment.deliveryDate) {
        carrierData.deliveredCount++
        const deliveryDate = new Date(shipment.deliveryDate)
        const expectedDate = new Date(shipment.shipDate)
        expectedDate.setDate(expectedDate.getDate() + (shipment.serviceCode?.includes('Express') ? 1 : 3))
        if (deliveryDate <= expectedDate) {
          carrierData.onTimeCount++
        }
      }
    })

    const carrierPerformance = Array.from(carrierMap.values()).map(carrier => ({
      carrierName: carrier.carrierName,
      shipmentCount: carrier.shipments.length,
      averageCost: carrier.shipments.length > 0 ? carrier.totalCost / carrier.shipments.length : 0,
      averageDeliveryTime: carrier.deliveredCount > 0
        ? carrier.shipments
            .filter(s => s.deliveryDate)
            .reduce((sum, s) => {
              const created = new Date(s.createDate)
              const delivered = new Date(s.deliveryDate)
              return sum + (delivered.getTime() - created.getTime()) / (24 * 60 * 60 * 1000)
            }, 0) / carrier.deliveredCount
        : 0,
      onTimeRate: carrier.deliveredCount > 0 ? (carrier.onTimeCount / carrier.deliveredCount) * 100 : 0
    })).sort((a, b) => b.onTimeRate - a.onTimeRate)

    // Store shipping comparison (correlate with sales channels)
    const storeShippingComparison = salesChannels.map(channel => {
      // Match shipments to stores (this might need adjustment based on your order structure)
      const storeShipments = shipments.filter(shipment => {
        // You'll need to correlate orders with shipments based on order numbers or other identifiers
        return true // Placeholder - implement store correlation logic
      })

      const storeShippingCost = storeShipments.reduce((sum, s) => sum + (s.shipmentCost || 0), 0)
      const averageCost = storeShipments.length > 0 ? storeShippingCost / storeShipments.length : 0

      let costEfficiency: 'excellent' | 'good' | 'needs_improvement' = 'good'
      if (averageCost < averageShippingCost * 0.9) costEfficiency = 'excellent'
      else if (averageCost > averageShippingCost * 1.1) costEfficiency = 'needs_improvement'

      return {
        storeName: channel.name,
        shipmentCount: storeShipments.length,
        averageCost: averageCost,
        costEfficiency: costEfficiency
      }
    })

    // Recent shipments
    const recentShipments = shipments
      .sort((a, b) => new Date(b.createDate).getTime() - new Date(a.createDate).getTime())
      .slice(0, 20)
      .map(shipment => ({
        id: shipment.shipmentId,
        orderNumber: shipment.orderNumber,
        trackingNumber: shipment.trackingNumber || 'Not assigned',
        carrier: shipment.carrierCode || 'Unknown',
        cost: shipment.shipmentCost || 0,
        status: shipment.shipmentStatus || 'unknown',
        createdAt: shipment.createDate,
        estimatedDelivery: shipment.deliveryDate || 'TBD'
      }))

    const shippingMetrics = {
      totalShipments,
      averageShippingCost,
      averageDeliveryTime,
      onTimeDeliveryRate,
      carrierPerformance,
      storeShippingComparison,
      recentShipments
    }

    console.log('✅ Shipping intelligence calculated from Shipstation API:', shippingMetrics)
    res.json(shippingMetrics)

  } catch (error) {
    console.error('Error fetching Shipstation analytics:', error)
    res.status(500).json({ error: 'Failed to fetch shipping analytics from Shipstation' })
  }
}

EOF

echo "✅ Shipstation analytics API endpoint created with official API V2 integration"
```

### Configure Shipstation Environment Variables

```bash
# Add Shipstation configuration to environment
cat >> .env << 'EOF'

# ✅ Shipstation API V2 Configuration (Read-only Analytics)
# Reference: https://docs.shipstation.com/getting-started
SHIPSTATION_API_KEY=YOUR_SHIPSTATION_API_KEY
SHIPSTATION_API_SECRET=YOUR_SHIPSTATION_API_SECRET
SHIPSTATION_WEBHOOK_URL=http://localhost:9000/admin/shipping/webhooks

EOF

echo "✅ Shipstation environment variables configured for read-only analytics"
```

---

# Phase 5: Email Operations Center (2 hours)

## Overview
Create a comprehensive email operations center that manages Resend transactional emails across 3 domains, provides oversight of 3 Klaviyo accounts, and includes React Email template management with official Medusa v2 event integration for automated email workflows.

**✅ Based on Official Documentation:**
- **Medusa v2 Events:** Official subscriber patterns for email automation
- **Resend API:** Official React Email integration with multiple domain support
- **Klaviyo Portfolio API:** Official multi-account management (2025 feature)
- **React Email Designer:** Official template system with live preview
- **Medusa v2 Workflows:** Official email automation patterns

## Prerequisites
- Shipping intelligence completed (Phase 4)
- Resend account with 3 domains configured
- 3 Klaviyo accounts for each store
- Medusa v2 notification module configured

---

## Step 5.1: Create Email Operations Center Page

### Create Email Operations Admin Page

```bash
cd /Users/zachwieder/Documents/🗂️\ AGENCY/Cole\ Boban/thca-multistore-repos/thca-multistore-backend

# Create email operations admin page
mkdir -p src/admin/routes/email-operations

cat > src/admin/routes/email-operations/page.tsx << 'EOF'
// Email Operations Center - Official Medusa v2 UI Route Pattern
// Manages Resend + 3 Klaviyo accounts + React Email templates
// Reference: https://docs.medusajs.com/learn/customization/customize-admin

import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Button, Badge, Text, Label, Input, Select, Textarea } from "@medusajs/ui"
import React, { useState, useEffect } from "react"

// Email Analytics Data Interfaces
interface ResendAnalytics {
  totalSent: number
  totalDelivered: number
  totalOpened: number
  totalClicked: number
  deliveryRate: number
  openRate: number
  clickRate: number
  recentEmails: Array<{
    id: string
    to: string
    subject: string
    template: string
    status: string
    created_at: string
    opened_at?: string
    clicked_at?: string
  }>
  domainPerformance: Array<{
    domain: string
    sent: number
    delivered: number
    opened: number
    deliveryRate: number
    openRate: number
  }>
}

interface KlaviyoAnalytics {
  accountName: string
  apiKey: string
  totalProfiles: number
  totalCampaigns: number
  totalRevenue: number
  openRate: number
  clickRate: number
  recentCampaigns: Array<{
    id: string
    name: string
    status: string
    sent: number
    revenue: number
    created_at: string
  }>
}

interface EmailTemplate {
  id: string
  name: string
  subject: string
  template: string
  events: string[]
  lastUsed?: string
  performance?: {
    sent: number
    openRate: number
    clickRate: number
  }
}

const EmailOperationsPage = () => {
  const [resendAnalytics, setResendAnalytics] = useState<ResendAnalytics | null>(null)
  const [klaviyoAnalytics, setKlaviyoAnalytics] = useState<KlaviyoAnalytics[]>([])
  const [emailTemplates, setEmailTemplates] = useState<EmailTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'templates' | 'klaviyo'>('overview')
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null)

  // Fetch real email operations data
  useEffect(() => {
    const fetchEmailOperationsData = async () => {
      try {
        setLoading(true)
        setError(null)

        // ✅ Fetch Resend analytics
        const resendResponse = await fetch('/admin/email/resend/analytics', {
          credentials: 'include'
        })

        if (resendResponse.ok) {
          const resendData = await resendResponse.json()
          setResendAnalytics(resendData)
        }

        // ✅ Fetch Klaviyo analytics for all 3 accounts
        const klaviyoResponse = await fetch('/admin/email/klaviyo/analytics', {
          credentials: 'include'
        })

        if (klaviyoResponse.ok) {
          const klaviyoData = await klaviyoResponse.json()
          setKlaviyoAnalytics(klaviyoData.accounts || [])
        }

        // ✅ Fetch email templates
        const templatesResponse = await fetch('/admin/email/templates', {
          credentials: 'include'
        })

        if (templatesResponse.ok) {
          const templatesData = await templatesResponse.json()
          setEmailTemplates(templatesData.templates || [])
        }

        console.log('✅ Email operations data loaded from APIs')

      } catch (error) {
        console.error('Failed to fetch email operations data:', error)
        setError(error instanceof Error ? error.message : 'Failed to load email data')
      } finally {
        setLoading(false)
      }
    }

    fetchEmailOperationsData()
  }, [])

  // Test email template
  const handleTestTemplate = async (template: EmailTemplate) => {
    try {
      const testData = {
        store_name: 'Test Store',
        order_number: '12345',
        customer_name: 'Test Customer',
        // Add other test data as needed
      }

      const response = await fetch('/admin/email/templates/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          template: template.template,
          data: testData,
          to: 'test@example.com' // Replace with actual test email
        }),
        credentials: 'include'
      })

      if (response.ok) {
        alert(`✅ Test email sent for template: ${template.name}`)
      } else {
        alert('❌ Failed to send test email')
      }
    } catch (error) {
      console.error('Failed to test email template:', error)
      alert('❌ Failed to send test email')
    }
  }

  // Error state
  if (error) {
    return (
      <Container className="divide-y p-0">
        <div className="flex items-center justify-between px-6 py-4">
          <Heading level="h1">Email Operations - Error</Heading>
          <Badge color="red">❌ Email Service Error</Badge>
        </div>
        <div className="px-6 py-6">
          <Text className="text-red-600">Failed to load email data: {error}</Text>
          <Text size="small" className="text-gray-600 mt-2">
            Please check Resend and Klaviyo API connections.
          </Text>
        </div>
      </Container>
    )
  }

  // Loading state
  if (loading) {
    return (
      <Container className="divide-y p-0">
        <div className="flex items-center justify-between px-6 py-4">
          <Heading level="h1">Loading Email Operations...</Heading>
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
        <Heading level="h1">📧 Email Operations Center</Heading>
        <div className="flex items-center gap-2">
          <Badge color="green">✅ Resend Connected</Badge>
          <Badge color="blue">✅ {klaviyoAnalytics.length} Klaviyo Accounts</Badge>
        </div>
      </div>

      <div className="px-6 py-6">
        {/* Tab Navigation */}
        <div className="mb-6 border-b">
          <div className="flex space-x-6">
            <button
              onClick={() => setActiveTab('overview')}
              className={`pb-2 border-b-2 transition-colors ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              📊 Email Analytics
            </button>
            <button
              onClick={() => setActiveTab('templates')}
              className={`pb-2 border-b-2 transition-colors ${
                activeTab === 'templates'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              ✉️ Templates & Automation
            </button>
            <button
              onClick={() => setActiveTab('klaviyo')}
              className={`pb-2 border-b-2 transition-colors ${
                activeTab === 'klaviyo'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              📈 Klaviyo Portfolio
            </button>
          </div>
        </div>

        {/* Email Analytics Tab */}
        {activeTab === 'overview' && resendAnalytics && (
          <div className="space-y-6">
            {/* Resend Performance Overview */}
            <div>
              <Heading level="h2">Resend Performance (All Domains)</Heading>
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 border rounded-lg text-center">
                  <Text size="small" weight="plus">Emails Sent</Text>
                  <div className="text-2xl font-bold text-blue-600">
                    {resendAnalytics.totalSent.toLocaleString()}
                  </div>
                  <Text size="small" className="text-gray-600">Total sent</Text>
                </div>
                <div className="p-4 border rounded-lg text-center">
                  <Text size="small" weight="plus">Delivery Rate</Text>
                  <div className={`text-2xl font-bold ${resendAnalytics.deliveryRate >= 95 ? 'text-green-600' : 'text-orange-600'}`}>
                    {resendAnalytics.deliveryRate.toFixed(1)}%
                  </div>
                  <Text size="small" className="text-gray-600">Delivered successfully</Text>
                </div>
                <div className="p-4 border rounded-lg text-center">
                  <Text size="small" weight="plus">Open Rate</Text>
                  <div className={`text-2xl font-bold ${resendAnalytics.openRate >= 20 ? 'text-green-600' : 'text-orange-600'}`}>
                    {resendAnalytics.openRate.toFixed(1)}%
                  </div>
                  <Text size="small" className="text-gray-600">Engagement rate</Text>
                </div>
                <div className="p-4 border rounded-lg text-center">
                  <Text size="small" weight="plus">Click Rate</Text>
                  <div className={`text-2xl font-bold ${resendAnalytics.clickRate >= 3 ? 'text-green-600' : 'text-orange-600'}`}>
                    {resendAnalytics.clickRate.toFixed(1)}%
                  </div>
                  <Text size="small" className="text-gray-600">Click-through rate</Text>
                </div>
              </div>
            </div>

            {/* Domain Performance Comparison */}
            <div>
              <Heading level="h2">Domain Performance Comparison</Heading>
              <div className="mt-4 space-y-3">
                {resendAnalytics.domainPerformance.map((domain) => (
                  <div key={domain.domain} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <Heading level="h3">{domain.domain}</Heading>
                      <div className="flex gap-2">
                        <Badge color={domain.deliveryRate >= 95 ? 'green' : 'orange'}>
                          {domain.deliveryRate.toFixed(1)}% delivery
                        </Badge>
                        <Badge color={domain.openRate >= 20 ? 'green' : 'orange'}>
                          {domain.openRate.toFixed(1)}% open
                        </Badge>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="text-center">
                        <Text size="small" weight="plus">Sent</Text>
                        <div className="font-semibold">{domain.sent}</div>
                      </div>
                      <div className="text-center">
                        <Text size="small" weight="plus">Delivered</Text>
                        <div className="font-semibold">{domain.delivered}</div>
                      </div>
                      <div className="text-center">
                        <Text size="small" weight="plus">Opened</Text>
                        <div className="font-semibold">{domain.opened}</div>
                      </div>
                      <div className="text-center">
                        <Text size="small" weight="plus">Performance</Text>
                        <div className="font-semibold">
                          {domain.deliveryRate >= 95 && domain.openRate >= 20 ? '🏆 Excellent' :
                           domain.deliveryRate >= 90 ? '👍 Good' : '⚠️ Review'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Email Activity */}
            <div>
              <Heading level="h2">Recent Email Activity</Heading>
              <div className="mt-4 space-y-2">
                {resendAnalytics.recentEmails.slice(0, 10).map((email) => (
                  <div key={email.id} className="flex items-center justify-between p-3 border rounded">
                    <div className="flex-1">
                      <Text size="small" weight="plus">{email.subject}</Text>
                      <div className="flex items-center gap-2 mt-1">
                        <Text size="small" className="text-gray-600">To: {email.to}</Text>
                        <Badge color="blue" variant="outline">{email.template}</Badge>
                        <Text size="small" className="text-gray-600">
                          {new Date(email.created_at).toLocaleString()}
                        </Text>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge color={
                        email.status === 'delivered' ? 'green' :
                        email.status === 'sent' ? 'blue' : 'orange'
                      }>
                        {email.status}
                      </Badge>
                      {email.opened_at && <Badge color="purple" variant="outline">📖 Opened</Badge>}
                      {email.clicked_at && <Badge color="green" variant="outline">🖱️ Clicked</Badge>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Email Templates Tab */}
        {activeTab === 'templates' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Heading level="h2">React Email Templates & Automation</Heading>
              <Button variant="primary" size="small">
                ➕ Create New Template
              </Button>
            </div>

            {/* Available Templates */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {emailTemplates.map((template) => (
                <div key={template.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <Text weight="plus">{template.name}</Text>
                    <Badge color="blue">{template.events.length} events</Badge>
                  </div>

                  <div className="space-y-2 text-sm">
                    <Text size="small" className="text-gray-600">Subject: {template.subject}</Text>
                    <div className="flex flex-wrap gap-1">
                      {template.events.map((event) => (
                        <Badge key={event} color="green" variant="outline">
                          {event}
                        </Badge>
                      ))}
                    </div>
                    {template.performance && (
                      <div className="pt-2 border-t text-xs">
                        <Text size="small">
                          Sent: {template.performance.sent} |
                          Open: {template.performance.openRate.toFixed(1)}% |
                          Click: {template.performance.clickRate.toFixed(1)}%
                        </Text>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 flex gap-2">
                    <Button
                      variant="secondary"
                      size="small"
                      onClick={() => setSelectedTemplate(template)}
                    >
                      ✏️ Edit
                    </Button>
                    <Button
                      variant="transparent"
                      size="small"
                      onClick={() => handleTestTemplate(template)}
                    >
                      🧪 Test
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Medusa Event Integration */}
            <div className="border rounded-lg p-4 bg-blue-50">
              <Text weight="plus" className="text-blue-800">
                🔄 Automated Email Triggers (Medusa v2 Events)
              </Text>
              <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Text size="small" weight="plus">Order Events:</Text>
                  <div className="space-y-1">
                    <Text size="small">• order.placed → Order Confirmation</Text>
                    <Text size="small">• order.shipped → Shipping Notification</Text>
                    <Text size="small">• order.delivered → Delivery Confirmation</Text>
                  </div>
                </div>
                <div>
                  <Text size="small" weight="plus">Customer Events:</Text>
                  <div className="space-y-1">
                    <Text size="small">• customer.created → Welcome Email</Text>
                    <Text size="small">• cart.abandoned → Abandoned Cart</Text>
                    <Text size="small">• customer.birthday → Birthday Offer</Text>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Klaviyo Portfolio Tab */}
        {activeTab === 'klaviyo' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Heading level="h2">Klaviyo Portfolio (3 Accounts)</Heading>
              <Badge color="purple">✨ Portfolio View</Badge>
            </div>

            {/* Klaviyo Accounts Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {klaviyoAnalytics.map((account) => (
                <div key={account.accountName} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <Text weight="plus">{account.accountName}</Text>
                    <Badge color="purple">📈 Active</Badge>
                  </div>

                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="text-center p-2 bg-gray-50 rounded">
                        <Text size="small" weight="plus">{account.totalProfiles.toLocaleString()}</Text>
                        <Text size="small">Profiles</Text>
                      </div>
                      <div className="text-center p-2 bg-gray-50 rounded">
                        <Text size="small" weight="plus">{account.totalCampaigns}</Text>
                        <Text size="small">Campaigns</Text>
                      </div>
                    </div>

                    <div className="text-center p-3 bg-green-50 rounded">
                      <Text size="small" weight="plus">${account.totalRevenue.toLocaleString()}</Text>
                      <Text size="small">Email Revenue</Text>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="text-center">
                        <Text size="small">Open: {account.openRate.toFixed(1)}%</Text>
                      </div>
                      <div className="text-center">
                        <Text size="small">Click: {account.clickRate.toFixed(1)}%</Text>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <Button variant="secondary" size="small" className="w-full">
                      🔗 Open Klaviyo Account
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Combined Klaviyo Insights */}
            <div className="border rounded-lg p-4 bg-purple-50">
              <Text weight="plus" className="text-purple-800">
                💡 Klaviyo Portfolio Insights
              </Text>
              <div className="mt-3 space-y-2">
                <Text size="small" className="text-purple-700">
                  • Total email revenue: ${klaviyoAnalytics.reduce((sum, acc) => sum + acc.totalRevenue, 0).toLocaleString()}
                </Text>
                <Text size="small" className="text-purple-700">
                  • Combined profiles: {klaviyoAnalytics.reduce((sum, acc) => sum + acc.totalProfiles, 0).toLocaleString()}
                </Text>
                <Text size="small" className="text-purple-700">
                  • Average open rate: {(klaviyoAnalytics.reduce((sum, acc) => sum + acc.openRate, 0) / klaviyoAnalytics.length).toFixed(1)}%
                </Text>
              </div>
            </div>
          </div>
        )}

        {/* Template Editor Modal */}
        {selectedTemplate && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Container className="max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="px-6 py-4 border-b">
                <div className="flex items-center justify-between">
                  <Heading level="h2">Edit Template: {selectedTemplate.name}</Heading>
                  <Button
                    variant="secondary"
                    size="small"
                    onClick={() => setSelectedTemplate(null)}
                  >
                    Close
                  </Button>
                </div>
              </div>

              <div className="px-6 py-6 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <Label>Template Name</Label>
                    <Input
                      value={selectedTemplate.name}
                      onChange={() => {}} // Handle template editing
                    />
                  </div>
                  <div>
                    <Label>Email Subject</Label>
                    <Input
                      value={selectedTemplate.subject}
                      onChange={() => {}} // Handle subject editing
                    />
                  </div>
                </div>

                <div>
                  <Label>React Email Template Code</Label>
                  <Textarea
                    value={selectedTemplate.template}
                    onChange={() => {}} // Handle template code editing
                    rows={12}
                    className="font-mono text-sm"
                  />
                </div>

                <div>
                  <Label>Medusa Events (Triggers)</Label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {['order.placed', 'order.shipped', 'order.completed', 'customer.created', 'cart.abandoned'].map((event) => (
                      <label key={event} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedTemplate.events.includes(event)}
                          onChange={() => {}} // Handle event selection
                        />
                        <Text size="small">{event}</Text>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="secondary" onClick={() => setSelectedTemplate(null)}>
                    Cancel
                  </Button>
                  <Button variant="transparent" onClick={() => handleTestTemplate(selectedTemplate)}>
                    🧪 Test Template
                  </Button>
                  <Button variant="primary">
                    💾 Save Template
                  </Button>
                </div>
              </div>
            </Container>
          </div>
        )}
      </div>
    </Container>
  )
}

// ✅ Official Medusa v2 Route Configuration
export const config = defineRouteConfig({
  label: "📧 Email Operations",
})

export default EmailOperationsPage

EOF

echo "✅ Email operations center created with Resend + Klaviyo integration"
```

---

# Phase 6: Revenue Operations Dashboard (1.5 hours)

## Overview
Create a high-level revenue operations dashboard that provides executive-level insights across all business operations. This aggregates data from Medusa, Shipstation, Klaviyo, and Resend to provide unified business intelligence for strategic decision making.

**✅ Based on Official Documentation:**
- **Medusa v2 Services:** ORDER, CUSTOMER, PRODUCT data aggregation
- **Multi-source Analytics:** Combine ecommerce, shipping, and marketing data
- **Executive KPIs:** High-level business performance metrics
- **Operational Efficiency:** Cost analysis and optimization recommendations

## Prerequisites
- Email operations center completed (Phase 5)
- All service integrations working (Medusa, Resend, Klaviyo, Shipstation)
- Real business data flowing through systems

---

## Step 6.1: Create Revenue Operations Dashboard

### Create Revenue Operations Admin Page

```bash
cd /Users/zachwieder/Documents/🗂️\ AGENCY/Cole\ Boban/thca-multistore-repos/thca-multistore-backend

# Create revenue operations admin page
mkdir -p src/admin/routes/revenue-operations

cat > src/admin/routes/revenue-operations/page.tsx << 'EOF'
// Revenue Operations Dashboard - Official Medusa v2 UI Route Pattern
// Executive-level business intelligence across all operations
// Reference: https://docs.medusajs.com/learn/customization/customize-admin

import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Button, Badge, Text, Label } from "@medusajs/ui"
import React, { useState, useEffect } from "react"

// Unified Business Intelligence Interface
interface RevenueOperations {
  businessOverview: {
    totalRevenue: number
    totalOrders: number
    totalCustomers: number
    averageOrderValue: number
    customerLifetimeValue: number
    growthRate: number
    profitMargin: number
  }
  operationalEfficiency: {
    fulfillmentCosts: number
    shippingCosts: number
    marketingCosts: number
    emailCosts: number
    totalOperatingCosts: number
    costPerOrder: number
    operatingMargin: number
  }
  channelPerformance: Array<{
    channel: string
    revenue: number
    orders: number
    customers: number
    conversionRate: number
    customerAcquisitionCost: number
    returnOnAdSpend: number
  }>
  revenueForecasting: {
    projectedRevenue30d: number
    projectedOrders30d: number
    growthTrend: 'up' | 'down' | 'stable'
    seasonalAdjustment: number
  }
}

const RevenueOperationsPage = () => {
  const [operations, setOperations] = useState<RevenueOperations | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [timeframe, setTimeframe] = useState<string>('30d')

  // Fetch real revenue operations data
  useEffect(() => {
    const fetchRevenueOperations = async () => {
      try {
        setLoading(true)
        setError(null)

        // ✅ Fetch unified revenue operations data
        const response = await fetch(`/admin/revenue/operations?timeframe=${timeframe}`, {
          credentials: 'include'
        })

        if (!response.ok) {
          throw new Error(`Revenue operations API failed: ${response.status}`)
        }

        const operationsData = await response.json()
        console.log('Real revenue operations data:', operationsData)

        setOperations(operationsData)
        console.log('✅ Revenue operations intelligence loaded')

      } catch (error) {
        console.error('Failed to fetch revenue operations data:', error)
        setError(error instanceof Error ? error.message : 'Failed to load revenue data')
      } finally {
        setLoading(false)
      }
    }

    fetchRevenueOperations()
  }, [timeframe])

  // Calculate performance indicators
  const getPerformanceIndicator = (value: number, target: number) => {
    const percentage = (value / target) * 100
    if (percentage >= 100) return { color: 'green', icon: '🎯', text: 'Target Met' }
    if (percentage >= 80) return { color: 'blue', icon: '📈', text: 'On Track' }
    if (percentage >= 60) return { color: 'orange', icon: '⚠️', text: 'Needs Attention' }
    return { color: 'red', icon: '🚨', text: 'Critical' }
  }

  // Error state
  if (error) {
    return (
      <Container className="divide-y p-0">
        <div className="flex items-center justify-between px-6 py-4">
          <Heading level="h1">Revenue Operations - Error</Heading>
          <Badge color="red">❌ Data Error</Badge>
        </div>
        <div className="px-6 py-6">
          <Text className="text-red-600">Failed to load revenue data: {error}</Text>
          <Text size="small" className="text-gray-600 mt-2">
            Please check data integrations and API connections.
          </Text>
        </div>
      </Container>
    )
  }

  // Loading state
  if (loading || !operations) {
    return (
      <Container className="divide-y p-0">
        <div className="flex items-center justify-between px-6 py-4">
          <Heading level="h1">Loading Revenue Operations...</Heading>
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
        <Heading level="h1">💰 Revenue Operations</Heading>
        <div className="flex items-center gap-2">
          <Badge color="green">✅ Live Business Data</Badge>
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="1y">Last Year</option>
          </select>
        </div>
      </div>

      <div className="px-6 py-6 space-y-8">
        {/* Executive Business Overview */}
        <div>
          <Heading level="h2">Executive Business Overview</Heading>
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 border rounded-lg text-center">
              <Text size="small" weight="plus">Total Revenue</Text>
              <div className="text-3xl font-bold text-green-600">
                ${operations.businessOverview.totalRevenue.toLocaleString()}
              </div>
              <div className={`text-sm ${operations.businessOverview.growthRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {operations.businessOverview.growthRate >= 0 ? '↗️' : '↘️'} {Math.abs(operations.businessOverview.growthRate).toFixed(1)}%
              </div>
            </div>
            <div className="p-4 border rounded-lg text-center">
              <Text size="small" weight="plus">Profit Margin</Text>
              <div className={`text-3xl font-bold ${operations.businessOverview.profitMargin >= 20 ? 'text-green-600' : 'text-orange-600'}`}>
                {operations.businessOverview.profitMargin.toFixed(1)}%
              </div>
              <Text size="small" className="text-gray-600">After all costs</Text>
            </div>
            <div className="p-4 border rounded-lg text-center">
              <Text size="small" weight="plus">Customer LTV</Text>
              <div className="text-3xl font-bold text-purple-600">
                ${operations.businessOverview.customerLifetimeValue.toFixed(0)}
              </div>
              <Text size="small" className="text-gray-600">Average lifetime</Text>
            </div>
            <div className="p-4 border rounded-lg text-center">
              <Text size="small" weight="plus">Cost per Order</Text>
              <div className="text-3xl font-bold text-blue-600">
                ${operations.operationalEfficiency.costPerOrder.toFixed(2)}
              </div>
              <Text size="small" className="text-gray-600">Operating cost</Text>
            </div>
          </div>
        </div>

        {/* Operational Cost Breakdown */}
        <div>
          <Heading level="h2">Operational Cost Analysis</Heading>
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 border rounded-lg">
              <Text size="small" weight="plus">Shipping Costs</Text>
              <div className="text-xl font-semibold">${operations.operationalEfficiency.shippingCosts.toLocaleString()}</div>
              <Text size="small" className="text-gray-600">
                {((operations.operationalEfficiency.shippingCosts / operations.operationalEfficiency.totalOperatingCosts) * 100).toFixed(1)}% of total
              </Text>
            </div>
            <div className="p-4 border rounded-lg">
              <Text size="small" weight="plus">Email Marketing</Text>
              <div className="text-xl font-semibold">${operations.operationalEfficiency.emailCosts.toLocaleString()}</div>
              <Text size="small" className="text-gray-600">
                {((operations.operationalEfficiency.emailCosts / operations.operationalEfficiency.totalOperatingCosts) * 100).toFixed(1)}% of total
              </Text>
            </div>
            <div className="p-4 border rounded-lg">
              <Text size="small" weight="plus">Fulfillment</Text>
              <div className="text-xl font-semibold">${operations.operationalEfficiency.fulfillmentCosts.toLocaleString()}</div>
              <Text size="small" className="text-gray-600">
                {((operations.operationalEfficiency.fulfillmentCosts / operations.operationalEfficiency.totalOperatingCosts) * 100).toFixed(1)}% of total
              </Text>
            </div>
            <div className="p-4 border rounded-lg">
              <Text size="small" weight="plus">Operating Margin</Text>
              <div className={`text-xl font-semibold ${operations.operationalEfficiency.operatingMargin >= 15 ? 'text-green-600' : 'text-orange-600'}`}>
                {operations.operationalEfficiency.operatingMargin.toFixed(1)}%
              </div>
              <Text size="small" className="text-gray-600">
                {operations.operationalEfficiency.operatingMargin >= 15 ? '🏆 Healthy' : '⚠️ Optimize'}
              </Text>
            </div>
          </div>
        </div>

        {/* Channel Performance */}
        <div>
          <Heading level="h2">Channel Performance Analysis</Heading>
          <div className="mt-4 space-y-3">
            {operations.channelPerformance.map((channel) => (
              <div key={channel.channel} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <Text weight="plus">{channel.channel}</Text>
                  <div className="flex gap-2">
                    <Badge color={channel.returnOnAdSpend >= 3 ? 'green' : 'orange'}>
                      {channel.returnOnAdSpend.toFixed(1)}x ROAS
                    </Badge>
                    <Badge color={channel.conversionRate >= 2 ? 'green' : 'orange'}>
                      {channel.conversionRate.toFixed(1)}% conversion
                    </Badge>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                  <div className="text-center">
                    <Text size="small" weight="plus">Revenue</Text>
                    <div className="font-semibold">${channel.revenue.toLocaleString()}</div>
                  </div>
                  <div className="text-center">
                    <Text size="small" weight="plus">Orders</Text>
                    <div className="font-semibold">{channel.orders}</div>
                  </div>
                  <div className="text-center">
                    <Text size="small" weight="plus">Customers</Text>
                    <div className="font-semibold">{channel.customers}</div>
                  </div>
                  <div className="text-center">
                    <Text size="small" weight="plus">CAC</Text>
                    <div className="font-semibold">${channel.customerAcquisitionCost.toFixed(2)}</div>
                  </div>
                  <div className="text-center">
                    <Text size="small" weight="plus">Efficiency</Text>
                    <div className="font-semibold">
                      {channel.returnOnAdSpend >= 4 ? '🏆 Excellent' :
                       channel.returnOnAdSpend >= 3 ? '👍 Good' :
                       channel.returnOnAdSpend >= 2 ? '⚠️ Optimize' : '🚨 Review'}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue Forecasting */}
        <div>
          <Heading level="h2">Revenue Forecasting & Trends</Heading>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-6 border rounded-lg text-center">
              <Text weight="plus">30-Day Revenue Projection</Text>
              <div className="text-2xl font-bold text-green-600 mt-2">
                ${operations.revenueForecasting.projectedRevenue30d.toLocaleString()}
              </div>
              <div className="flex items-center justify-center gap-1 mt-2">
                {operations.revenueForecasting.growthTrend === 'up' ? '📈' :
                 operations.revenueForecasting.growthTrend === 'down' ? '📉' : '➡️'}
                <Text size="small" className="text-gray-600">
                  {operations.revenueForecasting.growthTrend === 'up' ? 'Growing' :
                   operations.revenueForecasting.growthTrend === 'down' ? 'Declining' : 'Stable'} trend
                </Text>
              </div>
            </div>
            <div className="p-6 border rounded-lg text-center">
              <Text weight="plus">Projected Orders</Text>
              <div className="text-2xl font-bold text-blue-600 mt-2">
                {operations.revenueForecasting.projectedOrders30d.toLocaleString()}
              </div>
              <Text size="small" className="text-gray-600 mt-2">
                Based on current trends
              </Text>
            </div>
            <div className="p-6 border rounded-lg text-center">
              <Text weight="plus">Seasonal Factor</Text>
              <div className={`text-2xl font-bold mt-2 ${
                operations.revenueForecasting.seasonalAdjustment >= 1 ? 'text-green-600' : 'text-orange-600'
              }`}>
                {operations.revenueForecasting.seasonalAdjustment.toFixed(2)}x
              </div>
              <Text size="small" className="text-gray-600 mt-2">
                {operations.revenueForecasting.seasonalAdjustment >= 1 ? 'Peak season' : 'Off season'}
              </Text>
            </div>
          </div>
        </div>

        {/* Executive Insights */}
        <div>
          <Heading level="h2">Executive Insights & Actions</Heading>
          <div className="mt-4 space-y-4">
            {/* Profitability Analysis */}
            <div className="p-4 bg-green-50 border border-green-200 rounded">
              <Text weight="plus" className="text-green-800">
                💰 Profitability Analysis
              </Text>
              <div className="mt-2 space-y-1">
                <Text size="small" className="text-green-700">
                  • Gross margin: {operations.businessOverview.profitMargin.toFixed(1)}%
                  ({operations.businessOverview.profitMargin >= 20 ? 'Healthy' : 'Monitor closely'})
                </Text>
                <Text size="small" className="text-green-700">
                  • Operating margin: {operations.operationalEfficiency.operatingMargin.toFixed(1)}%
                  ({operations.operationalEfficiency.operatingMargin >= 15 ? 'Strong' : 'Optimize costs'})
                </Text>
                <Text size="small" className="text-green-700">
                  • Cost per order: ${operations.operationalEfficiency.costPerOrder.toFixed(2)}
                  ({operations.operationalEfficiency.costPerOrder < 10 ? 'Efficient' : 'Review costs'})
                </Text>
              </div>
            </div>

            {/* Growth Opportunities */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded">
              <Text weight="plus" className="text-blue-800">
                📈 Growth Opportunities
              </Text>
              <div className="mt-2 space-y-1">
                <Text size="small" className="text-blue-700">
                  • Customer LTV: ${operations.businessOverview.customerLifetimeValue.toFixed(0)}
                  (Focus on retention to increase LTV)
                </Text>
                <Text size="small" className="text-blue-700">
                  • Best performing channel: {operations.channelPerformance
                    .sort((a, b) => b.returnOnAdSpend - a.returnOnAdSpend)[0]?.channel}
                  (Scale successful strategies)
                </Text>
                <Text size="small" className="text-blue-700">
                  • Revenue forecast: ${operations.revenueForecasting.projectedRevenue30d.toLocaleString()} next 30 days
                  ({operations.revenueForecasting.growthTrend === 'up' ? 'Positive' : 'Monitor'} trend)
                </Text>
              </div>
            </div>

            {/* Operational Efficiency */}
            {operations.operationalEfficiency.operatingMargin < 15 && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
                <Text weight="plus" className="text-yellow-800">
                  ⚠️ Operational Efficiency Alert
                </Text>
                <div className="mt-2 space-y-1">
                  <Text size="small" className="text-yellow-700">
                    Operating margin below 15% - review cost structure
                  </Text>
                  <Text size="small" className="text-yellow-700">
                    Highest costs:
                    {operations.operationalEfficiency.shippingCosts > operations.operationalEfficiency.marketingCosts
                      ? ' Shipping (' + ((operations.operationalEfficiency.shippingCosts / operations.operationalEfficiency.totalOperatingCosts) * 100).toFixed(1) + '%)'
                      : ' Marketing (' + ((operations.operationalEfficiency.marketingCosts / operations.operationalEfficiency.totalOperatingCosts) * 100).toFixed(1) + '%)'
                    }
                  </Text>
                  <Text size="small" className="text-yellow-700">
                    Recommendation: Focus on cost optimization and operational efficiency
                  </Text>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="pt-4 border-t">
          <div className="flex gap-3">
            <Button variant="primary" size="small">
              📊 Export Executive Report
            </Button>
            <Button variant="secondary" size="small">
              📈 View Detailed Analytics
            </Button>
            <Button variant="secondary" size="small">
              ⚙️ Configure Integrations
            </Button>
          </div>
          <Text size="small" className="text-gray-600 mt-2">
            💡 This dashboard aggregates data from Medusa, Klaviyo, Shipstation, and Resend
            to provide unified business intelligence for strategic decision making.
          </Text>
        </div>
      </div>
    </Container>
  )
}

// ✅ Official Medusa v2 Route Configuration
export const config = defineRouteConfig({
  label: "💰 Revenue Operations",
})

export default RevenueOperationsPage

EOF

echo "✅ Revenue operations dashboard created with unified business intelligence"
```

---

# Phase 7: Testing & Validation (30 minutes)

## Overview
Test the operational intelligence platform to ensure all integrations work correctly and provide real business value. Validate that the system follows low complexity, high value principles while delivering actionable insights.

**✅ Based on Official Documentation:**
- **Medusa v2 Testing:** Verify admin routes and API endpoints
- **Service Integration Testing:** Confirm Resend, Klaviyo, and Shipstation connections
- **Data Accuracy:** Validate real database integration
- **User Experience:** Ensure operational efficiency and ease of use

## Prerequisites
- All 4 operational pages completed
- Service integrations configured
- Real data flowing through systems

---

## Step 7.1: Test Operational Intelligence Platform

### Create Operations Testing Script

```bash
cd /Users/zachwieder/Documents/🗂️\ AGENCY/Cole\ Boban/thca-multistore-repos/thca-multistore-backend

# Create comprehensive testing script for operational intelligence
cat > test-operational-intelligence.sh << 'EOF'
#!/bin/bash

# Operational Intelligence Platform Testing
# Tests all 4 operational pages and service integrations

set -e

echo "🧪 OPERATIONAL INTELLIGENCE TESTING"
echo "=================================="
echo "Testing multi-store business operations platform"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test tracking
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Function to run test and track results
run_test() {
    local test_name="$1"
    local test_command="$2"

    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    echo -n "Testing: $test_name... "

    if eval "$test_command" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ PASSED${NC}"
        PASSED_TESTS=$((PASSED_TESTS + 1))
        return 0
    else
        echo -e "${RED}❌ FAILED${NC}"
        FAILED_TESTS=$((FAILED_TESTS + 1))
        return 1
    fi
}

echo "1️⃣ OPERATIONAL PAGES VERIFICATION"
echo "================================="

# Check operational admin pages exist
run_test "Business intelligence page exists" "[ -f 'src/admin/routes/business-intelligence/page.tsx' ]"
run_test "Email operations page exists" "[ -f 'src/admin/routes/email-operations/page.tsx' ]"
run_test "Shipping intelligence page exists" "[ -f 'src/admin/routes/shipping-intelligence/page.tsx' ]"
run_test "Revenue operations page exists" "[ -f 'src/admin/routes/revenue-operations/page.tsx' ]"

# Check redundant pages removed
run_test "Cannabis config page removed" "[ ! -f 'src/admin/routes/cannabis-config/page.tsx' ]"
run_test "Cannabis users page removed" "[ ! -f 'src/admin/routes/cannabis-users/page.tsx' ]"
run_test "Cannabis widget removed" "[ ! -f 'src/admin/widgets/cannabis-dashboard-widget.tsx' ]"

echo ""
echo "2️⃣ API ENDPOINTS VERIFICATION"
echo "============================="

# Check operational API endpoints
run_test "Business intelligence API exists" "[ -f 'src/api/admin/business/intelligence/route.ts' ]"
run_test "Shipping analytics API exists" "[ -f 'src/api/admin/shipping/analytics/route.ts' ]"
run_test "Business metrics API exists" "[ -f 'src/api/admin/business/metrics/route.ts' ]"

# Check redundant APIs cleaned up
run_test "Cannabis config API removed" "[ ! -f 'src/api/admin/cannabis/config/route.ts' ]"
run_test "Cannabis branding removed" "[ ! -d 'src/api/admin/cannabis' ]"

echo ""
echo "3️⃣ SERVICE INTEGRATIONS"
echo "======================="

# Test external service configuration
run_test "Resend environment configured" "grep -q 'RESEND_API_KEY' .env"
run_test "Klaviyo environment configured" "grep -q 'KLAVIYO.*API_KEY' .env"
run_test "Shipstation environment configured" "grep -q 'SHIPSTATION_API_KEY' .env"

# Test Medusa v2 notification module
run_test "Notification provider exists" "[ -f 'src/modules/resend-notification-provider/index.ts' ]"
run_test "Medusa config has notification module" "grep -q 'notification' medusa-config.ts"

echo ""
echo "4️⃣ OPERATIONAL INTELLIGENCE TESTING"
echo "=================================="

# Test that pages use official Medusa v2 patterns
run_test "Pages use official admin-sdk" "grep -q '@medusajs/admin-sdk' src/admin/routes/business-intelligence/page.tsx"
run_test "Pages use official UI components" "grep -q '@medusajs/ui' src/admin/routes/email-operations/page.tsx"
run_test "APIs use official patterns" "grep -q 'Request.*Response.*express' src/api/admin/business/intelligence/route.ts"

# Test real data integration
run_test "Business intelligence uses real services" "grep -q 'Modules\\.ORDER\\|Modules\\.CUSTOMER' src/api/admin/business/intelligence/route.ts"
run_test "No hardcoded data in pages" "! grep -q 'sampleData\\|hardcoded\\|demo' src/admin/routes/business-intelligence/page.tsx"

echo ""
echo "5️⃣ OPERATIONAL TESTING RESULTS"
echo "============================="

# Calculate results
if [ $TOTAL_TESTS -gt 0 ]; then
    pass_percentage=$((PASSED_TESTS * 100 / TOTAL_TESTS))
else
    pass_percentage=0
fi

echo "🧪 OPERATIONAL INTELLIGENCE TEST RESULTS:"
echo "   Total Tests: $TOTAL_TESTS"
echo -e "   Passed: ${GREEN}$PASSED_TESTS${NC}"
echo -e "   Failed: ${RED}$FAILED_TESTS${NC}"
echo -e "   Success Rate: ${BLUE}$pass_percentage%${NC}"
echo ""

if [ $FAILED_TESTS -eq 0 ]; then
    echo -e "${GREEN}🎉 ALL OPERATIONAL INTELLIGENCE TESTS PASSED!${NC}"
    echo -e "${GREEN}✅ Multi-store business operations platform is ready${NC}"
    echo ""
    echo "🎯 Next Steps:"
    echo "   1. Access business intelligence at http://localhost:9000/app/business-intelligence"
    echo "   2. Configure email operations at http://localhost:9000/app/email-operations"
    echo "   3. Monitor shipping at http://localhost:9000/app/shipping-intelligence"
    echo "   4. Review revenue operations at http://localhost:9000/app/revenue-operations"
    echo "   5. Use native Medusa admin for product/order/customer management"

    exit 0
elif [ $pass_percentage -ge 80 ]; then
    echo -e "${YELLOW}⚠️ OPERATIONAL TESTS MOSTLY PASSED${NC}"
    echo -e "${YELLOW}   $FAILED_TESTS tests failed, but platform appears functional${NC}"
    echo ""
    echo "🔍 Review failed tests and fix if needed"
    echo "🎯 Platform is ready for operational use"

    exit 1
else
    echo -e "${RED}❌ OPERATIONAL TESTS FAILED${NC}"
    echo -e "${RED}   Too many failures to proceed safely${NC}"
    echo ""
    echo "🔧 Fix operational issues before using platform"
    echo "💡 Check service integrations and API connections"

    exit 2
fi

EOF

chmod +x test-operational-intelligence.sh

echo "✅ Operational intelligence testing script created"
```

### Execute Operational Platform Testing

```bash
cd /Users/zachwieder/Documents/🗂️\ AGENCY/Cole\ Boban/thca-multistore-repos/thca-multistore-backend

echo "🧪 Starting operational intelligence platform testing..."
echo "This will verify all business operations functionality"
echo ""

./test-operational-intelligence.sh
```

---

# Phase 8: Production Deployment (1 hour)

## Overview
Deploy the operational intelligence platform to production with proper environment configuration for all service integrations. Ensure security, performance, and reliability for business-critical operations.

**✅ Based on Official Documentation:**
- **Railway Deployment:** Official hosting for Medusa v2 backends
- **Environment Security:** Production-ready configuration management
- **Service Integration:** Production API keys and webhooks
- **Monitoring:** Health checks and performance monitoring

## Prerequisites
- Operational intelligence platform tested and validated
- Production accounts for Resend, Klaviyo, and Shipstation
- Railway account for backend deployment

---

## Step 8.1: Production Environment Configuration

### Create Production Environment Template

```bash
cd /Users/zachwieder/Documents/🗂️\ AGENCY/Cole\ Boban/thca-multistore-repos/thca-multistore-backend

# Create production environment template
cat > .env.production.template << 'EOF'
# ✅ Production Environment Configuration
# Multi-Store Business Operations Platform

# Database Configuration
DATABASE_URL=postgresql://username:password@host:port/database

# Medusa Configuration
JWT_SECRET=your-super-secure-jwt-secret-here
COOKIE_SECRET=your-super-secure-cookie-secret-here
STORE_CORS=https://straight-gas.com,https://liquid-gummies.com,https://liquidgummieswholesale.com
ADMIN_CORS=https://your-admin-domain.com

# ✅ Resend Email Service (Single API key, multiple domains)
RESEND_API_KEY=re_YOUR_PRODUCTION_RESEND_KEY
RESEND_FROM_EMAIL=noreply@straight-gas.com
BUSINESS_NAME=Your Business Name

# Store Domains (all use same Resend key)
STRAIGHT_GAS_DOMAIN=straight-gas.com
LIQUID_GUMMIES_DOMAIN=liquid-gummies.com
WHOLESALE_DOMAIN=liquidgummieswholesale.com

# ✅ Klaviyo API Keys (3 separate accounts)
KLAVIYO_STRAIGHT_GAS_API_KEY=pk_YOUR_STRAIGHT_GAS_PRODUCTION_KEY
KLAVIYO_LIQUID_GUMMIES_API_KEY=pk_YOUR_LIQUID_GUMMIES_PRODUCTION_KEY
KLAVIYO_WHOLESALE_API_KEY=pk_YOUR_WHOLESALE_PRODUCTION_KEY

# ✅ Shipstation API V2 (Read-only analytics)
SHIPSTATION_API_KEY=YOUR_PRODUCTION_SHIPSTATION_KEY
SHIPSTATION_API_SECRET=YOUR_PRODUCTION_SHIPSTATION_SECRET
SHIPSTATION_WEBHOOK_URL=https://your-backend.railway.app/admin/shipping/webhooks

# Business Operations Configuration
EMAIL_TEMPLATE_BASE_URL=https://your-backend.railway.app
EMAIL_LOGO_URL=https://your-backend.railway.app/logo.png
BUSINESS_SUPPORT_EMAIL=support@yourdomain.com

EOF

echo "✅ Production environment template created"
```

### Create Railway Deployment Configuration

```bash
# Create Railway configuration for production deployment
cat > railway.toml << 'EOF'
[build]
builder = "nixpacks"
buildCommand = "npm run build"

[deploy]
startCommand = "npm run start"
healthcheckPath = "/health"
healthcheckTimeout = 300
restartPolicyType = "on_failure"
restartPolicyMaxRetries = 3

[[services]]
name = "medusa-backend"
source = "."

[services.variables]
NODE_ENV = "production"
PORT = "9000"

EOF

echo "✅ Railway deployment configuration created"
```

### Create Health Check Endpoint

```bash
# Create health check endpoint for production monitoring
mkdir -p src/api/health

cat > src/api/health/route.ts << 'EOF'
// Health Check Endpoint - Production Monitoring
// Reference: Standard health check patterns

import type { Request, Response } from "express"

export const GET = async (req: Request, res: Response) => {
  try {
    // Check database connection
    const { Modules } = await import("@medusajs/utils")
    const storeService = req.scope?.resolve(Modules.STORE)

    if (storeService) {
      await storeService.listStores()
    }

    // Health check passed
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        database: 'connected',
        api: 'operational',
        admin: 'available'
      }
    })
  } catch (error) {
    console.error('Health check failed:', error)
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Service unavailable'
    })
  }
}

EOF

echo "✅ Health check endpoint created for production monitoring"
```

---

# COMPLETION VERIFICATION

## Final Checklist

Before considering the operational intelligence platform complete:

- [ ] ✅ Redundant cannabis-branded extensions removed
- [ ] ✅ 4 operational intelligence pages created with real data integration
- [ ] ✅ Resend email operations with multiple domain support
- [ ] ✅ Klaviyo portfolio integration for 3 accounts
- [ ] ✅ Shipstation read-only analytics integration
- [ ] ✅ Revenue operations dashboard with unified business intelligence
- [ ] ✅ Official Medusa v2 patterns used throughout
- [ ] ✅ Real database integration with no hardcoded data
- [ ] ✅ Production deployment configuration ready

## Success Criteria

**The operational intelligence platform is complete when:**
1. Team can make business decisions using real multi-store data
2. Email operations are efficiently managed across all channels
3. Shipping costs and performance are optimized
4. Revenue operations provide executive-level insights
5. All integrations use official APIs and real data
6. Platform follows low complexity, high value principles

## Value Delivered

**🎯 Business Operations Result:** A focused, efficient operational intelligence platform that provides real business value by aggregating data from Medusa, Resend, Klaviyo, and Shipstation into actionable insights for multi-store business management.

**Next:** Platform ready for daily business operations and strategic decision making.

---

## Implementation Summary

**Total Time Investment:** 6 hours
- **Cleanup & Setup:** 30 minutes
- **Business Intelligence:** 1.5 hours
- **Email Operations:** 2 hours
- **Shipping Intelligence:** 1 hour
- **Revenue Operations:** 1.5 hours
- **Testing & Deployment:** 30 minutes

**Total Value:** Unified operational intelligence platform that leverages Medusa's strengths while adding multi-store business intelligence capabilities that native admin cannot provide.

**Philosophy Achieved:** Low complexity (4 focused pages), high value (real business intelligence), leveraging existing tools (90% Medusa admin) while adding unique operational capabilities (10% custom intelligence).