'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Search, X, SlidersHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FilterChip {
  id: string
  label: string
  category: string
}

interface TransactionFiltersProps {
  onSearchChange: (value: string) => void
  onSortChange: (value: string) => void
  searchValue: string
  sortValue: string
}

const transactionTypes = [
  { value: 'all', label: 'All' },
  { value: 'credit', label: 'Credit' },
  { value: 'debit', label: 'Debit' },
  { value: 'upi', label: 'UPI' },
  { value: 'neft', label: 'NEFT' },
  { value: 'cheque', label: 'Cheque' },
]

const amountRanges = [
  { value: 'all', label: 'All' },
  { value: 'lt1k', label: '<₹1K' },
  { value: '1k-10k', label: '₹1K-₹10K' },
  { value: '10k-50k', label: '₹10K-₹50K' },
  { value: 'gt50k', label: '>₹50K' },
]

const statuses = [
  { value: 'all', label: 'All' },
  { value: 'flagged', label: 'Flagged' },
  { value: 'normal', label: 'Normal' },
  { value: 'pending', label: 'Pending Review' },
]

const categories = [
  { value: 'all', label: 'All' },
  { value: 'vendor', label: 'Vendor Payments' },
  { value: 'salary', label: 'Salaries' },
  { value: 'utility', label: 'Utilities' },
  { value: 'other', label: 'Other' },
]

export function TransactionFilters({
  onSearchChange,
  onSortChange,
  searchValue,
  sortValue,
}: TransactionFiltersProps) {
  const [activeFilters, setActiveFilters] = useState<FilterChip[]>([])
  const [transactionType, setTransactionType] = useState('all')
  const [amountRange, setAmountRange] = useState('all')
  const [status, setStatus] = useState('all')
  const [category, setCategory] = useState('all')

  const addFilter = (id: string, label: string, category: string) => {
    if (!activeFilters.find((f) => f.id === id)) {
      setActiveFilters([...activeFilters, { id, label, category }])
    }
  }

  const removeFilter = (id: string) => {
    setActiveFilters(activeFilters.filter((f) => f.id !== id))
    // Reset the corresponding dropdown
    const filter = activeFilters.find((f) => f.id === id)
    if (filter) {
      switch (filter.category) {
        case 'type':
          setTransactionType('all')
          break
        case 'amount':
          setAmountRange('all')
          break
        case 'status':
          setStatus('all')
          break
        case 'category':
          setCategory('all')
          break
      }
    }
  }

  const clearAllFilters = () => {
    setActiveFilters([])
    setTransactionType('all')
    setAmountRange('all')
    setStatus('all')
    setCategory('all')
    onSearchChange('')
  }

  return (
    <div className="sticky top-0 z-20 space-y-4 border-b border-border bg-background/95 pb-4 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      {/* Search and Sort Row */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        {/* Search */}
        <div className="relative flex-1 md:max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by vendor, description, amount..."
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 pr-10"
          />
          {searchValue && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
              onClick={() => onSearchChange('')}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <span className="hidden text-sm text-muted-foreground md:inline">Sort by:</span>
          <Select value={sortValue} onValueChange={onSortChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date-desc">Date (Newest First)</SelectItem>
              <SelectItem value="date-asc">Date (Oldest First)</SelectItem>
              <SelectItem value="amount-desc">Amount (High to Low)</SelectItem>
              <SelectItem value="amount-asc">Amount (Low to High)</SelectItem>
              <SelectItem value="vendor-asc">Vendor Name (A-Z)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Filter Dropdowns */}
      <div className="flex flex-wrap items-center gap-2">
        <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
        
        <Select
          value={transactionType}
          onValueChange={(value) => {
            setTransactionType(value)
            if (value !== 'all') {
              addFilter(`type-${value}`, transactionTypes.find((t) => t.value === value)?.label || '', 'type')
            } else {
              removeFilter(`type-${transactionType}`)
            }
          }}
        >
          <SelectTrigger className="w-auto">
            <SelectValue placeholder="Transaction Type" />
          </SelectTrigger>
          <SelectContent>
            {transactionTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={amountRange}
          onValueChange={(value) => {
            setAmountRange(value)
            if (value !== 'all') {
              addFilter(`amount-${value}`, amountRanges.find((a) => a.value === value)?.label || '', 'amount')
            } else {
              removeFilter(`amount-${amountRange}`)
            }
          }}
        >
          <SelectTrigger className="w-auto">
            <SelectValue placeholder="Amount Range" />
          </SelectTrigger>
          <SelectContent>
            {amountRanges.map((range) => (
              <SelectItem key={range.value} value={range.value}>
                {range.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={status}
          onValueChange={(value) => {
            setStatus(value)
            if (value !== 'all') {
              addFilter(`status-${value}`, statuses.find((s) => s.value === value)?.label || '', 'status')
            } else {
              removeFilter(`status-${status}`)
            }
          }}
        >
          <SelectTrigger className="w-auto">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {statuses.map((s) => (
              <SelectItem key={s.value} value={s.value}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={category}
          onValueChange={(value) => {
            setCategory(value)
            if (value !== 'all') {
              addFilter(`category-${value}`, categories.find((c) => c.value === value)?.label || '', 'category')
            } else {
              removeFilter(`category-${category}`)
            }
          }}
        >
          <SelectTrigger className="w-auto">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat.value} value={cat.value}>
                {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {activeFilters.map((filter) => (
            <Badge
              key={filter.id}
              variant="secondary"
              className="gap-1 pl-2 pr-1"
            >
              {filter.label}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 hover:bg-transparent"
                onClick={() => removeFilter(filter.id)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="h-7 text-xs"
          >
            Clear all
          </Button>
        </div>
      )}
    </div>
  )
}
