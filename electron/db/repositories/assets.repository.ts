import { getDatabase } from '../database.js'

export interface Asset {
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

export type AssetInput = Omit<Asset, 'id'>

// ── Create ────────────────────────────────────────────────────
export function createAsset(data: AssetInput): Asset {
  const db = getDatabase()
  const result = db.prepare(`
    INSERT INTO assets
      (name, category, brand, quantity, condition, status, purchase_price,
       purchase_date, warranty_expiry, issued_by, issue_date, issued_to)
    VALUES
      (@name, @category, @brand, @quantity, @condition, @status, @purchase_price,
       @purchase_date, @warranty_expiry, @issued_by, @issue_date, @issued_to)
  `).run(data)
  return getAssetById(result.lastInsertRowid as number)!
}

// ── Read All ──────────────────────────────────────────────────
export function getAllAssets(): Asset[] {
  const db = getDatabase()
  return db.prepare('SELECT * FROM assets ORDER BY name ASC').all() as Asset[]
}

// ── Read One ──────────────────────────────────────────────────
export function getAssetById(id: number): Asset | undefined {
  const db = getDatabase()
  return db.prepare('SELECT * FROM assets WHERE id = ?').get(id) as Asset | undefined
}

// ── Update ────────────────────────────────────────────────────
export function updateAsset(id: number, data: Partial<AssetInput>): Asset | undefined {
  const db = getDatabase()
  const current = getAssetById(id)
  if (!current) return undefined

  const merged = { ...current, ...data }
  db.prepare(`
    UPDATE assets
    SET name = @name, category = @category, brand = @brand, quantity = @quantity,
        condition = @condition, status = @status, purchase_price = @purchase_price,
        purchase_date = @purchase_date, warranty_expiry = @warranty_expiry,
        issued_by = @issued_by, issue_date = @issue_date, issued_to = @issued_to
    WHERE id = @id
  `).run({ ...merged, id })

  return getAssetById(id)
}

// ── Delete ────────────────────────────────────────────────────
export function deleteAsset(id: number): boolean {
  const db = getDatabase()
  const result = db.prepare('DELETE FROM assets WHERE id = ?').run(id)
  return result.changes > 0
}

// ── Aggregate: assets expiring warranty soon ──────────────────
export function getWarrantyExpiringSoon(withinDays: number = 30): Asset[] {
  const db = getDatabase()
  return db.prepare(`
    SELECT * FROM assets
    WHERE warranty_expiry != ''
      AND date(warranty_expiry) BETWEEN date('now') AND date('now', ? || ' days')
    ORDER BY warranty_expiry ASC
  `).all(`+${withinDays}`) as Asset[]
}

// ── Aggregate: assets by status ───────────────────────────────
export function getAssetsByStatus(status: Asset['status']): Asset[] {
  const db = getDatabase()
  return db.prepare('SELECT * FROM assets WHERE status = ? ORDER BY name ASC').all(status) as Asset[]
}
