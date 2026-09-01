import React from 'react'
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react'
import { KpiCardProps } from '../../types'

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  subtitle,
  change,
  changeType = 'neutral',
  icon,
  badgeText,
  className = '',
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white dark:bg-slate-800/90 rounded-xl border border-gray-100 dark:border-slate-700/60 p-5 shadow-soft transition-all duration-150 ${
        onClick ? 'cursor-pointer hover:border-emerald-500/50 hover:shadow-md' : ''
      } ${className}`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-slate-400">
            {title}
          </p>
          <p className="text-2xl lg:text-3xl font-extrabold text-gray-950 dark:text-white tracking-tight">
            {value}
          </p>
        </div>
        {icon && (
          <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-100/60 dark:border-emerald-900/40 shrink-0">
            {icon}
          </div>
        )}
      </div>

      {(subtitle || change !== undefined || badgeText) && (
        <div className="mt-3.5 pt-3 border-t border-gray-100 dark:border-slate-700/40 flex items-center justify-between text-xs">
          {change !== undefined && (
            <div className="flex items-center gap-1.5 font-medium">
              {changeType === 'positive' && (
                <span className="inline-flex items-center gap-0.5 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-1.5 py-0.5 rounded-md text-[11px] font-semibold">
                  <ArrowUpRight className="w-3 h-3" />
                  {change}
                </span>
              )}
              {changeType === 'negative' && (
                <span className="inline-flex items-center gap-0.5 text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 px-1.5 py-0.5 rounded-md text-[11px] font-semibold">
                  <ArrowDownRight className="w-3 h-3" />
                  {change}
                </span>
              )}
              {changeType === 'neutral' && (
                <span className="inline-flex items-center gap-0.5 text-gray-500 dark:text-slate-400 bg-gray-100 dark:bg-slate-700/50 px-1.5 py-0.5 rounded-md text-[11px] font-semibold">
                  <Minus className="w-3 h-3" />
                  {change}
                </span>
              )}
              {subtitle && (
                <span className="text-gray-500 dark:text-slate-400">
                  {subtitle}
                </span>
              )}
            </div>
          )}
          {!change && subtitle && (
            <span className="text-gray-500 dark:text-slate-400">{subtitle}</span>
          )}
          {badgeText && (
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300">
              {badgeText}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
