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

### Next Steps
✅ **Phase 2.1 COMPLETE**: Sales channels + API keys + environment files  
✅ **Phase 2.2.1 COMPLETE**: Cannabis metadata schema defined  
✅ **Phase 2.2.2 COMPLETE**: Cannabis product validation functions (ultra-simple)  
✅ **Phase 2.3 COMPLETE**: Payment processing configuration (cannabis-compliant)  
✅ **Phase 2.4 COMPLETE**: COA file system (ultra-simple, file-based)  
⏳ **Phase 2.5**: Create sample cannabis products  
- Document all working patterns here

#### API Key Module (Official v2 API)
- **Service Resolution**: `container.resolve(Modules.API_KEY)`
- **Create Method**: `createApiKeys({ title, type, created_by })`
- **Type**: `"publishable"` for storefront access

### Common Errors & Solutions
1. **TypeScript Import Errors**: Use `@medusajs/utils` and `@medusajs/types` (not framework paths)
2. **Method Not Found**: Check official service definitions in node_modules/@medusajs/
3. **Export Issues**: Use `module.exports.default = functionName` for CLI scripts
4. **Sales Channel Methods**: Use `createSalesChannels()` and `listSalesChannels()` (plural forms)