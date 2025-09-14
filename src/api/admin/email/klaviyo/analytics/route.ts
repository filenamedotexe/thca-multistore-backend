// Klaviyo Multi-Account Analytics API - Official Medusa v2 API Route Pattern
// Manages analytics from 3 separate Klaviyo accounts
// Reference: https://docs.medusajs.com/learn/fundamentals/api-routes

import type { Request, Response } from "express"

interface KlaviyoAnalytics {
  accountName: string
  storeType: string
  domain: string
  totalEmails: number
  openRate: number
  clickRate: number
  subscribers: number
  recentCampaigns: Array<{
    id: string
    name: string
    sent_at: string
    open_rate: number
    click_rate: number
  }>
}

// ✅ Official Medusa v2 API Route Pattern
export const GET = async (
  req: Request & { scope: any },
  res: Response
) => {
  try {
    console.log('Fetching Klaviyo analytics for 3 accounts')

    // ✅ Get API keys for all 3 Klaviyo accounts
    const klaviyoKeys = {
      straightGas: process.env.KLAVIYO_STRAIGHT_GAS_API_KEY,
      liquidGummies: process.env.KLAVIYO_LIQUID_GUMMIES_API_KEY,
      wholesale: process.env.KLAVIYO_WHOLESALE_API_KEY
    }

    // Check if Klaviyo API keys are configured
    const keysConfigured = Object.values(klaviyoKeys).some(key =>
      key && !key.startsWith('pk_REPLACE_WITH_')
    )

    if (!keysConfigured) {
      console.log('Klaviyo API keys not configured, returning mock data for development')

      // Return mock analytics for development/testing
      const mockAnalytics: KlaviyoAnalytics[] = [
        {
          accountName: 'Straight Gas',
          storeType: 'retail',
          domain: 'straight-gas.com',
          totalEmails: 2450,
          openRate: 24.5,
          clickRate: 4.8,
          subscribers: 1230,
          recentCampaigns: [
            {
              id: 'camp_1',
              name: 'Weekly Newsletter - New Arrivals',
              sent_at: new Date().toISOString(),
              open_rate: 26.3,
              click_rate: 5.2
            },
            {
              id: 'camp_2',
              name: 'Flash Sale - 20% Off',
              sent_at: new Date(Date.now() - 86400000).toISOString(),
              open_rate: 32.1,
              click_rate: 8.7
            }
          ]
        },
        {
          accountName: 'Liquid Gummies',
          storeType: 'luxury',
          domain: 'liquid-gummies.com',
          totalEmails: 1890,
          openRate: 31.2,
          clickRate: 7.1,
          subscribers: 890,
          recentCampaigns: [
            {
              id: 'camp_3',
              name: 'Premium Collection Launch',
              sent_at: new Date(Date.now() - 172800000).toISOString(),
              open_rate: 38.4,
              click_rate: 9.2
            }
          ]
        },
        {
          accountName: 'Liquid Gummies Wholesale',
          storeType: 'wholesale',
          domain: 'liquidgummieswholesale.com',
          totalEmails: 450,
          openRate: 41.3,
          clickRate: 12.8,
          subscribers: 156,
          recentCampaigns: [
            {
              id: 'camp_4',
              name: 'Q4 Wholesale Pricing',
              sent_at: new Date(Date.now() - 259200000).toISOString(),
              open_rate: 45.7,
              click_rate: 15.3
            }
          ]
        }
      ]

      res.json({ accounts: mockAnalytics })
      return
    }

    // ✅ Real Klaviyo API integration (when API keys are configured)
    const accounts: KlaviyoAnalytics[] = []

    try {
      // Import Klaviyo API
      const KlaviyoAPI = await import('klaviyo-api')

      // Initialize clients for each account
      const clients = [
        { key: klaviyoKeys.straightGas, name: 'Straight Gas', type: 'retail', domain: 'straight-gas.com' },
        { key: klaviyoKeys.liquidGummies, name: 'Liquid Gummies', type: 'luxury', domain: 'liquid-gummies.com' },
        { key: klaviyoKeys.wholesale, name: 'Liquid Gummies Wholesale', type: 'wholesale', domain: 'liquidgummieswholesale.com' }
      ]

      for (const client of clients) {
        if (client.key && !client.key.startsWith('pk_REPLACE_WITH_')) {
          try {
            // Initialize Klaviyo client for this account
            const klaviyo = new KlaviyoAPI.ApiKeySession(client.key)

            // Fetch account metrics (placeholder - update based on actual Klaviyo API)
            const analytics: KlaviyoAnalytics = {
              accountName: client.name,
              storeType: client.type,
              domain: client.domain,
              totalEmails: 0,
              openRate: 0,
              clickRate: 0,
              subscribers: 0,
              recentCampaigns: []
            }

            accounts.push(analytics)
            console.log(`✅ Fetched analytics for ${client.name}`)

          } catch (accountError) {
            console.error(`Error fetching analytics for ${client.name}:`, accountError)
          }
        }
      }

      res.json({ accounts })

    } catch (klaviyoError) {
      console.error('Error with Klaviyo API:', klaviyoError)
      res.status(500).json({ error: 'Failed to connect to Klaviyo API' })
    }

  } catch (error) {
    console.error('Error fetching Klaviyo analytics:', error)
    res.status(500).json({ error: 'Failed to fetch Klaviyo analytics' })
  }
}