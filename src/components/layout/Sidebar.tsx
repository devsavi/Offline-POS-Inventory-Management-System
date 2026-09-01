import React from 'react'
import {
  LayoutDashboard,
  Receipt,
  Package,
  Users,
  BarChart3,
  UserCheck,
  Landmark,
  Settings,
  ShieldAlert,
  Sun,
  Moon,
  Coffee,
  Circle,
} from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'
import { AppModule } from '../../types'

interface NavConfig {
  id: AppModule
  label: string
  icon: React.ElementType
  badge?: string
}

const navItems: NavConfig[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'billing', label: 'Billing / POS', icon: Receipt },
  { id: 'inventory', label: 'Inventory', icon: Package },
  { id: 'customers', label: 'Customers', icon: Users },
  { id: 'reports', label: 'Reports', icon: BarChart3 },
  { id: 'users', label: 'Users', icon: UserCheck },
  { id: 'assets', label: 'Assets', icon: Landmark },
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'admin', label: 'Admin', icon: ShieldAlert },
]

export const Sidebar: React.FC = () => {
  const { activeModule, setActiveModule, theme, toggleTheme } = useAppStore()

  return (
    <aside className="w-64 h-screen bg-white dark:bg-slate-900 border-r border-gray-200/80 dark:border-slate-800 flex flex-col shrink-0 select-none transition-colors duration-150">
      {/* Brand Header */}
      <div className="h-16 px-5 flex items-center gap-3 border-b border-gray-100 dark:border-slate-800">
        <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-sm shadow-emerald-600/30">
          <Coffee className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-base font-bold text-gray-900 dark:text-white tracking-tight leading-none">
            Cafe POS
          </h1>
          <p className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 mt-0.5">
            Offline Edition
          </p>
        </div>
      </div>

      {/* Navigation List */}
      <div className="flex-1 px-3 py-4 overflow-y-auto space-y-1">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-slate-500">
          Main Menu
        </div>
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeModule === item.id

          return (
            <button
              key={item.id}
              onClick={() => setActiveModule(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group cursor-pointer ${
                isActive
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 shadow-xs border border-emerald-200/60 dark:border-emerald-800/60 font-semibold'
                  : 'text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800/70 hover:text-gray-900 dark:hover:text-slate-200 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-gray-400 dark:text-slate-500 group-hover:text-gray-700 dark:group-hover:text-slate-300'
                  }`}
                />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300">
                  {item.badge}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Sidebar Footer */}
      <div className="p-3 border-t border-gray-100 dark:border-slate-800 space-y-2">
        {/* Offline Status */}
        <div className="px-3 py-2 rounded-xl bg-gray-50 dark:bg-slate-800/60 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Circle className="w-2.5 h-2.5 fill-emerald-500 text-emerald-500 animate-pulse" />
            <span className="text-gray-600 dark:text-slate-400 font-medium">SQLite Engine</span>
          </div>
          <span className="text-[10px] font-bold uppercase text-emerald-600 dark:text-emerald-400">
            Active
          </span>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors cursor-pointer border border-transparent"
        >
          <div className="flex items-center gap-2.5">
            {theme === 'dark' ? (
              <Moon className="w-4 h-4 text-indigo-400" />
            ) : (
              <Sun className="w-4 h-4 text-amber-500" />
            )}
            <span>{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
          </div>
          <span className="text-[10px] font-bold uppercase text-gray-400 dark:text-slate-500">
            Switch
          </span>
        </button>
      </div>
    </aside>
  )
}
