'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { parseCannabisMetadata, formatCannabisDisplay } from './cannabis-types'
import { Leaf, Beaker, Shield, AlertTriangle, ExternalLink, FileText } from 'lucide-react'

interface Product {
  id: string
  title: string
  description: string
  metadata: Record<string, any>
}

interface CannabisProductInfoProps {
  product: Product
  storeType: 'retail' | 'luxury' | 'wholesale'
}

export default function CannabisProductInfo({ product, storeType }: CannabisProductInfoProps) {
  const cannabisData = parseCannabisMetadata(product)
  const [activeTab, setActiveTab] = useState('overview')

  if (!cannabisData) {
    // Regular product display for non-cannabis items
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">{product.title}</h1>
        <p className="text-muted-foreground text-lg">{product.description}</p>
      </div>
    )
  }

  const cannabisDisplay = formatCannabisDisplay(cannabisData)
  const isCompliant = cannabisData.cannabis_compliant === 'true'

  return (
    <div className="space-y-6">
      {/* Product Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
          <p className="text-muted-foreground text-lg">{product.description}</p>
        </div>
        <div className="text-right space-y-2">
          <Badge variant={isCompliant ? 'default' : 'destructive'} className="text-sm">
            {cannabisDisplay.compliance_badge}
          </Badge>
          <Badge variant="secondary" className="text-sm">
            <Beaker className="w-3 h-3 mr-1" />
            {cannabisDisplay.coa_status}
          </Badge>
        </div>
      </div>

      {/* Cannabis Information Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="coa">COA File</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">
                  {cannabisDisplay.compliance_badge}
                </div>
                <div className="text-sm text-muted-foreground">Compliance Status</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-lg font-bold">
                  {cannabisDisplay.batch_display}
                </div>
                <div className="text-sm text-muted-foreground">Batch Information</div>
              </CardContent>
            </Card>
          </div>
          
          <div className="flex gap-2 flex-wrap">
            <Badge variant="outline">
              <Leaf className="w-3 h-3 mr-1" />
              {cannabisDisplay.compliance_badge}
            </Badge>
            <Badge variant="outline">
              <Beaker className="w-3 h-3 mr-1" />
              {cannabisDisplay.coa_status}
            </Badge>
          </div>
        </TabsContent>
        
        <TabsContent value="coa" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Certificate of Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cannabisData.batch_number ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <strong>Batch Number:</strong> {cannabisData.batch_number}
                    </div>
                    <div>
                      <strong>Last Updated:</strong> {cannabisDisplay.last_updated}
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Compliance Status</h4>
                    <div className="text-sm space-y-1">
                      <div>Status: {cannabisDisplay.compliance_badge}</div>
                      <div>File Format: PDF</div>
                      <div>Access: {cannabisDisplay.coa_status}</div>
                    </div>
                  </div>
                  
                  {cannabisData.coa_file_url && (
                    <Button asChild className="w-full">
                      <a href={cannabisData.coa_file_url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View COA PDF File
                      </a>
                    </Button>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <AlertTriangle className="w-12 h-12 mx-auto mb-4" />
                  <p>COA file not available for this product.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
      </Tabs>
    </div>
  )
}