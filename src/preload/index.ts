import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

import { Theme } from '@shared/types'
import { IpcEvents } from '@shared/ipc-events'

const customApi = {
  setNativeTheme: (theme: Theme): void => electronAPI.ipcRenderer.send(IpcEvents.SetTheme, theme),
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('api', { ...electronAPI, ...customApi })
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.api = { ...electronAPI, ...customApi }
}
