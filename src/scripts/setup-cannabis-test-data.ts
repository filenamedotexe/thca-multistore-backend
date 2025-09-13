// Setup Cannabis Test Data in Database
// Adds cannabis metadata to existing users for testing

import { Modules } from "@medusajs/utils"

async function setupCannabisTestData({ container }: { container: any }) {
  console.log("🌿 Setting up cannabis test data in database...")

  try {
    // Access Medusa services through container
    const userService = container.resolve(Modules.USER)
    const salesChannelService = container.resolve(Modules.SALES_CHANNEL)

    // Find existing users in database
    const users = await userService.listUsers()
    console.log(`Found ${users.length} users in database`)

    // Get real sales channels from database
    const salesChannels = await salesChannelService.listSalesChannels()
    console.log(`Found ${salesChannels.length} sales channels in database`)

    // Extract sales channel names for dynamic store access
    const storeNames = salesChannels.map((channel: any) => channel.name.toLowerCase().replace(/\s+/g, '-'))
    console.log(`Available stores: ${storeNames.join(', ')}`)

    // Add cannabis metadata to existing users
    for (const user of users) {
      console.log(`Adding cannabis metadata to user: ${user.email}`)

      const cannabisRole = user.email.includes('admin') ? 'master_admin' : 'store_manager'
      const storeAccess = cannabisRole === 'master_admin'
        ? storeNames // Master admin gets access to all stores from database
        : [storeNames[0] || 'default-store'] // Store manager gets first store or default

      await userService.updateUsers([{
        id: user.id,
        metadata: {
          ...user.metadata,
          cannabis_role: cannabisRole,
          store_access: storeAccess,
          can_view_reports: true,
          can_manage_products: true,
          can_process_orders: true,
          can_access_compliance: cannabisRole === 'master_admin',
          can_manage_users: cannabisRole === 'master_admin',
          last_login: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      }])

      console.log(`✅ Cannabis metadata added to ${user.email} as ${cannabisRole}`)
    }

    console.log("🎉 Cannabis test data setup complete!")
  } catch (error) {
    console.error("❌ Error setting up cannabis test data:", error)
    throw error
  }
}

module.exports.default = setupCannabisTestData