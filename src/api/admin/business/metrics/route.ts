// Cannabis Metrics API - Official Medusa v2 API Route Pattern
// Reference: https://docs.medusajs.com/learn/fundamentals/api-routes

import type { Request, Response } from "express"

interface CannabisMetrics {
  totalRevenue: number
  totalOrders: number
  complianceStatus: 'compliant' | 'warning' | 'critical'
  ageVerificationRate: number
  coaFilesActive: number
  lastComplianceCheck: string
}

// ✅ Official Medusa v2 API Route Pattern
export const GET = async (
  req: Request & { scope: any },
  res: Response
) => {
  try {
    // ✅ Use Real Medusa v2 Services to Calculate Metrics from Database
    const { Modules } = await import("@medusajs/utils")
    const orderService = req.scope.resolve(Modules.ORDER)
    const customerService = req.scope.resolve(Modules.CUSTOMER)

    // Fetch real order data from database
    const orders = await orderService.listOrders()
    console.log('Real orders from database:', orders.length, 'orders')

    // Fetch real customer data from database
    const customers = await customerService.listCustomers()
    console.log('Real customers from database:', customers.length, 'customers')

    // Calculate real metrics from database
    const totalRevenue = orders.reduce((sum: number, order: any) => {
      return sum + (order.total || 0)
    }, 0)

    const completedOrders = orders.filter((order: any) => order.status === 'completed')

    // Count COA files from uploads directory
    const fs = require('fs')
    const path = require('path')
    const coaDir = path.join(process.cwd(), 'uploads', 'coa')
    let coaFilesActive = 0
    try {
      const files = fs.readdirSync(coaDir)
      coaFilesActive = files.filter((file: string) => file.endsWith('.pdf')).length
    } catch (err) {
      coaFilesActive = 0
    }

    // Calculate real compliance metrics from customer data
    const verifiedCustomers = customers.filter((customer: any) =>
      customer.metadata?.cannabis_age_verified === true
    )
    const ageVerificationRate = customers.length > 0
      ? (verifiedCustomers.length / customers.length) * 100
      : 0

    // Determine compliance status based on real metrics
    let complianceStatus: 'compliant' | 'warning' | 'critical' = 'compliant'
    if (ageVerificationRate < 95) {
      complianceStatus = 'critical'
    } else if (ageVerificationRate < 98) {
      complianceStatus = 'warning'
    }

    const metrics: CannabisMetrics = {
      totalRevenue: totalRevenue / 100, // Convert from cents
      totalOrders: completedOrders.length,
      complianceStatus: complianceStatus,
      ageVerificationRate: Math.round(ageVerificationRate * 10) / 10, // Round to 1 decimal
      coaFilesActive: coaFilesActive,
      lastComplianceCheck: new Date().toISOString().split('T')[0]
    }

    console.log('Real cannabis metrics calculated from database:', metrics)
    res.json(metrics)
  } catch (error) {
    console.error('Error calculating cannabis metrics from database:', error)
    res.status(500).json({ error: 'Failed to calculate metrics from database' })
  }
}