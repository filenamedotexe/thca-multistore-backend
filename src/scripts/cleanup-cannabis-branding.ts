// Clean up cannabis branding from database while preserving operational data
import { Modules } from "@medusajs/utils"

async function cleanupCannabisBranding({ container }: { container: any }) {
  console.log("🧹 Cleaning up cannabis branding from database...")

  try {
    const userService = container.resolve(Modules.USER)
    const users = await userService.listUsers()

    for (const user of users) {
      // Remove cannabis-specific metadata, keep operational metadata
      const cleanMetadata = {
        // Keep useful operational data
        last_login: user.metadata?.last_login,
        updated_at: user.metadata?.updated_at,
        created_at: user.metadata?.created_at,
        // Remove cannabis-specific fields
        // cannabis_role, store_access, can_* permissions removed
      }

      await userService.updateUsers([{
        id: user.id,
        metadata: cleanMetadata
      }])

      console.log(`✅ Cleaned branding from user: ${user.email}`)
    }

    console.log("🎉 Cannabis branding cleanup complete!")
  } catch (error) {
    console.error("❌ Error cleaning up branding:", error)
    throw error
  }
}

module.exports.default = cleanupCannabisBranding