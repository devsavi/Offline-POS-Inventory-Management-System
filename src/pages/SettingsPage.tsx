import React, { useState } from 'react'
import { Settings, Store, Printer, Database, Palette } from 'lucide-react'
import { Card, PillButton } from '../components/ui'

export const SettingsPage: React.FC = () => {
  const [tab, setTab] = useState<'store' | 'hardware' | 'database' | 'appearance'>('store')
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-950 dark:text-white tracking-tight">System Settings</h1>
        <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">Configure store info, printers, database, and appearance.</p>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {[
          { id: 'store' as const, label: 'Store Info', icon: <Store className="w-3.5 h-3.5" /> },
          { id: 'hardware' as const, label: 'Hardware / Printer', icon: <Printer className="w-3.5 h-3.5" /> },
          { id: 'database' as const, label: 'Database', icon: <Database className="w-3.5 h-3.5" /> },
          { id: 'appearance' as const, label: 'Appearance', icon: <Palette className="w-3.5 h-3.5" /> },
        ].map(t => (
          <PillButton key={t.id} active={tab === t.id} onClick={() => setTab(t.id)} icon={t.icon}>
            {t.label}
          </PillButton>
        ))}
      </div>

      <Card title="Settings Panel" subtitle={`Configure ${tab} preferences`}>
        <div className="py-16 flex flex-col items-center text-center text-gray-400 dark:text-slate-500 gap-3">
          <Settings className="w-10 h-10 opacity-40" />
          <p className="text-sm font-medium">Settings module coming in Phase 7</p>
          <p className="text-xs">Store details, receipt header/footer, thermal printer setup, SQLite backup & restore.</p>
        </div>
      </Card>
    </div>
  )
}
