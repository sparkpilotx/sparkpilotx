import { IpcRenderer } from 'electron'
import { ElectronAPI } from '@electron-toolkit/preload'
import { Theme } from '@shared/types'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      setTheme: (theme: Theme) => Promise<void>
    }
  }
}
