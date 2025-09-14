// Password Reset Email Template - React Email
// Professional transactional email with dynamic variables

import React from 'react'
import { Html, Head, Preview, Body, Container, Section, Heading, Text, Button } from '@react-email/components'

interface PasswordResetProps {
  customer: {
    first_name?: string
    last_name?: string
    email: string
  }
  reset_url: string
  expiry_time?: string
  store_name: string
  store_domain: string
}

const PasswordResetTemplate = ({ customer, reset_url, expiry_time = '24 hours', store_name, store_domain }: PasswordResetProps) => {
  return (
    <Html>
      <Head />
      <Preview>Reset your password for {store_name}</Preview>
      <Body style={{ backgroundColor: '#f6f9fc', fontFamily: 'Arial, sans-serif' }}>
        <Container style={{ margin: '0 auto', padding: '20px 0 48px', maxWidth: '580px' }}>

          {/* Header */}
          <Section style={{ padding: '24px', backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e6ebf1' }}>
            <Heading style={{ color: '#1a1a1a', fontSize: '24px', fontWeight: 'bold', margin: '0 0 16px 0' }}>
              Reset Your Password
            </Heading>
            <Text style={{ color: '#666666', fontSize: '16px', margin: '0' }}>
              Hi {customer.first_name || 'there'},
            </Text>
            <Text style={{ color: '#666666', fontSize: '16px', margin: '16px 0 0 0' }}>
              We received a request to reset the password for your {store_name} account ({customer.email}).
            </Text>
          </Section>

          {/* Reset Button */}
          <Section style={{ padding: '24px', backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e6ebf1', marginTop: '16px', textAlign: 'center' }}>
            <Text style={{ color: '#666666', fontSize: '16px', margin: '0 0 20px 0' }}>
              Click the button below to reset your password:
            </Text>

            <Button
              style={{
                backgroundColor: '#dc2626',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '6px',
                textDecoration: 'none',
                fontWeight: 'bold',
                fontSize: '16px'
              }}
              href={reset_url}
            >
              Reset Password
            </Button>

            <Text style={{ color: '#666666', fontSize: '14px', margin: '20px 0 0 0' }}>
              This link will expire in {expiry_time}
            </Text>
          </Section>

          {/* Security Notice */}
          <Section style={{ padding: '24px', backgroundColor: '#fff3cd', borderRadius: '8px', border: '1px solid #ffeaa7', marginTop: '16px' }}>
            <Heading style={{ color: '#856404', fontSize: '16px', fontWeight: 'bold', margin: '0 0 12px 0' }}>
              Security Notice
            </Heading>
            <Text style={{ color: '#856404', fontSize: '14px', margin: '0 0 8px 0' }}>
              • If you didn't request this password reset, please ignore this email
            </Text>
            <Text style={{ color: '#856404', fontSize: '14px', margin: '0 0 8px 0' }}>
              • Never share your password reset link with others
            </Text>
            <Text style={{ color: '#856404', fontSize: '14px', margin: '0' }}>
              • This link can only be used once
            </Text>
          </Section>

          {/* Alternative Instructions */}
          <Section style={{ padding: '24px', backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e6ebf1', marginTop: '16px' }}>
            <Text style={{ color: '#666666', fontSize: '14px', margin: '0 0 8px 0' }}>
              If the button doesn't work, copy and paste this link into your browser:
            </Text>
            <Text style={{
              color: '#3b82f6',
              fontSize: '14px',
              margin: '0',
              wordBreak: 'break-all',
              backgroundColor: '#f1f5f9',
              padding: '8px',
              borderRadius: '4px'
            }}>
              {reset_url}
            </Text>
          </Section>

          {/* Footer */}
          <Section style={{ padding: '16px 0', textAlign: 'center' }}>
            <Text style={{ color: '#666666', fontSize: '12px', margin: '0' }}>
              This security email was sent from {store_name} | {store_domain}
            </Text>
            <Text style={{ color: '#666666', fontSize: '12px', margin: '8px 0 0 0' }}>
              If you need help, please contact our support team.
            </Text>
          </Section>

        </Container>
      </Body>
    </Html>
  )
}

export default PasswordResetTemplate