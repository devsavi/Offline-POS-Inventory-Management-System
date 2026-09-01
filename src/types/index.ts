import { ReactNode } from 'react'

export type AppModule =
  | 'dashboard'
  | 'billing'
  | 'inventory'
  | 'customers'
  | 'reports'
  | 'users'
  | 'assets'
  | 'settings'
  | 'admin'

export type ThemeMode = 'light' | 'dark'

export interface UserProfile {
  id: string
  name: string
  role: 'admin' | 'cashier' | 'manager'
  avatar?: string
}

export interface NavItem {
  id: AppModule
  label: string
  icon: string
  badge?: string | number
}

export interface TableColumn<T> {
  key: string
  header: string
  width?: string
  align?: 'left' | 'center' | 'right'
  render?: (item: T, index: number) => ReactNode
}

export interface DataTableProps<T> {
  columns: TableColumn<T>[]
  data: T[]
  keyExtractor: (item: T, index: number) => string | number
  isLoading?: boolean
  emptyMessage?: string
  emptySubtext?: string
  onRowClick?: (item: T) => void
  hoverable?: boolean
  compact?: boolean
  className?: string
}

export interface CardProps {
  children: ReactNode
  title?: ReactNode
  subtitle?: ReactNode
  action?: ReactNode
  className?: string
  bodyClassName?: string
  headerClassName?: string
  padding?: 'none' | 'sm' | 'md' | 'lg'
  noBorder?: boolean
}

export interface KpiCardProps {
  title: string
  value: string | number
  subtitle?: string
  change?: string | number
  changeType?: 'positive' | 'negative' | 'neutral'
  icon?: ReactNode
  badgeText?: string
  className?: string
  onClick?: () => void
}

export interface PillButtonProps {
  label?: string
  children?: ReactNode
  active?: boolean
  onClick?: () => void
  icon?: ReactNode
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'accent'
  className?: string
  disabled?: boolean
}

export interface PrimaryButtonProps {
  children: ReactNode
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  disabled?: boolean
  loading?: boolean
  icon?: ReactNode
  iconRight?: ReactNode
  className?: string
}
