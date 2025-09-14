// Email Template Preview API - Official Medusa v2 API Route Pattern
// Provides live preview of React Email templates
// Reference: https://docs.medusajs.com/learn/fundamentals/api-routes

import type { Request, Response } from "express"
import { render } from '@react-email/render'
import * as path from 'path'

interface TemplatePreviewRequest extends Request {
  scope: any
  query: {
    template: string
    format?: 'html' | 'text'
  }
}

// ✅ Official Medusa v2 API Route Pattern
export const GET = async (
  req: TemplatePreviewRequest,
  res: Response
) => {
  try {
    const { template, format = 'html' } = req.query

    if (!template) {
      return res.status(400).json({ error: 'Template name required' })
    }

    console.log(`Generating preview for template: ${template}`)

    // ✅ Import template dynamically using absolute path
    try {
      const templatePath = `${process.cwd()}/src/email-templates/${template}.tsx`
      console.log(`Loading template from: ${templatePath}`)

      const TemplateComponent = await import(templatePath)

      // Comprehensive sample data for all template types
      const sampleData = {
        order: {
          display_id: 1001,
          total: 5000, // $50.00 in cents
          currency_code: 'usd',
          customer: {
            first_name: 'John',
            last_name: 'Doe'
          },
          items: [
            {
              title: 'Premium Cannabis Product',
              quantity: 1,
              unit_price: 4500,
              total: 4500,
              refunded_quantity: 1
            }
          ],
          shipping_address: {
            first_name: 'John',
            last_name: 'Doe',
            address_1: '123 Main St',
            city: 'Chicago',
            province: 'IL',
            postal_code: '60601',
            country_code: 'US'
          }
        },
        customer: {
          first_name: 'John',
          last_name: 'Doe',
          email: 'john@example.com'
        },
        store_name: 'Sample Store',
        store_domain: 'example.com',
        // Additional data for shipping templates
        shipping: {
          tracking_number: 'TRK123456789',
          carrier: 'FedEx',
          estimated_delivery: 'September 16, 2025',
          tracking_url: 'https://fedex.com/track/TRK123456789'
        },
        // Additional data for delivery templates
        delivery: {
          delivered_at: new Date().toISOString(),
          delivery_method: 'Standard Delivery',
          signature_required: true,
          delivered_to: 'Front Door'
        },
        // Additional data for payment templates
        payment: {
          method: 'Credit Card ending in 1234',
          failure_reason: 'Insufficient funds',
          retry_url: 'https://example.com/retry-payment'
        },
        // Additional data for cancellation templates
        cancellation: {
          reason: 'Customer requested cancellation',
          cancelled_by: 'customer',
          refund_amount: 5000,
          refund_method: 'Original payment method',
          refund_timeline: '3-5 business days'
        },
        // Additional data for refund templates
        refund: {
          amount: 5000,
          method: 'Credit Card ending in 1234',
          transaction_id: 'REF-123456789',
          processing_time: '3-5 business days',
          reason: 'Product return',
          partial: false
        },
        // Additional data for password reset
        reset_url: 'https://example.com/reset-password?token=abc123',
        expiry_time: '24 hours'
      }

      // ✅ Render template to HTML using React Email
      const emailHtml = await render(TemplateComponent.default(sampleData), {
        pretty: true
      })

      if (format === 'text') {
        // Convert HTML to text for text preview
        const textVersion = emailHtml
          .replace(/<[^>]*>/g, '')
          .replace(/\s+/g, ' ')
          .trim()

        res.setHeader('Content-Type', 'text/plain')
        res.send(textVersion)
      } else {
        // ✅ Enhanced HTML with red dynamic content + hover tooltips
        const variableMapping = {
          'John': 'customer.first_name',
          'Doe': 'customer.last_name',
          'john@example.com': 'customer.email',
          'Test': 'customer.first_name',
          '1001': 'order.display_id',
          '$50.00': 'order.total',
          'Sample Store': 'store_name',
          'Test Store': 'store_name',
          'example.com': 'store_domain',
          'localhost:9000': 'store_domain',
          'Premium Cannabis Product': 'item.title',
          'Sample Product': 'item.title',
          'TRK123456789': 'shipping.tracking_number',
          'FedEx': 'shipping.carrier',
          'TEST123456789': 'shipping.tracking_number'
        }

        let enhancedHtml = emailHtml

        // Add red styling and tooltips to dynamic content
        Object.entries(variableMapping).forEach(([value, variable]) => {
          const redTextPattern = new RegExp(`>${value}<`, 'g')
          const redTextReplacement = `><span style="color: #dc2626; background-color: #fef2f2; padding: 1px 3px; border-radius: 2px; cursor: help;" title="Variable: {${variable}}">${value}</span><`
          enhancedHtml = enhancedHtml.replace(redTextPattern, redTextReplacement)
        })

        // Add tooltip CSS for better hover experience
        const htmlWithTooltips = `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              [title]:hover::after {
                content: attr(title);
                position: absolute;
                background: #1e293b;
                color: #e2e8f0;
                padding: 8px 12px;
                border-radius: 6px;
                font-size: 12px;
                margin-top: 5px;
                z-index: 1000;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                white-space: nowrap;
              }
              body {
                position: relative;
              }
            </style>
          </head>
          <body>
            ${enhancedHtml}
          </body>
          </html>
        `

        res.setHeader('Content-Type', 'text/html')
        res.send(htmlWithTooltips)
      }

      console.log(`✅ Generated ${format} preview for template: ${template}`)

    } catch (templateError) {
      console.error(`Template not found: ${template}`, templateError)
      res.status(404).json({
        error: `Template '${template}' not found`,
        availableTemplates: ['order-confirmation', 'customer-welcome', 'order-shipped']
      })
    }

  } catch (error) {
    console.error('Error generating template preview:', error)
    res.status(500).json({ error: 'Failed to generate template preview' })
  }
}