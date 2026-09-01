import { ipcMain } from 'electron'
import * as CustomersRepo from '../db/repositories/customers.repository.js'

export function registerCustomersHandlers(): void {
  // ── customers:getAll ───────────────────────────────────────
  ipcMain.handle('customers:getAll', () => {
    return CustomersRepo.getAllCustomers()
  })

  // ── customers:getById ──────────────────────────────────────
  ipcMain.handle('customers:getById', (_e, id: number) => {
    return CustomersRepo.getCustomerById(id)
  })

  // ── customers:search ───────────────────────────────────────
  ipcMain.handle('customers:search', (_e, query: string) => {
    return CustomersRepo.searchCustomers(query)
  })

  // ── customers:create ───────────────────────────────────────
  ipcMain.handle('customers:create', (_e, data: CustomersRepo.CustomerInput) => {
    return CustomersRepo.createCustomer(data)
  })

  // ── customers:update ───────────────────────────────────────
  ipcMain.handle(
    'customers:update',
    (_e, id: number, data: Partial<CustomersRepo.CustomerInput>) => {
      return CustomersRepo.updateCustomer(id, data)
    }
  )

  // ── customers:delete ───────────────────────────────────────
  ipcMain.handle('customers:delete', (_e, id: number) => {
    return CustomersRepo.deleteCustomer(id)
  })

  // ── customers:purchaseHistory ──────────────────────────────
  ipcMain.handle('customers:purchaseHistory', (_e, customerId: number) => {
    return CustomersRepo.getCustomerPurchaseHistory(customerId)
  })
}
