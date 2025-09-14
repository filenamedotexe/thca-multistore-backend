import { defineConfig } from "@medusajs/framework/utils"

export default defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    http: {
      storeCors: process.env.STORE_CORS!.split(','),
      adminCors: process.env.ADMIN_CORS!.split(','),
      authCors: process.env.STORE_CORS!.split(','),
      jwtSecret: process.env.JWT_SECRET!,
      cookieSecret: process.env.COOKIE_SECRET!,
    },
    workerMode: "server" as const,
  },
  admin: {
    disable: false,
    path: "/admin",
  },
  modules: [
    // Cache module (simple in-memory for development)
    {
      resolve: "@medusajs/medusa/cache-inmemory",
      options: {
        ttl: 30,
        max: 1000,
      },
    },
    
    // Event bus (simple local for development)
    {
      resolve: "@medusajs/medusa/event-bus-local",
    },
    
    // Workflow engine (simple in-memory)
    {
      resolve: "@medusajs/medusa/workflow-engine-inmemory",
    },
    
    // File storage for product images and lab reports
    {
      resolve: "@medusajs/file",
      options: {
        providers: [
          {
            resolve: "@medusajs/file-local",
            id: "local",
            options: {
              upload_dir: "uploads",
            },
          },
          ...(process.env.BLOB_READ_WRITE_TOKEN ? [
            {
              resolve: "@medusajs/file-vercel-blob",
              id: "vercel-blob",
              options: {
                token: process.env.BLOB_READ_WRITE_TOKEN,
              },
            }
          ] : []),
        ],
      },
    },
    
    // Payment processing (cannabis-compliant setup)
    {
      resolve: "@medusajs/medusa/payment",
      options: {
        providers: [
          // Stripe (backup - may restrict cannabis)
          {
            resolve: "@medusajs/medusa-payment-stripe",
            id: "stripe",
            options: {
              apiKey: process.env.STRIPE_SECRET_KEY,
              webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
              capture: true,
              automatic_payment_methods: true,
              metadata: {
                cannabis_approved: false,
                use_for: "non_cannabis_items_only"
              }
            },
          },
          
          // Authorize.Net (primary - cannabis approved)
          ...(process.env.AUTHNET_LOGIN_ID ? [
            {
              resolve: "medusa-payment-authorizenet",
              id: "authorizenet",
              options: {
                apiLoginId: process.env.AUTHNET_LOGIN_ID,
                transactionKey: process.env.AUTHNET_TRANSACTION_KEY,
                environment: process.env.AUTHNET_ENVIRONMENT || "sandbox",
                acceptHosted: true,
                metadata: {
                  cannabis_approved: true,
                  use_for: "cannabis_products",
                  compliance_verified: true
                }
              },
            }
          ] : []),
        ],
      },
    },

    // ✅ Official Medusa v2 Notification Module with Resend Provider
    {
      resolve: "@medusajs/medusa/notification",
      options: {
        providers: [
          {
            resolve: "./src/modules/resend",
            id: "resend",
            options: {
              channels: ["email"],
              api_key: process.env.RESEND_API_KEY || "re_placeholder_key",
              from: process.env.RESEND_FROM_EMAIL || "noreply@localhost.com",
            },
          },
        ],
      },
    },
  ],
})