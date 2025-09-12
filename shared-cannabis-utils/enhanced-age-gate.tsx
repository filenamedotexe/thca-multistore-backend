'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, Shield, Calendar, CheckCircle, Lock } from 'lucide-react'
import { trackCannabisEvent } from './cannabis-types'

interface AgeVerificationData {
  verified: boolean
  age: number
  verificationDate: string
  expiresAt: string
  method: 'date_of_birth' | 'third_party' // Future: add third-party verification
  storeType: string
}

interface EnhancedAgeGateProps {
  storeType?: 'retail' | 'luxury' | 'wholesale'
  storeName?: string
  onVerified?: () => void
}

export default function EnhancedAgeGate({ 
  storeType = 'retail',
  storeName = 'Cannabis Store',
  onVerified 
}: EnhancedAgeGateProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [step, setStep] = useState<'landing' | 'verification' | 'business'>('landing')
  const [formData, setFormData] = useState({
    dateOfBirth: '',
    // Future: business verification for wholesale
    businessName: '',
    businessLicense: '',
    taxId: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    checkExistingVerification()
  }, [])

  const checkExistingVerification = () => {
    try {
      const stored = localStorage.getItem('cannabis_age_verified')
      if (stored) {
        const verification: AgeVerificationData = JSON.parse(stored)
        const now = new Date()
        const expiresAt = new Date(verification.expiresAt)
        
        // Check if verification is still valid (30 days) and for correct store type
        if (now < expiresAt && verification.verified && 
            (verification.storeType === storeType || verification.storeType === 'all')) {
          setIsOpen(false)
          onVerified?.()
          return
        }
      }
      
      // No valid verification found
      setIsOpen(true)
    } catch (error) {
      console.error('Age verification check failed:', error)
      setIsOpen(true)
    }
  }

  const calculateAge = (birthDate: Date): number => {
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    
    return age
  }

  const handleAgeVerification = async () => {
    if (!formData.dateOfBirth) {
      setError('Date of birth is required')
      return
    }

    setLoading(true)
    setError('')

    try {
      const birthDate = new Date(formData.dateOfBirth)
      const age = calculateAge(birthDate)
      
      // Check minimum age (21 for cannabis)
      if (age < 21) {
        setError('You must be at least 21 years old to access cannabis products')
        trackCannabisEvent('age_verification_failed', { age, reason: 'underage' })
        setLoading(false)
        return
      }

      // For wholesale, require business verification
      if (storeType === 'wholesale') {
        setStep('business')
        setLoading(false)
        return
      }

      // Complete age verification
      await completeVerification(age, 'date_of_birth')
      
    } catch (error) {
      setError('Verification failed. Please try again.')
      console.error('Age verification error:', error)
      trackCannabisEvent('age_verification_error', { error: (error as Error).message })
    } finally {
      setLoading(false)
    }
  }

  const handleBusinessVerification = async () => {
    if (!formData.businessName || !formData.businessLicense) {
      setError('Business name and license number are required')
      return
    }

    setLoading(true)
    setError('')

    try {
      // Simple business verification (can be enhanced later)
      const age = calculateAge(new Date(formData.dateOfBirth))
      await completeVerification(age, 'date_of_birth', {
        business_name: formData.businessName,
        business_license: formData.businessLicense,
        tax_id: formData.taxId
      })
      
    } catch (error) {
      setError('Business verification failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const completeVerification = async (age: number, method: string, businessData?: any) => {
    const verificationData: AgeVerificationData = {
      verified: true,
      age: age,
      verificationDate: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
      method: method as any,
      storeType: storeType
    }

    // Store verification (localStorage for simplicity, can be enhanced with backend storage)
    localStorage.setItem('cannabis_age_verified', JSON.stringify(verificationData))
    
    // Store business data separately for wholesale
    if (businessData) {
      localStorage.setItem('business_verified', JSON.stringify({
        ...businessData,
        verified: true,
        verificationDate: new Date().toISOString()
      }))
    }

    // Track successful verification
    trackCannabisEvent('age_verification_completed', {
      age_group: age >= 65 ? '65+' : age >= 35 ? '35-64' : '21-34',
      store_type: storeType,
      method: method,
      business_verification: !!businessData
    })

    setIsOpen(false)
    onVerified?.()
  }

  if (!isOpen) return null

  const getStoreSpecificMessage = () => {
    switch (storeType) {
      case 'luxury':
        return "Access our premium cannabis collection"
      case 'wholesale':
        return "B2B wholesale cannabis for licensed businesses"
      default:
        return "Browse our cannabis product catalog"
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        {step === 'landing' && (
          <>
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <CardTitle className="text-2xl font-bold">Age Verification Required</CardTitle>
              <p className="text-muted-foreground">
                {getStoreSpecificMessage()}
              </p>
              {storeType === 'wholesale' && (
                <Badge variant="secondary" className="mt-2">
                  Business License Required
                </Badge>
              )}
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-sm text-amber-800">
                  <strong>Legal Notice:</strong> You must be 21 or older to access cannabis products. 
                  Cannabis products have not been evaluated by the FDA. Keep out of reach of children.
                  {storeType === 'wholesale' && ' Business license verification required for wholesale access.'}
                </p>
              </div>
              
              <Button 
                onClick={() => setStep('verification')} 
                className="w-full"
              >
                <Shield className="w-4 h-4 mr-2" />
                Continue to Age Verification
              </Button>
              
              <p className="text-xs text-muted-foreground text-center">
                By continuing, you confirm you meet all legal requirements for cannabis access
              </p>
            </CardContent>
          </>
        )}
        
        {step === 'verification' && (
          <>
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle className="text-xl font-bold">Enter Your Date of Birth</CardTitle>
              <p className="text-muted-foreground text-sm">
                Required for {storeName} access verification
              </p>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div>
                <label htmlFor="dob" className="block text-sm font-medium mb-2">
                  Date of Birth:
                </label>
                <Input
                  id="dob"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                  max={new Date(Date.now() - 18 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                  className="w-full"
                />
              </div>
              
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600" />
                    <span className="text-sm text-red-800 font-medium">{error}</span>
                  </div>
                </div>
              )}
              
              <Button 
                onClick={handleAgeVerification} 
                disabled={loading || !formData.dateOfBirth}
                className="w-full"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Verifying Age...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Verify Age
                  </>
                )}
              </Button>
            </CardContent>
          </>
        )}
        
        {step === 'business' && (
          <>
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Lock className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle className="text-xl font-bold">Business Verification</CardTitle>
              <p className="text-muted-foreground text-sm">
                Wholesale access requires valid cannabis business license
              </p>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Business Name</label>
                <Input
                  value={formData.businessName}
                  onChange={(e) => setFormData(prev => ({ ...prev, businessName: e.target.value }))}
                  placeholder="Your Cannabis Business LLC"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Cannabis License Number</label>
                <Input
                  value={formData.businessLicense}
                  onChange={(e) => setFormData(prev => ({ ...prev, businessLicense: e.target.value }))}
                  placeholder="LIC-123456789"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Tax ID / EIN (Optional)</label>
                <Input
                  value={formData.taxId}
                  onChange={(e) => setFormData(prev => ({ ...prev, taxId: e.target.value }))}
                  placeholder="12-3456789"
                />
              </div>
              
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600" />
                    <span className="text-sm text-red-800 font-medium">{error}</span>
                  </div>
                </div>
              )}
              
              <Button 
                onClick={handleBusinessVerification} 
                disabled={loading || !formData.businessName || !formData.businessLicense}
                className="w-full"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Verifying Business...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Verify Business License
                  </>
                )}
              </Button>
              
              <div className="text-xs text-muted-foreground bg-gray-50 p-3 rounded-lg">
                <p><strong>B2B Notice:</strong> Wholesale access requires valid cannabis business licensing. 
                Minimum order value: $500. Volume discounts available for verified businesses.</p>
              </div>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  )
}