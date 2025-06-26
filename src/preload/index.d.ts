import { ElectronAPI } from '@electron-toolkit/preload'

import { ThemeInfo } from '@shared/types'

declare global {
  interface Window {
    api: ElectronAPI & {
      getNativeTheme: () => Promise<ThemeInfo>
      onThemeUpdated: (callback: (themeInfo: ThemeInfo) => void) => () => void
    }
  }
}
