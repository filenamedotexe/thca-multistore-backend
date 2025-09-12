/**
 * Ultra-Simple COA File Management
 * High value, low complexity approach
 */

export interface COAFile {
  batch_number: string
  file_url: string
  qr_code_url: string
  last_updated: string
}

/**
 * Generate COA file URL for a batch
 */
export function generateCOAFileUrl(batchNumber: string): string {
  return `/uploads/coa/${batchNumber}-COA.pdf`
}

/**
 * Generate QR code URL pointing directly to COA file
 */
export function generateCOAQRCodeUrl(batchNumber: string, baseUrl: string): string {
  return `${baseUrl}/uploads/coa/${batchNumber}-COA.pdf`
}

/**
 * Create COA metadata for product
 */
export function createCOAMetadata(batchNumber: string, baseUrl: string): {
  coa_file_url: string
  coa_qr_code_url: string
  coa_last_updated: string
  batch_number: string
} {
  return {
    coa_file_url: generateCOAFileUrl(batchNumber),
    coa_qr_code_url: generateCOAQRCodeUrl(batchNumber, baseUrl),
    coa_last_updated: new Date().toISOString().split('T')[0], // YYYY-MM-DD
    batch_number: batchNumber
  }
}