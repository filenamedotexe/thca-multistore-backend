// Order Cancelled Email Template - React Email
// Professional transactional email with dynamic variables

import React from 'react'
import { Html, Head, Preview, Body, Container, Section, Row, Column, Heading, Text, Button, Hr } from '@react-email/components'

interface OrderCancelledProps {
  order: {
    display_id: number
    total: number
    currency_code: string
    customer?: {
      first_name?: string
      last_name?: string
    }
    items?: Array<{
      title: string
      quantity: number
      unit_price: number
      total: number
    }>
  }
  cancellation: {
    reason?: string
    cancelled_by?: 'customer' | 'store' | 'system'
    refund_amount?: number
    refund_method?: string
    refund_timeline?: string
  }
  store_name: string
  store_domain: string
}

const OrderCancelledTemplate = ({ order, cancellation, store_name, store_domain }: OrderCancelledProps) => {
  const customerName = order.customer?.first_name || 'Valued Customer'
  const wasCustomerCancelled = cancellation.cancelled_by === 'customer'

  return (
    <Html>
      <Head />
      <Preview>Your order #{String(order.display_id)} has been cancelled</Preview>
      <Body style={{ backgroundColor: '#f6f9fc', fontFamily: 'Arial, sans-serif' }}>
        <Container style={{ margin: '0 auto', padding: '20px 0 48px', maxWidth: '580px' }}>

          {/* Header */}
          <Section style={{ padding: '24px', backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e6ebf1' }}>
            <Heading style={{ color: '#dc2626', fontSize: '24px', fontWeight: 'bold', margin: '0 0 16px 0' }}>
              Order Cancelled
            </Heading>
            <Text style={{ color: '#666666', fontSize: '16px', margin: '0' }}>
              Hi {customerName},
            </Text>
            <Text style={{ color: '#666666', fontSize: '16px', margin: '16px 0 0 0' }}>
              {wasCustomerCancelled
                ? `Your order #${String(order.display_id)} has been successfully cancelled as requested.`
                : `We regret to inform you that your order #${String(order.display_id)} has been cancelled.`
              }
            </Text>
          </Section>

          {/* Cancellation Details */}
          <Section style={{ padding: '24px', backgroundColor: '#fef2f2', borderRadius: '8px', border: '1px solid #fecaca', marginTop: '16px' }}>
            <Heading style={{ color: '#dc2626', fontSize: '18px', fontWeight: 'bold', margin: '0 0 16px 0' }}>
              Cancellation Details
            </Heading>

            <Text style={{ color: '#666666', fontSize: '14px', margin: '0 0 8px 0' }}>
              <strong>Order Number:</strong> #{String(order.display_id)}
            </Text>

            <Text style={{ color: '#666666', fontSize: '14px', margin: '0 0 8px 0' }}>
              <strong>Order Total:</strong> ${(order.total / 100).toFixed(2)} {order.currency_code?.toUpperCase() || 'USD'}
            </Text>

            {cancellation.reason && (
              <Text style={{ color: '#666666', fontSize: '14px', margin: '0 0 8px 0' }}>
                <strong>Reason:</strong> {cancellation.reason}
              </Text>
            )}

            <Text style={{ color: '#666666', fontSize: '14px', margin: '0' }}>
              <strong>Cancelled by:</strong> {
                cancellation.cancelled_by === 'customer' ? 'You (customer request)' :
                cancellation.cancelled_by === 'store' ? store_name :
                'System (automated)'
              }
            </Text>
          </Section>

          {/* Refund Information */}
          {cancellation.refund_amount && (
            <Section style={{ padding: '24px', backgroundColor: '#f0fdf4', borderRadius: '8px', border: '1px solid #bbf7d0', marginTop: '16px' }}>
              <Heading style={{ color: '#16a34a', fontSize: '18px', fontWeight: 'bold', margin: '0 0 16px 0' }}>
                Refund Information
              </Heading>

              <Text style={{ color: '#666666', fontSize: '14px', margin: '0 0 8px 0' }}>
                <strong>Refund Amount:</strong> ${(cancellation.refund_amount / 100).toFixed(2)}
              </Text>

              {cancellation.refund_method && (
                <Text style={{ color: '#666666', fontSize: '14px', margin: '0 0 8px 0' }}>
                  <strong>Refund Method:</strong> {cancellation.refund_method}
                </Text>
              )}

              <Text style={{ color: '#666666', fontSize: '14px', margin: '0' }}>
                <strong>Processing Time:</strong> {cancellation.refund_timeline || '3-5 business days'}
              </Text>
            </Section>
          )}

          {/* Cancelled Items */}
          {order.items && order.items.length > 0 && (
            <Section style={{ padding: '24px', backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e6ebf1', marginTop: '16px' }}>
              <Heading style={{ color: '#1a1a1a', fontSize: '18px', fontWeight: 'bold', margin: '0 0 16px 0' }}>
                Cancelled Items
              </Heading>

              {order.items.map((item, index) => (
                <Row key={index} style={{ marginBottom: '8px' }}>
                  <Column style={{ width: '70%' }}>
                    <Text style={{ color: '#1a1a1a', fontSize: '14px', margin: '0' }}>
                      {item.title}
                    </Text>
                    <Text style={{ color: '#666666', fontSize: '12px', margin: '0' }}>
                      Qty: {item.quantity} × ${(item.unit_price / 100).toFixed(2)}
                    </Text>
                  </Column>
                  <Column style={{ width: '30%', textAlign: 'right' }}>
                    <Text style={{ color: '#1a1a1a', fontSize: '14px', textDecoration: 'line-through', margin: '0' }}>
                      ${(item.total / 100).toFixed(2)}
                    </Text>
                  </Column>
                </Row>
              ))}
            </Section>
          )}

          {/* Next Steps */}
          <Section style={{ padding: '24px', backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e6ebf1', marginTop: '16px', textAlign: 'center' }}>
            <Heading style={{ color: '#1a1a1a', fontSize: '18px', fontWeight: 'bold', margin: '0 0 16px 0' }}>
              What's Next?
            </Heading>

            <Text style={{ color: '#666666', fontSize: '16px', margin: '0 0 20px 0' }}>
              {wasCustomerCancelled
                ? "We're sorry to see you go. We'd love to have you back anytime!"
                : "We apologize for any inconvenience. We'd love to help you find what you're looking for."
              }
            </Text>

            <Button
              style={{
                backgroundColor: '#3b82f6',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '6px',
                textDecoration: 'none',
                fontWeight: 'bold'
              }}
              href={`https://${store_domain}`}
            >
              Continue Shopping
            </Button>
          </Section>

          {/* Footer */}
          <Section style={{ padding: '16px 0', textAlign: 'center' }}>
            <Text style={{ color: '#666666', fontSize: '12px', margin: '0' }}>
              This cancellation notice was sent from {store_name} | {store_domain}
            </Text>
            <Text style={{ color: '#666666', fontSize: '12px', margin: '8px 0 0 0' }}>
              Questions? Contact our customer service team for assistance.
            </Text>
          </Section>

        </Container>
      </Body>
    </Html>
  )
}

export default OrderCancelledTemplate