import React, { useState, useEffect } from 'react'
import { Search, Calendar, User, ShieldCheck, Sun, Moon } from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'

export const TopBar: React.FC = () => {
  const { searchQuery, setSearchQuery, currentUser, theme, toggleTheme, activeModule } = useAppStore()
  const [currentDateTime, setCurrentDateTime] = useState<string>('')

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date()
      const formatted = now.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
      const timeFormatted = now.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      })
      setCurrentDateTime(`${formatted} • ${timeFormatted}`)
    }

    updateDateTime()
    const timer = setInterval(updateDateTime, 1000)
    return () => clearInterval(timer)
  }, [])

  const moduleTitles: Record<string, string> = {
    dashboard: 'Dashboard Overview',
    billing: 'Point of Sale & Billing',
    inventory: 'Inventory & Stock Management',
    customers: 'Customer Directory & Accounts',
    reports: 'Sales & Financial Reports',
    users: 'Staff & Shift Management',
    assets: 'Asset & Equipment Tracking',
    settings: 'System & Hardware Settings',
    admin: 'Administration & Security',
  }

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-gray-200/80 dark:border-slate-800 px-6 flex items-center justify-between shrink-0 select-none transition-colors duration-150">
      {/* Left: Active Module Breadcrumb / Search */}
      <div className="flex items-center gap-6 flex-1 max-w-xl">
        <div className="hidden lg:block shrink-0">
          <h2 className="text-sm font-bold text-gray-900 dark:text-white capitalize">
            {moduleTitles[activeModule] || activeModule}
          </h2>
        </div>

        {/* Search Bar */}
        <div className="relative w-full max-w-sm">
          <Search className="w-4 h-4 text-gray-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search items, invoices, customers... (Ctrl+K)"
            className="w-full pl-9 pr-4 py-2 bg-gray-100/80 dark:bg-slate-800/80 border border-transparent focus:border-emerald-500/50 dark:focus:border-emerald-500/50 rounded-xl text-xs sm:text-sm text-gray-900 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500 outline-none transition-all"
          />
        </div>
      </div>

      {/* Right: Date, Fast Theme Switch & Active User Pill */}
      <div className="flex items-center gap-4 shrink-0">
        {/* Date & Time */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-50 dark:bg-slate-800/60 text-xs font-medium text-gray-600 dark:text-slate-400 border border-gray-100 dark:border-slate-800">
          <Calendar className="w-3.5 h-3.5 text-gray-400 dark:text-slate-500" />
          <span>{currentDateTime || 'Loading...'}</span>
        </div>

        {/* Quick Theme Toggle Icon */}
        <button
          onClick={toggleTheme}
          title="Toggle Dark/Light Mode"
          className="p-2 rounded-xl text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400 hover:text-amber-300" />
          ) : (
            <Moon className="w-4 h-4 text-slate-600 hover:text-slate-900" />
          )}
        </button>

        {/* Active User Avatar & Role */}
        <div className="flex items-center gap-3 pl-3 border-l border-gray-200 dark:border-slate-800">
          <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300/60 dark:border-emerald-800/60 flex items-center justify-center text-emerald-700 dark:text-emerald-300 font-bold text-xs">
            {currentUser?.name ? currentUser.name.charAt(0) : <User className="w-4 h-4" />}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-bold text-gray-900 dark:text-white leading-tight">
              {currentUser?.name || 'Staff User'}
            </p>
            <div className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
              <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase">
                {currentUser?.role || 'Cashier'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
