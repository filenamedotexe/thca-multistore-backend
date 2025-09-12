/**
 * Ultra-Simple COA System Setup
 * Creates sample COA files and directory structure
 */

const fs = require('fs')
const path = require('path')
const QRCode = require('qrcode')

async function setupCOASystem() {
  console.log('🧪 Setting up ultra-simple COA file system...')
  
  try {
    // Ensure directories exist
    const coaDir = path.join(process.cwd(), 'uploads', 'coa')
    const qrDir = path.join(process.cwd(), 'uploads', 'qr-codes')
    
    if (!fs.existsSync(coaDir)) {
      fs.mkdirSync(coaDir, { recursive: true })
      console.log('✅ Created COA directory: uploads/coa/')
    }
    
    if (!fs.existsSync(qrDir)) {
      fs.mkdirSync(qrDir, { recursive: true })
      console.log('✅ Created QR codes directory: uploads/qr-codes/')
    }
    
    // Create sample COA files and QR codes
    const sampleBatches = ['BATCH001', 'BATCH002', 'BATCH003']
    const baseUrl = 'http://localhost:9000'
    
    for (const batchNumber of sampleBatches) {
      const coaFilePath = path.join(coaDir, `${batchNumber}-COA.pdf`)
      
      // Create placeholder COA file if it doesn't exist
      if (!fs.existsSync(coaFilePath)) {
        const placeholderContent = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj  
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R >>
endobj
4 0 obj
<< /Length 60 >>
stream
BT
/F1 12 Tf
100 700 Td
(Certificate of Analysis - ${batchNumber}) Tj
100 680 Td
(Cannabis Product COA Document) Tj
ET
endstream
endobj
xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000074 00000 n 
0000000131 00000 n 
0000000232 00000 n 
trailer
<< /Size 5 /Root 1 0 R >>
startxref
350
%%EOF`
        
        fs.writeFileSync(coaFilePath, placeholderContent)
        console.log(`✅ Created placeholder COA: ${batchNumber}-COA.pdf`)
      }
      
      // Generate QR code for COA file
      const coaFileUrl = `${baseUrl}/uploads/coa/${batchNumber}-COA.pdf`
      const qrCodePath = path.join(qrDir, `${batchNumber}-QR.png`)
      
      try {
        await QRCode.toFile(qrCodePath, coaFileUrl, {
          width: 200,
          margin: 2
        })
        console.log(`✅ Generated QR code for ${batchNumber} → ${coaFileUrl}`)
      } catch (qrError) {
        console.warn(`⚠️ QR code generation failed for ${batchNumber}:`, qrError.message)
      }
    }
    
    console.log('\n✅ Ultra-simple COA system setup complete!')
    console.log('\n📋 What was created:')
    console.log('  ✓ COA file directory: uploads/coa/')
    console.log('  ✓ QR codes directory: uploads/qr-codes/')
    console.log('  ✓ Sample COA PDF files for 3 batches')
    console.log('  ✓ QR codes pointing directly to COA files')
    
    console.log('\n🎯 Next: Add COA fields to product metadata')
    console.log('📁 COA files accessible at: http://localhost:9000/uploads/coa/[BATCH]-COA.pdf')
    
  } catch (error) {
    console.error('❌ COA system setup failed:', error)
    throw error
  }
}

// Run directly if this is the main module
if (require.main === module) {
  setupCOASystem()
    .then(() => process.exit(0))
    .catch(error => {
      console.error('Setup failed:', error)
      process.exit(1)
    })
}

module.exports.default = setupCOASystem