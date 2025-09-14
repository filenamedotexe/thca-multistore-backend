// Email Template Edit API - Official Medusa v2 API Route Pattern
// Allows reading and editing React Email template source code
// Reference: https://docs.medusajs.com/learn/fundamentals/api-routes

import type { Request, Response } from "express"
import * as fs from 'fs'
import * as path from 'path'

interface TemplateEditRequest extends Request {
  scope: any
  query: {
    template: string
  }
  body: {
    content?: string
  }
}

// ✅ Get template source code for editing
export const GET = async (
  req: TemplateEditRequest,
  res: Response
) => {
  try {
    const { template } = req.query

    if (!template) {
      return res.status(400).json({ error: 'Template name required' })
    }

    console.log(`Getting source code for template: ${template}`)

    // ✅ Read template source code from filesystem
    const templatesDir = path.join(process.cwd(), 'src', 'email-templates')
    const templatePath = path.join(templatesDir, `${template}.tsx`)

    try {
      if (fs.existsSync(templatePath)) {
        const sourceCode = fs.readFileSync(templatePath, 'utf8')

        res.json({
          success: true,
          template: template,
          sourceCode: sourceCode,
          filePath: templatePath
        })

        console.log(`✅ Retrieved source code for template: ${template}`)
      } else {
        res.status(404).json({
          error: `Template '${template}' not found`,
          templatePath
        })
      }

    } catch (fsError) {
      console.error(`Error reading template file: ${template}`, fsError)
      res.status(500).json({ error: 'Failed to read template file' })
    }

  } catch (error) {
    console.error('Error getting template source:', error)
    res.status(500).json({ error: 'Failed to get template source' })
  }
}

// ✅ Save template source code changes
export const PUT = async (
  req: TemplateEditRequest,
  res: Response
) => {
  try {
    const { template } = req.query
    const { content } = req.body

    if (!template || !content) {
      return res.status(400).json({ error: 'Template name and content required' })
    }

    console.log(`Saving changes to template: ${template}`)

    // ✅ Validate content is proper TypeScript/React
    if (!content.includes('export default') || !content.includes('React.Email')) {
      return res.status(400).json({
        error: 'Invalid template content - must be a valid React Email component'
      })
    }

    // ✅ Write updated template to filesystem
    const templatesDir = path.join(process.cwd(), 'src', 'email-templates')
    const templatePath = path.join(templatesDir, `${template}.tsx`)

    try {
      // Backup original file
      const backupPath = `${templatePath}.backup.${Date.now()}`
      if (fs.existsSync(templatePath)) {
        fs.copyFileSync(templatePath, backupPath)
      }

      // Write new content
      fs.writeFileSync(templatePath, content, 'utf8')

      res.json({
        success: true,
        message: `Template '${template}' updated successfully`,
        template: template,
        backupCreated: backupPath
      })

      console.log(`✅ Updated template: ${template}`)

    } catch (fsError) {
      console.error(`Error writing template file: ${template}`, fsError)
      res.status(500).json({ error: 'Failed to save template changes' })
    }

  } catch (error) {
    console.error('Error saving template:', error)
    res.status(500).json({ error: 'Failed to save template' })
  }
}