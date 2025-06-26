import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

const customApi = {
  // Theme-related APIs removed as we now use CSS media queries
  // Add other custom APIs here as needed
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
