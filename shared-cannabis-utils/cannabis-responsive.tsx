'use client'

// Cannabis Responsive Component - Mobile-First Design Patterns
// Reference: Official Tailwind CSS responsive design patterns

import React, { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Menu, 
  X, 
  Smartphone, 
  Tablet, 
  Monitor,
  Leaf 
} from 'lucide-react'

// Responsive breakpoint hook
export function useResponsive() {
  const [screenSize, setScreenSize] = useState<'mobile' | 'tablet' | 'desktop'>('desktop')

  useEffect(() => {
    const checkScreenSize = () => {
      if (window.innerWidth < 768) {
        setScreenSize('mobile')
      } else if (window.innerWidth < 1024) {
        setScreenSize('tablet')
      } else {
        setScreenSize('desktop')
      }
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  return {
    isMobile: screenSize === 'mobile',
    isTablet: screenSize === 'tablet',
    isDesktop: screenSize === 'desktop',
    screenSize
  }
}

// Responsive container component
interface ResponsiveContainerProps {
  children: React.ReactNode
  className?: string
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
}

export function CannabisResponsiveContainer({ 
  children, 
  className = '',
  padding = 'md'
}: ResponsiveContainerProps) {
  const paddingClasses = {
    none: '',
    sm: 'px-2 sm:px-4',
    md: 'px-4 sm:px-6 lg:px-8',
    lg: 'px-6 sm:px-8 lg:px-12',
    xl: 'px-8 sm:px-12 lg:px-16'
  }

  return (
    <div className={cn(
      'w-full mx-auto',
      paddingClasses[padding],
      className
    )}>
      {children}
    </div>
  )
}

// Responsive grid component for cannabis products
interface CannabisResponsiveGridProps {
  children: React.ReactNode
  columns?: {
    mobile?: 1 | 2
    tablet?: 2 | 3 | 4
    desktop?: 3 | 4 | 5 | 6
  }
  gap?: 'sm' | 'md' | 'lg'
  className?: string
}

export function CannabisResponsiveGrid({ 
  children, 
  columns = { mobile: 1, tablet: 2, desktop: 3 },
  gap = 'md',
  className = ''
}: CannabisResponsiveGridProps) {
  const gapClasses = {
    sm: 'gap-2 sm:gap-3',
    md: 'gap-4 sm:gap-6',
    lg: 'gap-6 sm:gap-8'
  }

  const gridCols = `grid-cols-${columns.mobile} md:grid-cols-${columns.tablet} lg:grid-cols-${columns.desktop}`

  return (
    <div className={cn(
      'grid',
      gridCols,
      gapClasses[gap],
      className
    )}>
      {children}
    </div>
  )
}

// Cannabis mobile navigation drawer
interface CannabisResponsiveNavProps {
  isOpen: boolean
  onClose: () => void
  storeType: 'retail' | 'luxury' | 'wholesale'
  storeName: string
  navigationItems: Array<{
    title: string
    href: string
    icon: React.ComponentType<{ className?: string }>
  }>
}

export function CannabisResponsiveNav({ 
  isOpen, 
  onClose, 
  storeType, 
  storeName,
  navigationItems 
}: CannabisResponsiveNavProps) {
  const { isMobile } = useResponsive()

  const getStoreTheme = () => {
    switch (storeType) {
      case 'retail': return 'bg-green-50 border-green-200 text-green-800'
      case 'luxury': return 'bg-purple-50 border-purple-200 text-purple-800'
      case 'wholesale': return 'bg-blue-50 border-blue-200 text-blue-800'
      default: return 'bg-gray-50 border-gray-200 text-gray-800'
    }
  }

  if (!isMobile) return null

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}
      
      {/* Mobile drawer */}
      <div className={cn(
        'fixed top-0 left-0 h-full w-80 bg-background border-r z-50 transform transition-transform duration-300 ease-in-out',
        isOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className="p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Leaf className="h-6 w-6 text-green-600" />
              <div>
                <h2 className="font-semibold">{storeName}</h2>
                <Badge variant="outline" className={getStoreTheme()}>
                  {storeType.toUpperCase()}
                </Badge>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Navigation items */}
          <nav className="space-y-2">
            {navigationItems.map((item) => (
              <a
                key={item.title}
                href={item.href}
                onClick={onClose}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.title}</span>
              </a>
            ))}
          </nav>
        </div>
      </div>
    </>
  )
}

// Responsive cannabis product card
interface CannabisResponsiveCardProps {
  children: React.ReactNode
  variant?: 'default' | 'compact' | 'featured'
  className?: string
}

export function CannabisResponsiveCard({ 
  children, 
  variant = 'default',
  className = ''
}: CannabisResponsiveCardProps) {
  const { isMobile, isTablet } = useResponsive()

  const getCardStyles = () => {
    if (variant === 'compact' && isMobile) {
      return 'p-3 space-y-2'
    }
    if (variant === 'featured') {
      return 'p-6 space-y-4 md:p-8 md:space-y-6'
    }
    return 'p-4 space-y-3 md:p-6 md:space-y-4'
  }

  return (
    <Card className={cn(
      getCardStyles(),
      className
    )}>
      {children}
    </Card>
  )
}

// Responsive text component
interface CannabisResponsiveTextProps {
  children: React.ReactNode
  variant?: 'heading' | 'subheading' | 'body' | 'caption'
  className?: string
}

export function CannabisResponsiveText({ 
  children, 
  variant = 'body',
  className = ''
}: CannabisResponsiveTextProps) {
  const textStyles = {
    heading: 'text-2xl font-bold md:text-3xl lg:text-4xl',
    subheading: 'text-lg font-semibold md:text-xl lg:text-2xl',
    body: 'text-sm md:text-base',
    caption: 'text-xs md:text-sm text-muted-foreground'
  }

  return (
    <div className={cn(textStyles[variant], className)}>
      {children}
    </div>
  )
}

// Responsive spacing component
export function CannabisResponsiveSpacing({ 
  size = 'md',
  className = ''
}: { 
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string 
}) {
  const spacingStyles = {
    sm: 'h-2 md:h-3',
    md: 'h-4 md:h-6',
    lg: 'h-6 md:h-8',
    xl: 'h-8 md:h-12'
  }

  return <div className={cn(spacingStyles[size], className)} />
}

// Device indicator (for development/testing)
export function DeviceIndicator() {
  const { screenSize } = useResponsive()
  
  const getIcon = () => {
    switch (screenSize) {
      case 'mobile': return <Smartphone className="h-4 w-4" />
      case 'tablet': return <Tablet className="h-4 w-4" />
      case 'desktop': return <Monitor className="h-4 w-4" />
    }
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white px-3 py-2 rounded-lg text-sm font-mono flex items-center gap-2 z-50">
      {getIcon()}
      {screenSize}
    </div>
  )
}

// Export all components as default
export default {
  Container: CannabisResponsiveContainer,
  Grid: CannabisResponsiveGrid,
  Nav: CannabisResponsiveNav,
  Card: CannabisResponsiveCard,
  Text: CannabisResponsiveText,
  Spacing: CannabisResponsiveSpacing,
  DeviceIndicator,
  useResponsive
}