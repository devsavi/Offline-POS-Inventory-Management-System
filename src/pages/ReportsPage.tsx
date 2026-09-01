import React from 'react'
import { BarChart3, Download, TrendingUp } from 'lucide-react'
import { Card, KpiCard, PrimaryButton, PillButton } from '../components/ui'
import { useState } from 'react'

export const ReportsPage: React.FC = () => {
  const [reportType, setReportType] = useState<'sales' | 'inventory' | 'customers' | 'financial'>('sales')
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-950 dark:text-white tracking-tight">Reports & Analytics</h1>
          <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">Sales performance, inventory reports, and financial summaries.</p>
        </div>
        <PrimaryButton icon={<Download className="w-4 h-4" />} variant="outline">Export PDF / Excel</PrimaryButton>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {(['sales', 'inventory', 'customers', 'financial'] as const).map(t => (
          <PillButton key={t} active={reportType === t} onClick={() => setReportType(t)}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </PillButton>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KpiCard title="Total Revenue (Month)" value="$41,280" changeType="positive" change="+18.2%" subtitle="vs last month" icon={<TrendingUp className="w-5 h-5" />} />
        <KpiCard title="Orders (Month)" value="4,891" changeType="positive" change="+11.4%" subtitle="transactions" icon={<BarChart3 className="w-5 h-5" />} />
        <KpiCard title="Net Profit" value="$18,640" changeType="positive" change="+22.8%" subtitle="after COGS" icon={<TrendingUp className="w-5 h-5" />} />
      </div>

      <Card title="Report Charts" subtitle="Visual analytics and trend breakdowns">
        <div className="py-20 flex flex-col items-center text-center text-gray-400 dark:text-slate-500 gap-3">
          <BarChart3 className="w-10 h-10 opacity-40" />
          <p className="text-sm font-medium">Recharts graphs coming in Phase 5</p>
          <p className="text-xs">Daily/weekly sales trends, category breakdown pie charts, and profit analysis.</p>
        </div>
      </Card>
    </div>
  )
}
