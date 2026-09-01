import { getDatabase } from '../database.js'

export interface Customer {
  id: number
  name: string
  phone: string
  email: string
  address: string
  notes: string
}

export type CustomerInput = Omit<Customer, 'id'>

// ── Create ────────────────────────────────────────────────────
export function createCustomer(data: CustomerInput): Customer {
  const db = getDatabase()
  const stmt = db.prepare(`
    INSERT INTO customers (name, phone, email, address, notes)
    VALUES (@name, @phone, @email, @address, @notes)
  `)
  const result = stmt.run(data)
  return getCustomerById(result.lastInsertRowid as number)!
}

// ── Read All ──────────────────────────────────────────────────
export function getAllCustomers(): Customer[] {
  const db = getDatabase()
  return db.prepare('SELECT * FROM customers ORDER BY name ASC').all() as Customer[]
}

// ── Read One ──────────────────────────────────────────────────
export function getCustomerById(id: number): Customer | undefined {
  const db = getDatabase()
  return db.prepare('SELECT * FROM customers WHERE id = ?').get(id) as Customer | undefined
}

// ── Update ────────────────────────────────────────────────────
export function updateCustomer(id: number, data: Partial<CustomerInput>): Customer | undefined {
  const db = getDatabase()
  const current = getCustomerById(id)
  if (!current) return undefined

  const merged = { ...current, ...data }
  db.prepare(`
    UPDATE customers
    SET name = @name, phone = @phone, email = @email, address = @address, notes = @notes
    WHERE id = @id
  `).run({ ...merged, id })

  return getCustomerById(id)
}

// ── Delete ────────────────────────────────────────────────────
export function deleteCustomer(id: number): boolean {
  const db = getDatabase()
  const result = db.prepare('DELETE FROM customers WHERE id = ?').run(id)
  return result.changes > 0
}

// ── Search ────────────────────────────────────────────────────
export function searchCustomers(query: string): Customer[] {
  const db = getDatabase()
  const like = `%${query}%`
  return db.prepare(`
    SELECT * FROM customers
    WHERE name LIKE ? OR phone LIKE ? OR email LIKE ?
    ORDER BY name ASC
  `).all(like, like, like) as Customer[]
}

// ── Aggregate: purchase history for a customer (for Reports) ──
export function getCustomerPurchaseHistory(customerId: number): {
  sale_id: number
  timestamp: string
  total: number
}[] {
  const db = getDatabase()
  return db.prepare(`
    SELECT id as sale_id, timestamp, total
    FROM sales
    WHERE customer_id = ?
    ORDER BY timestamp DESC
  `).all(customerId) as { sale_id: number; timestamp: string; total: number }[]
}
