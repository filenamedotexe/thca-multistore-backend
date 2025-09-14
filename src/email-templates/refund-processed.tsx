// Refund Processed Email Template - React Email
// Professional transactional email with dynamic variables

import React from 'react'
import { Html, Head, Preview, Body, Container, Section, Row, Column, Heading, Text, Button, Hr } from '@react-email/components'

interface RefundProcessedProps {
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
      refunded_quantity?: number
    }>
  }
  refund: {
    amount: number
    method: string
    transaction_id?: string
    processing_time?: string
    reason?: string
    partial?: boolean
  }
  store_name: string
  store_domain: string
}

const RefundProcessedTemplate = ({ order, refund, store_name, store_domain }: RefundProcessedProps) => {
  const customerName = order.customer?.first_name || 'Valued Customer'
  const isPartialRefund = refund.partial || refund.amount < order.total

  return (
    <Html>
      <Head />
      <Preview>Your refund for order #{String(order.display_id)} has been processed</Preview>
      <Body style={{ backgroundColor: '#f6f9fc', fontFamily: 'Arial, sans-serif' }}>
        <Container style={{ margin: '0 auto', padding: '20px 0 48px', maxWidth: '580px' }}>

          {/* Header */}
          <Section style={{ padding: '24px', backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e6ebf1' }}>
            <Heading style={{ color: '#16a34a', fontSize: '24px', fontWeight: 'bold', margin: '0 0 16px 0' }}>
              Refund Processed
            </Heading>
            <Text style={{ color: '#666666', fontSize: '16px', margin: '0' }}>
              Hi {customerName},
            </Text>
            <Text style={{ color: '#666666', fontSize: '16px', margin: '16px 0 0 0' }}>
              Your {isPartialRefund ? 'partial ' : ''}refund for order #{String(order.display_id)} has been successfully processed.
            </Text>
          </Section>

          {/* Refund Details */}
          <Section style={{ padding: '24px', backgroundColor: '#f0fdf4', borderRadius: '8px', border: '1px solid #bbf7d0', marginTop: '16px' }}>
            <Heading style={{ color: '#16a34a', fontSize: '18px', fontWeight: 'bold', margin: '0 0 16px 0' }}>
              Refund Information
            </Heading>

            <Row style={{ marginBottom: '12px' }}>
              <Column style={{ width: '50%' }}>
                <Text style={{ color: '#666666', fontSize: '14px', margin: '0' }}>Refund Amount</Text>
                <Text style={{ color: '#16a34a', fontSize: '20px', fontWeight: 'bold', margin: '0' }}>
                  ${(refund.amount / 100).toFixed(2)} {order.currency_code?.toUpperCase() || 'USD'}
                </Text>
              </Column>
              <Column style={{ width: '50%' }}>
                <Text style={{ color: '#666666', fontSize: '14px', margin: '0' }}>Refund Method</Text>
                <Text style={{ color: '#1a1a1a', fontSize: '16px', fontWeight: 'bold', margin: '0' }}>
                  {refund.method}
                </Text>
              </Column>
            </Row>

            {refund.transaction_id && (
              <Row style={{ marginBottom: '12px' }}>
                <Column>
                  <Text style={{ color: '#666666', fontSize: '14px', margin: '0' }}>Transaction ID</Text>
                  <Text style={{ color: '#1a1a1a', fontSize: '14px', fontFamily: 'monospace', margin: '0' }}>
                    {refund.transaction_id}
                  </Text>
                </Column>
              </Row>
            )}

            <Text style={{ color: '#666666', fontSize: '14px', margin: '16px 0 0 0' }}>
              <strong>Processing Time:</strong> {refund.processing_time || '3-5 business days'}
            </Text>

            {refund.reason && (
              <Text style={{ color: '#666666', fontSize: '14px', margin: '8px 0 0 0' }}>
                <strong>Reason:</strong> {refund.reason}
              </Text>
            )}
          </Section>

          {/* Refunded Items */}
          {order.items && order.items.length > 0 && (
            <Section style={{ padding: '24px', backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e6ebf1', marginTop: '16px' }}>
              <Heading style={{ color: '#1a1a1a', fontSize: '18px', fontWeight: 'bold', margin: '0 0 16px 0' }}>
                {isPartialRefund ? 'Refunded Items' : 'Order Items'}
              </Heading>

              {order.items.map((item, index) => {
                const refundedQty = item.refunded_quantity || (isPartialRefund ? 0 : item.quantity)
                const showItem = !isPartialRefund || refundedQty > 0

                if (!showItem) return null

                return (
                  <Row key={index} style={{ marginBottom: '8px' }}>
                    <Column style={{ width: '60%' }}>
                      <Text style={{ color: '#1a1a1a', fontSize: '14px', margin: '0' }}>
                        {item.title}
                      </Text>
                      <Text style={{ color: '#666666', fontSize: '12px', margin: '0' }}>
                        {isPartialRefund
                          ? `Refunded: ${refundedQty} of ${item.quantity}`
                          : `Qty: ${item.quantity}`
                        }
                      </Text>
                    </Column>
                    <Column style={{ width: '40%', textAlign: 'right' }}>
                      <Text style={{ color: '#1a1a1a', fontSize: '14px', fontWeight: 'bold', margin: '0' }}>
                        ${((refundedQty * item.unit_price) / 100).toFixed(2)}
                      </Text>
                    </Column>
                  </Row>
                )
              })}

              <Hr style={{ margin: '16px 0', borderColor: '#e6ebf1' }} />
              <Row>
                <Column style={{ width: '60%' }}>
                  <Text style={{ color: '#16a34a', fontSize: '16px', fontWeight: 'bold', margin: '0' }}>
                    Total Refunded
                  </Text>
                </Column>
                <Column style={{ width: '40%', textAlign: 'right' }}>
                  <Text style={{ color: '#16a34a', fontSize: '16px', fontWeight: 'bold', margin: '0' }}>
                    ${(refund.amount / 100).toFixed(2)}
                  </Text>
                </Column>
              </Row>
            </Section>
          )}

          {/* What's Next */}
          <Section style={{ padding: '24px', backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e6ebf1', marginTop: '16px', textAlign: 'center' }}>
            <Heading style={{ color: '#1a1a1a', fontSize: '18px', fontWeight: 'bold', margin: '0 0 16px 0' }}>
              What's Next?
            </Heading>

            <Text style={{ color: '#666666', fontSize: '16px', margin: '0 0 20px 0' }}>
              Your refund is being processed and should appear in your account within {refund.processing_time || '3-5 business days'}.
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
              This refund confirmation was sent from {store_name} | {store_domain}
            </Text>
            <Text style={{ color: '#666666', fontSize: '12px', margin: '8px 0 0 0' }}>
              Questions about your refund? Contact our customer service team.
            </Text>
          </Section>

        </Container>
      </Body>
    </Html>
  )
}

export default RefundProcessedTemplate