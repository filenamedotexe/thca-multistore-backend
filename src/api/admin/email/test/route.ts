// Test Email API - Official Medusa v2 API Route Pattern
// Allows testing email functionality through the Email Operations Center
// Reference: https://docs.medusajs.com/learn/fundamentals/api-routes

import type { Request, Response } from "express"
import { render } from '@react-email/render'

interface TestEmailRequest extends Request {
  scope: any
  body: {
    template: string
    to: string
    store_name?: string
    test_data?: any
  }
}

// ✅ Official Medusa v2 API Route Pattern
export const POST = async (
  req: TestEmailRequest,
  res: Response
) => {
  try {
    const { template, to, store_name = 'Test Store', test_data } = req.body

    if (!template || !to) {
      return res.status(400).json({
        error: 'Missing required fields: template and to email address'
      })
    }

    console.log(`Testing email template: ${template} to: ${to}`)

    // ✅ Validate email address format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(to)) {
      return res.status(400).json({ error: 'Invalid email address format' })
    }

    try {
      // ✅ Import and render email template using absolute path
      const templatePath = `${process.cwd()}/src/email-templates/${template}.tsx`
      console.log(`Loading template from: ${templatePath}`)

      const TemplateComponent = await import(templatePath)

      // Generate comprehensive sample test data for all template types
      const sampleData = test_data || {
        order: {
          display_id: 1001,
          total: 5000, // $50.00 in cents
          currency_code: 'usd',
          customer: {
            first_name: 'Test',
            last_name: 'Customer'
          },
          items: [
            {
              title: 'Sample Product',
              quantity: 1,
              unit_price: 4500,
              total: 4500,
              refunded_quantity: 1
            }
          ],
          shipping_address: {
            first_name: 'Test',
            last_name: 'Customer',
            address_1: '123 Test St',
            city: 'Chicago',
            province: 'IL',
            postal_code: '60601',
            country_code: 'US'
          }
        },
        customer: {
          first_name: 'Test',
          last_name: 'Customer',
          email: to
        },
        store_name: store_name,
        store_domain: 'localhost:9000',
        // Additional data for all template types
        shipping: {
          tracking_number: 'TEST123456789',
          carrier: 'Test Carrier',
          estimated_delivery: 'September 16, 2025',
          tracking_url: 'https://test-carrier.com/track/TEST123456789'
        },
        delivery: {
          delivered_at: new Date().toISOString(),
          delivery_method: 'Test Delivery',
          signature_required: true,
          delivered_to: 'Front Door'
        },
        payment: {
          method: 'Test Credit Card',
          failure_reason: 'Test failure for demo',
          retry_url: 'https://localhost:9000/retry-payment'
        },
        cancellation: {
          reason: 'Test cancellation',
          cancelled_by: 'customer',
          refund_amount: 5000,
          refund_method: 'Original payment method',
          refund_timeline: '3-5 business days'
        },
        refund: {
          amount: 5000,
          method: 'Test Credit Card',
          transaction_id: 'TEST-REF-123456789',
          processing_time: '3-5 business days',
          reason: 'Test refund',
          partial: false
        },
        reset_url: 'https://localhost:9000/reset-password?token=test123',
        expiry_time: '24 hours'
      }

      // ✅ Render email template to HTML
      const emailHtml = await render(TemplateComponent.default(sampleData), {
        pretty: true
      })

      // ✅ Check if Resend is configured for real sending
      const resendApiKey = process.env.RESEND_API_KEY
      const canSendReal = resendApiKey && !resendApiKey.startsWith('re_REPLACE_WITH_')

      if (canSendReal) {
        // ✅ Send real email via Resend
        const { Resend } = await import('resend')
        const resend = new Resend(resendApiKey)

        const emailResult = await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL || 'test@localhost.com',
          to: [to],
          subject: `Test Email: ${template.replace(/-/g, ' ')}`,
          html: emailHtml
        })

        if (emailResult.error) {
          console.error('Resend API error:', emailResult.error)
          return res.status(500).json({
            error: 'Failed to send email via Resend',
            details: emailResult.error
          })
        }

        console.log('✅ Test email sent successfully via Resend:', emailResult.data?.id)
        res.json({
          success: true,
          message: `Test email sent to ${to}`,
          email_id: emailResult.data?.id,
          template_used: template,
          sent_via: 'resend'
        })

      } else {
        // ✅ Development mode - return rendered HTML for preview
        console.log('Resend not configured, returning HTML preview for development')
        res.json({
          success: true,
          message: `Test email rendered for ${to} (Resend not configured)`,
          template_used: template,
          html_preview: emailHtml,
          sent_via: 'preview_only'
        })
      }

    } catch (templateError) {
      console.error(`Template error for ${template}:`, templateError)
      res.status(404).json({
        error: `Template '${template}' not found or failed to render`,
        available_templates: ['order-confirmation', 'customer-welcome']
      })
    }

  } catch (error) {
    console.error('Error testing email:', error)
    res.status(500).json({ error: 'Failed to test email' })
  }
}