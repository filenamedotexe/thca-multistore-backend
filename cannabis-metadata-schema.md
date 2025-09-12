# Cannabis Product Metadata Schema (2025 Compliance)

## Overview
Cannabis-specific data is stored in the standard Medusa `product.metadata` field as JSON. This approach is simple, flexible, and doesn't require complex database schemas.

**Regulatory Context (September 2025):**
- Farm Bill reauthorization delayed - current 0.3% THC limits remain
- Proposed THCA inclusion in Total THC calculations pending
- State-level variations exist (VA: 0.3% total THC including THCA)
- Schema designed for current compliance + future-proofing

## Required Cannabis Metadata Fields

### Core Compliance Data (Farm Bill 2018 + 2025 Updates)
```json
{
  "cannabis_product": "true",
  "thca_percentage": "18.2",
  "delta9_thc": "0.1", 
  "total_thc_calculated": "16.1",
  "total_thc_with_thca": "16.065",
  "cbd_percentage": "0.8",
  "farm_bill_compliant": "true",
  "compliance_basis": "delta9_only"
}
```

### Product Classification
```json
{
  "strain_type": "sativa|indica|hybrid",
  "product_category": "flower|edible|concentrate|topical|other",
  "cultivation_method": "indoor|outdoor|greenhouse",
  "organic_certified": "true|false"
}
```

### Lab Testing & Compliance
```json
{
  "lab_tested": "true",
  "lab_test_date": "2025-09-15",
  "lab_name": "Certified Cannabis Testing Lab",
  "batch_number": "BATCH001",
  "coa_url": "/lab-reports/BATCH001",
  "coa_qr_code": "QR_CODE_DATA_HERE",
  "expiration_date": "2026-09-15",
  "potency_test_results": "/lab-reports/potency/BATCH001",
  "pesticide_screen": "pass",
  "heavy_metals_screen": "pass",
  "microbial_screen": "pass"
}
```

### Terpene Profile (Top 5 for Simplicity)
```json
{
  "myrcene": "0.65",
  "limonene": "0.32", 
  "caryophyllene": "0.21",
  "pinene": "0.18",
  "linalool": "0.12",
  "total_terpenes": "1.48"
}
```

### Warning Labels & Compliance
```json
{
  "warning_labels": [
    "FOR ADULT USE ONLY",
    "KEEP OUT OF REACH OF CHILDREN", 
    "CANNABIS PRODUCTS HAVE NOT BEEN EVALUATED BY THE FDA",
    "DO NOT OPERATE MACHINERY"
  ],
  "child_resistant_packaging": "true",
  "net_weight": "3.5g",
  "serving_size": "1 unit",
  "servings_per_package": "1"
}
```

### Wholesale-Specific Data
```json
{
  "wholesale_only": "false",
  "min_order_quantity": "10",
  "case_quantity": "50", 
  "bulk_pricing_tiers": [
    {"min_qty": 10, "discount": 15},
    {"min_qty": 25, "discount": 25},
    {"min_qty": 50, "discount": 35}
  ]
}
```

## Complete Example Product Metadata
```json
{
  "cannabis_product": "true",
  "thca_percentage": "18.2",
  "delta9_thc": "0.1",
  "total_thc_calculated": "16.1",
  "total_thc_with_thca": "16.065",
  "cbd_percentage": "0.8",
  "strain_type": "sativa",
  "product_category": "flower",
  "lab_tested": "true",
  "lab_test_date": "2025-09-15",
  "batch_number": "BATCH001",
  "coa_url": "/lab-reports/BATCH001",
  "farm_bill_compliant": "true",
  "compliance_basis": "delta9_only",
  "myrcene": "0.65",
  "limonene": "0.32",
  "warning_labels": [
    "FOR ADULT USE ONLY",
    "KEEP OUT OF REACH OF CHILDREN"
  ],
  "min_order_quantity": "1",
  "wholesale_only": "false"
}
```

## THC Compliance Calculations (2025 Standards)

### Current Formula (Delta-9 Only)
**Formula:** Delta-9 THC ≤ 0.3% (dry weight basis)
**Status:** Currently enforced federal standard

### Proposed Formula (Including THCA)
**Formula:** Total THC = Delta-9 THC + (THCA × 0.877)
**Compliance:** Total THC ≤ 0.3% (Farm Bill 2025 proposal)
**Example:** 0.1 + (18.2 × 0.877) = 16.065% (Non-compliant under proposed rules)
**Safe THCA:** For compliance, THCA should be ≤ 0.22% to stay under 0.3% total

### State Variations
- **Virginia (2023+):** 0.3% total THC including THCA
- **Other states:** May implement similar restrictions

## Implementation Notes
- All values stored as strings in metadata for consistency
- Boolean values as "true"/"false" strings  
- Arrays stored as JSON strings
- Calculations performed in application logic
- Simple validation in admin panel
- **Future-proofing:** Schema includes both current and proposed compliance fields
- **Regulatory flexibility:** `compliance_basis` field tracks which standard is applied

## Validation Rules
1. **Required for cannabis products:**
   - `cannabis_product = "true"`
   - `thca_percentage`
   - `delta9_thc` 
   - `batch_number`
   - `lab_test_date`

2. **Auto-calculated fields:**
   - `total_thc_calculated`
   - `total_thc_with_thca` 
   - `farm_bill_compliant`

3. **Warning validations:**
   - Products > 0.3% total THC must be flagged
   - Lab test dates must be within expiration window
   - Batch numbers must be unique per test date

## Schema Version
**Version:** 1.0 (September 2025)
**Last Updated:** Based on pending Farm Bill proposals and current state regulations
**Next Review:** Upon Farm Bill reauthorization