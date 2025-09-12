import { Modules } from "@medusajs/utils"

export default async function setupRegions({ container }) {
  const regionModule = container.resolve(Modules.REGION)
  
  console.log("🌍 Setting up regions...")
  
  try {
    // Check if regions already exist
    const existingRegions = await regionModule.listRegions()
    if (existingRegions.length > 0) {
      console.log(`✅ Found ${existingRegions.length} existing regions:`)
      existingRegions.forEach(region => {
        console.log(`   - ${region.name} (${region.currency_code})`)
      })
      return
    }

    // Create US region
    const usRegion = await regionModule.createRegions({
      name: "United States",
      currency_code: "usd",
      countries: ["us"],
      metadata: {
        tax_rate: 0.08,
        cannabis_legal: true
      }
    })
    
    console.log(`✅ Created US region: ${usRegion.name} (${usRegion.currency_code})`)
    
    // Create Canada region  
    const caRegion = await regionModule.createRegions({
      name: "Canada",
      currency_code: "cad", 
      countries: ["ca"],
      metadata: {
        tax_rate: 0.12,
        cannabis_legal: true
      }
    })
    
    console.log(`✅ Created Canada region: ${caRegion.name} (${caRegion.currency_code})`)
    
    console.log("🎉 Regions setup complete!")
    
  } catch (error) {
    console.error("❌ Error setting up regions:", error)
    throw error
  }
}

module.exports.default = setupRegions