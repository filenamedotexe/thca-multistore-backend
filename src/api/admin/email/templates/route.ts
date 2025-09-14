// Email Templates Management API - Official Medusa v2 API Route Pattern
// Manages React Email templates with live preview
// Reference: https://docs.medusajs.com/learn/fundamentals/api-routes

import type { Request, Response } from "express"
import * as fs from 'fs'
import * as path from 'path'

interface EmailTemplate {
  id: string
  name: string
  type: 'order' | 'customer' | 'marketing'
  status: 'active' | 'draft'
  lastUsed: string
  subject: string
  filePath: string
}

// ✅ Official Medusa v2 API Route Pattern
export const GET = async (
  req: Request & { scope: any },
  res: Response
) => {
  try {
    console.log('Fetching email templates for operations center')

    // ✅ Read templates from filesystem
    const templatesDir = path.join(process.cwd(), 'src', 'email-templates')
    const templates: EmailTemplate[] = []

    try {
      // Check if templates directory exists
      if (fs.existsSync(templatesDir)) {
        const files = fs.readdirSync(templatesDir)

        files.forEach((file) => {
          if (file.endsWith('.tsx')) {
            const templateName = file.replace('.tsx', '')

            // Read template file to extract metadata
            const filePath = path.join(templatesDir, file)
            const stats = fs.statSync(filePath)

            templates.push({
              id: templateName,
              name: templateName.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
              type: templateName.includes('order') ? 'order' :
                    templateName.includes('customer') ? 'customer' : 'marketing',
              status: 'active',
              lastUsed: stats.mtime.toISOString(),
              subject: `${templateName.replace(/-/g, ' ')} Template`,
              filePath: filePath
            })
          }
        })
      }

      // Add default templates if none exist
      if (templates.length === 0) {
        templates.push(
          {
            id: 'order-confirmation',
            name: 'Order Confirmation',
            type: 'order',
            status: 'active',
            lastUsed: new Date().toISOString(),
            subject: 'Order Confirmation #{order_id}',
            filePath: path.join(templatesDir, 'order-confirmation.tsx')
          },
          {
            id: 'customer-welcome',
            name: 'Customer Welcome',
            type: 'customer',
            status: 'draft',
            lastUsed: new Date(Date.now() - 86400000).toISOString(),
            subject: 'Welcome to {store_name}!',
            filePath: path.join(templatesDir, 'customer-welcome.tsx')
          },
          {
            id: 'order-shipped',
            name: 'Order Shipped',
            type: 'order',
            status: 'draft',
            lastUsed: new Date(Date.now() - 172800000).toISOString(),
            subject: 'Your order #{order_id} has shipped!',
            filePath: path.join(templatesDir, 'order-shipped.tsx')
          }
        )
      }

      console.log(`✅ Found ${templates.length} email templates`)
      res.json({ templates })

    } catch (fsError) {
      console.error('Error reading templates directory:', fsError)

      // Return empty templates list if directory doesn't exist
      res.json({ templates: [] })
    }

  } catch (error) {
    console.error('Error fetching email templates:', error)
    res.status(500).json({ error: 'Failed to fetch email templates' })
  }
}

// ✅ Create new email template
export const POST = async (
  req: Request & { scope: any },
  res: Response
) => {
  try {
    const { name, type, subject, content } = req.body

    if (!name || !type || !subject) {
      return res.status(400).json({ error: 'Missing required fields: name, type, subject' })
    }

    // ✅ Create template file
    const templatesDir = path.join(process.cwd(), 'src', 'email-templates')
    const templateId = name.toLowerCase().replace(/\s+/g, '-')
    const filePath = path.join(templatesDir, `${templateId}.tsx`)

    // Ensure templates directory exists
    if (!fs.existsSync(templatesDir)) {
      fs.mkdirSync(templatesDir, { recursive: true })
    }

    // Generate basic React Email template
    const templateContent = `// ${name} Email Template - React Email
// Generated via Email Operations Center

import React from 'react'
import { Html, Head, Preview, Body, Container, Section, Heading, Text } from '@react-email/components'

interface ${name.replace(/\s/g, '')}Props {
  data: any
}

const ${name.replace(/\s/g, '')}Template = ({ data }: ${name.replace(/\s/g, '')}Props) => {
  return (
    <Html>
      <Head />
      <Preview>${subject}</Preview>
      <Body style={{ backgroundColor: '#f6f9fc', fontFamily: 'Arial, sans-serif' }}>
        <Container style={{ margin: '0 auto', padding: '20px 0 48px', maxWidth: '580px' }}>
          <Section style={{ padding: '24px', backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e6ebf1' }}>
            <Heading style={{ color: '#1a1a1a', fontSize: '24px', fontWeight: 'bold', margin: '0 0 16px 0' }}>
              ${name}
            </Heading>
            <Text style={{ color: '#666666', fontSize: '16px', margin: '0' }}>
              ${content || 'Template content goes here...'}
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export default ${name.replace(/\s/g, '')}Template`

    fs.writeFileSync(filePath, templateContent)

    console.log(`✅ Created email template: ${templateId}`)
    res.json({
      success: true,
      template: {
        id: templateId,
        name,
        type,
        status: 'draft',
        lastUsed: new Date().toISOString(),
        subject,
        filePath
      }
    })

  } catch (error) {
    console.error('Error creating email template:', error)
    res.status(500).json({ error: 'Failed to create email template' })
  }
}