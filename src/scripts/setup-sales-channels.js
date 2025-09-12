/**
 * Sales Channel Setup for Cannabis Multi-Store Platform
 * Creates 3 separate sales channels for retail, luxury, and wholesale stores
 */

const { Modules, ContainerRegistrationKeys } = require("@medusajs/utils")

async function setupCannabisStores({ container }) {
  console.log('🏪 Setting up cannabis store sales channels...')
  
  try {
    // Resolve services using official Medusa v2 approach
    const salesChannelModuleService = container.resolve(Modules.SALES_CHANNEL)
    
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
    
    console.log('Creating sales channels for cannabis multi-store platform')
    
    // Create sales channels using the bulk create method
    try {
      const salesChannels = await salesChannelModuleService.createSalesChannels(storeConfigs)
      console.log(`✅ Successfully created ${salesChannels.length} sales channels`)
      
      // List created channels for verification
      console.log('\n📋 Created Sales Channels:')
      salesChannels.forEach((channel) => {
        console.log(`   • ${channel.name} (${channel.id})`)
        console.log(`     Type: ${channel.metadata?.store_type || 'unknown'}`)
        console.log(`     Domain: ${channel.metadata?.domain || 'not set'}`)
        console.log(`     Description: ${channel.description}`)
      })
      
      return salesChannels
    } catch (bulkError) {
      console.log('⚠️  Bulk creation failed, trying individual creation...')
      
      // Create sales channels one by one to handle existing ones gracefully
      const createdChannels = []
      for (const config of storeConfigs) {
        try {
          console.log(`Creating sales channel: ${config.name}`)
          const salesChannel = await salesChannelModuleService.createSalesChannels(config)
          createdChannels.push(salesChannel)
          console.log(`✅ Created: ${config.name} (${salesChannel.id})`)
        } catch (error) {
          console.log(`⚠️  Sales channel may already exist: ${config.name} - ${error.message}`)
        }
      }
      
      return createdChannels
    }
    
    
    console.log('\n🎯 Next step: Create publishable API keys for each store')
    
    return createdChannels
    
  } catch (error) {
    console.error('❌ Sales channel setup failed:', error)
    throw error
  }
}

module.exports.default = setupCannabisStores