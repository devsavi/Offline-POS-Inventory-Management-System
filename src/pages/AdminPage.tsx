import React from 'react'
import { ShieldAlert, Database, Key, Activity } from 'lucide-react'
import { Card, KpiCard, PillButton } from '../components/ui'
import { useState } from 'react'

export const AdminPage: React.FC = () => {
  const [tab, setTab] = useState<'audit' | 'backup' | 'permissions' | 'system'>('audit')
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200/60 dark:border-rose-900/40">
          <ShieldAlert className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-gray-950 dark:text-white tracking-tight">Administration</h1>
          <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">Audit logs, database management, and security controls. Admin access only.</p>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {[
          { id: 'audit' as const, label: 'Audit Log', icon: <Activity className="w-3.5 h-3.5" /> },
          { id: 'backup' as const, label: 'DB Backup', icon: <Database className="w-3.5 h-3.5" /> },
          { id: 'permissions' as const, label: 'Permissions', icon: <Key className="w-3.5 h-3.5" /> },
          { id: 'system' as const, label: 'System Info', icon: <ShieldAlert className="w-3.5 h-3.5" /> },
        ].map(t => (
          <PillButton key={t.id} active={tab === t.id} onClick={() => setTab(t.id)} icon={t.icon}>
            {t.label}
          </PillButton>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KpiCard title="Audit Events Today" value="142" icon={<Activity className="w-5 h-5" />} badgeText="Live" />
        <KpiCard title="DB Size" value="4.8 MB" icon={<Database className="w-5 h-5" />} subtitle="SQLite local store" />
        <KpiCard title="Last Backup" value="2h ago" icon={<Database className="w-5 h-5" />} badgeText="Auto" />
      </div>

      <Card title="Admin Panel" subtitle={`Manage ${tab} records and settings`}>
        <div className="py-16 flex flex-col items-center text-center text-gray-400 dark:text-slate-500 gap-3">
          <ShieldAlert className="w-10 h-10 opacity-40" />
          <p className="text-sm font-medium">Admin module coming in Phase 8</p>
          <p className="text-xs">Full audit trail, role permissions matrix, SQLite backup/restore, system diagnostics.</p>
        </div>
      </Card>
    </div>
  )
}
