// Order Shipped Email Template - React Email
// Professional transactional email with dynamic variables

import React from 'react'
import { Html, Head, Preview, Body, Container, Section, Row, Column, Heading, Text, Button, Hr } from '@react-email/components'

interface OrderShippedProps {
  order: {
    display_id: number
    total: number
    currency_code: string
    customer?: {
      first_name?: string
      last_name?: string
    }
    shipping_address?: {
      first_name?: string
      last_name?: string
      address_1?: string
      city?: string
      province?: string
      postal_code?: string
      country_code?: string
    }
    items?: Array<{
      title: string
      quantity: number
      unit_price: number
      total: number
    }>
  }
  shipping: {
    tracking_number?: string
    carrier?: string
    estimated_delivery?: string
    tracking_url?: string
  }
  store_name: string
  store_domain: string
}

const OrderShippedTemplate = ({ order, shipping = {}, store_name = 'Store', store_domain = 'example.com' }: OrderShippedProps) => {
  const customerName = order?.customer?.first_name || order?.shipping_address?.first_name || 'Valued Customer'
  const shippingAddress = order?.shipping_address

  return (
    <Html>
      <Head />
      <Preview>Your order #{String(order.display_id)} has shipped and is on its way!</Preview>
      <Body style={{ backgroundColor: '#f6f9fc', fontFamily: 'Arial, sans-serif' }}>
        <Container style={{ margin: '0 auto', padding: '20px 0 48px', maxWidth: '580px' }}>

          {/* Header */}
          <Section style={{ padding: '24px', backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e6ebf1' }}>
            <Heading style={{ color: '#1a1a1a', fontSize: '24px', fontWeight: 'bold', margin: '0 0 16px 0' }}>
              Your Order Has Shipped!
            </Heading>
            <Text style={{ color: '#666666', fontSize: '16px', margin: '0' }}>
              Hi {customerName},
            </Text>
            <Text style={{ color: '#666666', fontSize: '16px', margin: '16px 0 0 0' }}>
              Great news! Your order #{String(order?.display_id || 'N/A')} has shipped and is on its way to you.
            </Text>
          </Section>

          {/* Shipping Information */}
          <Section style={{ padding: '24px', backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e6ebf1', marginTop: '16px' }}>
            <Heading style={{ color: '#1a1a1a', fontSize: '18px', fontWeight: 'bold', margin: '0 0 16px 0' }}>
              Shipping Details
            </Heading>

            <Row style={{ marginBottom: '12px' }}>
              <Column style={{ width: '50%' }}>
                <Text style={{ color: '#666666', fontSize: '14px', margin: '0' }}>Tracking Number</Text>
                <Text style={{ color: '#1a1a1a', fontSize: '16px', fontWeight: 'bold', margin: '0' }}>
                  {shipping?.tracking_number || 'Will be provided soon'}
                </Text>
              </Column>
              <Column style={{ width: '50%' }}>
                <Text style={{ color: '#666666', fontSize: '14px', margin: '0' }}>Carrier</Text>
                <Text style={{ color: '#1a1a1a', fontSize: '16px', fontWeight: 'bold', margin: '0' }}>
                  {shipping?.carrier || 'Standard Shipping'}
                </Text>
              </Column>
            </Row>

            {shipping?.estimated_delivery && (
              <Row style={{ marginBottom: '12px' }}>
                <Column>
                  <Text style={{ color: '#666666', fontSize: '14px', margin: '0' }}>Estimated Delivery</Text>
                  <Text style={{ color: '#1a1a1a', fontSize: '16px', fontWeight: 'bold', margin: '0' }}>
                    {shipping?.estimated_delivery}
                  </Text>
                </Column>
              </Row>
            )}

            {/* Shipping Address */}
            {shippingAddress && (
              <>
                <Hr style={{ margin: '16px 0', borderColor: '#e6ebf1' }} />
                <Text style={{ color: '#666666', fontSize: '14px', margin: '0 0 8px 0' }}>Shipping Address:</Text>
                <Text style={{ color: '#1a1a1a', fontSize: '14px', margin: '0' }}>
                  {shippingAddress.first_name} {shippingAddress.last_name}<br />
                  {shippingAddress.address_1}<br />
                  {shippingAddress.city}, {shippingAddress.province} {shippingAddress.postal_code}<br />
                  {shippingAddress.country_code?.toUpperCase()}
                </Text>
              </>
            )}

            {/* Tracking Button */}
            {shipping?.tracking_url && (
              <div style={{ textAlign: 'center', marginTop: '16px' }}>
                <Button
                  style={{
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    padding: '12px 24px',
                    borderRadius: '6px',
                    textDecoration: 'none',
                    fontWeight: 'bold'
                  }}
                  href={shipping?.tracking_url}
                >
                  Track Your Package
                </Button>
              </div>
            )}
          </Section>

          {/* Order Summary */}
          <Section style={{ padding: '24px', backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e6ebf1', marginTop: '16px' }}>
            <Heading style={{ color: '#1a1a1a', fontSize: '18px', fontWeight: 'bold', margin: '0 0 16px 0' }}>
              Order Summary
            </Heading>

            <Row>
              <Column>
                <Text style={{ color: '#666666', fontSize: '14px', margin: '0' }}>Order Total</Text>
                <Text style={{ color: '#1a1a1a', fontSize: '20px', fontWeight: 'bold', margin: '0' }}>
                  ${((order?.total || 0) / 100).toFixed(2)} {order?.currency_code?.toUpperCase() || 'USD'}
                </Text>
              </Column>
            </Row>

            {/* Order Items */}
            {order?.items && order.items.length > 0 && (
              <>
                <Hr style={{ margin: '16px 0', borderColor: '#e6ebf1' }} />
                <Heading style={{ color: '#1a1a1a', fontSize: '16px', fontWeight: 'bold', margin: '0 0 12px 0' }}>
                  Items Shipped
                </Heading>
                {order.items?.slice(0, 3).map((item, index) => (
                  <Row key={index} style={{ marginBottom: '8px' }}>
                    <Column style={{ width: '70%' }}>
                      <Text style={{ color: '#1a1a1a', fontSize: '14px', margin: '0' }}>
                        {item?.title || 'Product'}
                      </Text>
                      <Text style={{ color: '#666666', fontSize: '12px', margin: '0' }}>
                        Qty: {item?.quantity || 0}
                      </Text>
                    </Column>
                    <Column style={{ width: '30%', textAlign: 'right' }}>
                      <Text style={{ color: '#1a1a1a', fontSize: '14px', fontWeight: 'bold', margin: '0' }}>
                        ${((item?.total || 0) / 100).toFixed(2)}
                      </Text>
                    </Column>
                  </Row>
                ))}
                {(order.items?.length || 0) > 3 && (
                  <Text style={{ color: '#666666', fontSize: '12px', margin: '8px 0 0 0' }}>
                    +{(order.items?.length || 0) - 3} more items
                  </Text>
                )}
              </>
            )}
          </Section>

          {/* Store Information */}
          <Section style={{ padding: '24px', backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e6ebf1', marginTop: '16px' }}>
            <Text style={{ color: '#666666', fontSize: '14px', margin: '0 0 8px 0' }}>
              Questions about your order? Contact <strong>{store_name}</strong>
            </Text>
            <Text style={{ color: '#666666', fontSize: '12px', margin: '0' }}>
              Visit us at {store_domain}
            </Text>
          </Section>

          {/* Footer */}
          <Section style={{ padding: '16px 0', textAlign: 'center' }}>
            <Text style={{ color: '#666666', fontSize: '12px', margin: '0' }}>
              This shipping notification was sent from {store_name} | {store_domain}
            </Text>
          </Section>

        </Container>
      </Body>
    </Html>
  )
}

export default OrderShippedTemplate