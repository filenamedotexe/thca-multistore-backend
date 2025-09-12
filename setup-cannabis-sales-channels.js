/**
 * Sales Channel Setup for Cannabis Multi-Store Platform
 * Creates 3 separate sales channels for retail, luxury, and wholesale stores
 */

const { MedusaApp } = require("@medusajs/framework")

async function setupCannabisStores() {
  console.log('🏪 Setting up cannabis store sales channels...')
  
  try {
    // Initialize Medusa app connection
    const app = await MedusaApp({
      directory: process.cwd(),
    })
    
    const container = app.getContainer()
    const salesChannelService = container.resolve("salesChannelService")
    
    // Define store configurations
    const storeConfigs = [
      {
        id: "sc_straight_gas",
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
        id: "sc_liquid_gummies",
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
        id: "sc_liquid_gummies_wholesale",
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
    
    // Create each sales channel
    for (const config of storeConfigs) {
      try {
        console.log(`Creating sales channel: ${config.name}`)
        
        const salesChannel = await salesChannelService.create(config)
        console.log(`✅ Created: ${config.name} (ID: ${salesChannel.id})`)
        
        // Store channel ID for later use
        process.env[`SALES_CHANNEL_${config.metadata.store_type.toUpperCase()}`] = salesChannel.id
        
      } catch (error) {
        if (error.message.includes('already exists') || error.code === '23505') {
          console.log(`⚠️  Sales channel already exists: ${config.name}`)
        } else {
          console.error(`❌ Failed to create ${config.name}:`, error.message)
          throw error
        }
      }
    }
    
    console.log('✅ All sales channels configured successfully!')
    
    // List created channels for verification
    const channels = await salesChannelService.list()
    console.log('\n📋 Available Sales Channels:')
    channels.forEach(channel => {
      console.log(`   • ${channel.name} (${channel.id})`)
      console.log(`     Type: ${channel.metadata?.store_type || 'unknown'}`)
      console.log(`     Domain: ${channel.metadata?.domain || 'not set'}`)
    })
    
  } catch (error) {
    console.error('❌ Sales channel setup failed:', error)
    process.exit(1)
  }
}

// Run setup
setupCannabisStores()
  .then(() => {
    console.log('\n🎯 Next step: Create publishable API keys for each store')
    process.exit(0)
  })
  .catch(error => {
    console.error('Setup failed:', error)
    process.exit(1)
  })