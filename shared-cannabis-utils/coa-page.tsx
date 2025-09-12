import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AlertCircle, Download, Share2, FileText, ExternalLink } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'

interface COAPageProps {
  params: { batch: string }
}

function getCOAData(batchNumber: string) {
  // Ultra-simple approach: direct file URLs
  const coaFileUrl = `/uploads/coa/${batchNumber}-COA.pdf`
  const qrCodeUrl = `${process.env.NEXT_PUBLIC_BASE_URL}${coaFileUrl}`
  
  return {
    batchNumber,
    coaFileUrl,
    qrCodeUrl,
    lastUpdated: "2025-09-11"
  }
}

export default function COAPage({ params }: COAPageProps) {
  const coaData = getCOAData(params.batch)
  
  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Certificate of Analysis</h1>
          <p className="text-muted-foreground">
            Batch: {coaData.batchNumber}
          </p>
        </div>
        <Badge variant="default" className="text-sm">
          Cannabis Compliant
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* COA PDF Viewer */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Certificate of Analysis - PDF Document
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border rounded-lg p-4 bg-gray-50 text-center">
              <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="font-semibold mb-2">COA Document</h3>
              <p className="text-sm text-muted-foreground mb-4">
                View the complete Certificate of Analysis for batch {coaData.batchNumber}
              </p>
              <div className="flex gap-2 justify-center">
                <Button asChild>
                  <a href={coaData.coaFileUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View COA PDF
                  </a>
                </Button>
                <Button variant="outline" asChild>
                  <a href={coaData.coaFileUrl} download>
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* QR Code Access */}
        <Card>
          <CardHeader>
            <CardTitle>QR Code Access</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="inline-block p-4 bg-white border rounded-lg">
              <QRCodeSVG 
                value={coaData.qrCodeUrl}
                size={150}
                level="M"
                marginSize={4}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Scan for direct access to COA PDF
            </p>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigator.share?.({ 
                title: `COA - Batch ${coaData.batchNumber}`,
                url: coaData.qrCodeUrl 
              })}
              className="w-full"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share COA Link
            </Button>
          </CardContent>
        </Card>

        {/* File Information */}
        <Card>
          <CardHeader>
            <CardTitle>File Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm space-y-2">
              <div><strong>Batch Number:</strong> {coaData.batchNumber}</div>
              <div><strong>Last Updated:</strong> {coaData.lastUpdated}</div>
              <div><strong>File Format:</strong> PDF</div>
              <div><strong>Compliance:</strong> Cannabis Compliant</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Simple Disclaimer */}
      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="p-4">
          <div className="text-sm text-amber-800">
            <p><strong>Important:</strong> This Certificate of Analysis represents testing results for the specific batch indicated. 
            Cannabis products have not been evaluated by the FDA. Keep out of reach of children. 
            For adult use only (21+). Do not operate machinery after use.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}