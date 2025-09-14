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

      // Generate sample test data based on template type
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
              total: 4500
            }
          ]
        },
        customer: {
          first_name: 'Test',
          last_name: 'Customer',
          email: to
        },
        store_name: store_name,
        store_domain: 'localhost:9000'
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