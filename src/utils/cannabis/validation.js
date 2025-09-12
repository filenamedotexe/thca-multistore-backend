/**
 * Cannabis Product Validation Utilities - Ultra-Simple Version
 * High value, low complexity - just compliance yes/no (default yes)
 */

function validateCannabisMetadata(metadata) {
  // Ultra-simple cannabis validation - just check compliant flag (default yes)
  const isCompliant = metadata.cannabis_compliant !== 'false'
  
  return {
    valid: isCompliant,
    errors: isCompliant ? [] : ["Product marked as non-compliant"],
    warnings: [],
    calculated_values: {
      cannabis_compliant: isCompliant
    }
  }
}

function parseCannabisMetadata(product) {
  if (!product.metadata || product.metadata.cannabis_product !== 'true') {
    return null
  }
  
  return {
    cannabis_product: product.metadata.cannabis_product,
    cannabis_compliant: product.metadata.cannabis_compliant || 'true', // default compliant
    batch_number: product.metadata.batch_number,
    coa_file_url: product.metadata.coa_file_url,
    coa_last_updated: product.metadata.coa_last_updated
  }
}

function formatCannabisDisplay(metadata) {
  return {
    compliance_badge: metadata.cannabis_compliant !== 'false' ? 'Compliant' : 'Non-Compliant',
    batch_display: `Batch: ${metadata.batch_number || 'Not specified'}`,
    coa_status: metadata.coa_file_url ? 'COA Available' : 'COA Pending',
    last_updated: metadata.coa_last_updated || 'Not specified'
  }
}

function getWarningLabels(metadata) {
  return ['FOR ADULT USE ONLY', 'KEEP OUT OF REACH OF CHILDREN']
}

module.exports = {
  validateCannabisMetadata,
  parseCannabisMetadata,
  formatCannabisDisplay,
  getWarningLabels
}