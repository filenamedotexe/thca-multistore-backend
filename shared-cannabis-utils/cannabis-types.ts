/**
 * Cannabis Types and Utilities (2025 Compliance)
 * Simple but comprehensive cannabis data handling
 */

export interface CannabisMetadata {
  cannabis_product?: string
  cannabis_compliant?: string
  batch_number?: string
  coa_file_url?: string
  coa_last_updated?: string
}

export interface COAData {
  batch_number: string
  coa_file_url: string
  coa_last_updated: string
}

/**
 * Parse cannabis metadata from product
 */
export function parseCannabisMetadata(product: any): CannabisMetadata | null {
  if (!product.metadata || product.metadata.cannabis_product !== 'true') {
    return null
  }
  
  return {
    cannabis_product: product.metadata.cannabis_product,
    cannabis_compliant: product.metadata.cannabis_compliant,
    batch_number: product.metadata.batch_number,
    coa_file_url: product.metadata.coa_file_url,
    coa_last_updated: product.metadata.coa_last_updated
  }
}

/**
 * Check cannabis compliance
 */
export function isCannabisCompliant(metadata: CannabisMetadata): boolean {
  return metadata.cannabis_compliant === 'true'
}

/**
 * Format cannabis info for display
 */
export function formatCannabisDisplay(metadata: CannabisMetadata) {
  return {
    compliance_badge: metadata.cannabis_compliant === 'true' ? 'Cannabis Compliant' : 'Non-Compliant',
    batch_display: `Batch: ${metadata.batch_number}`,
    coa_status: metadata.coa_file_url ? 'COA Available' : 'COA Pending',
    last_updated: metadata.coa_last_updated || 'Unknown'
  }
}


/**
 * Track cannabis compliance events (simple analytics)
 */
export function trackCannabisEvent(eventName: string, data: Record<string, any> = {}) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, {
      cannabis_store: true,
      store_type: process.env.NEXT_PUBLIC_STORE_TYPE,
      compliance_verified: true,
      ...data
    })
  }
}