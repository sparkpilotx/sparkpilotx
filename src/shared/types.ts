export type Theme = 'light' | 'dark' | 'system'

export interface ThemeInfo {
  themeSource: Theme
  shouldUseDarkColors: boolean
}
