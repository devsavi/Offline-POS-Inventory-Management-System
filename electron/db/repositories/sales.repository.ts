import { getDatabase } from '../database.js'

export interface SaleItem {
  id: number
  sale_id: number
  product_id: number
  qty: number
  unit_price: number
}

export interface Sale {
  id: number
  timestamp: string
  cashier_user_id: number
  customer_id: number | null
  total: number
  mode: 'single' | 'dual'
}

export interface SaleWithItems extends Sale {
  items: SaleItem[]
}

export interface CreateSaleInput {
  cashier_user_id: number
  customer_id?: number | null
  total: number
  mode?: 'single' | 'dual'
  items: Array<{ product_id: number; qty: number; unit_price: number }>
}

// ── Create (transactional — inserts header + all line items) ──
export function createSale(data: CreateSaleInput): SaleWithItems {
  const db = getDatabase()

  const insertSale = db.prepare(`
    INSERT INTO sales (cashier_user_id, customer_id, total, mode)
    VALUES (@cashier_user_id, @customer_id, @total, @mode)
  `)

  const insertItem = db.prepare(`
    INSERT INTO sale_items (sale_id, product_id, qty, unit_price)
    VALUES (@sale_id, @product_id, @qty, @unit_price)
  `)

  // Decrement product stock for each item
  const decrementStock = db.prepare(`
    UPDATE products
    SET quantity = quantity - @qty,
        updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
    WHERE id = @product_id
  `)

  const transaction = db.transaction((input: CreateSaleInput) => {
    const result = insertSale.run({
      cashier_user_id: input.cashier_user_id,
      customer_id: input.customer_id ?? null,
      total: input.total,
      mode: input.mode ?? 'single',
    })
    const saleId = result.lastInsertRowid as number

    for (const item of input.items) {
      insertItem.run({ sale_id: saleId, ...item })
      decrementStock.run({ qty: item.qty, product_id: item.product_id })
    }

    return getSaleById(saleId)!
  })

  return transaction(data)
}

// ── Read All ──────────────────────────────────────────────────
export function getAllSales(): Sale[] {
  const db = getDatabase()
  return db.prepare('SELECT * FROM sales ORDER BY timestamp DESC').all() as Sale[]
}

// ── Read One (with items) ─────────────────────────────────────
export function getSaleById(id: number): SaleWithItems | undefined {
  const db = getDatabase()
  const sale = db.prepare('SELECT * FROM sales WHERE id = ?').get(id) as Sale | undefined
  if (!sale) return undefined

  const items = db.prepare('SELECT * FROM sale_items WHERE sale_id = ?').all(id) as SaleItem[]
  return { ...sale, items }
}

// ── Update ────────────────────────────────────────────────────
export function updateSale(
  id: number,
  data: Partial<Pick<Sale, 'customer_id' | 'total' | 'mode'>>
): Sale | undefined {
  const db = getDatabase()
  const current = db.prepare('SELECT * FROM sales WHERE id = ?').get(id) as Sale | undefined
  if (!current) return undefined

  const merged = { ...current, ...data }
  db.prepare(`
    UPDATE sales
    SET customer_id = @customer_id, total = @total, mode = @mode
    WHERE id = @id
  `).run({ ...merged, id })

  return db.prepare('SELECT * FROM sales WHERE id = ?').get(id) as Sale
}

// ── Delete ────────────────────────────────────────────────────
export function deleteSale(id: number): boolean {
  const db = getDatabase()
  const result = db.prepare('DELETE FROM sales WHERE id = ?').run(id)
  return result.changes > 0
}

// ── Aggregate: daily revenue totals ──────────────────────────
export function getDailyRevenue(days: number = 30): { date: string; revenue: number; count: number }[] {
  const db = getDatabase()
  return db.prepare(`
    SELECT
      strftime('%Y-%m-%d', timestamp) as date,
      SUM(total)    as revenue,
      COUNT(*)      as count
    FROM sales
    WHERE timestamp >= datetime('now', ? || ' days')
    GROUP BY date
    ORDER BY date ASC
  `).all(`-${days}`) as { date: string; revenue: number; count: number }[]
}

// ── Aggregate: top-selling products ──────────────────────────
export function getTopProducts(limit: number = 10): {
  product_id: number
  name: string
  total_qty: number
  total_revenue: number
}[] {
  const db = getDatabase()
  return db.prepare(`
    SELECT
      si.product_id,
      p.name,
      SUM(si.qty)                   as total_qty,
      SUM(si.qty * si.unit_price)   as total_revenue
    FROM sale_items si
    JOIN products p ON p.id = si.product_id
    GROUP BY si.product_id
    ORDER BY total_qty DESC
    LIMIT ?
  `).all(limit) as { product_id: number; name: string; total_qty: number; total_revenue: number }[]
}

// ── Aggregate: revenue in a date range ───────────────────────
export function getRevenueInRange(from: string, to: string): {
  total_revenue: number
  sale_count: number
} {
  const db = getDatabase()
  return db.prepare(`
    SELECT COALESCE(SUM(total), 0) as total_revenue, COUNT(*) as sale_count
    FROM sales
    WHERE timestamp BETWEEN ? AND ?
  `).get(from, to) as { total_revenue: number; sale_count: number }
}
