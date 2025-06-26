import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

import { Theme, ThemeInfo } from '@shared/types'
import { IpcEvents } from '@shared/ipc-events'

const customApi = {
  setNativeTheme: (theme: Theme): void => electronAPI.ipcRenderer.send(IpcEvents.SetTheme, theme),
  getNativeTheme: (): Promise<ThemeInfo> => electronAPI.ipcRenderer.invoke(IpcEvents.GetTheme),
  onThemeUpdated: (callback: (themeInfo: ThemeInfo) => void): (() => void) => {
    const unsubscribe = electronAPI.ipcRenderer.on(IpcEvents.ThemeUpdated, (_, themeInfo: ThemeInfo) => {
      callback(themeInfo)
    })
    return () => unsubscribe()
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
