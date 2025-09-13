'use client'

// Cannabis CRM - Based on Official shadcn/ui Data Table Example
// Reference: https://ui.shadcn.com/examples/tasks
// Implements cannabis customer management with compliance features

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal, Plus, Search, Shield, AlertTriangle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Badge,
} from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

/**
 * Cannabis Customer Interface
 * Includes age verification and compliance tracking
 */
export interface CannabisCustomer {
  id: string
  name: string
  email: string
  phone?: string
  ageVerified: boolean
  dateOfBirth?: string
  status: "active" | "inactive" | "flagged"
  storeType: "retail" | "luxury" | "wholesale"
  lastPurchase?: string
  totalSpent: number
  complianceFlags: string[]
  notes?: string
  createdAt: string
  updatedAt: string
}

/**
 * Cannabis Order Interface
 * Basic order tracking for CRM context
 */
export interface CannabisOrder {
  id: string
  customerId: string
  total: number
  status: "pending" | "completed" | "cancelled"
  orderDate: string
  items: number
  complianceChecked: boolean
}

/**
 * Cannabis CRM Props Interface
 */
export interface CannabisCRMProps {
  customers?: CannabisCustomer[]
  orders?: CannabisOrder[]
  storeType: "retail" | "luxury" | "wholesale"
  onCustomerSelect?: (customer: CannabisCustomer) => void
  onCustomerUpdate?: (customer: CannabisCustomer) => void
  onAddNote?: (customerId: string, note: string) => void
}

/**
 * Sample Cannabis Customer Data
 */
const sampleCustomers: CannabisCustomer[] = [
  {
    id: "cust_001",
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    phone: "(555) 123-4567",
    ageVerified: true,
    dateOfBirth: "1985-03-15",
    status: "active",
    storeType: "retail",
    lastPurchase: "2024-01-15",
    totalSpent: 1250.00,
    complianceFlags: [],
    notes: "Regular customer, prefers indica strains",
    createdAt: "2023-06-01",
    updatedAt: "2024-01-15"
  },
  {
    id: "cust_002", 
    name: "Michael Chen",
    email: "m.chen@business.com",
    phone: "(555) 987-6543",
    ageVerified: true,
    dateOfBirth: "1978-11-22",
    status: "active",
    storeType: "wholesale",
    lastPurchase: "2024-01-14",
    totalSpent: 15750.00,
    complianceFlags: [],
    notes: "B2B wholesale account, monthly orders",
    createdAt: "2023-04-12",
    updatedAt: "2024-01-14"
  },
  {
    id: "cust_003",
    name: "Emma Wilson",
    email: "emma.w@gmail.com",
    phone: "(555) 456-7890",
    ageVerified: false,
    status: "flagged",
    storeType: "luxury",
    lastPurchase: "2023-12-20",
    totalSpent: 450.00,
    complianceFlags: ["age_verification_pending", "id_document_required"],
    notes: "Age verification documents pending review",
    createdAt: "2023-12-01",
    updatedAt: "2023-12-20"
  }
]

/**
 * Cannabis CRM Component
 * Professional customer relationship management for cannabis businesses
 */
