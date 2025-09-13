'use client'

// Cannabis Toast Notifications - Official Sonner Component
// Reference: https://ui.shadcn.com/docs/components/sonner

import { toast } from 'sonner'

export class CannabisToasts {
  
  // Age verification success
  static ageVerificationSuccess() {
    toast.success("Age Verification Complete", {
      description: "You have been verified as 21+ and can browse cannabis products.",
      duration: 5000
    })
  }

  // Age verification failed
  static ageVerificationFailed() {
    toast.error("Age Verification Required", {
      description: "You must be 21+ to access cannabis products. Please verify your age.",
      duration: 8000
    })
  }

  // Product added to cart
  static productAddedToCart(productName: string) {
    toast.success("Added to Cart", {
      description: `${productName} has been added to your cannabis order.`,
      duration: 3000
    })
  }

  // COA certificate viewed
  static coaCertificateViewed(batchNumber: string) {
    toast.info("COA Certificate Accessed", {
      description: `Lab results for batch ${batchNumber} are now available.`,
      duration: 4000
    })
  }

  // Cannabis compliance check
  static complianceCheckPassed() {
    toast.success("Compliance Check Passed", {
      description: "Your cannabis order meets all regulatory requirements.",
      duration: 4000
    })
  }

  // Cannabis compliance warning
  static complianceWarning(message: string) {
    toast.warning("Compliance Notice", {
      description: message,
      duration: 8000
    })
  }

  // Order confirmation
  static orderConfirmed(orderNumber: string) {
    toast.success("Cannabis Order Confirmed", {
      description: `Order #${orderNumber} has been confirmed. You'll receive an email shortly.`,
      duration: 6000
    })
  }

  // Payment processing
  static paymentProcessing() {
    toast.loading("Processing Payment", {
      description: "Your cannabis order payment is being processed securely..."
    })
  }

  // Payment success
  static paymentSuccess() {
    toast.success("Payment Successful", {
      description: "Your cannabis order payment has been processed successfully.",
      duration: 5000
    })
  }

  // Payment failed
  static paymentFailed(reason?: string) {
    toast.error("Payment Failed", {
      description: reason || "There was an issue processing your cannabis order payment.",
      duration: 8000
    })
  }

  // Inventory warning
  static lowInventoryWarning(productName: string, remaining: number) {
    toast.warning("Limited Stock", {
      description: `Only ${remaining} units of ${productName} remaining in stock.`,
      duration: 6000
    })
  }

  // Shipping update
  static shippingUpdate(status: string, trackingNumber?: string) {
    toast.info("Shipping Update", {
      description: trackingNumber 
        ? `Your cannabis order is ${status}. Tracking: ${trackingNumber}`
        : `Your cannabis order is ${status}.`,
      duration: 5000
    })
  }

  // Account verification
  static accountVerificationRequired() {
    toast.warning("Account Verification Required", {
      description: "Please verify your account to continue with cannabis purchases.",
      duration: 8000
    })
  }

  // Location restriction
  static locationRestricted(location: string) {
    toast.error("Location Restricted", {
      description: `Cannabis delivery is not available in ${location}. Please check local regulations.`,
      duration: 10000
    })
  }

  // Product out of stock
  static productOutOfStock(productName: string) {
    toast.error("Product Unavailable", {
      description: `${productName} is currently out of stock. We'll notify you when it's available.`,
      duration: 6000
    })
  }

  // General error
  static error(title: string, description?: string) {
    toast.error(title, {
      description: description,
      duration: 6000
    })
  }

  // General success
  static success(title: string, description?: string) {
    toast.success(title, {
      description: description,
      duration: 4000
    })
  }

  // General info
  static info(title: string, description?: string) {
    toast.info(title, {
      description: description,
      duration: 4000
    })
  }

  // Dismiss all toasts
  static dismissAll() {
    toast.dismiss()
  }
}

export default CannabisToasts