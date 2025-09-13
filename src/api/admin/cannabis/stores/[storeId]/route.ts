// Individual Store Management API - Official Medusa v2 API Route Pattern
// Reference: https://docs.medusajs.com/learn/fundamentals/api-routes

import type { Request, Response } from "express"

type PatchAdminStoreType = {
  isActive: boolean
}

// ✅ Official Medusa v2 API Route Pattern
export const PATCH = async (
  req: Request & { scope: any },
  res: Response
) => {
  try {
    const { storeId } = req.params
    const { isActive } = req.body

    console.log(`Updating store ${storeId} status to ${isActive ? 'active' : 'inactive'} in database`)

    // ✅ Use Real Medusa v2 Sales Channel Service to Update Store Status
    const { Modules } = await import("@medusajs/utils")
    const salesChannelService = req.scope.resolve(Modules.SALES_CHANNEL)

    // Update the sales channel in database
    await salesChannelService.updateSalesChannels(storeId, {
      is_disabled: !isActive,
      metadata: {
        last_updated: new Date().toISOString(),
        updated_by: 'cannabis_admin'
      }
    })

    console.log(`✅ Store ${storeId} ${isActive ? 'enabled' : 'disabled'} in database successfully`)
    res.json({ success: true, storeId, isActive, message: 'Store status updated in database' })
  } catch (error) {
    console.error('Error updating store in database:', error)
    res.status(500).json({ error: 'Failed to update store in database' })
  }
}