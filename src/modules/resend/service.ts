// Official Medusa v2 Resend Notification Provider
// Reference: https://docs.medusajs.com/resources/integrations/guides/resend

import { AbstractNotificationProviderService } from "@medusajs/utils"
import { Logger } from "@medusajs/types"
import { Resend } from "resend"

type InjectedDependencies = {
  logger: Logger
}

interface ResendNotificationProviderOptions {
  channels: string[]
  api_key: string
  from: string
}

interface NotificationData {
  template: string
  to: string
  data: any
}

class ResendNotificationProviderService extends AbstractNotificationProviderService {
  protected logger_: Logger
  protected resend_: Resend
  protected options_: ResendNotificationProviderOptions

  constructor({ logger }: InjectedDependencies, options: ResendNotificationProviderOptions) {
    super()
    this.logger_ = logger
    this.options_ = options
    this.resend_ = new Resend(options.api_key)
  }

  async send(notification: NotificationData): Promise<{ success: boolean; data?: any }> {
    try {
      console.log('Sending email via Resend:', notification.template, 'to:', notification.to)

      // ✅ Import React Email template dynamically
      const template = await this.getReactEmailTemplate(notification.template, notification.data)

      // ✅ Send email using official Resend API
      const result = await this.resend_.emails.send({
        from: this.options_.from,
        to: [notification.to],
        subject: this.getEmailSubject(notification.template, notification.data),
        react: template,
      })

      if (result.error) {
        this.logger_.error('Resend API error:', result.error)
        return { success: false }
      }

      this.logger_.info('Email sent successfully via Resend:', result.data?.id)
      return { success: true, data: result.data }

    } catch (error) {
      this.logger_.error('Failed to send email via Resend:', error)
      return { success: false }
    }
  }

  private async getReactEmailTemplate(template: string, data: any) {
    try {
      // ✅ Dynamic template import based on template name
      const TemplateComponent = await import(`../../../email-templates/${template}`)
      return TemplateComponent.default(data)
    } catch (error) {
      this.logger_.error(`Template not found: ${template}`, error)
      // Fallback to simple text template
      return `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>${this.getEmailSubject(template, data)}</h2>
          <p>Thank you for your business!</p>
          <pre>${JSON.stringify(data, null, 2)}</pre>
        </div>
      `
    }
  }

  private getEmailSubject(template: string, data: any): string {
    switch (template) {
      case 'order-confirmation':
        return `Order Confirmation #${data.order?.display_id || data.order_id}`
      case 'order-shipped':
        return `Order Shipped #${data.order?.display_id || data.order_id}`
      case 'customer-welcome':
        return `Welcome to ${data.store_name || 'our store'}!`
      case 'password-reset':
        return 'Password Reset Request'
      default:
        return 'Notification'
    }
  }
}

export default ResendNotificationProviderService