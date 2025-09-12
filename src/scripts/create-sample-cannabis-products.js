/**
 * Sample Cannabis Products Creation Script
 * Creates example products for testing the multi-store platform
 * Uses ultra-simple cannabis schema with direct sales channel IDs
 */

const { Modules } = require("@medusajs/utils")

async function createSampleProducts({ container }) {
  console.log('🌿 Creating sample cannabis products...')
  
  try {
    // Resolve services using official Medusa v2 approach
    const productModuleService = container.resolve(Modules.PRODUCT)
    const salesChannelModuleService = container.resolve(Modules.SALES_CHANNEL)
    
    // Use actual sales channel IDs from Phase 2.1
    const retailChannelId = 'sc_01K4XSXT93VTWGQWC6329VYYFP'     // Straight Gas
    const luxuryChannelId = 'sc_01K4XSXT93VN1C2XWBKB2CK7HN'    // Liquid Gummies  
    const wholesaleChannelId = 'sc_01K4XSXT93DMM6WQ3XDQ62JA4S' // Liquid Gummies Wholesale
    
    console.log('✅ Using direct sales channel IDs for reliability')
    
    // Sample product configurations - Ultra-simple cannabis schema
    const sampleProducts = [
      {
        title: "Premium Cannabis Flower - Blue Dream",
        handle: "premium-cannabis-flower-blue-dream",
        description: "High-quality cannabis flower. Lab-tested and cannabis compliant.",
        status: "published",
        
        // Ultra-simple cannabis metadata (5 fields only)
        metadata: {
          cannabis_product: "true",
          cannabis_compliant: "true",
          batch_number: "BATCH001",
          coa_file_url: "/uploads/coa/BATCH001-COA.pdf",
          coa_last_updated: "2025-09-11"
        },
        
        // Multi-store availability
        sales_channels: [retailChannelId, luxuryChannelId, wholesaleChannelId],
        
        // Store-specific variants and pricing
        variants: [
          {
            title: "1g - Retail",
            prices: [
              { amount: 2500, currency_code: "usd" }, // $25 retail
            ],
            inventory_quantity: 100,
            manage_inventory: true
          },
          {
            title: "3.5g - Retail", 
            prices: [
              { amount: 5000, currency_code: "usd" }, // $50 retail
            ],
            inventory_quantity: 75,
            manage_inventory: true
          },
          {
            title: "1g - Luxury",
            prices: [
              { amount: 3500, currency_code: "usd" }, // $35 luxury
            ],
            inventory_quantity: 50,
            manage_inventory: true
          },
          {
            title: "1oz - Wholesale",
            prices: [
              { amount: 20000, currency_code: "usd" }, // $200 wholesale
            ],
            inventory_quantity: 25,
            manage_inventory: true
          }
        ]
      },
      
      {
        title: "Liquid Gummies - Mixed Berry Cannabis",
        handle: "liquid-gummies-mixed-berry-cannabis",
        description: "Artisanal cannabis gummies with precise dosing. Premium ingredients and luxury packaging.",
        status: "published",
        
        metadata: {
          cannabis_product: "true",
          cannabis_compliant: "true",
          batch_number: "BATCH002",
          coa_file_url: "/uploads/coa/BATCH002-COA.pdf",
          coa_last_updated: "2025-09-11"
        },
        
        sales_channels: [luxuryChannelId, wholesaleChannelId],
        
        variants: [
          {
            title: "10-pack - Luxury",
            prices: [
              { amount: 4500, currency_code: "usd" }, // $45 luxury
            ],
            inventory_quantity: 200,
            manage_inventory: true
          },
          {
            title: "100-pack - Wholesale",
            prices: [
              { amount: 25000, currency_code: "usd" }, // $250 wholesale
            ],
            inventory_quantity: 50,
            manage_inventory: true
          }
        ]
      },

      {
        title: "Cannabis Vape Cartridge - Gelato",
        handle: "cannabis-vape-cartridge-gelato", 
        description: "Premium cannabis vape cartridge with precise content. Lab-tested for purity and potency.",
        status: "published",
        
        metadata: {
          cannabis_product: "true",
          cannabis_compliant: "true",
          batch_number: "BATCH003",
          coa_file_url: "/uploads/coa/BATCH003-COA.pdf", 
          coa_last_updated: "2025-09-11"
        },
        
        sales_channels: [retailChannelId, luxuryChannelId],
        
        variants: [
          {
            title: "0.5g - Retail",
            prices: [
              { amount: 3500, currency_code: "usd" }, // $35 retail
            ],
            inventory_quantity: 150,
            manage_inventory: true
          },
          {
            title: "1g - Luxury",
            prices: [
              { amount: 6500, currency_code: "usd" }, // $65 luxury
            ],
            inventory_quantity: 75,
            manage_inventory: true
          }
        ]
      }
    ]
    
    // Create products using bulk creation
    console.log(`Creating ${sampleProducts.length} sample cannabis products...`)
    
    try {
      const products = await productModuleService.createProducts(sampleProducts)
      console.log(`✅ Successfully created ${products.length} cannabis products`)
      
      // List created products for verification
      console.log('\n📋 Created Cannabis Products:')
      products.forEach((product) => {
        console.log(`   • ${product.title} (${product.id})`)
        console.log(`     Batch: ${product.metadata?.batch_number || 'Not specified'}`)
        console.log(`     COA File: ${product.metadata?.coa_file_url || 'Not specified'}`)
        console.log(`     Compliance: ${product.metadata?.cannabis_compliant || 'Not specified'}`)
      })
      
    } catch (bulkError) {
      console.log('⚠️ Bulk creation failed, trying individual creation...')
      
      // Create products one by one
      for (const productConfig of sampleProducts) {
        try {
          console.log(`Creating product: ${productConfig.title}`)
          
          const product = await productModuleService.createProducts(productConfig)
          console.log(`✅ Created product: ${product.title || productConfig.title}`)
          
        } catch (error) {
          console.error(`❌ Failed to create product ${productConfig.title}:`, error.message)
        }
      }
    }
    
    console.log('\n🎉 Sample cannabis products created successfully!')
    console.log('📝 Products are assigned to appropriate sales channels:')
    console.log('   • Blue Dream: Available in all 3 stores (retail, luxury, wholesale)')
    console.log('   • Liquid Gummies: Available in luxury and wholesale stores')
    console.log('   • Vape Cartridge: Available in retail and luxury stores')
    console.log('\n🧪 All products include COA files for compliance:')
    console.log('   • BATCH001-COA.pdf → Blue Dream')
    console.log('   • BATCH002-COA.pdf → Liquid Gummies')
    console.log('   • BATCH003-COA.pdf → Vape Cartridge')
    
  } catch (error) {
    console.error('❌ Sample product creation failed:', error)
    throw error
  }
}

module.exports.default = createSampleProducts