export function CannabisCRM({ 
  customers = sampleCustomers, 
  orders = [],
  storeType,
  onCustomerSelect,
  onCustomerUpdate,
  onAddNote
}: CannabisCRMProps) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [selectedCustomer, setSelectedCustomer] = React.useState<CannabisCustomer | null>(null)
  const [newNote, setNewNote] = React.useState("")

  // Age verification badge component
  const AgeVerificationBadge = ({ customer }: { customer: CannabisCustomer }) => {
    if (customer.ageVerified) {
      return (
        <Badge variant="secondary" className="bg-green-100 text-green-800">
          <Shield className="w-3 h-3 mr-1" />
          21+ Verified
        </Badge>
      )
    } else {
      return (
        <Badge variant="destructive">
          <AlertTriangle className="w-3 h-3 mr-1" />
          Age Pending
        </Badge>
      )
    }
  }

  // Status badge component
  const StatusBadge = ({ status }: { status: CannabisCustomer['status'] }) => {
    const variants = {
      active: "default",
      inactive: "secondary", 
      flagged: "destructive"
    } as const
    
    return (
      <Badge variant={variants[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  // Define columns for Cannabis CRM data table
  const columns: ColumnDef<CannabisCustomer>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Customer Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "email",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Email
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
    },
    {
      accessorKey: "ageVerified",
      header: "Age Verification",
      cell: ({ row }) => <AgeVerificationBadge customer={row.original} />,
    },
    {
      accessorKey: "status", 
      header: "Status",
      cell: ({ row }) => <StatusBadge status={row.getValue("status")} />,
    },
    {
      accessorKey: "storeType",
      header: "Store Type",
      cell: ({ row }) => (
        <Badge variant="outline">
          {(row.getValue("storeType") as string).charAt(0).toUpperCase() + (row.getValue("storeType") as string).slice(1)}
        </Badge>
      ),
    },
    {
      accessorKey: "totalSpent",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Total Spent
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("totalSpent"))
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(amount)
        return <div className="font-medium">{formatted}</div>
      },
    },
    {
      accessorKey: "lastPurchase",
      header: "Last Purchase",
      cell: ({ row }) => {
        const date = row.getValue("lastPurchase") as string
        return date ? new Date(date).toLocaleDateString() : "Never"
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const customer = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(customer.id)}
              >
                Copy customer ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setSelectedCustomer(customer)}>
                View details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onCustomerSelect?.(customer)}>
                Edit customer
              </DropdownMenuItem>
              {!customer.ageVerified && (
                <DropdownMenuItem>
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Verify age
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const table = useReactTable({
    data: customers,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  const handleAddNote = () => {
    if (selectedCustomer && newNote.trim()) {
      onAddNote?.(selectedCustomer.id, newNote.trim())
      setNewNote("")
    }
  }

  return (
    <div className="w-full">
      {/* CRM Header */}
      <div className="flex items-center justify-between py-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Cannabis CRM</h2>
          <p className="text-muted-foreground">
            Manage customers with cannabis compliance and age verification
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Customer
        </Button>
      </div>

      {/* Search and Filter Controls */}
      <div className="flex items-center py-4 space-x-4">
        <div className="flex items-center space-x-2">
          <Search className="h-4 w-4" />
          <Input
            placeholder="Filter customers by name..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
        </div>
        <Input
          placeholder="Filter by email..."
          value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("email")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Cannabis CRM Data Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No customers found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Table Pagination */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} customer(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>

      {/* Customer Details Dialog */}
      {selectedCustomer && (
        <Dialog open={!!selectedCustomer} onOpenChange={() => setSelectedCustomer(null)}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Customer Details</DialogTitle>
              <DialogDescription>
                Complete cannabis customer information and compliance status
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Name</Label>
                  <p className="text-sm text-muted-foreground">{selectedCustomer.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Email</Label>
                  <p className="text-sm text-muted-foreground">{selectedCustomer.email}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Age Verification</Label>
                  <div className="mt-1">
                    <AgeVerificationBadge customer={selectedCustomer} />
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <div className="mt-1">
                    <StatusBadge status={selectedCustomer.status} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Total Spent</Label>
                  <p className="text-sm text-muted-foreground">
                    ${selectedCustomer.totalSpent.toLocaleString()}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Last Purchase</Label>
                  <p className="text-sm text-muted-foreground">
                    {selectedCustomer.lastPurchase ? new Date(selectedCustomer.lastPurchase).toLocaleDateString() : 'Never'}
                  </p>
                </div>
              </div>

              {selectedCustomer.complianceFlags.length > 0 && (
                <div>
                  <Label className="text-sm font-medium">Compliance Flags</Label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {selectedCustomer.complianceFlags.map((flag) => (
                      <Badge key={flag} variant="destructive">{flag.replace(/_/g, ' ')}</Badge>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <Label className="text-sm font-medium">Notes</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  {selectedCustomer.notes || 'No notes available'}
                </p>
              </div>

              <div>
                <Label htmlFor="new-note" className="text-sm font-medium">Add Note</Label>
                <Textarea
                  id="new-note"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Add a customer note..."
                  className="mt-1"
                />
                <Button onClick={handleAddNote} className="mt-2" size="sm">
                  Add Note
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

export default CannabisCRM