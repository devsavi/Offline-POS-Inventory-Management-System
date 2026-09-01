import { Inbox, Loader2 } from 'lucide-react'
import { DataTableProps } from '../../types'

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  isLoading = false,
  emptyMessage = 'No records found',
  emptySubtext = 'Get started by creating a new entry or changing filters.',
  onRowClick,
  hoverable = true,
  compact = false,
  className = '',
}: DataTableProps<T>) {
  const alignClass = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }

  return (
    <div
      className={`w-full overflow-x-auto rounded-xl border border-gray-100 dark:border-slate-700/60 bg-white dark:bg-slate-800/90 shadow-soft ${className}`}
    >
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-gray-100 dark:border-slate-700/80 bg-gray-50/70 dark:bg-slate-800/50">
            {columns.map((col) => (
              <th
                key={col.key}
                style={{ width: col.width }}
                className={`${
                  compact ? 'py-2.5 px-3' : 'py-3.5 px-4'
                } text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400 ${
                  alignClass[col.align || 'left']
                }`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-slate-700/40 text-sm">
          {isLoading ? (
            <tr>
              <td colSpan={columns.length} className="py-12 text-center">
                <div className="flex flex-col items-center justify-center gap-2 text-gray-400 dark:text-slate-500">
                  <Loader2 className="w-6 h-6 animate-spin text-emerald-600 dark:text-emerald-400" />
                  <span className="text-xs font-medium">Loading data...</span>
                </div>
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="py-12 text-center">
                <div className="flex flex-col items-center justify-center gap-2 max-w-xs mx-auto text-gray-400 dark:text-slate-500">
                  <div className="p-3 rounded-full bg-gray-50 dark:bg-slate-800 text-gray-400 dark:text-slate-400 border border-gray-200/50 dark:border-slate-700/50">
                    <Inbox className="w-6 h-6" />
                  </div>
                  <p className="font-semibold text-sm text-gray-700 dark:text-slate-300">
                    {emptyMessage}
                  </p>
                  {emptySubtext && (
                    <p className="text-xs text-gray-500 dark:text-slate-400 leading-relaxed">
                      {emptySubtext}
                    </p>
                  )}
                </div>
              </td>
            </tr>
          ) : (
            data.map((item, index) => {
              const key = keyExtractor(item, index)
              return (
                <tr
                  key={key}
                  onClick={() => onRowClick?.(item)}
                  className={`transition-colors duration-100 ${
                    hoverable
                      ? 'hover:bg-emerald-50/30 dark:hover:bg-slate-700/40 cursor-pointer'
                      : ''
                  }`}
                >
                  {columns.map((col) => (
                    <td
                      key={`${String(key)}-${col.key}`}
                      className={`${
                        compact ? 'py-2.5 px-3' : 'py-3.5 px-4'
                      } text-gray-700 dark:text-slate-200 text-xs sm:text-sm ${
                        alignClass[col.align || 'left']
                      }`}
                    >
                      {col.render
                        ? col.render(item, index)
                        : (item as Record<string, unknown>)[col.key] !== undefined
                        ? String((item as Record<string, unknown>)[col.key])
                        : '-'}
                    </td>
                  ))}
                </tr>
              )
            })
          )}
        </tbody>
      </table>
    </div>
  )
}
