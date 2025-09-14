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

      // Sample data for preview
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
              total: 4500
            }
          ]
        },
        store_name: 'Sample Store',
        store_domain: 'example.com',
        customer: {
          first_name: 'John',
          last_name: 'Doe',
          email: 'john@example.com'
        }
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
        // Return HTML for preview
        res.setHeader('Content-Type', 'text/html')
        res.send(emailHtml)
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