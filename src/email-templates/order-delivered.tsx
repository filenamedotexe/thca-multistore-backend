// Order Delivered Email Template - React Email
// Professional transactional email with dynamic variables

import React from 'react'
import { Html, Head, Preview, Body, Container, Section, Row, Column, Heading, Text, Button, Hr } from '@react-email/components'

interface OrderDeliveredProps {
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
  delivery: {
    delivered_at: string
    delivery_method?: string
    signature_required?: boolean
    delivered_to?: string
  }
  store_name: string
  store_domain: string
}

const OrderDeliveredTemplate = ({ order, delivery, store_name, store_domain }: OrderDeliveredProps) => {
  const customerName = order.customer?.first_name || 'Valued Customer'

  return (
    <Html>
      <Head />
      <Preview>Your order #{String(order.display_id)} has been delivered!</Preview>
      <Body style={{ backgroundColor: '#f6f9fc', fontFamily: 'Arial, sans-serif' }}>
        <Container style={{ margin: '0 auto', padding: '20px 0 48px', maxWidth: '580px' }}>

          {/* Header */}
          <Section style={{ padding: '24px', backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e6ebf1' }}>
            <Heading style={{ color: '#16a34a', fontSize: '24px', fontWeight: 'bold', margin: '0 0 16px 0' }}>
              Order Delivered Successfully!
            </Heading>
            <Text style={{ color: '#666666', fontSize: '16px', margin: '0' }}>
              Hi {customerName},
            </Text>
            <Text style={{ color: '#666666', fontSize: '16px', margin: '16px 0 0 0' }}>
              Excellent news! Your order #{String(order.display_id)} has been delivered and should be with you now.
            </Text>
          </Section>

          {/* Delivery Confirmation */}
          <Section style={{ padding: '24px', backgroundColor: '#f0fdf4', borderRadius: '8px', border: '1px solid #bbf7d0', marginTop: '16px' }}>
            <Heading style={{ color: '#16a34a', fontSize: '18px', fontWeight: 'bold', margin: '0 0 16px 0' }}>
              Delivery Confirmation
            </Heading>

            <Row style={{ marginBottom: '12px' }}>
              <Column style={{ width: '50%' }}>
                <Text style={{ color: '#666666', fontSize: '14px', margin: '0' }}>Delivered At</Text>
                <Text style={{ color: '#1a1a1a', fontSize: '16px', fontWeight: 'bold', margin: '0' }}>
                  {new Date(delivery.delivered_at).toLocaleDateString()} at {new Date(delivery.delivered_at).toLocaleTimeString()}
                </Text>
              </Column>
              <Column style={{ width: '50%' }}>
                <Text style={{ color: '#666666', fontSize: '14px', margin: '0' }}>Delivery Method</Text>
                <Text style={{ color: '#1a1a1a', fontSize: '16px', fontWeight: 'bold', margin: '0' }}>
                  {delivery.delivery_method || 'Standard Delivery'}
                </Text>
              </Column>
            </Row>

            {delivery.delivered_to && (
              <Row style={{ marginBottom: '12px' }}>
                <Column>
                  <Text style={{ color: '#666666', fontSize: '14px', margin: '0' }}>Delivered To</Text>
                  <Text style={{ color: '#1a1a1a', fontSize: '16px', fontWeight: 'bold', margin: '0' }}>
                    {delivery.delivered_to}
                  </Text>
                </Column>
              </Row>
            )}

            {delivery.signature_required && (
              <Text style={{ color: '#16a34a', fontSize: '14px', margin: '16px 0 0 0', fontWeight: 'bold' }}>
                ✓ Signature confirmed for secure delivery
              </Text>
            )}
          </Section>

          {/* Order Summary */}
          <Section style={{ padding: '24px', backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e6ebf1', marginTop: '16px' }}>
            <Heading style={{ color: '#1a1a1a', fontSize: '18px', fontWeight: 'bold', margin: '0 0 16px 0' }}>
              What You Received
            </Heading>

            {order.items && order.items.length > 0 && (
              <>
                {order.items.map((item, index) => (
                  <Row key={index} style={{ marginBottom: '8px' }}>
                    <Column style={{ width: '70%' }}>
                      <Text style={{ color: '#1a1a1a', fontSize: '14px', margin: '0' }}>
                        {item.title}
                      </Text>
                      <Text style={{ color: '#666666', fontSize: '12px', margin: '0' }}>
                        Qty: {item.quantity}
                      </Text>
                    </Column>
                    <Column style={{ width: '30%', textAlign: 'right' }}>
                      <Text style={{ color: '#1a1a1a', fontSize: '14px', fontWeight: 'bold', margin: '0' }}>
                        ${(item.total / 100).toFixed(2)}
                      </Text>
                    </Column>
                  </Row>
                ))}

                <Hr style={{ margin: '16px 0', borderColor: '#e6ebf1' }} />
                <Row>
                  <Column style={{ width: '70%' }}>
                    <Text style={{ color: '#1a1a1a', fontSize: '16px', fontWeight: 'bold', margin: '0' }}>
                      Total Delivered
                    </Text>
                  </Column>
                  <Column style={{ width: '30%', textAlign: 'right' }}>
                    <Text style={{ color: '#1a1a1a', fontSize: '16px', fontWeight: 'bold', margin: '0' }}>
                      ${(order.total / 100).toFixed(2)} {order.currency_code?.toUpperCase() || 'USD'}
                    </Text>
                  </Column>
                </Row>
              </>
            )}
          </Section>

          {/* Feedback Request */}
          <Section style={{ padding: '24px', backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e6ebf1', marginTop: '16px', textAlign: 'center' }}>
            <Heading style={{ color: '#1a1a1a', fontSize: '18px', fontWeight: 'bold', margin: '0 0 16px 0' }}>
              How Was Your Experience?
            </Heading>

            <Text style={{ color: '#666666', fontSize: '16px', margin: '0 0 20px 0' }}>
              We'd love to hear about your experience with {store_name}
            </Text>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <Button
                style={{
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  padding: '12px 20px',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  fontWeight: 'bold'
                }}
                href={`https://${store_domain}/account/orders/${order.display_id}`}
              >
                Leave Review
              </Button>
              <Button
                style={{
                  backgroundColor: '#10b981',
                  color: 'white',
                  padding: '12px 20px',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  fontWeight: 'bold'
                }}
                href={`https://${store_domain}`}
              >
                Shop Again
              </Button>
            </div>
          </Section>

          {/* Footer */}
          <Section style={{ padding: '16px 0', textAlign: 'center' }}>
            <Text style={{ color: '#666666', fontSize: '12px', margin: '0' }}>
              This delivery confirmation was sent from {store_name} | {store_domain}
            </Text>
          </Section>

        </Container>
      </Body>
    </Html>
  )
}

export default OrderDeliveredTemplate