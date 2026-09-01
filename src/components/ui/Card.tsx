import React from 'react'
import { CardProps } from '../../types'

export const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  action,
  className = '',
  bodyClassName = '',
  headerClassName = '',
  padding = 'md',
  noBorder = false,
}) => {
  const paddingClasses = {
    none: 'p-0',
    sm: 'p-3',
    md: 'p-5',
    lg: 'p-6',
  }

  const hasHeader = Boolean(title || subtitle || action)

  return (
    <div
      className={`bg-white dark:bg-slate-800/90 rounded-xl ${
        noBorder ? '' : 'border border-gray-100 dark:border-slate-700/60'
      } shadow-soft transition-colors duration-150 flex flex-col ${className}`}
    >
      {hasHeader && (
        <div
          className={`flex items-center justify-between pb-4 border-b border-gray-100 dark:border-slate-700/50 ${
            padding === 'none' ? 'p-4 pb-3' : paddingClasses[padding]
          } ${headerClassName}`}
        >
          <div>
            {title && (
              <h3 className="text-base font-bold text-gray-900 dark:text-white tracking-tight">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5 font-normal">
                {subtitle}
              </p>
            )}
          </div>
          {action && <div className="flex items-center gap-2">{action}</div>}
        </div>
      )}
      <div className={`${hasHeader ? (padding === 'none' ? '' : paddingClasses[padding]) : paddingClasses[padding]} ${bodyClassName}`}>
        {children}
      </div>
    </div>
  )
}
