# THCA Multi-Store Backend API Documentation

## 📡 **API Overview**

**Base URL**: `http://localhost:9000/admin`
**Production URL**: `https://your-domain.com/admin`
**Authentication**: JWT Bearer Token Required
**Content-Type**: `application/json`

## 🔐 **Authentication**

All admin API endpoints require authentication. Include JWT token in the Authorization header:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Getting Authentication Token
```http
POST /auth/admin/token
Content-Type: application/json

{
  "email": "admin@thca.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_01K4XSXT93VTWGQWC6329VYYFP",
    "email": "admin@thca.com",
    "role": "master_admin"
  }
}
```

---

## 📊 **Business Intelligence APIs**

### 1. Get Business Metrics
Retrieve comprehensive business metrics across all stores.

```http
GET /admin/business/metrics
Authorization: Bearer <token>
```

**Query Parameters:**
- `period` (optional): `day`, `week`, `month`, `quarter`, `year`
- `store_id` (optional): Filter by specific store
- `start_date` (optional): ISO date string
- `end_date` (optional): ISO date string

**Example Request:**
```bash
curl -X GET "http://localhost:9000/admin/business/metrics?period=month" \
  -H "Authorization: Bearer <token>"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalCustomers": 1247,
    "totalOrders": 3891,
    "totalRevenue": 458932.50,
    "averageOrderValue": 117.85,
    "conversionRate": 3.42,
    "period": "month",
    "topProducts": [
      {
        "id": "prod_01K4XSXT93VTWGQWC6329VYYFP",
        "title": "Blue Dream Premium",
        "sales": 156,
        "revenue": 18720.00
      }
    ],
    "salesByChannel": {
      "straight_gas": 245831.20,
      "liquid_gummies": 156789.30,
      "wholesale": 56312.00
    },
    "recentTrends": {
      "revenue_growth": 12.4,
      "customer_growth": 8.7,
      "order_growth": 15.2
    }
  }
}
```

### 2. Get Business Intelligence Data
Advanced analytics and business intelligence insights.

```http
GET /admin/business/intelligence
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "analytics": {
      "customerLifetimeValue": 245.67,
      "retentionRate": 68.3,
      "churnRate": 31.7,
      "averageSessionDuration": 342.5
    },
    "forecasting": {
      "predictedRevenue": 567890.00,
      "confidenceInterval": 0.85,
      "growthTrend": "upward"
    },
    "segmentation": {
      "highValueCustomers": 89,
      "regularCustomers": 756,
      "newCustomers": 402
    },
    "productPerformance": {
      "topCategories": ["flower", "edibles", "concentrates"],
      "underperformingProducts": [...]
    }
  }
}
```

### 3. Get Store Management Data
Manage sales channels, API keys, and store configurations.

```http
GET /admin/business/stores
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "stores": [
      {
        "id": "sc_01K4XSXT93VTWGQWC6329VYYFP",
        "name": "Straight Gas",
        "description": "Premium retail cannabis store",
        "type": "retail",
        "domain": "straight-gas.com",
        "status": "active",
        "apiKey": "pk_42116bf0f1936e5f902b5a14f9ffdacd497bc13bf1ab65b9bbe3a3095358e2d6",
        "created_at": "2024-09-11T20:51:00Z",
        "metadata": {
          "store_type": "retail",
          "cannabis_license": "C11-0000123-LIC",
          "compliance_verified": true
        },
        "metrics": {
          "totalOrders": 1456,
          "totalRevenue": 245831.20,
          "activeCustomers": 567
        }
      }
    ],
    "summary": {
      "totalStores": 3,
      "activeStores": 3,
      "totalApiKeys": 3
    }
  }
}
```

### 4. Update Store Configuration
Update store settings and metadata.

```http
PATCH /admin/business/stores/{store_id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "active",
  "metadata": {
    "cannabis_license": "C11-0000123-LIC",
    "compliance_verified": true,
    "store_type": "retail"
  }
}
```

---

## 📧 **Email Operations APIs**

### 1. Get Email Templates
Retrieve all email templates across domains.

```http
GET /admin/email/templates
Authorization: Bearer <token>
```

**Query Parameters:**
- `domain` (optional): Filter by domain
- `active_only` (optional): `true`/`false`

**Response:**
```json
{
  "success": true,
  "data": {
    "templates": [
      {
        "id": "welcome-email",
        "name": "Welcome Email",
        "subject": "Welcome to {{store_name}}!",
        "description": "New customer welcome message",
        "domains": ["straight-gas.com", "liquid-gummies.com"],
        "variables": ["customer_name", "store_name", "activation_link"],
        "status": "active",
        "created_at": "2024-09-11T00:00:00Z",
        "updated_at": "2024-09-13T15:30:00Z"
      },
      {
        "id": "order-confirmation",
        "name": "Order Confirmation",
        "subject": "Order #{{order_number}} Confirmed",
        "domains": ["liquidgummieswholesale.com"],
        "variables": ["customer_name", "order_number", "total_amount"],
        "status": "active"
      }
    ],
    "total": 12,
    "byDomain": {
      "straight-gas.com": 8,
      "liquid-gummies.com": 7,
      "liquidgummieswholesale.com": 5
    }
  }
}
```

