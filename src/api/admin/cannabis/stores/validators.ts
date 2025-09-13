// Cannabis Store Management Validators - Official Medusa v2 Pattern
// Reference: https://docs.medusajs.com/learn/customization/custom-features/api-route

import { z } from "zod"

export const PatchAdminStoreStatus = z.object({
  isActive: z.boolean()
})