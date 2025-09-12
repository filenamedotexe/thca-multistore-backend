const { defineConfig, Modules } = require("@medusajs/framework/utils")

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    http: {
      storeCors: process.env.STORE_CORS,
      adminCors: process.env.ADMIN_CORS,
      authCors: process.env.STORE_CORS,
      jwtSecret: process.env.JWT_SECRET,
      cookieSecret: process.env.COOKIE_SECRET,
    },
    workerMode: "server",
  },
  admin: {
    disable: false,
    path: "/app",
  },
  modules: [
    {
      resolve: "@medusajs/cache-inmemory",
      key: Modules.CACHE,
      options: {
        ttl: parseInt(process.env.CACHE_TTL || "30"),
        max: parseInt(process.env.CACHE_MAX_ITEMS || "1000"),
      },
    },
    {
      resolve: "@medusajs/medusa/event-bus-local",
      key: Modules.EVENT_BUS,
    },
    {
      resolve: "@medusajs/medusa/workflow-engine-inmemory", 
      key: Modules.WORKFLOW_ENGINE,
    },
  ],
})