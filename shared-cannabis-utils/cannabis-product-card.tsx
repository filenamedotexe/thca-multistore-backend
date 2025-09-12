'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { parseCannabisMetadata, formatCannabisDisplay } from './cannabis-types'
import { Leaf, Beaker, ShoppingCart, Eye, Package } from 'lucide-react'

interface Product {
  id: string
  handle: string
  title: string
  description: string
  thumbnail: string
  variants: Array<{
    id: string
    title: string
    prices: Array<{ amount: number; currency_code: string }>
    inventory_quantity: number
  }>
  metadata: Record<string, any>
}

interface CannabisProductCardProps {
  product: Product
  storeType: 'retail' | 'luxury' | 'wholesale'
  onAddToCart?: (variantId: string, quantity: number) => void
  onQuickView?: (productId: string) => void
}

export default function CannabisProductCard({ 
  product, 
  storeType,
  onAddToCart,
  onQuickView
}: CannabisProductCardProps) {
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0])
  const cannabisData = parseCannabisMetadata(product)
  const price = selectedVariant?.prices[0]?.amount || 0

  if (!cannabisData) {
    // Regular product card for non-cannabis items
    return (
      <Card className="group hover:shadow-lg transition-shadow duration-300">
        <Link href={`/products/${product.handle}`}>
          <Image
            src={product.thumbnail || '/placeholder-product.jpg'}
            alt={product.title}
            width={300}
            height={300}
            className="w-full h-48 object-cover rounded-t-lg"
          />
        </Link>
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-2">{product.title}</h3>
          <p className="text-lg font-bold">${(price / 100).toFixed(2)}</p>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <Button 
            onClick={() => onAddToCart?.(selectedVariant?.id, 1)}
            className="w-full"
          >
            Add to Cart
          </Button>
        </CardFooter>
      </Card>
    )
  }

  const cannabisDisplay = formatCannabisDisplay(cannabisData)
  const isCompliant = cannabisData.cannabis_compliant === 'true'

  // Store-specific styling and features
  const getStoreSpecificStyling = () => {
    switch (storeType) {
      case 'luxury':
        return {
          cardClass: "group hover:shadow-xl transition-all duration-500 border-2 hover:border-purple-200",
          badgeVariant: "default" as const,
          imageHeight: "h-56"
        }
      case 'wholesale':
        return {
          cardClass: "group hover:shadow-md transition-shadow duration-200 border",
          badgeVariant: "outline" as const,
          imageHeight: "h-40"
        }
      default:
        return {
          cardClass: "group hover:shadow-lg transition-shadow duration-300",
          badgeVariant: "secondary" as const,
          imageHeight: "h-48"
        }
    }
  }

  const styling = getStoreSpecificStyling()

  const getMinimumQuantity = () => {
    if (storeType === 'wholesale') {
      return 10
    }
    return 1
  }

  return (
    <Card className={styling.cardClass}>
      <div className="relative">
        <Link href={`/products/${product.handle}`}>
          <Image
            src={product.thumbnail || '/placeholder-cannabis.jpg'}
            alt={product.title}
            width={400}
            height={300}
            className={`w-full ${styling.imageHeight} object-cover rounded-t-lg`}
          />
        </Link>
        
        {/* Cannabis compliance badges */}
        <div className="absolute top-2 left-2 space-y-1">
          <Badge variant={isCompliant ? "default" : "destructive"} className="text-xs">
            {isCompliant ? 'Cannabis Compliant' : 'Non-Compliant'}
          </Badge>
          <Badge variant={styling.badgeVariant} className="text-xs">
            <Beaker className="w-3 h-3 mr-1" />
            {cannabisDisplay.coa_status}
          </Badge>
        </div>

        {/* Store-specific badges */}
        <div className="absolute top-2 right-2">
          {storeType === 'luxury' && (
            <Badge className="bg-gradient-to-r from-purple-600 to-yellow-400 text-white text-xs">
              Premium
            </Badge>
          )}
          {storeType === 'wholesale' && (
            <Badge variant="outline" className="bg-white text-xs">
              <Package className="w-3 h-3 mr-1" />
              Bulk
            </Badge>
          )}
        </div>
      </div>
      
      <CardContent className="p-4">
        <Link href={`/products/${product.handle}`}>
          <h3 className="font-semibold text-lg line-clamp-2 mb-2 hover:text-primary transition-colors">
            {product.title}
          </h3>
        </Link>
        
        {storeType !== 'wholesale' && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {product.description}
          </p>
        )}
        
        {/* Cannabis information display */}
        <div className="space-y-2 mb-3">
          <div className="flex flex-wrap gap-1">
            <Badge variant="outline" className="text-xs">
              <Leaf className="w-3 h-3 mr-1" />
              {cannabisDisplay.compliance_badge}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {cannabisDisplay.coa_status}
            </Badge>
          </div>
          
          {/* Batch info for all store types */}
          <div className="text-xs space-y-1">
            <div>{cannabisDisplay.batch_display}</div>
            <div>Updated: {cannabisDisplay.last_updated}</div>
          </div>
        </div>
        
        {/* Pricing */}
        <div className="flex justify-between items-center mb-3">
          <div className="text-lg font-bold">
            ${(price / 100).toFixed(2)}
            {storeType === 'wholesale' && <span className="text-sm text-muted-foreground"> /unit</span>}
          </div>
          
          {/* Store-specific pricing info */}
          {storeType === 'wholesale' && (
            <div className="text-xs text-green-600">
              Volume discounts available
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 space-y-2">
        {/* Action buttons */}
        <div className="flex gap-2 w-full">
          {storeType === 'wholesale' ? (
            <>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onQuickView?.(product.id)}
                className="flex-1"
              >
                <Eye className="w-4 h-4 mr-1" />
                View
              </Button>
              <Button 
                onClick={() => onAddToCart?.(selectedVariant?.id, getMinimumQuantity())}
                disabled={!selectedVariant || selectedVariant.inventory_quantity < getMinimumQuantity()}
                className="flex-2"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add {getMinimumQuantity()}+ to Order
              </Button>
            </>
          ) : (
            <>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onQuickView?.(product.id)}
              >
                <Eye className="w-4 h-4" />
              </Button>
              <Button 
                onClick={() => onAddToCart?.(selectedVariant?.id, 1)}
                disabled={!selectedVariant || selectedVariant.inventory_quantity === 0}
                className="flex-1"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add to Cart
              </Button>
            </>
          )}
        </div>
        
        {/* COA file link */}
        {cannabisData.batch_number && (
          <Link 
            href={`/uploads/coa/${cannabisData.batch_number}-COA.pdf`}
            className="text-xs text-primary hover:underline flex items-center justify-center gap-1"
            target="_blank"
          >
            <Beaker className="w-3 h-3" />
            View COA PDF
          </Link>
        )}
      </CardFooter>
    </Card>
  )
}