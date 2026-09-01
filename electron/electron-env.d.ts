/// <reference types="vite-plugin-electron/electron-env" />

declare namespace NodeJS {
  interface ProcessEnv {
    /**
     * The built directory structure
     *
     * ```tree
     * ├─┬─┬ dist
     * │ │ └── index.html
     * │ │
     * │ ├─┬ dist-electron
     * │ │ ├── main.js
     * │ │ └── preload.js
     * │
     * ```
     */
    APP_ROOT: string
    /** /dist/ or /public/ */
    VITE_PUBLIC: string
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// window.api — typed surface exposed by preload.ts via contextBridge
// Import these types into renderer components as needed.
// ─────────────────────────────────────────────────────────────────────────────

interface Product {
  id: number
  name: string
  category: string
  price: number
  quantity: number
  min_stock: number
  barcode: string | null
  description: string
  updated_at: string
}

interface Customer {
  id: number
  name: string
  phone: string
  email: string
  address: string
  notes: string
}

interface User {
  id: number
  name: string
  phone: string
  email: string
  role: 'admin' | 'manager' | 'cashier'
}

interface Sale {
  id: number
  timestamp: string
  cashier_user_id: number
  customer_id: number | null
  total: number
  mode: 'single' | 'dual'
}

interface SaleItem {
  id: number
  sale_id: number
  product_id: number
  qty: number
  unit_price: number
}

interface SaleWithItems extends Sale {
  items: SaleItem[]
}

interface Asset {
  id: number
  name: string
  category: string
  brand: string
  quantity: number
  condition: 'good' | 'fair' | 'poor'
  status: 'active' | 'disposed' | 'maintenance'
  purchase_price: number
  purchase_date: string
  warranty_expiry: string
  issued_by: string
  issue_date: string
  issued_to: string
}

interface Settings {
  id: 1
  shop_name: string
  shop_email: string
  registration_number: string
  currency: string
  logo_path: string
  bill_logo_path: string
  admin_password_hash: string
}

interface CreateSaleInput {
  cashier_user_id: number
  customer_id?: number | null
  total: number
  mode?: 'single' | 'dual'
  items: Array<{ product_id: number; qty: number; unit_price: number }>
}

interface Window {
  /** Raw IPC shim — prefer window.api for typed access */
  ipcRenderer: import('electron').IpcRenderer

  /** Typed namespaced API — all DB access goes through here */
  api: {
    products: {
      getAll():                                     Promise<Product[]>
      getById(id: number):                          Promise<Product | undefined>
      getByBarcode(barcode: string):                Promise<Product | undefined>
      search(query: string):                        Promise<Product[]>
      create(data: Omit<Product, 'id' | 'updated_at'>): Promise<Product>
      update(id: number, data: Partial<Omit<Product, 'id' | 'updated_at'>>): Promise<Product | undefined>
      delete(id: number):                           Promise<boolean>
      getLowStock():                                Promise<Product[]>
      countByCategory():                            Promise<{ category: string; count: number }[]>
    }
    billing: {
      createSale(data: CreateSaleInput):            Promise<SaleWithItems>
      getAllSales():                                 Promise<Sale[]>
      getSaleById(id: number):                      Promise<SaleWithItems | undefined>
      updateSale(id: number, data: Partial<Pick<Sale, 'customer_id' | 'total' | 'mode'>>): Promise<Sale | undefined>
      deleteSale(id: number):                       Promise<boolean>
      getDailyRevenue(days?: number):               Promise<{ date: string; revenue: number; count: number }[]>
      getTopProducts(limit?: number):               Promise<{ product_id: number; name: string; total_qty: number; total_revenue: number }[]>
      getRevenueInRange(from: string, to: string):  Promise<{ total_revenue: number; sale_count: number }>
    }
    customers: {
      getAll():                                     Promise<Customer[]>
      getById(id: number):                          Promise<Customer | undefined>
      search(query: string):                        Promise<Customer[]>
      create(data: Omit<Customer, 'id'>):           Promise<Customer>
      update(id: number, data: Partial<Omit<Customer, 'id'>>): Promise<Customer | undefined>
      delete(id: number):                           Promise<boolean>
      purchaseHistory(customerId: number):          Promise<{ sale_id: number; timestamp: string; total: number }[]>
    }
    users: {
      getAll():                                     Promise<User[]>
      getById(id: number):                          Promise<User | undefined>
      create(data: Omit<User, 'id'>):               Promise<User>
      update(id: number, data: Partial<Omit<User, 'id'>>): Promise<User | undefined>
      delete(id: number):                           Promise<boolean>
      salesSummary():                               Promise<{ user_id: number; name: string; sale_count: number; total_revenue: number }[]>
    }
    assets: {
      getAll():                                     Promise<Asset[]>
      getById(id: number):                          Promise<Asset | undefined>
      create(data: Omit<Asset, 'id'>):              Promise<Asset>
      update(id: number, data: Partial<Omit<Asset, 'id'>>): Promise<Asset | undefined>
      delete(id: number):                           Promise<boolean>
      getWarrantyExpiringSoon(withinDays?: number): Promise<Asset[]>
      getByStatus(status: Asset['status']):         Promise<Asset[]>
    }
    settings: {
      get():                                        Promise<Settings>
      update(data: Partial<Omit<Settings, 'id'>>):  Promise<Settings>
      setAdminPasswordHash(hash: string):           Promise<boolean>
    }
  }
}
