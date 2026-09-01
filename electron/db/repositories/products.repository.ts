import { getDatabase } from '../database.js'

export interface Product {
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

export type ProductInput = Omit<Product, 'id' | 'updated_at'>

// ── Create ────────────────────────────────────────────────────
export function createProduct(data: ProductInput): Product {
  const db = getDatabase()
  const stmt = db.prepare(`
    INSERT INTO products (name, category, price, quantity, min_stock, barcode, description)
    VALUES (@name, @category, @price, @quantity, @min_stock, @barcode, @description)
  `)
  const result = stmt.run(data)
  return getProductById(result.lastInsertRowid as number)!
}

// ── Read All ──────────────────────────────────────────────────
export function getAllProducts(): Product[] {
  const db = getDatabase()
  return db.prepare('SELECT * FROM products ORDER BY name ASC').all() as Product[]
}

// ── Read One ──────────────────────────────────────────────────
export function getProductById(id: number): Product | undefined {
  const db = getDatabase()
  return db.prepare('SELECT * FROM products WHERE id = ?').get(id) as Product | undefined
}

export function getProductByBarcode(barcode: string): Product | undefined {
  const db = getDatabase()
  return db.prepare('SELECT * FROM products WHERE barcode = ?').get(barcode) as Product | undefined
}

// ── Update ────────────────────────────────────────────────────
export function updateProduct(id: number, data: Partial<ProductInput>): Product | undefined {
  const db = getDatabase()
  const current = getProductById(id)
  if (!current) return undefined

  const merged = { ...current, ...data }
  db.prepare(`
    UPDATE products
    SET name = @name,
        category = @category,
        price = @price,
        quantity = @quantity,
        min_stock = @min_stock,
        barcode = @barcode,
        description = @description,
        updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
    WHERE id = @id
  `).run({ ...merged, id })

  return getProductById(id)
}

// ── Delete ────────────────────────────────────────────────────
export function deleteProduct(id: number): boolean {
  const db = getDatabase()
  const result = db.prepare('DELETE FROM products WHERE id = ?').run(id)
  return result.changes > 0
}

// ── Aggregate: low-stock items (quantity <= min_stock) ────────
export function getLowStockProducts(): Product[] {
  const db = getDatabase()
  return db.prepare(
    'SELECT * FROM products WHERE quantity <= min_stock ORDER BY quantity ASC'
  ).all() as Product[]
}

// ── Aggregate: category totals for reports ────────────────────
export function getProductCountByCategory(): { category: string; count: number }[] {
  const db = getDatabase()
  return db.prepare(`
    SELECT category, COUNT(*) as count
    FROM products
    GROUP BY category
    ORDER BY count DESC
  `).all() as { category: string; count: number }[]
}

// ── Search ────────────────────────────────────────────────────
export function searchProducts(query: string): Product[] {
  const db = getDatabase()
  const like = `%${query}%`
  return db.prepare(`
    SELECT * FROM products
    WHERE name LIKE ? OR category LIKE ? OR barcode LIKE ?
    ORDER BY name ASC
  `).all(like, like, like) as Product[]
}
