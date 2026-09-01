import { ipcRenderer, contextBridge } from 'electron'

// ─────────────────────────────────────────────────────────────────────────────
// Typed API surface exposed to the renderer via window.api
// The renderer must NEVER import better-sqlite3 or call ipcRenderer directly.
// ─────────────────────────────────────────────────────────────────────────────

contextBridge.exposeInMainWorld('api', {

  // ── Products (Inventory) ───────────────────────────────────────────────────
  products: {
    getAll:           ()                            => ipcRenderer.invoke('products:getAll'),
    getById:          (id: number)                  => ipcRenderer.invoke('products:getById', id),
    getByBarcode:     (barcode: string)             => ipcRenderer.invoke('products:getByBarcode', barcode),
    search:           (query: string)               => ipcRenderer.invoke('products:search', query),
    create:           (data: unknown)               => ipcRenderer.invoke('products:create', data),
    update:           (id: number, data: unknown)   => ipcRenderer.invoke('products:update', id, data),
    delete:           (id: number)                  => ipcRenderer.invoke('products:delete', id),
    getLowStock:      ()                            => ipcRenderer.invoke('products:getLowStock'),
    countByCategory:  ()                            => ipcRenderer.invoke('products:countByCategory'),
  },

  // ── Sales (Billing / POS) ──────────────────────────────────────────────────
  billing: {
    createSale:         (data: unknown)               => ipcRenderer.invoke('billing:createSale', data),
    getAllSales:         ()                            => ipcRenderer.invoke('billing:getAllSales'),
    getSaleById:        (id: number)                  => ipcRenderer.invoke('billing:getSaleById', id),
    updateSale:         (id: number, data: unknown)   => ipcRenderer.invoke('billing:updateSale', id, data),
    deleteSale:         (id: number)                  => ipcRenderer.invoke('billing:deleteSale', id),
    getDailyRevenue:    (days?: number)               => ipcRenderer.invoke('billing:getDailyRevenue', days),
    getTopProducts:     (limit?: number)              => ipcRenderer.invoke('billing:getTopProducts', limit),
    getRevenueInRange:  (from: string, to: string)    => ipcRenderer.invoke('billing:getRevenueInRange', from, to),
  },

  // ── Customers ─────────────────────────────────────────────────────────────
  customers: {
    getAll:           ()                            => ipcRenderer.invoke('customers:getAll'),
    getById:          (id: number)                  => ipcRenderer.invoke('customers:getById', id),
    search:           (query: string)               => ipcRenderer.invoke('customers:search', query),
    create:           (data: unknown)               => ipcRenderer.invoke('customers:create', data),
    update:           (id: number, data: unknown)   => ipcRenderer.invoke('customers:update', id, data),
    delete:           (id: number)                  => ipcRenderer.invoke('customers:delete', id),
    purchaseHistory:  (customerId: number)          => ipcRenderer.invoke('customers:purchaseHistory', customerId),
  },

  // ── Users / Staff ─────────────────────────────────────────────────────────
  users: {
    getAll:         ()                            => ipcRenderer.invoke('users:getAll'),
    getById:        (id: number)                  => ipcRenderer.invoke('users:getById', id),
    create:         (data: unknown)               => ipcRenderer.invoke('users:create', data),
    update:         (id: number, data: unknown)   => ipcRenderer.invoke('users:update', id, data),
    delete:         (id: number)                  => ipcRenderer.invoke('users:delete', id),
    salesSummary:   ()                            => ipcRenderer.invoke('users:salesSummary'),
  },

  // ── Assets ────────────────────────────────────────────────────────────────
  assets: {
    getAll:                   ()                            => ipcRenderer.invoke('assets:getAll'),
    getById:                  (id: number)                  => ipcRenderer.invoke('assets:getById', id),
    create:                   (data: unknown)               => ipcRenderer.invoke('assets:create', data),
    update:                   (id: number, data: unknown)   => ipcRenderer.invoke('assets:update', id, data),
    delete:                   (id: number)                  => ipcRenderer.invoke('assets:delete', id),
    getWarrantyExpiringSoon:  (withinDays?: number)         => ipcRenderer.invoke('assets:getWarrantyExpiringSoon', withinDays),
    getByStatus:              (status: string)              => ipcRenderer.invoke('assets:getByStatus', status),
  },

  // ── Settings ──────────────────────────────────────────────────────────────
  settings: {
    get:                    ()                    => ipcRenderer.invoke('settings:get'),
    update:                 (data: unknown)       => ipcRenderer.invoke('settings:update', data),
    setAdminPasswordHash:   (hash: string)        => ipcRenderer.invoke('settings:setAdminPasswordHash', hash),
  },

})

// Keep the legacy raw ipcRenderer shim for any existing code that uses it
contextBridge.exposeInMainWorld('ipcRenderer', {
  on(...args: Parameters<typeof ipcRenderer.on>) {
    const [channel, listener] = args
    return ipcRenderer.on(channel, (event, ...args) => listener(event, ...args))
  },
  off(...args: Parameters<typeof ipcRenderer.off>) {
    const [channel, ...omit] = args
    return ipcRenderer.off(channel, ...omit)
  },
  send(...args: Parameters<typeof ipcRenderer.send>) {
    const [channel, ...omit] = args
    return ipcRenderer.send(channel, ...omit)
  },
  invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
    const [channel, ...omit] = args
    return ipcRenderer.invoke(channel, ...omit)
  },
})
