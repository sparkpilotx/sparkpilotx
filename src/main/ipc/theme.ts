import { ipcMain, nativeTheme } from 'electron'
import { IpcEvents } from '@shared/ipc-events'
import { Theme } from '@shared/types'
import { validateSender } from './utils'

export function registerThemeHandler(): void {
  ipcMain.on(IpcEvents.SetTheme, (event, theme: Theme) => {
    if (!event.senderFrame || !validateSender(event.senderFrame)) {
      const senderUrl = event.senderFrame?.url || 'unknown'
      console.warn(`Blocked '${IpcEvents.SetTheme}' from un-trusted source: ${senderUrl}`)
      return
    }
    nativeTheme.themeSource = theme
  })
} 