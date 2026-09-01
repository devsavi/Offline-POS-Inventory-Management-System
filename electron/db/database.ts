import Database from 'better-sqlite3'
import path from 'node:path'
import fs from 'node:fs'
import { app } from 'electron'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

let db: Database.Database | null = null

/**
 * Returns the singleton better-sqlite3 connection.
 * On first call, opens the DB in Electron's userData directory
 * and runs schema.sql (idempotent — all statements use CREATE IF NOT EXISTS).
 */
export function getDatabase(): Database.Database {
  if (db) return db

  const userDataPath = app.getPath('userData')
  const dbPath = path.join(userDataPath, 'offline-pos.db')

  db = new Database(dbPath)

  // Performance pragmas
  db.pragma('journal_mode = WAL')
  db.pragma('foreign_keys = ON')

  // Run schema migration (idempotent)
  const schemaPath = path.join(__dirname, 'schema.sql')
  const schema = fs.readFileSync(schemaPath, 'utf-8')
  db.exec(schema)

  return db
}

/** Gracefully closes the DB connection (call on app 'before-quit'). */
export function closeDatabase(): void {
  if (db) {
    db.close()
    db = null
  }
}
