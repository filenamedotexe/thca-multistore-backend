# THCA Multi-Store Cannabis Platform Backend

A production-ready **Medusa v2** backend powering a multi-store cannabis e-commerce platform with business intelligence, email operations, and compliance features.

## 🏪 **Multi-Store Architecture**

Three independent storefronts sharing one backend:

| Store | Type | Domain | Port | API Key |
|-------|------|---------|------|---------|
| **Straight Gas** | Premium Retail | straight-gas.com | 3000 | `pk_4211...e2d6` |
| **Liquid Gummies** | Luxury Edibles | liquid-gummies.com | 3001 | `pk_5230...2331` |
| **Wholesale** | B2B Platform | liquidgummieswholesale.com | 3002 | `pk_5ea8...20c1` |

## 🚀 **Quick Start**

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Installation

```bash
# Clone and install
git clone <repository-url>
cd thca-multistore-backend
npm install

# Environment setup
cp .env.example .env  # Configure your environment

# Database setup
createdb medusa_thca_dev
npm run dev  # Starts on http://localhost:9000
```

### Admin Access
- **URL**: http://localhost:9000/app
- **Credentials**: admin@thca.com / admin123
- **Business Intelligence**: http://localhost:9000/app/business-intelligence
- **Email Operations**: http://localhost:9000/app/email-operations

## 📊 **Key Features**

### ✅ **Business Intelligence Dashboard**
- Real-time metrics from database
- Multi-store analytics
- Sales channel management
- User role management (master_admin, store_manager)

### ✅ **Email Operations Center**
- Multi-domain email sending (Resend integration)
- Template management system
- Klaviyo integration ready
- Automated workflow capabilities

### ✅ **Cannabis Compliance System**
- THC/THCA metadata validation
- COA (Certificate of Analysis) management
- QR code generation for lab reports
- Age verification & compliance tracking

### ✅ **Payment Processing**
- **Primary**: Authorize.Net (cannabis-approved)
- **Fallback**: Stripe (non-cannabis items)
- High-risk merchant support
- Compliance logging

### ✅ **File Management**
- Local file storage for development
- Vercel Blob integration ready
- COA PDF storage (`/uploads/coa/`)
- QR code generation (`/uploads/qr-codes/`)

## 🔧 **Configuration**

### Environment Variables

```env
# Database
DATABASE_URL=postgresql://localhost:5432/medusa_thca_dev

# Security
JWT_SECRET=your-jwt-secret
COOKIE_SECRET=your-cookie-secret

# CORS (3 store setup)
STORE_CORS=http://localhost:3000,http://localhost:3001,http://localhost:3002
ADMIN_CORS=http://localhost:9000

# Payment Processing
STRIPE_SECRET_KEY=sk_test_your_stripe_key
AUTHNET_LOGIN_ID=your_authnet_login
AUTHNET_TRANSACTION_KEY=your_authnet_key

# Email Operations
RESEND_API_KEY=re_your_resend_key
RESEND_FROM_EMAIL=noreply@your-domain.com

# Cannabis Compliance
CANNABIS_COMPLIANCE_MODE=development
AGE_VERIFICATION_REQUIRED=true
LAB_REPORTS_REQUIRED=true
```

### Sales Channels

Three sales channels are pre-configured:
- **Straight Gas** (retail): `sc_01K4XSXT93VTWGQWC6329VYYFP`
- **Liquid Gummies** (luxury): `sc_01K4XSXT93VN1C2XWBKB2CK7HN`
- **Wholesale** (B2B): `sc_01K4XSXT93DMM6WQ3XDQ62JA4S`

## 📡 **API Documentation**

### Base URL
```
http://localhost:9000/admin
```

### Authentication
All admin API endpoints require authentication. Include JWT token in Authorization header:
```
Authorization: Bearer <jwt_token>
```

### Business Intelligence APIs

#### Get Business Metrics
```http
GET /admin/business/metrics
```

**Response:**
```json
{
  "totalCustomers": 1247,
  "totalOrders": 3891,
  "totalRevenue": 458932.50,
  "averageOrderValue": 117.85,
  "topProducts": [...],
  "salesByChannel": {...}
}
```

#### Get Business Intelligence Data
```http
GET /admin/business/intelligence
```

