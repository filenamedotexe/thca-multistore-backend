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

    // Get query container for service resolution
    const query = req.scope.resolve("query")

    // Use v2 service resolution pattern
    const orderService = req.scope.resolve(Modules.ORDER)
    const customerService = req.scope.resolve(Modules.CUSTOMER)
    const productService = req.scope.resolve(Modules.PRODUCT)
    const salesChannelService = req.scope.resolve(Modules.SALES_CHANNEL)

    // Calculate timeframe date range using Chicago timezone for consistency
    const chicagoTime = new Date().toLocaleString("en-US", { timeZone: "America/Chicago" })
    const endDate = new Date(chicagoTime)
    const startDate = new Date(chicagoTime)

    switch (timeframe) {
      case 'today':
        // Start of today in Chicago timezone to now
        startDate.setHours(0, 0, 0, 0)
        break
      case 'yesterday':
        // Start of yesterday to start of today
        startDate.setDate(startDate.getDate() - 1)
        startDate.setHours(0, 0, 0, 0)
        endDate.setHours(0, 0, 0, 0)
        break
      case '7d':
        startDate.setDate(startDate.getDate() - 7)
        break
      case '14d':
        startDate.setDate(startDate.getDate() - 14)
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
      default:
        // Default to last 30 days if invalid timeframe
        startDate.setDate(startDate.getDate() - 30)
        break
    }

    console.log(`📅 Timeframe: ${timeframe}, Start: ${startDate.toISOString()}, End: ${endDate.toISOString()}`)

    // ✅ Fetch real data from database using correct v2 methods
    try {
      const [orders, customers, products, salesChannels] = await Promise.all([
        orderService.listOrders({
          created_at: {
            $gte: startDate.toISOString(),
            $lte: endDate.toISOString()
          }
        }, {
          relations: ["items"],
          take: 1000 // Add reasonable limit
        }),
        customerService.listCustomers({}, { take: 1000 }),
        productService.listProducts({}, { take: 1000 }),
        salesChannelService.listSalesChannels({}, { take: 100 })
      ])

    console.log(`Real data loaded: ${orders.length} orders, ${customers.length} customers, ${products.length} products`)

    // Calculate unified business metrics
    const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0) / 100 // Convert from cents
    const totalOrders = orders.length
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

    // Calculate previous period for growth rate with enhanced logic for new timeframes
    const previousStartDate = new Date()
    const previousEndDate = new Date(startDate)

    switch (timeframe) {
      case 'today':
        // Compare to yesterday
        previousStartDate.setDate(previousEndDate.getDate() - 1)
        previousStartDate.setHours(0, 0, 0, 0)
        previousEndDate.setHours(0, 0, 0, 0)
        break
      case 'yesterday':
        // Compare to day before yesterday
        previousStartDate.setDate(previousEndDate.getDate() - 1)
        previousStartDate.setHours(0, 0, 0, 0)
        previousEndDate.setHours(0, 0, 0, 0)
        break
      default:
        // For other periods, use the same duration before the start date
        const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000))
        previousStartDate.setDate(previousEndDate.getDate() - daysDiff)
        break
    }

    console.log(`📊 Previous period: Start: ${previousStartDate.toISOString()}, End: ${previousEndDate.toISOString()}`)

    const previousOrders = await orderService.listOrders({
      created_at: {
        $gte: previousStartDate.toISOString(),
        $lte: startDate.toISOString()
      }
    }, {
      take: 1000
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
          if (order.items && Array.isArray(order.items)) {
            order.items.forEach(item => {
              const productId = item.product_id || item.variant?.product_id
              if (productId) {
                const existing = productSales.get(productId) || {
                  revenue: 0,
                  quantity: 0,
                  title: item.title || item.variant?.title || 'Unknown Product'
                }
                existing.revenue += (item.subtotal || item.total || 0) / 100
                existing.quantity += item.quantity || 0
                productSales.set(productId, existing)
              }
            })
          }
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
              display_id: order.display_id || 0,
              total: (order.total || 0) / 100,
              created_at: order.created_at,
              customer_email: order.email || 'Unknown'
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

    } catch (dbError) {
      console.error('Database query error:', dbError)
      // Return empty data structure instead of failing completely
      res.json({
        totalRevenue: 0,
        totalOrders: 0,
        totalCustomers: 0,
        averageOrderValue: 0,
        conversionRate: 0,
        growthRate: 0,
        storeComparison: []
      })
    }

  } catch (error) {
    console.error('Error calculating business intelligence:', error)
    res.status(500).json({ error: 'Failed to calculate business intelligence' })
  }
}