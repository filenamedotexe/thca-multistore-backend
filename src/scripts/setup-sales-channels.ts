/**
 * Sales Channel Setup for Cannabis Multi-Store Platform
 * Creates 3 separate sales channels for retail, luxury, and wholesale stores
 */

import { ExecArgs } from "@medusajs/types"
import { Modules, ContainerRegistrationKeys } from "@medusajs/utils"

export default async function setupCannabisStores({ container }: ExecArgs) {
  console.log('🏪 Setting up cannabis store sales channels...')
  
  try {
    // Resolve services using official Medusa v2 approach
    const salesChannelModuleService = container.resolve(Modules.SALES_CHANNEL)
    const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
    
    // Define store configurations
    const storeConfigs = [
      {
        name: "Straight Gas",
        description: "Premium retail cannabis store for discerning consumers",
        is_disabled: false,
        metadata: {
          store_type: "retail",
          target_market: "b2c",
          domain: "straight-gas.com",
          cannabis_compliant: true,
          compliance_level: "standard"
        }
      },
      {
        name: "Liquid Gummies", 
        description: "Luxury cannabis edibles for the sophisticated market",
        is_disabled: false,
        metadata: {
          store_type: "luxury",
          target_market: "b2c",
          domain: "liquid-gummies.com",
          cannabis_compliant: true,
          compliance_level: "enhanced"
        }
      },
      {
        name: "Liquid Gummies Wholesale",
        description: "B2B wholesale cannabis platform for licensed retailers",
        is_disabled: false,
        metadata: {
          store_type: "wholesale",
          target_market: "b2b",
          domain: "liquidgummieswholesale.com",
          cannabis_compliant: true,
          compliance_level: "wholesale",
          minimum_order_value: 50000,
          requires_business_license: true
        }
      }
    ]
    
    logger.info('Creating sales channels for cannabis multi-store platform')
    
    // Create sales channels using the official Medusa v2 API
    const salesChannels = await salesChannelModuleService.createSalesChannels(storeConfigs)
    
    logger.info(`✅ Successfully created ${salesChannels.length} sales channels`)
    
    // List created channels for verification
    console.log('\n📋 Created Sales Channels:')
    salesChannels.forEach((channel: any) => {
      console.log(`   • ${channel.name} (${channel.id})`)
      console.log(`     Type: ${channel.metadata?.store_type || 'unknown'}`)
      console.log(`     Domain: ${channel.metadata?.domain || 'not set'}`)
      console.log(`     Description: ${channel.description}`)
    })
    
    // List all channels to see what we have
    const allChannels = await salesChannelModuleService.listSalesChannels()
    console.log(`\n📊 Total sales channels in system: ${allChannels.length}`)
    
    console.log('\n🎯 Next step: Create publishable API keys for each store')
    
    return salesChannels
    
  } catch (error: any) {
    console.error('❌ Sales channel setup failed:', error)
    throw error
  }
}