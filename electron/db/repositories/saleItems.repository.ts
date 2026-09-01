import { getDatabase } from '../database.js'

export interface SaleItem {
  id: number
  sale_id: number
  product_id: number
  qty: number
  unit_price: number
}

export type SaleItemInput = Omit<SaleItem, 'id'>

// ── Create ────────────────────────────────────────────────────
export function createSaleItem(data: SaleItemInput): SaleItem {
  const db = getDatabase()
  const result = db.prepare(`
    INSERT INTO sale_items (sale_id, product_id, qty, unit_price)
    VALUES (@sale_id, @product_id, @qty, @unit_price)
  `).run(data)
  return getSaleItemById(result.lastInsertRowid as number)!
}

// ── Read All ──────────────────────────────────────────────────
export function getAllSaleItems(): SaleItem[] {
  const db = getDatabase()
  return db.prepare('SELECT * FROM sale_items').all() as SaleItem[]
}

// ── Read One ──────────────────────────────────────────────────
export function getSaleItemById(id: number): SaleItem | undefined {
  const db = getDatabase()
  return db.prepare('SELECT * FROM sale_items WHERE id = ?').get(id) as SaleItem | undefined
}

// ── Read by Sale ──────────────────────────────────────────────
export function getSaleItemsBySaleId(saleId: number): SaleItem[] {
  const db = getDatabase()
  return db.prepare('SELECT * FROM sale_items WHERE sale_id = ?').all(saleId) as SaleItem[]
}

// ── Update ────────────────────────────────────────────────────
export function updateSaleItem(id: number, data: Partial<SaleItemInput>): SaleItem | undefined {
  const db = getDatabase()
  const current = getSaleItemById(id)
  if (!current) return undefined

  const merged = { ...current, ...data }
  db.prepare(`
    UPDATE sale_items
    SET sale_id = @sale_id, product_id = @product_id, qty = @qty, unit_price = @unit_price
    WHERE id = @id
  `).run({ ...merged, id })

  return getSaleItemById(id)
}

// ── Delete ────────────────────────────────────────────────────
export function deleteSaleItem(id: number): boolean {
  const db = getDatabase()
  const result = db.prepare('DELETE FROM sale_items WHERE id = ?').run(id)
  return result.changes > 0
}
