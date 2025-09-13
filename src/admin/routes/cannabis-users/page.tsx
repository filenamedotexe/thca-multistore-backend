// User Role Management - Official Medusa v2 User API Pattern
// Reference: https://docs.medusajs.com/learn/customization/customize-admin

import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Button, Input, Select, Badge, Text } from "@medusajs/ui"
import React, { useState, useEffect } from "react"

type UserRole = 'master_admin' | 'store_manager' | 'staff' | 'read_only'

interface CannabisUser {
  id: string
  email: string
  firstName: string
  lastName: string
  role: UserRole
  storeAccess: string[] // Store IDs this user can access
  isActive: boolean
  lastLogin: string
  createdAt: string
  permissions: {
    canViewReports: boolean
    canManageProducts: boolean
    canProcessOrders: boolean
    canAccessCompliance: boolean
    canManageUsers: boolean
  }
}

interface NewUser {
  email: string
  firstName: string
  lastName: string
  role: UserRole
  storeAccess: string[]
  temporaryPassword: string
}

const CannabisUsersPage = () => {
  const [users, setUsers] = useState<CannabisUser[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [selectedUser, setSelectedUser] = useState<CannabisUser | null>(null)
  const [showPermissionsDialog, setShowPermissionsDialog] = useState(false)
  const [newUser, setNewUser] = useState<NewUser>({
    email: '',
    firstName: '',
    lastName: '',
    role: 'staff',
    storeAccess: [],
    temporaryPassword: ''
  })

  const [stores, setStores] = useState<Array<{ id: string; name: string; type: string }>>([])

  const fetchStores = async () => {
    try {
      // ✅ Fetch real store data from cannabis stores API
      const response = await fetch('/admin/cannabis/stores', {
        credentials: 'include'
      })
      const storesData = await response.json()

      // Transform to simple format for UI
      const transformedStores = storesData.map((store: any) => ({
        id: store.storeId,
        name: store.storeName,
        type: store.storeType
      }))

      setStores(transformedStores)
      console.log('Real stores data loaded:', transformedStores)
    } catch (error) {
      console.error('Failed to fetch stores from database:', error)
      setStores([])
    }
  }

  useEffect(() => {
    fetchUsers()
    fetchStores()
  }, [])

  const fetchUsers = async () => {
    try {
      // ✅ Official Medusa v2 User API Pattern - Use Real Database
      const response = await fetch('/admin/users', {
        credentials: 'include'
      })

      const data = await response.json()
      console.log('Real user data from database:', data)

      // Transform Medusa users to include cannabis-specific fields
      const cannabisUsers: CannabisUser[] = data.users.map((user: any) => ({
        id: user.id,
        email: user.email,
        firstName: user.first_name || '',
        lastName: user.last_name || '',
        role: user.metadata?.cannabis_role || 'staff',
        storeAccess: user.metadata?.store_access || [],
        isActive: !user.deleted_at,
        lastLogin: user.metadata?.last_login || 'Never',
        createdAt: user.created_at,
        permissions: {
          canViewReports: user.metadata?.can_view_reports ?? false,
          canManageProducts: user.metadata?.can_manage_products ?? false,
          canProcessOrders: user.metadata?.can_process_orders ?? false,
          canAccessCompliance: user.metadata?.can_access_compliance ?? false,
          canManageUsers: user.metadata?.can_manage_users ?? false
        }
      }))

      setUsers(cannabisUsers)
      console.log('Processed cannabis users:', cannabisUsers)
    } catch (error) {
      console.error('Failed to fetch users from database:', error)
      setUsers([]) // Empty array, let user create new users
    } finally {
      setLoading(false)
    }
  }

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case 'master_admin': return 'red'
      case 'store_manager': return 'blue'
      case 'staff': return 'green'
      case 'read_only': return 'grey'
    }
  }

  const getRolePermissions = (role: UserRole) => {
    switch (role) {
      case 'master_admin':
        return {
          canViewReports: true,
          canManageProducts: true,
          canProcessOrders: true,
          canAccessCompliance: true,
          canManageUsers: true
        }
      case 'store_manager':
        return {
          canViewReports: true,
          canManageProducts: true,
          canProcessOrders: true,
          canAccessCompliance: true,
          canManageUsers: false
        }
      case 'staff':
        return {
          canViewReports: false,
          canManageProducts: true,
          canProcessOrders: true,
          canAccessCompliance: false,
          canManageUsers: false
        }
      case 'read_only':
        return {
          canViewReports: true,
          canManageProducts: false,
          canProcessOrders: false,
          canAccessCompliance: false,
          canManageUsers: false
        }
    }
  }

  const handleCreateUser = async () => {
    // Validate form
    if (!newUser.email || !newUser.firstName || !newUser.lastName || !newUser.temporaryPassword) {
      alert('❌ Please fill in all required fields')
      return
    }

    try {
      const userData = {
        email: newUser.email,
        first_name: newUser.firstName,
        last_name: newUser.lastName,
        password: newUser.temporaryPassword,
        metadata: {
          cannabis_role: newUser.role,
          store_access: newUser.storeAccess,
          ...getRolePermissions(newUser.role),
          created_by_cannabis_admin: true,
          created_at: new Date().toISOString()
        }
      }

      console.log('Creating user in database:', userData)

      // ✅ Official Medusa v2 User Creation API - Save to Real Database
      const response = await fetch('/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData),
        credentials: 'include'
      })

      if (response.ok) {
        const result = await response.json()
        console.log('✅ User created in database:', result)

        setShowCreateForm(false)
        setNewUser({
          email: '',
          firstName: '',
          lastName: '',
          role: 'staff',
          storeAccess: [],
          temporaryPassword: ''
        })
        alert(`✅ User ${newUser.firstName} ${newUser.lastName} created in database successfully!`)
        fetchUsers() // Refresh with real data from database
      } else {
        const errorData = await response.json()
        console.error('Failed to create user in database:', errorData)
        alert(`❌ Failed to create user: ${errorData.message || 'Database error'}`)
      }
    } catch (error) {
      console.error('Error creating user in database:', error)
      alert('❌ Failed to create user - database connection error')
    }
  }

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    try {
      console.log(`Updating user ${userId} role to ${newRole} in database`)

      // ✅ Official Medusa v2 User Update API - Save to Real Database
      const response = await fetch(`/admin/users/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          metadata: {
            cannabis_role: newRole,
            ...getRolePermissions(newRole),
            updated_at: new Date().toISOString()
          }
        }),
        credentials: 'include'
      })

      if (response.ok) {
        const result = await response.json()
        console.log('✅ User role updated in database:', result)

        // Update local state after successful database update
        setUsers(users.map(user =>
          user.id === userId
            ? { ...user, role: newRole, permissions: getRolePermissions(newRole) }
            : user
        ))

        const userName = users.find(u => u.id === userId)
        alert(`✅ ${userName?.firstName} ${userName?.lastName}'s role updated to ${newRole.replace('_', ' ')} in database`)
      } else {
        const errorData = await response.json()
        console.error('Failed to update user role in database:', errorData)
        alert(`❌ Failed to update role: ${errorData.message || 'Database error'}`)
      }
    } catch (error) {
      console.error('Error updating user role in database:', error)
      alert('❌ Failed to update role - database connection error')
    }
  }

  const generateTemporaryPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let password = ''
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setNewUser({ ...newUser, temporaryPassword: password })
  }

  const getStoreNames = (storeIds: string[]) => {
    return storeIds.map(id => stores.find(store => store.id === id)?.name).filter(Boolean).join(', ')
  }

  if (loading) {
    return (
      <Container className="divide-y p-0">
        <div className="flex items-center justify-between px-6 py-4">
          <Heading level="h1">Cannabis User Management</Heading>
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
        <Heading level="h1">👥 Cannabis User Management</Heading>
        <Button onClick={() => setShowCreateForm(true)}>Add New User</Button>
      </div>

      <div className="px-6 py-6">
        {/* User Management Cards - Official Medusa UI Pattern */}
        <div className="space-y-4">
          <div className="border rounded-lg">
            <div className="px-6 py-4 border-b">
              <Heading level="h2">Cannabis Team Members</Heading>
            </div>

            <div className="p-6 space-y-4">
              {users.map((user) => (
                <div key={user.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div>
                          <Heading level="h3">{user.firstName} {user.lastName}</Heading>
                          <Text size="small">{user.email}</Text>
                        </div>
                        <Badge color={getRoleColor(user.role)}>
                          {user.role.replace('_', ' ').toUpperCase()}
                        </Badge>
                        <Badge color={user.isActive ? 'green' : 'red'}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>

                      <div className="mt-2 grid grid-cols-2 gap-4">
                        <div>
                          <Text size="small">Store Access:</Text>
                          <Text size="small">{getStoreNames(user.storeAccess) || 'No access'}</Text>
                        </div>
                        <div>
                          <Text size="small">Last Login:</Text>
                          <Text size="small">
                            {user.lastLogin === 'Never' ? 'Never' : new Date(user.lastLogin).toLocaleDateString()}
                          </Text>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Select
                        value={user.role}
                        onValueChange={(value: UserRole) => handleRoleChange(user.id, value)}
                        size="small"
                      >
                        <option value="master_admin">Master Admin</option>
                        <option value="store_manager">Store Manager</option>
                        <option value="staff">Staff</option>
                        <option value="read_only">Read Only</option>
                      </Select>
                      <Button
                        variant="transparent"
                        size="small"
                        onClick={() => {
                          setSelectedUser(user)
                          setShowPermissionsDialog(true)
                        }}
                      >
                        Permissions
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Create User Modal - Official Medusa UI Pattern */}
        {showCreateForm && (
          <Container className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Container className="max-w-2xl w-full mx-4">
              <div className="px-6 py-4 border-b">
                <Heading level="h2">Create New Cannabis Team Member</Heading>
              </div>

              <div className="px-6 py-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Text size="small" weight="plus">First Name</Text>
                    <Input
                      placeholder="John"
                      value={newUser.firstName}
                      onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Text size="small" weight="plus">Last Name</Text>
                    <Input
                      placeholder="Smith"
                      value={newUser.lastName}
                      onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Text size="small" weight="plus">Email Address</Text>
                  <Input
                    type="email"
                    placeholder="john@yourbusiness.com"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Text size="small" weight="plus">Cannabis Role</Text>
                  <Select
                    value={newUser.role}
                    onValueChange={(value: UserRole) => setNewUser({ ...newUser, role: value })}
                  >
                    <option value="master_admin">🔴 Master Admin - Full Access</option>
                    <option value="store_manager">🔵 Store Manager - Store Operations</option>
                    <option value="staff">🟢 Staff - Daily Operations</option>
                    <option value="read_only">⚫ Read Only - View Only</option>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Text size="small" weight="plus">Store Access</Text>
                  <div className="grid grid-cols-1 gap-2">
                    {stores.map((store) => (
                      <div key={store.id} className="flex items-center justify-between p-3 border rounded">
                        <Text size="small">{store.name} ({store.type})</Text>
                        <input
                          type="checkbox"
                          checked={newUser.storeAccess.includes(store.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setNewUser({ ...newUser, storeAccess: [...newUser.storeAccess, store.id] })
                            } else {
                              setNewUser({ ...newUser, storeAccess: newUser.storeAccess.filter(id => id !== store.id) })
                            }
                          }}
                          className="h-4 w-4"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Text size="small" weight="plus">Temporary Password</Text>
                  <div className="flex gap-2">
                    <Input
                      type="password"
                      placeholder="Generated password will appear here"
                      value={newUser.temporaryPassword}
                      onChange={(e) => setNewUser({ ...newUser, temporaryPassword: e.target.value })}
                    />
                    <Button variant="secondary" size="small" onClick={generateTemporaryPassword}>
                      Generate
                    </Button>
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 border-t flex justify-end gap-2">
                <Button variant="secondary" onClick={() => setShowCreateForm(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateUser}>Create User</Button>
              </div>
            </Container>
          </Container>
        )}

        {/* Permissions Dialog - Official Medusa UI Pattern */}
        {showPermissionsDialog && selectedUser && (
          <Container className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Container className="max-w-md w-full mx-4">
              <div className="px-6 py-4 border-b">
                <Heading level="h3">
                  Permissions: {selectedUser.firstName} {selectedUser.lastName}
                </Heading>
              </div>

              <div className="px-6 py-6 space-y-4">
                {Object.entries(selectedUser.permissions).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-3 border rounded">
                    <Text size="small">
                      {key.replace('can', '').replace(/([A-Z])/g, ' $1').trim()}
                    </Text>
                    <Badge color={value ? 'green' : 'red'}>
                      {value ? '✅ Allowed' : '❌ Denied'}
                    </Badge>
                  </div>
                ))}

                <div className="mt-4 p-3 border rounded">
                  <Text size="small">
                    Permissions are automatically set based on the user's role.
                    Change the role to modify permissions.
                  </Text>
                </div>
              </div>

              <div className="px-6 py-4 border-t flex justify-end">
                <Button variant="secondary" onClick={() => setShowPermissionsDialog(false)}>
                  Close
                </Button>
              </div>
            </Container>
          </Container>
        )}
      </div>
    </Container>
  )
}

// ✅ Official Medusa v2 Route Configuration
export const config = defineRouteConfig({
  label: "👥 Cannabis Users",
})

export default CannabisUsersPage