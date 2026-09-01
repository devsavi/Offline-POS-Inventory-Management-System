import React from 'react'
import { PillButtonProps } from '../../types'

export const PillButton: React.FC<PillButtonProps> = ({
  label,
  children,
  active = false,
  onClick,
  icon,
  size = 'md',
  variant = 'default',
  className = '',
  disabled = false,
}) => {
  const sizeStyles = {
    sm: 'px-2.5 py-1 text-xs gap-1.5',
    md: 'px-3.5 py-1.5 text-xs font-medium gap-2',
    lg: 'px-4 py-2 text-sm font-medium gap-2',
  }

  const activeStyles =
    variant === 'accent'
      ? 'bg-emerald-600 text-white shadow-sm font-semibold'
      : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/80 font-semibold shadow-xs'

  const inactiveStyles =
    'bg-white dark:bg-slate-800/90 text-gray-600 dark:text-slate-300 border border-gray-200/90 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/60 hover:text-gray-900 dark:hover:text-white'

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex items-center justify-center rounded-full transition-all duration-150 select-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
        sizeStyles[size]
      } ${active ? activeStyles : inactiveStyles} ${className}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children || label}
    </button>
  )
}
