import { ipcMain } from 'electron'
import * as SalesRepo from '../db/repositories/sales.repository.js'

export function registerBillingHandlers(): void {
  // ── billing:createSale ─────────────────────────────────────
  ipcMain.handle('billing:createSale', (_e, data: SalesRepo.CreateSaleInput) => {
    return SalesRepo.createSale(data)
  })

  // ── billing:getAllSales ────────────────────────────────────
  ipcMain.handle('billing:getAllSales', () => {
    return SalesRepo.getAllSales()
  })

  // ── billing:getSaleById ────────────────────────────────────
  ipcMain.handle('billing:getSaleById', (_e, id: number) => {
    return SalesRepo.getSaleById(id)
  })

  // ── billing:updateSale ─────────────────────────────────────
  ipcMain.handle(
    'billing:updateSale',
    (_e, id: number, data: Parameters<typeof SalesRepo.updateSale>[1]) => {
      return SalesRepo.updateSale(id, data)
    }
  )

  // ── billing:deleteSale ─────────────────────────────────────
  ipcMain.handle('billing:deleteSale', (_e, id: number) => {
    return SalesRepo.deleteSale(id)
  })

  // ── billing:getDailyRevenue ────────────────────────────────
  ipcMain.handle('billing:getDailyRevenue', (_e, days?: number) => {
    return SalesRepo.getDailyRevenue(days)
  })

  // ── billing:getTopProducts ─────────────────────────────────
  ipcMain.handle('billing:getTopProducts', (_e, limit?: number) => {
    return SalesRepo.getTopProducts(limit)
  })

  // ── billing:getRevenueInRange ──────────────────────────────
  ipcMain.handle('billing:getRevenueInRange', (_e, from: string, to: string) => {
    return SalesRepo.getRevenueInRange(from, to)
  })
}
