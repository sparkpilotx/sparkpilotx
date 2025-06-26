import { ElectronAPI } from '@electron-toolkit/preload'

import { Theme, ThemeInfo } from '@shared/types'

declare global {
  interface Window {
    api: ElectronAPI & {
      setNativeTheme: (theme: Theme) => void
      getNativeTheme: () => Promise<ThemeInfo>
      onThemeUpdated: (callback: (themeInfo: ThemeInfo) => void) => () => void
    }
  }
}
