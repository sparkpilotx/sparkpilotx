import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { IpcEvents } from '../shared/ipc-events'

const customApi = {
  // Settings API
  onOpenSettings: (callback: () => void) => {
    ipcRenderer.on(IpcEvents.OPEN_SETTINGS, callback)
    return () => ipcRenderer.removeListener(IpcEvents.OPEN_SETTINGS, callback)
  },
  
  // Version API
  getVersions: () => ({
    electron: process.versions.electron,
    node: process.versions.node,
    chrome: process.versions.chrome
  })
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
