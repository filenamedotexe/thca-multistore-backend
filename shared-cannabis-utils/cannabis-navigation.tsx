'use client'

// Cannabis Store Navigation - Official shadcn/ui Navigation Menu Pattern
// Reference: https://ui.shadcn.com/docs/components/navigation-menu

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Menu, 
  ShoppingCart, 
  User, 
  Leaf,
  Certificate,
  Shield
} from 'lucide-react'

interface CannabisNavigationProps {
  storeType: 'retail' | 'luxury' | 'wholesale'
  storeName: string
  cartItemCount?: number
  isAgeVerified: boolean
}

export default function CannabisNavigation({ 
  storeType, 
  storeName, 
  cartItemCount = 0,
  isAgeVerified 
}: CannabisNavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const getStoreTheme = () => {
    switch (storeType) {
      case 'retail': return 'text-green-600 border-green-200'
      case 'luxury': return 'text-purple-600 border-purple-200'
      case 'wholesale': return 'text-blue-600 border-blue-200'
      default: return 'text-green-600 border-green-200'
    }
  }

  const navigationItems = [
    { title: 'Products', href: '/us/products', icon: Leaf },
    { title: 'COA Certificates', href: '/coa', icon: Certificate },
    { title: 'Compliance', href: '/compliance', icon: Shield }
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        
        {/* Store Logo */}
        <div className="flex items-center space-x-2">
          <Link href="/us" className={`text-xl font-bold ${getStoreTheme().split(' ')[0]}`}>
            <Leaf className="h-6 w-6 inline mr-2" />
            {storeName}
          </Link>
          <Badge variant="outline" className={getStoreTheme()}>
            {storeType.toUpperCase()}
          </Badge>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:block">
          <NavigationMenu>
            <NavigationMenuList>
              {navigationItems.map((item) => (
                <NavigationMenuItem key={item.title}>
                  <Link href={item.href} legacyBehavior passHref>
                    <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50">
                      <item.icon className="h-4 w-4 mr-2" />
                      {item.title}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Cart & User Actions */}
        <div className="flex items-center space-x-4">
          {isAgeVerified && (
            <Link href="/us/cart" className="relative">
              <Button variant="outline" size="sm">
                <ShoppingCart className="h-4 w-4" />
                {cartItemCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                    {cartItemCount}
                  </Badge>
                )}
              </Button>
            </Link>
          )}
          
          <Link href="/us/account">
            <Button variant="outline" size="sm">
              <User className="h-4 w-4" />
            </Button>
          </Link>

          {/* Mobile Menu Trigger */}
          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="flex flex-col space-y-4 pt-6">
                  {navigationItems.map((item) => (
                    <Link
                      key={item.title}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center space-x-2 text-lg font-medium"
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  ))}
                  <Separator className="my-4" />
                  {isAgeVerified && (
                    <Link href="/us/cart" className="flex items-center space-x-2">
                      <ShoppingCart className="h-5 w-5" />
                      <span>Cart ({cartItemCount})</span>
                    </Link>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}