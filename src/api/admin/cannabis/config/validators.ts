// Cannabis Configuration Validators - Official Medusa v2 Pattern
// Reference: https://docs.medusajs.com/learn/customization/custom-features/api-route

import { z } from "zod"

export const PostAdminCannabisConfig = z.object({
  businessName: z.string(),
  businessLicense: z.string(),
  businessState: z.string(),
  businessType: z.enum(['retail', 'wholesale', 'manufacturing']),
  complianceEmail: z.string().email(),
  maxOrderValue: z.number().min(1).max(10000),
  requiresAgeVerification: z.boolean(),
  coaRequired: z.boolean(),
  paymentProcessor: z.enum(['authorizenet', 'stripe', 'paypal']),
  notificationSettings: z.object({
    orderAlerts: z.boolean(),
    complianceAlerts: z.boolean(),
    lowStockAlerts: z.boolean()
  })
})