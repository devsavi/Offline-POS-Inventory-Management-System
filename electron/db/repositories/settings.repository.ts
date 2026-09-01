import { getDatabase } from '../database.js'

export interface Settings {
  id: 1
  shop_name: string
  shop_email: string
  registration_number: string
  currency: string
  logo_path: string
  bill_logo_path: string
  admin_password_hash: string
}

export type SettingsInput = Omit<Settings, 'id'>

// ── Read (always returns the single row, seeded by schema.sql) ─
export function getSettings(): Settings {
  const db = getDatabase()
  return db.prepare('SELECT * FROM settings WHERE id = 1').get() as Settings
}

// ── Update (partial — merges with existing values) ────────────
export function updateSettings(data: Partial<SettingsInput>): Settings {
  const db = getDatabase()
  const current = getSettings()
  const merged = { ...current, ...data }

  db.prepare(`
    UPDATE settings
    SET shop_name           = @shop_name,
        shop_email          = @shop_email,
        registration_number = @registration_number,
        currency            = @currency,
        logo_path           = @logo_path,
        bill_logo_path      = @bill_logo_path,
        admin_password_hash = @admin_password_hash
    WHERE id = 1
  `).run(merged)

  return getSettings()
}

// ── No create / delete — single-row pattern enforced by schema ─
// ── Convenience: update only the admin password hash ─────────
export function setAdminPasswordHash(hash: string): void {
  const db = getDatabase()
  db.prepare('UPDATE settings SET admin_password_hash = ? WHERE id = 1').run(hash)
}
