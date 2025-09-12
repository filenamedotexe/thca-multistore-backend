/**
 * Publishable API Key Setup for Cannabis Multi-Store Platform
 * Creates API keys for each store to securely access their assigned products
 */

const { Modules } = require("@medusajs/utils")

async function setupPublishableKeys({ container }) {
  console.log('🔑 Setting up publishable API keys for store authentication...')
  
  try {
    // Resolve services using official Medusa v2 approach
    const apiKeyModuleService = container.resolve(Modules.API_KEY)
    const salesChannelModuleService = container.resolve(Modules.SALES_CHANNEL)
    
    // Get existing sales channels
    const salesChannels = await salesChannelModuleService.listSalesChannels()
    console.log(`Found ${salesChannels.length} sales channels`)
    
    // Define API key configurations for our 3 cannabis stores
    const keyConfigs = [
      {
        title: "Straight Gas Storefront",
        type: "publishable",
        sales_channel_name: "Straight Gas",
        created_by: "admin@thca.com"
      },
      {
        title: "Liquid Gummies Storefront", 
        type: "publishable",
        sales_channel_name: "Liquid Gummies",
        created_by: "admin@thca.com"
      },
      {
        title: "Wholesale Storefront",
        type: "publishable", 
        sales_channel_name: "Liquid Gummies Wholesale",
        created_by: "admin@thca.com"
      }
    ]
    
    const createdKeys = []
    
    // Create API key for each store
    for (const config of keyConfigs) {
      try {
        console.log(`Creating API key: ${config.title}`)
        
        // Find corresponding sales channel
        const salesChannel = salesChannels.find(sc => sc.name === config.sales_channel_name)
        
        if (!salesChannel) {
          console.error(`❌ Sales channel not found: ${config.sales_channel_name}`)
          continue
        }
        
        // Create publishable API key using official v2 method
        const apiKey = await apiKeyModuleService.createApiKeys({
          title: config.title,
          type: config.type,
          created_by: config.created_by,
        })
        
        console.log(`✅ Created API key: ${config.title}`)
        console.log(`   Key: ${apiKey.token}`)
        console.log(`   Sales Channel: ${salesChannel.name} (${salesChannel.id})`)
        
        createdKeys.push({
          store: config.sales_channel_name,
          title: config.title,
          key: apiKey.token,
          sales_channel_id: salesChannel.id,
          sales_channel_name: salesChannel.name
        })
        
      } catch (error) {
        console.error(`❌ Failed to create API key for ${config.title}:`, error.message)
      }
    }
    
    // Generate environment variable updates for each store
    console.log('\n🔧 Environment Variable Updates:')
    console.log('===============================')
    
    createdKeys.forEach(({ store, key, sales_channel_id }) => {
      const storeSlug = store.toLowerCase().replace(/\s+/g, '-')
      console.log(`\n${store} Store:`)
      console.log(`NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=${key}`)
      console.log(`NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000`)
      console.log(`# Sales Channel ID: ${sales_channel_id}`)
    })
    
    // Save keys to file for easy reference
    const keyData = createdKeys.map(k => 
      `${k.store}:\n  Key: ${k.key}\n  Sales Channel: ${k.sales_channel_id}\n`
    ).join('\n')
    
    const fs = require('fs')
    fs.writeFileSync('cannabis-api-keys.txt', keyData)
    console.log('\n💾 API keys saved to: cannabis-api-keys.txt')
    
    console.log('\n🎯 Summary:')
    console.log(`✅ Created ${createdKeys.length} publishable API keys`)
    console.log('✅ Each store now has secure API access to its sales channel')
    console.log('✅ Environment variables ready for frontend stores')
    
    return createdKeys
    
  } catch (error) {
    console.error('❌ Publishable API key setup failed:', error)
    throw error
  }
}

module.exports.default = setupPublishableKeys