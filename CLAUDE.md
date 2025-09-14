# CLAUDE.md - Medusa v2 Development Guide

## Project: THCA Multi-Store Cannabis Platform Backend

### Medusa v2 Configuration (Official Documentation)

#### Admin Configuration
- **Admin UI Path**: `/app` (default in v2) - where you access the dashboard
- **API Routes Path**: `/admin` - where all API routes are available
- **Current Config**: Admin UI at http://localhost:9000/app
- **API Endpoints**: Available at http://localhost:9000/admin/*

#### Sales Channel Module (Official v2 API)
- **Service Resolution**: `container.resolve(Modules.SALES_CHANNEL)`
- **Create Method**: `createSalesChannels(data)` - supports single object or array
- **Module Import**: `import { Modules } from "@medusajs/utils"`

#### CLI Script Execution
- **Format**: Must have `module.exports.default = functionName` for `medusa exec`
- **Container**: Passed as `{ container }` parameter
- **Location**: `src/scripts/` directory

#### Current Setup Status
✅ Backend running on port 9000  
✅ Admin user: admin@thca.com / admin123  
✅ Admin UI: http://localhost:9000/app  
✅ API Base: http://localhost:9000/admin  
✅ Sales Channels: 3 channels created successfully  
✅ Publishable API Keys: 3 keys created for store authentication  

#### Sales Channel Configuration
```javascript
// 3 Store Setup
const storeConfigs = [
  {
    name: "Straight Gas",
    description: "Premium retail cannabis store",
    metadata: { store_type: "retail", domain: "straight-gas.com" }
  },
  {
    name: "Liquid Gummies", 
    description: "Luxury cannabis edibles",
    metadata: { store_type: "luxury", domain: "liquid-gummies.com" }
  },
  {
    name: "Liquid Gummies Wholesale",
    description: "B2B wholesale platform",
    metadata: { store_type: "wholesale", domain: "liquidgummieswholesale.com" }
  }
]
```

#### Publishable API Keys (Created)
- **Straight Gas**: `pk_42116bf0f1936e5f902b5a14f9ffdacd497bc13bf1ab65b9bbe3a3095358e2d6`
- **Liquid Gummies**: `pk_5230313e5fab407bf9e503711015d0b170249f21597854282c268648b3fd2331`
- **Wholesale**: `pk_5ea8c0a81c4efb7ee2d75b1be0597ca03a37ffff464c00a992028bde15e320c1`
- **Keys saved**: `cannabis-api-keys.txt`

#### Store Environment Configuration (Updated)
- **Straight Gas**: Port 3000, Key: `pk_4211...e2d6`
- **Liquid Gummies**: Port 3001, Key: `pk_5230...2331`  
- **Wholesale**: Port 3002, Key: `pk_5ea8...20c1`
- **All stores**: Backend URL `http://localhost:9000`

#### Cannabis Metadata Schema (2.2.1 Complete)
- **Schema file**: `cannabis-metadata-schema.md` (4.8KB)
- **Compliance**: 2025 Farm Bill current + proposed standards
- **THC formulas**: Delta-9 only + THCA inclusion ready
- **Features**: Lab reports, terpenes, warnings, wholesale tiers
- **Validation**: Built-in compliance checking logic

#### Cannabis Validation Functions (2.2.2 Complete - Ultra-Simple)
- **Validation file**: `src/utils/cannabis/validation.ts` (2.8KB)
- **Approach**: Compliant yes/no (default yes) - zero complexity
- **Interface**: All downstream phases compatible (ValidationResult, etc.)
- **Logic**: `cannabis_compliant !== "false"` (default true)
- **Benefits**: High value, low complexity, no over-engineering

#### Cannabis Payment Processing (2.3 Complete)
- **Config file**: `medusa-config.ts` (3.0KB) - TypeScript configuration
- **Authorize.Net**: `medusa-payment-authorizenet@0.0.1` installed (cannabis-approved)
- **Stripe**: Configuration placeholder (restricted for cannabis)
- **File storage**: Local + Vercel Blob support for lab reports
- **Compliance**: Cannabis metadata in payment provider configs

