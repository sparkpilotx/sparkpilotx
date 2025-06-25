import { ElectronAPI } from '@electron-toolkit/preload'
import { Theme } from '@shared/types'

declare global {
  interface Window {
    api: ElectronAPI & {
      setNativeTheme: (theme: Theme) => void
    }
  }
}
