// Payment Failed Email Template - React Email
// Professional transactional email with dynamic variables

import React from 'react'
import { Html, Head, Preview, Body, Container, Section, Heading, Text, Button } from '@react-email/components'

interface PaymentFailedProps {
  order: {
    display_id: number
    total: number
    currency_code: string
    customer?: {
      first_name?: string
      last_name?: string
    }
  }
  payment: {
    method?: string
    failure_reason?: string
    retry_url?: string
  }
  store_name: string
  store_domain: string
}

const PaymentFailedTemplate = ({ order, payment, store_name, store_domain }: PaymentFailedProps) => {
  const customerName = order.customer?.first_name || 'Valued Customer'

  return (
    <Html>
      <Head />
      <Preview>Payment issue with your order #{String(order.display_id)} - Action Required</Preview>
      <Body style={{ backgroundColor: '#f6f9fc', fontFamily: 'Arial, sans-serif' }}>
        <Container style={{ margin: '0 auto', padding: '20px 0 48px', maxWidth: '580px' }}>

          {/* Header */}
          <Section style={{ padding: '24px', backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e6ebf1' }}>
            <Heading style={{ color: '#dc2626', fontSize: '24px', fontWeight: 'bold', margin: '0 0 16px 0' }}>
              Payment Issue - Action Required
            </Heading>
            <Text style={{ color: '#666666', fontSize: '16px', margin: '0' }}>
              Hi {customerName},
            </Text>
            <Text style={{ color: '#666666', fontSize: '16px', margin: '16px 0 0 0' }}>
              We had trouble processing the payment for your order #{String(order.display_id)} with {store_name}.
            </Text>
          </Section>

          {/* Payment Details */}
          <Section style={{ padding: '24px', backgroundColor: '#fef2f2', borderRadius: '8px', border: '1px solid #fecaca', marginTop: '16px' }}>
            <Heading style={{ color: '#dc2626', fontSize: '18px', fontWeight: 'bold', margin: '0 0 16px 0' }}>
              Payment Information
            </Heading>

            <Text style={{ color: '#666666', fontSize: '14px', margin: '0 0 8px 0' }}>
              <strong>Order Total:</strong> ${(order.total / 100).toFixed(2)} {order.currency_code?.toUpperCase() || 'USD'}
            </Text>

            {payment.method && (
              <Text style={{ color: '#666666', fontSize: '14px', margin: '0 0 8px 0' }}>
                <strong>Payment Method:</strong> {payment.method}
              </Text>
            )}

            {payment.failure_reason && (
              <Text style={{ color: '#dc2626', fontSize: '14px', margin: '0 0 16px 0' }}>
                <strong>Issue:</strong> {payment.failure_reason}
              </Text>
            )}

            <Text style={{ color: '#666666', fontSize: '14px', margin: '0' }}>
              Don't worry - your order is still reserved and we'll hold it for 24 hours while you update your payment.
            </Text>
          </Section>

          {/* Action Required */}
          <Section style={{ padding: '24px', backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e6ebf1', marginTop: '16px', textAlign: 'center' }}>
            <Heading style={{ color: '#1a1a1a', fontSize: '18px', fontWeight: 'bold', margin: '0 0 16px 0' }}>
              Complete Your Order
            </Heading>

            <Text style={{ color: '#666666', fontSize: '16px', margin: '0 0 20px 0' }}>
              Update your payment method to complete your purchase:
            </Text>

            {payment.retry_url ? (
              <Button
                style={{
                  backgroundColor: '#16a34a',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  fontWeight: 'bold',
                  fontSize: '16px'
                }}
                href={payment.retry_url}
              >
                Update Payment Method
              </Button>
            ) : (
              <Button
                style={{
                  backgroundColor: '#16a34a',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  fontWeight: 'bold',
                  fontSize: '16px'
                }}
                href={`https://${store_domain}/account/orders`}
              >
                Complete Your Order
              </Button>
            )}

            <Text style={{ color: '#666666', fontSize: '14px', margin: '20px 0 0 0' }}>
              Need help? Our customer service team is here to assist you.
            </Text>
          </Section>

          {/* Common Issues */}
          <Section style={{ padding: '24px', backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e6ebf1', marginTop: '16px' }}>
            <Heading style={{ color: '#1a1a1a', fontSize: '16px', fontWeight: 'bold', margin: '0 0 12px 0' }}>
              Common Solutions
            </Heading>

            <Text style={{ color: '#666666', fontSize: '14px', margin: '0 0 8px 0' }}>
              • Check that your card has sufficient funds
            </Text>
            <Text style={{ color: '#666666', fontSize: '14px', margin: '0 0 8px 0' }}>
              • Verify your billing address matches your card
            </Text>
            <Text style={{ color: '#666666', fontSize: '14px', margin: '0 0 8px 0' }}>
              • Try a different payment method
            </Text>
            <Text style={{ color: '#666666', fontSize: '14px', margin: '0' }}>
              • Contact your bank if the issue persists
            </Text>
          </Section>

          {/* Footer */}
          <Section style={{ padding: '16px 0', textAlign: 'center' }}>
            <Text style={{ color: '#666666', fontSize: '12px', margin: '0' }}>
              This payment notification was sent from {store_name} | {store_domain}
            </Text>
            <Text style={{ color: '#666666', fontSize: '12px', margin: '8px 0 0 0' }}>
              If you didn't attempt to make this purchase, please contact us immediately.
            </Text>
          </Section>

        </Container>
      </Body>
    </Html>
  )
}

export default PaymentFailedTemplate