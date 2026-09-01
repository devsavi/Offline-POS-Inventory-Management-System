import { ipcMain } from 'electron'
import * as AssetsRepo from '../db/repositories/assets.repository.js'

export function registerAssetsHandlers(): void {
  // ── assets:getAll ──────────────────────────────────────────
  ipcMain.handle('assets:getAll', () => {
    return AssetsRepo.getAllAssets()
  })

  // ── assets:getById ─────────────────────────────────────────
  ipcMain.handle('assets:getById', (_e, id: number) => {
    return AssetsRepo.getAssetById(id)
  })

  // ── assets:create ──────────────────────────────────────────
  ipcMain.handle('assets:create', (_e, data: AssetsRepo.AssetInput) => {
    return AssetsRepo.createAsset(data)
  })

  // ── assets:update ──────────────────────────────────────────
  ipcMain.handle(
    'assets:update',
    (_e, id: number, data: Partial<AssetsRepo.AssetInput>) => {
      return AssetsRepo.updateAsset(id, data)
    }
  )

  // ── assets:delete ──────────────────────────────────────────
  ipcMain.handle('assets:delete', (_e, id: number) => {
    return AssetsRepo.deleteAsset(id)
  })

  // ── assets:getWarrantyExpiringSoon ─────────────────────────
  ipcMain.handle('assets:getWarrantyExpiringSoon', (_e, withinDays?: number) => {
    return AssetsRepo.getWarrantyExpiringSoon(withinDays)
  })

  // ── assets:getByStatus ─────────────────────────────────────
  ipcMain.handle('assets:getByStatus', (_e, status: AssetsRepo.Asset['status']) => {
    return AssetsRepo.getAssetsByStatus(status)
  })
}
