import React from 'react'
import { Users, Plus, Star } from 'lucide-react'
import { Card, KpiCard, PrimaryButton } from '../components/ui'

export const CustomersPage: React.FC = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-950 dark:text-white tracking-tight">Customer Directory</h1>
        <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">Manage customer accounts, loyalty points, and purchase history.</p>
      </div>
      <PrimaryButton icon={<Plus className="w-4 h-4" />}>Add Customer</PrimaryButton>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <KpiCard title="Total Customers" value="386" icon={<Users className="w-5 h-5" />} changeType="positive" change="+14" subtitle="this month" />
      <KpiCard title="Loyalty Members" value="129" icon={<Star className="w-5 h-5" />} badgeText="Active" />
      <KpiCard title="Avg. Customer Spend" value="$22.40" changeType="positive" change="+3.1%" subtitle="per visit" icon={<Users className="w-5 h-5" />} />
    </div>

    <Card title="Customer List" subtitle="All registered customers and loyalty accounts">
      <div className="py-16 flex flex-col items-center text-center text-gray-400 dark:text-slate-500 gap-3">
        <Users className="w-10 h-10 opacity-40" />
        <p className="text-sm font-medium">Customer management coming in Phase 4</p>
        <p className="text-xs">Full CRM with purchase history, loyalty points, and account balances.</p>
      </div>
    </Card>
  </div>
)
