import { ipcMain, nativeTheme, BrowserWindow } from 'electron'
import { IpcEvents } from '@shared/ipc-events'
import { validateSender } from './utils'

// Store cleanup functions for proper unregistration
let themeHandlerCleanup: (() => void) | null = null

export function registerThemeHandler(): () => void {
  // Clean up existing handlers if any
  if (themeHandlerCleanup) {
    themeHandlerCleanup()
  }

  // Handle theme query from renderer
  const getThemeHandler = (event: Electron.IpcMainInvokeEvent) => {
    if (!event.senderFrame || !validateSender(event.senderFrame)) {
      const senderUrl = event.senderFrame?.url || 'unknown'
      console.warn(`Blocked '${IpcEvents.GetTheme}' from un-trusted source: ${senderUrl}`)
      return { themeSource: 'system', shouldUseDarkColors: false }
    }
    
    return {
      themeSource: 'system' as const,
      shouldUseDarkColors: nativeTheme.shouldUseDarkColors
    }
  }

  // Listen for native theme changes and notify all renderer processes
  const nativeThemeUpdateHandler = () => {
    const themeInfo = {
      themeSource: 'system' as const,
      shouldUseDarkColors: nativeTheme.shouldUseDarkColors
    }

    // Notify all browser windows about the theme change
    BrowserWindow.getAllWindows().forEach(window => {
      if (!window.isDestroyed()) {
        window.webContents.send(IpcEvents.ThemeUpdated, themeInfo)
      }
    })
  }

  // Ensure theme is always set to system
  nativeTheme.themeSource = 'system'

  // Register handlers (no longer need SetTheme handler)
  ipcMain.handle(IpcEvents.GetTheme, getThemeHandler)
  nativeTheme.on('updated', nativeThemeUpdateHandler)

  // Create cleanup function
  const cleanup = () => {
    ipcMain.removeHandler(IpcEvents.GetTheme)
    nativeTheme.removeListener('updated', nativeThemeUpdateHandler)
    themeHandlerCleanup = null
  }

  // Store cleanup function for potential re-registration
  themeHandlerCleanup = cleanup

  return cleanup
} 