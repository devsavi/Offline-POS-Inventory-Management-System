import { ipcMain } from 'electron'
import * as UsersRepo from '../db/repositories/users.repository.js'

export function registerUsersHandlers(): void {
  // ── users:getAll ───────────────────────────────────────────
  ipcMain.handle('users:getAll', () => {
    return UsersRepo.getAllUsers()
  })

  // ── users:getById ──────────────────────────────────────────
  ipcMain.handle('users:getById', (_e, id: number) => {
    return UsersRepo.getUserById(id)
  })

  // ── users:create ───────────────────────────────────────────
  ipcMain.handle('users:create', (_e, data: UsersRepo.UserInput) => {
    return UsersRepo.createUser(data)
  })

  // ── users:update ───────────────────────────────────────────
  ipcMain.handle(
    'users:update',
    (_e, id: number, data: Partial<UsersRepo.UserInput>) => {
      return UsersRepo.updateUser(id, data)
    }
  )

  // ── users:delete ───────────────────────────────────────────
  ipcMain.handle('users:delete', (_e, id: number) => {
    return UsersRepo.deleteUser(id)
  })

  // ── users:salesSummary ─────────────────────────────────────
  ipcMain.handle('users:salesSummary', () => {
    return UsersRepo.getUserSalesSummary()
  })
}
