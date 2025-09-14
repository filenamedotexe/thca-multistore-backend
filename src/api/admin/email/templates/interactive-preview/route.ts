// Interactive Template Preview API - Shows variables with hover examples
// Reference: https://docs.medusajs.com/learn/fundamentals/api-routes

import type { Request, Response } from "express"
import * as fs from 'fs'
import * as path from 'path'

interface InteractivePreviewRequest extends Request {
  scope: any
  query: {
    template: string
  }
}

// Variable mapping for interactive examples
const variableExamples = {
  'customer.first_name': 'Jeff',
  'customer.last_name': 'Johnson',
  'customer.email': 'jeff@example.com',
  'order.display_id': '1001',
  'order.total': '$50.00',
  'order.currency_code': 'USD',
  'store_name': 'Straight Gas',
  'store_domain': 'straight-gas.com',
  'shipping.tracking_number': 'TRK123456789',
  'shipping.carrier': 'FedEx',
  'shipping.estimated_delivery': 'September 16, 2025',
  'payment.method': 'Credit Card ending in 1234',
  'cancellation.reason': 'Customer requested cancellation',
  'refund.amount': '$50.00',
  'delivery.delivered_at': 'September 14, 2025 at 3:30 PM'
}

// ✅ Official Medusa v2 API Route Pattern
export const GET = async (
  req: InteractivePreviewRequest,
  res: Response
) => {
  try {
    const { template } = req.query

    if (!template) {
      return res.status(400).json({ error: 'Template name required' })
    }

    console.log(`Generating interactive preview for template: ${template}`)

    // ✅ Read template source code
    const templatesDir = path.join(process.cwd(), 'src', 'email-templates')
    const templatePath = path.join(templatesDir, `${template}.tsx`)

    try {
      if (fs.existsSync(templatePath)) {
        let sourceCode = fs.readFileSync(templatePath, 'utf8')

        // ✅ Add interactive variable highlighting with tooltips
        Object.entries(variableExamples).forEach(([variable, example]) => {
          // Find patterns like {customer.first_name} and make them interactive
          const patterns = [
            `{${variable}}`,
            `\${${variable}}`,
            `{${variable} ||`,
            `{${variable}?.`
          ]

          patterns.forEach(pattern => {
            if (sourceCode.includes(pattern)) {
              const highlightedVariable = `<span
                class="variable-highlight"
                title="Example: ${example}"
                style="background-color: #fef3c7; padding: 2px 4px; border-radius: 3px; cursor: help; border-bottom: 1px dashed #f59e0b;"
                onmouseover="this.style.backgroundColor='#fde68a'"
                onmouseout="this.style.backgroundColor='#fef3c7'"
              >{${variable}}</span>`

              sourceCode = sourceCode.replace(new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), highlightedVariable)
            }
          })
        })

        // ✅ Wrap in HTML with CSS for interactive preview
        const interactiveHTML = `
<!DOCTYPE html>
<html>
<head>
  <title>Interactive Template Preview: ${template}</title>
  <style>
    body {
      font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
      padding: 20px;
      background: #f8fafc;
      line-height: 1.6;
    }
    .template-header {
      background: #1e293b;
      color: #e2e8f0;
      padding: 15px;
      border-radius: 8px;
      margin-bottom: 20px;
      font-weight: bold;
    }
    .variable-highlight {
      background-color: #fef3c7 !important;
      padding: 2px 4px !important;
      border-radius: 3px !important;
      cursor: help !important;
      border-bottom: 1px dashed #f59e0b !important;
      position: relative;
    }
    .variable-highlight:hover {
      background-color: #fde68a !important;
    }
    .variable-highlight:hover::after {
      content: attr(title);
      position: absolute;
      bottom: 25px;
      left: 50%;
      transform: translateX(-50%);
      background: #1e293b;
      color: #e2e8f0;
      padding: 8px 12px;
      border-radius: 6px;
      font-size: 12px;
      white-space: nowrap;
      z-index: 1000;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    }
    .code-block {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 20px;
      white-space: pre-wrap;
      overflow-x: auto;
      max-height: 80vh;
      overflow-y: auto;
    }
    .instructions {
      background: #dbeafe;
      border: 1px solid #93c5fd;
      border-radius: 8px;
      padding: 15px;
      margin-bottom: 20px;
      color: #1e40af;
    }
  </style>
</head>
<body>
  <div class="template-header">
    Interactive Template Preview: ${template}
  </div>

  <div class="instructions">
    <strong>🎯 Interactive Variables:</strong> Hover over highlighted variables to see example values.<br>
    <strong>Example:</strong> {customer.first_name} → Jeff | {order.display_id} → 1001 | {store_name} → Straight Gas
  </div>

  <div class="code-block">${sourceCode}</div>
</body>
</html>`

        res.setHeader('Content-Type', 'text/html')
        res.send(interactiveHTML)

        console.log(`✅ Generated interactive preview for template: ${template}`)

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
    console.error('Error generating interactive preview:', error)
    res.status(500).json({ error: 'Failed to generate interactive preview' })
  }
}