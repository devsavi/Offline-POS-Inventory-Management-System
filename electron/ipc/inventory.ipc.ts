import { ipcMain } from 'electron'
import * as ProductsRepo from '../db/repositories/products.repository.js'

export function registerInventoryHandlers(): void {
  // ── products:getAll ────────────────────────────────────────
  ipcMain.handle('products:getAll', () => {
    return ProductsRepo.getAllProducts()
  })

  // ── products:getById ───────────────────────────────────────
  ipcMain.handle('products:getById', (_e, id: number) => {
    return ProductsRepo.getProductById(id)
  })

  // ── products:getByBarcode ──────────────────────────────────
  ipcMain.handle('products:getByBarcode', (_e, barcode: string) => {
    return ProductsRepo.getProductByBarcode(barcode)
  })

  // ── products:search ────────────────────────────────────────
  ipcMain.handle('products:search', (_e, query: string) => {
    return ProductsRepo.searchProducts(query)
  })

  // ── products:create ────────────────────────────────────────
  ipcMain.handle('products:create', (_e, data: ProductsRepo.ProductInput) => {
    return ProductsRepo.createProduct(data)
  })

  // ── products:update ────────────────────────────────────────
  ipcMain.handle('products:update', (_e, id: number, data: Partial<ProductsRepo.ProductInput>) => {
    return ProductsRepo.updateProduct(id, data)
  })

  // ── products:delete ────────────────────────────────────────
  ipcMain.handle('products:delete', (_e, id: number) => {
    return ProductsRepo.deleteProduct(id)
  })

  // ── products:getLowStock ───────────────────────────────────
  ipcMain.handle('products:getLowStock', () => {
    return ProductsRepo.getLowStockProducts()
  })

  // ── products:countByCategory ───────────────────────────────
  ipcMain.handle('products:countByCategory', () => {
    return ProductsRepo.getProductCountByCategory()
  })
}
