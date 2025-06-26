import { ipcMain, nativeTheme, BrowserWindow } from 'electron'
import { IpcEvents } from '@shared/ipc-events'
import { Theme } from '@shared/types'
import { validateSender } from './utils'

export function registerThemeHandler(): void {
  // Handle theme setting from renderer
  ipcMain.on(IpcEvents.SetTheme, (event, theme: Theme) => {
    if (!event.senderFrame || !validateSender(event.senderFrame)) {
      const senderUrl = event.senderFrame?.url || 'unknown'
      console.warn(`Blocked '${IpcEvents.SetTheme}' from un-trusted source: ${senderUrl}`)
      return
    }
    nativeTheme.themeSource = theme
  })

  // Handle theme query from renderer
  ipcMain.handle(IpcEvents.GetTheme, (event) => {
    if (!event.senderFrame || !validateSender(event.senderFrame)) {
      const senderUrl = event.senderFrame?.url || 'unknown'
      console.warn(`Blocked '${IpcEvents.GetTheme}' from un-trusted source: ${senderUrl}`)
      return { themeSource: 'system', shouldUseDarkColors: false }
    }
    
    return {
      themeSource: nativeTheme.themeSource,
      shouldUseDarkColors: nativeTheme.shouldUseDarkColors
    }
  })

  // Listen for native theme changes and notify all renderer processes
  nativeTheme.on('updated', () => {
    const themeInfo = {
      themeSource: nativeTheme.themeSource,
      shouldUseDarkColors: nativeTheme.shouldUseDarkColors
    }

    // Notify all browser windows about the theme change
    BrowserWindow.getAllWindows().forEach(window => {
      if (!window.isDestroyed()) {
        window.webContents.send(IpcEvents.ThemeUpdated, themeInfo)
      }
    })
  })
} 