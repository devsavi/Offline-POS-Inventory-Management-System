import { ipcMain } from 'electron'
import * as SettingsRepo from '../db/repositories/settings.repository.js'

export function registerSettingsHandlers(): void {
  // ── settings:get ───────────────────────────────────────────
  ipcMain.handle('settings:get', () => {
    return SettingsRepo.getSettings()
  })

  // ── settings:update ────────────────────────────────────────
  ipcMain.handle(
    'settings:update',
    (_e, data: Partial<SettingsRepo.SettingsInput>) => {
      return SettingsRepo.updateSettings(data)
    }
  )

  // ── settings:setAdminPasswordHash ──────────────────────────
  ipcMain.handle('settings:setAdminPasswordHash', (_e, hash: string) => {
    SettingsRepo.setAdminPasswordHash(hash)
    return true
  })
}
