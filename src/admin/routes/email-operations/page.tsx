// Email Operations Center - Official Medusa v2 UI Route Pattern
// Manages Resend + 3 Klaviyo accounts + React Email templates
// Reference: https://docs.medusajs.com/learn/customization/customize-admin

import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Button, Badge, Text, Label, Input, Select, Textarea } from "@medusajs/ui"
import React, { useState, useEffect } from "react"

// Email Analytics Data Interfaces
interface ResendAnalytics {
  totalSent: number
  totalDelivered: number
  totalOpened: number
  totalClicked: number
  deliveryRate: number
  openRate: number
  clickRate: number
  recentEmails: Array<{
    id: string
    to: string
    subject: string
    status: string
    created_at: string
  }>
  domainBreakdown?: Array<{
    domain: string
    name: string
    type: string
    sent: number
    recent: Array<{
      id: string
      to: string
      subject: string
      status: string
      created_at: string
    }>
  }>
}

interface KlaviyoAnalytics {
  accountName: string
  storeType: string
  domain: string
  totalEmails: number
  openRate: number
  clickRate: number
  subscribers: number
  recentCampaigns: Array<{
    id: string
    name: string
    sent_at: string
    open_rate: number
    click_rate: number
  }>
}

interface EmailTemplate {
  id: string
  name: string
  type: 'order' | 'customer' | 'marketing'
  status: 'active' | 'draft'
  lastUsed: string
  subject: string
}

