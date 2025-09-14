// Order Confirmation Email Template - React Email
// Official React Email + Medusa v2 Integration

import React from 'react'
import { Html, Head, Preview, Body, Container, Section, Row, Column, Heading, Text, Button, Hr } from '@react-email/components'

interface OrderConfirmationProps {
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
  store_name: string
  store_domain: string
}

const OrderConfirmationTemplate = ({ order, store_name, store_domain }: OrderConfirmationProps) => {
  return (
    <Html>
      <Head />
      <Preview>Your order #{String(order.display_id)} has been confirmed!</Preview>
      <Body style={{ backgroundColor: '#f6f9fc', fontFamily: 'Arial, sans-serif' }}>
        <Container style={{ margin: '0 auto', padding: '20px 0 48px', maxWidth: '580px' }}>

          {/* Header */}
          <Section style={{ padding: '24px', backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e6ebf1' }}>
            <Heading style={{ color: '#1a1a1a', fontSize: '24px', fontWeight: 'bold', margin: '0 0 16px 0' }}>
              Order Confirmation
            </Heading>
            <Text style={{ color: '#666666', fontSize: '16px', margin: '0' }}>
              Thank you for your order, {order.customer?.first_name || 'Valued Customer'}!
            </Text>
          </Section>

          {/* Order Details */}
          <Section style={{ padding: '24px', backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e6ebf1', marginTop: '16px' }}>
            <Heading style={{ color: '#1a1a1a', fontSize: '18px', fontWeight: 'bold', margin: '0 0 16px 0' }}>
              Order #{String(order.display_id)}
            </Heading>

            <Row>
              <Column>
                <Text style={{ color: '#666666', fontSize: '14px', margin: '0' }}>Order Total</Text>
                <Text style={{ color: '#1a1a1a', fontSize: '20px', fontWeight: 'bold', margin: '0' }}>
                  ${(order.total / 100).toFixed(2)} {order.currency_code?.toUpperCase() || 'USD'}
                </Text>
              </Column>
            </Row>

            {/* Order Items */}
            {order.items && order.items.length > 0 && (
              <>
                <Hr style={{ margin: '16px 0', borderColor: '#e6ebf1' }} />
                <Heading style={{ color: '#1a1a1a', fontSize: '16px', fontWeight: 'bold', margin: '0 0 12px 0' }}>
                  Items Ordered
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
                      <Text style={{ color: '#1a1a1a', fontSize: '14px', fontWeight: 'bold', margin: '0' }}>
                        ${(item.total / 100).toFixed(2)}
                      </Text>
                    </Column>
                  </Row>
                ))}
              </>
            )}
          </Section>

          {/* Store Information */}
          <Section style={{ padding: '24px', backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e6ebf1', marginTop: '16px' }}>
            <Text style={{ color: '#666666', fontSize: '14px', margin: '0 0 8px 0' }}>
              Thank you for choosing <strong>{store_name}</strong>
            </Text>
            <Text style={{ color: '#666666', fontSize: '12px', margin: '0' }}>
              Visit us at {store_domain}
            </Text>
          </Section>

          {/* Footer */}
          <Section style={{ padding: '16px 0', textAlign: 'center' }}>
            <Text style={{ color: '#666666', fontSize: '12px', margin: '0' }}>
              This email was sent from {store_name} | {store_domain}
            </Text>
          </Section>

        </Container>
      </Body>
    </Html>
  )
}

export default OrderConfirmationTemplate