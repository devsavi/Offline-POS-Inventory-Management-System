import React from 'react'
import { Landmark, Plus } from 'lucide-react'
import { Card, KpiCard, PrimaryButton } from '../components/ui'

export const AssetsPage: React.FC = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-950 dark:text-white tracking-tight">Asset Tracking</h1>
        <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">Track equipment, furniture, and depreciating cafe assets.</p>
      </div>
      <PrimaryButton icon={<Plus className="w-4 h-4" />}>Register Asset</PrimaryButton>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <KpiCard title="Total Assets" value="34" icon={<Landmark className="w-5 h-5" />} />
      <KpiCard title="Total Asset Value" value="$68,400" icon={<Landmark className="w-5 h-5" />} changeType="neutral" />
      <KpiCard title="Due for Service" value="2 Items" badgeText="This Month" icon={<Landmark className="w-5 h-5" />} />
    </div>

    <Card title="Asset Register" subtitle="All tracked equipment and their depreciation schedules">
      <div className="py-16 flex flex-col items-center text-center text-gray-400 dark:text-slate-500 gap-3">
        <Landmark className="w-10 h-10 opacity-40" />
        <p className="text-sm font-medium">Asset management coming in Phase 6</p>
        <p className="text-xs">Equipment registration, maintenance schedules, depreciation tracking.</p>
      </div>
    </Card>
  </div>
)
