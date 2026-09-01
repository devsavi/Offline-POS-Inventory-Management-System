import { getDatabase } from '../database.js'

export interface User {
  id: number
  name: string
  phone: string
  email: string
  role: 'admin' | 'manager' | 'cashier'
}

export type UserInput = Omit<User, 'id'>

// ── Create ────────────────────────────────────────────────────
export function createUser(data: UserInput): User {
  const db = getDatabase()
  const stmt = db.prepare(`
    INSERT INTO users (name, phone, email, role)
    VALUES (@name, @phone, @email, @role)
  `)
  const result = stmt.run(data)
  return getUserById(result.lastInsertRowid as number)!
}

// ── Read All ──────────────────────────────────────────────────
export function getAllUsers(): User[] {
  const db = getDatabase()
  return db.prepare('SELECT * FROM users ORDER BY name ASC').all() as User[]
}

// ── Read One ──────────────────────────────────────────────────
export function getUserById(id: number): User | undefined {
  const db = getDatabase()
  return db.prepare('SELECT * FROM users WHERE id = ?').get(id) as User | undefined
}

// ── Update ────────────────────────────────────────────────────
export function updateUser(id: number, data: Partial<UserInput>): User | undefined {
  const db = getDatabase()
  const current = getUserById(id)
  if (!current) return undefined

  const merged = { ...current, ...data }
  db.prepare(`
    UPDATE users
    SET name = @name, phone = @phone, email = @email, role = @role
    WHERE id = @id
  `).run({ ...merged, id })

  return getUserById(id)
}

// ── Delete ────────────────────────────────────────────────────
export function deleteUser(id: number): boolean {
  const db = getDatabase()
  const result = db.prepare('DELETE FROM users WHERE id = ?').run(id)
  return result.changes > 0
}

// ── Aggregate: sales count per cashier (for Reports) ─────────
export function getUserSalesSummary(): { user_id: number; name: string; sale_count: number; total_revenue: number }[] {
  const db = getDatabase()
  return db.prepare(`
    SELECT u.id as user_id, u.name, COUNT(s.id) as sale_count, COALESCE(SUM(s.total), 0) as total_revenue
    FROM users u
    LEFT JOIN sales s ON s.cashier_user_id = u.id
    GROUP BY u.id
    ORDER BY total_revenue DESC
  `).all() as { user_id: number; name: string; sale_count: number; total_revenue: number }[]
}
