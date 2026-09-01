import React from 'react'
import { UserCheck, Plus, Clock } from 'lucide-react'
import { Card, KpiCard, PrimaryButton } from '../components/ui'

export const UsersPage: React.FC = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-950 dark:text-white tracking-tight">Users & Staff</h1>
        <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">Manage staff accounts, roles, and shift schedules.</p>
      </div>
      <PrimaryButton icon={<Plus className="w-4 h-4" />}>Add Staff Member</PrimaryButton>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <KpiCard title="Total Staff" value="12" icon={<UserCheck className="w-5 h-5" />} />
      <KpiCard title="On Shift Today" value="5" badgeText="Active Now" icon={<Clock className="w-5 h-5" />} />
      <KpiCard title="Open Shifts" value="2" changeType="negative" badgeText="Needs Coverage" icon={<UserCheck className="w-5 h-5" />} />
    </div>

    <Card title="Staff Directory" subtitle="All active staff members and their assigned roles">
      <div className="py-16 flex flex-col items-center text-center text-gray-400 dark:text-slate-500 gap-3">
        <UserCheck className="w-10 h-10 opacity-40" />
        <p className="text-sm font-medium">Staff & shift management coming in Phase 3</p>
        <p className="text-xs">PIN login, shift handover, role-based access control (Admin / Manager / Cashier).</p>
      </div>
    </Card>
  </div>
)
