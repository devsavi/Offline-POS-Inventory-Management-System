import React, { useState } from 'react'
import {
  DollarSign,
  ShoppingBag,
  TrendingUp,
  AlertTriangle,
  Plus,
  ArrowRight,
  Coffee,
  Receipt,
  Download,
} from 'lucide-react'
import { Card, KpiCard, PillButton, PrimaryButton, DataTable } from '../components/ui'
import { useAppStore } from '../store/useAppStore'

interface RecentOrder {
  id: string
  invoiceNo: string
  customer: string
  itemsCount: number
  total: string
  status: 'Completed' | 'Pending' | 'Refunded'
  time: string
}

const recentOrdersData: RecentOrder[] = [
  { id: '1', invoiceNo: 'INV-2026-0042', customer: 'Walk-in Customer', itemsCount: 3, total: '$14.50', status: 'Completed', time: '2 mins ago' },
  { id: '2', invoiceNo: 'INV-2026-0041', customer: 'Sarah Jenkins', itemsCount: 5, total: '$28.00', status: 'Completed', time: '14 mins ago' },
  { id: '3', invoiceNo: 'INV-2026-0040', customer: 'David Miller', itemsCount: 2, total: '$9.20', status: 'Completed', time: '28 mins ago' },
  { id: '4', invoiceNo: 'INV-2026-0039', customer: 'Emma Watson', itemsCount: 4, total: '$22.40', status: 'Completed', time: '45 mins ago' },
  { id: '5', invoiceNo: 'INV-2026-0038', customer: 'Liam Thorne', itemsCount: 1, total: '$4.50', status: 'Refunded', time: '1 hr ago' },
]

export const DashboardPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'today' | 'yesterday' | 'week' | 'month'>('today')
  const { setActiveModule } = useAppStore()

  const columns = [
    {
      key: 'invoiceNo',
      header: 'Invoice #',
      render: (item: RecentOrder) => (
        <span className="font-semibold text-gray-900 dark:text-white">{item.invoiceNo}</span>
      ),
    },
    {
      key: 'customer',
      header: 'Customer',
      render: (item: RecentOrder) => (
        <span className="text-gray-700 dark:text-slate-300">{item.customer}</span>
      ),
    },
    {
      key: 'itemsCount',
      header: 'Items',
      align: 'center' as const,
      render: (item: RecentOrder) => (
        <span className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-slate-700 text-xs font-medium">
          {item.itemsCount} items
        </span>
      ),
    },
    {
      key: 'total',
      header: 'Total',
      align: 'right' as const,
      render: (item: RecentOrder) => (
        <span className="font-bold text-gray-900 dark:text-white">{item.total}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      align: 'center' as const,
      render: (item: RecentOrder) => {
        const isCompleted = item.status === 'Completed'
        const isRefunded = item.status === 'Refunded'
        return (
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
              isCompleted
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                : isRefunded
                ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300'
                : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
            }`}
          >
            {item.status}
          </span>
        )
      },
    },
    {
      key: 'time',
      header: 'Time',
      align: 'right' as const,
      render: (item: RecentOrder) => (
        <span className="text-gray-400 dark:text-slate-500 text-xs">{item.time}</span>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header with Title and Quick Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-950 dark:text-white tracking-tight">
            Cafe Operations Dashboard
          </h1>
          <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
            Real-time offline register performance, stock alerts & shift sales.
          </p>
        </div>

        {/* Time Filters & Quick Action */}
        <div className="flex items-center flex-wrap gap-2">
          <div className="flex items-center gap-1 p-1 bg-white dark:bg-slate-800/90 rounded-full border border-gray-200 dark:border-slate-700/60 shadow-soft">
            <PillButton
              active={timeRange === 'today'}
              onClick={() => setTimeRange('today')}
              size="sm"
            >
              Today
            </PillButton>
            <PillButton
              active={timeRange === 'yesterday'}
              onClick={() => setTimeRange('yesterday')}
              size="sm"
            >
              Yesterday
            </PillButton>
            <PillButton
              active={timeRange === 'week'}
              onClick={() => setTimeRange('week')}
              size="sm"
            >
              Last 7 Days
            </PillButton>
            <PillButton
              active={timeRange === 'month'}
              onClick={() => setTimeRange('month')}
              size="sm"
            >
              This Month
            </PillButton>
          </div>

          <PrimaryButton
            icon={<Plus className="w-4 h-4" />}
            onClick={() => setActiveModule('billing')}
          >
            New Sale
          </PrimaryButton>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Today's Revenue"
          value="$1,428.50"
          change="+12.4%"
          changeType="positive"
          subtitle="vs yesterday"
          icon={<DollarSign className="w-5 h-5" />}
        />
        <KpiCard
          title="Completed Orders"
          value="184"
          change="+8.2%"
          changeType="positive"
          subtitle="vs yesterday"
          icon={<ShoppingBag className="w-5 h-5" />}
        />
        <KpiCard
          title="Average Ticket"
          value="$7.76"
          change="-1.5%"
          changeType="negative"
          subtitle="per customer"
          icon={<TrendingUp className="w-5 h-5" />}
        />
        <KpiCard
          title="Low Stock Alerts"
          value="3 Items"
          subtitle="Requires reorder"
          badgeText="Action Needed"
          icon={<AlertTriangle className="w-5 h-5 text-amber-500" />}
          onClick={() => setActiveModule('inventory')}
        />
      </div>

      {/* Main Content Grid: Recent Orders & Quick Fast Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions Table */}
        <div className="lg:col-span-2 space-y-4">
          <Card
            title="Recent Register Sales"
            subtitle="Latest completed customer orders"
            action={
              <button
                onClick={() => setActiveModule('billing')}
                className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Open Register</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            }
          >
            <DataTable
              columns={columns}
              data={recentOrdersData}
              keyExtractor={(item) => item.id}
              compact
            />
          </Card>
        </div>

        {/* Quick Launch & Top Items Card */}
        <div className="space-y-6">
          <Card title="Fast POS Actions" subtitle="Frequently used register operations">
            <div className="space-y-2.5">
              <PrimaryButton
                variant="primary"
                fullWidth
                icon={<Receipt className="w-4 h-4" />}
                onClick={() => setActiveModule('billing')}
              >
                Open POS Cash Register
              </PrimaryButton>

              <PrimaryButton
                variant="secondary"
                fullWidth
                icon={<Coffee className="w-4 h-4" />}
                onClick={() => setActiveModule('inventory')}
              >
                Manage Cafe Inventory
              </PrimaryButton>

              <PrimaryButton
                variant="outline"
                fullWidth
                icon={<Download className="w-4 h-4" />}
                onClick={() => setActiveModule('reports')}
              >
                Export Today's Summary
              </PrimaryButton>
            </div>
          </Card>

          <Card title="Top Selling Drinks" subtitle="Highest volume items today">
            <div className="space-y-3">
              {[
                { name: 'Iced Caramel Macchiato', count: '48 sold', total: '$252.00', percent: '80%' },
                { name: 'Double Espresso', count: '39 sold', total: '$136.50', percent: '65%' },
                { name: 'Oat Milk Flat White', count: '32 sold', total: '$152.00', percent: '52%' },
                { name: 'Artisan Croissant', count: '24 sold', total: '$96.00', percent: '40%' },
              ].map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="text-gray-800 dark:text-slate-200">{item.name}</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">{item.total}</span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-600 h-full rounded-full transition-all"
                      style={{ width: item.percent }}
                    />
                  </div>
                  <div className="text-[10px] text-gray-400 dark:text-slate-500 text-right">
                    {item.count}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
