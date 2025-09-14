// Cannabis Store Management API - Official Medusa v2 API Route Pattern
// Reference: https://docs.medusajs.com/learn/fundamentals/api-routes

import type { Request, Response } from "express"

interface StoreConfig {
  storeId: string
  storeName: string
  storeType: 'retail' | 'luxury' | 'wholesale'
  isActive: boolean
  domain: string
  publicKey: string
}

// ✅ Official Medusa v2 API Route Pattern
export const GET = async (
  req: Request & { scope: any },
  res: Response
) => {
  try {
    // ✅ Use Real Medusa v2 Sales Channel API
    const { Modules } = await import("@medusajs/utils")
    const salesChannelService = req.scope.resolve(Modules.SALES_CHANNEL)
    const apiKeyService = req.scope.resolve(Modules.API_KEY)

    // Fetch real sales channels from database using correct v2 methods
    const salesChannels = await salesChannelService.listSalesChannels({}, { take: 100 })
    console.log('Real sales channels from database:', salesChannels)

    // Fetch real API keys from database using correct v2 methods
    const apiKeys = await apiKeyService.listApiKeys({ type: "publishable" }, { take: 100 })
    console.log('Real API keys from database:', apiKeys)

    // Transform to our store format using real database data with improved key matching
    const stores: StoreConfig[] = salesChannels.map((channel: any) => {
      // More flexible API key matching logic
      const apiKey = apiKeys.find((key: any) => {
        if (!key.title) return false
        const keyTitle = key.title.toLowerCase()
        const channelName = channel.name?.toLowerCase() || ''

        // Direct match or contains match
        return keyTitle.includes(channelName) ||
               channelName.includes(keyTitle) ||
               keyTitle.includes(channel.metadata?.store_type || '')
      })

      return {
        storeId: channel.id,
        storeName: channel.name,
        storeType: channel.metadata?.store_type || 'retail',
        isActive: !channel.is_disabled,
        domain: channel.metadata?.domain || 'localhost',
        publicKey: apiKey?.token || 'No API key found'
      }
    })

    console.log('Real transformed store data:', stores)
    res.json(stores)
  } catch (error) {
    console.error('Error fetching stores from database:', error)
    res.status(500).json({ error: 'Failed to fetch stores from database' })
  }
}