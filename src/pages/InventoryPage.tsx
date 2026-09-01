import React from 'react'
import { Package, Plus, AlertTriangle } from 'lucide-react'
import { Card, KpiCard, PrimaryButton } from '../components/ui'

export const InventoryPage: React.FC = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-950 dark:text-white tracking-tight">Inventory & Stock</h1>
        <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">Track products, manage stock levels, and handle reorders.</p>
      </div>
      <PrimaryButton icon={<Plus className="w-4 h-4" />}>Add Product</PrimaryButton>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <KpiCard title="Total Products" value="248" icon={<Package className="w-5 h-5" />} />
      <KpiCard title="Low Stock Items" value="3" changeType="negative" icon={<AlertTriangle className="w-5 h-5 text-amber-500" />} badgeText="Needs Reorder" />
      <KpiCard title="Out of Stock" value="1" changeType="negative" badgeText="Critical" icon={<Package className="w-5 h-5" />} />
      <KpiCard title="Stock Value" value="$12,480" changeType="positive" change="+5.2%" subtitle="total inventory" icon={<Package className="w-5 h-5" />} />
    </div>

    <Card title="Product Catalog" subtitle="All products and their current stock levels">
      <div className="py-16 flex flex-col items-center text-center text-gray-400 dark:text-slate-500 gap-3">
        <Package className="w-10 h-10 opacity-40" />
        <p className="text-sm font-medium">Inventory table coming in Phase 2</p>
        <p className="text-xs">Full product management including categories, barcodes, and stock movements.</p>
      </div>
    </Card>
  </div>
)