const EmailOperationsPage = () => {
  const [resendAnalytics, setResendAnalytics] = useState<ResendAnalytics | null>(null)
  const [klaviyoAnalytics, setKlaviyoAnalytics] = useState<KlaviyoAnalytics[]>([])
  const [emailTemplates, setEmailTemplates] = useState<EmailTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'templates' | 'klaviyo'>('overview')
  const [currentTime, setCurrentTime] = useState<string>('')
  const [showTestEmailForm, setShowTestEmailForm] = useState(false)
  const [testEmail, setTestEmail] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState('order-confirmation')
  const [testResult, setTestResult] = useState<string | null>(null)
  const [showCreateTemplate, setShowCreateTemplate] = useState(false)
  const [newTemplateName, setNewTemplateName] = useState('')
  const [newTemplateType, setNewTemplateType] = useState<'order' | 'customer' | 'marketing'>('order')
  const [newTemplateSubject, setNewTemplateSubject] = useState('')
  const [createTemplateResult, setCreateTemplateResult] = useState<string | null>(null)
  const [showFullAnalytics, setShowFullAnalytics] = useState(false)

  // Update Chicago time every second for consistency with business intelligence
  useEffect(() => {
    const updateChicagoTime = () => {
      const now = new Date()
      const chicagoTime = new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/Chicago',
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      }).format(now)
      setCurrentTime(chicagoTime)
    }

    updateChicagoTime()
    const interval = setInterval(updateChicagoTime, 1000)
    return () => clearInterval(interval)
  }, [])

  // Fetch email analytics from all sources
  useEffect(() => {
    const fetchEmailAnalytics = async () => {
      try {
        setLoading(true)
        setError(null)

        // ✅ Fetch Resend analytics
        const resendResponse = await fetch('/admin/email/resend/analytics', {
          credentials: 'include'
        })
        if (resendResponse.ok) {
          const resendData = await resendResponse.json()
          setResendAnalytics(resendData)
        }

        // ✅ Fetch Klaviyo analytics for all 3 accounts
        const klaviyoResponse = await fetch('/admin/email/klaviyo/analytics', {
          credentials: 'include'
        })
        if (klaviyoResponse.ok) {
          const klaviyoData = await klaviyoResponse.json()
          setKlaviyoAnalytics(klaviyoData.accounts || [])
        }

        // ✅ Fetch email templates
        const templatesResponse = await fetch('/admin/email/templates', {
          credentials: 'include'
        })
        if (templatesResponse.ok) {
          const templatesData = await templatesResponse.json()
          setEmailTemplates(templatesData.templates || [])
        }

        console.log('✅ Email operations data loaded')

      } catch (error) {
        console.error('Failed to fetch email analytics:', error)
        setError(error instanceof Error ? error.message : 'Failed to load email data')
      } finally {
        setLoading(false)
      }
    }

    fetchEmailAnalytics()
  }, [])

  // Error state
  if (error) {
    return (
      <Container className="divide-y p-0">
        <div className="flex items-center justify-between px-6 py-4">
          <Heading level="h1">Email Operations - Error</Heading>
          <Badge color="red">Database Error</Badge>
        </div>
        <div className="px-6 py-6">
          <Text className="text-red-600">Failed to load email data: {error}</Text>
          <Text size="small" className="text-gray-600 mt-2">
            Please check Resend and Klaviyo API connections.
          </Text>
        </div>
      </Container>
    )
  }

  // Loading state
  if (loading) {
    return (
      <Container className="divide-y p-0">
        <div className="flex items-center justify-between px-6 py-4">
          <Heading level="h1">Loading Email Operations...</Heading>
        </div>
        <div className="px-6 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          </div>
        </div>
      </Container>
    )
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <Heading level="h1">Email Operations Center</Heading>
          <Badge color="green">Resend Connected</Badge>
          <Badge color="blue">{klaviyoAnalytics.length} Klaviyo Accounts</Badge>
        </div>

        <div className="flex items-center gap-4">
          {/* Terminal-Style Clock (matching business intelligence) */}
          <div className="bg-black rounded-md px-3 py-2 font-mono text-sm">
            <span className="text-green-400">
              {currentTime ? currentTime.split(' at ')[1] : 'Loading...'} CT
            </span>
          </div>
        </div>
      </div>

      <div className="px-6 py-6">
        {/* Tab Navigation */}
        <div className="mb-6 border-b">
          <div className="flex space-x-6">
            <Button
              variant={activeTab === 'overview' ? 'primary' : 'secondary'}
              size="small"
              onClick={() => setActiveTab('overview')}
            >
              Email Analytics
            </Button>
            <Button
              variant={activeTab === 'templates' ? 'primary' : 'secondary'}
              size="small"
              onClick={() => setActiveTab('templates')}
            >
              React Templates
            </Button>
            <Button
              variant={activeTab === 'klaviyo' ? 'primary' : 'secondary'}
              size="small"
              onClick={() => setActiveTab('klaviyo')}
            >
              Klaviyo Accounts
            </Button>
          </div>
        </div>

        {/* Overview Tab - Resend Analytics */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Resend Performance Overview */}
            <div>
              <Heading level="h2">Resend Performance (All Domains)</Heading>
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                <Container className="p-4 text-center">
                  <Text size="small" weight="plus">Emails Sent</Text>
                  <Heading level="h3" className="text-blue-600 mt-2">
                    {resendAnalytics?.totalSent?.toLocaleString() || '0'}
                  </Heading>
                  <Text size="small" className="text-gray-600">
                    Total dispatched
                  </Text>
                </Container>
                <Container className="p-4 text-center">
                  <Text size="small" weight="plus">Delivery Rate</Text>
                  <Heading level="h3" className="text-green-600 mt-2">
                    {resendAnalytics?.deliveryRate?.toFixed(1) || '0.0'}%
                  </Heading>
                  <Text size="small" className="text-gray-600">
                    Successfully delivered
                  </Text>
                </Container>
                <Container className="p-4 text-center">
                  <Text size="small" weight="plus">Open Rate</Text>
                  <Heading level="h3" className="text-purple-600 mt-2">
                    {resendAnalytics?.openRate?.toFixed(1) || '0.0'}%
                  </Heading>
                  <Text size="small" className="text-gray-600">
                    Recipients opened
                  </Text>
                </Container>
                <Container className="p-4 text-center">
                  <Text size="small" weight="plus">Click Rate</Text>
                  <Heading level="h3" className="text-orange-600 mt-2">
                    {resendAnalytics?.clickRate?.toFixed(1) || '0.0'}%
                  </Heading>
                  <Text size="small" className="text-gray-600">
                    Recipients clicked
                  </Text>
                </Container>
              </div>
            </div>

            {/* Multi-Domain Breakdown with Template Assignment (ultrathink: 1 Resend + 3 domains) */}
            <div>
              <Heading level="h2">Email Operations by Store</Heading>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { domain: 'straight-gas.com', name: 'Straight Gas', type: 'retail' },
                  { domain: 'liquid-gummies.com', name: 'Liquid Gummies', type: 'luxury' },
                  { domain: 'liquidgummieswholesale.com', name: 'Wholesale', type: 'wholesale' }
                ].map((store) => {
                  const storeData = resendAnalytics?.domainBreakdown?.find(d => d.domain === store.domain)
                  return (
                    <Container key={store.domain} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <Text weight="plus">{store.name}</Text>
                          <Text size="small" className="text-gray-600">{store.domain}</Text>
                        </div>
                        <Badge color={
                          store.type === 'retail' ? 'green' :
                          store.type === 'luxury' ? 'purple' : 'blue'
                        }>
                          {store.type}
                        </Badge>
                      </div>

                      <div className="space-y-3">
                        {/* Email Count */}
                        <Container className="text-center p-3">
                          <Text className="text-xl font-bold text-blue-600">{storeData?.sent || 0}</Text>
                          <Text size="small" className="text-gray-600">emails sent</Text>
                        </Container>

                        {/* Active Templates for Store */}
                        <div>
                          <Text size="small" weight="plus" className="mb-2">Active Templates:</Text>
                          <div className="space-y-1">
                            {emailTemplates.slice(0, 2).map((template) => (
                              <Container key={template.id} className="flex items-center justify-between p-2">
                                <Text size="small">{template.name}</Text>
                                <Badge color="green">Active</Badge>
                              </Container>
                            ))}
                            {emailTemplates.length === 0 && (
                              <Text size="small" className="text-gray-500">No templates assigned</Text>
                            )}
                          </div>
                        </div>

                        {/* Quick Actions per Store */}
                        <div className="flex gap-2">
                          <Button
                            variant="secondary"
                            size="small"
                            onClick={() => {
                              setTestEmail('')
                              setShowTestEmailForm(true)
                              setActiveTab('overview')
                            }}
                          >
                            Test Email
                          </Button>
                          <Button
                            variant="secondary"
                            size="small"
                            onClick={() => setActiveTab('templates')}
                          >
                            Templates
                          </Button>
                        </div>

                        {/* Recent Activity for Store */}
                        {storeData?.recent && storeData.recent.length > 0 && (
                          <div>
                            <Text size="small" weight="plus" className="mb-2">Recent:</Text>
                            <div className="space-y-1">
                              {storeData.recent.map((email) => (
                                <div key={email.id} className="text-xs bg-gray-50 p-2 rounded">
                                  <div className="font-medium truncate">{email.subject}</div>
                                  <div className="text-gray-600">
                                    {new Date(email.created_at).toLocaleDateString()}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </Container>
                  )
                })}
              </div>
            </div>

            {/* Recent Email Activity */}
            <div>
              <Heading level="h2">Recent Email Activity (All Domains)</Heading>
              {resendAnalytics?.recentEmails && resendAnalytics.recentEmails.length > 0 ? (
                <div className="mt-4 space-y-3">
                  {resendAnalytics.recentEmails.slice(0, 5).map((email) => (
                    <Container key={email.id} className="flex items-center justify-between p-4">
                      <div className="flex-1">
                        <Text weight="plus">{email.subject}</Text>
                        <Text size="small" className="text-gray-600">To: {email.to}</Text>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge color={email.status === 'sent' ? 'green' : 'orange'}>
                          {email.status}
                        </Badge>
                        <Text size="small" className="text-gray-600">
                          {new Date(email.created_at).toLocaleDateString()}
                        </Text>
                      </div>
                    </Container>
                  ))}
                </div>
              ) : (
                <div className="mt-4 text-center py-8 text-gray-500">
                  <Text>No recent email activity</Text>
                  <Text size="small" className="text-gray-400">
                    Emails will appear here as they are sent
                  </Text>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Templates Tab - React Email Management */}
        {activeTab === 'templates' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <Heading level="h2">React Email Templates</Heading>
              <Button
                variant="primary"
                size="small"
                onClick={() => setShowCreateTemplate(!showCreateTemplate)}
              >
                {showCreateTemplate ? 'Cancel' : 'Create New Template'}
              </Button>
            </div>

            {/* Create Template Form */}
            {showCreateTemplate && (
              <Container className="border rounded-lg p-6 bg-gray-50">
                <Heading level="h3" className="mb-4">Create New Email Template</Heading>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label>Template Name</Label>
                      <Input
                        placeholder="e.g. Order Shipped"
                        value={newTemplateName}
                        onChange={(e) => setNewTemplateName(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Template Type</Label>
                      <Select value={newTemplateType} onValueChange={(value: string) => setNewTemplateType(value as 'order' | 'customer' | 'marketing')}>
                        <option value="order">Order Related</option>
                        <option value="customer">Customer Related</option>
                        <option value="marketing">Marketing</option>
                      </Select>
                    </div>
                    <div>
                      <Label>Email Subject</Label>
                      <Input
                        placeholder="e.g. Your order has shipped!"
                        value={newTemplateSubject}
                        onChange={(e) => setNewTemplateSubject(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      variant="primary"
                      size="small"
                      onClick={async () => {
                        try {
                          setCreateTemplateResult('Creating template...')

                          const response = await fetch('/admin/email/templates', {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                              name: newTemplateName,
                              type: newTemplateType,
                              subject: newTemplateSubject,
                              content: 'Template content will be generated based on type.'
                            }),
                            credentials: 'include'
                          })

                          const result = await response.json()

                          if (response.ok) {
                            setCreateTemplateResult(`✅ Template "${newTemplateName}" created successfully!`)
                            setNewTemplateName('')
                            setNewTemplateSubject('')
                            // Refresh templates list
                            const templatesResponse = await fetch('/admin/email/templates', {
                              credentials: 'include'
                            })
                            if (templatesResponse.ok) {
                              const templatesData = await templatesResponse.json()
                              setEmailTemplates(templatesData.templates || [])
                            }
                          } else {
                            setCreateTemplateResult(`❌ ${result.error}`)
                          }
                        } catch (error) {
                          setCreateTemplateResult('❌ Failed to create template')
                        }
                      }}
                      disabled={!newTemplateName || !newTemplateSubject}
                    >
                      Create Template
                    </Button>
                    <Button
                      variant="secondary"
                      size="small"
                      onClick={() => {
                        setShowCreateTemplate(false)
                        setCreateTemplateResult(null)
                        setNewTemplateName('')
                        setNewTemplateSubject('')
                      }}
                    >
                      Cancel
                    </Button>
                  </div>

                  {createTemplateResult && (
                    <Container className={`p-3 ${createTemplateResult.startsWith('✅') ? 'bg-green-50' : 'bg-red-50'}`}>
                      <Text size="small" className={createTemplateResult.startsWith('✅') ? 'text-green-800' : 'text-red-800'}>
                        {createTemplateResult}
                      </Text>
                    </Container>
                  )}
                </div>
              </Container>
            )}

            {emailTemplates.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {emailTemplates.map((template) => (
                  <Container key={template.id} className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <Text weight="plus">{template.name}</Text>
                        <Text size="small" className="text-gray-600">{template.type}</Text>
                      </div>
                      <Badge color={template.status === 'active' ? 'green' : 'orange'}>
                        {template.status}
                      </Badge>
                    </div>
                    <Text size="small" className="text-gray-600 mb-3">
                      Subject: {template.subject}
                    </Text>
                    <Text size="small" className="text-gray-600 mb-3">
                      Last used: {new Date(template.lastUsed).toLocaleDateString()}
                    </Text>
                    <div className="flex gap-2">
                      <Button
                        variant="secondary"
                        size="small"
                        onClick={() => {
                          // TODO: Implement inline template editor
                          alert(`Edit functionality coming soon for ${template.name}`)
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="secondary"
                        size="small"
                        onClick={() => {
                          window.open(`/admin/email/templates/preview?template=${template.id}`, '_blank')
                        }}
                      >
                        Preview
                      </Button>
                    </div>
                  </Container>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Text size="large">No email templates configured</Text>
                <Text size="small" className="text-gray-400 mb-4">
                  Create React Email templates for automated workflows
                </Text>
                <Button variant="primary">
                  Create First Template
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Klaviyo Tab - Multi-Account Management */}
        {activeTab === 'klaviyo' && (
          <div className="space-y-8">
            <Heading level="h2">Klaviyo Account Portfolio</Heading>

            {klaviyoAnalytics.length > 0 ? (
              <div className="space-y-6">
                {klaviyoAnalytics.map((account, index) => (
                  <Container key={index} className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Heading level="h3">{account.accountName}</Heading>
                        <Badge color={
                          account.storeType === 'retail' ? 'green' :
                          account.storeType === 'luxury' ? 'purple' : 'blue'
                        }>
                          {account.storeType}
                        </Badge>
                      </div>
                      <Text size="small" className="text-gray-600">{account.domain}</Text>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <Container className="text-center p-3">
                        <Text size="small" weight="plus">Total Emails</Text>
                        <Text className="text-lg font-semibold mt-1">{account.totalEmails.toLocaleString()}</Text>
                      </Container>
                      <Container className="text-center p-3">
                        <Text size="small" weight="plus">Subscribers</Text>
                        <Text className="text-lg font-semibold mt-1">{account.subscribers.toLocaleString()}</Text>
                      </Container>
                      <Container className="text-center p-3">
                        <Text size="small" weight="plus">Open Rate</Text>
                        <Text className="text-lg font-semibold mt-1 text-green-600">{account.openRate.toFixed(1)}%</Text>
                      </Container>
                      <Container className="text-center p-3">
                        <Text size="small" weight="plus">Click Rate</Text>
                        <Text className="text-lg font-semibold mt-1 text-blue-600">{account.clickRate.toFixed(1)}%</Text>
                      </Container>
                    </div>

                    {/* Recent Campaigns */}
                    {account.recentCampaigns && account.recentCampaigns.length > 0 && (
                      <div className="mt-4 pt-4 border-t">
                        <Text size="small" weight="plus">Recent Campaigns</Text>
                        <div className="mt-2 space-y-2">
                          {account.recentCampaigns.slice(0, 3).map((campaign) => (
                            <Container key={campaign.id} className="flex justify-between p-2">
                              <div>
                                <Text size="small">{campaign.name}</Text>
                                <Text size="small" className="text-gray-600">
                                  Sent: {new Date(campaign.sent_at).toLocaleDateString()}
                                </Text>
                              </div>
                              <div className="text-right">
                                <Text size="small">Open: {campaign.open_rate.toFixed(1)}%</Text>
                                <Text size="small">Click: {campaign.click_rate.toFixed(1)}%</Text>
                              </div>
                            </Container>
                          ))}
                        </div>
                      </div>
                    )}
                  </Container>
                ))}
              </div>
            ) : (
              <Container className="text-center py-12">
                <Text size="large">No Klaviyo accounts connected</Text>
                <Text size="small" className="text-gray-400 mb-4">
                  Connect your 3 Klaviyo accounts for complete email analytics
                </Text>
                <Button variant="primary">
                  Connect Klaviyo Accounts
                </Button>
              </Container>
            )}
          </div>
        )}

        {/* Test Email Form */}
        {showTestEmailForm && (
          <Container className="p-6 bg-blue-50">
            <div className="flex items-center justify-between mb-4">
              <Heading level="h3">Send Test Email</Heading>
              <Button
                variant="secondary"
                size="small"
                onClick={() => {
                  setShowTestEmailForm(false)
                  setTestResult(null)
                }}
              >
                Close
              </Button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Template</Label>
                  <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                    <option value="order-confirmation">Order Confirmation</option>
                    <option value="customer-welcome">Customer Welcome</option>
                  </Select>
                </div>
                <div>
                  <Label>Test Email Address</Label>
                  <Input
                    placeholder="test@example.com"
                    value={testEmail}
                    onChange={(e) => setTestEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="primary"
                  size="small"
                  onClick={async () => {
                    try {
                      setTestResult('Sending test email...')

                      const response = await fetch('/admin/email/test', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                          template: selectedTemplate,
                          to: testEmail,
                          store_name: 'Test Store'
                        }),
                        credentials: 'include'
                      })

                      const result = await response.json()

                      if (response.ok) {
                        setTestResult(`✅ ${result.message}`)
                      } else {
                        setTestResult(`❌ ${result.error}`)
                      }
                    } catch (error) {
                      setTestResult('❌ Failed to send test email')
                    }
                  }}
                  disabled={!testEmail || !selectedTemplate}
                >
                  Send Test Email
                </Button>
                <Button
                  variant="secondary"
                  size="small"
                  onClick={() => {
                    window.open(`/admin/email/templates/preview?template=${selectedTemplate}`, '_blank')
                  }}
                >
                  Preview Template
                </Button>
              </div>

              {testResult && (
                <Container className={`p-3 ${testResult.startsWith('✅') ? 'bg-green-50' : 'bg-red-50'}`}>
                  <Text size="small" className={testResult.startsWith('✅') ? 'text-green-800' : 'text-red-800'}>
                    {testResult}
                  </Text>
                </Container>
              )}
            </div>
          </Container>
        )}

        {/* Functional Actions */}
        <div className="pt-6 border-t">
          <div className="flex gap-3">
            <Button
              variant="primary"
              size="small"
              onClick={() => setShowTestEmailForm(!showTestEmailForm)}
            >
              {showTestEmailForm ? 'Hide Test Email' : 'Send Test Email'}
            </Button>
            <Button
              variant="secondary"
              size="small"
              onClick={() => setShowFullAnalytics(true)}
            >
              View Full Analytics
            </Button>
            <Button
              variant="secondary"
              size="small"
              onClick={() => setActiveTab('templates')}
            >
              Template Designer
            </Button>
          </div>
          <Text size="small" className="text-gray-600 mt-2">
            Email operations powered by Resend API with React Email templates and Klaviyo portfolio management
          </Text>
        </div>

        {/* Full Analytics Modal */}
        {showFullAnalytics && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Container className="max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="px-6 py-4 border-b">
                <div className="flex items-center justify-between">
                  <Heading level="h2">Full Email Analytics - Multi-Domain View</Heading>
                  <Button
                    variant="secondary"
                    size="small"
                    onClick={() => setShowFullAnalytics(false)}
                  >
                    Close
                  </Button>
                </div>
              </div>

              <div className="px-6 py-6 space-y-8">
                {/* Comprehensive Analytics */}
                <div>
                  <Heading level="h3">Resend Performance Metrics</Heading>
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-6">
                    <Container className="p-4 text-center">
                      <Text size="small" weight="plus" className="text-gray-600">Total Emails Sent</Text>
                      <div className="text-3xl font-bold text-blue-600 mt-2">
                        {resendAnalytics?.totalSent?.toLocaleString() || '0'}
                      </div>
                      <Text size="small" className="text-gray-500">Across all 3 stores</Text>
                    </Container>
                    <Container className="p-4 text-center">
                      <Text size="small" weight="plus" className="text-gray-600">Delivery Rate</Text>
                      <div className="text-3xl font-bold text-green-600 mt-2">
                        {resendAnalytics?.deliveryRate?.toFixed(1) || '0.0'}%
                      </div>
                      <Text size="small" className="text-gray-500">Successfully delivered</Text>
                    </Container>
                    <Container className="p-4 text-center">
                      <Text size="small" weight="plus" className="text-gray-600">Active Templates</Text>
                      <div className="text-3xl font-bold text-purple-600 mt-2">
                        {emailTemplates.length}
                      </div>
                      <Text size="small" className="text-gray-500">React Email templates</Text>
                    </Container>
                    <Container className="p-4 text-center">
                      <Text size="small" weight="plus" className="text-gray-600">Active Domains</Text>
                      <div className="text-3xl font-bold text-orange-600 mt-2">3</div>
                      <Text size="small" className="text-gray-500">Store domains configured</Text>
                    </Container>
                  </div>
                </div>

                {/* Store Performance Breakdown */}
                <div>
                  <Heading level="h3">Store Performance Analysis</Heading>
                  <div className="mt-4 space-y-4">
                    {[
                      { domain: 'straight-gas.com', name: 'Straight Gas', type: 'retail' },
                      { domain: 'liquid-gummies.com', name: 'Liquid Gummies', type: 'luxury' },
                      { domain: 'liquidgummieswholesale.com', name: 'Wholesale', type: 'wholesale' }
                    ].map((store) => {
                      const storeData = resendAnalytics?.domainBreakdown?.find(d => d.domain === store.domain)
                      return (
                        <Container key={store.domain} className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <Heading level="h4">{store.name}</Heading>
                              <Badge color={
                                store.type === 'retail' ? 'green' :
                                store.type === 'luxury' ? 'purple' : 'blue'
                              }>
                                {store.type}
                              </Badge>
                            </div>
                            <Text size="small" className="text-gray-600">{store.domain}</Text>
                          </div>

                          <div className="grid grid-cols-3 gap-4">
                            <div className="text-center">
                              <Text size="small" weight="plus">Emails Sent</Text>
                              <Text className="text-lg font-semibold">{storeData?.sent || 0}</Text>
                            </div>
                            <div className="text-center">
                              <Text size="small" weight="plus">Active Templates</Text>
                              <Text className="text-lg font-semibold">{emailTemplates.length}</Text>
                            </div>
                            <div className="text-center">
                              <Text size="small" weight="plus">Last Activity</Text>
                              <Text className="text-sm">
                                {storeData?.recent?.[0]?.created_at
                                  ? new Date(storeData.recent[0].created_at).toLocaleDateString()
                                  : 'No activity'
                                }
                              </Text>
                            </div>
                          </div>
                        </Container>
                      )
                    })}
                  </div>
                </div>
              </div>
            </Container>
          </div>
        )}
      </div>
    </Container>
  )
}

// ✅ Official Medusa v2 Route Configuration
export const config = defineRouteConfig({
  label: "Email Operations",
})

export default EmailOperationsPage