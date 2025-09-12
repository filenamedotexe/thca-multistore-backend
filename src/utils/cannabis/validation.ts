/**
 * Cannabis Product Validation Utilities - Ultra-Simple Version
 * High value, low complexity - just compliance yes/no (default yes)
 */

export interface CannabisMetadata {
  cannabis_product?: string
  cannabis_compliant?: string
  thca_percentage?: string
  delta9_thc?: string
  batch_number?: string
  coa_file_url?: string
  coa_last_updated?: string
  coa_qr_code_url?: string
  [key: string]: string | undefined
}

export interface ValidationResult {
  valid: boolean
  errors: string[]
  warnings: string[]
  calculated_values: {
    total_thc: number
    farm_bill_compliant: boolean
  }
}

/**
 * Ultra-simple cannabis validation - just check compliant flag (default yes)
 */
export function validateCannabisMetadata(metadata: CannabisMetadata): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []
  
  // Check if this is marked as a cannabis product
  if (metadata.cannabis_product !== 'true') {
    return {
      valid: true,
      errors: [],
      warnings: ['Not marked as cannabis product'],
      calculated_values: { total_thc: 0, farm_bill_compliant: true }
    }
  }
  
  // Ultra-simple compliance check - default to compliant unless explicitly set to false
  const isCompliant = metadata.cannabis_compliant !== 'false'
  
  // Only add error if explicitly marked as non-compliant
  if (metadata.cannabis_compliant === 'false') {
    errors.push("Product marked as non-compliant")
  }
  
  // Basic required field check
  if (!metadata.batch_number) {
    warnings.push("Batch number not specified")
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings,
    calculated_values: {
      total_thc: parseFloat(metadata.thca_percentage || '0'),
      farm_bill_compliant: isCompliant
    }
  }
}

/**
 * Parse cannabis metadata from product object
 */
export function parseCannabisMetadata(product: any): CannabisMetadata | null {
  if (!product.metadata || product.metadata.cannabis_product !== 'true') {
    return null
  }
  
  return {
    cannabis_product: product.metadata.cannabis_product,
    cannabis_compliant: product.metadata.cannabis_compliant || 'true', // default compliant
    thca_percentage: product.metadata.thca_percentage || '0',
    delta9_thc: product.metadata.delta9_thc || '0',
    batch_number: product.metadata.batch_number,
    coa_file_url: product.metadata.coa_file_url,
    coa_last_updated: product.metadata.coa_last_updated,
    coa_qr_code_url: product.metadata.coa_qr_code_url
  }
}

/**
 * Format cannabis data for display
 */
export function formatCannabisDisplay(metadata: CannabisMetadata) {
  return {
    thc_display: `THCa: ${metadata.thca_percentage || '0'}%`,
    compliance_badge: metadata.cannabis_compliant !== 'false' ? 'Compliant' : 'Non-Compliant',
    lab_status: 'Compliant by Default',
    category_display: 'CANNABIS'
  }
}

/**
 * Get warning labels as array
 */
export function getWarningLabels(metadata: CannabisMetadata): string[] {
  return ['FOR ADULT USE ONLY', 'KEEP OUT OF REACH OF CHILDREN']
}