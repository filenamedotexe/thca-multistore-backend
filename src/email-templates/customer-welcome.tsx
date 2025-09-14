// Customer Welcome Email Template - React Email
// Official React Email + Medusa v2 Integration

import React from 'react'
import { Html, Head, Preview, Body, Container, Section, Row, Column, Heading, Text, Button } from '@react-email/components'

interface CustomerWelcomeProps {
  customer: {
    first_name?: string
    last_name?: string
    email: string
  }
  store_name: string
  store_domain: string
}

const CustomerWelcomeTemplate = ({ customer, store_name, store_domain }: CustomerWelcomeProps) => {
  return (
    <Html>
      <Head />
      <Preview>Welcome to {store_name}!</Preview>
      <Body style={{ backgroundColor: '#f6f9fc', fontFamily: 'Arial, sans-serif' }}>
        <Container style={{ margin: '0 auto', padding: '20px 0 48px', maxWidth: '580px' }}>

          {/* Header */}
          <Section style={{ padding: '24px', backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e6ebf1' }}>
            <Heading style={{ color: '#1a1a1a', fontSize: '24px', fontWeight: 'bold', margin: '0 0 16px 0' }}>
              Welcome to {store_name}!
            </Heading>
            <Text style={{ color: '#666666', fontSize: '16px', margin: '0' }}>
              Hi {customer.first_name || 'there'},
            </Text>
            <Text style={{ color: '#666666', fontSize: '16px', margin: '16px 0 0 0' }}>
              Thank you for joining {store_name}. We're excited to have you as part of our community!
            </Text>
          </Section>

          {/* Welcome Benefits */}
          <Section style={{ padding: '24px', backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e6ebf1', marginTop: '16px' }}>
            <Heading style={{ color: '#1a1a1a', fontSize: '18px', fontWeight: 'bold', margin: '0 0 16px 0' }}>
              What's Next?
            </Heading>

            <Row style={{ marginBottom: '12px' }}>
              <Column style={{ width: '48px' }}>
                <div style={{ width: '32px', height: '32px', backgroundColor: '#3b82f6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ color: 'white', fontSize: '16px', margin: '0' }}>1</Text>
                </div>
              </Column>
              <Column>
                <Text style={{ color: '#1a1a1a', fontSize: '14px', fontWeight: 'bold', margin: '0' }}>
                  Browse our premium selection
                </Text>
                <Text style={{ color: '#666666', fontSize: '14px', margin: '0' }}>
                  Discover high-quality products curated just for you
                </Text>
              </Column>
            </Row>

            <Row style={{ marginBottom: '12px' }}>
              <Column style={{ width: '48px' }}>
                <div style={{ width: '32px', height: '32px', backgroundColor: '#10b981', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ color: 'white', fontSize: '16px', margin: '0' }}>2</Text>
                </div>
              </Column>
              <Column>
                <Text style={{ color: '#1a1a1a', fontSize: '14px', fontWeight: 'bold', margin: '0' }}>
                  Enjoy fast, secure checkout
                </Text>
                <Text style={{ color: '#666666', fontSize: '14px', margin: '0' }}>
                  Quick and secure ordering with multiple payment options
                </Text>
              </Column>
            </Row>

            <Row>
              <Column style={{ width: '48px' }}>
                <div style={{ width: '32px', height: '32px', backgroundColor: '#8b5cf6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ color: 'white', fontSize: '16px', margin: '0' }}>3</Text>
                </div>
              </Column>
              <Column>
                <Text style={{ color: '#1a1a1a', fontSize: '14px', fontWeight: 'bold', margin: '0' }}>
                  Get exclusive member benefits
                </Text>
                <Text style={{ color: '#666666', fontSize: '14px', margin: '0' }}>
                  Special offers, early access, and personalized recommendations
                </Text>
              </Column>
            </Row>
          </Section>

          {/* Call to Action */}
          <Section style={{ padding: '24px', backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e6ebf1', marginTop: '16px', textAlign: 'center' }}>
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
              Start Shopping
            </Button>
          </Section>

          {/* Footer */}
          <Section style={{ padding: '16px 0', textAlign: 'center' }}>
            <Text style={{ color: '#666666', fontSize: '12px', margin: '0' }}>
              This email was sent from {store_name} | {store_domain}
            </Text>
            <Text style={{ color: '#666666', fontSize: '12px', margin: '8px 0 0 0' }}>
              You received this because you created an account with us.
            </Text>
          </Section>

        </Container>
      </Body>
    </Html>
  )
}

export default CustomerWelcomeTemplate