import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { IPC_EVENTS } from '@shared/ipc-events'
import { Theme } from '@shared/types'

// Custom APIs for renderer
const api = {
  setTheme: (theme: Theme): Promise<void> => ipcRenderer.invoke(IPC_EVENTS.THEME_SET, theme)
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)

    console.log(import.meta.env.PRELOAD_VITE_API_KEY)
    console.log(import.meta.env.VITE_API_VERSION)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
