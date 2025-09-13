// Cannabis Configuration API - Official Medusa v2 API Route Pattern
// Reference: https://docs.medusajs.com/learn/fundamentals/api-routes

import type { Request, Response } from "express"

type PostAdminCannabisConfigType = {
  businessName: string
  businessLicense: string
  businessState: string
  businessType: 'retail' | 'wholesale' | 'manufacturing'
  complianceEmail: string
  maxOrderValue: number
  requiresAgeVerification: boolean
  coaRequired: boolean
  paymentProcessor: 'authorizenet' | 'stripe' | 'paypal'
  notificationSettings: {
    orderAlerts: boolean
    complianceAlerts: boolean
    lowStockAlerts: boolean
  }
}

// ✅ Official Medusa v2 API Route Pattern
export const GET = async (
  req: Request & { scope: any },
  res: Response
) => {
  try {
    // ✅ Use Real Medusa v2 Store Service for Configuration
    const { Modules } = await import("@medusajs/utils")
    const storeService = req.scope.resolve(Modules.STORE)

    // Fetch real store configuration from database
    const stores = await storeService.listStores()
    const mainStore = stores[0] // Get primary store

    console.log('Real store data from database for config:', mainStore)

    // Build config from real database data + environment variables
    const config = {
      businessName: mainStore?.name || process.env.CANNABIS_BUSINESS_NAME || '',
      businessLicense: mainStore?.metadata?.cannabis_license || process.env.CANNABIS_BUSINESS_LICENSE || '',
      businessState: mainStore?.metadata?.business_state || process.env.CANNABIS_BUSINESS_STATE || '',
      businessType: mainStore?.metadata?.business_type || process.env.CANNABIS_BUSINESS_TYPE || 'retail',
      complianceEmail: mainStore?.metadata?.compliance_email || process.env.CANNABIS_COMPLIANCE_EMAIL || '',
      maxOrderValue: parseInt(mainStore?.metadata?.max_order_value || process.env.CANNABIS_MAX_ORDER_VALUE || '1000'),
      requiresAgeVerification: (mainStore?.metadata?.age_verification || process.env.PAYMENT_MIN_AGE_VERIFICATION) === 'true',
      coaRequired: (mainStore?.metadata?.coa_required || 'true') === 'true',
      paymentProcessor: mainStore?.metadata?.payment_processor || 'authorizenet',
      notificationSettings: {
        orderAlerts: (mainStore?.metadata?.order_alerts || 'true') === 'true',
        complianceAlerts: (mainStore?.metadata?.compliance_alerts || 'true') === 'true',
        lowStockAlerts: (mainStore?.metadata?.low_stock_alerts || 'true') === 'true'
      }
    }

    console.log('Real cannabis configuration from database:', config)
    res.json(config)
  } catch (error) {
    console.error('Error fetching cannabis configuration from database:', error)
    res.status(500).json({ error: 'Failed to fetch configuration from database' })
  }
}

export const POST = async (
  req: Request & { scope: any },
  res: Response
) => {
  try {
    const config = req.body
    console.log('Saving real cannabis configuration to database:', config)

    // ✅ Use Real Medusa v2 Store Service to Save Configuration
    const { Modules } = await import("@medusajs/utils")
    const storeService = req.scope.resolve(Modules.STORE)

    // Get the primary store and update its metadata with cannabis config
    const stores = await storeService.listStores()
    const mainStore = stores[0]

    if (mainStore) {
      // Update store metadata with cannabis configuration
      await storeService.updateStores(mainStore.id, {
        name: config.businessName || mainStore.name,
        metadata: {
          ...mainStore.metadata,
          cannabis_license: config.businessLicense,
          business_state: config.businessState,
          business_type: config.businessType,
          compliance_email: config.complianceEmail,
          max_order_value: config.maxOrderValue.toString(),
          age_verification: config.requiresAgeVerification.toString(),
          coa_required: config.coaRequired.toString(),
          payment_processor: config.paymentProcessor,
          order_alerts: config.notificationSettings.orderAlerts.toString(),
          compliance_alerts: config.notificationSettings.complianceAlerts.toString(),
          low_stock_alerts: config.notificationSettings.lowStockAlerts.toString(),
          updated_at: new Date().toISOString()
        }
      })

      console.log('✅ Configuration saved to database successfully')
      res.json({ success: true, message: 'Configuration saved to database successfully' })
    } else {
      res.status(404).json({ error: 'No store found to update' })
    }
  } catch (error) {
    console.error('Error saving cannabis configuration to database:', error)
    res.status(500).json({ error: 'Failed to save configuration to database' })
  }
}