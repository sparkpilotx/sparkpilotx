import { join } from 'path'
import { app, shell, BrowserWindow, nativeTheme } from 'electron'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { initializeGlobalIpcHandlers, cleanupGlobalIpcHandlers } from './ipc'
import { initializeGlobalProxy } from './config/proxy'
import { createAppMenu } from './menu'
import icon from '../../resources/icon.png?asset'

const RENDERER_URL = process.env['ELECTRON_RENDERER_URL']

let mainWindow: BrowserWindow

function createWindow(): void {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1504,
    height: 846,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    titleBarStyle: 'hidden',
    titleBarOverlay: true,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
      nodeIntegrationInWorker: true
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
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
    }
  })

  app.whenReady().then(() => {
    // Initialize global proxy configuration early
    initializeGlobalProxy()

    // Set app user model id for windows
    electronApp.setAppUserModelId('io.ai-copilots.sparkpilotx')

    // Ensure native controls follow system theme
    nativeTheme.themeSource = 'system'

    // Default open or close DevTools by F12 in development
    // and ignore CommandOrControl + R in production.
    // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
    app.on('browser-window-created', (_, window) => {
      optimizer.watchWindowShortcuts(window)
    })

    initializeGlobalIpcHandlers()

    createWindow()
    createAppMenu(mainWindow)

    app.on('activate', function () {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
  })
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// Clean up IPC handlers before the app quits
app.on('before-quit', () => {
  try {
    cleanupGlobalIpcHandlers()
  } catch (error) {
    console.error('Error during IPC cleanup on app quit:', error)
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
