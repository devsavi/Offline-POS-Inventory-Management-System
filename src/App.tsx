import { AppLayout } from './components/layout/AppLayout'
import { useAppStore } from './store/useAppStore'
import { DashboardPage } from './pages/DashboardPage'
import { BillingPage } from './pages/BillingPage'
import { InventoryPage } from './pages/InventoryPage'
import { CustomersPage } from './pages/CustomersPage'
import { ReportsPage } from './pages/ReportsPage'
import { UsersPage } from './pages/UsersPage'
import { AssetsPage } from './pages/AssetsPage'
import { SettingsPage } from './pages/SettingsPage'
import { AdminPage } from './pages/AdminPage'

const pageMap = {
  dashboard: DashboardPage,
  billing: BillingPage,
  inventory: InventoryPage,
  customers: CustomersPage,
  reports: ReportsPage,
  users: UsersPage,
  assets: AssetsPage,
  settings: SettingsPage,
  admin: AdminPage,
}

export default function App() {
  const { activeModule } = useAppStore()
  const ActivePage = pageMap[activeModule] || DashboardPage

  return (
    <AppLayout>
      <ActivePage />
    </AppLayout>
  )
}