### 2. Create Email Template
Create a new email template.

```http
POST /admin/email/templates
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Cart Abandonment",
  "subject": "Don't forget your {{product_name}}",
  "template": "<html>...</html>",
  "domains": ["straight-gas.com"],
  "variables": ["customer_name", "product_name", "cart_total"],
  "trigger": "cart_abandoned_24h"
}
```

### 3. Send Email
Send email using template or custom content.

```http
POST /admin/email/send
Authorization: Bearer <token>
Content-Type: application/json

{
  "to": "customer@example.com",
  "template": "welcome-email",
  "domain": "straight-gas.com",
  "variables": {
    "customer_name": "John Doe",
    "store_name": "Straight Gas",
    "activation_link": "https://straight-gas.com/activate/abc123"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message_id": "msg_01K4XSXT93VTWGQWC6329VYYFP",
    "status": "sent",
    "recipient": "customer@example.com",
    "domain": "straight-gas.com",
    "template_used": "welcome-email",
    "sent_at": "2024-09-14T10:30:00Z"
  }
}
```

### 4. Get Email Analytics
Retrieve email performance metrics.

```http
GET /admin/email/analytics
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "summary": {
      "totalSent": 15678,
      "totalDelivered": 15234,
      "totalOpened": 8945,
      "totalClicked": 2367,
      "deliveryRate": 97.2,
      "openRate": 58.7,
      "clickRate": 15.1
    },
    "byDomain": {
      "straight-gas.com": {
        "sent": 7234,
        "delivered": 7021,
        "openRate": 62.3
      }
    },
    "topTemplates": [
      {
        "template": "welcome-email",
        "sent": 2456,
        "openRate": 78.2
      }
    ]
  }
}
```

---

## 🏪 **Multi-Store Management**

### Store-Specific Endpoints

Each store has its own publishable API key for storefront operations:

| Store | API Key (First 8 chars) | Full Operations |
|-------|-------------------------|-----------------|
| Straight Gas | `pk_4211...` | Retail operations |
| Liquid Gummies | `pk_5230...` | Luxury marketplace |
| Wholesale | `pk_5ea8...` | B2B ordering |

### Example Store Integration
```javascript
// Frontend store configuration
import { MedusaClient } from "@medusajs/js-sdk"

const medusaClient = new MedusaClient({
  baseURL: "http://localhost:9000",
  publishableApiKey: "pk_42116bf0f1936e5f902b5a14f9ffdacd497bc13bf1ab65b9bbe3a3095358e2d6" // Straight Gas
})

// Get products for this store
const products = await medusaClient.store.product.list()
```

---

## 🌿 **Cannabis-Specific Features**

### COA (Certificate of Analysis) Management

```http
GET /admin/cannabis/coa/{batch_id}
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "batch_id": "BATCH001",
    "coa_file_url": "/uploads/coa/BATCH001-COA.pdf",
    "qr_code_url": "/uploads/qr-codes/BATCH001-QR.png",
    "lab_results": {
      "thca_percentage": 24.5,
      "delta9_thc": 0.8,
      "cbd_percentage": 1.2
    },
    "compliance_status": "approved",
    "expiry_date": "2024-12-31"
  }
}
```

### Cannabis Product Validation

```http
POST /admin/cannabis/validate
Authorization: Bearer <token>
Content-Type: application/json

{
  "product_data": {
    "thc_content": 24.5,
    "product_type": "flower",
    "batch_id": "BATCH001"
  }
}
```

---

## ❌ **Error Handling**

All API endpoints return standardized error responses:

```json
{
  "success": false,
  "error": {
    "code": "AUTHENTICATION_FAILED",
    "message": "Invalid or expired token",
    "details": "Token expired at 2024-09-14T10:00:00Z"
  }
}
```

### Common Error Codes
- `AUTHENTICATION_FAILED` - Invalid/expired token
- `AUTHORIZATION_DENIED` - Insufficient permissions
- `VALIDATION_ERROR` - Request data validation failed
- `RESOURCE_NOT_FOUND` - Requested resource doesn't exist
- `RATE_LIMIT_EXCEEDED` - Too many requests
- `INTERNAL_SERVER_ERROR` - Server error

---

## 🚀 **Rate Limiting**

- **Admin APIs**: 100 requests/minute per token
- **Business Intelligence**: 50 requests/minute per token
- **Email Operations**: 200 requests/minute per token

Rate limit headers included in responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 87
X-RateLimit-Reset: 1694689200
```

---

## 🔧 **Development & Testing**

### Using cURL
```bash
# Get business metrics
curl -X GET "http://localhost:9000/admin/business/metrics" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json"

# Send email
curl -X POST "http://localhost:9000/admin/email/send" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "to": "test@example.com",
    "template": "welcome-email",
    "domain": "straight-gas.com",
    "variables": {
      "customer_name": "Test User",
      "store_name": "Straight Gas"
    }
  }'
```

### Postman Collection
Import the following environment variables:
- `BASE_URL`: `http://localhost:9000/admin`
- `AUTH_TOKEN`: Your JWT token

---

**🏗️ Built with Medusa v2** | **🌿 Cannabis Compliant** | **🏪 Multi-Store Ready**