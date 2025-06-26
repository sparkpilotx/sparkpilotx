import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    api: ElectronAPI & {
      // Settings API
      onOpenSettings: (callback: () => void) => () => void
      
      // Version API
      getVersions: () => {
        electron: string
        node: string
        chrome: string
      }
    }
  }
}