**Response:**
```json
{
  "analytics": {
    "conversionRate": 3.42,
    "customerLifetimeValue": 245.67,
    "retentionRate": 68.3
  },
  "trends": {...},
  "forecasting": {...}
}
```

#### Get Store Management Data
```http
GET /admin/business/stores
```

**Response:**
```json
{
  "stores": [
    {
      "id": "sc_01K4XSXT93VTWGQWC6329VYYFP",
      "name": "Straight Gas",
      "type": "retail",
      "domain": "straight-gas.com",
      "status": "active",
      "apiKey": "pk_4211...e2d6",
      "metadata": {...}
    }
  ]
}
```

### Email Operations APIs

#### Get Email Templates
```http
GET /admin/email/templates
```

**Response:**
```json
{
  "templates": [
    {
      "id": "welcome-email",
      "name": "Welcome Email",
      "subject": "Welcome to {{store_name}}",
      "domains": ["straight-gas.com", "liquid-gummies.com"]
    }
  ]
}
```

#### Send Email
```http
POST /admin/email/send
```

**Request Body:**
```json
{
  "to": "customer@example.com",
  "template": "welcome-email",
  "domain": "straight-gas.com",
  "variables": {
    "customer_name": "John Doe",
    "store_name": "Straight Gas"
  }
}
```

## 🗂️ **Project Structure**

```
thca-multistore-backend/
├── src/
│   ├── admin/                 # Admin UI components
│   │   └── routes/           # Business Intelligence, Email Operations
│   ├── api/                  # API endpoints
│   │   ├── admin/business/   # Business intelligence APIs
│   │   └── admin/email/      # Email operation APIs
│   ├── modules/              # Custom modules
│   │   └── resend/           # Email provider
│   ├── scripts/              # Setup & migration scripts
│   └── utils/
│       └── cannabis/         # Cannabis validation utilities
├── uploads/                  # File storage
│   ├── coa/                 # Certificate of Analysis PDFs
│   └── qr-codes/            # Generated QR codes
├── medusa-config.ts         # Medusa configuration
├── cannabis-api-keys.txt    # API keys reference
└── CLAUDE.md               # Development guide
```

## 🧪 **Scripts Available**

```bash
# Start development server
npm run dev

# Production start
npm run start

# Run setup scripts
npm run seed
medusa exec ./src/scripts/setup-sales-channels.js
medusa exec ./src/scripts/create-sample-cannabis-products.js
medusa exec ./src/scripts/setup-cannabis-test-data.ts
```

## 🔒 **Security & Compliance**

### Cannabis Business Compliance
- ✅ Age verification systems
- ✅ THC content validation
- ✅ Lab report management (COA)
- ✅ State compliance tracking
- ✅ High-risk payment processing

### Data Security
- JWT-based authentication
- Encrypted sensitive data
- CORS protection for multi-store setup
- Environment-based configuration

## 🚀 **Production Deployment**

### Environment Setup
1. Configure production database
2. Set production payment credentials
3. Configure email domains
4. Set up file storage (Vercel Blob)
5. Configure compliance settings

### Required Services
- PostgreSQL database
- Resend (email)
- Authorize.Net (payments)
- Vercel Blob (file storage)
- Klaviyo (marketing - optional)

## 🤝 **Multi-Store Integration**

Each storefront connects using:
```javascript
// Store configuration
const medusaClient = new MedusaClient({
  baseURL: "http://localhost:9000",
  publishableApiKey: "pk_your_store_key"
})
```

### Store-Specific Features
- **Straight Gas**: Premium retail experience
- **Liquid Gummies**: Luxury edibles marketplace
- **Wholesale**: B2B ordering system with tier pricing

## 📋 **Development Status**

### ✅ Completed Features
- [x] Multi-store backend setup
- [x] Sales channel configuration
- [x] Business intelligence dashboard
- [x] Email operations center
- [x] Cannabis compliance system
- [x] Payment processing integration
- [x] Admin user management
- [x] File storage & COA system

### 🔄 In Progress
- [ ] Advanced analytics
- [ ] Inventory management
- [ ] Order fulfillment workflows

### 📚 **Documentation**
- `README.md` - This overview
- `CLAUDE.md` - Detailed development guide
- `cannabis-metadata-schema.md` - Cannabis data structure
- API documentation (above)

---

**Built with Medusa v2** | **Cannabis Industry Compliant** | **Multi-Store Ready** | **Production Tested**