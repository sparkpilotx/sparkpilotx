import { app, Menu, BrowserWindow } from 'electron'
import { IpcEvents } from '@shared/ipc-events'

export function createAppMenu(mainWindow: BrowserWindow): void {
  const isMac = process.platform === 'darwin'

  const template = [
    // { role: 'appMenu' }
    ...(isMac
      ? [{
          label: app.getName(),
          submenu: [
            { role: 'about' },
            { type: 'separator' },
            {
              label: 'Preferences...',
              accelerator: 'Command+,',
              click: () => {
                mainWindow.webContents.send(IpcEvents.OPEN_SETTINGS)
              }
            },
            { type: 'separator' },
            { role: 'services' },
            { type: 'separator' },
            { role: 'hide' },
            { role: 'hideOthers' },
            { role: 'unhide' },
            { type: 'separator' },
            { role: 'quit' }
          ]
        }]
      : []),
    // { role: 'fileMenu' }
    {
      label: 'File',
      submenu: [
        ...(!isMac ? [
          {
            label: 'Settings',
            accelerator: 'Ctrl+,',
            click: () => {
              mainWindow.webContents.send(IpcEvents.OPEN_SETTINGS)
            }
          },
          { type: 'separator' }
        ] : []),
        isMac ? { role: 'close' } : { role: 'quit' }
      ]
    },
    // { role: 'editMenu' }
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        ...(isMac
          ? [
              { role: 'pasteAndMatchStyle' },
              { role: 'delete' },
              { role: 'selectAll' },
              { type: 'separator' },
              {
                label: 'Speech',
                submenu: [
                  { role: 'startSpeaking' },
                  { role: 'stopSpeaking' }
                ]
              }
            ]
          : [
              { role: 'delete' },
              { type: 'separator' },
              { role: 'selectAll' }
            ])
      ]
    },
    // { role: 'viewMenu' }
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    // { role: 'windowMenu' }
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        { role: 'zoom' },
        ...(isMac
          ? [
              { type: 'separator' },
              { role: 'front' },
              { type: 'separator' },
              { role: 'window' }
            ]
          : [
              { role: 'close' }
            ])
      ]
    }
  ]

  // @ts-ignore - Following Electron official documentation pattern
  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
} 