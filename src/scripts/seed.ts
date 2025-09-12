import { ExecArgs } from "@medusajs/types"
import { 
  ContainerRegistrationKeys, 
  Modules,
} from "@medusajs/utils"

export default async function seedCannabisProducts({
  container,
}: ExecArgs) {
  const salesChannelModuleService = container.resolve(Modules.SALES_CHANNEL)
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)

  ;(logger as any).info("🌿 Creating sample cannabis products...")

  try {
    // Get our created sales channels
    const salesChannels = await (salesChannelModuleService as any).listSalesChannels()
    
    const retailChannel = salesChannels.find((sc: any) => sc.name === 'Straight Gas')
    const luxuryChannel = salesChannels.find((sc: any) => sc.name === 'Liquid Gummies') 
    const wholesaleChannel = salesChannels.find((sc: any) => sc.name === 'Liquid Gummies Wholesale')

    if (!retailChannel || !luxuryChannel || !wholesaleChannel) {
      ;(logger as any).error("Sales channels not found. Run setup-cannabis-sales-channels.js first.")
      throw new Error('Sales channels not found')
    }

    ;(logger as any).info(`Found sales channels: ${salesChannels.length} total`)

    // Cannabis products with ultra-simple metadata
    const cannabisProductsData = [
      {
        title: "Premium Cannabis Flower - Blue Dream",
        handle: "premium-cannabis-flower-blue-dream",
        description: "High-quality cannabis flower. Lab-tested and cannabis compliant.",
        status: "published" as const,
        sales_channels: [
          { id: retailChannel.id },
          { id: luxuryChannel.id },
          { id: wholesaleChannel.id }
        ],
        metadata: {
          cannabis_product: "true",
          cannabis_compliant: "true",
          batch_number: "BATCH001",
          coa_file_url: "/uploads/coa/BATCH001-COA.pdf",
          coa_last_updated: "2025-09-11"
        }
      },
      {
        title: "Liquid Gummies - Mixed Berry Cannabis",
        handle: "liquid-gummies-mixed-berry-cannabis", 
        description: "Artisanal cannabis gummies. Premium ingredients and luxury packaging.",
        status: "published" as const,
        sales_channels: [
          { id: luxuryChannel.id },
          { id: wholesaleChannel.id }
        ],
        metadata: {
          cannabis_product: "true",
          cannabis_compliant: "true", 
          batch_number: "BATCH002",
          coa_file_url: "/uploads/coa/BATCH002-COA.pdf",
          coa_last_updated: "2025-09-11"
        }
      },
      {
        title: "Cannabis Vape Cartridge - Gelato",
        handle: "cannabis-vape-cartridge-gelato",
        description: "Premium cannabis vape cartridge. Lab-tested for purity.",
        status: "published" as const,
        sales_channels: [
          { id: retailChannel.id },
          { id: luxuryChannel.id }
        ],
        metadata: {
          cannabis_product: "true",
          cannabis_compliant: "true",
          batch_number: "BATCH003", 
          coa_file_url: "/uploads/coa/BATCH003-COA.pdf",
          coa_last_updated: "2025-09-11"
        }
      }
    ]

    // Create products using direct module service approach (that works)
    const productModuleService = container.resolve(Modules.PRODUCT)
    const products = await (productModuleService as any).createProducts(cannabisProductsData)

    ;(logger as any).info(`✅ Successfully created ${products.length} cannabis products`)
    
    // Log created products
    products.forEach((product: any) => {
      ;(logger as any).info(`   • ${product.title} (${product.id})`)
      ;(logger as any).info(`     Batch: ${product.metadata?.batch_number}`)
      ;(logger as any).info(`     COA: ${product.metadata?.coa_file_url}`)
    })

    ;(logger as any).info("🎉 Cannabis products seeded successfully!")
    
    return products

  } catch (error: any) {
    ;(logger as any).error("❌ Cannabis product seeding failed:", error)
    throw error
  }
}