#### Ultra-Simple COA System (2.4 Complete)
- **QR Package**: `qrcode@1.5.4` + `@types/qrcode@1.5.5` installed
- **COA Files**: `/uploads/coa/[BATCH]-COA.pdf` (direct PDF storage)
- **QR Codes**: `/uploads/qr-codes/[BATCH]-QR.png` (point to COA PDFs)
- **Metadata**: Added coa_file_url, coa_last_updated, coa_qr_code_url fields
- **Sample Files**: 3 batches created (BATCH001, BATCH002, BATCH003)
- **Access**: Direct file serving (no complex APIs)

#### Sample Cannabis Products (2.5.1 Complete)
- **Product scripts**: Created with ultra-simple 5-field schema
- **Sales channel integration**: Direct IDs (retail, luxury, wholesale)
- **COA file integration**: BATCH001-003 COA files + QR codes
- **Product examples**: Blue Dream, Liquid Gummies, Vape Cartridge
- **Creation method**: Admin UI ready (http://localhost:9000/app)
- **Authentication**: admin@thca.com / admin123

#### Cannabis Payment Configuration (2.6.1 Complete)
- **Environment vars**: Added 8 payment/compliance variables to .env
- **Authorize.Net**: Cannabis-approved primary processor (configured)
- **Stripe**: Cannabis-prohibited backup (non-cannabis items only)
- **Payment routing**: Primary→Authorize.Net, Fallback→Stripe
- **Compliance flags**: High-risk merchant, logging, age verification
- **Security**: Placeholder detection, validation script created
- **Package**: Added dotenv@17.2.2 for environment loading

### Current Implementation Status
✅ **Phase 2.1-2.6.1 COMPLETE**: Full backend configuration with cannabis support
✅ **Phase 3.6 COMPLETE**: Modern dashboard & CRM with real database integration
✅ **Phase 3.7.1-3.7.3 COMPLETE**: Master admin system & user roles with real APIs
✅ **Cannabis Admin UI**: 2 admin pages, 1 dashboard widget, 4 API endpoints
✅ **Real Database Integration**: All hardcoded data eliminated - production ready

#### Business Intelligence Admin Features (Live)
- **Admin Pages**: business-intelligence, email-operations (in sidebar)
- **Dashboard Widget**: Real metrics from database
- **API Endpoints**: business metrics, intelligence, store management, email operations
- **User Management**: Real database with cannabis metadata
- **Store Management**: Real sales channel operations

### Current Working URLs
- **Backend Admin**: http://localhost:9000/app
- **Business Intelligence**: http://localhost:9000/app/business-intelligence
- **Email Operations**: http://localhost:9000/app/email-operations
- **API Base**: http://localhost:9000/admin/business/* | http://localhost:9000/admin/email/*

#### API Key Module (Official v2 API)
- **Service Resolution**: `container.resolve(Modules.API_KEY)`
- **Create Method**: `createApiKeys({ title, type, created_by })`
- **Type**: `"publishable"` for storefront access

#### Cannabis Database Users (Current)
- **Admin Users**: 4 users with cannabis metadata in database
- **Authentication**: Real user credentials (its.zach.w@gmail.com, admin@thca.com, etc.)
- **Roles**: master_admin, store_manager with proper permissions
- **Test Data**: Cannabis metadata added via src/scripts/setup-cannabis-test-data.ts

#### Real Database Operations (Working)
- **Customer Management**: Real CUSTOMER service integration
- **Order Analytics**: Real ORDER service calculations
- **Store Management**: Real SALES_CHANNEL service operations
- **User Management**: Real USER service with cannabis metadata
- **Configuration Storage**: Real STORE service metadata persistence

### Current APIs (Live)
- **GET /admin/business/metrics**: Real business metrics calculated from database
- **GET /admin/business/intelligence**: Business intelligence data and analytics
- **GET /admin/business/stores**: Real sales channels with API keys and store management
- **GET /admin/email/templates**: Email template management and operations
- **POST /admin/email/send**: Email sending operations with multi-domain support

### Common Errors & Solutions
1. **API Route Import**: Use `import type { Request, Response } from "express"`
2. **Service Resolution**: Use `req.scope.resolve(Modules.STORE)` pattern
3. **Admin Widget**: Use `@medusajs/admin-sdk` (not admin-shared)
4. **UI Routes**: Must export `defineRouteConfig` to appear in sidebar
5. **Database Updates**: Store custom data in metadata fields of existing entities