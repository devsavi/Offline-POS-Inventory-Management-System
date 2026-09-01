import React from 'react'
import { Receipt, Plus, Search, ScanLine } from 'lucide-react'
import { Card, PrimaryButton } from '../components/ui'

export const BillingPage: React.FC = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-950 dark:text-white tracking-tight">Point of Sale</h1>
        <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">Create bills, process payments, and manage the cash register.</p>
      </div>
      <PrimaryButton icon={<Plus className="w-4 h-4" />}>New Transaction</PrimaryButton>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Card title="Product Search" subtitle="Scan barcode or search by name / SKU" action={<ScanLine className="w-4 h-4 text-emerald-600" />}>
          <div className="relative mb-4">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input placeholder="Search or scan product..." className="w-full pl-9 pr-4 py-2.5 bg-gray-50 dark:bg-slate-700/60 border border-gray-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-emerald-500/60 transition-all dark:text-slate-100 dark:placeholder-slate-500" />
          </div>
          <div className="py-16 flex flex-col items-center justify-center text-center text-gray-400 dark:text-slate-500 gap-3">
            <Receipt className="w-10 h-10 opacity-40" />
            <p className="text-sm font-medium">No items in cart yet</p>
            <p className="text-xs">Search for products or scan a barcode to begin a sale.</p>
          </div>
        </Card>
      </div>
      <div>
        <Card title="Order Summary" subtitle="Current transaction">
          <div className="py-10 text-center text-gray-400 dark:text-slate-500">
            <p className="text-sm">Cart is empty</p>
          </div>
          <PrimaryButton fullWidth variant="primary">Process Payment</PrimaryButton>
        </Card>
      </div>
    </div>
  </div>
)
