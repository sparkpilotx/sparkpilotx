import { app, shell, BrowserWindow, ipcMain, nativeTheme, WebFrameMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { IPC_EVENTS } from '@shared/ipc-events'
import { Theme } from '@shared/types'

const RENDERER_URL = process.env['ELECTRON_RENDERER_URL']

const validateSender = (frame: WebFrameMain): boolean => {
  if (!RENDERER_URL) {
    // In production, only 'file://' protocol is allowed
    return frame.url.startsWith('file://')
  }

  // In development, the origin of the sender's URL must match the dev server's URL
  try {
    const frameUrl = new URL(frame.url)
    const rendererUrl = new URL(RENDERER_URL)
    return frameUrl.origin === rendererUrl.origin
  } catch (e) {
    console.error('Failed to parse sender URL:', e)
    return false
  }
}

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && RENDERER_URL) {
    mainWindow.loadURL(RENDERER_URL)
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  // Set theme based on renderer's choice
  ipcMain.handle(IPC_EVENTS.THEME_SET, (event, theme: Theme) => {
    if (!event.senderFrame || !validateSender(event.senderFrame)) {
      const senderUrl = event.senderFrame?.url || 'unknown'
      console.warn(`Blocked '${IPC_EVENTS.THEME_SET}' from un-trusted source: ${senderUrl}`)
      return
    }
    nativeTheme.themeSource = theme
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('io.ai-copilots.sparkpilotx')

  console.log(import.meta.env.MAIN_VITE_APP_NAME)
  console.log(import.meta.env.VITE_API_VERSION)

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on(IPC_EVENTS.PING, () => console.log('pong'))

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
