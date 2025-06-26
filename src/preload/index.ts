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
  getVersions: () => {
    // Helper function to get package version
    const getPackageVersion = (packageName: string): string => {
      try {
        // Try different path approaches
        let packageJson
        try {
          packageJson = require(`../../node_modules/${packageName}/package.json`)
        } catch {
          try {
            packageJson = require(`../../../node_modules/${packageName}/package.json`)
          } catch {
            try {
              packageJson = require(`${packageName}/package.json`)
            } catch {
              return 'N/A'
            }
          }
        }
        return packageJson.version
      } catch {
        return 'N/A'
      }
    }

    return {
      electron: process.versions.electron,
      node: process.versions.node,
      chrome: process.versions.chrome,
      openai: getPackageVersion('openai'),
      anthropic: getPackageVersion('@anthropic-ai/sdk'),
      genai: getPackageVersion('@google/genai')
    }
  }
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
