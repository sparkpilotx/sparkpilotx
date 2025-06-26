import { ipcMain, nativeTheme, BrowserWindow } from 'electron'
import { IpcEvents } from '@shared/ipc-events'
import { Theme } from '@shared/types'
import { validateSender } from './utils'

// Store cleanup functions for proper unregistration
let themeHandlerCleanup: (() => void) | null = null

export function registerThemeHandler(): () => void {
  // Clean up existing handlers if any
  if (themeHandlerCleanup) {
    themeHandlerCleanup()
  }

  // Handle theme setting from renderer
  const setThemeHandler = (event: Electron.IpcMainEvent, theme: Theme) => {
    if (!event.senderFrame || !validateSender(event.senderFrame)) {
      const senderUrl = event.senderFrame?.url || 'unknown'
      console.warn(`Blocked '${IpcEvents.SetTheme}' from un-trusted source: ${senderUrl}`)
      return
    }
    nativeTheme.themeSource = theme
  }

  // Handle theme query from renderer
  const getThemeHandler = (event: Electron.IpcMainInvokeEvent) => {
    if (!event.senderFrame || !validateSender(event.senderFrame)) {
      const senderUrl = event.senderFrame?.url || 'unknown'
      console.warn(`Blocked '${IpcEvents.GetTheme}' from un-trusted source: ${senderUrl}`)
      return { themeSource: 'system', shouldUseDarkColors: false }
    }
    
    return {
      themeSource: nativeTheme.themeSource,
      shouldUseDarkColors: nativeTheme.shouldUseDarkColors
    }
  }

  // Listen for native theme changes and notify all renderer processes
  const nativeThemeUpdateHandler = () => {
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
  }

  // Register all handlers
  ipcMain.on(IpcEvents.SetTheme, setThemeHandler)
  ipcMain.handle(IpcEvents.GetTheme, getThemeHandler)
  nativeTheme.on('updated', nativeThemeUpdateHandler)

  // Create cleanup function
  const cleanup = () => {
    ipcMain.removeListener(IpcEvents.SetTheme, setThemeHandler)
    ipcMain.removeHandler(IpcEvents.GetTheme)
    nativeTheme.removeListener('updated', nativeThemeUpdateHandler)
    themeHandlerCleanup = null
  }

  // Store cleanup function for potential re-registration
  themeHandlerCleanup = cleanup

  return cleanup
} 