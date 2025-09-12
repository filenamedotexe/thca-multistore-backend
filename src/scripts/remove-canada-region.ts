import { Modules } from "@medusajs/utils"

export default async function removeCanadaRegion({ container }) {
  const regionModule = container.resolve(Modules.REGION)
  
  console.log("🗑️ Removing Canada region for single-region setup...")
  
  try {
    const regions = await regionModule.listRegions()
    console.log(`Found ${regions.length} regions:`)
    regions.forEach(region => {
      console.log(`   - ${region.name} (${region.currency_code})`)
    })
    
    const canadaRegion = regions.find(r => r.name === "Canada" || r.currency_code === "cad")
    
    if (canadaRegion) {
      await regionModule.deleteRegions([canadaRegion.id])
      console.log(`✅ Removed Canada region: ${canadaRegion.name}`)
    } else {
      console.log("ℹ️ Canada region not found")
    }
    
    const remainingRegions = await regionModule.listRegions()
    console.log(`✅ Single-region setup complete. Remaining regions: ${remainingRegions.length}`)
    remainingRegions.forEach(region => {
      console.log(`   - ${region.name} (${region.currency_code})`)
    })
    
  } catch (error) {
    console.error("❌ Error removing Canada region:", error)
    throw error
  }
}

module.exports.default = removeCanadaRegion