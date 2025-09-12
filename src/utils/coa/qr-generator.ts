/**
 * Ultra-Simple QR Code Generator for COA Files
 * Generates QR codes that point directly to COA PDF files
 */

import QRCode from 'qrcode'

/**
 * Generate QR code data URL for COA file
 */
export async function generateCOAQRCode(coaFileUrl: string): Promise<string> {
  try {
    // Generate QR code as data URL (base64)
    const qrCodeDataUrl = await QRCode.toDataURL(coaFileUrl, {
      width: 200,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    })
    
    return qrCodeDataUrl
  } catch (error) {
    console.error('Failed to generate QR code:', error)
    throw new Error('QR code generation failed')
  }
}

/**
 * Generate QR code and save to file
 */
export async function saveCOAQRCode(coaFileUrl: string, outputPath: string): Promise<void> {
  try {
    await QRCode.toFile(outputPath, coaFileUrl, {
      width: 200,
      margin: 2
    })
    
    console.log(`QR code saved to: ${outputPath}`)
  } catch (error) {
    console.error('Failed to save QR code file:', error)
    throw new Error('QR code file save failed')
  }
}

/**
 * Generate QR code SVG string for COA file
 */
export async function generateCOAQRCodeSVG(coaFileUrl: string): Promise<string> {
  try {
    const qrCodeSVG = await QRCode.toString(coaFileUrl, {
      type: 'svg',
      width: 200,
      margin: 2
    })
    
    return qrCodeSVG
  } catch (error) {
    console.error('Failed to generate QR code SVG:', error)
    throw new Error('QR code SVG generation failed')
  }
}